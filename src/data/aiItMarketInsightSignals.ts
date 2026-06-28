export type AiItMarketInsightBucket = {
  label: string;
  value: number;
  unit: string;
};

export const aiItMarketInsightSource = {
  id: "anhuanao-ai-it-analysis",
  name: "AI/IT 岗位待遇分析聚合洞察",
  repoUrl: "https://github.com/AnHuanAo/Python-DataScience-Final-AI_IT_Analysis",
  license: "MIT",
  sourcePath: "README.md / AI岗位薪资爬取、收集、清洗及可视化.ipynb",
  domesticPeriod: "2024-2026",
  globalPeriod: "2025-2026",
  insightCount: 5,
  domesticChartCount: 10,
  globalSalaryChartCount: 2,
  globalAverageAnnualSalaryRmbWan: 161,
  usAverageAnnualSalaryRmbWan: 164,
  chinaAverageAnnualSalaryRmbWan: 97.4,
  topRole: "Architecture",
  topRoleAnnualSalaryRmbWan: 182,
  domesticMarketSummary: "城市、学历与 AI 技能共同决定高薪，前端需求大、测试稳健，本科+3-5 年经验是集中画像。",
  aiRoleSummary: "AI 与大模型岗位是国内腰部企业薪资天花板，基础技术与架构管理构成第二梯队。",
  note: "只引用 README 中的聚合洞察和图表结论，不复制 BOSS 岗位明细或 Notebook 数据表。",
} as const;

export const aiItGlobalSalaryBuckets: AiItMarketInsightBucket[] = [
  { label: "美国 AI 平均年薪", value: 164, unit: "万 RMB" },
  { label: "全球 AI 平均年薪", value: 161, unit: "万 RMB" },
  { label: "中国 AI 平均年薪", value: 97.4, unit: "万 RMB" },
  { label: "架构类岗位年薪", value: 182, unit: "万 RMB" },
];

export const aiItTalentPreferenceSignals = [
  "AI 工程化",
  "架构设计",
  "底层基础设施",
  "本科+3-5 年经验",
  "硕士学历溢价",
  "城市与学历共同决定薪资上限",
] as const;
