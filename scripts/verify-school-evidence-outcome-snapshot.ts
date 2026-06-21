import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolEvidenceOutcomeSnapshot } from "../src/lib/schoolEvidenceOutcomeSnapshot";

const snapshot = buildSchoolEvidenceOutcomeSnapshot([
  {
    kind: "major",
    title: "护理学专业介绍",
    url: "https://www.example.edu.cn/nursing",
    detail: "学校官方源；护理学专业归属医学院，核心课程包含基础护理学、内科护理学。",
  },
  {
    kind: "report",
    title: "2024届毕业生就业质量报告",
    url: "https://www.example.edu.cn/report",
    detail: "学校官方源；2024届毕业去向落实率92.3%，升学率18.6%，主要去向为医疗卫生、养老服务、基层医院。",
  },
  {
    kind: "campus",
    title: "春季双选会企业名单",
    url: "https://job.example.edu.cn/campus",
    detail: "学校官方源；到校企业：郑州人民医院、牧原集团、建设银行，岗位包含护士、运营、客户经理。",
  },
  {
    kind: "salary",
    title: "企业官网校招岗位",
    url: "https://careers.example.com/jobs",
    detail: "企业官方源；护士岗位郑州月薪6-9K，运营管培生8-12K。",
  },
  {
    kind: "salary",
    title: "营销号高薪榜",
    url: "https://example.com/best-major",
    detail: "弱证据；营销软文声称毕业月薪30K，不能替代企业官网岗位。",
  },
]);

assert.equal(snapshot.major.value, "护理学专业介绍");
assert.equal(snapshot.employment.value, "92.3%");
assert.ok(snapshot.employment.detail.includes("升学率18.6%"));
assert.equal(snapshot.recruiters.value, "3 家");
assert.deepEqual(snapshot.recruiters.items.slice(0, 3), ["郑州人民医院", "牧原集团", "建设银行"]);
assert.equal(snapshot.salary.value, "6-9K / 8-12K");
assert.ok(snapshot.warnings.some((warning) => warning.includes("弱证据")));
assert.ok(snapshot.copyText.includes("毕业去向落实率：92.3%"));
assert.ok(snapshot.copyText.includes("到校企业：郑州人民医院 / 牧原集团 / 建设银行"));
assert.ok(snapshot.copyText.includes("薪资线索：6-9K / 8-12K"));

const emptySnapshot = buildSchoolEvidenceOutcomeSnapshot([]);
assert.equal(emptySnapshot.major.value, "待补");
assert.equal(emptySnapshot.employment.value, "待补");
assert.equal(emptySnapshot.recruiters.value, "待补");
assert.equal(emptySnapshot.salary.value, "待补");
assert.ok(emptySnapshot.warnings[0].includes("先收"));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(mainSource.includes("buildSchoolEvidenceOutcomeSnapshot"), "school page should build outcome readings from saved evidence");
assert.ok(inboxSource.includes("const outcomeSnapshot = buildSchoolEvidenceOutcomeSnapshot(items);"));
assert.ok(inboxSource.includes("<SchoolEvidenceOutcomeSnapshotPanel snapshot={outcomeSnapshot} />"));
assert.ok(mainSource.includes("function SchoolEvidenceOutcomeSnapshotPanel"));
assert.ok(
  mainSource.includes("毕业去向") &&
    mainSource.includes("到校企业") &&
    mainSource.includes("工资线索") &&
    mainSource.includes("专业证明"),
  "outcome snapshot panel should expose the user-facing facts ordinary-school users need",
);
assert.ok(
  styleSource.includes(".school-evidence-outcome-snapshot") &&
    styleSource.includes(".school-evidence-outcome-grid") &&
    styleSource.includes(".school-evidence-outcome-warning"),
  "outcome snapshot panel should have dedicated styles",
);
