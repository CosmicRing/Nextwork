import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolEvidenceCompanyFollowups } from "../src/lib/schoolEvidenceCompanyFollowups";

const followups = buildSchoolEvidenceCompanyFollowups({
  majorName: "护理学",
  jobName: "护士",
  items: [
    {
      kind: "campus",
      title: "2025春季双选会",
      url: "https://job.example.edu.cn/campus",
      detail: "学校官方源；到校企业：京东、郑州人民医院、牧原集团，岗位包含护士、运营、客户经理。",
    },
    {
      kind: "campus",
      title: "营销号就业榜",
      url: "https://example.com/best-company-list",
      detail: "弱证据；营销软文声称某某公司高薪，不能替代就业信息网。",
    },
  ],
});

assert.ok(followups.length >= 3, "company followups should include all trusted campus recruiters");

const jd = followups.find((item) => item.name === "京东");
assert.ok(jd, "known official company should be detected from campus evidence");
assert.equal(jd?.type, "known-official");
assert.equal(jd?.officialSourceId, "jd");
assert.ok(jd?.logoSources.length, "known official company should reuse logo sources");
assert.ok(jd?.primaryUrl.includes("zhaopin.jd.com"), "known official company should use its official career URL");

const localHospital = followups.find((item) => item.name === "郑州人民医院");
assert.ok(localHospital, "unknown local recruiter should still become an actionable company lead");
assert.equal(localHospital?.type, "search-lead");
assert.ok(localHospital?.officialSearchUrl.includes(encodeURIComponent("郑州人民医院 官网 招聘")));
assert.ok(localHospital?.jobSearchUrl.includes(encodeURIComponent("郑州人民医院 护士 招聘")));
assert.ok(localHospital?.salarySearchUrl.includes(encodeURIComponent("郑州人民医院 护士 薪资 工资")));
assert.ok(localHospital?.logoSources.length, "unknown local recruiter should expose favicon/logo lookup fallbacks");

assert.ok(!followups.some((item) => item.name.includes("某某公司")), "weak evidence should not create company followups");

const emptyFollowups = buildSchoolEvidenceCompanyFollowups({ majorName: "", jobName: "", items: [] });
assert.deepEqual(emptyFollowups, []);

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(mainSource.includes("buildSchoolEvidenceCompanyFollowups"), "school page should build company followups from saved evidence");
assert.ok(inboxSource.includes("const companyFollowups = buildSchoolEvidenceCompanyFollowups({"));
assert.ok(inboxSource.includes("<SchoolEvidenceCompanyFollowupPanel followups={companyFollowups} />"));
assert.ok(mainSource.includes("function SchoolEvidenceCompanyFollowupPanel"));
assert.ok(
  mainSource.includes("企业追踪") &&
    mainSource.includes("官网") &&
    mainSource.includes("岗位") &&
    mainSource.includes("薪资"),
  "company followup panel should expose official, job, and salary routes",
);
assert.ok(
  styleSource.includes(".school-evidence-company-followup") &&
    styleSource.includes(".school-evidence-company-followup-grid") &&
    styleSource.includes(".school-evidence-company-logo"),
  "company followup panel should have dedicated styles",
);
