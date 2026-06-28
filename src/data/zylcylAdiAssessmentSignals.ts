export type ZylcylAdiAssessmentBucket = {
  label: string;
  count: number;
};

export const zylcylAdiAssessmentSignalSource = {
  id: "zylcyl-gaokao-advisor-adi-assessment",
  name: "gaokao-advisor ADI 专业路径评估",
  repoUrl: "https://github.com/Zylcyl/gaokao-advisor",
  license: "MIT",
  sourcePaths: [
    "skills/adi-assessment/SKILL.md",
    "skills/adi-assessment/question_bank.json",
    "skills/adi-assessment/baseline_adi.json",
  ],
  questionCount: 8,
  optionCount: 31,
  resourceLevelCount: 3,
  dimensionCount: 4,
  benchmarkCount: 4,
  tierCount: 4,
  scoreMin: 1,
  scoreMax: 625,
  note: "Only aggregate assessment model counts are imported. Raw question text and benchmark JSON are not copied into the frontend fact base.",
} as const;

export const zylcylAdiDimensionBuckets: ZylcylAdiAssessmentBucket[] = [
  { label: "路径数量 paths", count: 5 },
  { label: "成功可达 reach", count: 5 },
  { label: "纠偏能力 correct", count: 5 },
  { label: "损失可控 recover", count: 5 },
];

export const zylcylAdiBenchmarkBuckets: ZylcylAdiAssessmentBucket[] = [
  { label: "计算机类/软件工程", count: 500 },
  { label: "电气/微电子/机械电子", count: 192 },
  { label: "法学", count: 8 },
  { label: "临床医学", count: 3 },
];

export const zylcylAdiTierBuckets: ZylcylAdiAssessmentBucket[] = [
  { label: "低难", count: 300 },
  { label: "中等", count: 150 },
  { label: "较难", count: 50 },
  { label: "高难", count: 1 },
];

export const zylcylAdiQuestionDimensions = [
  "学习能力",
  "学习难度承受",
  "试错能力",
  "调整能力",
  "家庭支持",
  "长期投入意愿",
  "能力拓展习惯",
  "学习状态趋势",
] as const;
