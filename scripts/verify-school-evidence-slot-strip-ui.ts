import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const componentStart = mainSource.indexOf("function SchoolEvidenceSlotStrip");
const componentEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(panelStart > -1 && panelEnd > panelStart, "SchoolPublicAccessPanel should exist");
assert.ok(componentStart > -1 && componentEnd > componentStart, "SchoolEvidenceSlotStrip should exist as a standalone component");
assert.ok(
  panelSource.includes("const evidenceSlotCards") && panelSource.includes("<SchoolEvidenceSlotStrip slots={evidenceSlotCards} />"),
  "school panel should derive and render a first-screen evidence slot strip",
);

const summaryIndex = panelSource.indexOf("<SchoolLookupSummaryStrip");
const slotIndex = panelSource.indexOf("<SchoolEvidenceSlotStrip");
const queueIndex = panelSource.indexOf("<SchoolLookupActionQueue");
assert.ok(
  summaryIndex > -1 && slotIndex > summaryIndex && queueIndex > slotIndex,
  "evidence slot strip should sit after lookup summary and before the immediate action queue",
);

for (const label of ["专业存在", "就业报告", "到校企业", "岗位薪资"]) {
  assert.ok(panelSource.includes(label), `evidence slot strip data should include ${label}`);
  assert.ok(componentSource.includes(label) || panelSource.includes(label), `evidence slot UI should expose ${label}`);
}

assert.ok(
  componentSource.includes('className="school-evidence-slot-strip"') &&
    componentSource.includes("slot.isCovered") &&
    componentSource.includes("slot.url") &&
    componentSource.includes("slot.source"),
  "SchoolEvidenceSlotStrip should render covered/missing state, source, and direct link",
);

for (const className of [
  ".school-evidence-slot-strip",
  ".school-evidence-slot-card",
  ".school-evidence-slot-card.is-covered",
  ".school-evidence-slot-card.is-missing",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
