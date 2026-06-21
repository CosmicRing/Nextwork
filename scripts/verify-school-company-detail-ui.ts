import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const detailStart = mainSource.indexOf("function SchoolCompanyDetailPanel");
const detailEnd = mainSource.indexOf("function SchoolPublicFoldout", detailStart);
const detailSource = mainSource.slice(detailStart, detailEnd);

assert.ok(
  mainSource.includes('from "./lib/companyLogos"'),
  "main UI should import shared company logo helpers instead of keeping untestable local maps",
);
assert.ok(
  panelSource.includes("selectedSchoolCompanyId"),
  "school company section should track a selected company for in-page detail",
);
assert.ok(
  panelSource.includes("const selectedSchoolCompany"),
  "school company section should derive the selected company object",
);
assert.ok(
  panelSource.includes("school-public-company-card ${"),
  "school company entries should be selectable cards",
);
assert.ok(
  panelSource.includes("<button") && panelSource.includes("onClick={() => setSelectedSchoolCompanyId(source.id)}"),
  "school company cards should open details in-page instead of immediately navigating away",
);
assert.ok(
  panelSource.includes("<SchoolCompanyDetailPanel"),
  "school company section should render a dedicated company detail panel",
);
assert.ok(
  mainSource.includes("function SchoolCompanyDetailPanel"),
  "school company detail component should exist",
);
assert.ok(
  detailSource.includes("<CompanySourceLogoMark source={company} />"),
  "company detail panel should preserve the company logo",
);
assert.ok(
  detailSource.includes("company.careerUrl"),
  "company detail panel should expose the official career URL",
);
assert.ok(
  detailSource.includes("salaryLabel") && detailSource.includes("source.focus"),
  "company detail panel should show salary proxy and fit tags",
);

for (const className of [
  ".school-public-company-card",
  ".school-public-company-card.active",
  ".school-company-detail-panel",
  ".school-company-detail-actions",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
