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

### beijing-gaokao-score-segments

- 仓库：https://github.com/scottli139/beijing-gaokao-score-segments
- 许可证：CC0-1.0
- 可用文件：`data/combined.json`、`data/combined.csv`、`data/beijing_gaokao_score_segments_2023.csv`、`data/beijing_gaokao_score_segments_2024.csv`、`data/beijing_gaokao_score_segments_2025.csv`
- 当前接入：从北京一分一段合并数据中聚合 1,005 行 2023-2025 分数分布、176,571 名三年累计考生、年度最高/最低分段和 650/600/500 分典型位次点，生成 `src/data/beijingScoreSegmentSignals.ts`。
- 使用边界：只作为北京分数到位次解释信号，不等同录取概率；正式填报必须结合当年投档线、招生计划和北京教育考试院公告。

## 可借鉴但未直接导入

### UniversityCareerWebPage

- 仓库：https://github.com/PotoYang/UniversityCareerWebPage
- 许可证：MIT
- 价值：README 可解析 286 个本科高校就业网、就业指导中心或招聘信息入口。
- 当前处理：已解析为 `src/data/schoolCareerDirectory.ts` 的 286 条入口候选，并在学校详情页按学校名展示命中的就业网入口。当前项目重点学校中有 13 个入口已记录一次健康探测状态，见 `src/data/schoolCareerDirectoryHealth.ts`。
- 使用边界：目录链接需要逐校验证是否仍可访问；只作为入口索引，不代表入口内容已被官方确认。

### spider-college

- 仓库：https://github.com/Rafael-Luo/spider-college
- 许可证：MIT
- 价值：README 标注已爬取 2,651 条高校基本信息、31 个城市和 199 条历年高考分数线，可作为后续高校基础库补全的覆盖参考。
- 当前处理：已聚合为 `src/data/spiderCollegeAggregateSignals.ts`，只保留 README 级覆盖量：高校基本信息数、城市数和历年分数线数。
- 使用边界：仓库主要发布采集代码、日志和数据库操作说明，没有可直接复用的公开数据表；当前不复制爬虫日志或采集结果，不把覆盖量当作已导入学校事实。

### shandong-admission-history-query

- 仓库：https://github.com/iChipOwO/shandong-admission-history-query
- 许可证：MIT
- 价值：包含山东普通类常规批第 1 次志愿 2023-2025 年投档数据 manifest、75MB 历史投档 JSON、学校元数据、专业方向索引、学科评估和排名来源。
- 当前处理：已聚合为 `src/data/shandongAdmissionSignals.ts`，保留 1,165 所学校元数据、1,165 所排名覆盖、426 所学科评估覆盖、26 个专业方向组、24 个方向到学科映射和学校省份/标签分布；暂不复制 75MB 原始明细。
- 使用边界：历史投档只供查询参考，不承诺录取；正式填报仍以山东省教育招生考试院、高校招生章程和当年计划为准。

### ShandongGaokao-admin-data

- 仓库：https://github.com/ZhixinZhang-12/ShandongGaokao-admin-data
- 许可证：Apache-2.0
- 价值：仓库包含山东 2020-2024 年一分一段、各批次志愿录取、年份合并录取数据、招生计划、本专科招生变化、报考要求和可视化图表等 45 个 Excel/CSV 文件。
- 当前处理：使用本机临时目录读取 41 个 Excel sheet 和 4 个 CSV，聚合为 `src/data/shandongAdminAggregateSignals.ts`。只保留 45 个文件、2020-2024 年覆盖、7 类目录、480,548 行 Excel 数据、28,897 行 CSV 数据和重点表规模；不提交 Excel/CSV 原表。
- 使用边界：该源只代表山东历史样本，不能外推为全国规律或当年录取概率；正式填报仍以山东省教育招生考试院、高校招生章程和当年计划为准。

### china-university-admission

- 仓库：https://github.com/EvanYao826/china-university-admission
- 许可证：MIT
- 价值：README 标注为高考/考研数据查询平台，`data/test.db` 为 SQLite 本地数据库，含高校基础信息、本科录取数据和研究生录取数据；CSV 模板要求保留 `source_url`。
- 当前处理：使用本机临时目录读取 SQLite 结构，聚合为 `src/data/chinaUniversityAdmissionAggregateSignals.ts`。只保留 5 张表、1,167 所高校、6,392 条 2023-2025 本科录取、12 条研究生录取、31 省、279 城市、89 个 source_url 和 6,209 条 source_url 填充记录；不提交 SQLite 原库或录取明细。
- 使用边界：该库是社区整理的公开来源数据，README 提醒仅供学习研究参考；正式填报必须回到各省考试院、高校官网和研招网复核。

