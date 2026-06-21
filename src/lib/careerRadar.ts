import type { MajorPath } from "../types";

export type CareerRadarItem = {
  major: string;
  group: string;
  score: number;
  rankScore?: number;
  ring: 1 | 2 | 3 | 4;
  reasons: string[];
};

const roleSignals = [
  { terms: ["算法", "AI", "AIGC", "大模型", "机器学习", "推荐"], boosts: ["人工智能", "计算机", "数据"] },
  { terms: ["后端", "服务端", "架构", "云", "基础设施"], boosts: ["计算机", "软件", "通信"] },
  { terms: ["前端", "体验", "Web", "交互"], boosts: ["软件", "计算机", "工业设计"] },
  { terms: ["产品", "增长", "策略", "运营", "product", "growth", "strategy", "program manager"], boosts: ["信息管理", "工业设计", "数据", "数字媒体", "电子商务", "产品"] },
  { terms: ["机器人", "自动驾驶", "控制", "嵌入式"], boosts: ["自动化", "机器", "电子"] },
  { terms: ["安全", "风控", "隐私", "网络"], boosts: ["网络", "计算机", "通信"] },
  { terms: ["芯片", "通信", "硬件", "IoT"], boosts: ["电子", "通信", "集成电路"] },
  { terms: ["投行", "金融", "银行", "证券", "基金", "财富", "审计", "会计", "税务", "精算", "finance", "financial", "bank", "investment", "audit", "accounting", "tax", "actuarial"], boosts: ["金融", "会计", "审计", "经济", "保险", "精算", "统计"] },
  { terms: ["咨询", "商业分析", "管培", "人力资源", "组织", "项目管理", "战略", "consulting", "business analyst", "management trainee", "human resources", "people", "project management"], boosts: ["工商管理", "市场营销", "人力资源", "信息管理", "社会学", "心理学"] },
  { terms: ["品牌", "营销", "快消", "零售", "美妆", "消费者", "渠道", "销售", "brand", "marketing", "retail", "beauty", "consumer", "channel", "sales"], boosts: ["市场营销", "广告", "传播", "电子商务", "食品", "化妆品"] },
  { terms: ["供应链", "物流", "采购", "履约", "制造", "质量", "supply chain", "logistics", "procurement", "operations", "fulfillment", "manufacturing", "quality"], boosts: ["物流", "工业工程", "工程管理", "工商管理", "电子商务"] },
  { terms: ["酒店", "旅游", "会展", "航空", "乘务", "前厅", "餐饮", "客户体验", "服务", "hotel", "hospitality", "tourism", "aviation", "guest", "customer experience", "customer service"], boosts: ["酒店管理", "旅游管理", "会展", "航空服务", "英语", "人力资源"] },
  { terms: ["临床", "护理", "药学", "公共卫生", "康复", "心理", "健康", "医生"], boosts: ["临床医学", "护理", "药学", "公共卫生", "心理学", "康复"] },
  { terms: ["教师", "教育", "课程", "培训", "法务", "法律", "合规", "公共事务", "编辑"], boosts: ["教育", "汉语言", "英语", "法学", "公共管理", "新闻"] },
  { terms: ["土木", "建筑", "城市", "规划", "环境", "施工", "工程管理", "ESG", "双碳"], boosts: ["土木", "建筑", "城乡规划", "环境", "工程管理", "给排水"] },
];

