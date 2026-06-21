import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");

assert.ok(source.includes("function SalarySnapshotBand"), "salary snapshot band should be a reusable component");

const salaryAppStart = source.indexOf("function SalaryApp()");
const snapshotComponentStart = source.indexOf("function SalarySnapshotBand");
const schoolTabStart = source.indexOf('{activeTab === "school"');
const radarTabStart = source.indexOf('{activeTab === "radar"', schoolTabStart);

assert.ok(salaryAppStart > -1, "SalaryApp should exist");
assert.ok(snapshotComponentStart > salaryAppStart, "SalarySnapshotBand should be declared after SalaryApp");
assert.ok(schoolTabStart > -1, "school tab block should exist");
assert.ok(radarTabStart > schoolTabStart, "radar tab should follow school tab");

const schoolBlock = source.slice(schoolTabStart, radarTabStart);
const schoolExplorerIndex = schoolBlock.indexOf("<SchoolMajorExplorer");
const schoolSnapshotIndex = schoolBlock.indexOf("<SalarySnapshotBand");

assert.ok(schoolExplorerIndex > -1, "school tab should render SchoolMajorExplorer");
assert.ok(schoolSnapshotIndex > -1, "school tab should still render the data overview");
assert.ok(
  schoolExplorerIndex < schoolSnapshotIndex,
  "school tab should put the school workbench before the global data overview",
);

const inlineSnapshotIndex = source.indexOf('<section className="salary-snapshot-band"');
assert.ok(
  inlineSnapshotIndex > snapshotComponentStart,
  "salary snapshot markup should live inside SalarySnapshotBand, not before all tab content",
);
