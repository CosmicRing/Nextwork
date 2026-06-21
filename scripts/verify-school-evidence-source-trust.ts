import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { parseSchoolEvidenceText } from "../src/lib/schoolEvidenceParser";

const officialReport = parseSchoolEvidenceText({
  schoolName: "郑州工商学院",
  majorName: "会计学",
  jobName: "审计助理",
  url: "https://job.ztbu.edu.cn/detail/news?id=2024-report",
  text: "郑州工商学院2024届毕业生就业质量报告显示，会计学毕业去向落实率为92.36%，升学率为8.4%。",
});

assert.equal(officialReport.sourceTrust.level, "school-official");
assert.ok(officialReport.sourceTrust.score >= 88);
assert.ok(officialReport.sourceTrust.label.includes("学校官方"));
assert.ok(officialReport.detail.includes("来源：学校官方"));

const confirmedDomainReport = parseSchoolEvidenceText({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  officialDomain: "官网：https://www.zkvtc.cn/xxgk/",
  url: "https://www.zkvtc.cn/jyxx/2024-report.html",
  text: "周口职业技术学院2024届毕业生就业质量报告显示，护理专业毕业去向落实率为91.2%，升学率为8.5%。",
});

assert.equal(confirmedDomainReport.sourceTrust.level, "school-official");
assert.ok(confirmedDomainReport.sourceTrust.reason.includes("已确认官网域名"));
assert.ok(confirmedDomainReport.confidence > 70);

const companyJob = parseSchoolEvidenceText({
  schoolName: "武汉工商学院",
  majorName: "网络工程",
  jobName: "安全工程师",
  url: "https://careers.tencent.com/job/123",
  text: "腾讯安全工程师校招岗位，面向网络工程、计算机相关专业，base武汉，月薪8-13K。",
});

assert.equal(companyJob.sourceTrust.level, "company-official");
assert.ok(companyJob.sourceTrust.label.includes("企业官方"));
assert.ok(companyJob.confidence >= 70);

const searchResult = parseSchoolEvidenceText({
  schoolName: "西安培华学院",
  majorName: "护理学",
  jobName: "护士",
  url: "https://www.baidu.com/s?wd=%E8%A5%BF%E5%AE%89%E5%9F%B9%E5%8D%8E%E5%AD%A6%E9%99%A2%20%E6%8A%A4%E7%90%86%E5%AD%A6%20%E5%B0%B1%E4%B8%9A%E8%B4%A8%E9%87%8F%E6%8A%A5%E5%91%8A",
  text: "搜索结果显示西安培华学院护理学就业质量报告、招生专业、就业信息网等入口。",
});

assert.equal(searchResult.sourceTrust.level, "search-lead");
assert.ok(searchResult.sourceTrust.warning.includes("不能直接当结论"));
assert.ok(searchResult.confidence < officialReport.confidence);

const ncssCampus = parseSchoolEvidenceText({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  url: "https://www.ncss.cn/student/jobs/ABCD",
  text: "国家大学生就业服务平台发布2025届医药卫生类专场招聘会，参会企业包含郑州人民医院、河南省护理服务中心等单位，岗位包含护士、康复治疗、健康管理。",
});

assert.equal(ncssCampus.sourceTrust.level, "public-official");
assert.ok(ncssCampus.sourceTrust.label.includes("公共官方"));
assert.ok(ncssCampus.confidence > searchResult.confidence);

const mohrssSalary = parseSchoolEvidenceText({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  url: "https://job.mohrss.gov.cn/salary-position",
  text: "中国公共招聘网公开岗位：护士，郑州，月薪5000-8000元，要求护理相关专业。",
});

assert.equal(mohrssSalary.sourceTrust.level, "public-official");
assert.equal(mohrssSalary.kind, "salary");
assert.ok(mohrssSalary.salaryRanges.includes("5000-8000元"));

const marketingText = parseSchoolEvidenceText({
  schoolName: "目标学校",
  majorName: "电子商务",
  jobName: "电商运营",
  url: "https://example.com/article/best-major",
  text: "电子商务专业前景非常好，毕业就是高薪热门岗位，推荐报考，就业不用愁。",
});

assert.equal(marketingText.sourceTrust.level, "weak");
assert.ok(marketingText.sourceTrust.warning.includes("营销"));
assert.ok(marketingText.confidence < 60);

const mainSource = readFileSync("src/main.tsx", "utf8");
const panelStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const panelEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(panelSource.includes("parsedEvidence.sourceTrust.label"), "parser result should show source trust label");
assert.ok(panelSource.includes("parsedEvidence.sourceTrust.warning"), "parser result should show source trust warning");
assert.ok(panelSource.includes("来源：${parsedEvidence.sourceTrust.label}"), "filling draft should preserve source trust in detail");

const styleSource = readFileSync("src/styles.css", "utf8");
assert.ok(
  styleSource.includes(".school-evidence-source-trust.trust-public-official"),
  "public official parser trust cards should have a dedicated style",
);
