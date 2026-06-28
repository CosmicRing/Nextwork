export type NationalEducationBucket = {
  label: string;
  count: number;
};

export const nationalEducationSignalSource = {
  id: "shengdabai-college-major-selector",
  name: "college-major-selector 全国院校专业索引",
  repoUrl: "https://github.com/shengdabai/college-major-selector",
  license: "MIT",
  sourcePaths: ["data/universities.json", "data/majors_flat.json", "data/province_rules.json"],
  schoolCount: 2756,
  undergraduateMajorCount: 860,
  provinceRuleCount: 31,
  specialMajorCount: 508,
  controlledMajorCount: 163,
  updatedYear: 2026,
  note: "仅导入公开院校、专业和省份规则的聚合指标，不复制原始学校或录取明细。",
} as const;

export const nationalEducationSchoolProvinceBuckets: NationalEducationBucket[] = [
  { label: "江苏省", count: 167 },
  { label: "广东省", count: 160 },
  { label: "河南省", count: 156 },
  { label: "山东省", count: 153 },
  { label: "四川省", count: 134 },
  { label: "湖北省", count: 130 },
  { label: "湖南省", count: 128 },
  { label: "河北省", count: 123 },
  { label: "安徽省", count: 121 },
  { label: "辽宁省", count: 114 },
];

export const nationalEducationSchoolTypeBuckets: NationalEducationBucket[] = [
  { label: "其他", count: 982 },
  { label: "理工", count: 575 },
  { label: "师范", count: 234 },
  { label: "综合", count: 184 },
  { label: "医药", count: 161 },
  { label: "财经", count: 144 },
  { label: "艺术", count: 107 },
  { label: "农林", count: 85 },
  { label: "政法", count: 63 },
  { label: "航空航天", count: 40 },
];

export const nationalEducationSchoolLayerBuckets: NationalEducationBucket[] = [
  { label: "专科", count: 1486 },
  { label: "本科", count: 1270 },
];

export const nationalEducationSchoolOwnerBuckets: NationalEducationBucket[] = [
  { label: "公办", count: 1982 },
  { label: "民办", count: 762 },
  { label: "中外合作", count: 10 },
  { label: "与港澳台合作", count: 2 },
];

export const nationalEducationMajorCategoryBuckets: NationalEducationBucket[] = [
  { label: "工学", count: 293 },
  { label: "文学", count: 124 },
  { label: "管理学", count: 75 },
  { label: "艺术学", count: 67 },
  { label: "医学", count: 62 },
  { label: "法学", count: 56 },
  { label: "理学", count: 53 },
  { label: "农学", count: 51 },
  { label: "教育学", count: 36 },
  { label: "经济学", count: 30 },
  { label: "历史学", count: 9 },
  { label: "哲学", count: 4 },
];

export const nationalEducationVolunteerModeBuckets: NationalEducationBucket[] = [
  { label: "院校专业组", count: 22 },
  { label: "专业(类)+院校", count: 7 },
  { label: "院校+专业(传统平行)", count: 2 },
];
