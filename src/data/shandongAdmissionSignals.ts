export type ShandongAdmissionBucket = {
  label: string;
  count: number;
};

export const shandongAdmissionSignalSource = {
  id: "ichipowo-shandong-admission-history",
  name: "shandong-admission-history-query 山东 2023-2025 投档元数据",
  repoUrl: "https://github.com/iChipOwO/shandong-admission-history-query",
  license: "MIT",
  province: "山东",
  years: [2023, 2024, 2025],
  batch: "普通类常规批第1次志愿",
  updatedAt: "2026-06-06",
  rawAdmissionFileSizeMb: 75,
  schoolMetadataCount: 1165,
  schoolRankingCount: 1165,
  subjectEvaluationSchoolCount: 426,
  majorDirectionGroupCount: 26,
  majorSubjectMapCount: 24,
  officialWebsiteCount: 280,
  admissionWebsiteCount: 30,
  note: "只接入学校元数据、专业方向组、排名和学科评估覆盖的聚合指标，不复制 75MB 原始投档明细。",
} as const;

export const shandongSchoolProvinceBuckets: ShandongAdmissionBucket[] = [
  { label: "山东", count: 87 },
  { label: "江苏", count: 70 },
  { label: "湖北", count: 62 },
  { label: "北京", count: 59 },
  { label: "河北", count: 57 },
  { label: "广东", count: 56 },
  { label: "陕西", count: 55 },
  { label: "河南", count: 51 },
  { label: "四川", count: 50 },
  { label: "辽宁", count: 48 },
];

export const shandongSchoolTagBuckets: ShandongAdmissionBucket[] = [
  { label: "本科", count: 1165 },
  { label: "公办", count: 859 },
  { label: "民办", count: 299 },
  { label: "双一流", count: 164 },
  { label: "211", count: 138 },
  { label: "985", count: 54 },
  { label: "本科层次职业大学", count: 40 },
  { label: "军校", count: 6 },
  { label: "特殊办学单位", count: 6 },
  { label: "中外合作办学", count: 6 },
];

export const shandongMajorDirectionBuckets: ShandongAdmissionBucket[] = [
  { label: "文学语言类", count: 56 },
  { label: "土木建筑类", count: 30 },
  { label: "艺术类", count: 26 },
  { label: "管理类", count: 24 },
  { label: "计算机类", count: 24 },
  { label: "生物类", count: 24 },
  { label: "农林类", count: 22 },
  { label: "法学类", count: 20 },
  { label: "公安军警类", count: 20 },
  { label: "医学类", count: 20 },
  { label: "电子信息类", count: 19 },
  { label: "能源动力类", count: 19 },
];
