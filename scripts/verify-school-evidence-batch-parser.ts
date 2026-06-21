import assert from "node:assert/strict";

import { parseSchoolEvidenceTextBatch } from "../src/lib/schoolEvidenceParser";

const parsedItems = parseSchoolEvidenceTextBatch({
  schoolName: "郑州工商学院",
  majorName: "会计学",
  jobName: "审计助理",
  url: "https://job.ztbu.edu.cn/report",
  text: [
    "郑州工商学院2024届毕业生就业质量报告显示，会计学毕业去向落实率为92.36%，升学率为8.4%。",
    "2025届春季双选会通知：京东、顺丰、海尔、美的、宇通集团等120家企业进校招聘。",
    "腾讯安全工程师校招岗位，面向网络工程、计算机相关专业，base武汉，月薪8-13K。",
    "会计学本科专业介绍：核心课程包括基础会计、审计学、财务管理。",
  ].join("\n"),
});

const kinds = new Set(parsedItems.map((item) => item.kind));

assert.ok(parsedItems.length >= 4, "a mixed full-page paste should split into multiple evidence items");
assert.ok(kinds.has("report"), "batch parsing should include employment report evidence");
assert.ok(kinds.has("campus"), "batch parsing should include campus recruiting evidence");
assert.ok(kinds.has("salary"), "batch parsing should include salary evidence");
assert.ok(kinds.has("major"), "batch parsing should include major-profile evidence");

const reportItem = parsedItems.find((item) => item.kind === "report");
assert.ok(reportItem?.metrics.some((metric) => metric.value === "92.36%"), "report evidence should keep employment metrics");

const campusItem = parsedItems.find((item) => item.kind === "campus");
assert.ok(campusItem?.companies.includes("京东"), "campus evidence should keep company names");

const salaryItem = parsedItems.find((item) => item.kind === "salary");
assert.ok(salaryItem?.salaryRanges.includes("8-13K"), "salary evidence should keep salary ranges");

assert.equal(
  new Set(parsedItems.map((item) => `${item.kind}-${item.title}-${item.detail}`)).size,
  parsedItems.length,
  "batch parsing should dedupe repeated evidence chunks",
);

