export type MajorEmploymentBlueprintBucket = {
  label: string;
  value: number;
  unit: string;
};

export const majorEmploymentBlueprintSignalSource = {
  id: "maliangone-zhangxuefeng-employment-bluebook",
  name: "zhangxuefeng-skill 2025 就业/分数线参考",
  repoUrl: "https://github.com/maliangone/zhangxuefeng-skill-ultimate-version",
  license: "MIT",
  sourcePaths: ["references/data/2025-employment-data.md", "references/data/2025-gaokao-lines.md"],
  dataCutoff: "2026-06",
  gaokaoLineCutoff: "2025-06-25",
  averageMonthlySalary2024: 6199,
  greenMajorCount: 6,
  redMajorCount: 5,
  gaokaoProvinceCount: 31,
  firstNewGaokaoProvinceCount2025: 10,
  localUndergraduateEmploymentRate: 85.6,
  nationalUndergraduateEmploymentRate: 86.7,
  manufacturingEmploymentShare: 12.1,
  manufacturingSalaryGrowth2020To2024Percent: 120,
  note: "Only aggregate employment and cutoff-line signals are imported. Long markdown tables, media excerpts, and raw platform data are not copied into the frontend fact base.",
} as const;

export const majorEmploymentSalaryBuckets: MajorEmploymentBlueprintBucket[] = [
  { label: "本科毕业半年后平均月收入", value: 6199, unit: "元/月" },
  { label: "地方本科就业去向落实率", value: 85.6, unit: "%" },
  { label: "全国本科就业去向落实率", value: 86.7, unit: "%" },
  { label: "装备制造就业占比", value: 12.1, unit: "%" },
];

export const majorEmploymentSignalBuckets: MajorEmploymentBlueprintBucket[] = [
  { label: "本科绿牌专业", value: 6, unit: "个" },
  { label: "本科红牌专业", value: 5, unit: "个" },
  { label: "31 省分数线参考", value: 31, unit: "省" },
  { label: "2025 首年新高考省份", value: 10, unit: "省" },
];

export const majorEmploymentRecommendedDirections = [
  "电气工程及其自动化",
  "微电子科学与工程",
  "自动化",
  "机械电子工程/机器人",
  "新能源科学与工程",
  "临床医学（需深造）",
] as const;

export const majorEmploymentRiskDirections = [
  "法学",
  "公共事业管理",
  "艺术类",
  "新闻学/传播学",
  "土木工程/建筑学",
  "生化环材",
  "旅游管理/工商管理",
] as const;

export const majorEmploymentDecisionSignals = [
  "分数线只代表报考门槛，学校和专业录取判断仍要回到位次、计划和招生章程。",
  "2025 首年新高考省份不能和旧高考分数直接比较，应优先使用省内位次。",
  "专业就业判断要同时看薪资、落实率、满意度、行业增长和深造门槛。",
  "该来源是二次整理参考，正式填报必须回到省考试院和高校招生网复核。",
] as const;
