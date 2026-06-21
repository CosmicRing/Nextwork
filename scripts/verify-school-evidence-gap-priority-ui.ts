import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolEvidenceGapPriorityStrip", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function SchoolEvidenceGapPriorityStrip");
const componentEnd = mainSource.indexOf("function SchoolLookupActionQueue", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(
  accessSource.includes("const evidenceGapPrioritySlots = evidenceSlotCards.filter((slot) => !slot.isCovered).slice(0, 3);"),
  "school access panel should derive the first three missing evidence slots",
);

const lookupIndex = accessSource.indexOf("<SchoolLookupSummaryStrip");
const gapIndex = accessSource.indexOf("<SchoolEvidenceGapPriorityStrip");
const slotIndex = accessSource.indexOf("<SchoolEvidenceSlotStrip");
assert.ok(
  lookupIndex > -1 && gapIndex > lookupIndex && slotIndex > gapIndex,
  "gap priority strip should sit after the summary and before the full evidence slot strip",
);

for (const token of [
  'className="school-evidence-gap-priority-strip"',
  'className="school-evidence-gap-priority-card"',
  'className="school-evidence-gap-priority-actions"',
  'slots.length ? "先补这些证据" : "四槽已可判断"',
  "slots.map((slot)",
  "slot.status",
  "slot.url",
  "onOpenEvidenceInbox",
]) {
  assert.ok(componentSource.includes(token), `gap priority component should include ${token}`);
}

for (const className of [
  ".school-evidence-gap-priority-strip",
  ".school-evidence-gap-priority-head",
  ".school-evidence-gap-priority-grid",
  ".school-evidence-gap-priority-card",
  ".school-evidence-gap-priority-actions",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
