import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const compareStart = mainSource.indexOf("function SalaryCompanyCompare");
const compareEnd = mainSource.indexOf("function SalaryIndustryCompare", compareStart);
const compareSource = mainSource.slice(compareStart, compareEnd);

assert.ok(compareStart >= 0 && compareEnd > compareStart, "SalaryCompanyCompare should be readable");

assert.ok(
  compareSource.includes('<span className="salary-compare-company-cell">') &&
    compareSource.includes("<CompanyLogoMark company={company} />") &&
    compareSource.includes("<b>{company.source.name}</b>"),
  "company compare rows should show each company logo next to its name",
);

assert.ok(
  styleSource.includes(".salary-compare-company-cell") &&
    styleSource.includes(".salary-compare-company-cell .company-logo-mark") &&
    styleSource.includes(".salary-compare-company-cell b"),
  "company compare logo/name cell needs dedicated compact styling",
);
