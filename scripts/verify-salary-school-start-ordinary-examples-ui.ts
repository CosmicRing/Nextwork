import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const componentStart = mainSource.indexOf("function SalarySchoolStartPanel");
const componentEnd = mainSource.indexOf("function SalaryCompanyCard", componentStart);

assert.ok(componentStart > -1 && componentEnd > componentStart, "SalarySchoolStartPanel should exist");

const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(
  componentSource.includes("schoolOutcomeProfiles") &&
    componentSource.includes("ordinarySchoolFirstIds") &&
    componentSource.includes(".slice(0, 8)") &&
    componentSource.includes("entryCount: school.officialLinks.length"),
  "the first-screen school shortcuts should be derived from ordinary-school official entry coverage",
);

assert.ok(
  componentSource.includes("examples.map((example)") &&
    componentSource.includes("onStart(example.name)") &&
    componentSource.includes("example.entryCount"),
  "school shortcuts should start aggregation by school name and display public-entry coverage metadata",
);

assert.ok(
  !componentSource.includes('const examples = ["') &&
    !componentSource.includes("onStart(example)}"),
  "school shortcuts should not be limited to a tiny hardcoded string list",
);

for (const className of [
  ".salary-school-start-examples",
  ".salary-school-start-examples button",
  ".salary-school-start-examples strong",
  ".salary-school-start-examples span",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
