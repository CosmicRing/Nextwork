import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");

const tabsStart = source.indexOf("const salaryAppTabs");
const tabsEnd = source.indexOf("];", tabsStart);
const tabsSource = source.slice(tabsStart, tabsEnd);
const salaryAppStart = source.indexOf("function SalaryApp()");
const salaryAppEnd = source.indexOf("function SalarySnapshotBand", salaryAppStart);
const salaryAppSource = source.slice(salaryAppStart, salaryAppEnd);

assert.ok(tabsStart > -1, "salary app should define top navigation tabs");
assert.ok(salaryAppStart > -1, "salary app component should exist");
assert.ok(
  source.includes('const [activeTab, setActiveTab] = useState<SalaryAppTab>("school")'),
  "app should open on the school aggregation workspace by default",
);
assert.ok(
  tabsSource.indexOf('{ id: "school"') > -1 && tabsSource.indexOf('{ id: "radar"') > -1,
  "navigation should include school and radar tabs",
);
assert.ok(
  tabsSource.indexOf('{ id: "school"') < tabsSource.indexOf('{ id: "radar"') &&
    tabsSource.indexOf('{ id: "radar"') < tabsSource.indexOf('{ id: "companies"') &&
    tabsSource.indexOf('{ id: "companies"') < tabsSource.indexOf('{ id: "industries"'),
  "navigation should prioritize school aggregation, then career radar, then salary/company browsing",
);
assert.ok(
  salaryAppSource.includes('className="salary-brand" onClick={() => setActiveTab("school")}') &&
    salaryAppSource.includes('aria-label="回到学校信息聚合"'),
  "brand click should return to the school aggregation workspace",
);
assert.ok(
  salaryAppSource.indexOf('{activeTab === "school"') < salaryAppSource.indexOf('{activeTab === "companies"'),
  "school workspace should be the first main app section in source order",
);
