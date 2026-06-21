import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildSchoolOfficialEntranceLauncherCards,
  buildSchoolPublicMajorAccessEntries,
} from "../src/lib/schoolPublicMajorAccess";

const siteScopedEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  officialDomain: "https://www.zkvtc.edu.cn/xxgk/",
  officialLinks: [],
});
const siteScopedCards = buildSchoolOfficialEntranceLauncherCards(siteScopedEntries);

assert.equal(siteScopedCards.length, 4, "launcher should keep the first screen to four entrance cards");
assert.deepEqual(
  siteScopedCards.map((card) => card.slot),
  ["major", "admissions", "report", "campus"],
  "launcher should order entrances by the evidence a normal student needs first",
);
assert.ok(
  siteScopedCards.filter((card) => card.query?.includes("site:zkvtc.edu.cn")).length >= 3,
  "confirmed school official domain should be preferred over broad search cards",
);
assert.ok(
  siteScopedCards.every((card) => card.saveHint && card.acceptedEvidence && card.url.startsWith("https://")),
  "every launcher card should say what to save and open a safe public entry URL",
);

const officialEmploymentEntries = buildSchoolPublicMajorAccessEntries({
  schoolName: "郑州工商学院",
  majorName: "电子商务",
  officialLinks: [
    {
      label: "就业中心",
      url: "https://job.example.edu.cn/",
      kind: "employment",
      note: "学校就业中心宣讲会和双选会入口",
    },
  ],
});
const officialEmploymentCards = buildSchoolOfficialEntranceLauncherCards(officialEmploymentEntries);
const campusCard = officialEmploymentCards.find((card) => card.slot === "campus");
assert.equal(campusCard?.type, "official", "official employment links should feed the campus-recruiting entrance");
assert.equal(campusCard?.url, "https://job.example.edu.cn/");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

const queryBoxIndex = panelSource.indexOf('className="school-public-query-box"');
const launcherIndex = panelSource.indexOf("<SchoolOfficialEntranceLauncher");
const sourceStripIndex = panelSource.indexOf("<SchoolOfficialEntryStrip");
const summaryIndex = panelSource.indexOf("<SchoolLookupSummaryStrip");

assert.ok(launcherIndex > -1, "school workbench should render an official entrance launcher");
assert.ok(
  queryBoxIndex < launcherIndex && launcherIndex < sourceStripIndex && sourceStripIndex < summaryIndex,
  "major/job query should feed the entrance launcher before secondary source summaries",
);
assert.ok(
  styleSource.includes(".school-official-entrance-launcher") &&
    styleSource.includes(".school-official-entrance-card") &&
    styleSource.includes(".school-official-entrance-save"),
  "launcher should have dedicated compact first-screen styles",
);
