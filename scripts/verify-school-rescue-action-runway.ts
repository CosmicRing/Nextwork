import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolRescueActionRunway } from "../src/lib/schoolRescueActionRunway";

const emptyEvidenceRunway = buildSchoolRescueActionRunway({
  knownSchool: false,
  entryCount: 4,
  evidenceCount: 0,
  readinessTier: "not-ready",
  salaryLabel: "",
  candidateCount: 0,
});

assert.equal(emptyEvidenceRunway.primaryAction, "open-evidence", "no saved evidence should push users to the evidence box");
assert.ok(emptyEvidenceRunway.title.includes("先补证据箱"), "runway should lead with the next operational step");
assert.deepEqual(
  emptyEvidenceRunway.steps.map((step) => step.id),
  ["entry", "evidence", "salary", "compare"],
  "runway should always show the same four-step evidence path",
);
assert.equal(emptyEvidenceRunway.steps[0].status, "ready", "entry step should be ready when public entrances exist");
assert.equal(emptyEvidenceRunway.steps[1].status, "active", "evidence step should be active when no evidence has been saved");
assert.equal(emptyEvidenceRunway.steps[2].status, "pending", "salary step should wait for a direction or salary proxy");
assert.ok(emptyEvidenceRunway.summary.includes("入口已就绪"), "summary should tell users the entry step is already available");

const readyRunway = buildSchoolRescueActionRunway({
  knownSchool: true,
  entryCount: 8,
  evidenceCount: 3,
  readinessTier: "ready-to-compare",
  salaryLabel: "8-18K/月",
  candidateCount: 1,
});

assert.equal(readyRunway.primaryAction, "copy-packet", "ready evidence with a saved candidate should push users to carry the packet onward");
assert.equal(readyRunway.steps.every((step) => step.status === "ready"), true, "ready runway should mark every step as ready");
assert.ok(readyRunway.title.includes("可以带走信息包"), "ready runway should say the user can carry the packet onward");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolLookupActionQueue", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const runwayStart = mainSource.indexOf("function SchoolRescueActionRunway");
const runwayEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", runwayStart);
const runwaySource = mainSource.slice(runwayStart, runwayEnd);

assert.ok(mainSource.includes("buildSchoolRescueActionRunway"), "main should import the rescue runway helper");
assert.ok(
  panelSource.includes("const rescueActionRunway = buildSchoolRescueActionRunway({"),
  "school panel should derive a runway state from current evidence and salary state",
);
assert.ok(
  panelSource.indexOf('className="school-public-query-box"') <
    panelSource.indexOf("<SchoolRescueActionRunway") &&
    panelSource.indexOf("<SchoolRescueActionRunway") <
      panelSource.indexOf("<SchoolOfficialEntranceLauncher"),
  "rescue runway should sit right after direction inputs and before the larger entrance cards",
);
assert.ok(
  runwaySource.includes('className="school-rescue-action-runway"') &&
    runwaySource.includes("runway.steps.map((step)") &&
    runwaySource.includes("runway.primaryAction") &&
    runwaySource.includes("onOpenEvidenceInbox") &&
    runwaySource.includes("onSaveCandidate") &&
    runwaySource.includes("onCopyPacket"),
  "runway component should render steps and expose evidence, save, and copy actions",
);

for (const className of [
  ".school-rescue-action-runway",
  ".school-rescue-action-runway-head",
  ".school-rescue-action-runway-steps",
  ".school-rescue-action-step",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
