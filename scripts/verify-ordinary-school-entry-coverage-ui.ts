import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const explorerStart = mainSource.indexOf("function SchoolMajorExplorer");
const explorerEnd = mainSource.indexOf("type SchoolManualEvidenceKind", explorerStart);
const explorerSource = mainSource.slice(explorerStart, explorerEnd);
const componentStart = mainSource.indexOf("function OrdinarySchoolEntryCoveragePanel");
const componentEnd = mainSource.indexOf("function SchoolPublicAccessPanel", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(explorerStart > -1 && explorerEnd > explorerStart, "SchoolMajorExplorer should exist");
assert.ok(componentStart > -1 && componentEnd > componentStart, "ordinary-school entry coverage component should exist");
assert.ok(
  explorerSource.includes("const ordinaryEntryCoverageSchools") &&
    explorerSource.includes("<OrdinarySchoolEntryCoveragePanel") &&
    explorerSource.includes("onSelectSchool"),
  "school explorer should derive and render an ordinary-school entry coverage panel",
);

const searchIndex = explorerSource.indexOf('className="inline-search"');
const coverageIndex = explorerSource.indexOf("<OrdinarySchoolEntryCoveragePanel");
const listIndex = explorerSource.indexOf('className="school-list"');
assert.ok(searchIndex > -1 && coverageIndex > searchIndex && listIndex > coverageIndex);

for (const label of ["普通学校入口覆盖", "专业入口", "招生入口", "就业入口", "报告源"]) {
  assert.ok(componentSource.includes(label), `coverage panel should expose ${label}`);
}

for (const token of ["major-catalog", "admissions", "employment", "evidenceSources", "onSelectSchool"]) {
  assert.ok(componentSource.includes(token), `coverage panel should use ${token} to derive entry coverage`);
}

assert.ok(
  componentSource.includes('<details open className="ordinary-school-entry-coverage"'),
  "ordinary-school entry coverage should be open by default so first-time users immediately see official entrances",
);

assert.ok(
  componentSource.includes("const directLinks = school.officialLinks") &&
    componentSource.includes('className="ordinary-school-entry-link-row"') &&
    componentSource.includes("directLinks.map((link)") &&
    componentSource.includes("href={link.url}") &&
    componentSource.includes("target=\"_blank\"") &&
    componentSource.includes("rel=\"noreferrer\""),
  "coverage panel should expose direct clickable official entrances for each ordinary school",
);

for (const className of [
  ".ordinary-school-entry-coverage",
  ".ordinary-school-entry-coverage-head",
  ".ordinary-school-entry-coverage-grid",
  ".ordinary-school-entry-card",
  ".ordinary-school-entry-chip",
  ".ordinary-school-entry-link-row",
  ".ordinary-school-entry-link",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
