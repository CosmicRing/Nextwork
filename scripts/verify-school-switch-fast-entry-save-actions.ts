import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const switchStart = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch");
const switchEnd = mainSource.indexOf("function SchoolActionCommandPanel", switchStart);
const switchSource = mainSource.slice(switchStart, switchEnd);

assert.ok(accessStart > -1 && switchStart > -1, "school workbench and switch should exist");
assert.ok(
  accessSource.includes("const fillDraftFromOfficialEntry = (entry: SchoolOfficialLink) => {") &&
    accessSource.includes("kind: getSchoolManualEvidenceKindForOfficialLink(entry.kind)") &&
    accessSource.includes("title: getSchoolOfficialLinkShortLabel(entry)") &&
    accessSource.includes("url: entry.url") &&
    accessSource.includes("openSchoolEvidenceInboxFoldout();"),
  "known-school top fast entries should fill the evidence draft from official links",
);
assert.ok(
  accessSource.includes("onUseOfficialEntry={fillDraftFromOfficialEntry}") &&
    accessSource.includes("onUseUnknownEntry={fillDraftFromUnknownEntry}"),
  "school switch should receive save actions for known and unknown fast entries",
);
assert.ok(
  switchSource.includes("onUseOfficialEntry: (entry: SchoolOfficialLink) => void") &&
    switchSource.includes("onUseUnknownEntry: (entry: UnknownSchoolEntryPackItem) => void"),
  "school switch props should accept fast-entry save callbacks",
);
assert.ok(
  switchSource.includes("officialEntries.map((entry)") &&
    switchSource.includes("onClick={() => onUseOfficialEntry(entry)}") &&
    switchSource.includes("quickEntries.map((entry)") &&
    switchSource.includes("onClick={() => onUseUnknownEntry(entry)}"),
  "both known and unknown fast-entry cards should expose save-to-evidence buttons",
);
assert.ok(
  mainSource.includes("function getSchoolManualEvidenceKindForOfficialLink"),
  "official links should map into evidence kinds before filling the draft",
);

for (const className of [
  ".school-workbench-fast-entry-strip article",
  ".school-workbench-fast-entry-strip a",
  ".school-workbench-fast-entry-strip button",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
