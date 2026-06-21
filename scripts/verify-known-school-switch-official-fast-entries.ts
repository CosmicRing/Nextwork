import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const switchStart = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch");
const switchEnd = mainSource.indexOf("function SchoolActionCommandPanel", switchStart);
const switchSource = mainSource.slice(switchStart, switchEnd);

assert.ok(accessStart > -1 && switchStart > -1, "school workbench and switch should exist");
assert.ok(
  accessSource.includes("const knownFastEntries = selectedSchool") &&
    accessSource.includes("[...selectedSchool.officialLinks]") &&
    accessSource.includes(".slice(0, 4)"),
  "school workbench should derive a four-link official fast-entry set for known schools",
);
assert.ok(
  accessSource.includes("officialEntries={knownFastEntries}"),
  "school switch should receive known-school official fast entries",
);
assert.ok(
  switchSource.includes("officialEntries: SchoolOfficialLink[]"),
  "school switch props should accept official fast entries",
);
assert.ok(
  switchSource.includes("knownSchool && officialEntries.length > 0") &&
    switchSource.includes("officialEntries.map((entry)") &&
    switchSource.includes("getSchoolOfficialLinkShortLabel(entry)") &&
    switchSource.includes("getSchoolOfficialLinkAuthority(entry.kind)"),
  "school switch should render known-school direct official links in the same first-screen fast strip",
);
assert.ok(
  switchSource.includes("!knownSchool && quickEntries.length > 0"),
  "unknown-school search fast entries should remain available",
);
