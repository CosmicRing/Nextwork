import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);

const slotCardsStart = accessSource.indexOf("const evidenceSlotCards");
const slotCardsEnd = accessSource.indexOf("const lookupActionQueue", slotCardsStart);
const slotCardsSource = accessSource.slice(slotCardsStart, slotCardsEnd);

assert.ok(accessStart > -1 && accessEnd > accessStart, "SchoolPublicAccessPanel should exist");
assert.ok(slotCardsStart > -1 && slotCardsEnd > slotCardsStart, "evidence slot card model should exist");

assert.ok(
  accessSource.includes("const trustedManualEvidenceKindSet = new Set(trustedManualEvidenceItems.map((item) => item.kind))"),
  "school access panel should build evidence slot coverage from trusted manual evidence only",
);

assert.ok(
  !accessSource.includes("const manualEvidenceKindSet = new Set(manualEvidenceItems.map((item) => item.kind))"),
  "school access panel should not build slot coverage from all saved evidence",
);

for (const kind of ["major", "report", "campus", "salary"]) {
  assert.ok(
    slotCardsSource.includes(`trustedManualEvidenceKindSet.has("${kind}")`),
    `evidence slot ${kind} should check trusted evidence, not weak evidence`,
  );
  assert.ok(
    !slotCardsSource.includes(`manualEvidenceKindSet.has("${kind}")`),
    `evidence slot ${kind} should not be covered by weak saved evidence`,
  );
}
