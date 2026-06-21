import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = source.indexOf("function UnknownSchoolPathPanel");
const panelEnd = source.indexOf("function getUnknownSchoolEntryCategoryLabel", panelStart);
const panelSource = source.slice(panelStart, panelEnd);
const workbenchStart = source.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = source.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = source.slice(workbenchStart, workbenchEnd);

assert.ok(
  source.includes("buildUnknownSchoolEntryPack"),
  "main UI should import and use the unknown school entry pack helper",
);
assert.ok(
  source.includes("buildUnknownSchoolEntryPacketText"),
  "main UI should build a copyable unknown school packet",
);
assert.ok(
  source.includes("function UnknownSchoolPathPanel({") &&
    source.includes("schoolName,") &&
    source.includes("majorName,") &&
    source.includes("jobName,"),
  "unknown school panel should receive school, major, and job context",
);
assert.ok(
  source.includes("copyUnknownSchoolPacket"),
  "unknown school panel should expose a copy action",
);
assert.ok(
  source.includes('className="unknown-school-entry-pack-grid"'),
  "unknown school panel should render a visible entry pack grid",
);
assert.ok(
  source.includes('className="unknown-school-packet-preview"'),
  "unknown school panel should render a compact packet preview",
);
assert.ok(
  source.includes("showUnknownPacketText"),
  "unknown school copy failures should expose a manual packet fallback state",
);
assert.ok(
  panelSource.includes('className="unknown-school-packet-copybox"') &&
    panelSource.includes("value={packetText}"),
  "standalone unknown school panel should show the full packet text when copy is blocked",
);
assert.ok(
  workbenchSource.includes("showPacketText") &&
    workbenchSource.includes('className="unknown-school-packet-copybox"') &&
    workbenchSource.includes("value={packetText}"),
  "unknown school workbench should show the full packet text when copy is blocked",
);
assert.ok(
  styleSource.includes(".unknown-school-packet-copybox"),
  "manual unknown school packet fallback should have dedicated styles",
);
assert.ok(
  !panelSource.includes('href="#career-radar"') &&
    !panelSource.includes('href="#big-tech"') &&
    !panelSource.includes('href="#major-salary"'),
  "unknown school panel should not rely on dead in-page anchors",
);
