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
  accessSource.includes("const unknownPacketText = selectedSchool ? \"\" : buildUnknownSchoolEntryPacketText({"),
  "school workbench should build a copyable unknown-school packet for uncollected schools",
);
assert.ok(
  accessSource.includes("<UnknownSchoolEvidenceWorkbench"),
  "school access panel should render the unknown-school evidence workbench",
);

const schoolSwitchIndex = accessSource.indexOf("<SchoolWorkbenchSchoolSwitch");
const workbenchIndex = accessSource.indexOf("<UnknownSchoolEvidenceWorkbench");
const queryBoxIndex = accessSource.indexOf('className="school-public-query-box"');
const launcherIndex = accessSource.indexOf("<SchoolOfficialEntranceLauncher");
const queueIndex = accessSource.indexOf("<SchoolLookupActionQueue");

assert.ok(
  schoolSwitchIndex > -1 && workbenchIndex > -1 && queryBoxIndex > -1 && launcherIndex > -1 && queueIndex > -1,
  "expected school switch, query box, entrance launcher, action queue and workbench",
);
assert.ok(
  schoolSwitchIndex < queryBoxIndex && queryBoxIndex < launcherIndex && launcherIndex < queueIndex && queueIndex < workbenchIndex,
  "unknown-school evidence workbench should follow the query-fed entrance launcher and first action queue",
);

assert.ok(
  workbenchSource.includes('className="unknown-school-evidence-workbench"') &&
    workbenchSource.includes('aria-label="未收录学校证据工作台"'),
  "workbench should expose a stable wrapper and accessible label",
);
assert.ok(
  workbenchSource.includes("entries.find((entry) => entry.id === \"school-official\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"admissions\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"major-catalog\")") &&
    workbenchSource.includes("entries.find((entry) => entry.id === \"employment\")"),
  "workbench should promote official homepage, admissions, major catalog, and employment entrances before report/campus analysis",
);
assert.ok(
  workbenchSource.includes("先点这 4 个") &&
    !workbenchSource.includes("先点这 3 个"),
  "unknown-school priority block should foreground four first-hop entrances",
);
assert.ok(
  workbenchSource.includes('className="unknown-school-evidence-entry-grid"') &&
    workbenchSource.includes("entries.map((entry)") &&
    workbenchSource.includes("href={entry.url}") &&
    workbenchSource.includes("entry.detail"),
  "workbench should render every generated unknown-school entrance as a visible clickable grid",
);
assert.ok(
  workbenchSource.indexOf('className="unknown-school-evidence-entry-grid"') <
    workbenchSource.indexOf('className="unknown-school-evidence-rules"'),
  "full unknown-school entrance grid should appear before the evidence rules",
);
assert.ok(
  workbenchSource.includes("guide.map((step)") &&
    workbenchSource.includes("step.acceptedEvidence") &&
    workbenchSource.includes("step.rejectIf") &&
    workbenchSource.includes("step.nextAction"),
  "workbench should show evidence acceptance, rejection and next action rules",
);
assert.ok(
  workbenchSource.includes("onCopyPacket") &&
    workbenchSource.includes("packetPreviewLines") &&
    workbenchSource.includes("复制查询包"),
  "workbench should expose a copy action and compact packet preview",
);

assert.ok(
  styleSource.includes(".unknown-school-evidence-workbench") &&
    styleSource.includes(".unknown-school-evidence-priority-grid") &&
    styleSource.includes(".unknown-school-evidence-entry-grid") &&
    styleSource.includes(".unknown-school-evidence-rules") &&
    styleSource.includes(".unknown-school-evidence-packet"),
  "workbench should have dedicated responsive styles",
);
