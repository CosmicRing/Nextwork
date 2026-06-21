import type { Job, JobCategory } from "../types";

export const jobCategoryLabels: Record<JobCategory | "All", string> = {
  All: "全部岗位",
  "AI Engineering": "AI 工程",
  Backend: "后端",
  Frontend: "前端",
  Data: "数据算法",
  Infrastructure: "基础设施",
  Product: "产品",
  Design: "设计",
  Security: "安全",
  Business: "商业职能",
  Operations: "运营供应链",
  Finance: "金融财务",
  Service: "服务体验",
};

export type OfficialJobMatch = {
  job: Job;
  score: number;
  rankScore?: number;
  reasons: string[];
};

export function searchOfficialJobs(allJobs: Job[], queries: string[], minScore = 18) {
  const tokens = getOfficialSearchTokens(queries);
  if (tokens.length === 0) return [];

  return allJobs
    .map((job) => scoreJobForOfficialSearch(job, tokens))
    .filter((match): match is OfficialJobMatch => match !== null && match.score >= minScore)
    .sort(
      (left, right) =>
        (right.rankScore ?? right.score) - (left.rankScore ?? left.score) ||
        right.score - left.score ||
        right.job.salary.monthlyMaxK - left.job.salary.monthlyMaxK,
    );
}

export function diversifyOfficialJobMatches(matches: OfficialJobMatch[], limit: number, perCompany = 2) {
  const selected: OfficialJobMatch[] = [];
  const companyCounts = new Map<string, number>();

  for (const match of matches) {
    const current = companyCounts.get(match.job.companyId) ?? 0;
    if (current >= perCompany) continue;
    selected.push(match);
    companyCounts.set(match.job.companyId, current + 1);
    if (selected.length >= limit) return selected;
  }

  for (const match of matches) {
    if (selected.some((selectedMatch) => selectedMatch.job.id === match.job.id)) continue;
    selected.push(match);
    if (selected.length >= limit) return selected;
  }

  return selected;
}

export function getOfficialSearchTokens(values: string[]) {
  const knownSignals = [
    "AI",
    "AIGC",
    "LLM",
    "Agent",
    "算法",
    "大模型",
    "机器学习",
    "推荐",
    "搜索",
    "后端",
    "前端",
    "服务端",
    "云计算",
    "产品",
    "安全",
    "风控",
    "数据",
    "增长",
    "运营",
    "机器人",
    "自动驾驶",
    "控制",
    "嵌入式",
    "通信",
    "芯片",
    "硬件",
    "新能源",
    "电气",
    "游戏",
    "设计",
    "金融",
    "投行",
    "银行",
    "证券",
    "审计",
    "会计",
    "税务",
    "精算",
    "咨询",
    "商业分析",
    "管培",
    "人力资源",
    "客户成功",
    "品牌",
    "营销",
    "快消",
    "零售",
    "美妆",
    "酒店",
    "旅游",
    "会展",
    "航空",
    "客户体验",
    "护理",
    "临床",
    "药学",
    "公共卫生",
    "心理",
    "康复",
    "教育",
    "教师",
    "课程",
    "法务",
    "法律",
    "公共事务",
    "土木",
    "建筑",
    "城市规划",
    "环境",
    "工程管理",
    "ESG",
    "算法",
    "大模型",
    "机器学习",
    "推荐",
    "搜索",
    "后端",
    "前端",
    "服务端",
    "云",
    "安全",
    "风控",
    "数据",
    "产品",
    "增长",
    "运营",
    "机器人",
    "自动驾驶",
    "控制",
    "嵌入式",
    "通信",
    "芯片",
    "硬件",
    "新能源",
    "电气",
    "游戏",
    "设计",
  ];
  const expanded = values.flatMap((value) => {
    const rawParts = value
      .split(/[\/\s,，、|]+/)
      .map(normalizeSearchText)
      .filter(Boolean);
    const normalized = normalizeSearchText(value);
    return [
      normalized,
      ...rawParts,
      ...normalized.split(/[\/\s]+/),
      normalized.replace(/(工程师|研发|开发|经理|师|岗|岗位)$/g, ""),
      ...rawParts.map((part) => part.replace(/(工程师|研发|开发|经理|师|岗|岗位|职位)$/g, "")),
      normalized.replace(/(ai|aigc|llm|agent)/g, "ai"),
      ...knownSignals.filter((signal) => normalized.includes(normalizeSearchText(signal))).map(normalizeSearchText),
    ];
  });

  return Array.from(new Set(expanded.map((value) => value.trim()).filter((value) => value.length >= 2)));
}

function scoreJobForOfficialSearch(job: Job, tokens: string[]): OfficialJobMatch | null {
  const company = normalizeSearchText(job.companyName);
  const title = normalizeSearchText(job.title);
  const category = normalizeSearchText(jobCategoryLabels[job.category]);
  const direction = normalizeSearchText(job.direction);
  const majorSignals = normalizeSearchText((job.majorSignals ?? []).join(" "));
  const abilitySignals = normalizeSearchText((job.abilitySignals ?? []).join(" "));
  const requirements = normalizeSearchText([...job.requirements, ...job.tags].join(" "));
  const fullText = normalizeSearchText([
    job.title,
    job.department,
    job.direction,
    job.description,
    job.category,
    ...job.requirements,
    ...job.tags,
    ...(job.majorSignals ?? []),
    ...(job.abilitySignals ?? []),
  ].join(" "));
  let rawScore = 0;
  const reasons = new Set<string>();

  tokens.forEach((token) => {
    if (company && (company.includes(token) || token.includes(company))) {
      rawScore += 44;
      reasons.add("公司命中");
    }
    if (title.includes(token)) {
      rawScore += 32;
      reasons.add("岗位标题命中");
    }
    if (direction.includes(token) || category.includes(token)) {
      rawScore += 20;
      reasons.add("方向/岗位族群命中");
    }
    if (majorSignals.includes(token)) {
      rawScore += 18;
      reasons.add("关联专业命中");
    }
    if (abilitySignals.includes(token)) {
      rawScore += 10;
      reasons.add("能力信号命中");
    }
    if (requirements.includes(token)) {
      rawScore += 12;
      reasons.add("能力要求命中");
    }
    if (fullText.includes(token)) {
      rawScore += 7;
    }
  });

  if (rawScore === 0) return null;
  const seniorityBoost = job.seniority === "intern" || job.seniority === "junior" ? 8 : 0;
  const score = Math.min(98, Math.max(18, rawScore + seniorityBoost));
  if (job.salary.source === "official") reasons.add("官网薪资");
  else reasons.add("市场薪资估算");

  return {
    job,
    score,
    rankScore: rawScore + seniorityBoost,
    reasons: Array.from(reasons),
  };
}

function normalizeSearchText(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "").replace(/[／|｜,，、]+/g, "/");
}
