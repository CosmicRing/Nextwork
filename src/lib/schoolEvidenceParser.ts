import { extractUnknownSchoolOfficialDomain } from "./unknownSchoolEntryPack";

export type ParsedSchoolEvidenceKind = "major" | "report" | "campus" | "salary";
export type ParsedSchoolEvidenceTrustLevel = "school-official" | "company-official" | "public-official" | "search-lead" | "weak";

export type ParsedSchoolEvidenceMetric = {
  label: string;
  value: string;
};

export type ParsedSchoolEvidenceSourceTrust = {
  level: ParsedSchoolEvidenceTrustLevel;
  label: string;
  score: number;
  reason: string;
  warning: string;
};

export type ParsedSchoolEvidence = {
  kind: ParsedSchoolEvidenceKind;
  confidence: number;
  title: string;
  detail: string;
  url: string;
  sourceTrust: ParsedSchoolEvidenceSourceTrust;
  metrics: ParsedSchoolEvidenceMetric[];
  companies: string[];
  salaryRanges: string[];
  years: string[];
  highlights: string[];
};

type ParseSchoolEvidenceTextInput = {
  schoolName: string;
  majorName?: string | null;
  jobName?: string | null;
  officialDomain?: string | null;
  url?: string;
  text: string;
};

const readableKnownCompanyNames = [
  "字节跳动",
  "腾讯",
  "阿里巴巴",
  "京东",
  "美团",
  "百度",
  "快手",
  "拼多多",
  "网易",
  "华为",
  "小米",
  "比亚迪",
  "海尔",
  "美的",
  "格力",
  "宇通集团",
  "宇通",
  "顺丰",
  "中兴",
  "新东方",
  "海康威视",
  "牧原",
  "携程",
  "中国移动",
  "中国电信",
  "中国联通",
  "工商银行",
  "农业银行",
  "建设银行",
  "中国银行",
  "招商银行",
  "德勤",
  "普华永道",
  "安永",
  "毕马威",
];

const readableMetricLabels = ["就业率", "毕业去向落实率", "去向落实率", "升学率", "签约率", "考研率", "对口就业率"];

const kindLabels: Record<ParsedSchoolEvidenceKind, string> = {
  major: "专业存在",
  report: "就业报告",
  campus: "到校企业",
  salary: "岗位薪资",
};

const knownCompanyNames = [
  "字节跳动",
  "腾讯",
  "阿里巴巴",
  "京东",
  "美团",
  "百度",
  "快手",
  "拼多多",
  "网易",
  "华为",
  "小米",
  "比亚迪",
  "海尔",
  "美的",
  "格力",
  "宇通集团",
  "宇通",
  "顺丰",
  "中兴",
  "京东方",
  "海康威视",
  "牧原",
  "携程",
  "中国移动",
  "中国电信",
  "中国联通",
  "工商银行",
  "农业银行",
  "建设银行",
  "中国银行",
  "招商银行",
  "德勤",
  "普华永道",
  "安永",
  "毕马威",
];

const metricLabels = ["就业率", "毕业去向落实率", "去向落实率", "升学率", "签约率", "考研率", "对口就业率"];

export function parseSchoolEvidenceText({
  schoolName,
  majorName,
  jobName,
  officialDomain,
  url = "",
  text,
}: ParseSchoolEvidenceTextInput): ParsedSchoolEvidence {
  const cleanText = normalizeEvidenceText(text);
  const metrics = extractMetrics(cleanText);
  const companies = extractCompanies(cleanText);
  const salaryRanges = extractSalaryRanges(cleanText);
  const years = extractYears(cleanText);
  const highlights = extractHighlights(cleanText, metrics);
  const kind = classifyEvidenceKind(cleanText, metrics, companies, salaryRanges);
  const sourceTrust = inferSchoolEvidenceSourceTrust(url, cleanText, officialDomain);
  const confidence = scoreEvidenceConfidence(kind, cleanText, metrics, companies, salaryRanges, years, sourceTrust);
  const title = buildEvidenceTitle(kind, schoolName, majorName ?? "", jobName ?? "", years, cleanText);
  const detail = buildEvidenceDetail(kind, cleanText, metrics, companies, salaryRanges, highlights, sourceTrust);

  return {
    kind,
    confidence,
    title,
    detail,
    url: url.trim(),
    sourceTrust,
    metrics,
    companies,
    salaryRanges,
    years,
    highlights,
  };
}

