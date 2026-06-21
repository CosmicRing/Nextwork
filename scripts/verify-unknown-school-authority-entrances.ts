import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolAuthorityEntrances } from "../src/lib/unknownSchoolEntryPack";

const schoolName = "周口职业技术学院";
const majorName = "护理";
const entries = buildUnknownSchoolAuthorityEntrances({ schoolName, majorName });

assert.deepEqual(
  entries.map((entry) => entry.id),
  [
    "chsi-school",
    "chsi-major",
    "chsi-admission",
    "chsi-zyck",
    "ncss-campus",
    "mohrss-public-jobs",
    "gov-employment-service",
  ],
  "authority entrances should include CHSI school/major surfaces plus national employment and public job entrances",
);
assert.deepEqual(
  entries.map((entry) => entry.evidenceKind),
  ["major", "major", "major", "major", "campus", "salary", "salary"],
  "authority entrances should declare which evidence slot they can help fill",
);
assert.ok(entries.some((entry) => entry.url.startsWith("https://www.ncss.cn/")));
assert.ok(entries.some((entry) => entry.url.startsWith("https://job.mohrss.gov.cn/")));
assert.ok(entries.some((entry) => entry.url.startsWith("https://gjzwfw.www.gov.cn/")));
assert.ok(entries.every((entry) => entry.query.includes(schoolName)));
assert.ok(entries.some((entry) => entry.query.includes(majorName)));
assert.ok(entries.every((entry) => entry.detail.trim() && entry.source.trim()));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolPublicAccessMap", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function UnknownSchoolPublicAccessMap");
const componentEnd = mainSource.indexOf("function UnknownSchoolTypeStrategyCard", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(
  accessSource.includes("const unknownAuthorityEntrances = selectedSchool ? [] : buildUnknownSchoolAuthorityEntrances({"),
  "school access panel should derive official authority entrances for unlisted schools",
);
assert.ok(
  accessSource.includes("authorityEntries={unknownAuthorityEntrances}"),
  "public access map should receive official authority entrances",
);

for (const token of [
  "authorityEntries: UnknownSchoolAuthorityEntrance[];",
  'className="unknown-school-authority-entry-strip"',
  "authorityEntries.map((entry)",
  "entry.url",
  "entry.query",
  "entry.source",
  "entry.evidenceKind",
]) {
  assert.ok(componentSource.includes(token), `public access map should render authority entrances via ${token}`);
}

assert.ok(
  componentSource.indexOf('className="unknown-school-authority-entry-strip"') <
    componentSource.indexOf('className="unknown-school-public-access-map-grid"'),
  "authority entrances should appear before broad search cards",
);

for (const className of [
  ".unknown-school-authority-entry-strip",
  ".unknown-school-authority-entry-card",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