### xuefeng-skill

- 仓库：https://github.com/GTdim7/xuefeng-skill
- 许可证：MIT
- 价值：仓库内置 `assets/admission_clean.db.gz`，README/schema 标注为本地历史录取 SQLite 数据库，覆盖 2024-2025 年、14 省、约 248,766 条记录，并强调位次优先于分数。
- 当前处理：使用本机临时目录下载并解压 SQLite，聚合为 `src/data/gtdimXuefengAdmissionAggregateSignals.ts`。只保留 248,766 行记录数、14 省、2024-2025 年、18,802 个学校名、27,051 个专业名、8 类科类、11 类批次、71,995 个位次值和 613 个分数值；不提交 gzip/SQLite 原库或录取明细。
- 使用边界：历史录取数据只能做位次法参考，不构成当前年录取承诺；正式填报仍需回到省考试院和高校招生网复核。

### zhangxuefeng-skill-ultimate-version

- 仓库：https://github.com/maliangone/zhangxuefeng-skill-ultimate-version
- 许可证：MIT
- 价值：`references/data/2025-employment-data.md` 汇总 2025 就业蓝皮书相关指标，`references/data/2025-gaokao-lines.md` 汇总 2025 年全国 31 省高考分数线和新高考口径提醒。
- 当前处理：已聚合为 `src/data/majorEmploymentBlueprintSignals.ts`，只保留 2024 届本科毕业半年后平均月收入 6,199 元、6 个绿牌专业、5 个红牌专业、31 省分数线覆盖、10 个 2025 首年新高考省份和就业落实率等摘要指标；不复制长表、媒体原文或原始岗位明细。
- 使用边界：该源是二次整理参考，适合补充“专业就业蓝图”和“位次优先”提醒；正式填报仍必须回到省考试院、高校招生网、招生章程和学校就业质量报告复核。

### Zylcyl/gaokao-advisor

- 仓库：https://github.com/Zylcyl/gaokao-advisor
- 许可证：MIT
- 价值：`skills/adi-assessment` 提供 ADI 专业路径可走通性评估，包含 paths、reach、correct、recover 四个维度、8 道素质问卷、31 个选项、3 个资源层级、4 个专业标杆和 4 个风险分档。
- 当前处理：已聚合为 `src/data/zylcylAdiAssessmentSignals.ts`，只保留题量、选项数、维度数、标杆数、分档数和 1-625 分区间；不复制问卷原文、benchmark JSON 或技能说明长文。
- 使用边界：该源是“先知道自己是谁”的模型参考，不是高校事实库或录取数据；正式推荐仍需叠加考生真实情况、官方投档线、招生章程和就业证据。

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

### liuxusummer/gaokao-advisor

- 仓库：https://github.com/liuxusummer/gaokao-advisor
- 许可证：MIT
- 价值：`public/data` 下公开高校基础库、专业目录、投档线、位次表和选科要求 JSON；meta 标注来源包括教育部全国高等学校名单、阳光高考和各省教育考试院。
- 当前处理：使用 GitHub raw 临时读取公开 JSON 和 meta，聚合为 `src/data/liuxusummerGaokaoAdvisorAggregateSignals.ts`。只保留 2,919 所高校、2,074 所公办、829 所民办、31 省高校基础库、875 个本科专业目录、1,661 条详细专业目录、10 省市 2023-2025 投档线 139,843 条、14 个位次表文件 9,478 条、10 省市 2024 选科要求 515,684 条，以及 warnings/failed 质量报告计数；不复制原始 JSON 长表。
- 使用边界：该源是社区整理的数据中心，虽有 MIT 许可和来源 meta，但仍需尊重其 warnings/failed 报告；正式填报必须回到教育部、阳光高考、各省考试院和高校招生章程复核。

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

### cheat-on-skill

- 仓库：https://github.com/XBuilderLAB/cheat-on-skill
- 许可证：MIT
- 价值：README 描述“能力匹配 + 可学性闸门 + BOSS 直聘真实招聘数据 + 反诈”，`adapters/boss/README.md` 强调通过用户已登录的有界面 Chrome 做 human-in-the-loop 只读搜索结果列表。
- 当前处理：登记为 BOSS 本地授权导入器、反诈规则、AI 影响分类和可学性闸门参考；不导入岗位数据、不复用批量采集逻辑。
- 原因：这个源的价值在安全交互机制，不在可再发布数据；后续如果做 BOSS 明细，只能由用户本地发起并保留在本地或输出去标识化聚合。

### boss-career-ops

