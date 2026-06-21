import assert from "node:assert/strict";

import { buildSchoolEvidenceAggregationBrief } from "../src/lib/schoolEvidenceAggregationBrief";
import { getSchoolEvidencePacketTrustLevel, groupSchoolManualEvidenceForPacket } from "../src/lib/schoolEvidencePacket";
import { buildSchoolEvidenceOutcomeSnapshot } from "../src/lib/schoolEvidenceOutcomeSnapshot";

const publicOfficialCampusItem = {
  kind: "campus",
  title: "国家大学生就业服务平台医药卫生专场",
  detail: "来源：公共官方源｜企业：郑州人民医院 / 河南省护理服务中心｜公共官方平台只能证明公开招聘入口，仍需回到学校就业网核对是否到校。",
  url: "https://www.ncss.cn/student/jobs/ABCD",
};

const publicOfficialSalaryItem = {
  kind: "salary",
  title: "中国公共招聘网护士岗位",
  detail: "来源：公共官方源｜薪资：5000-8000元｜岗位：护士｜地区：郑州",
  url: "https://job.mohrss.gov.cn/salary-position",
};

assert.equal(getSchoolEvidencePacketTrustLevel(publicOfficialCampusItem), "official");
assert.equal(getSchoolEvidencePacketTrustLevel(publicOfficialSalaryItem), "official");

const grouped = groupSchoolManualEvidenceForPacket([publicOfficialCampusItem, publicOfficialSalaryItem]);
assert.equal(grouped.official.length, 2, "public official items should appear in the official evidence group");
assert.equal(grouped.weak.length, 0, "public official items should not be downgraded to weak evidence");

const brief = buildSchoolEvidenceAggregationBrief({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  items: [publicOfficialCampusItem, publicOfficialSalaryItem],
});

assert.ok(brief.confirmedLines.length >= 2, "public official items should count as confirmed evidence lines");
assert.ok(!brief.weakLines.length, "public official items should not become weak lines");
assert.ok(!brief.missingSlots.includes("到校企业"), "public official campus evidence should cover the campus slot");
assert.ok(!brief.missingSlots.includes("岗位薪资"), "public official salary evidence should cover the salary slot");

const outcome = buildSchoolEvidenceOutcomeSnapshot([publicOfficialCampusItem, publicOfficialSalaryItem]);
assert.equal(outcome.recruiters.value, "2 家");
assert.equal(outcome.salary.value, "5000-8000元");
