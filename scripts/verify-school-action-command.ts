import assert from "node:assert/strict";

import { buildSchoolActionCommand } from "../src/lib/schoolActionCommand";

const unknownCommand = buildSchoolActionCommand({
  schoolName: "周口职业技术学院",
  majorName: "",
  jobName: "",
  knownSchool: false,
  officialEntryCount: 0,
  publicMajorEntryCount: 6,
  verifiedReportCount: 0,
  companyEntryCount: 0,
  salaryLabel: "",
});

assert.equal(unknownCommand.statusLabel, "未收录也能推进");
assert.equal(unknownCommand.actions.length, 3, "unknown school command should show exactly three actions");
assert.equal(unknownCommand.actions[0].label, "先补专业名称");
assert.equal(unknownCommand.actions[1].label, "查就业质量报告");
assert.equal(unknownCommand.actions[2].label, "用岗位雷达反推");
assert.ok(unknownCommand.summary.includes("周口职业技术学院"));
assert.ok(unknownCommand.evidenceScore < 50, "unknown school without direction should stay low confidence");

const knownCommand = buildSchoolActionCommand({
  schoolName: "郑州工商学院",
  majorName: "电子商务",
  jobName: "电商运营",
  knownSchool: true,
  officialEntryCount: 2,
  publicMajorEntryCount: 8,
  verifiedReportCount: 1,
  companyEntryCount: 4,
  salaryLabel: "7-18K/月",
});

assert.equal(knownCommand.statusLabel, "已命中学校样本");
assert.equal(knownCommand.actions.length, 3, "known school command should show exactly three actions");
assert.equal(knownCommand.actions[0].label, "核对专业资料");
assert.equal(knownCommand.actions[0].metric, "2 官方 / 8 入口");
assert.equal(knownCommand.actions[1].label, "读取就业报告");
assert.equal(knownCommand.actions[2].label, "打开企业官网岗位");
assert.ok(knownCommand.summary.includes("电子商务"));
assert.ok(knownCommand.summary.includes("7-18K/月"));
assert.ok(knownCommand.evidenceScore >= 70, "known school with direction and company entries should be high confidence");
