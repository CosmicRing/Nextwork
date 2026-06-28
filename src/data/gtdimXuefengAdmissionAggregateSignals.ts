export type GtdimXuefengAdmissionBucket = {
  label: string;
  count: number;
};

export const gtdimXuefengAdmissionAggregateSignalSource = {
  id: "gtdim-xuefeng-skill-admission-db",
  name: "xuefeng-skill 历史录取 SQLite 聚合",
  repoUrl: "https://github.com/GTdim7/xuefeng-skill",
  license: "MIT",
  sourcePath: "assets/admission_clean.db.gz",
  compressedBytes: 29375180,
  sqliteBytes: 149909504,
  rowCount: 248766,
  tableCount: 2,
  provinceCount: 14,
  years: [2024, 2025],
  schoolNameDistinctCount: 18802,
  majorNameDistinctCount: 27051,
  categoryCount: 8,
  batchCount: 11,
  rankDistinctCount: 71995,
  scoreDistinctCount: 613,
  note: "Only SQLite schema and aggregate coverage counts are imported. The gzipped database and admission rows are not copied into the frontend fact base.",
} as const;

export const gtdimXuefengProvinceBuckets: GtdimXuefengAdmissionBucket[] = [
  { label: "河北", count: 96524 },
  { label: "山东", count: 52395 },
  { label: "浙江", count: 46595 },
  { label: "重庆", count: 29548 },
  { label: "黑龙江", count: 9504 },
  { label: "湖北", count: 4379 },
  { label: "江苏", count: 4351 },
  { label: "北京", count: 3023 },
  { label: "湖南", count: 1717 },
  { label: "上海", count: 264 },
  { label: "广东", count: 202 },
  { label: "内蒙古", count: 182 },
  { label: "安徽", count: 76 },
  { label: "海南", count: 6 },
];

export const gtdimXuefengSchemaBuckets: GtdimXuefengAdmissionBucket[] = [
  { label: "province", count: 14 },
  { label: "year", count: 2 },
  { label: "school_name", count: 18802 },
  { label: "major_name", count: 27051 },
  { label: "category", count: 8 },
  { label: "batch", count: 11 },
  { label: "rank", count: 71995 },
  { label: "score", count: 613 },
];
