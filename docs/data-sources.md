# 数据源接入记录

本项目优先使用学校官网、就业网、就业质量报告、企业官方招聘站和许可证清晰的开源数据。第三方平台岗位数据只在授权、用户本地导入或聚合后使用，不直接发布来源不明的原始岗位明细。

## 已接入样本

### gaokaoweb

- 仓库：https://github.com/laofeijio2020ojbk2022/gaokaoweb
- 许可证：Apache-2.0
- 可用文件：`data/school_id.csv`、`data/school_info.csv`、`data/school_job.csv`
- 当前接入：从 `school_job.csv` 接入 20 所学校的历史就业去向、升学、出国和主要去向单位。
- 本轮新增：哈尔滨工业大学、北京航空航天大学、北京邮电大学、同济大学、南方科技大学、广州南方学院、重庆移通学院、文华学院、郑州工商学院、武昌首义学院、武汉工商学院、三江学院、郑州升达经贸管理学院、浙江树人学院。
- 使用边界：标为 `partial` 学校证据。它能扩大查询覆盖和发现主要去向单位，但不能替代学校官网当年就业质量报告。

## 可借鉴但未直接导入

### UniversityCareerWebPage

- 仓库：https://github.com/PotoYang/UniversityCareerWebPage
- 许可证：MIT
- 价值：README 可解析 286 个本科高校就业网、就业指导中心或招聘信息入口。
- 当前处理：已解析为 `src/data/schoolCareerDirectory.ts` 的 286 条入口候选，并在学校详情页按学校名展示命中的就业网入口。当前项目重点学校中有 13 个入口已记录一次健康探测状态，见 `src/data/schoolCareerDirectoryHealth.ts`。
- 使用边界：目录链接需要逐校验证是否仍可访问；只作为入口索引，不代表入口内容已被官方确认。

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

### BossAnalyze

- 仓库：https://github.com/DavidHLP/BossAnalyze
- 许可证：MIT
- 价值：包含 BOSS 直聘分析系统结构、`boss.sql` 和城市/职位/薪资/技能图谱等模块设计。
- 当前处理：只作为 BOSS 聚合分析模型和本地导入器字段设计参考，不导入原始 BOSS 岗位明细。
- 原因：项目 README 明确包含分布式爬虫链路，本项目不复用绕过平台限制的抓取逻辑。

## 暂不导入

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
