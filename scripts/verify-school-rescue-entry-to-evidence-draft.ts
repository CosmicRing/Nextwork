import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const stripStart = mainSource.indexOf("function SchoolPublicRescueEntryStrip");
const stripEnd = mainSource.indexOf("function SchoolNextActionBar", stripStart);
const stripSource = mainSource.slice(stripStart, stripEnd);

assert.ok(panelStart > -1 && panelEnd > panelStart, "SchoolPublicAccessPanel should exist");
assert.ok(stripStart > -1 && stripEnd > stripStart, "SchoolPublicRescueEntryStrip should exist");

assert.ok(
  panelSource.includes("const fillDraftFromRescueRoute = (item: SchoolPublicRescueEntryItem) => {") &&
    panelSource.includes("kind: getSchoolManualEvidenceKindForPublicRoute(item.route.id)") &&
    panelSource.includes("title: item.label") &&
    panelSource.includes("item.route.openHint") &&
    panelSource.includes("url: item.route.url") &&
    panelSource.includes("openSchoolEvidenceInboxFoldout()"),
  "school access panel should map a rescue route into the evidence draft and open the inbox",
);

assert.ok(
  panelSource.includes("<SchoolPublicRescueEntryStrip routes={publicSourceRoutes} onUseTemplate={fillDraftFromRescueRoute} />"),
  "school access panel should wire rescue cards to the evidence draft filler",
);

for (const mapping of [
  'routeId === "school-employment-report"',
  'routeId === "school-career-center"',
  'routeId === "job-salary-proxy"',
]) {
  assert.ok(mainSource.includes(mapping), `rescue route evidence kind mapper should include ${mapping}`);
}

assert.ok(stripSource.includes("onUseTemplate: (item: SchoolPublicRescueEntryItem) => void"), "rescue strip should accept a template callback");
assert.ok(stripSource.includes("<article") && stripSource.includes("<a") && stripSource.includes("<button"), "rescue card should keep an external link and a separate evidence action");
assert.ok(stripSource.includes("onClick={() => onUseTemplate(item)}"), "rescue card button should call the evidence action");

for (const className of [
  ".school-public-rescue-entry-card a",
  ".school-public-rescue-entry-card button",
  ".school-public-rescue-entry-actions",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
