import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const candidateTypeStart = mainSource.indexOf("type SchoolInfoCandidate");
const candidateTypeEnd = mainSource.indexOf("type SchoolEvidenceTask", candidateTypeStart);
const candidateTypeSource = mainSource.slice(candidateTypeStart, candidateTypeEnd);

const panelCallStart = mainSource.indexOf("<SchoolCandidateComparePanel");
const panelCallEnd = mainSource.indexOf("/>", panelCallStart);
const panelCallSource = mainSource.slice(panelCallStart, panelCallEnd);

const componentStart = mainSource.indexOf("function SchoolCandidateComparePanel");
const componentEnd = mainSource.indexOf("function buildSchoolInfoCandidate", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(candidateTypeStart > -1 && candidateTypeEnd > candidateTypeStart, "SchoolInfoCandidate type should exist");
assert.ok(panelCallStart > -1 && panelCallEnd > panelCallStart, "SchoolCandidateComparePanel call should exist");
assert.ok(componentStart > -1 && componentEnd > componentStart, "SchoolCandidateComparePanel component should exist");

for (const field of ["readinessTier", "readinessTitle", "readinessAdvice", "readinessMissingKinds"]) {
  assert.ok(candidateTypeSource.includes(field), `saved candidates should keep ${field} as a readiness snapshot`);
}

assert.ok(
  panelCallSource.includes("readiness={evidenceReadiness}"),
  "save-and-compare panel should receive the current evidence readiness gate",
);

assert.ok(
  mainSource.includes("readinessTier: evidenceReadiness.tier") &&
    mainSource.includes("readinessTitle: evidenceReadiness.title") &&
    mainSource.includes("readinessAdvice: evidenceReadiness.primaryAdvice") &&
    mainSource.includes("readinessMissingKinds: evidenceReadiness.missingKinds"),
  "adding a candidate should persist the readiness state seen by the user",
);

assert.ok(
  componentSource.includes("readiness: SchoolEvidenceReadiness") &&
    componentSource.includes("school-candidate-readiness-gate") &&
    componentSource.includes("readiness.title") &&
    componentSource.includes("readiness.primaryAdvice") &&
    componentSource.includes("readiness.missingKinds"),
  "candidate compare panel should render a visible readiness gate before saving",
);

assert.ok(
  componentSource.includes('readiness.tier === "not-ready" ? "先存草稿" : "加入当前方案"'),
  "not-ready candidates should be saved as drafts instead of looking like formal comparison entries",
);

assert.ok(
  componentSource.includes("candidate.readinessTitle") &&
    componentSource.includes("candidate.readinessAdvice") &&
    componentSource.includes("candidate.readinessMissingKinds"),
  "saved comparison cards should show the readiness snapshot and remaining evidence gaps",
);

for (const className of [
  ".school-candidate-readiness-gate",
  ".school-candidate-readiness-gate.not-ready",
  ".school-candidate-readiness-gate.ready-to-compare",
  ".school-candidate-readiness-missing",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
