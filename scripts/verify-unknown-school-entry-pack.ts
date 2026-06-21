import assert from "node:assert/strict";
import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
} from "../src/lib/unknownSchoolEntryPack";

const schoolName = "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662";
const majorName = "\u62a4\u7406\u5b66";
const jobName = "\u62a4\u58eb";

const entries = buildUnknownSchoolEntryPack({ schoolName, majorName, jobName });

assert.ok(entries.length >= 7, "unknown school entry pack should expose at least seven actionable entries");
assert.deepEqual(
  new Set(entries.map((entry) => entry.category)),
  new Set([
    "school-official",
    "admissions",
    "major-catalog",
    "employment",
    "report",
    "campus",
    "salary",
  ]),
  "unknown school entry pack should cover official, admissions, major, employment, report, campus, and salary routes",
);

for (const entry of entries) {
  assert.ok(entry.label.trim(), "each entry needs a label");
  assert.ok(entry.detail.trim(), `entry ${entry.id} needs a detail`);
  assert.ok(entry.query.includes(schoolName), `entry ${entry.id} query should include the school name`);
  assert.match(entry.url, /^https:\/\//, `entry ${entry.id} should be an external https URL`);
}

assert.ok(
  entries.some((entry) => entry.query.includes(majorName)),
  "at least one query should include the major name when provided",
);
assert.ok(
  entries.some((entry) => entry.query.includes(jobName)),
  "at least one query should include the target job when provided",
);

const packetText = buildUnknownSchoolEntryPacketText({ schoolName, majorName, jobName, entries });

assert.ok(packetText.includes(schoolName), "packet text should include school name");
assert.ok(packetText.includes(majorName), "packet text should include major name");
assert.ok(packetText.includes(jobName), "packet text should include target job");
assert.ok(packetText.includes(entries[0].query), "packet text should include concrete search queries");

const majorCatalog = entries.find((entry) => entry.id === "major-catalog");
assert.ok(majorCatalog, "unknown school entry pack should include a major catalog route");
assert.ok(majorCatalog.query.includes("官网"), "major catalog query should keep the official-site intent");
assert.ok(majorCatalog.query.includes("学院"), "major catalog query should also search college/department entrances");
assert.ok(
  !majorCatalog.query.includes("site:.edu.cn"),
  "major catalog query should not be limited to .edu.cn because many ordinary/private schools expose admissions pages on other official domains",
);
