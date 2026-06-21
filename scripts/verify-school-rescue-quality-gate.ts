import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
};

const requiredFragments = [
  "verify-school-first-entry.ts",
  "verify-school-aggregation-report.ts",
  "verify-ordinary-school-entry-coverage.ts",
  "verify-unknown-school-entry-pack.ts",
  "verify-unknown-school-type-strategy.ts",
  "verify-unknown-school-direction-presets.ts",
  "verify-school-public-source-routes.ts",
  "verify-school-evidence-readiness.ts",
  "verify-school-next-action.ts",
  "verify-school-action-command.ts",
  "verify-school-action-queue-ui.ts",
  "verify-school-evidence-gap-priority-ui.ts",
  "verify-school-weak-evidence-promotion-hints.ts",
  "verify-school-weak-evidence-upgrade-action-ui.ts",
  "verify-miniprogram-ordinary-school-rescue.ts",
  "verify-miniprogram-ordinary-school-first-samples.ts",
  "verify-miniprogram-selected-major-syncs-rescue-packet.ts",
  "verify-miniprogram-known-school-official-rescue-entries.ts",
  "verify-miniprogram-unknown-school-search.ts",
  "verify-miniprogram-unknown-major-focus.ts",
  "verify-miniprogram-major-presets.ts",
  "verify-miniprogram-evidence-inbox.ts",
  "verify-miniprogram-evidence-trust-gate.ts",
  "verify-miniprogram-evidence-next-source-actions.ts",
  "verify-miniprogram-evidence-draft-template.ts",
  "verify-miniprogram-evidence-inbox-restores-progress.ts",
  "verify-miniprogram-evidence-removal-recalculates-progress.ts",
  "verify-miniprogram-evidence-progress.ts",
  "verify-miniprogram-progress-brief.ts",
  "verify-school-candidate-compare-report.ts",
  "verify-school-workbench-local-persistence.ts",
  "verify-vite-mobile-bundle-splitting.ts",
  "verify-miniprogram-candidate-compare.ts",
  "verify-miniprogram-candidate-verdict.ts",
  "verify-miniprogram-radar-ranking.ts",
  "verify-miniprogram-company-directory-hierarchy.ts",
  "verify-miniprogram-company-directory-coverage.ts",
  "verify-wechat-miniprogram-cli-runner.ts",
  "verify-wechat-miniprogram-package.ts",
];

const script = packageJson.scripts?.["verify:school-rescue"];

assert.ok(script, "package.json must expose verify:school-rescue for the ordinary-school rescue path");

for (const fragment of requiredFragments) {
  assert.ok(
    script.includes(fragment),
    `verify:school-rescue must include ${fragment}`,
  );
}

assert.ok(
  script.includes("verify-school-rescue-quality-gate.ts"),
  "verify:school-rescue must run this quality gate so future edits cannot silently drop rescue checks",
);
