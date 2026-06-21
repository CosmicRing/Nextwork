import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolCandidateCompareReport } from "../src/lib/schoolCandidateCompareReport";

const report = buildSchoolCandidateCompareReport([
  {
    schoolName: "郑州工商学院",
    majorName: "会计学",
    jobName: "审计助理",
    salaryLabel: "8-22K/月",
    marketGroup: "财会审计市场代理",
    readinessTitle: "可以先粗筛，不能下结论",
    readinessAdvice: "继续补齐缺口后再正式比较",
    evidenceScore: 60,
    aggregationStatusLabel: "只能起步，先补公开资料",
    aggregationConfirmedCount: 1,
    aggregationLeadCount: 0,
    aggregationWeakCount: 0,
    aggregationMissingSlots: ["就业报告", "到校企业", "岗位薪资"],
    aggregationNextAction: "继续补就业报告，优先找学校官网、就业网、就业质量报告或企业招聘官网。",
    nextEvidenceLabel: "就业报告",
    nextEvidenceSource: "学校信息公开 / 就业质量报告",
    nextEvidenceDetail: "保存就业率、升学率、行业去向和统计口径。",
    nextEvidenceUrl: "https://example.edu.cn/job/report",
    nextEvidenceSaveFields: ["就业率", "升学率", "行业去向", "统计口径"],
  },
  {
    schoolName: "广州南方学院",
    majorName: "电子商务",
    jobName: "电商运营",
    salaryLabel: "7-18K/月",
    marketGroup: "电商运营市场代理",
    readinessTitle: "市场岗位强，学校证据待补",
    readinessAdvice: "继续核验学校就业报告和校招企业。",
    evidenceScore: 48,
    aggregationStatusLabel: "能先粗筛，不能下最终结论",
    aggregationConfirmedCount: 2,
    aggregationLeadCount: 1,
    aggregationWeakCount: 1,
    aggregationMissingSlots: ["岗位薪资"],
    aggregationNextAction: "弱证据不能当结论，只能当搜索线索继续回到官方来源复核。",
  },
]);

assert.ok(report.includes("候选对比报告"));
assert.ok(report.includes("1. 郑州工商学院"));
assert.ok(report.includes("方向：会计学 -> 审计助理"));
assert.ok(report.includes("薪资：8-22K/月"));
assert.ok(report.includes("状态：可以先粗筛，不能下结论"));
assert.ok(report.includes("证据：可采信 1 / 待复核 0 / 弱证据 0"));
assert.ok(report.includes("缺口：就业报告 / 到校企业 / 岗位薪资"));
assert.ok(report.includes("下一步：继续补就业报告"));
assert.ok(report.includes("下一证据入口：就业报告｜学校信息公开 / 就业质量报告"));
assert.ok(report.includes("下一证据说明：保存就业率、升学率、行业去向和统计口径。"));
assert.ok(report.includes("下一证据链接：https://example.edu.cn/job/report"));
assert.ok(report.includes("下一证据保存字段：就业率 / 升学率 / 行业去向 / 统计口径"));
assert.ok(report.includes("2. 广州南方学院"));
assert.ok(report.includes("证据：可采信 2 / 待复核 1 / 弱证据 1"));
assert.ok(report.includes("缺口：岗位薪资"));
assert.ok(report.includes("不要把弱证据当结论"));

assert.equal(buildSchoolCandidateCompareReport([]), "候选对比报告\n暂无候选；先保存一个学校/专业/岗位方案。");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const componentStart = mainSource.indexOf("function SchoolCandidateComparePanel");
const componentEnd = mainSource.indexOf("function buildSchoolInfoCandidate", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);
const copyHelperStart = mainSource.indexOf("async function copyTextToClipboard");
const copyHelperEnd = mainSource.indexOf("function SchoolEvidenceInboxPanel", copyHelperStart);
const copyHelperSource = mainSource.slice(copyHelperStart, copyHelperEnd);

assert.ok(mainSource.includes("buildSchoolCandidateCompareReport"), "main should import the compare report helper");
assert.ok(componentSource.includes("compareReportText"), "candidate compare panel should build report text");
assert.ok(componentSource.includes("复制对比报告"), "candidate compare panel should expose a copy report action");
assert.ok(componentSource.includes("copyReportState"), "candidate compare panel should show copy state");
assert.ok(componentSource.includes("showReportText"), "candidate compare panel should expose a manual report fallback");
assert.ok(componentSource.includes("school-candidate-report-copybox"), "manual fallback should use a dedicated copybox");
assert.ok(componentSource.includes("value={compareReportText}"), "manual fallback should show the generated report text");
assert.ok(componentSource.includes("buildSchoolCandidateCompareReport(candidates)"), "copy text should include saved candidates");
assert.ok(componentSource.includes("school-candidate-next-evidence"), "candidate cards should render the next evidence entrance");
assert.ok(componentSource.includes("candidate.nextEvidenceUrl"), "candidate cards should expose the next evidence URL");
assert.ok(componentSource.includes("candidate.nextEvidenceSource"), "candidate cards should expose the next evidence source");
assert.ok(copyHelperSource.includes("copyTextWithHiddenTextarea(text)"), "copy helper should try a synchronous textarea fallback");
assert.ok(copyHelperSource.includes("try {"), "copy helper should catch Clipboard API permission failures");
assert.ok(copyHelperSource.includes("navigator.clipboard.writeText(text)"), "copy helper should support Clipboard API");
assert.ok(copyHelperSource.includes("catch"), "copy helper should fall back when Clipboard API rejects");
assert.ok(styleSource.includes(".school-candidate-report-actions"), "report action controls should have dedicated styles");
assert.ok(styleSource.includes(".school-candidate-report-copybox"), "manual copybox should have dedicated styles");
assert.ok(styleSource.includes(".school-candidate-next-evidence"), "next evidence card should have dedicated styles");
