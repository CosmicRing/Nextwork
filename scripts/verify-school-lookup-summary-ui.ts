import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const summaryStart = mainSource.indexOf("function SchoolLookupSummaryStrip");
const summaryEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", summaryStart);
const summarySource = mainSource.slice(summaryStart, summaryEnd);

assert.ok(summaryStart > -1, "school UI should define a compact lookup summary strip");
assert.ok(
  panelSource.includes("const lookupSummaryCards = [") &&
    panelSource.includes('id: "school-coverage"') &&
    panelSource.includes('id: "entry-coverage"') &&
    panelSource.includes('id: "direction-coverage"') &&
    panelSource.includes('id: "salary-coverage"'),
  "school access panel should derive four concise lookup summary cards",
);
assert.ok(
  panelSource.includes("<SchoolLookupSummaryStrip cards={lookupSummaryCards} />"),
  "school access panel should render the lookup summary strip",
);

const officialStripIndex = panelSource.indexOf("<SchoolOfficialEntryStrip");
const lookupSummaryIndex = panelSource.indexOf("<SchoolLookupSummaryStrip");
const unknownWorkbenchIndex = panelSource.indexOf("<UnknownSchoolEvidenceWorkbench");
const queryBoxIndex = panelSource.indexOf('className="school-public-query-box"');
const launcherIndex = panelSource.indexOf("<SchoolOfficialEntranceLauncher");

assert.ok(officialStripIndex > -1 && lookupSummaryIndex > -1 && unknownWorkbenchIndex > -1 && queryBoxIndex > -1 && launcherIndex > -1);
assert.ok(
  queryBoxIndex < launcherIndex &&
    launcherIndex < officialStripIndex &&
    officialStripIndex < lookupSummaryIndex &&
    lookupSummaryIndex < unknownWorkbenchIndex,
  "lookup summary should follow the query-fed entrance launcher and direct entrances before the dense unknown-school panel",
);

assert.ok(
  summarySource.includes('className="school-lookup-summary-strip"') &&
    summarySource.includes('className={`school-lookup-summary-card ${card.state}`}') &&
    summarySource.includes("cards.map((card)") &&
    summarySource.includes("card.value") &&
    summarySource.includes("card.detail"),
  "lookup summary component should render compact stateful cards",
);

for (const className of [
  ".school-lookup-summary-strip",
  ".school-lookup-summary-card",
  ".school-lookup-summary-card.ready",
  ".school-lookup-summary-card.missing",
  ".school-lookup-summary-card.proxy",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
