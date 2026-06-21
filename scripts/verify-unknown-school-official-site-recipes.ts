import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolOfficialSiteRecipes,
} from "../src/lib/unknownSchoolEntryPack";

const libSource = readFileSync("src/lib/unknownSchoolEntryPack.ts", "utf8");
const mainSource = readFileSync("src/main.tsx", "utf8");

assert.ok(
  libSource.includes("export type UnknownSchoolOfficialSiteRecipe"),
  "unknown-school entry helper should expose official-site recipe records",
);
assert.ok(
  libSource.includes("export function buildUnknownSchoolOfficialSiteRecipes"),
  "unknown-school entry helper should build official-site follow-up recipes after the official domain is found",
);
assert.ok(
  libSource.includes("site:${safeOfficialDomain}") &&
    libSource.includes("专业设置") &&
    libSource.includes("就业质量报告") &&
    libSource.includes("宣讲会") &&
    libSource.includes("信息公开"),
  "official-site recipes should include site-scoped searches for major, report, campus and disclosure evidence",
);
assert.ok(
  libSource.includes("buildUnknownSchoolOfficialSiteRecipes") &&
    libSource.includes("buildUnknownSchoolEntryPacketText") &&
    libSource.includes("官网站内追查口令"),
  "copyable unknown-school packet should include official-site recipe queries, not only broad search URLs",
);

const sampleEntries = buildUnknownSchoolEntryPack({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
});
const sampleRecipes = buildUnknownSchoolOfficialSiteRecipes({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
  officialDomain: "https://www.zkvtc.edu.cn/xxgk/",
});
const samplePacket = buildUnknownSchoolEntryPacketText({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
  officialDomain: "https://www.zkvtc.edu.cn/xxgk/",
  entries: sampleEntries,
});

assert.ok(
  sampleRecipes.every((recipe) => recipe.query.includes("site:zkvtc.edu.cn")),
  "official-site recipes should normalize pasted official URLs into a clean site: domain",
);
assert.ok(
  samplePacket.includes("site:zkvtc.edu.cn") && !samplePacket.includes("site:已确认官网域名"),
  "copyable unknown-school packet should use the confirmed official domain when available",
);

const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(
  mainSource.includes("buildUnknownSchoolOfficialSiteRecipes") &&
    workbenchSource.includes("const officialSiteRecipes = buildUnknownSchoolOfficialSiteRecipes({") &&
    workbenchSource.includes('className="unknown-school-official-recipes"') &&
    workbenchSource.includes("官网域名确认后"),
  "unknown-school workbench should render official-site recipe cards after the priority entrances",
);
assert.ok(
  mainSource.includes("const [unknownOfficialDomain, setUnknownOfficialDomain] = useState(initialSchoolWorkbenchSnapshot.officialDomain)") &&
    mainSource.includes("officialDomain: unknownOfficialDomain") &&
    mainSource.includes("officialDomain={unknownOfficialDomain}") &&
    mainSource.includes("onOfficialDomainChange={setUnknownOfficialDomain}"),
  "school access panel should keep confirmed official domain in state and use it for the copyable packet",
);
assert.ok(
  workbenchSource.includes("officialDomain,") &&
    workbenchSource.includes("onOfficialDomainChange,") &&
    workbenchSource.includes("officialDomain,") &&
    workbenchSource.includes('className="unknown-school-official-domain"') &&
    workbenchSource.includes("value={officialDomain}") &&
    workbenchSource.includes("onOfficialDomainChange(event.target.value)") &&
    workbenchSource.includes("placeholder=\"例如：www.zkvtc.edu.cn\""),
  "unknown-school workbench should let users paste a confirmed official domain before opening site-scoped searches",
);
assert.ok(
  workbenchSource.indexOf('className="unknown-school-evidence-priority-grid"') <
    workbenchSource.indexOf('className="unknown-school-official-recipes"') &&
    workbenchSource.indexOf('className="unknown-school-official-recipes"') <
      workbenchSource.indexOf('className="unknown-school-evidence-entry-grid"'),
  "official-site recipes should appear after the first-hop entries and before the full broad-search grid",
);
