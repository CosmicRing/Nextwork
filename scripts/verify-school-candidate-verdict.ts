import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolCandidateCompareVerdict } from "../src/lib/schoolCandidateCompareVerdict";

const verdict = buildSchoolCandidateCompareVerdict([
  {
    key: "complete",
    schoolName: "证据完整学院",
    majorName: "会计学",
    jobName: "审计助理",
    salaryLabel: "8-18K/月",
    marketGroup: "财会审计市场代理",
    evidenceScore: 70,
    readinessTier: "ready-to-compare",
    readinessTitle: "可以放进正式对比",
    readinessAdvice: "复制查询包，拿去对比另一所学校",
    aggregationStatusLabel: "四类证据齐了，可以进入对比",
    aggregationConfirmedCount: 4,
    aggregationLeadCount: 0,
    aggregationWeakCount: 0,
    aggregationMissingSlots: [],
    aggregationNextAction: "拿去横向比较",
  },
  {
    key: "high-salary-weak",
    schoolName: "高薪但证据少学院",
    majorName: "数字媒体技术",
    jobName: "产品运营",
    salaryLabel: "15-35K/月",
    marketGroup: "互联网运营市场代理",
    evidenceScore: 82,
    readinessTier: "not-ready",
    readinessTitle: "现在还不能比较",
    readinessAdvice: "先补专业和就业报告",
    aggregationStatusLabel: "只能起步，先补公开资料",
    aggregationConfirmedCount: 0,
    aggregationLeadCount: 1,
    aggregationWeakCount: 2,
    aggregationMissingSlots: ["专业存在", "就业报告", "到校企业", "岗位薪资"],
    aggregationNextAction: "先打开学校官网",
  },
]);

assert.equal(verdict.ranked[0].schoolName, "证据完整学院", "complete evidence should outrank high salary with weak evidence");
assert.equal(verdict.ranked[0].rankLabel, "优先继续查");
assert.ok(verdict.title.includes("优先看证据完整学院"));
assert.ok(verdict.summary.includes("不是按工资最高排序"));
assert.ok(verdict.nextAction.includes("拿去横向比较"));
assert.ok(verdict.copyText.includes("候选结论排序"));
assert.ok(verdict.copyText.includes("1. 证据完整学院"));
assert.ok(verdict.copyText.includes("2. 高薪但证据少学院"));

const emptyVerdict = buildSchoolCandidateCompareVerdict([]);
assert.equal(emptyVerdict.title, "先保存一个候选");
assert.equal(emptyVerdict.ranked.length, 0);
assert.ok(emptyVerdict.nextAction.includes("存入对比"));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const componentStart = mainSource.indexOf("function SchoolCandidateComparePanel");
const componentEnd = mainSource.indexOf("function buildSchoolInfoCandidate", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);
const verdictStart = mainSource.indexOf("function SchoolCandidateVerdictPanel");
const verdictEnd = mainSource.indexOf("function buildSchoolInfoCandidate", verdictStart);
const verdictSource = mainSource.slice(verdictStart, verdictEnd);

assert.ok(mainSource.includes("buildSchoolCandidateCompareVerdict"), "main should import the candidate verdict helper");
assert.ok(componentSource.includes("const candidateVerdict = buildSchoolCandidateCompareVerdict(candidates)"), "compare panel should derive a verdict from saved candidates");
assert.ok(componentSource.includes("<SchoolCandidateVerdictPanel verdict={candidateVerdict} />"), "compare panel should render the verdict before the candidate cards");
assert.ok(verdictSource.includes("verdict.ranked"), "verdict panel should render ranked candidates");
assert.ok(verdictSource.includes("候选结论排序"), "verdict panel should use direct conclusion-first copy");
assert.ok(verdictSource.includes("verdict.nextAction"), "verdict panel should show the next action");

for (const className of [
  ".school-candidate-verdict-panel",
  ".school-candidate-verdict-head",
  ".school-candidate-verdict-list",
  ".school-candidate-verdict-row",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
