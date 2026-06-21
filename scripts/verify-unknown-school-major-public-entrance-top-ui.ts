import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(
  panelSource.includes("const unknownPublicEntranceDirectory = selectedSchool ? [] : buildUnknownSchoolPublicEntranceDirectory({"),
  "SchoolPublicAccessPanel should build the expanded public entrance directory for unknown schools",
);
assert.ok(
  panelSource.includes("<UnknownSchoolHierarchicalEntranceDirectory") &&
    panelSource.includes("groups={unknownPublicEntranceDirectory}"),
  "SchoolPublicAccessPanel should render the grouped public entrance directory",
);
assert.ok(
  panelSource.indexOf("<UnknownSchoolHierarchicalEntranceDirectory") <
    panelSource.indexOf("<UnknownSchoolPublicAccessMap"),
  "grouped public entrance directory should appear before the heavier public access map",
);

const componentStart = mainSource.indexOf("function UnknownSchoolHierarchicalEntranceDirectory");
const componentEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

for (const token of [
  "公开资料分级目录",
  "groups.map((group, index)",
  "group.entries.map((entry)",
  "href={entry.url}",
  "entry.query",
  "只打开 HTTPS",
]) {
  assert.ok(componentSource.includes(token), `hierarchical entrance directory should include ${token}`);
}

for (const className of [
  ".unknown-school-hierarchical-directory",
  ".unknown-school-hierarchical-directory-head",
  ".unknown-school-directory-level-one",
  ".unknown-school-directory-entry",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
