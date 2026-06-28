import { schoolCareerDirectoryCount } from "./schoolCareerDirectory";
import { checkedSchoolCareerDirectoryCount } from "./schoolCareerDirectoryHealth";

export type ExternalDataSource = {
  id: string;
  name: string;
  repoUrl: string;
  license: "MIT" | "Apache-2.0" | "AGPL-3.0" | "Unknown";
  status: "connected-sample" | "directory-reference" | "model-reference" | "architecture-reference" | "blocked-license" | "blocked-raw-import";
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
    coverage: "school_id.csv 约 2890 行；school_job.csv 约 2837 行。",
    currentUse: "已接入 20 所高校的历史就业去向、升学、出国和主要去向单位，作为学校证据的 partial 信号。",
    caution: "开源数据集字段可用，但不是学校官网实时数据；页面必须提示用户继续回到学校就业质量报告复核年份和口径。",
  },
  {
    id: "university-career-webpage-directory",
    name: "UniversityCareerWebPage 全国高校就业信息网汇总",
    repoUrl: "https://github.com/PotoYang/UniversityCareerWebPage",
    license: "MIT",
    status: "directory-reference",
    coverage: "README 可解析 286 个本科高校就业网、就业指导中心或招聘信息入口。",
    currentUse: "已解析为 src/data/schoolCareerDirectory.ts，并在学校详情页按学校名展示命中的就业网入口候选。",
    caution: "目录链接需要逐校 HEAD/页面验证；只作为入口索引，不代表入口仍然可访问或数据已被官方确认。",
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
  {
    id: "davidhlp-boss-analyze",
    name: "BossAnalyze BOSS 直聘分析系统",
    repoUrl: "https://github.com/DavidHLP/BossAnalyze",
    license: "MIT",
    status: "architecture-reference",
    coverage: "包含 boss.sql、岗位分析系统结构、城市/职位/薪资/技能图谱等分析模块设计。",
    currentUse: "只作为 BOSS 聚合分析模型和本地导入器字段设计参考，不导入原始 BOSS 岗位明细。",
    caution: "项目 README 明确包含分布式爬虫链路；本项目不复用绕过平台限制的抓取逻辑。",
  },
  {
    id: "college-major4hs-admission-data",
    name: "college-major4hs 投档线 / 学校信息 / 学科评估",
    repoUrl: "https://github.com/wonderslife/college-major4hs",
    license: "Unknown",
    status: "blocked-license",
    coverage: "包含 2023-2025 投档线、学校信息、学科评估和 2025 高校保研率等数据文件。",
    currentUse: "暂不导入，仅记录为待授权确认的数据候选源。",
    caution: "仓库未声明许可证；除非获得授权或改用官方公开来源复核，否则不能把数据复制进开源前端事实库。",
  },
];

export const connectedExternalSchoolSourceCount = externalDataSources.filter((source) => source.status === "connected-sample").length;
export const externalCareerDirectoryRows = schoolCareerDirectoryCount;
export const checkedExternalCareerDirectoryRows = checkedSchoolCareerDirectoryCount;
export const importedExternalSchoolRows = 20;
export const availableExternalSchoolRows = 2837;
