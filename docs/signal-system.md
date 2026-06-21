# 职业信号系统

更新日期：2026-06-20

## 1. 为什么需要 CareerSignal

用户看到的不是原始岗位列表，也不是学校报告全文。用户真正需要的是能回答这些问题的信号：

- 这个方向有没有真实岗位？
- 哪些专业和能力被反复提到？
- 薪资大概处在哪个区间？
- 学校公开证据是否支持这个判断？
- 这条信息有什么风险，下一步要核验什么？

CareerSignal 把不同来源统一成一个可展示、可搜索、可解释的领域模型。

## 2. 信号类型

- `job`：企业官网岗位信号，来自 live adapter 或公开快照。
- `salary`：专业薪资代理信号，来自专业市场画像。
- `school`：学校公开就业证据，来自就业质量报告、就业网或公开活动。
- `official-source`：企业官方招聘入口，表示可继续核验的源头。

## 3. 字段模型

```ts
type CareerSignal = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  signalType: "job" | "salary" | "school" | "official-source";
  category: string;
  summary: string;
  score: number;
  selected: boolean;
  tags: string[];
  relatedAbilities: string[];
  relatedMajors: string[];
  relatedTracks: string[];
  reason: string;
  risk: string;
  confidence: number;
};
```

## 4. 生成规则

当前实现位于 `src/lib/careerSignals.ts`。

### 4.1 岗位信号

输入：`Job[]`  
核心字段：公司、岗位、城市、方向、薪资、能力要求、关联专业、官网 URL。

评分考虑：

- 官网薪资优先于市场估算。
- 薪资置信度越高，信号分越高。
- 有专业信号和能力信号的岗位更适合作为精选。

风险提示：

- 岗位会随招聘周期变化。
- 市场估算不代表企业承诺。
- 必须打开原始链接确认城市、批次和资格。

### 4.2 薪资信号

输入：`MajorSalaryProfile[]`  
核心字段：专业群、初期薪资、成熟薪资、代表岗位、核心能力、适合人群、风险。

评分使用专业画像的 `demandScore`。薪资信号统一标为市场代理，不能写成学校或企业承诺。

### 4.3 学校信号

输入：`SchoolOutcomeProfile[]`  
核心字段：学校、公开来源、年份、指标、专业列表、目标岗位。

评分考虑：

- `verified` 高于 `partial`。
- 指标越完整，信号越强。

学校信号的边界：

- 校级数据不能冒充专业级数据。
- 已定位报告入口不等于已解析完整报告。
- 专业级薪资没有来源时必须显示待接入。

### 4.4 官方入口信号

输入：`OfficialCompanySource[]`  
核心字段：公司、招聘官网、关注方向、adapter 状态。

live adapter 是精选信号；只有 official link 的公司不计入实时岗位样本，只作为核验入口。

## 5. 精选策略

默认页面只展示 `selected = true` 的信号。精选不是“最热门”，而是满足至少一个条件：

- 有 live adapter 岗位样本。
- 有较高需求分和明确专业/能力映射。
- 有学校 verified 证据。
- 是用户下一步必须打开的官方入口。

## 6. 输出摘要

`summarizeCareerSignals()` 输出：

- 总信号数。
- 精选信号数。
- 各类型数量。
- 高频专业。
- 高频能力。
- live adapter 与 official link 覆盖。

这些摘要用于 Web 职业信号页、小程序摘要和未来 API。

## 7. 后续迭代

- 加入政策、竞赛、开源趋势和融资事件四类信号。
- 增加去重：同一岗位在不同批次重复出现时合并。
- 增加时间窗：今日、本周、本月。
- 增加 Agent 查询接口：按专业、能力、城市、岗位返回信号。
- 增加人工审核字段：避免把噪音信号放入精选。
