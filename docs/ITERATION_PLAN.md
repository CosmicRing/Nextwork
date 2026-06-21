# 看看工资开发迭代计划

更新日期：2026-06-20

## 当前目标

把“看看工资”从静态演示页推进为证据驱动的专业/岗位/薪资决策工具。优先保证数据可信、页面可查、移动端可用，再扩展更多 adapter 和报告生成能力。

## V1.1 已落地范围

- 学校入口作为默认页。
- 岗位雷达支持多行业专业关联。
- 公司工资页支持 logo、筛选、分页、详情和对比。
- 职业信号中枢接入 Web。
- `CareerSignalHubPanel` 已从 `src/main.tsx` 拆到 `src/features/signals/`。
- `CareerRadarPanel` 已从 `src/main.tsx` 拆到 `src/features/radar/`，雷达证据聚合进入领域层。
- `verify:school-rescue` 已成为普通院校/未收录学校救援路径的质量门。
- CareerSignal 领域模型和验证脚本。
- PRD、开发架构、信号系统文档。

## Sprint 1：领域层稳定

目标：让核心判断可测试、可复用。

- 已完成：把 `CareerSignalHubPanel` 从 `src/main.tsx` 拆到 `src/features/signals/CareerSignalHubPanel.tsx`。
- 已完成：把 `CareerRadarPanel` 从 `src/main.tsx` 拆到 `src/features/radar/CareerRadarPanel.tsx`。
- 把公司工资相关组件拆到 `src/features/companies/*`。
- 为 `careerRadar`、`careerSignals`、`officialJobSearch` 增加数据行为验证。
- 给 `npm run verify:career-signals` 加入 CI。

验收：

- `src/main.tsx` 明显缩小，只保留路由/状态编排。
- `npm run verify:career-signals` 和 `npm run build` 通过。

## Sprint 2：学校证据管线

目标：让公开学校资料从“入口”升级为“可解析证据”。

- 建立就业质量报告 PDF 解析任务。
- 输出学校级指标、专业级指标、企业名单和缺口字段。
- 扩展普通本科、高职、医药、传媒、财经等学校模板。
- 小程序端同步展示证据状态。

验收：

- 至少 10 所学校有 verified 或 partial 证据。
- 每个学校显示报告入口、专业入口、就业入口、校招入口。
- 无来源字段继续显示待接入。

## Sprint 3：企业 adapter 扩展

目标：扩大国内外企业覆盖，强化行业差异。

- 海外企业优先：Microsoft、Google、Apple、JPMorganChase、Deloitte、PwC、Marriott、Hilton、Hyatt、Cathay Pacific。
- 国内企业补充：Ant、NetEase Games、BYD、HoYoverse。
- 每个 adapter 输出 normalizedCount、errorCount、sample query 和薪资口径。
- adapter 失败时不影响整体构建。

验收：

- live adapter 覆盖不少于 24 家企业。
- 公司页能明确区分国内/海外、行业和 adapter 状态。

## Sprint 4：小程序发布准备

目标：让小程序可以作为正式体验入口。

- 用生成脚本把 Web 领域层摘要写入 `miniprogram/utils/sample-data.js`。
- 小程序端加入职业信号摘要。
- 完成真实 AppID 配置、类目资料、隐私说明和安全审查清单。
- 控制包体和图片资源大小。

验收：

- `npm run verify:miniprogram` 通过。
- 微信开发者工具可预览。
- 不含远程 JS 和密钥。

## Sprint 5：Agent / API

目标：让老师、咨询师和内容团队能复用数据能力。

- 增加只读 API：按学校、专业、岗位、企业查询信号。
- 增加报告生成接口：学校专业证据包、岗位雷达报告、公司薪资对比。
- 增加 RSS：职业信号精选、专业群周报。

验收：

- API 输出包含来源、原因、风险和置信度。
- 不返回未授权长文本内容。

## 长期不做

- 不做录取概率预测。
- 不做学校排名。
- 不做无来源的薪资承诺。
- 不做用户命运式测评。
