import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolPublicEntranceDirectory } from "../src/lib/unknownSchoolEntryPack";

const directory = buildUnknownSchoolPublicEntranceDirectory({
  schoolName: "周口职业技术学院",
  majorName: "电子商务",
  jobName: "电商运营",
  officialDomain: "zkvtc.edu.cn",
});

const allEntries = directory.flatMap((group) => group.entries.map((entry) => ({ groupId: group.id, ...entry })));
assert.ok(allEntries.length >= 16, "directory should expose enough entries to be useful after grouping");

for (const entry of allEntries) {
  assert.ok(entry.url.startsWith("https://"), `${entry.id} should only open HTTPS URLs`);
  assert.ok(!/^javascript:|^data:|^file:/i.test(entry.url), `${entry.id} should not expose unsafe URL schemes`);
  assert.ok(entry.query.trim().length >= 8, `${entry.id} should keep a visible query for user inspection`);
  assert.ok(
    ["official", "authority", "search"].includes(entry.trustLevel),
    `${entry.id} should carry an explicit safety/trust level`,
  );
}

const mainSource = readFileSync("src/main.tsx", "utf8");
const componentStart = mainSource.indexOf("function UnknownSchoolHierarchicalEntranceDirectory");
const componentEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(
  mainSource.includes("function getUnknownSchoolExternalLinkSafetyLabel"),
  "UI should centralize external-link safety labels",
);
assert.ok(
  componentSource.includes("rel=\"noreferrer\"") && componentSource.includes("target=\"_blank\""),
  "external directory links should use a safe browser-opening pattern",
);
assert.ok(
  componentSource.includes("只打开 HTTPS") && componentSource.includes("官网/权威优先"),
  "hierarchical directory should show a visible safety review note",
);

