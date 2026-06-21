import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const componentStart = mainSource.indexOf("function SchoolPublicRescueEntryStrip");
const componentEnd = mainSource.indexOf("function SchoolNextActionBar", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(panelStart > -1 && panelEnd > panelStart, "SchoolPublicAccessPanel should exist");
assert.ok(componentStart > -1 && componentEnd > componentStart, "school rescue entry strip component should exist");

const queryIndex = panelSource.indexOf('className="school-public-query-box"');
const rescueIndex = panelSource.indexOf("<SchoolPublicRescueEntryStrip");
const launcherIndex = panelSource.indexOf("<SchoolOfficialEntranceLauncher");
const sourceStripIndex = panelSource.indexOf("<SchoolOfficialEntryStrip");

assert.ok(queryIndex > -1, "school public query box should exist");
assert.ok(rescueIndex > -1, "school panel should render the rescue entry strip");
assert.ok(launcherIndex > -1, "school panel should still render the official entrance launcher");
assert.ok(sourceStripIndex > -1, "school panel should still render the official source strip");
assert.ok(
  rescueIndex < queryIndex && queryIndex < launcherIndex && rescueIndex < sourceStripIndex,
  "rescue strip should sit immediately after school selection and before direction inputs and detailed cards",
);

for (const routeId of ["school-admissions-major", "school-employment-report", "school-career-center", "job-salary-proxy"]) {
  assert.ok(componentSource.includes(routeId), `rescue strip should expose ${routeId}`);
}

for (const label of ["专业入口", "就业报告", "到校企业", "岗位薪资"]) {
  assert.ok(componentSource.includes(label), `rescue strip should show ${label}`);
}

assert.ok(componentSource.includes("routes.find((route) => route.id === item.routeId)"), "rescue strip should derive links from public source routes");
assert.ok(componentSource.includes('className="school-public-rescue-entry-strip"'), "rescue strip should have a stable wrapper class");

for (const className of [
  ".school-public-rescue-entry-strip",
  ".school-public-rescue-entry-head",
  ".school-public-rescue-entry-grid",
  ".school-public-rescue-entry-card",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
