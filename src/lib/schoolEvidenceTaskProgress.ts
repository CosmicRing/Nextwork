export type SchoolEvidenceTaskIdentity = {
  label: string;
  url: string;
};

export function getSchoolEvidenceTaskKey(task: SchoolEvidenceTaskIdentity) {
  return `${task.label}::${task.url}`;
}

export function filterCheckedSchoolEvidenceTaskKeys(
  tasks: SchoolEvidenceTaskIdentity[],
  checkedKeys: readonly string[],
) {
  const validKeys = new Set(tasks.map(getSchoolEvidenceTaskKey));
  return checkedKeys.filter((key) => validKeys.has(key));
}

export function getCheckedSchoolEvidenceTaskProgress(
  tasks: SchoolEvidenceTaskIdentity[],
  checkedKeys: readonly string[],
) {
  const checkedCount = filterCheckedSchoolEvidenceTaskKeys(tasks, checkedKeys).length;
  const totalCount = tasks.length;

  return {
    checkedCount,
    totalCount,
    remainingCount: Math.max(totalCount - checkedCount, 0),
  };
}
