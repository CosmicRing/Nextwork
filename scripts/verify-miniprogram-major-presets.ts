import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type MajorPreset = {
  id: string;
  label: string;
  majorName: string;
  roleHint: string;
  salaryKeyword: string;
};

type RescuePacket = {
  targetMajorName: string;
  copyText: string;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  applyMajorPreset(this: RuntimePage, event: { currentTarget: { dataset: { major: string } } }): void;
  copyRescuePacket(this: RuntimePage): void;
};

function read(relativePath: string) {
  return readFileSync(relativePath, "utf8");
}

function loadSampleData() {
  const sandbox = {
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
  };
  vm.runInNewContext(read("miniprogram/utils/sample-data.js"), sandbox, {
    filename: "miniprogram/utils/sample-data.js",
  });
  return sandbox.module.exports as {
    ordinaryMajorPresets?: MajorPreset[];
  };
}

const sampleData = loadSampleData();
assert.ok(sampleData.ordinaryMajorPresets, "sample data should export ordinaryMajorPresets");
assert.ok(sampleData.ordinaryMajorPresets.length >= 6, "major presets should cover multiple non-CS directions");

for (const preset of sampleData.ordinaryMajorPresets) {
  assert.ok(preset.id && preset.label && preset.majorName, "each major preset should have id, label, and majorName");
  assert.ok(preset.roleHint && preset.salaryKeyword, "each major preset should explain role and salary search intent");
}

for (const expectedMajor of ["护理学", "会计学", "机械设计制造及其自动化", "电子商务", "酒店管理", "计算机应用技术"]) {
  assert.ok(
    sampleData.ordinaryMajorPresets.some((preset) => preset.majorName === expectedMajor),
    `major presets should include ${expectedMajor}`,
  );
}

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of ["ordinaryMajorPresets", "applyMajorPreset", "dataset.major", "majorQuery: majorName"]) {
  assert.ok(pageScript.includes(token), `index page should wire major presets with ${token}`);
}

let capturedPage: IndexPageConfig | undefined;
let clipboardText = "";
vm.runInNewContext(pageScript, {
  require(specifier: string) {
    if (specifier === "../../utils/sample-data") return sampleData;
    throw new Error(`unexpected require: ${specifier}`);
  },
  Page(config: IndexPageConfig) {
    capturedPage = config;
  },
  wx: {
    setClipboardData(options: { data: string; success?: () => void }) {
      clipboardText = options.data;
      options.success?.();
    },
    showToast() {},
  },
}, { filename: "miniprogram/pages/index/index.js" });

assert.ok(capturedPage, "index page should register through Page()");
const runtimePage: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onSchoolInput.call(runtimePage, { detail: { value: "郑州工商学院" } });
capturedPage.applyMajorPreset.call(runtimePage, { currentTarget: { dataset: { major: "护理学" } } });
assert.equal(runtimePage.data.majorQuery, "护理学");
assert.equal(runtimePage.data.targetMajorName, "护理学");
assert.equal((runtimePage.data.activeRescuePacket as RescuePacket).targetMajorName, "护理学");
capturedPage.copyRescuePacket.call(runtimePage);
assert.ok(clipboardText.includes("郑州工商学院"));
assert.ok(clipboardText.includes("护理学"));

const pageMarkup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "ordinaryMajorPresets",
  "major-preset-row",
  "major-preset",
  'data-major="{{item.majorName}}"',
  'bindtap="applyMajorPreset"',
]) {
  assert.ok(pageMarkup.includes(token), `index markup should expose major presets via ${token}`);
}

const pageStyles = read("miniprogram/pages/index/index.wxss");
for (const token of [".major-preset-row", ".major-preset", ".major-preset text:first-child"]) {
  assert.ok(pageStyles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program major presets verified.");
