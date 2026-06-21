import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolLookupActionQueue", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const mapStart = mainSource.indexOf("function UnknownSchoolPublicAccessMap");
const mapEnd = mainSource.indexOf("function UnknownSchoolTypeStrategyCard", mapStart);
const mapSource = mainSource.slice(mapStart, mapEnd);

assert.ok(panelStart > -1 && mapStart > -1, "school access panel and public access map should exist");

assert.ok(
  panelSource.includes("const fillDraftFromUnknownAuthorityEntry = (entry: UnknownSchoolAuthorityEntrance) => {") &&
    panelSource.includes("kind: entry.evidenceKind") &&
    panelSource.includes("title: entry.label") &&
    panelSource.includes("entry.query") &&
    panelSource.includes("url: entry.url") &&
    panelSource.includes("openSchoolEvidenceInboxFoldout()"),
  "authority entrances should fill editable evidence drafts",
);
assert.ok(
  panelSource.includes("onUseAuthorityEntry={fillDraftFromUnknownAuthorityEntry}"),
  "top public access map should receive the authority evidence draft callback",
);
assert.ok(
  !mainSource.includes("function getSchoolManualEvidenceKindForUnknownAuthorityEntry"),
  "authority entrances should carry their own evidence kind instead of a hard-coded mapper",
);

for (const token of [
  "onUseAuthorityEntry: (entry: UnknownSchoolAuthorityEntrance) => void;",
  'className="unknown-school-authority-entry-card"',
  'className="unknown-school-authority-entry-actions"',
  "onClick={() => onUseAuthorityEntry(entry)}",
]) {
  assert.ok(mapSource.includes(token), `public access map should expose authority save action via ${token}`);
}

assert.ok(
  !mapSource.includes("setManualEvidenceItems") && !mapSource.includes("addManualEvidence"),
  "authority entrance cards must not directly save templates as trusted evidence",
);

for (const className of [
  ".unknown-school-authority-entry-actions",
  ".unknown-school-authority-entry-actions button",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
