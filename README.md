# Nextwork

大厂岗位偏好分析与学生技能勋章墙原型。

## 功能

- 官网岗位数据统一成 `Job` JSON 模型
- 按公司、方向、岗位类别、技能要求做市场洞察
- 根据学生已有技能计算岗位匹配度
- 达到阈值时发放大厂技能勋章
- 给出学习补齐建议和推荐面试方向

## 运行

```bash
npm install
npm run dev
```

## 数据与分析命令

```bash
npm run scrape:jobs
npm run analyze:jobs
```

当前 `scrape:jobs` 输出种子数据到 `data/jobs.seed.json`。真实上线时建议为每家官网单独写 adapter，负责分页、详情页抽取、去重、增量更新和失败重试。

`analyze:jobs` 输出 `data/analysis.json`，结构适合替换为 ClaudeCode 或 Claude API 生成的标签与分析结果。

## 后续真实接入建议

- 抓取层：每家公司一个 adapter，只保存公开招聘页数据，保留 `sourceUrl` 和抓取时间。
- 标签层：ClaudeCode 将岗位描述抽为分类、技能、业务方向、基础能力、稀缺能力和学习建议。
- 评估层：用学生技能表与岗位要求做可解释匹配，显示已满足和缺失项。
- 勋章层：用 AI 生成每家公司与方向的勋章图案，保存为静态资源并绑定发放规则。
