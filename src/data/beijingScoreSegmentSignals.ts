export type BeijingScoreSegmentBucket = {
  label: string;
  count: number;
};

export const beijingScoreSegmentSignalSource = {
  id: "scottli-beijing-gaokao-score-segments",
  name: "beijing-gaokao-score-segments 北京一分一段",
  repoUrl: "https://github.com/scottli139/beijing-gaokao-score-segments",
  license: "CC0-1.0",
  sourcePath: "data/combined.json",
  province: "北京",
  years: [2023, 2024, 2025],
  rowCount: 1005,
  candidateTotal: 176571,
  highestScoreLabels: ["696分以上", "700以上", "698分以上"],
  lowestScoreLabel: "100→109",
  numericScoreMin: 380,
  numericScoreMax: 699,
  rank650ByYear: {
    2023: 2754,
    2024: 3176,
    2025: 3203,
  },
  rank600ByYear: {
    2023: 10348,
    2024: 10787,
    2025: 11883,
  },
  rank500ByYear: {
    2023: 31831,
    2024: 32208,
    2025: 37553,
  },
  note: "只导入北京教育考试院公开一分一段表的聚合指标，用于分数到位次的解释信号。",
} as const;

export const beijingScoreSegmentYearBuckets: BeijingScoreSegmentBucket[] = [
  { label: "2023 分段", count: 327 },
  { label: "2024 分段", count: 331 },
  { label: "2025 分段", count: 347 },
];

export const beijingScoreSegmentCandidateBuckets: BeijingScoreSegmentBucket[] = [
  { label: "2023 累计考生", count: 55201 },
  { label: "2024 累计考生", count: 55936 },
  { label: "2025 累计考生", count: 65434 },
];
