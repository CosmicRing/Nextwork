import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

const drawerStart = panelSource.indexOf('className="school-supporting-source-drawer"');
const starterStart = panelSource.indexOf('className="school-starter-preset-panel"');
const firstFoldoutStart = panelSource.indexOf("<SchoolPublicFoldout");
const drawerSource = panelSource.slice(drawerStart, starterStart);

assert.ok(drawerStart > -1, "school workbench should use a default-collapsed supporting source drawer");
assert.ok(starterStart > drawerStart, "supporting drawer should sit before starter presets");
assert.ok(firstFoldoutStart > starterStart, "secondary foldouts should still follow starter presets");
assert.ok(
  panelSource.includes('<details className="school-supporting-source-drawer">') &&
    !panelSource.includes('<details className="school-supporting-source-drawer" open'),
  "supporting drawer should be collapsed by default",
);
assert.ok(
  panelSource.indexOf("<SchoolNextActionBar") < drawerStart &&
    panelSource.indexOf("<SchoolLookupActionQueue") < drawerStart,
  "next action and three-step queue should remain visible before the supporting drawer",
);

for (const snippet of [
  "<SchoolEvidenceReadinessPanel",
  "<SchoolPublicSourceRoutePanel",
  "<SchoolPublicMajorAccessPanel",
  "<SchoolPrimaryActionFlow",
  'className="school-public-access-head"',
  "<SchoolActionCommandPanel",
]) {
  assert.ok(drawerSource.includes(snippet), `supporting drawer should contain ${snippet}`);
}

for (const className of [
  ".school-supporting-source-drawer",
  ".school-supporting-source-drawer summary",
  ".school-supporting-source-drawer-body",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
