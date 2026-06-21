import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolPublicEntranceDirectory,
  type UnknownSchoolPublicEntranceDirectoryGroup,
} from "../src/lib/unknownSchoolEntryPack";

const directory = buildUnknownSchoolPublicEntranceDirectory({
  schoolName: "周口职业技术学院",
  majorName: "电子商务",
  jobName: "电商运营",
  officialDomain: "https://www.zkvtc.edu.cn/zs/",
});

const majorMaterial = directory.find((group) => group.id === "major-material");
assert.ok(majorMaterial, "directory should expose a major-material group");
const majorMaterialGroup = majorMaterial as UnknownSchoolPublicEntranceDirectoryGroup;

const expectedOfficialEntrances = [
  "招生网专业介绍",
  "教务处培养方案",
  "二级学院专业页",
  "信息公开专业目录",
];

for (const label of expectedOfficialEntrances) {
  const entry = majorMaterialGroup.entries.find((item) => item.label === label);
  assert.ok(entry, `major-material should include ${label}`);
  assert.equal(entry.trustLevel, "official", `${label} should be treated as an official-site entrance`);
  assert.ok(entry.query.includes("site:zkvtc.edu.cn"), `${label} should use the normalized official domain`);
  assert.ok(entry.query.includes("电子商务"), `${label} should preserve the selected major`);
  assert.ok(entry.url.startsWith("https://www.bing.com/search?"), `${label} should be a clickable search entry`);
}

assert.ok(
  majorMaterialGroup.entries.some((entry) => entry.label.includes("阳光高考")),
  "major-material should still include the authority professional database",
);
assert.ok(
  majorMaterialGroup.entries.length >= 7,
  "major-material should include enough official entrances for ordinary schools instead of one generic search",
);

const mainSource = readFileSync("src/main.tsx", "utf8");
const directoryStart = mainSource.indexOf("function UnknownSchoolPublicEntranceDirectory");
const directoryEnd = mainSource.indexOf("function getUnknownSchoolEntranceTrustLabel", directoryStart);
const directorySource = mainSource.slice(directoryStart, directoryEnd);

assert.ok(
  directorySource.includes("group.entries.map((entry)") || directorySource.includes("group.entries.slice(0, 6).map((entry)"),
  "public entrance UI should render the expanded entrance set, not only the first four links",
);
assert.ok(
  !directorySource.includes("group.entries.slice(0, 4)"),
  "public entrance UI should not hide expanded professional entrances behind a four-item slice",
);
