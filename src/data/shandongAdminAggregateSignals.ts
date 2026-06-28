export type ShandongAdminAggregateBucket = {
  label: string;
  fileCount: number;
  rowCount: number;
};

export type ShandongAdminTopFileBucket = {
  label: string;
  rowCount: number;
  category: string;
};

export const shandongAdminAggregateSignalSource = {
  id: "zhixinzhang-shandong-admin-data",
  name: "ShandongGaokao-admin-data 山东 2020-2024 管理数据",
  repoUrl: "https://github.com/ZhixinZhang-12/ShandongGaokao-admin-data",
  license: "Apache-2.0",
  sourcePaths: [
    "山东省分数一分一段表/*.xlsx",
    "山东省各批次志愿录取数据/*.xlsx",
    "山东省各批次志愿录取数据年份合并/*.xlsx",
    "山东省招生计划数据/*.xlsx",
    "山东省本专科招生变化/*.CSV",
    "报考要求信息/*",
  ],
  years: [2020, 2021, 2022, 2023, 2024],
  fileCount: 45,
  xlsxCount: 41,
  csvCount: 4,
  sheetCount: 41,
  totalBytes: 28482834,
  xlsxDataRowCount: 480548,
  csvDataRowCount: 28897,
  aggregateRowCount: 509445,
  categoryCount: 7,
  largestFileRowCount: 31755,
  note: "Only category-level file counts, row counts, years, and schema headers are imported. Raw Excel/CSV rows are not copied into the frontend fact base.",
} as const;

export const shandongAdminCategoryBuckets: ShandongAdminAggregateBucket[] = [
  { label: "山东省各批次志愿录取数据年份合并", fileCount: 5, rowCount: 140811 },
  { label: "山东省各批次志愿录取数据", fileCount: 11, rowCount: 139967 },
  { label: "山东省招生计划数据", fileCount: 6, rowCount: 134121 },
  { label: "山东省本专科招生变化", fileCount: 4, rowCount: 50162 },
  { label: "报考要求信息", fileCount: 12, rowCount: 38688 },
  { label: "可视化图表", fileCount: 2, rowCount: 2977 },
  { label: "山东省分数一分一段表", fileCount: 5, rowCount: 2719 },
];

export const shandongAdminTopFileBuckets: ShandongAdminTopFileBucket[] = [
  { label: "2024一二三批次合并", category: "录取数据年份合并", rowCount: 31755 },
  { label: "2023一二三批次合并", category: "录取数据年份合并", rowCount: 29760 },
  { label: "2022一二三批次合并", category: "录取数据年份合并", rowCount: 28472 },
  { label: "山东_招生计划_2022", category: "招生计划", rowCount: 27846 },
  { label: "山东_招生计划_2021", category: "招生计划", rowCount: 25997 },
  { label: "2021一二三批次合并", category: "录取数据年份合并", rowCount: 25937 },
  { label: "2020一二三批次合并", category: "录取数据年份合并", rowCount: 24887 },
  { label: "本科绿本录取计划 yoy 变化", category: "报考要求", rowCount: 24452 },
  { label: "山东_招生计划_2020", category: "招生计划", rowCount: 24407 },
  { label: "山东_招生计划_2024本科", category: "招生计划", rowCount: 22972 },
];
