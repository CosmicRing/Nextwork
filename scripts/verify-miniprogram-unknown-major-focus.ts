import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RescuePacket = {
  targetSchoolName: string;
  targetMajorName: string;
  entryGroups: Array<{ label: string; url: string }>;
  copyText: string;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onMajorInput(this: RuntimePage, event: { detail: { value: string } }): void;
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

  return sandbox.module.exports as Record<string, unknown>;
}

const sampleData = loadSampleData();
const pageScript = read("miniprogram/pages/index/index.js");

for (const token of [
  "majorQuery",
  "targetMajorName",
  "onMajorInput",
  "rebuildActiveRescuePacket",
  "this.data.targetMajorName",
]) {
  assert.ok(pageScript.includes(token), `index page should keep an editable target-major state via ${token}`);
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
capturedPage.onMajorInput.call(runtimePage, { detail: { value: "护理学" } });

assert.equal(runtimePage.data.majorQuery, "护理学");
assert.equal(runtimePage.data.targetMajorName, "护理学");
assert.equal((runtimePage.data.activeRescuePacket as RescuePacket).targetSchoolName, "郑州工商学院");
assert.equal((runtimePage.data.activeRescuePacket as RescuePacket).targetMajorName, "护理学");
assert.ok(
  (runtimePage.data.activeRescuePacket as RescuePacket).entryGroups.some((entry) =>
    decodeURIComponent(entry.url).includes("护理学"),
  ),
  "targeted rescue URLs should include the entered major",
);

capturedPage.copyRescuePacket.call(runtimePage);
assert.ok(clipboardText.includes("郑州工商学院"), "copied packet should keep the entered school");
assert.ok(clipboardText.includes("护理学"), "copied packet should keep the entered major");

const pageMarkup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  'class="major-input"',
  'value="{{majorQuery}}"',
  'bindinput="onMajorInput"',
  "目标专业：{{activeRescuePacket.targetMajorName}}",
]) {
  assert.ok(pageMarkup.includes(token), `index markup should expose the target-major input via ${token}`);
}

const pageStyles = read("miniprogram/pages/index/index.wxss");
assert.ok(pageStyles.includes(".major-input"), "index styles should include .major-input");

console.log("Mini program unknown-school major focus verified.");