- 仓库：https://github.com/maimaigptlink9/boss-career-ops
- 许可证：MIT
- 价值：README 描述 BOSS 求职全流程 CLI，包含 5 维评分、阈值动作、简历定制、聊天管理、Pipeline 和 Web 仪表盘。
- 当前处理：登记为本地 BOSS 授权导入后的 5 维评分、Pipeline 看板和候选岗位评估架构参考；同时聚合到 `src/data/bossCandidateSignals.ts` 的候选雷达计数。
- 原因：该源不发布可再发布岗位数据；本项目只吸收评估和仪表盘思路，不复用自动投递或打招呼逻辑。

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

### boss-crawler

- 仓库：https://github.com/My0sot1s/boss-crawler
- 许可证：MIT
- 价值：README 描述 Node.js + Selenium 采集所有记录城市的指定岗位，可输出 JSON/CSV，字段机制适合本地导入器参考。
- 当前处理：只登记为 BOSS 本地授权导入器的风险边界和输出字段参考，聚合到 `src/data/bossCandidateSignals.ts`；不复用采集代码、登录流程、验证码识别或批量抓取链路。
- 原因：README 明确依赖用户登录和第三方验证码识别，并提醒可能触发账号风控；本项目不能实现或鼓励绕过登录、验证码、反爬或批量抓取。

### bosszhipin_spider

- 仓库：https://github.com/poboll/bosszhipin_spider
- 许可证：MIT
- 价值：仓库含 `merged_java.xlsx` 等 Excel 明细、pandas 分析和 FineBI 可视化示例，可作为“历史岗位聚合字段”候选。
- 当前处理：使用本机临时目录读取合并工作簿 `芭比公组_分析数据.xlsx`，聚合为 `src/data/bossExcelAggregateSignals.ts`。只保留 15,897 行历史样本的岗位族、城市、区县、学历、经验、公司类型、规模、薪资区间和能力词 Top 统计；不提交 Excel 原表、不导入公司或岗位明细、不复用 pyppeteer 采集脚本。
- 原因：README 明确展示 BOSS 直聘页面自动化采集过程；平台岗位明细存在再发布合规风险。当前只展示完全去标识化聚合统计，后续如需明细应走用户本地有权文件导入或授权数据源。

### BossZhiPin_Spyder

- 仓库：https://github.com/linxkon/BossZhiPin_Spyder
- 许可证：Apache-2.0
- 价值：仓库含 `data/上海boss直聘20240502.csv` 示例数据，字段包括名称、地点、薪资、招聘需求、详情网址和区域，可补充 BOSS 上海历史岗位的去标识化聚合视角。
- 当前处理：使用本机临时目录读取 CSV，聚合为 `src/data/linxkonBossShanghaiAggregateSignals.ts`。只保留 4,197 行样本、16 个区、207 个地点、4,178 条可解析薪资、30K 薪资中位、学历/经验桶、薪资桶、岗位族和关键词桶；不提交 CSV 原表、不导入详情网址、公司或岗位明细、不复用 Selenium 采集链路。
- 原因：README 明确是 BOSS 页面采集示例，平台岗位明细存在再发布合规风险。当前只展示完全去标识化统计，且标为上海 2024-05-02 历史样本，不能当作实时市场事实。

## 暂不导入

### lxm909055383/bosszhipin

- 仓库：https://github.com/lxm909055383/bosszhipin
- 许可证：未声明
- 价值：README 描述最终约 25 万 BOSS 历史岗位样本，仓库含 `bosszhipin_post_info.csv`，并给出城市需求、薪资分布和数据分析/机器学习/人工智能关键词分析方向。
- 当前处理：只登记为待授权 BOSS 数据候选，不导入 CSV、不复制 README 结论到事实库。
- 原因：仓库未声明许可证，且数据来自第三方招聘平台采集链路；获得授权或改为用户本地有权文件导入前不得再发布原始岗位或统计结果。

### jhcoco/bosszp

- 仓库：https://github.com/jhcoco/bosszp
- 许可证：未声明
- 价值：仓库含 `全国-热门城市岗位数据.csv`，README 描述覆盖大数据、数据分析、数据挖掘、机器学习和人工智能相关岗位，CSV 字段约 10 个，文件约 38KB。
- 当前处理：只登记为真实 BOSS CSV 候选和字段参考，聚合到 `src/data/bossCandidateSignals.ts` 的候选计数；不导入 CSV、不复制公司名、岗位名或 README 统计结论。
- 原因：仓库未声明许可证，README 同时展示 Scrapy、Cookie 和反爬绕过配置；不能作为 MIT 开源前端事实库的数据输入。

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