export function parseSchoolEvidenceTextBatch(input: ParseSchoolEvidenceTextInput): ParsedSchoolEvidence[] {
  const cleanText = normalizeEvidenceText(input.text);
  if (!cleanText) return [];

  const chunks = buildEvidenceTextChunks(input.text);
  const parsedItems = chunks.map((chunk) =>
    parseSchoolEvidenceText({
      ...input,
      text: chunk,
    }),
  );
  const dedupedItems = dedupeBy(parsedItems, (item) =>
    [
      item.kind,
      item.metrics.map((metric) => `${metric.label}:${metric.value}`).join(","),
      item.companies.slice(0, 4).join(","),
      item.salaryRanges.join(","),
      item.highlights[0] ?? item.title,
    ]
      .join("|")
      .replace(/\s+/g, ""),
  );

  return dedupedItems
    .sort((left, right) => {
      const kindRank = getEvidenceKindRank(left.kind) - getEvidenceKindRank(right.kind);
      if (kindRank !== 0) return kindRank;
      return right.confidence - left.confidence;
    })
    .slice(0, 8);
}

function buildEvidenceTextChunks(text: string) {
  const roughChunks = text
    .split(/\r?\n|[。！？；]/)
    .map((chunk) => normalizeEvidenceText(chunk))
    .filter(Boolean);
  const chunks = roughChunks.filter((chunk) => hasEvidenceSignal(chunk));
  const fallback = normalizeEvidenceText(text);

  return dedupeBy(chunks.length ? chunks : [fallback], (chunk) => chunk).slice(0, 12);
}

function hasEvidenceSignal(text: string) {
  return [
    "专业介绍",
    "本科专业",
    "专业设置",
    "招生专业",
    "培养方案",
    "核心课程",
    "培养目标",
    "人才培养",
    "就业质量报告",
    "毕业生就业",
    "就业率",
    "去向落实率",
    "毕业去向",
    "升学率",
    "行业流向",
    "签约单位",
    "就业信息网",
    "宣讲会",
    "双选会",
    "招聘会",
    "校园招聘",
    "进校招聘",
    "到校招聘",
    "参会企业",
    "月薪",
    "年薪",
    "薪资",
    "薪酬",
    "工资",
    "校招岗位",
    "招聘岗位",
    "base",
    "K",
    ...readableKnownCompanyNames,
  ].some((token) => text.includes(token));
}

function getEvidenceKindRank(kind: ParsedSchoolEvidenceKind) {
  const ranks: Record<ParsedSchoolEvidenceKind, number> = {
    report: 1,
    campus: 2,
    salary: 3,
    major: 4,
  };
  return ranks[kind];
}

function normalizeEvidenceText(text: string) {
  return text.replace(/\s+/g, " ").replace(/[，；]/g, (mark) => (mark === "，" ? "，" : "；")).trim();
}

function inferSchoolEvidenceSourceTrust(url: string, text: string, officialDomain?: string | null): ParsedSchoolEvidenceSourceTrust {
  const normalizedUrl = url.trim().toLowerCase();
  const confirmedOfficialDomain = extractUnknownSchoolOfficialDomain(officialDomain);
  const urlDomain = extractUnknownSchoolOfficialDomain(normalizedUrl);
  const isSearchEngine = /(?:baidu\.com\/s|bing\.com\/search|google\.com\/search|sogou\.com|so\.com)/i.test(normalizedUrl);
  const isSchoolOfficial = /(?:\.edu\.cn|\.edu\b)/i.test(normalizedUrl);
  const isConfirmedSchoolOfficial =
    Boolean(confirmedOfficialDomain && urlDomain) &&
    (urlDomain === confirmedOfficialDomain || urlDomain.endsWith(`.${confirmedOfficialDomain}`));
  const isPublicOfficialEmployment =
    /(?:ncss\.cn|job\.mohrss\.gov\.cn|gjzwfw\.www\.gov\.cn|mohrss\.gov\.cn)/i.test(normalizedUrl);
  const isCompanyCareer = /(?:careers?|jobs?|campus|join|talent|zhaopin|recruit|hr)[./-]/i.test(normalizedUrl) || /careers?\./i.test(normalizedUrl);
  const hasMarketingTone = ["前景非常好", "高薪热门", "推荐报考", "就业不用愁", "包就业", "轻松就业", "排名前十", "最吃香"].some((token) =>
    text.includes(token),
  );
  const hasOfficialSchoolWords = ["就业质量报告", "就业信息网", "招生网", "信息公开", "教务处", "本科专业", "培养方案", "宣讲会", "双选会"].some((token) =>
    text.includes(token),
  );

  if (isConfirmedSchoolOfficial) {
    return {
      level: "school-official",
      label: "学校官方来源",
      score: hasOfficialSchoolWords ? 94 : 88,
      reason: `已确认官网域名 ${confirmedOfficialDomain}，可作为学校官方入口继续核验。`,
      warning: "仍需保留原始链接和年份，避免只截取结论。",
    };
  }

  if (isSchoolOfficial) {
    return {
      level: "school-official",
      label: "学校官方源",
      score: hasOfficialSchoolWords ? 94 : 88,
      reason: "链接来自学校官方域名，优先作为专业、就业报告和校招证据。",
      warning: "仍需保留原始链接和年份，避免只截取结论。",
    };
  }

  if (isPublicOfficialEmployment) {
    return {
      level: "public-official",
      label: "公共官方源",
      score: 82,
      reason: "链接来自国家级就业或公共招聘服务平台，适合作为公开招聘、岗位和薪资口径线索。",
      warning: "公共官方平台不能直接代表本校就业结果；校招关系仍需回到学校就业网或招聘公告核对。",
    };
  }

  if (isCompanyCareer) {
    return {
      level: "company-official",
      label: "企业官方源",
      score: 86,
      reason: "链接像企业招聘官网，适合作为岗位要求和薪资口径证据。",
      warning: "企业岗位不能直接代表本校就业结果，只能反推专业和岗位关系。",
    };
  }

  if (isSearchEngine) {
    return {
      level: "search-lead",
      label: "搜索线索",
      score: 58,
      reason: "链接来自搜索结果页，只能帮你找到入口。",
      warning: "搜索结果不能直接当结论，必须点进学校官网、报告或企业官网复核。",
    };
  }

  if (hasMarketingTone) {
    return {
      level: "weak",
      label: "弱证据",
      score: 36,
      reason: "文本像营销软文或经验帖，缺少官方主体、年份和可核验数字。",
      warning: "疑似营销内容，不能替代学校报告或企业官网证据。",
    };
  }

  return {
    level: "weak",
    label: "待核来源",
    score: 46,
    reason: "来源域名和发布主体还不明确。",
    warning: "先把它当线索，继续找学校官网、就业网、报告 PDF 或企业官网。",
  };
}

