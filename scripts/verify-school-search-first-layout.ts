import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const schoolTabStart = mainSource.indexOf('{activeTab === "school"');
const companyTabStart = mainSource.indexOf('{activeTab === "companies"', schoolTabStart);
const explorerStart = mainSource.indexOf("function SchoolMajorExplorer");
const accessPanelStart = mainSource.indexOf("function SchoolPublicAccessPanel", explorerStart);

assert.ok(schoolTabStart > -1, "school tab block should exist");
assert.ok(companyTabStart > schoolTabStart, "company tab should follow the school tab");
assert.ok(explorerStart > -1, "SchoolMajorExplorer should exist");
assert.ok(accessPanelStart > explorerStart, "SchoolPublicAccessPanel should follow SchoolMajorExplorer");

const schoolTabSource = mainSource.slice(schoolTabStart, companyTabStart);
const explorerSource = mainSource.slice(explorerStart, accessPanelStart);

assert.ok(
  schoolTabSource.includes('className="salary-page salary-embedded-page salary-school-entry-page"'),
  "school tab should use a dedicated search-first page class",
);
assert.ok(
  !schoolTabSource.includes("salary-page-heading"),
  "school tab should not put a visible marketing/page heading before the school search workbench",
);
assert.ok(
  schoolTabSource.indexOf("<SchoolMajorExplorer") < schoolTabSource.indexOf("<SalarySnapshotBand"),
  "school search workbench should remain before data overview blocks",
);

assert.ok(
  explorerSource.includes('className="panel school-major-panel school-major-search-first"'),
  "school explorer should opt into the compact search-first panel layout",
);
assert.ok(
  !explorerSource.includes("<PanelHeader"),
  "school explorer should not spend first-screen space on a generic module heading",
);
assert.ok(
  explorerSource.indexOf('<div className="school-picker">') < explorerSource.indexOf("<SchoolPublicAccessPanel"),
  "school picker should remain directly paired with the public access workbench",
);

assert.ok(
  styleSource.includes(".salary-school-entry-page") &&
    styleSource.includes(".school-major-search-first") &&
    styleSource.includes(".school-major-search-first .school-major-layout"),
  "search-first school page and panel classes should have dedicated layout styles",
);
