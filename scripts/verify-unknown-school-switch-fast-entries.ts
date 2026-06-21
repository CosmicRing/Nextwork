import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolEntryPack,
  pickUnknownSchoolFastEntranceEntries,
} from "../src/lib/unknownSchoolEntryPack";

const entries = buildUnknownSchoolEntryPack({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
});
const fastEntries = pickUnknownSchoolFastEntranceEntries(entries);

assert.deepEqual(
  fastEntries.map((entry) => entry.id),
  ["school-official", "admissions", "major-catalog", "employment", "report", "campus", "salary"],
  "unknown-school fast entry strip should expose the full official-data entrance chain",
);
assert.equal(fastEntries.length, 7, "fast entry strip should expose all seven first-click entrance types");
assert.ok(fastEntries.every((entry) => entry.url.startsWith("https://")), "fast entries should be clickable search URLs");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const switchStart = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch");
const switchEnd = mainSource.indexOf("function SchoolActionCommandPanel", switchStart);
const switchSource = mainSource.slice(switchStart, switchEnd);

assert.ok(mainSource.includes("pickUnknownSchoolFastEntranceEntries"), "main should import the fast entrance helper");
assert.ok(
  accessSource.includes("const unknownFastEntries = selectedSchool ? [] : pickUnknownSchoolFastEntranceEntries(unknownEntryPack);"),
  "school access panel should derive fast entries from the unknown-school pack",
);
assert.ok(
  accessSource.includes("quickEntries={unknownFastEntries}"),
  "school switch should receive fast entries directly instead of making users scroll down",
);
assert.ok(
  switchSource.includes("quickEntries: UnknownSchoolEntryPackItem[]"),
  "school switch props should accept unknown-school fast entries",
);
assert.ok(
  switchSource.includes('className="school-workbench-fast-entry-strip"') &&
    switchSource.includes("quickEntries.map((entry)") &&
    switchSource.includes("getUnknownSchoolEntryCategoryLabel(entry.category)"),
  "school switch should render the generated entrance strip for unlisted schools",
);

for (const className of [
  ".school-workbench-fast-entry-strip",
  ".school-workbench-fast-entry-strip a",
  ".school-workbench-fast-entry-strip span",
  ".school-workbench-fast-entry-strip strong",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
