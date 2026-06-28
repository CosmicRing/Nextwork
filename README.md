# 看看工资

让数据开口，照亮前途。

看看工资 是一个面向年轻人的公司工资、专业去向和岗位匹配小程序原型。它不再把人生选择简单塞进“专业分类”“行业分类”“岗位分类”这些静态格子里，而是直接把企业官网岗位、薪资区间、高校优势和专业路径关联起来。

当前产品要解决的第一问题是：刚高考完的学生和家长，能在 3 分钟内知道“这个专业未来大概挣多少钱、大厂到底要什么、我该怎么继续查学校和岗位”。因此首页按这个顺序组织：

- 三步决策路径：先筛专业薪资，再看大厂需求，最后回到具体学校和专业核验。
- 专业薪资速览：按专业群展示毕业初期和成熟阶段薪资区间、可去岗位、大厂常看能力、适合人群、大一验证动作、作品/实习信号和风险等级。
- 大厂需求矩阵：把企业官网入口聚合成“公司需要什么岗位族群、偏好哪些专业、校招切入点、应该去官网搜索什么关键词”。
- 学校专业去向：输入学校，展示该校可选专业；点击专业后展示毕业生去向、就业率、平均工资、年度到校企业、官方就业证据和企业官网反查入口。校级证据和专业级指标分开展示；未接入官方就业质量报告或就业中心宣讲会日历前，指标会显示为“待接入”，不伪造统计。
- 职业雷达：输入一个岗位，雷达图从内到外展示专业关联强度排名，并给出可跳转的企业官方招聘入口。
- 职业信号：把官网岗位、专业薪资代理、学校就业证据和企业官方入口统一成 CareerSignal，展示来源、原因、风险、相关专业、相关能力和置信度。

## 核心判断

过去的职业规划常常从一个固定分类开始：

- 你适合文科还是理科
- 你要选什么专业
- 你未来进什么行业
- 你应该找什么岗位

但当下的问题是，社会需求变化太快。AI、机器人、低空经济、智能医疗、新能源、AIGC 内容和企业自动化都在重新拆分岗位能力。一个专业名已经不足以说明未来路径，一个行业名也不足以判断机会质量。

看看工资 的思路是反过来：

1. 先知道自己是谁：学科优势、兴趣、学习方式、风险偏好、家庭约束、城市偏好、作品能力。
2. 再知道社会需要什么：大厂招聘、创业赛道、政策方向、新专业目录、融资与产品动态、真实岗位技能要求。
3. 最后把两者连接起来：专业群、技能路线、作品项目、实习方向、创业验证路径。

## 信息机制

看看工资 借鉴 AI HOT 的信息流机制：多信源抓取、AI 降噪、精选与全量分层、按分类和时间窗检索、给出推荐理由、保留原始来源、开放 Agent / API / RSS 接入。

映射到职业规划场景后，看看工资 的信息机制是：

- 信源层：招聘官网、政策文件、本科专业目录、创业赛道、融资新闻、竞赛项目、开源趋势、学校培养方案。
- 归并层：把重复岗位、同类赛道、相近技能、同一政策事件合并成“职业信号”。
- 评分层：用热度、增长、可信度、稳定性、门槛、迁移性、适配人群给信号打分。
- 精选层：不是展示所有信息，而是留下对年轻人决策真正有价值的信号。
- 解释层：每条推荐必须告诉用户为什么重要、适合谁、不适合谁、下一步该验证什么。
- 接入层：小程序给普通用户看，API / Agent 给老师、咨询师、学校和内容团队做二次分析。

## 当前原型

当前仓库已经实现两个模式：

- 高考选专业：以就业和创业终局倒推专业群选择。
- 技能勋章墙：根据学生已有技能匹配大厂岗位能力要求。

当前数据仍是种子数据，不是全量实时抓取。产品结构已经为后续真实抓取、ClaudeCode 标签、职业信号流和 Agent 接入留出位置。

## 运行

```bash
npm install
npm run dev
```

默认本地地址：

```bash
http://127.0.0.1:5174
```

## 数据命令

```bash
npm run scrape:jobs
npm run search:official -- 算法
npm run analyze:jobs
npm run update:salaries
npm run verify:career-signals
```

当前 `scrape:jobs` 从 ByteDance、Tencent、Alibaba、Baidu、Meituan、JD、Huawei、Kuaishou、Bilibili、Xiaomi、PDD 和 Midea 官方招聘站抓取并归一化岗位，输出到 `data/jobs.normalized.json`、`data/jobs.seed.json` 和 `src/data/jobs.generated.ts`。`update:salaries` 会重跑岗位采集和分析，让薪资字段每日刷新；官方站未公开薪资时会以市场估算标记输出。每日实际可用样本以 `jobDataMeta.sources[].normalizedCount` 为准，避免把官网当前返回 0 的入口误当成有岗位。

长期方向不是把所有搜索结果永久存进仓库，而是在服务端用官方企业招聘站 adapter 做即时搜索/短期缓存，再把返回结果聚合给前端。`search:official` 会返回官方入口、入口关注方向、搜索提示和当前 live adapter 样本。前端的官方源列表已包含 ByteDance、Tencent、Alibaba、Meituan、Baidu、JD、Huawei、Xiaomi、Kuaishou、PDD、Ant、NetEase Games、Bilibili、Midea、BYD、HoYoverse；其中 ByteDance、Tencent、Alibaba、Baidu、Meituan、JD、Huawei、Kuaishou、Bilibili、Xiaomi、PDD 和 Midea 已接 live adapter，其余先作为官方入口等待 adapter 接入。Alibaba adapter 使用阿里巴巴校园招聘官网的批次与岗位搜索接口，Huawei adapter 使用华为招聘官网公开岗位接口，Xiaomi adapter 使用小米中文招聘官网跳转的官方职位域 `xiaomi.jobs.f.mioffice.cn`，PDD adapter 使用拼多多校园招聘官网的应届与实习岗位接口。

