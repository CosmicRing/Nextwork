export type YunnanScoreSegmentBucket = {
  label: string;
  count: number;
};

export const yunnanScoreSegmentSignalSource = {
  id: "firmianay-gaokao-yunnan-score-segments",
  name: "firmianay/gaokao 云南历史分段与专业分数样本",
  repoUrl: "https://github.com/firmianay/gaokao",
  license: "MIT",
  province: "云南",
  scoreSegmentYears: [2014, 2015, 2016, 2017],
  majorScoreYears: [2014, 2015, 2016],
  scoreSegmentRowCount: 488,
  majorScoreRowCount: 64,
  uniqueMajorCount: 25,
  minMajorScore: 532,
  maxMajorScore: 625,
  maxScienceCumulativeRank: 158889,
  maxLiberalCumulativeRank: 115414,
  note: "接入云南示例分数段与某校分专业分数线的聚合指标，用于位次换算和历史录取概率方法参考。",
} as const;

export const yunnanScoreSegmentYearBuckets: YunnanScoreSegmentBucket[] = [
  { label: "2014 分段行", count: 122 },
  { label: "2015 分段行", count: 122 },
  { label: "2016 分段行", count: 122 },
  { label: "2017 分段行", count: 122 },
];

export const yunnanMajorScoreYearBuckets: YunnanScoreSegmentBucket[] = [
  { label: "2014 专业线", count: 23 },
  { label: "2015 专业线", count: 23 },
  { label: "2016 专业线", count: 18 },
];

export const yunnanMajorNameBuckets: YunnanScoreSegmentBucket[] = [
  { label: "材料科学与工程", count: 3 },
  { label: "测控技术与仪器", count: 3 },
  { label: "电气工程及其自动化", count: 3 },
  { label: "电子信息工程", count: 3 },
  { label: "电子信息科学与技术", count: 3 },
  { label: "光电信息科学与工程", count: 3 },
  { label: "机械设计制造及其自动化", count: 3 },
  { label: "集成电路设计与集成系统", count: 3 },
  { label: "计算机科学与技术", count: 3 },
  { label: "软件工程", count: 3 },
  { label: "通信工程", count: 3 },
  { label: "微电子科学与工程", count: 3 },
];
