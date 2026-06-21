import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const launcherStart = mainSource.indexOf("function SchoolOfficialEntranceLauncher");
const launcherEnd = mainSource.indexOf("function getSchoolOfficialEntranceSlotLabel", launcherStart);
const launcherSource = mainSource.slice(launcherStart, launcherEnd);

assert.ok(panelStart > -1 && launcherStart > -1, "school workbench and entrance launcher should exist");
assert.ok(
  panelSource.includes("const fillDraftFromEntranceCard = (card: SchoolOfficialEntranceLauncherCard) => {") &&
    panelSource.includes("setManualEvidenceDraft((current) => ({") &&
    panelSource.includes("kind: getSchoolManualEvidenceKindForEntranceSlot(card.slot)") &&
    panelSource.includes("title: card.title") &&
    panelSource.includes("detail:") &&
    panelSource.includes("card.copyTemplate") &&
    panelSource.includes("url: card.url"),
  "school workbench should turn a first-screen entrance into an editable evidence draft",
);
assert.ok(
  panelSource.includes("openSchoolEvidenceInboxFoldout()") &&
    panelSource.includes("<SchoolOfficialEntranceLauncher cards={officialEntranceCards} onUseTemplate={fillDraftFromEntranceCard} />"),
  "using an entrance template should open the evidence inbox flow instead of hiding the draft below the fold",
);
assert.ok(
  launcherSource.includes("onUseTemplate") &&
    launcherSource.includes("card.copyTemplate") &&
    launcherSource.includes('className="school-official-entrance-template"') &&
    launcherSource.includes('className="school-official-entrance-actions"') &&
    launcherSource.includes("onUseTemplate(card)") &&
    launcherSource.includes("填到证据箱"),
  "entrance launcher should show paste-ready evidence templates and a draft-fill action",
);
assert.ok(
  !launcherSource.includes("onAddParsedEvidenceItems") &&
    !launcherSource.includes("addManualEvidence") &&
    !launcherSource.includes("setManualEvidenceItems"),
  "entrance launcher must not directly save a template as trusted evidence",
);
assert.ok(
  styleSource.includes(".school-official-entrance-template") &&
    styleSource.includes(".school-official-entrance-actions") &&
    styleSource.includes(".school-official-entrance-actions button"),
  "entrance template and draft action should have dedicated compact styles",
);
