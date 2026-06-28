# 数据源接入记录

本项目优先使用学校官网、就业网、就业质量报告、企业官方招聘站和许可证清晰的开源数据。第三方平台岗位数据只在授权、用户本地导入或聚合后使用，不直接发布来源不明的原始岗位明细。

## 已接入样本

### gaokaoweb

- 仓库：https://github.com/laofeijio2020ojbk2022/gaokaoweb
- 许可证：Apache-2.0
- 可用文件：`data/school_id.csv`、`data/school_info.csv`、`data/school_job.csv`
- 当前接入：从 `school_job.csv` 接入 20 所学校的历史就业去向、升学、出国和主要去向单位。
- 当前新增样本：哈尔滨工业大学、北京航空航天大学、北京邮电大学、同济大学、南方科技大学、广州南方学院、重庆移通学院、文华学院、郑州工商学院、武昌首义学院、武汉工商学院、三江学院、郑州升达经贸管理学院、浙江树人学院。
- 使用边界：标为 `partial` 学校证据。它能扩大查询覆盖和发现主要去向单位，但不能替代学校官网当年就业质量报告。

### gaokao-zhiyuan

- 仓库：https://github.com/Jsoneft/gaokao-zhiyuan
- 许可证：MIT
- 可用文件：`hubei_data/table2_hubei.csv`、`hubei_data/ranking_score_hubei_physics.json`、`hubei_data/ranking_score_hubei_history.json`
- 当前接入：从湖北 2024 本科批数据中聚合 18,430 条院校-专业记录、1,032 所院校、663 个专业名称、物理/历史科类分布、专业类别分布、分数/位次范围和一分一段覆盖，生成 `src/data/gaokaoAdmissionSignals.ts`。
- 使用边界：只作为湖北 2024 历史录取样本，不等同全国录取概率；志愿填报必须回到湖北省教育考试院、学校招生章程和当年招生计划复核。

### beijing-gaokao-scores

- 仓库：https://github.com/scottli139/beijing-gaokao-scores
- 许可证：CC-BY-4.0
- 可用文件：`data/beijing-admission-scores.csv`、`data/2023.csv`、`data/2024.csv`、`data/2025.csv`
- 当前接入：从北京本科普通批投档线 CSV 中聚合 3,950 条 2023-2025 投档记录、638 所院校、3,950 个年度院校专业组、83 种选科要求和年度分数区间，生成 `src/data/beijingAdmissionSignals.ts`。
- 使用边界：CC BY 4.0 要求署名和注明变更；当前只保留聚合指标，不复制 CSV 原表。该数据仅代表北京本科普通批历史投档线，正式填报以北京教育考试院当年公告为准。

## 可借鉴但未直接导入

### UniversityCareerWebPage

- 仓库：https://github.com/PotoYang/UniversityCareerWebPage
- 许可证：MIT
- 价值：README 可解析 286 个本科高校就业网、就业指导中心或招聘信息入口。
- 当前处理：已解析为 `src/data/schoolCareerDirectory.ts` 的 286 条入口候选，并在学校详情页按学校名展示命中的就业网入口。当前项目重点学校中有 13 个入口已记录一次健康探测状态，见 `src/data/schoolCareerDirectoryHealth.ts`。
- 使用边界：目录链接需要逐校验证是否仍可访问；只作为入口索引，不代表入口内容已被官方确认。

### shandong-admission-history-query

- 仓库：https://github.com/iChipOwO/shandong-admission-history-query
- 许可证：MIT
- 价值：包含山东普通类常规批第 1 次志愿 2023-2025 年投档数据 manifest、75MB 历史投档 JSON、学校元数据、专业方向索引、学科评估和排名来源。
- 当前处理：已聚合为 `src/data/shandongAdmissionSignals.ts`，保留 1,165 所学校元数据、1,165 所排名覆盖、426 所学科评估覆盖、26 个专业方向组、24 个方向到学科映射和学校省份/标签分布；暂不复制 75MB 原始明细。
- 使用边界：历史投档只供查询参考，不承诺录取；正式填报仍以山东省教育招生考试院、高校招生章程和当年计划为准。

### college-major-selector

- 仓库：https://github.com/shengdabai/college-major-selector
- 许可证：MIT
- 价值：README 标注基于教育部公开数据，覆盖 2,756 所院校、860 个本科专业和全国 31 省志愿规则。
- 当前处理：已聚合为 `src/data/nationalEducationSignals.ts`，保留 2,756 所院校、860 个本科专业、31 省志愿规则、院校省份/类型/层次/公民办和专业门类分布，不复制原始长表。
- 使用边界：该项目核心是用户本地上传录取数据；本项目接入时只复用公开院校、专业和规则索引，不代替当年录取计划。

### gaokao-assistant

- 仓库：https://github.com/shengdabai/gaokao-assistant
- 许可证：MIT
- 价值：项目描述标注基于 2025 青海省真实招生计划数据；`data/laosheng_tags.json` 含院校标签、985/211/双一流、城市和公民办等字段。
- 当前处理：已聚合为 `src/data/qinghaiPlanSignals.ts`，保留 2,875 条院校标签、公办/民办分布、城市 Top 分布和 985/211/双一流计数；不导入具体计划明细。
- 使用边界：招生计划会按年份变化；接入前需要按省份、年份、批次拆分，并保留官方计划来源提示。