function classifyEvidenceKind(
  text: string,
  metrics: ParsedSchoolEvidenceMetric[],
  companies: string[],
  salaryRanges: string[],
): ParsedSchoolEvidenceKind {
  const scores: Record<ParsedSchoolEvidenceKind, number> = {
    major: 0,
    report: 0,
    campus: 0,
    salary: 0,
  };

  addScore(scores, "major", text, ["专业介绍", "本科专业", "专业设置", "招生专业", "培养方案", "核心课程", "培养目标", "人才培养"]);
  addScore(scores, "report", text, ["就业质量报告", "毕业生就业", "就业率", "去向落实率", "毕业去向", "升学率", "行业流向", "签约单位"]);
  addScore(scores, "campus", text, ["就业信息网", "宣讲会", "双选会", "招聘会", "校园招聘", "进校招聘", "到校招聘", "参会企业"]);
  addScore(scores, "salary", text, ["月薪", "年薪", "薪资", "薪酬", "工资", "校招岗位", "招聘岗位", "base"]);

  if (metrics.length) scores.report += 18;
  if (companies.length >= 2) scores.campus += 18;
  if (salaryRanges.length) scores.salary += 28;

  return (Object.entries(scores) as Array<[ParsedSchoolEvidenceKind, number]>).sort((left, right) => right[1] - left[1])[0][0];
}

function addScore(scores: Record<ParsedSchoolEvidenceKind, number>, kind: ParsedSchoolEvidenceKind, text: string, tokens: string[]) {
  tokens.forEach((token) => {
    if (text.includes(token)) scores[kind] += 10;
  });
}

function extractMetrics(text: string): ParsedSchoolEvidenceMetric[] {
  const metrics: ParsedSchoolEvidenceMetric[] = [];

  dedupeBy([...metricLabels, ...readableMetricLabels], (label) => label).forEach((label) => {
    const pattern = new RegExp(`${escapeRegExp(label)}[^0-9%]{0,12}(\\d+(?:\\.\\d+)?%)`, "g");
    for (const match of text.matchAll(pattern)) {
      metrics.push({ label: normalizeMetricLabel(label), value: match[1] });
    }
  });

  return dedupeBy(metrics, (metric) => `${metric.label}-${metric.value}`).slice(0, 8);
}

function extractCompanies(text: string) {
  const matchedKnownNames = knownCompanyNames
    .filter((name) => text.includes(name))
    .sort((left, right) => text.indexOf(left) - text.indexOf(right));
  const companySuffixMatches = Array.from(text.matchAll(/[\u4e00-\u9fa5A-Za-z0-9（）()·]{2,24}(?:有限公司|集团|银行|医院|事务所)/g)).map((match) =>
    trimCompanyName(match[0]),
  );

  return dedupeBy([...matchedKnownNames, ...companySuffixMatches], (name) => name)
    .filter((name) => name.length >= 2 && !/学校|学院|专业|报告|岗位|就业/.test(name))
    .slice(0, 10);
}

