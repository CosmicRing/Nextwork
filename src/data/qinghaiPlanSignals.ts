export type QinghaiPlanBucket = {
  label: string;
  count: number;
};

export const qinghaiPlanSignalSource = {
  id: "shengdabai-qinghai-gaokao-assistant",
  name: "gaokao-assistant 青海 2025 招生计划标签库",
  repoUrl: "https://github.com/shengdabai/gaokao-assistant",
  license: "MIT",
  province: "青海",
  year: 2025,
  sourcePath: "data/laosheng_tags.json",
  schoolTagRowCount: 2875,
  publicSchoolCount: 2065,
  privateSchoolCount: 810,
  project985Count: 39,
  project211Count: 116,
  doubleFirstClassCount: 39,
  note: "接入 2025 青海招生计划助手中的院校标签聚合，不导入具体计划明细或录取预测。",
} as const;

export const qinghaiPlanCityBuckets: QinghaiPlanBucket[] = [
  { label: "郑州", count: 159 },
  { label: "南京", count: 150 },
  { label: "济南", count: 142 },
  { label: "广州", count: 140 },
  { label: "长沙", count: 126 },
  { label: "成都", count: 121 },
  { label: "合肥", count: 114 },
  { label: "武汉", count: 112 },
  { label: "南昌", count: 101 },
  { label: "石家庄", count: 99 },
];

export const qinghaiPlanOwnerBuckets: QinghaiPlanBucket[] = [
  { label: "公办", count: 2065 },
  { label: "民办", count: 810 },
];

export const qinghaiPlanProjectBuckets: QinghaiPlanBucket[] = [
  { label: "985", count: 39 },
  { label: "211", count: 116 },
  { label: "双一流", count: 39 },
];
