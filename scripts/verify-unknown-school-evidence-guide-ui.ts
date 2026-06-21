import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const panelStart = source.indexOf("function UnknownSchoolPathPanel");
const panelEnd = source.indexOf("function getUnknownSchoolEntryCategoryLabel", panelStart);
const panelSource = source.slice(panelStart, panelEnd);

assert.ok(
  source.includes("buildUnknownSchoolEvidenceGuide"),
  "main UI should import and use the unknown-school evidence guide helper",
);
assert.ok(
  panelSource.includes("const evidenceGuide = buildUnknownSchoolEvidenceGuide(entries);"),
  "unknown school panel should derive the evidence guide from the current entry pack",
);
assert.ok(
  panelSource.includes('className="unknown-school-evidence-guide"'),
  "unknown school panel should render a compact evidence guide",
);
assert.ok(
  panelSource.includes('className="unknown-school-evidence-card"'),
  "unknown school panel should render each guide step as a card",
);
assert.ok(
  panelSource.indexOf('className="unknown-school-entry-pack-grid"') <
    panelSource.indexOf('className="unknown-school-evidence-guide"') &&
    panelSource.indexOf('className="unknown-school-evidence-guide"') <
      panelSource.indexOf('className="unknown-school-packet-preview"'),
  "unknown school panel should show entries first, then verification guide, then copy preview",
);
