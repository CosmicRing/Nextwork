import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const salaryAppStart = mainSource.indexOf("function SalaryApp()");
const salaryAppEnd = mainSource.indexOf("function SalarySnapshotBand", salaryAppStart);
const salaryAppSource = mainSource.slice(salaryAppStart, salaryAppEnd);

const explorerStart = mainSource.indexOf("function SchoolMajorExplorer");
const explorerEnd = mainSource.indexOf("type SchoolMajorSnapshot", explorerStart);
const explorerSource = mainSource.slice(explorerStart, explorerEnd);

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);

const bridgeStart = mainSource.indexOf("function SchoolCareerRadarBridge");
const bridgeEnd = mainSource.indexOf("function SchoolNextActionBar", bridgeStart);
const bridgeSource = mainSource.slice(bridgeStart, bridgeEnd);

assert.ok(salaryAppStart > -1 && salaryAppEnd > salaryAppStart, "SalaryApp should exist");
assert.ok(explorerStart > -1 && explorerEnd > explorerStart, "SchoolMajorExplorer should exist");
assert.ok(accessStart > -1 && accessEnd > accessStart, "SchoolPublicAccessPanel should exist");
assert.ok(bridgeStart > -1 && bridgeEnd > bridgeStart, "SchoolCareerRadarBridge should exist before next-action bar");

assert.ok(
  mainSource.includes("type SchoolCareerRadarHandoff"),
  "school-to-radar handoff should use an explicit typed payload",
);

assert.ok(
  salaryAppSource.includes("const [salaryRadarIntent, setSalaryRadarIntent]") &&
    salaryAppSource.includes("openCareerRadarFromSchool") &&
    salaryAppSource.includes('target: "career-radar"') &&
    salaryAppSource.includes('setActiveTab("radar")'),
  "SalaryApp should turn a school handoff into a career-radar intent and switch tabs",
);

assert.ok(
  salaryAppSource.includes("<SchoolMajorExplorer searchIntent={salarySchoolIntent} onOpenCareerRadar={openCareerRadarFromSchool} />"),
  "school tab should pass the handoff action into the school explorer",
);

assert.ok(
  salaryAppSource.includes("<CareerRadarPanel searchIntent={salaryRadarIntent} />"),
  "radar tab should receive the latest school-originated radar intent instead of null",
);

assert.ok(
  explorerSource.includes("onOpenCareerRadar") &&
    explorerSource.includes("onOpenCareerRadar={onOpenCareerRadar}"),
  "SchoolMajorExplorer should forward the radar handoff action to the public access panel",
);

assert.ok(
  accessSource.includes("onOpenCareerRadar") &&
    accessSource.includes("<SchoolCareerRadarBridge") &&
    accessSource.includes("targetJobQuery || targetMajorQuery") &&
    accessSource.includes("onOpenCareerRadar?.({") &&
    accessSource.includes("focusSchoolDirectionInputs"),
  "school access panel should render a direction-aware bridge to career radar",
);

assert.ok(
  bridgeSource.includes('className={`school-career-radar-bridge') &&
    bridgeSource.includes("const radarQuery = jobName.trim() || majorName.trim()") &&
    bridgeSource.includes("onClick={isReady ? onOpen : onFocusDirection}") &&
    bridgeSource.includes("去岗位雷达") &&
    bridgeSource.includes("先补岗位"),
  "bridge component should either send the current job to radar or focus the missing direction input",
);

for (const className of [
  ".school-career-radar-bridge",
  ".school-career-radar-bridge.ready",
  ".school-career-radar-bridge.missing",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
