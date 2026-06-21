import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const explorerStart = mainSource.indexOf("function SchoolMajorExplorer");
const coverageStart = mainSource.indexOf("function OrdinarySchoolEntryCoveragePanel");
const publicPanelStart = mainSource.indexOf("function SchoolPublicAccessPanel", explorerStart);

assert.ok(explorerStart > -1, "SchoolMajorExplorer should exist");
assert.ok(coverageStart > -1, "OrdinarySchoolEntryCoveragePanel should exist");
assert.ok(publicPanelStart > explorerStart, "SchoolPublicAccessPanel should follow explorer source");

const explorerSource = mainSource.slice(explorerStart, coverageStart);
const coverageSource = mainSource.slice(coverageStart, publicPanelStart);

const majorBrowserIndex = explorerSource.indexOf('className="major-browser"');
const pickerIndex = explorerSource.indexOf('className="school-picker');
const publicAccessIndex = explorerSource.indexOf("<SchoolPublicAccessPanel");
const coverageIndex = explorerSource.indexOf("<OrdinarySchoolEntryCoveragePanel");

assert.ok(majorBrowserIndex > -1, "school explorer should render the workbench column");
assert.ok(pickerIndex > -1, "school explorer should keep the school picker as a supporting rail");
assert.ok(publicAccessIndex > majorBrowserIndex, "public access workbench should render inside the workbench column");
assert.ok(
  majorBrowserIndex < pickerIndex && publicAccessIndex < pickerIndex,
  "current school workbench should come before the school picker rail in DOM order",
);
assert.ok(
  coverageIndex > pickerIndex,
  "ordinary-school coverage should live in the supporting picker rail, not before the workbench",
);

assert.ok(
  coverageSource.includes("<details") &&
    coverageSource.includes('className="ordinary-school-entry-coverage"') &&
    coverageSource.includes("<summary"),
  "ordinary-school coverage should be a collapsed supporting details block",
);
assert.ok(
  coverageSource.indexOf("<summary") < coverageSource.indexOf('className="ordinary-school-entry-coverage-grid"'),
  "coverage grid should sit behind the summary instead of being dumped into the first screen",
);

assert.ok(
  styleSource.includes(".school-picker-secondary") &&
    styleSource.includes(".ordinary-school-entry-coverage summary"),
  "supporting rail and collapsed coverage summary should have dedicated styles",
);
