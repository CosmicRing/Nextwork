import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolPublicEntranceDirectory } from "../src/lib/unknownSchoolEntryPack";

const directory = buildUnknownSchoolPublicEntranceDirectory({
  schoolName: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662",
  majorName: "\u7535\u5b50\u5546\u52a1",
  jobName: "\u7535\u5546\u8fd0\u8425",
  officialDomain: "zkvtc.edu.cn",
});

assert.deepEqual(
  directory.map((group) => group.id),
  ["official-identity", "major-material", "employment-outcome", "campus-recruiting", "salary-jobs"],
  "public entrance directory should group the search flow by user jobs",
);

for (const group of directory) {
  assert.ok(group.label.length >= 2, `${group.id} should have a visible label`);
  assert.ok(group.primaryAction.length > 8, `${group.id} should tell the user what to do next`);
  assert.ok(group.saveFields.length >= 2, `${group.id} should expose fields to save after opening entries`);
  assert.ok(group.entries.length >= 2, `${group.id} should include multiple entry options`);
  assert.ok(
    group.entries.some((entry) => entry.trustLevel === "official" || entry.trustLevel === "authority"),
    `${group.id} should include at least one official or authority entrance`,
  );
  assert.ok(group.entries.every((entry) => entry.url.startsWith("https://")), `${group.id} entries should be links`);
}

const officialIdentity = directory.find((group) => group.id === "official-identity");
assert.ok(officialIdentity?.entries.some((entry) => entry.label.includes("\u9633\u5149\u9ad8\u8003")));
assert.ok(officialIdentity?.entries.some((entry) => entry.query.includes("site:gaokao.chsi.com.cn")));

const majorMaterial = directory.find((group) => group.id === "major-material");
assert.ok(majorMaterial?.entries.some((entry) => entry.query.includes("site:zkvtc.edu.cn")));
assert.ok(majorMaterial?.saveFields.includes("\u6838\u5fc3\u8bfe\u7a0b"));

const salaryJobs = directory.find((group) => group.id === "salary-jobs");
assert.ok(salaryJobs?.entries.some((entry) => entry.label.includes("\u4e2d\u56fd\u516c\u5171\u62db\u8058\u7f51")));
assert.ok(salaryJobs?.saveFields.includes("\u85aa\u8d44\u533a\u95f4"));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function UnknownSchoolSourceTaskFlow", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(
  mainSource.includes("buildUnknownSchoolPublicEntranceDirectory"),
  "main UI should import the public entrance directory helper",
);
assert.ok(
  workbenchSource.includes("const publicEntranceDirectory = buildUnknownSchoolPublicEntranceDirectory({") &&
    workbenchSource.includes("<UnknownSchoolPublicEntranceDirectory"),
  "unknown-school workbench should render a grouped public entrance directory",
);
assert.ok(
  workbenchSource.indexOf("<UnknownSchoolPublicEntranceDirectory") <
    workbenchSource.indexOf("<UnknownSchoolSourceTaskFlow"),
  "entrance directory should appear before the task flow so users can open links first",
);

for (const className of [
  ".unknown-school-public-entrance-directory",
  ".unknown-school-public-entrance-head",
  ".unknown-school-public-entrance-grid",
  ".unknown-school-public-entrance-card",
  ".unknown-school-public-entrance-links",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
