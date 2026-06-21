import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(
  panelSource.includes("const unknownPublicEntranceDirectory = selectedSchool ? [] : buildUnknownSchoolPublicEntranceDirectory({"),
  "SchoolPublicAccessPanel should build a complete unknown-school public entrance directory",
);
assert.ok(
  panelSource.includes("<UnknownSchoolHierarchicalEntranceDirectory") &&
    panelSource.includes("groups={unknownPublicEntranceDirectory}"),
  "SchoolPublicAccessPanel should render a hierarchical entrance directory",
);
assert.ok(
  panelSource.indexOf("<UnknownSchoolHierarchicalEntranceDirectory") <
    panelSource.indexOf("<UnknownSchoolPublicAccessMap"),
  "hierarchical directory should appear before heavier evidence modules",
);

const componentStart = mainSource.indexOf("function UnknownSchoolHierarchicalEntranceDirectory");
const componentEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

for (const token of [
  "公开资料分级目录",
  "groups.map((group, index)",
  "<details",
  "<summary",
  "group.entries.map((entry)",
  "href={entry.url}",
  "target=\"_blank\"",
  "rel=\"noreferrer\"",
  "getUnknownSchoolExternalLinkSafetyLabel(entry)",
]) {
  assert.ok(componentSource.includes(token), `hierarchical directory should include ${token}`);
}

for (const className of [
  ".unknown-school-hierarchical-directory",
  ".unknown-school-hierarchical-directory-head",
  ".unknown-school-directory-level-one",
  ".unknown-school-directory-entry-list",
  ".unknown-school-directory-entry",
  ".unknown-school-directory-security",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}

assert.ok(
  styleSource.includes("@media (max-width: 560px)") &&
    styleSource.includes(".unknown-school-hierarchical-directory") &&
    styleSource.includes("min-height: 44px"),
  "hierarchical directory should include mini-program friendly narrow-screen touch sizing",
);

