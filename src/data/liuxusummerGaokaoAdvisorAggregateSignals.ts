export type LiuxusummerGaokaoAdvisorAggregateBucket = {
  label: string;
  count: number;
};

export const liuxusummerGaokaoAdvisorAggregateSignalSource = {
  id: "liuxusummer-gaokao-advisor-data-center",
  name: "gaokao-advisor 数据中心聚合",
  repoUrl: "https://github.com/liuxusummer/gaokao-advisor",
  license: "MIT",
  generatedAt: "2026-06-22T03:01:38.904Z",
  collegeTotal: 2919,
  publicCollegeCount: 2074,
  privateCollegeCount: 829,
  collegeProvinceCount: 31,
  majorCatalogCount: 875,
  detailedMajorCatalogCount: 1661,
  scoreProvinceCount: 10,
  scoreFileCount: 30,
  scoreRecordCount: 139843,
  rankProvinceCount: 10,
  rankFileCount: 14,
  rankRecordCount: 9478,
  subjectProvinceCount: 10,
  subjectFileCount: 10,
  subjectRecordCount: 515684,
  scoreYearRange: "2023-2025",
  collegeWarningCount: 2920,
  scoreWarningCount: 53,
  scoreFailedCount: 2,
  subjectUnmatchedCount: 36,
  note: "Only coverage and quality aggregate counts are imported. Raw college, major, score, rank-table, and subject JSON files are not copied into the frontend fact base.",
} as const;

export const liuxusummerCollegeBuckets: LiuxusummerGaokaoAdvisorAggregateBucket[] = [
  { label: "全国高校", count: 2919 },
  { label: "公办高校", count: 2074 },
  { label: "民办高校", count: 829 },
  { label: "省级覆盖", count: 31 },
];

export const liuxusummerAdmissionDataBuckets: LiuxusummerGaokaoAdvisorAggregateBucket[] = [
  { label: "投档线记录", count: 139843 },
  { label: "选科记录", count: 515684 },
  { label: "位次表记录", count: 9478 },
  { label: "本科专业目录", count: 875 },
  { label: "详细专业目录", count: 1661 },
];

export const liuxusummerCoveredScoreProvinces = [
  "北京",
  "上海",
  "山东",
  "广东",
  "江苏",
  "浙江",
  "河北",
  "湖北",
  "湖南",
  "辽宁",
] as const;

export const liuxusummerQualitySignalBuckets: LiuxusummerGaokaoAdvisorAggregateBucket[] = [
  { label: "高校基础库警告", count: 2920 },
  { label: "投档线匹配警告", count: 53 },
  { label: "投档线采集失败", count: 2 },
  { label: "选科匹配警告", count: 36 },
];