### ruoyi-CERS

- 仓库：https://github.com/fjx13038033078/ruoyi-CERS
- 许可证：MIT
- 价值：SQL dump 带 `cers_university`、`cers_major`、`cers_province` 等样本表，覆盖高校、专业投档线、省份高校数量、985/211 分布和推荐系统字段。
- 当前处理：已聚合为 `src/data/ruoyiCersSignals.ts`，保留 377 所高校、64 条专业投档线、29 个省份分布行、院校类型分布和 2024 专业分数区间；不导入用户、收藏、反馈等行为表。
- 使用边界：该仓库更适合作为推荐系统样例与字段参考，正式志愿判断仍需回到考试院、高校招生章程和当年计划复核。

### firmianay/gaokao

- 仓库：https://github.com/firmianay/gaokao
- 许可证：MIT
- 价值：README 示例省份为云南、科目为理科；`data/` 包含 2014-2017 分数段统计表和 2014-2016 某校分专业分数线，可用于位次换算和历史录取概率方法参考。
- 当前处理：已聚合为 `src/data/yunnanScoreSegmentSignals.ts`，保留 488 行分数段统计、64 条专业分数线、25 个专业名、文理累计位次范围和专业分数区间。
- 使用边界：该数据是方法样本，不代表当前年份或全国情况；正式填报必须替换成考生所在省份、当年批次和官方考试院数据。

### gaokao-advisor

- 仓库：https://github.com/sgblizzard/gaokao-advisor
- 许可证：MIT
- 价值：仓库包含 `reports/data_audit_20260514_222320.json`，记录本地 SQLite 参考库的质量审计：2,360 所高校、488,152 行分数段、377,962 行院校录取线、3,298,297 行专业分数线和 4,951,513 行招生计划；2025 分数段覆盖 31 省、57 个科类组。
- 当前处理：已聚合为 `src/data/gaokaoAdvisorAuditSignals.ts`，只保留覆盖量、年份范围、2025 省份覆盖、SQLite 完整性检查、缺失位次等质量门指标。
- 使用边界：README 明确完整参考数据库不随仓库发布，独立数据资产不等于 MIT 授权。本项目只引用审计报告中的二次聚合指标，不复制数据库或岗位/录取明细。

### gaokao-mentor-wisdom

- 仓库：https://github.com/dongsheng123132/gaokao-mentor-wisdom
- 许可证：MIT
- 价值：结构化 JSON 覆盖 105 条高考志愿、专业选择、就业前景、院校推荐、学习建议和人生哲理语录。
- 当前处理：只作为职业规划话术、风险提示和专业避坑标签参考，不作为学校或录取事实数据。
- 使用边界：观点类内容必须与官方数据、岗位需求和学校证据分层展示，不能替代可核验事实。

### shandong-gaokao-volunteer

- 仓库：https://github.com/zap520/shandong-gaokao-volunteer
- 许可证：MIT
- 价值：包含山东一分一段使用指南、特殊班型、专业参考和 rank demo，适合补充志愿解释逻辑。
- 当前处理：登记为山东志愿规则、冲稳保阈值和用户解释文案参考，不导入为录取事实库。
- 使用边界：示例位次和阈值只做方法演示；正式推荐需结合官方投档数据和当年政策。

### Cabbage-xy/gaokao

- 仓库：https://github.com/Cabbage-xy/gaokao
- 许可证：MIT
- 价值：高考志愿推荐系统交互与查询架构参考。
- 当前处理：只登记为架构参考；仓库文件树未发现可直接复用的公开数据文件。
- 使用边界：项目描述中的数据来自掌上高考，未获得授权前不复制或再发布平台数据。

### gaokao-vault

- 仓库：https://github.com/lifefloating/gaokao-vault
- 许可证：Apache-2.0
- 价值：提供学校、专业、录取、来源、质量门和采集管线结构。
- 当前处理：作为后续学校证据导入脚本和 schema 的参考。仓库主要是采集框架，不是可直接导入的高校结果数据包。

### Job_Analysis

- 仓库：https://github.com/radishT/Job_Analysis
- 许可证：MIT
- 价值：包含历史 BOSS / 拉勾岗位清洗和编程语言能力词分析。
- 当前处理：已从 `key_map.sql` 解析 60,033 条历史能力词映射，聚合成 `src/data/bossAggregatedSignals.ts` 的 7 类技术方向和能力词 Top 列表；不导入原始 BOSS 岗位明细。
- 原因：BOSS 直聘属于第三方招聘平台，直接抓取和再发布岗位明细存在合规风险。前端只展示历史聚合能力词频，后续如需明细应做用户本地导入器，让用户导入自己有权使用的导出文件。

### Python-DataScience-Final-AI_IT_Analysis

