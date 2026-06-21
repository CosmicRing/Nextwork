import { extractUnknownSchoolOfficialDomain } from "./unknownSchoolEntryPack";

export type SchoolPublicOfficialLinkLike = {
  label: string;
  url: string;
  kind: "major-catalog" | "admissions" | "employment" | "report" | "school";
  note: string;
};

export type SchoolPublicMajorAccessEntry = {
  label: string;
  type: "official" | "search";
  source: string;
  category: "专业目录" | "招生专业" | "培养方案" | "学院入口" | "信息公开" | "课程计划" | "就业报告" | "校招宣讲";
  detail: string;
  actionTitle: string;
  acceptedEvidence: string;
  copyTemplate: string;
  url: string;
  query?: string;
};

export type SchoolOfficialEntranceLauncherCard = SchoolPublicMajorAccessEntry & {
  slot: "major" | "admissions" | "report" | "campus";
  title: string;
  saveHint: string;
};

type BuildSchoolPublicMajorAccessEntriesInput = {
  schoolName: string;
  majorName?: string | null;
  officialDomain?: string | null;
  officialLinks: SchoolPublicOfficialLinkLike[];
};

export function buildSchoolPublicMajorAccessEntries({
  schoolName,
  majorName,
  officialDomain,
  officialLinks,
}: BuildSchoolPublicMajorAccessEntriesInput): SchoolPublicMajorAccessEntry[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() ?? "";
  const officialEntries = officialLinks
    .filter((link) => isMajorAccessOfficialLink(link))
    .map((link): SchoolPublicMajorAccessEntry => {
      const category = getOfficialLinkCategory(link.kind);
      return {
        label: link.label,
        type: "official",
        source: getOfficialLinkSource(link.kind),
        category,
        detail: link.note,
        ...getPublicMajorAccessActionGuide(category),
        url: link.url,
      };
    });
  const siteScopedSearchEntries = buildOfficialDomainMajorSearchEntries(
    safeSchoolName,
    safeMajorName,
    officialDomain,
  );
  const searchEntries = buildPublicMajorSearchEntries(safeSchoolName, safeMajorName);

  return dedupePublicMajorAccessEntries([...officialEntries, ...siteScopedSearchEntries, ...searchEntries]).slice(0, 12);
}

export function buildSchoolOfficialEntranceLauncherCards(
  entries: SchoolPublicMajorAccessEntry[],
): SchoolOfficialEntranceLauncherCard[] {
  const specs: Array<{
    slot: SchoolOfficialEntranceLauncherCard["slot"];
    title: string;
    saveHint: string;
    categories: SchoolPublicMajorAccessEntry["category"][];
  }> = [
    {
      slot: "major",
      title: "确认专业真的开设",
      saveHint: "专业名、学院、层次、学制、校区",
      categories: ["专业目录", "培养方案", "课程计划", "学院入口"],
    },
    {
      slot: "admissions",
      title: "确认今年招生口径",
      saveHint: "招生年份、招生计划、校区、录取口径",
      categories: ["招生专业"],
    },
    {
      slot: "report",
      title: "找就业率和毕业去向",
      saveHint: "报告年份、就业率、升学率、行业流向",
      categories: ["就业报告", "信息公开"],
    },
    {
      slot: "campus",
      title: "看每年哪些企业到校",
      saveHint: "宣讲会/双选会日期、企业名、岗位",
      categories: ["校招宣讲"],
    },
  ];

  return specs.flatMap((spec) => {
    const entry = pickBestEntranceEntry(entries, spec.categories);
    return entry ? [{ ...entry, slot: spec.slot, title: spec.title, saveHint: spec.saveHint }] : [];
  });
}

function pickBestEntranceEntry(
  entries: SchoolPublicMajorAccessEntry[],
  categories: SchoolPublicMajorAccessEntry["category"][],
) {
  return entries
    .filter((entry) => categories.includes(entry.category))
    .sort((left, right) => scoreEntranceEntry(left, categories) - scoreEntranceEntry(right, categories))[0];
}

function scoreEntranceEntry(
  entry: SchoolPublicMajorAccessEntry,
  categories: SchoolPublicMajorAccessEntry["category"][],
) {
  const categoryScore = Math.max(categories.indexOf(entry.category), 0) * 10;
  const trustScore = entry.type === "official" ? 0 : entry.source.includes("已确认官网域名") ? 1 : 2;
  return categoryScore + trustScore;
}

