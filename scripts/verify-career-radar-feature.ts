import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
};

const featurePath = "src/features/radar/CareerRadarPanel.tsx";
const evidencePath = "src/lib/careerRadarEvidence.ts";

assert.ok(existsSync(featurePath), "CareerRadarPanel should live in src/features/radar/CareerRadarPanel.tsx");
assert.ok(existsSync(evidencePath), "career radar evidence helpers should live in src/lib/careerRadarEvidence.ts");

const featureSource = readFileSync(featurePath, "utf8");
const evidenceSource = readFileSync(evidencePath, "utf8");

assert.ok(
  mainSource.includes('import { CareerRadarPanel } from "./features/radar/CareerRadarPanel";'),
  "main.tsx should import CareerRadarPanel from the radar feature module",
);
assert.ok(!mainSource.includes("function CareerRadarPanel("), "main.tsx should not inline CareerRadarPanel");
assert.ok(featureSource.includes("export function CareerRadarPanel"), "radar feature should export CareerRadarPanel");
assert.ok(featureSource.includes("buildCareerRadarEvidence"), "radar feature should use shared evidence helpers");
assert.ok(featureSource.includes("OfficialSearchSessionPanel"), "radar feature should keep the official-source search session UI");
assert.ok(
  evidenceSource.includes("export function buildCareerRadarEvidence"),
  "career radar evidence helper should export buildCareerRadarEvidence",
);
assert.ok(
  evidenceSource.includes("export function getAllAggregatedOfficialJobs"),
  "career radar evidence helper should export official job aggregation",
);
assert.ok(
  packageJson.scripts?.["verify:career-radar"]?.includes("verify-career-radar-feature.ts"),
  "package.json should expose verify:career-radar",
);
