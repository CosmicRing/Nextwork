export type BossExcelAggregateBucket = {
  label: string;
  count: number;
};

export type BossExcelAggregateRoleBucket = BossExcelAggregateBucket & {
  salaryMeanK: number;
  salaryMedianK: number;
  salaryMinK: number;
  salaryMaxK: number;
};

export const bossExcelAggregateSignalSource = {
  id: "poboll-bosszhipin-spider",
  name: "bosszhipin_spider BOSS Excel 去标识化聚合",
  repoUrl: "https://github.com/poboll/bosszhipin_spider",
  license: "MIT",
  sourcePath: "芭比公组_分析数据.xlsx",
  supportingSourcePaths: ["merged_java.xlsx", "merged_后端开发.xlsx", "merged_测试工程师.xlsx"],
  workbookSheetCount: 3,
  rowCount: 15897,
  roleFamilyCount: 3,
  regionCount: 18,
  districtCount: 182,
  educationBucketCount: 16,
  experienceBucketCount: 14,
  companyTypeBucketCount: 95,
  companySizeBucketCount: 6,
  salaryMeanK: 14.03,
  salaryMedianK: 12.5,
  salaryMinK: 1.5,
  salaryMaxK: 85,
  note: "Only workbook-level aggregate counts are imported. Raw BOSS job rows, company names, job titles, and crawler logic are not copied into the frontend fact base.",
} as const;

export const bossExcelRoleBuckets: BossExcelAggregateRoleBucket[] = [
  { label: "后端开发", count: 5399, salaryMeanK: 15.77, salaryMedianK: 12.5, salaryMinK: 1.5, salaryMaxK: 65 },
  { label: "Java", count: 5099, salaryMeanK: 14.74, salaryMedianK: 12.5, salaryMinK: 1.5, salaryMaxK: 75 },
  { label: "测试工程师", count: 5399, salaryMeanK: 11.62, salaryMedianK: 10, salaryMinK: 1.5, salaryMaxK: 85 },
];

export const bossExcelRegionBuckets: BossExcelAggregateBucket[] = [
  { label: "重庆", count: 900 },
  { label: "广州", count: 900 },
  { label: "杭州", count: 900 },
  { label: "长沙", count: 900 },
  { label: "南京", count: 900 },
  { label: "天津", count: 900 },
  { label: "郑州", count: 900 },
  { label: "西安", count: 900 },
  { label: "福州", count: 900 },
  { label: "成都", count: 900 },
  { label: "厦门", count: 900 },
  { label: "苏州", count: 900 },
  { label: "合肥", count: 900 },
  { label: "青岛", count: 900 },
  { label: "上海", count: 900 },
  { label: "昆明", count: 900 },
  { label: "北京", count: 899 },
  { label: "武汉", count: 598 },
];

export const bossExcelEducationBuckets: BossExcelAggregateBucket[] = [
  { label: "本科", count: 10669 },
  { label: "大专", count: 3825 },
  { label: "学历不限", count: 846 },
  { label: "硕士", count: 203 },
];

export const bossExcelExperienceBuckets: BossExcelAggregateBucket[] = [
  { label: "3-5年", count: 5824 },
  { label: "1-3年", count: 5111 },
  { label: "经验不限", count: 2123 },
  { label: "5-10年", count: 1852 },
  { label: "1年以内", count: 329 },
  { label: "在校/应届", count: 313 },
];

export const bossExcelCompanyTypeBuckets: BossExcelAggregateBucket[] = [
  { label: "计算机软件", count: 4970 },
  { label: "互联网", count: 2625 },
  { label: "移动互联网", count: 989 },
  { label: "电子商务", count: 614 },
  { label: "通信/网络设备", count: 539 },
  { label: "计算机服务", count: 495 },
  { label: "智能硬件", count: 487 },
  { label: "电子/半导体/集成电路", count: 438 },
  { label: "数据服务", count: 353 },
  { label: "企业服务", count: 333 },
];

export const bossExcelSkillBuckets: BossExcelAggregateBucket[] = [
  { label: "Java", count: 5398 },
  { label: "Spring", count: 3361 },
  { label: "MySQL", count: 2899 },
  { label: "后端开发", count: 2816 },
  { label: "功能测试", count: 2525 },
  { label: "性能测试", count: 2156 },
  { label: "Python", count: 1940 },
  { label: "自动化测试", count: 1923 },
  { label: "SQL", count: 1884 },
  { label: "软件测试", count: 1875 },
  { label: "分布式技术", count: 1468 },
  { label: "Linux", count: 1348 },
  { label: "Redis", count: 1315 },
  { label: "微服务架构", count: 1243 },
  { label: "SpringBoot", count: 1110 },
];
