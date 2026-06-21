import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildUnknownSchoolOfficialSiteRecipes } from "../src/lib/unknownSchoolEntryPack";

const recipes = buildUnknownSchoolOfficialSiteRecipes({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
  officialDomain: "www.zkvtc.edu.cn",
});

assert.ok(recipes.length >= 5, "unknown-school official-site recipes should include the five follow-up searches");

const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));

assert.equal(recipeById.get("site-admissions")?.evidenceKind, "major", "admissions site search should fill the major evidence slot");
assert.equal(recipeById.get("site-major-catalog")?.evidenceKind, "major", "major catalog site search should fill the major evidence slot");
assert.equal(recipeById.get("site-report")?.evidenceKind, "report", "report site search should fill the employment report evidence slot");
assert.equal(recipeById.get("site-campus")?.evidenceKind, "campus", "campus site search should fill the campus employer evidence slot");
assert.equal(recipeById.get("site-job-salary")?.evidenceKind, "salary", "job salary site search should fill the salary evidence slot");

for (const recipe of recipes) {
  assert.ok(recipe.evidenceLabel.startsWith("补"), `recipe ${recipe.id} should expose a short evidence-slot label`);
  assert.ok(recipe.saveHint.includes("保存"), `recipe ${recipe.id} should tell the user what to save after opening`);
}

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(workbenchStart > -1 && workbenchEnd > workbenchStart, "UnknownSchoolEvidenceWorkbench should exist");
assert.ok(
  workbenchSource.includes('className={`unknown-school-recipe-slot slot-${recipe.evidenceKind}`}') &&
    workbenchSource.includes("{recipe.evidenceLabel}") &&
    workbenchSource.includes("{recipe.saveHint}"),
  "official-site recipe cards should show which evidence slot they help fill and what to save",
);
assert.ok(
  styleSource.includes(".unknown-school-recipe-slot") &&
    styleSource.includes(".unknown-school-recipe-slot.slot-major") &&
    styleSource.includes(".unknown-school-recipe-slot.slot-report") &&
    styleSource.includes(".unknown-school-recipe-slot.slot-campus") &&
    styleSource.includes(".unknown-school-recipe-slot.slot-salary"),
  "official-site recipe slot badges should have dedicated styles for all four evidence slots",
);
