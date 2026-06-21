import assert from "node:assert/strict";

import {
  filterCheckedSchoolEvidenceTaskKeys,
  getCheckedSchoolEvidenceTaskProgress,
  getSchoolEvidenceTaskKey,
} from "../src/lib/schoolEvidenceTaskProgress";

const tasks = [
  { label: "确认专业是否真实开设", url: "https://example.edu.cn/major" },
  { label: "读取就业质量报告", url: "https://example.edu.cn/report.pdf" },
];

assert.equal(getSchoolEvidenceTaskKey(tasks[0]), "确认专业是否真实开设::https://example.edu.cn/major");

const checkedKeys = [getSchoolEvidenceTaskKey(tasks[0]), "stale::https://old.example"];

assert.deepEqual(filterCheckedSchoolEvidenceTaskKeys(tasks, checkedKeys), [getSchoolEvidenceTaskKey(tasks[0])]);
assert.deepEqual(getCheckedSchoolEvidenceTaskProgress(tasks, checkedKeys), {
  checkedCount: 1,
  totalCount: 2,
  remainingCount: 1,
});

assert.deepEqual(getCheckedSchoolEvidenceTaskProgress([], checkedKeys), {
  checkedCount: 0,
  totalCount: 0,
  remainingCount: 0,
});
