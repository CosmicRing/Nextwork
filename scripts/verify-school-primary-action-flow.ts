import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const panelStart = source.indexOf("function SchoolPublicAccessPanel");
const panelEnd = source.indexOf("function SchoolActionCommandPanel", panelStart);
const panelSource = source.slice(panelStart, panelEnd);

assert.ok(source.includes("function SchoolPrimaryActionFlow"), "school page should define a primary action flow");
assert.ok(panelSource.includes("<SchoolPrimaryActionFlow"), "school access panel should render the primary action flow");
assert.ok(
  panelSource.indexOf("<SchoolPublicMajorAccessPanel") <
    panelSource.indexOf("<SchoolPrimaryActionFlow") &&
    panelSource.indexOf("<SchoolPrimaryActionFlow") <
      panelSource.indexOf('className="school-public-access-head"'),
  "public entries should lead the school workflow, then primary action flow, then explanatory copy",
);
assert.ok(source.includes('className="school-primary-action-flow"'), "primary action flow needs a stable wrapper class");
assert.ok(source.includes("school-primary-action-card"), "primary action steps should render as cards");
assert.ok(source.includes("onCopyPacket"), "primary action flow should expose a copy packet action");
assert.ok(source.includes("entryCount") && source.includes("salaryLabel"), "primary action flow should summarize entry count and salary state");