export function buildCareerRadar(jobQuery: string, majorPaths: MajorPath[]): CareerRadarItem[] {
  const query = normalize(jobQuery);
  const matchedSignals = roleSignals.filter((signal) => signal.terms.some((term) => query.includes(normalize(term))));
  const boostedTerms = matchedSignals.flatMap((signal) => signal.boosts);
  const queryTokens = getQueryTokens(jobQuery);

  return majorPaths
    .flatMap((path) =>
      path.majors.map((major) => {
        const identityText = normalize([path.group, major, ...path.coreAbilities].join(" "));
        const roleText = normalize([...path.careerTargets, ...path.startupRoutes].join(" "));
        const text = `${identityText}${roleText}`;
        const majorText = normalize(major);
        const matchedTerms = getMatchedSignalTerms(query, matchedSignals);
        const genericRoleQuery = /产品|运营|经理|增长|策略|管培|咨询|销售|服务|客户|项目/.test(query);
        const targetHits = path.careerTargets.filter((target) => isRelated(query, normalize(target))).length * (genericRoleQuery ? 8 : 18);
        const directIdentityHits = query && (identityText.includes(query) || query.includes(majorText)) ? 24 : 0;
        const directRoleHits = query && roleText.includes(query) ? (genericRoleQuery ? 8 : 18) : 0;
        const boostedHits = Array.from(new Set(boostedTerms)).filter((term) => identityText.includes(normalize(term))).length * 14;
        const abilityHits = path.coreAbilities.filter((ability) => queryTokens.some((token) => isRelated(token, normalize(ability)))).length * 8;
        const tokenHits = queryTokens.filter((token) => token.length >= 2 && identityText.includes(token)).length * 7;
        const directMajorQueryHits = getDirectMajorQueryBoost(query, major);
        const domainBoost = getDomainSpecificBoost(query, identityText, roleText);
        const rawScore = 36 + targetHits + directIdentityHits + directRoleHits + boostedHits + abilityHits + tokenHits + directMajorQueryHits + domainBoost;
        const score = Math.min(98, Math.max(32, Math.round(rawScore)));
        const ring = (score >= 86 ? 1 : score >= 72 ? 2 : score >= 58 ? 3 : 4) as CareerRadarItem["ring"];

        return {
          major,
          group: path.group,
          score,
          rankScore: rawScore,
          ring,
          reasons: buildReasons(jobQuery, path.group, major, matchedTerms, boostedTerms),
        };
      }),
    )
    .sort((a, b) => (b.rankScore ?? b.score) - (a.rankScore ?? a.score) || b.score - a.score)
    .slice(0, 12);
}

function getDirectMajorQueryBoost(query: string, major: string) {
  const majorAliases: Record<string, string[]> = {
    酒店管理: ["酒店", "饭店", "住宿"],
    旅游管理: ["旅游", "文旅"],
    会展经济与管理: ["会展", "展会", "活动"],
    航空服务艺术与管理: ["航空", "乘务", "地勤"],
    会计学: ["会计", "财务"],
    审计学: ["审计"],
    金融学: ["金融", "银行", "证券", "投行"],
    金融工程: ["金融工程", "量化", "风控"],
    保险学: ["保险", "精算"],
    精算学: ["精算"],
    市场营销: ["市场", "营销", "品牌"],
    广告学: ["广告", "投放"],
    传播学: ["传播", "公关"],
    化妆品科学与技术: ["美妆", "化妆品"],
    临床医学: ["临床", "医生"],
    护理学: ["护理", "护士"],
    药学: ["药学", "药企", "药事"],
    公共卫生与预防医学: ["公共卫生", "疾控", "预防"],
    心理学: ["心理", "咨询"],
    康复治疗学: ["康复"],
    法学: ["法务", "法律", "合规", "律师"],
    教育学: ["教育", "教师", "课程"],
    汉语言文学: ["语文", "写作", "编辑"],
    新闻学: ["新闻", "媒体", "编辑"],
    土木工程: ["土木", "施工"],
    建筑学: ["建筑", "设计院"],
    城乡规划: ["城市", "规划"],
    环境工程: ["环境", "环保"],
    工程管理: ["工程管理", "项目管理"],
  };
  const normalizedMajor = normalize(major);
  const suffixStripped = normalizedMajor.replace(/(科学与技术|工程|管理|经济与管理|艺术与管理|科学|技术|学)$/g, "");
  const aliases = [normalizedMajor, suffixStripped, ...(majorAliases[major] ?? []).map(normalize)].filter((token) => token.length >= 2);
  return Array.from(new Set(aliases)).some((alias) => query.includes(alias)) ? 44 : 0;
}

