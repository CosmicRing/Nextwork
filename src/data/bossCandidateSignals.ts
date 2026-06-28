export type BossCandidateSignalBucket = {
  label: string;
  count: number;
};

export const bossCandidateSignalSource = {
  id: "boss-github-candidate-radar",
  name: "BOSS GitHub 候选源合规雷达",
  candidateSourceCount: 3,
  rawCsvCandidateCount: 1,
  mitToolchainCount: 2,
  blockedLicenseCount: 1,
  blockedRawImportCount: 1,
  architectureReferenceCount: 1,
  jhcocoCsvFileSizeBytes: 38698,
  jhcocoCsvFieldCount: 10,
  maimaigptEvaluationDimensionCount: 5,
  maimaigptWorkflowStageCount: 6,
  my0sot1sOutputFormatCount: 2,
  note: "Only candidate-level counts and compliance decisions are imported. Raw BOSS CSV rows, company names, job titles, cookies, CAPTCHA flows, and crawler logic are not copied into the frontend fact base.",
} as const;

export const bossCandidateSourceBuckets: BossCandidateSignalBucket[] = [
  { label: "真实 CSV 候选", count: 1 },
  { label: "MIT 工具链参考", count: 2 },
  { label: "许可证阻断", count: 1 },
  { label: "采集链路阻断", count: 1 },
];

export const bossCandidateDecisionSignals = [
  "jhcoco/bosszp 含全国热门城市岗位 CSV，但仓库无许可证，当前只能登记为待授权候选。",
  "My0sot1s/boss-crawler 为 MIT，但 README 明确依赖 Selenium、登录和验证码识别，只能作为本地授权导入边界参考。",
  "maimaigptlink9/boss-career-ops 为 MIT，价值在 5 维评估、Pipeline 和本地仪表盘架构，不作为可再发布岗位数据源。",
  "BOSS 明细后续只允许用户本地导入自己有权使用的文件，并在前端展示去标识化聚合。",
] as const;
