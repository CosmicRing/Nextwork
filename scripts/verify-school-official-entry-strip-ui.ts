import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessPanelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessPanelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessPanelStart);
const accessPanelSource = mainSource.slice(accessPanelStart, accessPanelEnd);
const stripStart = mainSource.indexOf("function SchoolOfficialEntryStrip");
const stripEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", stripStart);
const stripSource = mainSource.slice(stripStart, stripEnd);

assert.ok(stripStart > -1, "school UI should define a direct official entry strip");
assert.ok(
  accessPanelSource.includes(
    "<SchoolOfficialEntryStrip routes={publicSourceRoutes} officialLinks={selectedSchool?.officialLinks ?? []} />",
  ),
  "school access panel should pass known-school official links into the direct entry strip",
);

const switchIndex = accessPanelSource.indexOf("<SchoolWorkbenchSchoolSwitch");
const stripIndex = accessPanelSource.indexOf("<SchoolOfficialEntryStrip");
const queryIndex = accessPanelSource.indexOf('className="school-public-query-box"');
const launcherIndex = accessPanelSource.indexOf("<SchoolOfficialEntranceLauncher");
const runwayIndex = accessPanelSource.indexOf("<SchoolRescueActionRunway");
const sourceRouteIndex = accessPanelSource.indexOf("<SchoolPublicSourceRoutePanel");

assert.ok(
  switchIndex > -1 &&
    stripIndex > -1 &&
    queryIndex > -1 &&
    launcherIndex > -1 &&
    runwayIndex > -1 &&
    sourceRouteIndex > -1,
);
assert.ok(
  switchIndex < queryIndex &&
    queryIndex < stripIndex &&
    stripIndex < runwayIndex &&
    stripIndex < launcherIndex &&
    stripIndex < sourceRouteIndex,
  "direct official entry strip should appear immediately after school inputs, before rescue process cards and dense evidence panels",
);

for (const routeId of [
  "chsi-school-library",
  "school-admissions-major",
  "school-major-plan",
  "chsi-major-library",
  "school-employment-report",
  "school-career-center",
]) {
  assert.ok(stripSource.includes(`"${routeId}"`), `entry strip should include ${routeId}`);
}

assert.ok(
  stripSource.includes("route.openHint") && stripSource.includes("route.url"),
  "entry strip links should preserve official/search URLs and usage hints",
);
assert.ok(
  stripSource.includes("officialLinks") &&
    stripSource.includes("official.url") &&
    stripSource.includes("official.note") &&
    stripSource.includes("official.kind"),
  "entry strip should prefer known-school direct official links before falling back to search routes",
);
assert.ok(
  !stripSource.includes("<p>{route.target}</p>") && !stripSource.includes("saveFields"),
  "entry strip should stay action-first instead of rendering long evidence text",
);

const ztbu = schoolOutcomeProfiles.find((school) => school.name === "郑州工商学院");
assert.ok(ztbu, "ordinary-school sample should be available for direct official link coverage");
assert.ok(
  ztbu.officialLinks.some((link) => link.url === "https://www.ztbu.edu.cn/") &&
    ztbu.officialLinks.some((link) => link.url === "https://zsb.ztbu.edu.cn/") &&
    ztbu.officialLinks.some((link) => link.url === "https://zzgsxy.goworkla.cn/"),
  "ordinary-school samples should contain direct official homepage, admissions, and employment URLs",
);

for (const className of [
  ".school-official-entry-strip",
  ".school-official-entry-strip-head",
  ".school-official-entry-grid",
  ".school-official-entry-card",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
