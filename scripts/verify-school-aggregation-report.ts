import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";
import { buildSchoolAggregationReport } from "../src/lib/schoolAggregationReport";

const school = schoolOutcomeProfiles.find((profile) => profile.name === "郑州轻工业大学");
assert.ok(school, "school outcome profiles should include Zhengzhou University of Light Industry");
assert.equal(school.id, "zzuli");
assert.equal(school.city, "郑州");

const linkKinds = new Set(school.officialLinks.map((link) => link.kind));
assert.ok(linkKinds.has("school"), "ZZULI should expose the official school homepage");
assert.ok(linkKinds.has("admissions"), "ZZULI should expose the admissions entrance");
assert.ok(linkKinds.has("major-catalog"), "ZZULI should expose a major/source entrance");
assert.ok(linkKinds.has("employment"), "ZZULI should expose the employment/career entrance");

assert.ok(school.majors.length >= 6, "ZZULI should include enough major directions for an aggregation report");
assert.ok(school.majors.some((major) => major.name === "食品科学与工程"), "ZZULI report should cover food engineering");
assert.ok(school.majors.some((major) => major.name === "机械设计制造及其自动化"), "ZZULI report should cover mechanical/manufacturing");
assert.ok(school.majors.some((major) => major.name === "计算机科学与技术"), "ZZULI report should cover computer science");
assert.ok(school.majors.some((major) => major.name === "产品设计"), "ZZULI report should cover product/design");

const campusEvents = school.campusRecruitingYears.flatMap((year) => year.events ?? []);
assert.ok(campusEvents.length >= 8, "ZZULI should preserve recent campus recruiting event rows");
assert.ok(campusEvents.some((event) => event.title.includes("信息学部")), "ZZULI report should include information-school fair evidence");
assert.ok(campusEvents.some((event) => event.title.includes("机械、电气")), "ZZULI report should include mechanical/electrical fair evidence");
assert.ok(campusEvents.some((event) => event.title.includes("政法/经管")), "ZZULI report should include business/law fair evidence");

const report = buildSchoolAggregationReport(school);
assert.equal(report.schoolName, "郑州轻工业大学");
assert.ok(report.headline.includes("就业创业信息网"), "report should cite the employment portal as a primary source");
assert.ok(report.majorRows.length >= 6, "report should list major employment rows");
assert.ok(report.recruitingRows.length >= 8, "report should list campus recruiting rows");
assert.ok(report.sourceRows.some((source) => source.label.includes("双选会")), "report should list fair source entrance");
assert.ok(report.salaryRows.every((row) => row.salaryLabel.includes("/月")), "salary rows should be explicit monthly ranges");
assert.ok(report.copyText.includes("专业就业聚合报告"), "report copy should have a user-readable title");
assert.ok(report.copyText.includes("郑州轻工业大学"), "report copy should include the school name");
assert.ok(report.copyText.includes("招聘会常见行业"), "report copy should include campus recruiting summary");
assert.ok(report.copyText.includes("薪资为岗位市场参考"), "report copy should not imply official salary claims");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

assert.ok(mainSource.includes("buildSchoolAggregationReport"), "main should import the aggregation report builder");
assert.ok(mainSource.includes("<SchoolAggregationReportPanel"), "known-school page should render an aggregation report panel");
assert.ok(mainSource.includes("function SchoolAggregationReportPanel"), "aggregation report panel component should exist");
assert.ok(mainSource.includes("resolveInitialSchoolExplorerProfile"), "school explorer should support a direct initial school resolver");
assert.ok(mainSource.includes('searchParams.get("school")'), "school explorer should support ?school= direct links");
assert.ok(
  mainSource.indexOf("<SchoolAggregationReportPanel") < mainSource.indexOf("<SchoolPublicAccessPanel"),
  "aggregation report should render before public entry cards in the first screen",
);

for (const token of [
  "school-aggregation-report-panel",
  "aggregation.majorRows.slice(0, 8).map",
  "aggregation.recruitingRows.slice(0, 8).map",
  "aggregation.salaryRows.slice(0, 6).map",
  "aggregation.copyText",
]) {
  assert.ok(mainSource.includes(token), `aggregation report UI should include ${token}`);
}

for (const className of [
  ".school-aggregation-report-panel",
  ".school-aggregation-report-grid",
  ".school-aggregation-major-row",
  ".school-aggregation-recruiting-row",
  ".school-aggregation-copy-box",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}

assert.ok(styleSource.includes("@media (max-width: 640px)"), "styles should include a compact mobile breakpoint");
assert.ok(styleSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr));"), "mobile report metrics should collapse to two columns");

console.log("School aggregation report verified.");
