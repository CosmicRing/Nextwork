import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolOfficialSiteRecipes,
  extractUnknownSchoolOfficialDomain,
} from "../src/lib/unknownSchoolEntryPack";

assert.equal(extractUnknownSchoolOfficialDomain("https://www.zkvtc.edu.cn/xxgk/"), "zkvtc.edu.cn");
assert.equal(extractUnknownSchoolOfficialDomain("官网：https://zsb.henu.edu.cn/zsxx.htm"), "zsb.henu.edu.cn");
assert.equal(extractUnknownSchoolOfficialDomain("www.zzuli.edu.cn"), "zzuli.edu.cn");
assert.equal(extractUnknownSchoolOfficialDomain("先看学校官网，再查就业报告"), "");

const recipes = buildUnknownSchoolOfficialSiteRecipes({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  officialDomain: "官网：https://www.zkvtc.edu.cn/xxgk/",
});
assert.ok(
  recipes.every((recipe) => recipe.query.includes("site:zkvtc.edu.cn")),
  "official-site recipes should use the extracted domain from pasted text",
);

const packet = buildUnknownSchoolEntryPacketText({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  officialDomain: "官网：https://www.zkvtc.edu.cn/xxgk/",
  entries: buildUnknownSchoolEntryPack({
    schoolName: "周口职业技术学院",
    majorName: "护理",
    jobName: "护士",
  }),
});
assert.ok(packet.includes("site:zkvtc.edu.cn"), "copyable query packet should use the extracted site domain");

const mainSource = readFileSync("src/main.tsx", "utf8");
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);
const styleSource = readFileSync("src/styles.css", "utf8");

assert.ok(
  mainSource.includes("extractUnknownSchoolOfficialDomain"),
  "main UI should import the official-domain extractor",
);
assert.ok(
  workbenchSource.includes("const normalizedOfficialDomain = extractUnknownSchoolOfficialDomain(officialDomain)") &&
    workbenchSource.includes("site:{normalizedOfficialDomain}") &&
    workbenchSource.includes("unknown-school-domain-detected"),
  "unknown school workbench should show the detected site: domain beside the paste box",
);
assert.ok(
  styleSource.includes(".unknown-school-domain-detected"),
  "detected official domain indicator should have dedicated styles",
);