学校数据策略是先展示官方证据层，再展示专业级字段。当前清华大学、郑州轻工业大学、浙江大学、电子科技大学、西安电子科技大学已有官方或半官方证据样本；同时接入了 `laofeijio2020ojbk2022/gaokaoweb` 的 Apache-2.0 开源历史就业去向数据，已补充 20 所学校的总体去向、升学、出国和主要去向单位。MIT 的 `PotoYang/UniversityCareerWebPage` 已解析为 286 个高校就业网入口，并在学校详情页作为“就业网入口候选”展示，其中 13 个重点学校入口已记录一次访问健康状态。本轮继续接入 MIT 的 `Jsoneft/gaokao-zhiyuan` 湖北 2024 本科批聚合信号：18,430 条院校-专业记录、1,032 所院校、663 个专业名称和 1,067 个物理/历史一分一段分数段；接入 CC-BY-4.0 的 `scottli139/beijing-gaokao-scores` 北京 2023-2025 本科普通批投档线聚合信号：3,950 条记录、638 所院校、83 种选科要求；接入 CC0 的 `scottli139/beijing-gaokao-score-segments` 北京 2023-2025 一分一段聚合信号：1,005 行分数分布、176,571 名三年累计考生和 650/600/500 分典型位次点；把 MIT 的 `shengdabai/college-major-selector` 聚合为全国院校专业索引：2,756 所院校、860 个本科专业、31 省志愿规则及院校/专业分布桶；继续把 `iChipOwO/shandong-admission-history-query` 聚合为山东 2023-2025 投档元数据：1,165 所学校元数据、26 个专业方向组、426 所学科评估覆盖；把 `shengdabai/gaokao-assistant` 聚合为青海 2025 计划标签库：2,875 条院校标签和公民办/211/双一流统计；接入 `fjx13038033078/ruoyi-CERS` 的推荐系统 SQL 样本聚合：377 所高校、64 条专业投档线、29 个省份分布行；再接入 `firmianay/gaokao` 云南历史分段样本：488 行 2014-2017 分数段统计、64 条专业分数线、25 个专业名；新增 `sgblizzard/gaokao-advisor` 审计覆盖信号：2,360 所高校、488,152 行分数段、377,962 行院校录取线、3,298,297 行专业分数线和 4,951,513 行招生计划的质量审计指标。同时登记但暂不导入 `ziqihe10-droid/xuefeng-agent` 的 AGPLv3 大库候选和 `bbhzyq-dotcom/hngaokazhiyuan` 的无许可证 JSON 数据候选。首页 Source Radar 区分已接样本、数据候选、决策参考和合规阻断。没有专业级就业率或平均工资来源时，继续显示待接入。

BOSS 直聘方向已经检索到 MIT/Apache 项目和历史分析数据，包括 `radishT/Job_Analysis`、`AnHuanAo/Python-DataScience-Final-AI_IT_Analysis`、`DavidHLP/BossAnalyze`、`Yuzhii0718/boozp-neo`、`xiewangzhenyan/python-recruitment-analysis` 和 `poboll/bosszhipin_spider`，但不把原始 BOSS 岗位明细直接并入前端事实库。本轮已把 `radishT/Job_Analysis` 中 60,033 条历史能力词映射聚合成 7 类技术方向和能力词 Top 列表，作为“岗位能力偏好”的历史信号展示；新增 `AnHuanAo/Python-DataScience-Final-AI_IT_Analysis` 的 AI/IT 市场聚合洞察：2025-2026 全球 AI 薪资、2024-2026 国内岗位画像、架构/AI 工程/基础设施等高壁垒方向；`python-recruitment-analysis` 登记为薪资预测、岗位匹配和本地导入器字段参考；`poboll/bosszhipin_spider` 含 Excel 明细但 README 明确是 BOSS 页面自动化采集，因此只列为受限候选。后续明细数据只做用户本地导入自己有权使用的导出文件。无许可证的投档线/学校信息仓库先列为待授权候选，不直接复制数据。数据源筛选记录见 [docs/data-sources.md](docs/data-sources.md)。

`analyze:jobs` 输出 `data/analysis.json`，后续可替换为 ClaudeCode 或 Claude API 生成的标签与分析结果。

## 文档

产品需求文档见：

- [docs/PRD.md](docs/PRD.md)
- [docs/DEVELOPMENT_ARCHITECTURE.md](docs/DEVELOPMENT_ARCHITECTURE.md)
- [docs/data-sources.md](docs/data-sources.md)
- [docs/signal-system.md](docs/signal-system.md)
- [docs/ITERATION_PLAN.md](docs/ITERATION_PLAN.md)

## 产品原则

- 不给年轻人制造焦虑，要给可验证的下一步。
- 不把推荐伪装成命运预测，要展示依据、置信度和风险。
- 不只说“热门”，要说明“为什么热、需要谁、门槛在哪里”。
- 不只推荐专业名，要推荐专业群、能力栈和作品路线。
- 不只服务高考生，也要延展到大学生、转专业、实习、求职和早期创业。

## 外部机制参考

- [AI HOT](https://aihot.virxact.com/)
- [AI HOT Agent 接入](https://aihot.virxact.com/agent)
- [AI HOT 更新日志](https://aihot.virxact.com/changelog)

## 开源协议

本项目遵循 [MIT License](LICENSE) 开源。
