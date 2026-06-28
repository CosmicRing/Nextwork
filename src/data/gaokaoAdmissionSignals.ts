export type AdmissionBucket = {
  label: string;
  count: number;
};

export type AdmissionSchoolSignal = {
  school: string;
  province: string;
  city: string;
  maxScore: number;
  bestRank: number;
  tags: string[];
};

export type AdmissionVolumeSchool = {
  school: string;
  province: string;
  city: string;
  recordCount: number;
};

export const hubeiAdmissionSignalSource = {
  repoUrl: "https://github.com/Jsoneft/gaokao-zhiyuan",
  license: "MIT",
  sourcePath: "hubei_data/table2_hubei.csv",
  rankSourcePaths: ["hubei_data/ranking_score_hubei_physics.json", "hubei_data/ranking_score_hubei_history.json"],
  province: "湖北",
  year: 2024,
  batch: "本科批",
  rowCount: 18430,
  scoredRowCount: 18278,
  uniqueSchoolCount: 1032,
  uniqueMajorNameCount: 663,
  scoreRange: { min: 372, max: 692 },
  rankRange: { best: 9, worst: 167641 },
  oneScoreBands: {
    physics: { bands: 546, highestBand: "695-750", lowestBand: "150", totalPeople: 245038 },
    history: { bands: 521, highestBand: "670-750", lowestBand: "150", totalPeople: 124223 },
  },
  note: "Only aggregated 2024 Hubei undergraduate admission signals are imported. Raw CSV rows remain in the source repository.",
} as const;

export const hubeiAdmissionSubjectBuckets: AdmissionBucket[] = [
  { label: "物理", count: 13680 },
  { label: "历史", count: 4750 },
];

export const hubeiAdmissionCategoryBuckets: AdmissionBucket[] = [
  { label: "工科", count: 8575 },
  { label: "经管法", count: 4971 },
  { label: "设计与艺术", count: 2229 },
  { label: "文科", count: 1932 },
  { label: "语言类", count: 1543 },
  { label: "医科", count: 1506 },
  { label: "理科", count: 1223 },
];

export const hubeiAdmissionOwnershipBuckets: AdmissionBucket[] = [
  { label: "公办", count: 15167 },
  { label: "民办", count: 3253 },
  { label: "未标注", count: 10 },
];

export const hubeiTopSelectiveSchools: AdmissionSchoolSignal[] = [
  { school: "清华大学", province: "北京", city: "北京海淀区", maxScore: 692, bestRank: 9, tags: ["985", "211", "双一流", "C9"] },
  { school: "北京大学", province: "北京", city: "北京海淀区", maxScore: 691, bestRank: 30, tags: ["985", "211", "双一流", "C9"] },
  { school: "北京大学医学部", province: "北京", city: "北京海淀区", maxScore: 679, bestRank: 36, tags: ["985", "211", "双一流"] },
  { school: "复旦大学", province: "上海", city: "上海杨浦区", maxScore: 688, bestRank: 55, tags: ["985", "211", "双一流", "C9"] },
  { school: "中国人民大学", province: "北京", city: "北京海淀区", maxScore: 684, bestRank: 55, tags: ["985", "211", "双一流"] },
  { school: "上海交通大学", province: "上海", city: "上海闵行区", maxScore: 689, bestRank: 59, tags: ["985", "211", "双一流", "C9"] },
  { school: "浙江大学", province: "浙江", city: "浙江杭州市", maxScore: 673, bestRank: 176, tags: ["985", "211", "双一流", "C9"] },
  { school: "南京大学", province: "江苏", city: "江苏南京市", maxScore: 671, bestRank: 245, tags: ["985", "211", "双一流", "C9"] },
];

export const hubeiHighVolumeAdmissionSchools: AdmissionVolumeSchool[] = [
  { school: "武汉工程大学", province: "湖北", city: "湖北武汉市", recordCount: 174 },
  { school: "长江大学", province: "湖北", city: "湖北荆州市", recordCount: 157 },
  { school: "湖北经济学院", province: "湖北", city: "湖北武汉市", recordCount: 139 },
  { school: "三峡大学", province: "湖北", city: "湖北宜昌市", recordCount: 128 },
  { school: "湖北工业大学", province: "湖北", city: "湖北武汉市", recordCount: 126 },
  { school: "湖北大学", province: "湖北", city: "湖北武汉市", recordCount: 109 },
  { school: "江汉大学", province: "湖北", city: "湖北武汉市", recordCount: 109 },
  { school: "湖北第二师范学院", province: "湖北", city: "湖北武汉市", recordCount: 89 },
];

export const hubeiAdmissionOneScoreBandCount =
  hubeiAdmissionSignalSource.oneScoreBands.physics.bands + hubeiAdmissionSignalSource.oneScoreBands.history.bands;
