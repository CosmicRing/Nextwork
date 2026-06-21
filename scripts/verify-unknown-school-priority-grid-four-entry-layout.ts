import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function UnknownSchoolPublicDocumentMatrix", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(workbenchStart > -1 && workbenchEnd > workbenchStart, "unknown school evidence workbench should exist");

for (const id of ["school-official", "admissions", "major-catalog", "employment"]) {
  assert.ok(
    workbenchSource.includes(`entries.find((entry) => entry.id === "${id}")`),
    `priority entries should include ${id}`,
  );
}

assert.ok(
  workbenchSource.includes("先点这 4 个"),
  "priority block should tell users there are four first-step entrances",
);

const priorityStyleStart = styleSource.indexOf(".unknown-school-evidence-priority-grid {");
const priorityStyleEnd = styleSource.indexOf(".unknown-school-evidence-priority-grid > strong", priorityStyleStart);
const priorityStyle = styleSource.slice(priorityStyleStart, priorityStyleEnd);

assert.ok(priorityStyleStart > -1 && priorityStyleEnd > priorityStyleStart, "priority grid styles should exist");
assert.ok(
  priorityStyle.includes("grid-template-columns: 120px repeat(4, minmax(0, 1fr));"),
  "desktop priority grid should reserve one label column plus four entrance columns",
);
assert.ok(
  !priorityStyle.includes("grid-template-columns: 120px repeat(3, minmax(0, 1fr));"),
  "desktop priority grid must not allocate only three entrance columns while promoting four entries",
);
