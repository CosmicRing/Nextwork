export type LinxkonBossShanghaiAggregateBucket = {
  label: string;
  count: number;
};

export const linxkonBossShanghaiAggregateSignalSource = {
  id: "linxkon-bosszhipin-shanghai-20240502",
  name: "BossZhiPin_Spyder 上海 BOSS CSV 去标识化聚合",
  repoUrl: "https://github.com/linxkon/BossZhiPin_Spyder",
  license: "Apache-2.0",
  sourcePath: "data/上海boss直聘20240502.csv",
  city: "上海",
  crawledAt: "2024-05-02",
  rowCount: 4197,
  regionCount: 16,
  locationCount: 207,
  salaryParsedCount: 4178,
  salaryMedianK: 30,
  salaryAverageK: 32.7,
  note: "Only aggregate counts are imported. Raw BOSS job rows, detail URLs, company identifiers, and crawler logic are not copied into the frontend fact base.",
} as const;

export const linxkonBossShanghaiSalaryBuckets: LinxkonBossShanghaiAggregateBucket[] = [
  { label: "10K以下", count: 310 },
  { label: "10-20K", count: 869 },
  { label: "20-30K", count: 661 },
  { label: "30-50K", count: 1551 },
  { label: "50K以上", count: 787 },
];

export const linxkonBossShanghaiRoleBuckets: LinxkonBossShanghaiAggregateBucket[] = [
  { label: "AI/算法/数据", count: 2552 },
  { label: "软件/开发", count: 915 },
  { label: "机械/自动化/电气", count: 285 },
  { label: "硬件/电子/嵌入式", count: 139 },
  { label: "测试/运维/安全", count: 128 },
  { label: "工程/制造/施工", count: 97 },
];

export const linxkonBossShanghaiExperienceBuckets: LinxkonBossShanghaiAggregateBucket[] = [
  { label: "3-5年", count: 1487 },
  { label: "经验不限", count: 948 },
  { label: "1-3年", count: 827 },
  { label: "5-10年", count: 807 },
  { label: "10年以上", count: 78 },
  { label: "1年以内", count: 50 },
];

export const linxkonBossShanghaiEducationBuckets: LinxkonBossShanghaiAggregateBucket[] = [
  { label: "本科", count: 2376 },
  { label: "硕士", count: 996 },
  { label: "学历不限", count: 355 },
  { label: "大专", count: 355 },
  { label: "博士", count: 71 },
  { label: "中专/中技", count: 24 },
];

export const linxkonBossShanghaiKeywordBuckets: LinxkonBossShanghaiAggregateBucket[] = [
  { label: "算法", count: 2448 },
  { label: "软件", count: 348 },
  { label: "AI", count: 203 },
  { label: "数据", count: 99 },
  { label: "机械", count: 97 },
  { label: "C++", count: 77 },
  { label: "Java", count: 76 },
  { label: "嵌入式", count: 68 },
  { label: "设计", count: 64 },
  { label: "电气", count: 56 },
  { label: "后端", count: 55 },
  { label: "测试", count: 43 },
];
