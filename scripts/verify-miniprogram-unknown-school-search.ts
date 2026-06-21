import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RescuePacket = {
  targetSchoolName: string;
  targetMajorName: string;
  title: string;
  entryGroups: Array<{ label: string; url: string; saveFields: string[] }>;
  copyText: string;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
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
    schools: Array<{ id: string; name: string }>;
    buildOrdinarySchoolRescuePacket?: (schoolName?: string, majorName?: string) => RescuePacket;
  };
}

const sampleData = loadSampleData();
const { buildOrdinarySchoolRescuePacket } = sampleData;
assert.equal(typeof buildOrdinarySchoolRescuePacket, "function", "sample data should export a target-school packet builder");

const packet = buildOrdinarySchoolRescuePacket?.("不存在测试学校", "护理学");
assert.ok(packet, "packet builder should return a rescue packet");
assert.equal(packet.targetSchoolName, "不存在测试学校");
assert.equal(packet.targetMajorName, "护理学");
assert.ok(packet.title.includes("不存在测试学校"), "packet title should make the entered school visible");
assert.ok(packet.copyText.includes("不存在测试学校"), "copy text should include the entered school");
assert.ok(packet.copyText.includes("护理学"), "copy text should include the entered major");
assert.ok(packet.copyText.includes("薪资为岗位市场参考"), "copy text should keep the salary caveat");
assert.ok(packet.entryGroups.length >= 5, "target packet should keep the full public entry set");
assert.ok(
  packet.entryGroups.every((entry) => !entry.url.includes("学校名") && !entry.url.includes("专业名")),
  "target packet URLs should replace generic placeholders",
);
assert.ok(
  packet.entryGroups.some((entry) => decodeURIComponent(entry.url).includes("不存在测试学校")),
  "at least one target URL should include the entered school name",
);

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of [
  "buildOrdinarySchoolRescuePacket",
  "activeRescuePacket",
  "isUnknownSchool",
  "unknownSchoolName",
  "buildRescuePacketForQuery",
]) {
  assert.ok(pageScript.includes(token), `index page should include ${token}`);
}
assert.ok(
  pageScript.includes("const nextSchool = filteredSchools[0] || null") &&
    pageScript.includes("selectedMajor,") &&
    pageScript.includes("const selectedMajor = nextSchool"),
  "unknown school search should explicitly allow an empty selected school instead of forcing a famous-school fallback",
);
assert.ok(
  !pageScript.includes("const nextSchool = filteredSchools[0] || schools[0]"),
  "unknown school search should not fall back to the first famous school",
);
assert.ok(
  pageScript.includes("this.data.activeRescuePacket.entryGroups"),
  "copy entry should use the generated active packet instead of static global data",
);

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

capturedPage.onSchoolInput.call(runtimePage, { detail: { value: "不存在测试学校" } });
assert.equal(runtimePage.data.selectedSchool, null, "unknown school input should clear the selected famous-school sample");
assert.equal(runtimePage.data.selectedMajor, null, "unknown school input should clear the selected major sample");
assert.equal(runtimePage.data.isUnknownSchool, true, "unknown school input should switch on the rescue state");
assert.equal(runtimePage.data.unknownSchoolName, "不存在测试学校");
assert.equal((runtimePage.data.filteredSchools as unknown[]).length, 0, "unknown school input should not invent a known-school match");
assert.ok(
  (runtimePage.data.activeRescuePacket as RescuePacket).copyText.includes("不存在测试学校"),
  "runtime active packet should be generated from the input school",
);
capturedPage.copyRescuePacket.call(runtimePage);
assert.ok(clipboardText.includes("不存在测试学校"), "copy action should copy the runtime-generated school packet");

const pageMarkup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "activeRescuePacket.title",
  "activeRescuePacket.entryGroups",
  "evidenceProgress",
  "isUnknownSchool",
  "unknown-school-empty",
  'wx:if="{{selectedSchool}}"',
]) {
  assert.ok(pageMarkup.includes(token), `index markup should render unknown-school search state via ${token}`);
}

const pageStyles = read("miniprogram/pages/index/index.wxss");
for (const token of [".unknown-school-empty", ".unknown-school-empty text:first-child"]) {
  assert.ok(pageStyles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program unknown-school search fallback verified.");
