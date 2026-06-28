export type GaokaoAdvisorAuditBucket = {
  label: string;
  count: number;
};

export const gaokaoAdvisorAuditSignalSource = {
  id: "sgblizzard-gaokao-advisor-audit",
  name: "gaokao-advisor 2025 本地数据库审计报告",
  repoUrl: "https://github.com/sgblizzard/gaokao-advisor",
  license: "MIT",
  sourcePath: "reports/data_audit_20260514_222320.json",
  generatedAt: "2026-05-14T22:22:53",
  databaseIncludedInRepo: false,
  auditStatus: "PASS",
  hardFailureCount: 0,
  warningCount: 27,
  universityCount: 2360,
  scoreSegmentRowCount: 488152,
  admissionScoreRowCount: 377962,
  majorScoreRowCount: 3298297,
  enrollmentPlanRowCount: 4951513,
  scoreSegmentYearStart: 1996,
  scoreSegmentYearEnd: 2025,
  admissionScoreYearStart: 2019,
  admissionScoreYearEnd: 2025,
  majorScoreYearStart: 2021,
  majorScoreYearEnd: 2025,
  enrollmentPlanYearStart: 2021,
  enrollmentPlanYearEnd: 2025,
  scoreSegment2025ProvinceCount: 31,
  scoreSegment2025CategoryCount: 5,
  scoreSegment2025GroupCount: 57,
  scoreSegment2025RowCount: 27827,
  admission2025ProvinceCount: 31,
  major2025ProvinceCount: 30,
  enrollmentPlan2025ProvinceCount: 31,
  sqliteIntegrity: "ok",
  sqliteQuick: "ok",
  orphanAdmissionSchoolCount: 0,
  orphanMajorScoreSchoolCount: 0,
  orphanEnrollmentPlanSchoolCount: 0,
  missingAdmissionRank2021PlusCount: 24204,
  missingAdmissionScoreWithRank2021PlusCount: 730,
  engineSmokeCaseCount: 55,
  duplicateScoreSegmentGroupCount: 0,
  badScoreValue2025Count: 0,
  note: "只导入审计报告的覆盖量和质量门指标；该仓库 README 明确完整参考数据库不随仓库发布。",
} as const;

export const gaokaoAdvisorAuditTotalBuckets: GaokaoAdvisorAuditBucket[] = [
  { label: "高校表", count: gaokaoAdvisorAuditSignalSource.universityCount },
  { label: "分数段表", count: gaokaoAdvisorAuditSignalSource.scoreSegmentRowCount },
  { label: "院校录取线", count: gaokaoAdvisorAuditSignalSource.admissionScoreRowCount },
  { label: "专业分数线", count: gaokaoAdvisorAuditSignalSource.majorScoreRowCount },
  { label: "招生计划", count: gaokaoAdvisorAuditSignalSource.enrollmentPlanRowCount },
];

export const gaokaoAdvisorAudit2025Buckets: GaokaoAdvisorAuditBucket[] = [
  { label: "2025 分数段省份", count: gaokaoAdvisorAuditSignalSource.scoreSegment2025ProvinceCount },
  { label: "2025 分数段科类组", count: gaokaoAdvisorAuditSignalSource.scoreSegment2025GroupCount },
  { label: "2025 院校录取线省份", count: gaokaoAdvisorAuditSignalSource.admission2025ProvinceCount },
  { label: "2025 专业分数线省份", count: gaokaoAdvisorAuditSignalSource.major2025ProvinceCount },
  { label: "2025 招生计划省份", count: gaokaoAdvisorAuditSignalSource.enrollmentPlan2025ProvinceCount },
];
