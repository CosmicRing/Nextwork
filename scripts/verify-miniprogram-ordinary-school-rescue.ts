import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RescueEntry = {
  label: string;
  source: string;
  url: string;
  trustLevel: string;
  saveFields: string[];
  action: string;
};

type OrdinarySchoolRescue = {
  title: string;
  examples: string[];
  entryGroups: RescueEntry[];
  evidenceTasks: Array<{ title: string; check: string; output: string }>;
  packetLines: string[];
  copyText: string;
};

function read(relativePath: string) {
  return readFileSync(relativePath, "utf8");
}

function loadSampleData() {
  const source = read("miniprogram/utils/sample-data.js");
  const sandbox = {
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
  };

  vm.runInNewContext(source, sandbox, { filename: "miniprogram/utils/sample-data.js" });
  return sandbox.module.exports as { ordinarySchoolRescue?: OrdinarySchoolRescue };
}

const { ordinarySchoolRescue } = loadSampleData();
assert.ok(ordinarySchoolRescue, "sample data should export ordinarySchoolRescue for schools not yet collected");
assert.equal(ordinarySchoolRescue.title, "未收录学校也能查", "rescue section should use direct user-facing copy");
assert.ok(ordinarySchoolRescue.examples.length >= 4, "rescue section should show several ordinary-school examples");

const requiredEntries = ["学校主体", "专业资料", "就业报告", "到校招聘", "岗位薪资"];
for (const label of requiredEntries) {
  const entry = ordinarySchoolRescue.entryGroups.find((item) => item.label === label);
  assert.ok(entry, `rescue entry groups should include ${label}`);
  assert.ok(entry.source && entry.url && entry.action, `${label} should expose a copyable public entrance`);
  assert.ok(entry.url.startsWith("https://"), `${label} should use an HTTPS public search or official entrance`);
  assert.ok(entry.saveFields.length >= 3, `${label} should tell users what evidence fields to save`);
}

assert.ok(ordinarySchoolRescue.evidenceTasks.length >= 5, "rescue package should include a full evidence task list");
for (const task of ordinarySchoolRescue.evidenceTasks) {
  assert.ok(task.title && task.check && task.output, "each evidence task should say what to check and what to save");
}

assert.ok(ordinarySchoolRescue.packetLines.length >= 6, "rescue package should expose concise copyable packet lines");
assert.ok(
  ordinarySchoolRescue.copyText.includes("普通学校公开入口包") &&
    ordinarySchoolRescue.copyText.includes("薪资为岗位市场参考") &&
    ordinarySchoolRescue.copyText.includes("岗位薪资"),
  "copy text should include the public-entry package and a salary caveat",
);

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(
  pageScript.includes("ordinarySchoolRescue") &&
    pageScript.includes("copyRescuePacket") &&
    pageScript.includes("copyRescueEntry"),
  "index page should import rescue data and expose copy actions",
);

const pageMarkup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "ordinary-rescue",
  "activeRescuePacket.examples",
  "activeRescuePacket.entryGroups",
  "evidenceProgress",
  "copyRescuePacket",
  "copyRescueEntry",
]) {
  assert.ok(pageMarkup.includes(token), `index markup should render ${token}`);
}

const pageStyles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".ordinary-rescue",
  ".rescue-example-row",
  ".rescue-entry-card",
  ".rescue-packet-button",
  ".rescue-task-row",
]) {
  assert.ok(pageStyles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program ordinary-school rescue section verified.");
