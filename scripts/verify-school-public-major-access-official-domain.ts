import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolPublicMajorAccessEntries } from "../src/lib/schoolPublicMajorAccess";

const entries = buildSchoolPublicMajorAccessEntries({
  schoolName: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662",
  majorName: "\u62a4\u7406",
  officialDomain: "\u5b98\u7f51\uff1ahttps://www.zkvtc.cn/xxgk/",
  officialLinks: [],
});

const siteScopedEntries = entries.filter((entry) => entry.query?.includes("site:zkvtc.cn"));

assert.ok(
  siteScopedEntries.length >= 4,
  "confirmed official domain should create multiple site-scoped public major access entries",
);
assert.ok(
  siteScopedEntries.every((entry) => decodeURIComponent(entry.url).includes("site:zkvtc.cn")),
  "site-scoped public major access entries should open searches under the confirmed official domain",
);
assert.ok(
  siteScopedEntries.some((entry) => entry.query?.includes("\u62a4\u7406") && entry.query.includes("\u4e13\u4e1a")),
  "site-scoped public major access should include major/admissions discovery",
);
assert.ok(
  siteScopedEntries.some((entry) => entry.query?.includes("\u5c31\u4e1a") || entry.query?.includes("\u62a5\u544a")),
  "site-scoped public major access should include employment report discovery",
);

const mainSource = readFileSync("src/main.tsx", "utf8");

assert.ok(
  mainSource.includes("buildSchoolPublicMajorAccessEntries({") &&
    mainSource.includes("officialDomain: unknownOfficialDomain"),
  "school workbench should pass the confirmed official domain into public major access entries",
);
