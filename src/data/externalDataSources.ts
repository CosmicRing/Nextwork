export type ExternalDataSource = {
  id: string;
  name: string;
  repoUrl: string;
  license: "MIT" | "Apache-2.0" | "AGPL-3.0" | "Unknown";
  status: "connected-sample" | "model-reference" | "blocked-raw-import";
  coverage: string;
  currentUse: string;
  caution: string;
};

export const externalDataSources: ExternalDataSource[] = [
  {
    id: "gaokaoweb-school-outcomes",
    name: "gaokaoweb school_job.csv / school_id.csv",
    repoUrl: "https://github.com/laofeijio2020ojbk2022/gaokaoweb",
    license: "Apache-2.0",
    status: "connected-sample",
    coverage: "school_id.csv 约 2890 行；school_job.csv 约 2837 行",
    currentUse: "已先接 6 所高校的历史就业去向、升学、出国和主要去向单位，作为学校证据的 partial 信号。",
    caution: "开源数据集字段可用，但不是学校官网实时数据；页面必须提示用户继续回到学校就业质量报告复核年份和口径。",
  },
  {
    id: "gaokao-vault-schema",
    name: "gaokao-vault",
    repoUrl: "https://github.com/lifefloating/gaokao-vault",
    license: "Apache-2.0",
    status: "model-reference",
    coverage: "提供 school / major / admission / source schema 与采集管线，不直接携带可导入高校结果数据。",
    currentUse: "作为后续学校证据表、来源表、质量门和批量导入脚本的结构参考。",
    caution: "当前不能当作现成高校数据包导入。",
  },
  {
    id: "radisht-boss-job-analysis",
    name: "Job_Analysis BOSS / 拉勾历史岗位分析",
    repoUrl: "https://github.com/radishT/Job_Analysis",
    license: "MIT",
    status: "blocked-raw-import",
    coverage: "包含 2018 年左右的 BOSS / 拉勾爬虫、清洗后 SQL 和编程语言能力词分析材料。",
    currentUse: "只作为历史岗位能力词参考；不把原始 BOSS 岗位明细直接并入前端事实库。",
    caution: "BOSS 直聘岗位属于第三方平台数据，抓取和再发布有合规风险；后续应走授权导出、用户本地导入或只保存聚合能力词。",
  },
];

export const connectedExternalSchoolSourceCount = externalDataSources.filter((source) => source.status === "connected-sample").length;
export const importedExternalSchoolRows = 6;
export const availableExternalSchoolRows = 2837;
