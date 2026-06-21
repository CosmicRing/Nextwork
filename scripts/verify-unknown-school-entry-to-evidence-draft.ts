import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolLookupActionQueue", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(panelStart > -1 && workbenchStart > -1, "school panel and unknown-school workbench should exist");
assert.ok(
  panelSource.includes("const fillDraftFromUnknownEntry = (entry: UnknownSchoolEntryPackItem) => {") &&
    panelSource.includes("kind: getSchoolManualEvidenceKindForUnknownEntry(entry.category)") &&
    panelSource.includes("title: entry.label") &&
    panelSource.includes("entry.query") &&
    panelSource.includes("url: entry.url") &&
    panelSource.includes("const fillDraftFromUnknownRecipe = (recipe: UnknownSchoolOfficialSiteRecipe) => {") &&
    panelSource.includes("kind: recipe.evidenceKind") &&
    panelSource.includes("title: recipe.label") &&
    panelSource.includes("recipe.saveHint") &&
    panelSource.includes("openSchoolEvidenceInboxFoldout()"),
  "unknown-school entry and official-site recipe cards should fill editable evidence drafts",
);
assert.ok(
  panelSource.includes("onUseEntryTemplate={fillDraftFromUnknownEntry}") &&
    panelSource.includes("onUseRecipeTemplate={fillDraftFromUnknownRecipe}"),
  "school panel should wire unknown-school template actions into the shared evidence inbox",
);
assert.ok(
  workbenchSource.includes("onUseEntryTemplate") &&
    workbenchSource.includes("onUseRecipeTemplate") &&
    workbenchSource.includes('className="unknown-school-entry-card"') &&
    workbenchSource.includes('className="unknown-school-official-recipe-card"') &&
    workbenchSource.includes('className="unknown-school-template-actions"') &&
    workbenchSource.includes("onUseEntryTemplate(entry)") &&
    workbenchSource.includes("onUseRecipeTemplate(recipe)") &&
    workbenchSource.includes("填到证据箱"),
  "unknown-school workbench should expose visible draft-fill actions on broad and site-scoped entrances",
);
assert.ok(
  !workbenchSource.includes("setManualEvidenceItems") &&
    !workbenchSource.includes("addManualEvidence") &&
    !workbenchSource.includes("onAddParsedEvidenceItems"),
  "unknown-school entrance actions must not directly save templates as trusted evidence",
);
assert.ok(
  mainSource.includes("function getSchoolManualEvidenceKindForUnknownEntry") &&
    mainSource.includes('if (category === "report") return "report";') &&
    mainSource.includes('if (category === "campus") return "campus";') &&
    mainSource.includes('if (category === "salary") return "salary";'),
  "unknown-school broad entry categories should map to the four evidence slots",
);
assert.ok(
  styleSource.includes(".unknown-school-entry-card") &&
    styleSource.includes(".unknown-school-official-recipe-card") &&
    styleSource.includes(".unknown-school-template-actions") &&
    styleSource.includes(".unknown-school-template-actions button"),
  "unknown-school template actions should have dedicated compact styles",
);