function buildOfficialDomainMajorSearchEntries(
  schoolName: string,
  majorName: string,
  officialDomain?: string | null,
): SchoolPublicMajorAccessEntry[] {
  const normalizedDomain = extractUnknownSchoolOfficialDomain(officialDomain);
  if (!normalizedDomain) return [];

  const majorClause = majorName ? ` ${majorName}` : "";
  const sitePrefix = `site:${normalizedDomain}`;
  const entries: Array<Omit<SchoolPublicMajorAccessEntry, "url" | "actionTitle" | "acceptedEvidence" | "copyTemplate">> = [
    {
      label: "官网站内专业目录",
      type: "search",
      source: "Bing · 已确认官网域名",
      category: "专业目录",
      detail: "限定学校官网域名，优先找专业目录、专业设置和学院入口。",
      query: `${sitePrefix} ${schoolName}${majorClause} 专业目录 专业设置 学院`,
    },
    {
      label: "官网站内招生专业",
      type: "search",
      source: "Bing · 已确认官网域名",
      category: "招生专业",
      detail: "限定学校官网域名，确认该专业是否招生、层次、校区和招生年份。",
      query: `${sitePrefix} ${schoolName}${majorClause} 招生专业 专业介绍 招生计划`,
    },
    {
      label: "官网站内培养方案",
      type: "search",
      source: "Bing · 已确认官网域名",
      category: "培养方案",
      detail: "限定学校官网域名，查看培养目标、核心课程、实训和实习安排。",
      query: `${sitePrefix} ${schoolName}${majorClause} 人才培养方案 核心课程 实训`,
    },
    {
      label: "官网站内就业报告",
      type: "search",
      source: "Bing · 已确认官网域名",
      category: "就业报告",
      detail: "限定学校官网域名，优先找近两年就业质量报告、就业率和去向统计。",
      query: `${sitePrefix} ${schoolName}${majorClause} 就业质量报告 就业率 就业去向`,
    },
    {
      label: "官网站内校招宣讲",
      type: "search",
      source: "Bing · 已确认官网域名",
      category: "校招宣讲",
      detail: "限定学校官网域名，查看宣讲会、双选会和到校招聘企业记录。",
      query: `${sitePrefix} ${schoolName}${majorClause} 宣讲会 双选会 校园招聘 企业`,
    },
  ];

  return entries.map((entry) => ({
    ...entry,
    ...getPublicMajorAccessActionGuide(entry.category),
    url: makeBingUrl(entry.query ?? ""),
  }));
}

