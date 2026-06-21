import assert from "node:assert/strict";

import { officialCompanySources } from "../src/data/officialSources";
import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";
import { buildSchoolCampusRecruitingLeads } from "../src/lib/schoolCampusRecruitingLeads";

const ztbu = schoolOutcomeProfiles.find((school) => school.name === "郑州工商学院");
assert.ok(ztbu, "郑州工商学院 should exist");

const ztbuLeads = buildSchoolCampusRecruitingLeads({
  schoolName: ztbu.name,
  majorName: "会计学",
  jobName: "审计助理",
  officialLinks: ztbu.officialLinks,
  campusRecruitingYears: ztbu.campusRecruitingYears,
  companySources: officialCompanySources.filter((source) => ["pwc", "deloitte"].includes(source.id)),
});

assert.equal(ztbuLeads.length, 5);
assert.equal(ztbuLeads[0].type, "direct");
assert.equal(ztbuLeads[0].label, "就业网校招入口");
assert.equal(ztbuLeads[0].url, "https://zzgsxy.goworkla.cn/");
assert.ok(ztbuLeads.some((lead) => lead.label === "双选会企业名单"));
assert.ok(ztbuLeads.some((lead) => lead.label === "就业报告签约单位"));
assert.ok(ztbuLeads.some((lead) => lead.type === "company" && lead.label === "企业官网补充"));

for (const lead of ztbuLeads) {
  assert.ok(lead.url.startsWith("http"), `${lead.label} should expose a browser URL`);
  assert.ok(lead.query || lead.type === "direct" || lead.type === "company", `${lead.label} should document the search query`);
}

const unknownLeads = buildSchoolCampusRecruitingLeads({
  schoolName: "未收录学校",
  majorName: "护理学",
  jobName: "护士",
  officialLinks: [],
  campusRecruitingYears: [],
  companySources: [],
});

assert.equal(unknownLeads.length, 4);
assert.equal(unknownLeads[0].type, "search");
assert.equal(unknownLeads[0].label, "就业网校招入口");
assert.ok(decodeURIComponent(unknownLeads[0].url).includes("未收录学校 护理学 护士 就业信息网 宣讲会 双选会"));
