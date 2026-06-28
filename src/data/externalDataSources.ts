import { schoolCareerDirectoryCount } from "./schoolCareerDirectory";
import { checkedSchoolCareerDirectoryCount } from "./schoolCareerDirectoryHealth";

export type ExternalDataSource = {
  id: string;
  name: string;
  repoUrl: string;
  license: "MIT" | "Apache-2.0" | "AGPL-3.0" | "CC-BY-4.0" | "Unknown";
  status:
    | "connected-sample"
    | "data-reference"
    | "directory-reference"
    | "career-aggregate"
    | "model-reference"
    | "decision-reference"
    | "architecture-reference"
    | "blocked-license"
    | "blocked-raw-import";
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
    id: "jsoneft-hubei-admission-2024",
    name: "gaokao-zhiyuan 湖北 2024 本科批录取样本",
    repoUrl: "https://github.com/Jsoneft/gaokao-zhiyuan",
    license: "MIT",
    status: "connected-sample",
    coverage: "table2_hubei.csv 可解析 18,430 条湖北 2024 本科批院校-专业记录，覆盖 1,032 所院校和 663 个专业名称；一分一段 JSON 覆盖物理/历史 1,067 个分数段。",
    currentUse: "已聚合为 src/data/gaokaoAdmissionSignals.ts，只保留记录量、学校数、专业数、科类分布、类别分布、分数/位次范围和高选择性院校摘要。",
    caution: "只代表湖北 2024 本科批历史样本，不等同全国录取概率；志愿填报仍需回到考试院、学校招生章程和当年招生计划复核。",
  },
  {
    id: "scottli-beijing-gaokao-scores",
    name: "beijing-gaokao-scores 北京本科普通批投档线",
    repoUrl: "https://github.com/scottli139/beijing-gaokao-scores",
    license: "CC-BY-4.0",
    status: "connected-sample",
    coverage: "北京教育考试院来源本科普通批投档线，2023-2025 年合计 3,950 条记录，覆盖 638 所院校、83 种选科要求。",
    currentUse: "已聚合为 src/data/beijingAdmissionSignals.ts，保留年度记录数、院校数、选科要求分布和分数区间；不复制 CSV 原表。",
    caution: "CC BY 4.0 要求署名和注明变更；该数据只代表北京本科普通批历史投档线，正式填报仍以北京教育考试院当年公告为准。",
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
    id: "ichipowo-shandong-admission-history",
    name: "shandong-admission-history-query 山东 2023-2025 投档数据",
    repoUrl: "https://github.com/iChipOwO/shandong-admission-history-query",
    license: "MIT",
    status: "connected-sample",
    coverage: "data_manifest.json 标注山东普通类常规批第 1 次志愿 2023-2025 年；含 75MB 历史投档 JSON、学校元数据、专业方向索引、学科评估和排名来源。",
    currentUse: "已聚合为 src/data/shandongAdmissionSignals.ts，保留 1,165 所学校元数据、26 个专业方向组、426 所学科评估覆盖和入口统计；不复制 75MB 原始明细。",
    caution: "历史投档只供查询参考，不承诺录取；正式填报仍以山东省教育招生考试院、高校招生章程和当年计划为准。",
  },
  {
    id: "shengdabai-college-major-selector",
    name: "college-major-selector 全国院校专业索引",
    repoUrl: "https://github.com/shengdabai/college-major-selector",
    license: "MIT",
    status: "connected-sample",
    coverage: "README 标注教育部公开数据：2,756 所院校、860 个本科专业、31 省志愿规则；data/ 下含 universities、major_index、province_rules。",
    currentUse: "已聚合为 src/data/nationalEducationSignals.ts，仅保留学校数、专业数、省份规则数和分布桶，不复制原始行。",
    caution: "该项目设计为用户本地上传录取数据；本项目接入时应只复用公开院校/专业/规则索引，不代替当年录取计划。",
  },
  {
    id: "shengdabai-qinghai-gaokao-assistant",
    name: "gaokao-assistant 青海 2025 招生计划助手",
    repoUrl: "https://github.com/shengdabai/gaokao-assistant",
    license: "MIT",
    status: "connected-sample",
    coverage: "项目描述标注基于 2025 青海省真实招生计划数据；data/laosheng_tags.json 含院校标签、985/211/双一流、城市和公民办等字段。",
    currentUse: "已聚合为 src/data/qinghaiPlanSignals.ts，保留 2,875 条院校标签、公民办、城市和 985/211/双一流计数；不导入具体计划明细。",
    caution: "招生计划会按年份变化；接入前需要按省份、年份、批次拆分，并保留官方计划来源提示。",
  },
  {
    id: "fjx-ruoyi-cers",
    name: "ruoyi-CERS 高考志愿推荐系统 SQL 样本",
    repoUrl: "https://github.com/fjx13038033078/ruoyi-CERS",
    license: "MIT",
    status: "connected-sample",
    coverage: "SQL dump 包含 cers_university、cers_major、cers_province 等样本表，覆盖高校、专业投档线、省份 985/211 分布和推荐系统字段。",
    currentUse: "已聚合为 src/data/ruoyiCersSignals.ts，保留 377 所高校、64 条专业投档线、29 个省份分布和分数区间；不复制用户行为表。",
    caution: "该仓库是教学/系统样例，字段口径需与官方招生数据复核；用户、收藏、反馈等行为样本不得并入前端事实库。",
  },
  {
    id: "firmianay-gaokao-yunnan-score-segments",
    name: "firmianay/gaokao 云南历史分段与专业分数样本",
    repoUrl: "https://github.com/firmianay/gaokao",
    license: "MIT",
    status: "connected-sample",
    coverage: "data/ 下含 2014-2017 分数段统计表和 2014-2016 某校分专业分数线；README 示例省份为云南、科目为理科。",
    currentUse: "已聚合为 src/data/yunnanScoreSegmentSignals.ts，保留 488 行分数段统计、64 条专业分数线、25 个专业名和位次覆盖范围。",
    caution: "该数据适合作为位次换算和录取概率算法样本；正式填报仍需替换为考生所在省份、当年批次和官方考试院数据。",
  },
  {
    id: "sgblizzard-gaokao-advisor-audit",
    name: "gaokao-advisor 2025 本地数据库审计报告",
    repoUrl: "https://github.com/sgblizzard/gaokao-advisor",
    license: "MIT",
    status: "connected-sample",
    coverage: "reports/data_audit_20260514_222320.json 汇总本地 SQLite 参考库审计：2,360 所高校、488,152 行分数段、377,962 行院校录取线、3,298,297 行专业线和 4,951,513 行招生计划。",
    currentUse: "已聚合为 src/data/gaokaoAdvisorAuditSignals.ts，只保留覆盖量、年份范围、2025 省份覆盖和质量门指标，不导入参考数据库。",
    caution: "仓库 README 明确完整数据库不随仓库发布，且独立数据资产不等于 MIT 授权；当前仅引用审计报告中的二次聚合指标。",
  },
  {
    id: "ziqihe10-xuefeng-agent",
    name: "xuefeng-agent AI 高考志愿顾问",
    repoUrl: "https://github.com/ziqihe10-droid/xuefeng-agent",
    license: "AGPL-3.0",
    status: "blocked-license",
    coverage: "README 标注内置 24 省、2024-2025 年官方投档线、约 42 万条；仓库含 admission_clean.db.gz。",
    currentUse: "只登记为大规模本地数据库候选和产品方法参考；不复制数据库、不复用代码、不并入 MIT 前端事实库。",
    caution: "项目 LICENSE 为 AGPLv3 且 README 强调网络服务也需同协议开源；未做协议兼容评估或单独授权前不得导入。",
  },
  {
    id: "bbhzyq-hngaokazhiyuan",
    name: "hngaokazhiyuan 河南志愿填报指导系统",
    repoUrl: "https://github.com/bbhzyq-dotcom/hngaokazhiyuan",
    license: "Unknown",
    status: "blocked-license",
    coverage: "data/ 下含 colleges、majors、college_majors_full、scores、rankings 等 JSON；README 标注 1,300+ 所高校、830 个专业、35,000+ 高校-专业关联和 20,000+ 录取分数。",
    currentUse: "只登记为待授权确认的数据候选源和字段结构参考；不复制 JSON 数据文件。",
    caution: "仓库未声明许可证；除非获得授权或改用官方公开来源复核，否则不能把数据复制进开源前端事实库。",
  },
  {
    id: "dongsheng-gaokao-mentor-wisdom",
    name: "gaokao-mentor-wisdom 专业选择与就业观点库",
    repoUrl: "https://github.com/dongsheng123132/gaokao-mentor-wisdom",
    license: "MIT",
    status: "decision-reference",
    coverage: "结构化 JSON 覆盖 105 条高考志愿、专业选择、就业前景、院校推荐、学习建议和人生哲理语录。",
    currentUse: "只作为职业规划话术、风险提示和专业避坑标签参考，不作为学校或录取事实数据。",
    caution: "观点类内容必须与官方数据、岗位需求和学校证据分层展示，不能替代可核验事实。",
  },
  {
    id: "zap520-shandong-gaokao-volunteer",
    name: "shandong-gaokao-volunteer 山东志愿 Skill 参考",
    repoUrl: "https://github.com/zap520/shandong-gaokao-volunteer",
    license: "MIT",
    status: "decision-reference",
    coverage: "含山东一分一段使用指南、特殊班型、专业参考和 rank demo；偏填报方法论与 Skill 参考。",
    currentUse: "登记为山东志愿规则、冲稳保阈值和用户解释文案参考，不导入为录取事实库。",
    caution: "示例位次和阈值只做方法演示；正式推荐需结合官方投档数据和当年政策。",
  },
  {
    id: "cabbage-gaokao-advisor",
    name: "Cabbage-xy/gaokao 掌上高考推荐系统",
    repoUrl: "https://github.com/Cabbage-xy/gaokao",
    license: "MIT",
    status: "architecture-reference",
    coverage: "项目描述标注数据来自掌上高考，但仓库文件树未发现可直接复用的公开数据文件。",
    currentUse: "只登记为产品交互和查询架构参考，不导入数据。",
    caution: "掌上高考属于第三方平台来源；未获得授权前不复制或再发布平台数据。",
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
    id: "anhuanao-ai-it-analysis",
    name: "AI/IT 岗位待遇分析聚合洞察",
    repoUrl: "https://github.com/AnHuanAo/Python-DataScience-Final-AI_IT_Analysis",
    license: "MIT",
    status: "career-aggregate",
    coverage: "README 基于 Kaggle、和鲸社区和 Boss 直聘手爬数据给出 2024-2026 AI/IT 岗位待遇聚合洞察，含全球薪资、岗位类别、学历经验和国内岗位画像。",
    currentUse: "已聚合为 src/data/aiItMarketInsightSignals.ts，只保留 README 中的薪资区间、角色方向和人才偏好结论，不复制 Notebook 数据表或岗位明细。",
    caution: "含第三方招聘平台样本，不能作为实时招聘事实；页面只展示去标识化聚合洞察，用于专业/能力规划参考。",
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
    id: "yuzhii-boozp-neo",
    name: "boozp-neo BOSS 岗位分析可视化",
    repoUrl: "https://github.com/Yuzhii0718/boozp-neo",
    license: "MIT",
    status: "architecture-reference",
    coverage: "README 标注 python+selenium 采集、清洗、图表仪表盘和热力图；含 config、clean、spider、tools、web 等工程目录。",
    currentUse: "登记为 BOSS 岗位字段、清洗流程和可视化仪表盘参考；不导入平台岗位明细，也不复用采集链路。",
    caution: "BOSS 直聘属于第三方招聘平台；开源许可证覆盖仓库代码，不自动授予岗位平台数据再发布权。",
  },
  {
    id: "xiewangzhenyan-python-recruitment-analysis",
    name: "python-recruitment-analysis 招聘分析平台",
    repoUrl: "https://github.com/xiewangzhenyan/python-recruitment-analysis",
    license: "MIT",
    status: "architecture-reference",
    coverage: "README 标注 Boss 直聘等招聘网站采集、清洗、MySQL 存储、薪资预测和岗位匹配；sql/spiderdatabase.zip 约 37MB。",
    currentUse: "登记为本地导入器字段、薪资预测维度、岗位匹配权重和可视化结构参考；暂不解压或发布原始岗位库。",
    caution: "数据来自第三方招聘平台采集链路，开源许可证不自动授予平台岗位明细再发布权。",
  },
  {
    id: "poboll-bosszhipin-spider",
    name: "bosszhipin_spider BOSS Excel 历史样本",
    repoUrl: "https://github.com/poboll/bosszhipin_spider",
    license: "MIT",
    status: "blocked-raw-import",
    coverage: "仓库含 merged_java.xlsx 等 Excel 明细和 pandas / FineBI 可视化示例，README 明确使用 pyppeteer 采集 BOSS 岗位。",
    currentUse: "只登记为历史 Excel 聚合候选和可视化字段参考；不提交 Excel 原表、不导入公司或岗位明细、不复用采集脚本。",
    caution: "平台岗位明细存在再发布合规风险；如后续使用，只能做用户本地有权文件的临时聚合或完全去标识化统计。",
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
export const connectedExternalCareerAggregateSourceCount = externalDataSources.filter((source) => source.status === "career-aggregate").length;
export const externalCareerDirectoryRows = schoolCareerDirectoryCount;
export const checkedExternalCareerDirectoryRows = checkedSchoolCareerDirectoryCount;
export const importedExternalSchoolRows = 20;
export const availableExternalSchoolRows = 2837;