function buildPublicMajorSearchEntries(schoolName: string, majorName: string): SchoolPublicMajorAccessEntry[] {
  const majorClause = majorName ? ` ${majorName}` : "";
  const makeBaiduUrl = (query: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
  const entries: Array<Omit<SchoolPublicMajorAccessEntry, "url" | "actionTitle" | "acceptedEvidence" | "copyTemplate"> & { engine: "bing" | "baidu" }> = [
    {
      label: "官网专业目录检索",
      type: "search",
      source: "Bing · 限定 edu.cn",
      category: "专业目录",
      detail: "优先找学校官网、本科生院、教务处或学院发布的专业设置页。",
      query: `${schoolName}${majorClause} 本科专业 专业设置 专业目录 site:.edu.cn`,
      engine: "bing",
    },
    {
      label: "招生专业检索",
      type: "search",
      source: "百度 · 招生网",
      category: "招生专业",
      detail: "招生网通常有专业介绍、招生计划、校区和录取口径。",
      query: `${schoolName}${majorClause} 招生专业 专业介绍 招生计划 官网`,
      engine: "baidu",
    },
    {
      label: "培养方案检索",
      type: "search",
      source: "Bing · 培养方案",
      category: "培养方案",
      detail: "培养方案能看到核心课程、实践环节和专业方向，比宣传文案更有用。",
      query: `${schoolName}${majorClause} 人才培养方案 培养目标 核心课程`,
      engine: "bing",
    },
    {
      label: "学院专业页检索",
      type: "search",
      source: "百度 · 学院页面",
      category: "学院入口",
      detail: "学院官网常披露师资、实验室、实习基地和专业负责人。",
      query: `${schoolName}${majorClause} 学院 专业介绍 师资 实习基地`,
      engine: "baidu",
    },
    {
      label: "信息公开检索",
      type: "search",
      source: "Bing · 信息公开",
      category: "信息公开",
      detail: "信息公开页可能出现专业备案、就业报告和年度质量报告入口。",
      query: `${schoolName}${majorClause} 信息公开 本科专业 设置 就业质量报告`,
      engine: "bing",
    },
    {
      label: "就业质量报告检索",
      type: "search",
      source: "Bing · 就业报告",
      category: "就业报告",
      detail: "毕业生就业质量报告通常公开就业率、升学率、就业去向、行业分布和重点单位。",
      query: `${schoolName}${majorClause} 毕业生就业质量报告 就业率 就业去向 site:.edu.cn`,
      engine: "bing",
    },
    {
      label: "校招宣讲会检索",
      type: "search",
      source: "百度 · 就业信息网",
      category: "校招宣讲",
      detail: "就业信息网、双选会和宣讲会页面能看每年哪些企业进校招聘。",
      query: `${schoolName}${majorClause} 就业信息网 宣讲会 双选会 校园招聘 企业`,
      engine: "baidu",
    },
    {
      label: "教务课程检索",
      type: "search",
      source: "Bing · 教务处",
      category: "课程计划",
      detail: "用教务处、课程计划和教学大纲交叉验证专业是否只是名字好听。",
      query: `${schoolName}${majorClause} 教务处 课程计划 教学大纲 专业`,
      engine: "bing",
    },
  ];

  return entries.map((entry) => ({
    ...entry,
    ...getPublicMajorAccessActionGuide(entry.category),
    url: entry.engine === "bing" ? makeBingUrl(entry.query ?? "") : makeBaiduUrl(entry.query ?? ""),
  }));
}

function makeBingUrl(query: string) {
  return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
}

function getPublicMajorAccessActionGuide(category: SchoolPublicMajorAccessEntry["category"]) {
  if (category === "专业目录" || category === "招生专业") {
    return {
      actionTitle: "确认这个专业真实开设",
      acceptedEvidence: "专业名称、所属学院、层次/学制、招生年份、校区",
      copyTemplate: "专业存在：学校官网显示【专业名称】归属【学院】，层次【本科/专科】，年份【20xx】。",
    };
  }

  if (category === "培养方案" || category === "课程计划") {
    return {
      actionTitle: "确认专业学什么、能不能对上岗位",
      acceptedEvidence: "培养目标、核心课程、实践环节、实习基地、毕业要求",
      copyTemplate: "培养方案：核心课程【课程1/课程2】，实践环节【实习/项目】，可对应岗位【岗位】。",
    };
  }

  if (category === "就业报告" || category === "信息公开") {
    return {
      actionTitle: "找毕业去向和就业质量数字",
      acceptedEvidence: "报告年份、就业率、升学率、行业去向、重点单位、样本口径",
      copyTemplate: "就业报告：20xx届【专业/学院】就业率【xx%】，升学率【xx%】，主要去向【行业/单位】。",
    };
  }

  if (category === "校招宣讲") {
    return {
      actionTitle: "确认每年哪些企业来学校招聘",
      acceptedEvidence: "年份、双选会/宣讲会名称、企业名单、岗位类型、学院或专业限制",
      copyTemplate: "到校企业：20xx年【活动名称】包含【企业1/企业2】，岗位【岗位类型】，面向【专业】。",
    };
  }

  return {
    actionTitle: "先找到学院或专业页",
    acceptedEvidence: "学院名称、专业列表、师资/实验室、实习基地、联系方式",
    copyTemplate: "专业入口：学院页显示【专业】相关信息，证据字段【课程/师资/实习基地】。",
  };
}

function isMajorAccessOfficialLink(link: SchoolPublicOfficialLinkLike) {
  return (
    link.kind === "major-catalog" ||
    link.kind === "admissions" ||
    link.kind === "school" ||
    link.kind === "report" ||
    link.kind === "employment"
  );
}

function getOfficialLinkSource(kind: SchoolPublicOfficialLinkLike["kind"]) {
  if (kind === "major-catalog") return "学校官网 · 专业目录";
  if (kind === "admissions") return "学校官网 · 招生";
  if (kind === "employment") return "学校官网 · 就业中心";
  if (kind === "report") return "学校官网 · 报告";
  return "学校官网";
}

function getOfficialLinkCategory(kind: SchoolPublicOfficialLinkLike["kind"]): SchoolPublicMajorAccessEntry["category"] {
  if (kind === "major-catalog") return "专业目录";
  if (kind === "admissions") return "招生专业";
  if (kind === "employment") return "校招宣讲";
  if (kind === "report") return "信息公开";
  return "学院入口";
}

function dedupePublicMajorAccessEntries(entries: SchoolPublicMajorAccessEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.type}-${entry.label}-${entry.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
