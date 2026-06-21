import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolLookupActionQueue", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);

const briefStart = mainSource.indexOf("function SchoolEvidenceRescueBrief");
const briefEnd = mainSource.indexOf("function SchoolPublicRescueEntryStrip", briefStart);
const briefSource = mainSource.slice(briefStart, briefEnd);

const foldoutStart = mainSource.indexOf("function SchoolPublicFoldout");
const foldoutEnd = mainSource.indexOf("function SchoolKnownDetailFoldout", foldoutStart);
const foldoutSource = mainSource.slice(foldoutStart, foldoutEnd);

assert.ok(accessStart > -1 && accessEnd > accessStart, "school access panel should exist");
assert.ok(briefStart > -1 && briefEnd > briefStart, "rescue brief should exist");
assert.ok(foldoutStart > -1 && foldoutEnd > foldoutStart, "public foldout should exist");

for (const token of [
  "const openCandidateCompareFoldout = () =>",
  "addCurrentCandidate();",
  "openCandidateCompareFoldout();",
  "candidateCount={candidates.length}",
  "onSaveCandidate={saveCurrentCandidateFromRescueBrief}",
]) {
  assert.ok(accessSource.includes(token), `school access panel should include ${token}`);
}

for (const token of [
  "candidateCount: number",
  "onSaveCandidate: () => void",
  "candidateCount ? `${candidateCount} 个候选` : \"还没保存候选\"",
  "onClick={onSaveCandidate}",
  "存入对比",
]) {
  assert.ok(briefSource.includes(token), `rescue brief should expose save candidate UI: ${token}`);
}

assert.ok(
  accessSource.includes('foldoutId="candidate-compare"'),
  "candidate comparison foldout should have a stable id for direct opening",
);
assert.ok(
  foldoutSource.includes("foldoutId?: string") && foldoutSource.includes("data-school-foldout={foldoutId}"),
  "SchoolPublicFoldout should expose a stable data attribute",
);

for (const className of [
  ".school-evidence-rescue-brief-actions small",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
