import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(mainSource.includes("buildSchoolNextAction"), "main UI should import the next-action helper");
assert.ok(panelSource.includes("const nextAction = buildSchoolNextAction"), "school access panel should derive one next action");
assert.ok(panelSource.includes("<SchoolNextActionBar"), "school access panel should render the next action bar near the top");
assert.ok(mainSource.includes("function SchoolNextActionBar"), "next action bar component should exist");
assert.ok(mainSource.includes("下一步只做这件事"), "next action bar should use direct user-facing language");
assert.ok(mainSource.includes("nextAction.primaryLabel"), "next action bar should render a primary action");
assert.ok(styleSource.includes(".school-next-action-bar"), "next action bar should have dedicated styles");

