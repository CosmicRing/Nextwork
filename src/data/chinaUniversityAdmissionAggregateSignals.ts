export type ChinaUniversityAdmissionBucket = {
  label: string;
  count: number;
};

export const chinaUniversityAdmissionAggregateSignalSource = {
  id: "evanyao-china-university-admission",
  name: "china-university-admission 全国高校招生 SQLite 聚合",
  repoUrl: "https://github.com/EvanYao826/china-university-admission",
  license: "MIT",
  sourcePath: "data/test.db",
  dbSizeBytes: 2723840,
  tableCount: 5,
  universityCount: 1167,
  undergraduateAdmissionRowCount: 6392,
  postgraduateAdmissionRowCount: 12,
  provinceCount: 31,
  cityCount: 279,
  undergraduateYearRange: [2023, 2024, 2025],
  undergraduateCategoryCount: 25,
  undergraduateBatchCount: 42,
  sourceUrlFilledCount: 6209,
  sourceUrlDistinctCount: 89,
  note: "Only SQLite schema, table counts, coverage counts, year coverage, and source-url completeness are imported. The SQLite database and admission rows are not copied into the frontend fact base.",
} as const;

export const chinaUniversityAdmissionTableBuckets: ChinaUniversityAdmissionBucket[] = [
  { label: "高校基础信息", count: 1167 },
  { label: "本科录取记录", count: 6392 },
  { label: "研究生录取记录", count: 12 },
  { label: "高考录取旧表", count: 0 },
  { label: "研招旧表", count: 0 },
];

export const chinaUniversityAdmissionProvinceBuckets: ChinaUniversityAdmissionBucket[] = [
  { label: "河北本科录取", count: 466 },
  { label: "重庆本科录取", count: 427 },
  { label: "安徽本科录取", count: 354 },
  { label: "广东本科录取", count: 336 },
  { label: "湖北本科录取", count: 318 },
  { label: "湖南本科录取", count: 306 },
  { label: "江苏本科录取", count: 300 },
  { label: "吉林本科录取", count: 289 },
  { label: "福建本科录取", count: 284 },
  { label: "辽宁本科录取", count: 274 },
];

export const chinaUniversityProvinceSchoolBuckets: ChinaUniversityAdmissionBucket[] = [
  { label: "广东高校", count: 133 },
  { label: "湖南高校", count: 67 },
  { label: "广西高校", count: 66 },
  { label: "云南高校", count: 57 },
  { label: "江西高校", count: 57 },
  { label: "北京高校", count: 51 },
  { label: "贵州高校", count: 51 },
  { label: "江苏高校", count: 49 },
  { label: "新疆高校", count: 45 },
  { label: "浙江高校", count: 45 },
];
