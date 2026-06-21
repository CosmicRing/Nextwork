import assert from "node:assert/strict";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";
import { buildSchoolPublicMajorAccessEntries } from "../src/lib/schoolPublicMajorAccess";

const unknownEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  officialLinks: [],
});

assert.ok(unknownEntries.length >= 8, "unknown schools should still receive broad public entry coverage");
assert.ok(
  unknownEntries.every((entry) => entry.actionTitle && entry.acceptedEvidence && entry.copyTemplate),
  "every public entry should explain what the user needs to collect",
);

const majorEntry = unknownEntries.find((entry) => entry.category === "专业目录");
assert.ok(majorEntry, "major catalog entry should exist");
assert.ok(majorEntry.acceptedEvidence.includes("专业名称"), "major entry should ask for the official major name");
assert.ok(majorEntry.copyTemplate.includes("专业存在"), "major entry should provide a paste-ready evidence template");

const reportEntry = unknownEntries.find((entry) => entry.category === "就业报告");
assert.ok(reportEntry, "employment report entry should exist");
assert.ok(reportEntry.acceptedEvidence.includes("就业率"), "report entry should ask for employment metrics");
assert.ok(reportEntry.acceptedEvidence.includes("升学率"), "report entry should ask for progression metrics");
assert.ok(reportEntry.copyTemplate.includes("就业报告"), "report entry should provide a report evidence template");

const campusEntry = unknownEntries.find((entry) => entry.category === "校招宣讲");
assert.ok(campusEntry, "campus recruiting entry should exist");
assert.ok(campusEntry.acceptedEvidence.includes("企业"), "campus entry should ask for company names");
assert.ok(campusEntry.copyTemplate.includes("到校企业"), "campus entry should provide a campus evidence template");

const knownSchool = schoolOutcomeProfiles.find((school) => school.name === "郑州工商学院");
assert.ok(knownSchool, "known sample school should exist");

const knownEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: knownSchool.name,
  majorName: "电子商务",
  officialLinks: knownSchool.officialLinks,
});

const officialEntries = knownEntries.filter((entry) => entry.type === "official");
assert.ok(officialEntries.length > 0, "known schools should preserve official entries");
assert.ok(
  officialEntries.every((entry) => entry.acceptedEvidence && entry.copyTemplate),
  "official entries should also have action guidance, not just search links",
);

