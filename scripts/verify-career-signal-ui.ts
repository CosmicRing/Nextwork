import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const componentPath = "src/features/signals/CareerSignalHubPanel.tsx";
const componentStylePath = "src/features/signals/CareerSignalHubPanel.css";
assert.ok(existsSync(componentPath), "career signal hub should live in src/features/signals");
assert.ok(existsSync(componentStylePath), "career signal hub styles should live beside the feature component");
const componentSource = readFileSync(componentPath, "utf8");
const styleSource = readFileSync(componentStylePath, "utf8");

assert.ok(mainSource.includes("buildCareerSignals"), "main should import and use the career signal builder");
assert.ok(mainSource.includes("summarizeCareerSignals"), "main should import and use the career signal summary");
assert.ok(mainSource.includes('./features/signals/CareerSignalHubPanel'), "main should import the extracted career signal panel");
assert.ok(mainSource.includes('type SalaryAppTab = "signals"'), "salary app tabs should include a career signal tab");
assert.ok(mainSource.includes('id: "signals"'), "salary nav should expose the signal tab");
assert.ok(!mainSource.includes("function CareerSignalHubPanel"), "career signal panel implementation should not stay in main.tsx");
assert.ok(mainSource.includes("<CareerSignalHubPanel"), "salary app should mount the career signal hub panel");
assert.ok(componentSource.includes("export function CareerSignalHubPanel"), "feature module should export CareerSignalHubPanel");
assert.ok(componentSource.includes('./CareerSignalHubPanel.css'), "feature component should import its own styles");
assert.ok(componentSource.includes("careerSignalSummary"), "signal hub should expose summary metrics");
assert.ok(componentSource.includes("career-signal-hub"), "signal hub should have a stable root class");
assert.ok(componentSource.includes("getCareerSignalTypeLabel"), "feature module should own signal display labels");

[
  ".career-signal-hub",
  ".career-signal-metrics",
  ".career-signal-layout",
  ".career-signal-card",
  ".career-signal-taxonomy",
].forEach((className) => {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
});
