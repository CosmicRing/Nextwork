import assert from "node:assert/strict";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";
import { buildSchoolPublicMajorAccessEntries } from "../src/lib/schoolPublicMajorAccess";

const unknownEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  officialLinks: [],
});

assert.ok(unknownEntries.length >= 8, "unknown schools should get enough public major access entries");
assert.ok(
  unknownEntries.some((entry) => entry.label === "官网专业目录检索"),
  "unknown schools should expose a major catalog search entry",
);
assert.ok(
  unknownEntries.some((entry) => entry.label === "培养方案检索"),
  "unknown schools should expose a cultivation-plan search entry",
);
assert.ok(
  unknownEntries.some((entry) => entry.label === "招生专业检索"),
  "unknown schools should expose an admissions-major search entry",
);
assert.ok(
  unknownEntries.some((entry) => entry.label === "就业质量报告检索"),
  "unknown schools should expose an employment-quality report search entry",
);
assert.ok(
  unknownEntries.some((entry) => entry.label === "校招宣讲会检索"),
  "unknown schools should expose a campus recruiting search entry",
);
assert.ok(
  unknownEntries.every((entry) => decodeURIComponent(entry.url).includes("周口职业技术学院")),
  "all unknown-school search entries should carry the school name",
);
assert.ok(
  unknownEntries.filter((entry) => decodeURIComponent(entry.url).includes("护理学")).length >= 4,
  "major-specific entries should carry the major name",
);

const ztbu = schoolOutcomeProfiles.find((school) => school.name === "郑州工商学院");
assert.ok(ztbu, "郑州工商学院 should exist in school outcome profiles");

const knownEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: ztbu.name,
  majorName: "电子商务",
  officialLinks: ztbu.officialLinks,
});

assert.ok(
  knownEntries.some((entry) => entry.type === "official" && entry.label === "招生网"),
  "known schools should preserve official admissions links",
);
assert.ok(
  knownEntries.some((entry) => entry.type === "official" && entry.label === "学校官网"),
  "known schools should preserve official school links",
);
assert.ok(
  knownEntries.some((entry) => entry.label === "培养方案检索"),
  "known schools should still expose major-specific public search entries",
);
assert.ok(
  knownEntries.some((entry) => entry.label === "就业质量报告检索"),
  "known schools should still expose employment report search entries after official links",
);
assert.ok(
  knownEntries.some((entry) => entry.label === "校招宣讲会检索"),
  "known schools should still expose campus recruiting search entries after official links",
);
assert.ok(
  knownEntries.every((entry) => entry.url.startsWith("https://")),
  "every public major access entry should be a safe https URL",
);
