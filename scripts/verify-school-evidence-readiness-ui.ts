import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolActionCommandPanel", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(mainSource.includes("buildSchoolEvidenceReadiness"), "main UI should import evidence readiness helper");
assert.ok(panelSource.includes("const evidenceReadiness = buildSchoolEvidenceReadiness"), "school panel should derive evidence readiness");
assert.ok(panelSource.includes("<SchoolEvidenceReadinessPanel"), "school panel should render evidence readiness near the top");
assert.ok(mainSource.includes("function SchoolEvidenceReadinessPanel"), "readiness component should exist");
assert.ok(mainSource.includes("能不能比较") && mainSource.includes("证据结论"), "readiness component should use direct user-facing copy");
assert.ok(mainSource.includes("readiness.confirmedKinds") && mainSource.includes("readiness.missingKinds"), "readiness UI should expose covered and missing evidence");
assert.ok(styleSource.includes(".school-evidence-readiness-panel"), "readiness panel should have dedicated styles");

