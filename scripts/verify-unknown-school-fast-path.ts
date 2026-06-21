import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(accessStart > -1, "SchoolPublicAccessPanel should exist");
assert.ok(workbenchStart > -1, "unknown school evidence workbench should exist");
assert.ok(
  accessSource.includes("const unknownEntryPack = selectedSchool ? [] : buildUnknownSchoolEntryPack({"),
  "school workbench should build an unknown-school entry pack when the school is not in structured samples",
);
assert.ok(
  accessSource.includes("const unknownEvidenceGuide = selectedSchool ? [] : buildUnknownSchoolEvidenceGuide(unknownEntryPack);"),
  "school workbench should derive a compact verification guide for unknown schools",
);

const queryBoxIndex = accessSource.indexOf('className="school-public-query-box"');
const workbenchIndex = accessSource.indexOf("<UnknownSchoolEvidenceWorkbench");
const publicAccessIndex = accessSource.indexOf("<SchoolPublicMajorAccessPanel");
const schoolSwitchIndex = accessSource.indexOf("<SchoolWorkbenchSchoolSwitch");
const launcherIndex = accessSource.indexOf("<SchoolOfficialEntranceLauncher");

assert.ok(queryBoxIndex > -1, "school workbench should expose major/job inputs");
assert.ok(workbenchIndex > -1, "school workbench should render the unknown-school evidence workbench");
assert.ok(publicAccessIndex > -1, "school workbench should render public major access entries");
assert.ok(schoolSwitchIndex > -1, "school workbench should start with the school switch");
assert.ok(launcherIndex > -1, "school workbench should render the official entrance launcher");
assert.ok(
  schoolSwitchIndex < queryBoxIndex &&
    queryBoxIndex < launcherIndex &&
    launcherIndex < workbenchIndex &&
    workbenchIndex < publicAccessIndex,
  "unknown-school evidence workbench should follow the query-fed entrance launcher before the full public access list",
);
assert.ok(
  accessSource.includes("{!selectedSchool && unknownEntryPack.length > 0 && ("),
  "unknown-school workbench should only appear for schools missing from structured samples",
);

assert.ok(
  workbenchSource.includes('className="unknown-school-evidence-workbench"') &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"school-official\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"admissions\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"major-catalog\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"employment\")"),
  "workbench should highlight official homepage, admissions, major catalog, and employment entrances first",
);
assert.ok(
  workbenchSource.includes("guide.map((step)") &&
    workbenchSource.includes("packetPreviewLines") &&
    accessSource.includes("packetText={unknownPacketText}") &&
    accessSource.includes("schoolName={targetSchoolName}"),
  "workbench should show evidence order, packet preview and current-school context",
);
assert.ok(
  styleSource.includes(".unknown-school-evidence-workbench") &&
    styleSource.includes(".unknown-school-evidence-priority-grid") &&
    styleSource.includes(".unknown-school-evidence-rules") &&
    styleSource.includes(".unknown-school-evidence-packet"),
  "unknown-school evidence workbench should have dedicated layout styles",
);
