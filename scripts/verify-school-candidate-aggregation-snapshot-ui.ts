import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const candidateTypeStart = mainSource.indexOf("type SchoolInfoCandidate");
const candidateTypeEnd = mainSource.indexOf("type SchoolEvidenceTask", candidateTypeStart);
const candidateTypeSource = mainSource.slice(candidateTypeStart, candidateTypeEnd);

const addCandidateStart = mainSource.indexOf("const addCurrentCandidate = () =>");
const addCandidateEnd = mainSource.indexOf("const removeCandidate", addCandidateStart);
const addCandidateSource = mainSource.slice(addCandidateStart, addCandidateEnd);

const componentStart = mainSource.indexOf("function SchoolCandidateComparePanel");
const componentEnd = mainSource.indexOf("function buildSchoolInfoCandidate", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(candidateTypeStart > -1 && candidateTypeEnd > candidateTypeStart, "SchoolInfoCandidate type should exist");
assert.ok(addCandidateStart > -1 && addCandidateEnd > addCandidateStart, "addCurrentCandidate should exist");
assert.ok(componentStart > -1 && componentEnd > componentStart, "SchoolCandidateComparePanel should exist");

for (const field of [
  "aggregationStatusLabel",
  "aggregationConfirmedCount",
  "aggregationLeadCount",
  "aggregationWeakCount",
  "aggregationMissingSlots",
  "aggregationNextAction",
]) {
  assert.ok(candidateTypeSource.includes(field), `saved candidates should persist ${field}`);
}

for (const assignment of [
  "aggregationStatusLabel: evidenceAggregationBrief.statusLabel",
  "aggregationConfirmedCount: evidenceAggregationBrief.confirmedLines.length",
  "aggregationLeadCount: evidenceAggregationBrief.leadLines.length",
  "aggregationWeakCount: evidenceAggregationBrief.weakLines.length",
  "aggregationMissingSlots: evidenceAggregationBrief.missingSlots",
  "aggregationNextAction: evidenceAggregationBrief.nextActions[0]",
]) {
  assert.ok(addCandidateSource.includes(assignment), `addCurrentCandidate should snapshot ${assignment}`);
}

assert.ok(componentSource.includes("school-candidate-evidence-snapshot"), "candidate cards should render an evidence snapshot block");
assert.ok(componentSource.includes("candidate.aggregationStatusLabel"), "candidate cards should show the saved aggregation status");
assert.ok(componentSource.includes("candidate.aggregationConfirmedCount"), "candidate cards should show trusted evidence count");
assert.ok(componentSource.includes("candidate.aggregationLeadCount"), "candidate cards should show search lead count");
assert.ok(componentSource.includes("candidate.aggregationWeakCount"), "candidate cards should show weak evidence count");
assert.ok(componentSource.includes("candidate.aggregationMissingSlots"), "candidate cards should show saved missing evidence slots");
assert.ok(componentSource.includes("candidate.aggregationNextAction"), "candidate cards should show the saved next action");

for (const label of ["可采信", "待复核", "弱证据", "缺口", "下一步"]) {
  assert.ok(componentSource.includes(label), `candidate snapshot should include label ${label}`);
}

for (const className of [
  ".school-candidate-evidence-snapshot",
  ".school-candidate-evidence-metrics",
  ".school-candidate-evidence-missing",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
