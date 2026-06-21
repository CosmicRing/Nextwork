import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

const switchIndex = panelSource.indexOf("<SchoolWorkbenchSchoolSwitch");
const queryBoxIndex = panelSource.indexOf('className="school-public-query-box"');
const accessIndex = panelSource.indexOf("<SchoolPublicMajorAccessPanel");
const flowIndex = panelSource.indexOf("<SchoolPrimaryActionFlow");

assert.ok(switchIndex > -1, "school workbench should start with a school switch");
assert.ok(queryBoxIndex > -1, "school workbench should expose major/job inputs");
assert.ok(accessIndex > -1, "school workbench should expose public entry links");
assert.ok(flowIndex > -1, "school workbench should still keep the primary action flow");
assert.ok(
  switchIndex < queryBoxIndex && queryBoxIndex < accessIndex && accessIndex < flowIndex,
  "school workbench should order controls as school switch, major/job inputs, public entries, then workflow summary",
);
assert.ok(
  panelSource.includes("value={majorQuery}") &&
    panelSource.includes("onMajorQueryChange(event.target.value)") &&
    panelSource.includes("value={jobQuery}") &&
    panelSource.includes("onJobQueryChange(event.target.value)"),
  "major/job inputs should keep writing through to the shared public search state",
);
assert.ok(
  styleSource.includes(".school-public-query-box") &&
    styleSource.includes(".school-public-query-box input") &&
    styleSource.includes(".school-public-quick-majors"),
  "major/job query controls should keep dedicated layout styles",
);
