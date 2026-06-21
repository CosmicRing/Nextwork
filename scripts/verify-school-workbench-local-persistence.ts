import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SCHOOL_CANDIDATE_COMPARE_STORAGE_KEY,
  buildSchoolWorkbenchStorageKey,
  readSchoolCandidateComparisonSnapshot,
  readSchoolWorkbenchStorageSnapshot,
  writeSchoolCandidateComparisonSnapshot,
  writeSchoolWorkbenchStorageSnapshot,
} from "../src/lib/schoolWorkbenchPersistence";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const storage = new MemoryStorage();
const workbenchKey = buildSchoolWorkbenchStorageKey({
  schoolName: " 郑州工商学院 ",
  majorName: " 会计学 ",
  jobName: " 审计助理 ",
});

assert.equal(
  workbenchKey,
  "kankan-salary.school-workbench.v1::郑州工商学院::会计学::审计助理",
  "storage key should be scoped to school, major, and job",
);
assert.equal(
  buildSchoolWorkbenchStorageKey({ schoolName: "", majorName: "", jobName: "" }),
  "kankan-salary.school-workbench.v1::目标学校::未填专业::未填岗位",
  "empty scopes should still use a stable key",
);

storage.setItem(
  workbenchKey,
  JSON.stringify({
    version: 1,
    manualEvidenceItems: [
      { id: "m1", kind: "major", title: "官网专业目录", detail: "会计学本科", url: "https://school.example/major" },
      { id: "bad-kind", kind: "forum", title: "论坛", detail: "不该保存", url: "" },
      ...Array.from({ length: 20 }, (_, index) => ({
        id: `report-${index}`,
        kind: "report",
        title: `就业报告 ${index}`,
        detail: "就业率字段",
        url: `https://school.example/report-${index}`,
      })),
    ],
    checkedEvidenceTaskKeys: ["major::url", 7, "report::url", ...Array.from({ length: 30 }, (_, index) => `task-${index}`)],
    officialDomain: " 官网：https://www.zkvtc.edu.cn/xxgk/ ",
  }),
);

const restoredWorkbench = readSchoolWorkbenchStorageSnapshot(storage, workbenchKey);
assert.equal(restoredWorkbench.manualEvidenceItems.length, 12, "manual evidence should be capped");
assert.equal(restoredWorkbench.manualEvidenceItems[0].kind, "major");
assert.ok(
  restoredWorkbench.manualEvidenceItems.every((item) => ["major", "report", "campus", "salary"].includes(item.kind)),
  "manual evidence restore should ignore invalid evidence kinds",
);
assert.equal(
  Object.prototype.hasOwnProperty.call(restoredWorkbench, "checkedEvidenceTaskKeys"),
  false,
  "legacy checked task keys should not be restored because evidence progress must come from saved evidence only",
);
assert.equal(restoredWorkbench.officialDomain, "zkvtc.edu.cn", "official domain should be normalized for site-scoped searches");

writeSchoolWorkbenchStorageSnapshot(storage, workbenchKey, {
  manualEvidenceItems: Array.from({ length: 14 }, (_, index) => ({
    id: `salary-${index}`,
    kind: "salary",
    title: `薪资 ${index}`,
    detail: "企业官网薪资口径",
    url: `https://company.example/jobs-${index}`,
  })),
  officialDomain: "https://job.example.edu.cn/campus/",
});
const writtenWorkbench = JSON.parse(storage.getItem(workbenchKey) ?? "{}");
assert.equal(writtenWorkbench.version, 1, "workbench snapshot should carry a storage version");
assert.equal(writtenWorkbench.manualEvidenceItems.length, 12);
assert.equal(
  Object.prototype.hasOwnProperty.call(writtenWorkbench, "checkedEvidenceTaskKeys"),
  false,
  "workbench persistence should not write manual checked task keys",
);
assert.equal(writtenWorkbench.officialDomain, "job.example.edu.cn");

writeSchoolCandidateComparisonSnapshot(storage, {
  candidates: Array.from({ length: 6 }, (_, index) => ({
    key: `candidate-${index}`,
    schoolName: `学校 ${index}`,
    majorName: "会计学",
    jobName: "审计助理",
    salaryLabel: "8-22K/月",
    marketGroup: "财会审计",
    evidenceScore: 48 + index,
    evidenceLabel: "只能先粗筛",
    evidenceNote: "证据待补",
    confirmedEvidence: ["专业入口"],
    missingEvidence: ["就业报告"],
    companyNames: ["PwC"],
    requiredActions: ["补就业报告"],
    nextEvidenceLabel: "就业报告",
    nextEvidenceSource: "学校就业质量报告",
    nextEvidenceDetail: "保存就业率、升学率和统计口径",
    nextEvidenceUrl: "https://school.example/report",
    nextEvidenceSaveFields: ["就业率", "升学率", "统计口径"],
  })),
});
const restoredCandidates = readSchoolCandidateComparisonSnapshot(storage);
assert.equal(restoredCandidates.candidates.length, 4, "candidate comparison list should be capped");
assert.equal(restoredCandidates.candidates[0].nextEvidenceLabel, "就业报告");
assert.equal(restoredCandidates.candidates[0].nextEvidenceSource, "学校就业质量报告");
assert.equal(restoredCandidates.candidates[0].nextEvidenceUrl, "https://school.example/report");
assert.equal(restoredCandidates.candidates[0].nextEvidenceSaveFields?.join("|"), "就业率|升学率|统计口径");
assert.equal(storage.getItem(SCHOOL_CANDIDATE_COMPARE_STORAGE_KEY) !== null, true);

const mainSource = readFileSync("src/main.tsx", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(
  mainSource.includes("schoolWorkbenchPersistence"),
  "main UI should import school workbench persistence helpers",
);
assert.ok(
  panelSource.includes("const schoolWorkbenchStorageKey = buildSchoolWorkbenchStorageKey({") &&
    panelSource.includes("schoolName: targetSchoolName") &&
    panelSource.includes("majorName: targetMajorQuery") &&
    panelSource.includes("jobName: targetJobQuery"),
  "school workbench state should be scoped to school, major, and job",
);
assert.ok(
  panelSource.includes("readSchoolWorkbenchStorageSnapshot(getSchoolWorkbenchLocalStorage(), schoolWorkbenchStorageKey)") &&
    panelSource.includes(".officialDomain") &&
    panelSource.includes("readSchoolCandidateComparisonSnapshot(getSchoolWorkbenchLocalStorage())"),
  "school workbench should restore saved official domain, saved evidence, and candidates",
);
assert.ok(
  panelSource.includes("writeSchoolWorkbenchStorageSnapshot(getSchoolWorkbenchLocalStorage(), activeSchoolWorkbenchStorageKey") &&
    panelSource.includes("officialDomain: unknownOfficialDomain") &&
    panelSource.includes("writeSchoolCandidateComparisonSnapshot(getSchoolWorkbenchLocalStorage()"),
  "school workbench should persist official domain, saved evidence, and candidates after changes",
);
assert.ok(!panelSource.includes("checkedEvidenceTaskKeys"), "school workbench UI must not keep legacy manual task-check state");
