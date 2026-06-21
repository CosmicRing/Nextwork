import assert from "node:assert/strict";

import { buildSchoolEvidenceReadiness } from "../src/lib/schoolEvidenceReadiness";

const empty = buildSchoolEvidenceReadiness({
  majorName: "",
  jobName: "",
  candidate: {
    evidenceScore: 20,
    evidenceLabel: "只适合起步",
    missingEvidence: ["补一个专业名，避免泛泛比较学校"],
  },
  evidenceKinds: [],
});

assert.equal(empty.tier, "not-ready");
assert.equal(empty.title, "现在还不能比较");
assert.ok(empty.reason.includes("先补专业或岗位"));
assert.ok(empty.missingKinds.includes("专业存在"));
assert.ok(empty.missingKinds.includes("就业报告"));
assert.ok(empty.missingKinds.includes("到校企业"));
assert.ok(empty.missingKinds.includes("岗位薪资"));
assert.equal(empty.primaryAdvice, "先补专业/岗位，再打开入口");

const screenable = buildSchoolEvidenceReadiness({
  majorName: "护理学",
  jobName: "护士",
  candidate: {
    evidenceScore: 56,
    evidenceLabel: "可开始比较",
    missingEvidence: ["核验就业信息网、宣讲会或双选会企业名单", "生成对应行业薪资代理"],
  },
  evidenceKinds: ["major", "report"],
});

assert.equal(screenable.tier, "can-screen");
assert.equal(screenable.title, "可以先粗筛，不能下结论");
assert.deepEqual(screenable.confirmedKinds, ["专业存在", "就业报告"]);
assert.ok(screenable.missingKinds.includes("到校企业"));
assert.ok(screenable.missingKinds.includes("岗位薪资"));
assert.ok(screenable.reason.includes("还缺"));

const ready = buildSchoolEvidenceReadiness({
  majorName: "网络工程",
  jobName: "安全工程师",
  candidate: {
    evidenceScore: 84,
    evidenceLabel: "资料较完整",
    missingEvidence: [],
  },
  evidenceKinds: ["major", "report", "campus", "salary"],
});

assert.equal(ready.tier, "ready-to-compare");
assert.equal(ready.title, "可以放进正式对比");
assert.equal(ready.missingKinds.length, 0);
assert.equal(ready.confirmedKinds.length, 4);
assert.equal(ready.primaryAdvice, "复制查询包，拿去对比另一所学校");
assert.ok(ready.score >= 80);

