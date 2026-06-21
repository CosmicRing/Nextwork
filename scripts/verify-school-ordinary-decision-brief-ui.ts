import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);

const briefStart = mainSource.indexOf("function SchoolOrdinaryDecisionBrief");
const briefEnd = mainSource.indexOf("function SchoolCareerRadarBridge", briefStart);
const briefSource = mainSource.slice(briefStart, briefEnd);

assert.ok(accessStart > -1 && accessEnd > accessStart, "SchoolPublicAccessPanel should exist");
assert.ok(briefStart > -1 && briefEnd > briefStart, "SchoolOrdinaryDecisionBrief should exist before the radar bridge");

const nextActionIndex = accessSource.indexOf("<SchoolNextActionBar");
const briefIndex = accessSource.indexOf("<SchoolOrdinaryDecisionBrief");
const radarBridgeIndex = accessSource.indexOf("<SchoolCareerRadarBridge");
assert.ok(nextActionIndex > -1 && briefIndex > -1 && radarBridgeIndex > -1, "next action, ordinary brief, and radar bridge should all render");
assert.ok(
  nextActionIndex < briefIndex && briefIndex < radarBridgeIndex,
  "ordinary decision brief should sit between the next action bar and the radar bridge",
);

for (const prop of [
  "readiness={evidenceReadiness}",
  "candidate={currentCandidate}",
  "nextAction={nextAction}",
  "salaryLabel={marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : \"\"}",
  "companyCount={companyCards.length}",
  "onOpenCareerRadar={openCareerRadarForCurrentDirection}",
  "onFocusDirection={focusSchoolDirectionInputs}",
]) {
  assert.ok(accessSource.includes(prop), `SchoolOrdinaryDecisionBrief should receive ${prop}`);
}

for (const token of [
  "readiness: SchoolEvidenceReadiness",
  "candidate: SchoolInfoCandidate",
  "nextAction: SchoolNextAction",
  'className="school-ordinary-decision-brief"',
  'className="school-ordinary-decision-card action"',
  'className="school-ordinary-decision-card warning"',
  "别只看学校名",
  "不是学校官方结论",
  "去岗位雷达",
  "先补岗位",
]) {
  assert.ok(briefSource.includes(token), `ordinary decision brief should include ${token}`);
}

for (const className of [
  ".school-ordinary-decision-brief",
  ".school-ordinary-decision-card",
  ".school-ordinary-decision-card.warning",
  ".school-ordinary-decision-card.action",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
