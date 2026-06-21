import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";

const source = readFileSync("src/main.tsx", "utf8");
const explorerStart = source.indexOf("function SchoolMajorExplorer");
const explorerEnd = source.indexOf("function SchoolPublicAccessPanel", explorerStart);
const explorerSource = source.slice(explorerStart, explorerEnd);

assert.ok(explorerStart > -1, "SchoolMajorExplorer should exist");

const expectedDefault = schoolOutcomeProfiles.find((school) => school.name === "郑州工商学院");
assert.ok(expectedDefault, "郑州工商学院 should be available as an ordinary-school sample");
assert.notEqual(
  schoolOutcomeProfiles[0].name,
  "郑州工商学院",
  "raw school data still starts with other samples, so the UI must explicitly choose an ordinary-school default",
);

assert.ok(
  source.includes('const ordinarySchoolFirstIds = ["ztbu", "nfu", "wtbu", "cdjcc", "hustwenhua", "wsyu", "peihua", "zjsru", "hhstu", "sju", "cqytu", "shengda"]'),
  "UI should define an ordinary-school-first sample order",
);
assert.ok(
  source.includes("const schoolExplorerProfiles = orderSchoolOutcomeProfilesForExplorer(schoolOutcomeProfiles);"),
  "UI should derive a school explorer list instead of using raw data order",
);
assert.ok(
  source.includes("const defaultSchoolExplorerProfile = schoolExplorerProfiles[0] ?? schoolOutcomeProfiles[0];"),
  "UI should define an explicit default school profile from the ordered explorer list",
);
assert.ok(
  explorerSource.includes('useState(defaultSchoolExplorerProfile.id)') &&
    explorerSource.includes('useState(defaultSchoolExplorerProfile.majors[0].id)'),
  "SchoolMajorExplorer should initialize from the ordinary-school default, not raw schoolOutcomeProfiles[0]",
);
assert.ok(
  explorerSource.includes("if (!query) return schoolExplorerProfiles;") &&
    explorerSource.includes("return schoolExplorerProfiles.filter((school) =>"),
  "SchoolMajorExplorer list and search should use the ordinary-first explorer order",
);
assert.ok(
  !explorerSource.includes("useState(schoolOutcomeProfiles[0].id)") &&
    !explorerSource.includes("useState(schoolOutcomeProfiles[0].majors[0].id)"),
  "SchoolMajorExplorer should not default to the first raw school profile",
);
assert.ok(
  source.includes("报告源待接入") && source.includes("已核报告待接入"),
  "pending report states should render as complete labels, not broken count text",
);
assert.ok(
  !/待\"}\s*个(报告源|已核报告)/.test(source),
  "school report labels should not render as '待 个报告源' or '待 个已核报告'",
);