- 仓库：https://github.com/AnHuanAo/Python-DataScience-Final-AI_IT_Analysis
- 许可证：MIT
- 价值：README 汇总 Kaggle、和鲸社区和 Boss 直聘样本的 AI/IT 岗位待遇分析，给出 2025-2026 全球 AI 薪资、岗位类别薪资、学历经验画像和 2024-2026 国内 IT / AI 岗位趋势。
- 当前处理：已聚合为 `src/data/aiItMarketInsightSignals.ts`，只保留 README 中的年薪量级、角色方向和人才偏好结论；不复制 Notebook 数据表、图像附件或 BOSS 岗位明细。
- 原因：该源适合作为“职业市场偏好”的去标识化聚合洞察；含第三方招聘平台样本，不能当作实时招聘事实或平台明细再发布。

### BossAnalyze

- 仓库：https://github.com/DavidHLP/BossAnalyze
- 许可证：MIT
- 价值：包含 BOSS 直聘分析系统结构、`boss.sql` 和城市/职位/薪资/技能图谱等模块设计。
- 当前处理：只作为 BOSS 聚合分析模型和本地导入器字段设计参考，不导入原始 BOSS 岗位明细。
- 原因：项目 README 明确包含分布式爬虫链路，本项目不复用绕过平台限制的抓取逻辑。

### boozp-neo

- 仓库：https://github.com/Yuzhii0718/boozp-neo
- 许可证：MIT
- 价值：包含 BOSS 岗位采集、清洗、图表仪表盘和热力图的工程结构，可参考字段、清洗步骤和可视化组织方式。
- 当前处理：登记为 BOSS 聚合分析和仪表盘参考源；不导入原始岗位明细，也不复用采集链路。
- 原因：开源许可证覆盖仓库代码，不等于 BOSS 平台岗位数据具备再发布授权；本项目只吸收聚合分析机制。

### python-recruitment-analysis

- 仓库：https://github.com/xiewangzhenyan/python-recruitment-analysis
- 许可证：MIT
- 价值：招聘分析平台样例，README 描述 Boss 直聘等招聘网站采集、清洗、MySQL 存储、薪资预测、岗位匹配、地区薪资地图和技能匹配；`sql/spiderdatabase.zip` 约 37MB。
- 当前处理：只登记为本地导入器字段、薪资预测维度、岗位匹配权重和可视化结构参考；暂不解压或发布原始岗位库。
- 原因：数据来自第三方招聘平台采集链路，开源许可证不自动授予平台岗位明细再发布权。

### bosszhipin_spider

- 仓库：https://github.com/poboll/bosszhipin_spider
- 许可证：MIT
- 价值：仓库含 `merged_java.xlsx` 等 Excel 明细、pandas 分析和 FineBI 可视化示例，可作为“历史岗位聚合字段”候选。
- 当前处理：仅登记为受限候选和可视化参考，不提交 Excel 原表、不导入公司或岗位明细、不复用 pyppeteer 采集脚本。
- 原因：README 明确展示 BOSS 直聘页面自动化采集过程；后续如使用，只能做用户本地有权文件的临时聚合或完全去标识化统计。

## 暂不导入

### xuefeng-agent

- 仓库：https://github.com/ziqihe10-droid/xuefeng-agent
- 许可证：AGPL-3.0
- 价值：README 标注内置 24 省、2024-2025 年官方投档线、约 42 万条，仓库含 `admission_clean.db.gz` 和本地志愿顾问交互。
- 当前处理：只登记为大规模本地数据库候选和产品方法参考，不复制数据库、不复用代码、不并入 MIT 前端事实库。
- 原因：AGPLv3 与当前 MIT 开源策略存在协议兼容风险；README 明确强调网络服务也需同协议开源，未做协议评估或取得单独授权前不能导入。

### hngaokazhiyuan

- 仓库：https://github.com/bbhzyq-dotcom/hngaokazhiyuan
- 许可证：未声明
- 价值：`data/` 下含 `colleges.json`、`majors_845.json`、`college_majors_full.json`、`scores.json`、`rankings.json` 等；README 标注 1,300+ 所高校、830 个专业、35,000+ 高校-专业关联和 20,000+ 录取分数。
- 当前处理：只登记为待授权确认的数据候选源和字段结构参考，不复制 JSON 数据文件。
- 原因：仓库未声明许可证；除非获得授权或改用官方公开来源复核，否则不能把数据复制进开源前端事实库。

### college-major4hs

- 仓库：https://github.com/wonderslife/college-major4hs
- 许可证：未声明
- 价值：包含 2023-2025 投档线、学校信息、学科评估、2025 高校保研率等数据文件。
- 当前处理：暂不导入，仅登记为待授权确认的数据候选源。
- 原因：仓库未声明许可证；除非获得授权或改用官方公开来源复核，否则不能把数据复制进开源前端事实库。

## 后续接入原则

- 学校事实字段必须带来源和年份；没有专业级就业率或薪资来源时继续显示待接入。
- 开源仓库必须保留许可证、仓库 URL 和字段来源说明。
- 对于 BOSS 直聘等平台数据，不写绕过登录、反爬、验证码或批量抓取逻辑。
- 可以接入岗位标题、能力词、城市、薪资区间的聚合统计，但要保留“历史样本 / 非实时事实”的标识。
