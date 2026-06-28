export type SpiderCollegeAggregateBucket = {
  label: string;
  count: number;
};

export const spiderCollegeAggregateSignalSource = {
  id: "rafael-luo-spider-college",
  name: "spider-college 高校覆盖参考",
  repoUrl: "https://github.com/Rafael-Luo/spider-college",
  license: "MIT",
  sourcePath: "README.md",
  basicSchoolInfoCount: 2651,
  cityCount: 31,
  scoreLineRowCount: 199,
  note: "README-level aggregate coverage is imported as a reference signal only. The repository does not publish a reusable school data table, so raw crawler output and logs are not copied.",
} as const;

export const spiderCollegeAggregateBuckets: SpiderCollegeAggregateBucket[] = [
  { label: "高校基本信息覆盖", count: 2651 },
  { label: "覆盖城市", count: 31 },
  { label: "历年高考分数线", count: 199 },
];
