import assert from "node:assert/strict";

import { parseSchoolEvidenceText } from "../src/lib/schoolEvidenceParser";

const reportEvidence = parseSchoolEvidenceText({
  schoolName: "郑州工商学院",
  majorName: "会计学",
  jobName: "审计助理",
  url: "https://example.edu.cn/report.pdf",
  text: "郑州工商学院2024届毕业生就业质量报告显示，会计学毕业去向落实率为92.36%，升学率为8.4%，主要流向会计师事务所、金融服务和制造业财务岗位。",
});

assert.equal(reportEvidence.kind, "report");
assert.ok(reportEvidence.title.includes("2024"));
assert.ok(reportEvidence.detail.includes("92.36%"));
assert.ok(reportEvidence.metrics.some((metric) => metric.label.includes("就业") && metric.value === "92.36%"));
assert.ok(reportEvidence.highlights.some((item) => item.includes("升学率")));

const campusEvidence = parseSchoolEvidenceText({
  schoolName: "郑州工商学院",
  majorName: "电子商务",
  jobName: "电商运营",
  url: "https://job.example.edu.cn/fair",
  text: "就业信息网发布2025届春季双选会通知，京东、顺丰、海尔、美的、宇通集团等120家企业进校招聘，岗位包含运营、供应链、财务和管培生。",
});

assert.equal(campusEvidence.kind, "campus");
assert.ok(campusEvidence.companies.includes("京东"));
assert.ok(campusEvidence.companies.includes("顺丰"));
assert.ok(campusEvidence.detail.includes("京东 / 顺丰"));

const salaryEvidence = parseSchoolEvidenceText({
  schoolName: "武汉工商学院",
  majorName: "网络工程",
  jobName: "安全工程师",
  url: "https://careers.example.com/job/123",
  text: "安全工程师校招岗位，面向网络工程、计算机相关专业，base武汉，月薪8-13K，年终奖另计。",
});

assert.equal(salaryEvidence.kind, "salary");
assert.deepEqual(salaryEvidence.salaryRanges, ["8-13K"]);
assert.ok(salaryEvidence.detail.includes("8-13K"));

const majorEvidence = parseSchoolEvidenceText({
  schoolName: "西安培华学院",
  majorName: "护理学",
  jobName: "护士",
  url: "https://example.edu.cn/major/nursing",
  text: "护理学本科专业介绍：本专业培养具备护理学基础理论、临床护理技能和健康管理能力的应用型人才，核心课程包括基础护理学、内科护理学、外科护理学。",
});

assert.equal(majorEvidence.kind, "major");
assert.ok(majorEvidence.detail.includes("核心课程"));
assert.ok(majorEvidence.confidence >= 60);