function getDomainSpecificBoost(query: string, identityText: string, roleText: string) {
  const rules = [
    { terms: ["酒店", "旅游", "会展", "航空", "乘务", "前厅", "餐饮", "客户体验", "hotel", "hospitality", "tourism", "aviation", "guest", "customer service", "customer experience"], targets: ["酒店", "旅游", "会展", "航空服务", "英语", "服务"], boost: 42 },
    { terms: ["审计", "会计", "税务", "投行", "金融", "证券", "精算", "财富", "finance", "financial", "audit", "accounting", "tax", "bank", "investment"], targets: ["金融", "会计", "审计", "经济", "保险", "精算"], boost: 42 },
    { terms: ["护理", "临床", "药学", "公共卫生", "康复", "心理", "健康"], targets: ["临床", "护理", "药学", "公共卫生", "心理", "康复"], boost: 42 },
    { terms: ["法务", "法律", "教师", "教育", "课程", "公共事务", "编辑"], targets: ["教育", "汉语言", "英语", "法学", "公共管理", "新闻"], boost: 38 },
    { terms: ["品牌", "营销", "快消", "零售", "美妆", "消费者", "渠道", "brand", "marketing", "retail", "beauty", "consumer", "channel", "sales"], targets: ["市场营销", "广告", "传播", "电子商务", "食品", "化妆品"], boost: 38 },
    { terms: ["供应链", "物流", "采购", "履约", "制造", "质量", "supply chain", "logistics", "procurement", "operations", "fulfillment", "manufacturing", "quality"], targets: ["物流", "工业工程", "工程管理", "工商管理", "电子商务"], boost: 40 },
    { terms: ["土木", "建筑", "城市", "规划", "环境", "施工", "工程管理", "esg", "双碳"], targets: ["土木", "建筑", "城乡规划", "环境", "工程管理", "给排水"], boost: 38 },
  ];

  return rules.reduce((total, rule) => {
    const queryHit = rule.terms.some((term) => query.includes(normalize(term)));
    if (!queryHit) return total;
    const targetHit = rule.targets.some((target) => {
      const normalized = normalize(target);
      return identityText.includes(normalized) || roleText.includes(normalized);
    });
    return targetHit ? total + rule.boost : total;
  }, 0);
}

function buildReasons(jobQuery: string, group: string, major: string, matchedTerms: string[], boostedTerms: string[]) {
  const reasons = [`${major} 属于 ${group}`];
  if (matchedTerms.length > 0) {
    reasons.push(`岗位“${jobQuery}”命中 ${Array.from(new Set(matchedTerms)).slice(0, 4).join(" / ")} 信号`);
  }
  if (boostedTerms.length > 0) {
    reasons.push(`岗位“${jobQuery}”触发 ${Array.from(new Set(boostedTerms)).slice(0, 3).join(" / ")} 信号`);
  }
  reasons.push("排名表示专业与岗位能力要求的相对关联强度");
  return reasons;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function getQueryTokens(value: string) {
  const normalized = normalize(value);
  const knownTerms = Array.from(new Set(roleSignals.flatMap((signal) => [...signal.terms, ...signal.boosts]).map(normalize)));
  return Array.from(
    new Set([
      normalized,
      normalized.replace(/(工程师|研发|开发|经理|师|岗|岗位)$/g, ""),
      ...knownTerms.filter((term) => normalized.includes(term)),
    ]),
  ).filter((token) => token.length >= 2);
}

function getMatchedSignalTerms(query: string, signals: typeof roleSignals) {
  return signals.flatMap((signal) => signal.terms.filter((term) => query.includes(normalize(term))));
}

function isRelated(left: string, right: string) {
  if (!left || !right) return false;
  return left.includes(right) || right.includes(left);
}
