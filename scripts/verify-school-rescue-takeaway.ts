import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolRescueTakeaway } from "../src/lib/schoolRescueTakeaway";

const readyTakeaway = buildSchoolRescueTakeaway({
  schoolName: "郑州工商学院",
  majorName: "电子商务",
  jobName: "电商运营",
  knownSchool: true,
  officialEntryCount: 3,
  searchEntryCount: 6,
  salaryLabel: "7-18K/月",
  salarySource: "消费零售市场代理",
  companyNames: ["京东", "阿里巴巴", "Amazon"],
  evidenceCount: 2,
  readinessTitle: "可以开始横向比较",
  nextActions: ["确认专业是否真实开设", "查校招和宣讲会企业", "打开企业官网岗位"],
});

assert.equal(readyTakeaway.title, "先带走这份入口包");
assert.equal(readyTakeaway.statusLabel, "已命中学校样本");
assert.equal(readyTakeaway.primaryLabel, "复制救援包");
assert.equal(readyTakeaway.secondaryLabel, "补证据");
assert.deepEqual(readyTakeaway.lines, [
  "学校：郑州工商学院",
  "方向：电子商务 -> 电商运营",
  "工资：7-18K/月（消费零售市场代理）",
  "入口：3 个官方直达 · 6 个公开搜索 · 京东 / 阿里巴巴 / Amazon",
  "下一步：确认专业是否真实开设 / 查校招和宣讲会企业 / 打开企业官网岗位",
]);
assert.ok(readyTakeaway.warning.includes("工资是岗位代理"), "takeaway should not imply school-official salary data");
assert.equal(readyTakeaway.chips.find((chip) => chip.id === "evidence")?.value, "2 条");

const unknownTakeaway = buildSchoolRescueTakeaway({
  schoolName: "周口职业技术学院",
  majorName: "",
  jobName: "",
  knownSchool: false,
  officialEntryCount: 0,
  searchEntryCount: 7,
  salaryLabel: "",
  salarySource: "",
  companyNames: [],
  evidenceCount: 0,
  readinessTitle: "先补专业或岗位",
  nextActions: [],
});

assert.equal(unknownTakeaway.statusLabel, "未收录也能查");
assert.equal(unknownTakeaway.lines[1], "方向：先填专业或岗位");
assert.equal(unknownTakeaway.lines[2], "工资：补专业或岗位后生成");
assert.equal(unknownTakeaway.lines[3], "入口：7 个公开搜索");
assert.equal(unknownTakeaway.lines[4], "下一步：先打开学校专业入口 / 查就业质量报告 / 查校招企业");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolLookupActionQueue", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function SchoolRescueTakeawayCard");
const componentEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(mainSource.includes("buildSchoolRescueTakeaway"), "main should import the rescue takeaway helper");
assert.ok(accessSource.includes("const rescueTakeaway = buildSchoolRescueTakeaway({"), "school panel should derive a top takeaway model");
assert.ok(componentStart > -1 && componentEnd > componentStart, "takeaway component should exist before official-entry strip components");

const runwayIndex = accessSource.indexOf("<SchoolRescueActionRunway");
const takeawayIndex = accessSource.indexOf("<SchoolRescueTakeawayCard");
const launcherIndex = accessSource.indexOf("<SchoolOfficialEntranceLauncher");
assert.ok(
  runwayIndex > -1 && takeawayIndex > runwayIndex && launcherIndex > takeawayIndex,
  "takeaway should sit after the runway and before the larger official entrance cards",
);

for (const token of [
  'className="school-rescue-takeaway-card"',
  'className="school-rescue-takeaway-lines"',
  "takeaway.lines.map",
  "onCopyPacket",
  "onOpenEvidenceInbox",
]) {
  assert.ok(componentSource.includes(token), `takeaway component should include ${token}`);
}

for (const className of [
  ".school-rescue-takeaway-card",
  ".school-rescue-takeaway-head",
  ".school-rescue-takeaway-chips",
  ".school-rescue-takeaway-lines",
  ".school-rescue-takeaway-actions",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
