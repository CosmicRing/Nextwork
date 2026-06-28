export type RuoyiCersBucket = {
  label: string;
  count: number;
};

export const ruoyiCersSignalSource = {
  id: "fjx-ruoyi-cers",
  name: "ruoyi-CERS 高考志愿推荐系统 SQL 样本",
  repoUrl: "https://github.com/fjx13038033078/ruoyi-CERS",
  license: "MIT",
  sourcePath: "sql/dump-ry-cers-202505301633.sql",
  universityCount: 377,
  majorScoreCount: 64,
  provinceRowCount: 29,
  provinceTotalUniversityCount: 2709,
  project985Count: 40,
  project211Count: 102,
  province985TotalCount: 33,
  province211TotalCount: 101,
  minMajorScore2024: 577,
  maxMajorScore2024: 708,
  note: "只接入 SQL 样本的高校、专业投档线和省份分布聚合指标，不复制用户、收藏或行为表数据。",
} as const;

export const ruoyiCersUniversityLocationBuckets: RuoyiCersBucket[] = [
  { label: "广东", count: 72 },
  { label: "北京", count: 25 },
  { label: "江苏", count: 15 },
  { label: "福建", count: 13 },
  { label: "山东", count: 13 },
  { label: "上海", count: 13 },
  { label: "安徽", count: 12 },
  { label: "江西", count: 12 },
  { label: "重庆", count: 11 },
  { label: "广西", count: 11 },
  { label: "贵州", count: 11 },
  { label: "黑龙江", count: 11 },
];

export const ruoyiCersUniversityTypeBuckets: RuoyiCersBucket[] = [
  { label: "综合类", count: 143 },
  { label: "理工类", count: 108 },
  { label: "师范类", count: 36 },
  { label: "医学类", count: 24 },
  { label: "财经类", count: 23 },
  { label: "农林类", count: 20 },
  { label: "政法类", count: 7 },
  { label: "民族类", count: 4 },
  { label: "艺术类", count: 4 },
  { label: "语言类", count: 4 },
  { label: "体育类", count: 3 },
];

export const ruoyiCersProvinceUniversityBuckets: RuoyiCersBucket[] = [
  { label: "河南", count: 184 },
  { label: "江苏", count: 180 },
  { label: "广东", count: 179 },
  { label: "山东", count: 153 },
  { label: "四川", count: 134 },
  { label: "湖北", count: 130 },
  { label: "湖南", count: 128 },
  { label: "河北", count: 123 },
  { label: "安徽", count: 121 },
  { label: "北京", count: 115 },
];

export const ruoyiCersMajorNameBuckets: RuoyiCersBucket[] = [
  { label: "理科试验班类", count: 3 },
  { label: "社会科学试验班", count: 3 },
  { label: "电子信息类", count: 2 },
  { label: "法学类", count: 2 },
  { label: "计算机类", count: 2 },
  { label: "英语", count: 2 },
  { label: "哲学类", count: 2 },
  { label: "中国语言文学类", count: 2 },
];
