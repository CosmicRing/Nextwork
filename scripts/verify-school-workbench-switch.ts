import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const explorerStart = mainSource.indexOf("function SchoolMajorExplorer");
const explorerEnd = mainSource.indexOf("type SchoolAccessLink", explorerStart);
const explorerSource = mainSource.slice(explorerStart, explorerEnd);

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolActionCommandPanel", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(mainSource.includes("function SchoolWorkbenchSchoolSwitch"), "school workbench should define a top school switch control");
assert.ok(explorerSource.includes("schoolQuery={schoolQuery}"), "school access panel should receive the shared school query state");
assert.ok(
  explorerSource.includes("onSchoolQueryChange={setSchoolQuery}"),
  "school access panel should update the shared school query state",
);
assert.ok(
  panelSource.includes("<SchoolWorkbenchSchoolSwitch"),
  "school access panel should render the school switch inside the main workbench",
);
assert.ok(
  panelSource.indexOf("<SchoolWorkbenchSchoolSwitch") < panelSource.indexOf("<SchoolPublicMajorAccessPanel") &&
    panelSource.indexOf("<SchoolPublicMajorAccessPanel") < panelSource.indexOf("<SchoolPrimaryActionFlow"),
  "school switch should appear before the public entry grid, then the primary action flow",
);
assert.ok(
  panelSource.includes("onSchoolQueryChange(event.target.value)"),
  "school switch input should write through to the shared school query state",
);
assert.ok(
  mainSource.includes('className="school-workbench-school-switch"') &&
    mainSource.includes('className="school-workbench-school-switch-status"'),
  "school switch should expose stable wrapper and status classes for layout verification",
);
assert.ok(
  styleSource.includes(".school-workbench-school-switch") &&
    styleSource.includes(".school-workbench-school-switch input") &&
    styleSource.includes(".school-workbench-school-switch-status"),
  "school switch should have dedicated styles for desktop and mobile layout",
);
