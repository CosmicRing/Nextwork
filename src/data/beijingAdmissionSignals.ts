export type BeijingAdmissionBucket = {
  label: string;
  count: number;
};

export const beijingAdmissionSignalSource = {
  id: "scottli-beijing-gaokao-scores",
  name: "beijing-gaokao-scores 北京本科普通批投档线",
  repoUrl: "https://github.com/scottli139/beijing-gaokao-scores",
  license: "CC-BY-4.0",
  sourcePath: "data/beijing-admission-scores.csv",
  province: "北京",
  batch: "本科普通批",
  years: [2023, 2024, 2025],
  rowCount: 3950,
  uniqueSchoolCount: 638,
  uniqueSchoolCodeCount: 615,
  majorGroupRowCount: 3950,
  selectionRequirementCount: 83,
  minScore: 101,
  maxScore: 700,
  scoreMinByYear: {
    2023: 448,
    2024: 434,
    2025: 101,
  },
  scoreMaxByYear: {
    2023: 691,
    2024: 700,
    2025: 697,
  },
  note: "只导入北京教育考试院来源投档线 CSV 的聚合指标，并保留 CC BY 4.0 署名要求。",
} as const;

export const beijingAdmissionYearBuckets: BeijingAdmissionBucket[] = [
  { label: "2023 投档线", count: 1301 },
  { label: "2024 投档线", count: 1258 },
  { label: "2025 投档线", count: 1391 },
];

export const beijingAdmissionSchoolYearBuckets: BeijingAdmissionBucket[] = [
  { label: "2023 院校", count: 564 },
  { label: "2024 院校", count: 591 },
  { label: "2025 院校", count: 608 },
];

export const beijingSelectionRequirementBuckets: BeijingAdmissionBucket[] = [
  { label: "不限", count: 1252 },
  { label: "物理＋化学", count: 1069 },
  { label: "物理", count: 550 },
  { label: "物理＋化学(中外合办)", count: 193 },
  { label: "物理＋化学＋生物", count: 156 },
  { label: "不限(中外合办)", count: 98 },
  { label: "物理(中外合办)", count: 91 },
  { label: "思想政治", count: 79 },
  { label: "历史", count: 77 },
  { label: "化学", count: 69 },
];
