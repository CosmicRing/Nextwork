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

assert.ok(accessStart > -1 && accessEnd > accessStart, "school access panel should exist");
assert.ok(briefStart > -1 && briefEnd > briefStart, "school evidence rescue brief component should exist");

const slotIndex = accessSource.indexOf("<SchoolEvidenceSlotStrip");
const actionQueueIndex = accessSource.indexOf("<SchoolLookupActionQueue");
const rescueBriefIndex = accessSource.indexOf("<SchoolEvidenceRescueBrief");
const nextActionIndex = accessSource.indexOf("<SchoolNextActionBar");
assert.ok(slotIndex > -1 && actionQueueIndex > -1 && rescueBriefIndex > -1 && nextActionIndex > -1, "evidence slots, action queue, rescue brief, and next action should all render");
assert.ok(
  slotIndex < actionQueueIndex && actionQueueIndex < rescueBriefIndex && rescueBriefIndex < nextActionIndex,
  "rescue brief should sit after first evidence tasks and before the next-action bar",
);

for (const prop of [
  "readiness={evidenceReadiness}",
  "aggregationBrief={evidenceAggregationBrief}",
  "coverage={manualEvidenceCoverage}",
  "onOpenEvidenceInbox={openSchoolEvidenceInboxFoldout}",
  "onOpenCareerRadar={openCareerRadarForCurrentDirection}",
]) {
  assert.ok(accessSource.includes(prop), `rescue brief should receive ${prop}`);
}

for (const token of [
  "readiness: SchoolEvidenceReadiness",
  "aggregationBrief: SchoolEvidenceAggregationBrief",
  "coverage: SchoolManualEvidenceCoverage",
  'className={`school-evidence-rescue-brief rescue-${aggregationBrief.status}`}',
  "aggregationBrief.statusLabel",
  "aggregationBrief.confirmedLines.length",
  "aggregationBrief.leadLines.length",
  "aggregationBrief.weakLines.length",
  "aggregationBrief.missingSlots",
  "aggregationBrief.nextActions[0]",
  "onOpenEvidenceInbox",
  "onOpenCareerRadar",
]) {
  assert.ok(briefSource.includes(token), `rescue brief should include ${token}`);
}

for (const className of [
  ".school-evidence-rescue-brief",
  ".school-evidence-rescue-brief-head",
  ".school-evidence-rescue-brief-grid",
  ".school-evidence-rescue-brief-actions",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