function extractSalaryRanges(text: string) {
  const ranges = [
    ...Array.from(text.matchAll(/\d+(?:\.\d+)?\s*[-~至]\s*\d+(?:\.\d+)?\s*K(?:\/月|每月|月)?/gi)).map((match) =>
      normalizeSalaryRange(match[0]),
    ),
    ...Array.from(text.matchAll(/\d{4,6}\s*[-~至]\s*\d{4,6}\s*元(?:\/月|每月|月)?/g)).map((match) => normalizeSalaryRange(match[0])),
  ];

  return dedupeBy(ranges, (range) => range).slice(0, 5);
}

function extractYears(text: string) {
  return dedupeBy(
    Array.from(text.matchAll(/20\d{2}(?:届|年)?/g)).map((match) => match[0]),
    (year) => year,
  ).slice(0, 5);
}

function extractHighlights(text: string, metrics: ParsedSchoolEvidenceMetric[]) {
  const sentences = text
    .split(/[。！？；]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const importantSentences = sentences.filter((sentence) =>
    ["就业质量报告", "就业率", "去向落实率", "升学率", "宣讲会", "双选会", "月薪", "核心课程", "培养方案"].some((token) => sentence.includes(token)),
  );

  return dedupeBy(
    [
      ...metrics.map((metric) => `${metric.label}${metric.value}`),
      ...importantSentences.map((sentence) => truncateText(sentence, 68)),
    ],
    (item) => item,
  ).slice(0, 5);
}

function scoreEvidenceConfidence(
  kind: ParsedSchoolEvidenceKind,
  text: string,
  metrics: ParsedSchoolEvidenceMetric[],
  companies: string[],
  salaryRanges: string[],
  years: string[],
  sourceTrust: ParsedSchoolEvidenceSourceTrust,
) {
  const kindSignal =
    kind === "report"
      ? metrics.length * 14 + years.length * 5
      : kind === "campus"
        ? companies.length * 9 + years.length * 5
        : kind === "salary"
          ? salaryRanges.length * 24
          : ["专业介绍", "培养方案", "核心课程", "招生专业"].filter((token) => text.includes(token)).length * 12;
  const sourceAdjustment =
    sourceTrust.level === "school-official"
      ? 12
      : sourceTrust.level === "company-official"
        ? 8
        : sourceTrust.level === "public-official"
          ? 4
          : sourceTrust.level === "search-lead"
            ? -10
            : -22;

  return Math.max(28, Math.min(96, 42 + kindSignal + sourceAdjustment + Math.min(16, Math.floor(text.length / 80))));
}

function buildEvidenceTitle(kind: ParsedSchoolEvidenceKind, schoolName: string, majorName: string, jobName: string, years: string[], text: string) {
  const yearLabel = years[0] ? `${years[0]} ` : "";
  const focus = majorName || jobName || schoolName || "目标学校";
  const reportTitle = text.match(/[^。！？]{0,24}就业质量报告[^。！？]{0,18}/)?.[0]?.trim();

  if (kind === "report" && reportTitle) return truncateText(reportTitle, 42);
  return `${yearLabel}${focus}${kindLabels[kind]}`;
}

function buildEvidenceDetail(
  kind: ParsedSchoolEvidenceKind,
  text: string,
  metrics: ParsedSchoolEvidenceMetric[],
  companies: string[],
  salaryRanges: string[],
  highlights: string[],
  sourceTrust: ParsedSchoolEvidenceSourceTrust,
) {
  const parts = [
    `来源：${sourceTrust.label}`,
    metrics.length ? `指标：${metrics.map((metric) => `${metric.label}${metric.value}`).join(" / ")}` : "",
    companies.length ? `企业：${companies.slice(0, 5).join(" / ")}` : "",
    salaryRanges.length ? `薪资：${salaryRanges.join(" / ")}` : "",
    highlights.length ? `摘录：${highlights.slice(0, 2).join("；")}` : "",
  ].filter(Boolean);

  return parts.length ? parts.join("｜") : `已识别为${kindLabels[kind]}证据：${truncateText(text, 90)}`;
}

function normalizeSalaryRange(value: string) {
  return value.replace(/\s+/g, "").replace(/[~至]/g, "-").replace(/\/月|每月|月/gi, "");
}

function normalizeMetricLabel(label: string) {
  return label === "去向落实率" || label === "毕业去向落实率" ? "就业去向落实率" : label;
}

function trimCompanyName(value: string) {
  return value.replace(/^[，。、；：\s]+|[，。、；：\s]+$/g, "");
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function dedupeBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
