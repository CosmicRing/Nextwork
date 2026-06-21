export type UnknownSchoolEntryCategory =
  | "school-official"
  | "admissions"
  | "major-catalog"
  | "employment"
  | "report"
  | "campus"
  | "salary";

export type UnknownSchoolEntryPackItem = {
  id: string;
  label: string;
  category: UnknownSchoolEntryCategory;
  source: string;
  detail: string;
  query: string;
  url: string;
};

export type UnknownSchoolOfficialSiteRecipe = {
  id: string;
  label: string;
  target: string;
  evidenceKind: "major" | "report" | "campus" | "salary";
  evidenceLabel: string;
  saveHint: string;
  detail: string;
  query: string;
  url: string;
};

export type UnknownSchoolPublicDocumentMatrixItem = {
  id: "major-proof" | "admission-proof" | "employment-report" | "campus-recruiting" | "salary-crosscheck";
  priority: number;
  label: string;
  proofTarget: string;
  evidenceKind: "major" | "report" | "campus" | "salary";
  source: string;
  query: string;
  siteQuery: string;
  url: string;
  siteUrl: string;
  openHint: string;
  saveFields: string[];
};

export type UnknownSchoolEvidenceKind = "major" | "report" | "campus" | "salary";

export type UnknownSchoolEvidenceCaptureTemplate = {
  kind: UnknownSchoolEvidenceKind;
  label: string;
  source: string;
  url: string;
  query: string;
  fields: string[];
  requiredText: string;
  rejectIf: string;
  detail: string;
};

export type UnknownSchoolEvidenceCaptureTemplateSource = {
  kind?: UnknownSchoolEvidenceKind;
  evidenceKind?: UnknownSchoolEvidenceKind;
  category?: UnknownSchoolEntryCategory;
  label: string;
  source?: string;
  query: string;
  url: string;
  detail?: string;
  proofTarget?: string;
  openHint?: string;
  saveHint?: string;
  saveFields?: string[];
};

export type UnknownSchoolAuthorityEntrance = {
  id:
    | "chsi-school"
    | "chsi-major"
    | "chsi-admission"
    | "chsi-zyck"
    | "ncss-campus"
    | "mohrss-public-jobs"
    | "gov-employment-service";
  label: string;
  badge: string;
  source: string;
  evidenceKind: "major" | "report" | "campus" | "salary";
  detail: string;
  query: string;
  url: string;
};

export type UnknownSchoolPublicEntranceTrustLevel = "official" | "authority" | "search";

export type UnknownSchoolPublicEntranceDirectoryEntry = {
  id: string;
  label: string;
  source: string;
  detail: string;
  query: string;
  url: string;
  trustLevel: UnknownSchoolPublicEntranceTrustLevel;
};

export type UnknownSchoolPublicEntranceDirectoryGroup = {
  id: "official-identity" | "major-material" | "employment-outcome" | "campus-recruiting" | "salary-jobs";
  label: string;
  summary: string;
  primaryAction: string;
  saveFields: string[];
  entries: UnknownSchoolPublicEntranceDirectoryEntry[];
};

export type UnknownSchoolEvidenceGuideStep = {
  id: "official-domain" | "major-exists" | "employment-report" | "campus-employers" | "salary-proxy";
  order: number;
  entryId: UnknownSchoolEntryPackItem["id"];
  title: string;
  acceptedEvidence: string;
  rejectIf: string;
  nextAction: string;
};

export type UnknownSchoolOfficialSourceTask = {
  id: "verify-school" | "verify-major" | "employment-report" | "campus-recruiting" | "salary-proxy";
  order: number;
  label: string;
  stage: string;
  evidenceKind: UnknownSchoolEvidenceKind;
  source: string;
  purpose: string;
  action: string;
  query: string;
  url: string;
  siteQuery?: string;
  siteUrl?: string;
  proofTarget: string;
  openHint: string;
  saveFields: string[];
};

type UnknownSchoolEntryPackInput = {
  schoolName: string;
  majorName?: string | null;
  jobName?: string | null;
  officialDomain?: string | null;
};

type UnknownSchoolEntryPacketTextInput = UnknownSchoolEntryPackInput & {
  entries: UnknownSchoolEntryPackItem[];
};

export function buildUnknownSchoolAuthorityEntrances({
  schoolName,
  majorName,
  jobName,
}: UnknownSchoolEntryPackInput): UnknownSchoolAuthorityEntrance[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "目标专业";
  const safeJobName = jobName?.trim() || "目标岗位";

  return [
    {
      id: "chsi-school",
      label: "阳光高考院校库",
      badge: "验学校",
      source: "阳光高考 / 学信网",
      evidenceKind: "major",
      detail: "先核对学校是否在教育部高校招生指定平台的院校库里，再看官网吗和招生网。",
      query: `${safeSchoolName} 院校库 官方网址 招生网址`,
      url: "https://gaokao.chsi.com.cn/sch/",
    },
    {
      id: "chsi-major",
      label: "阳光高考专业知识库",
      badge: "验专业",
      source: "阳光高考 / 学信网",
      evidenceKind: "major",
      detail: "查本科、高职和职教本科专业介绍、开设院校、就业方向和专业点分布。",
      query: `${safeMajorName} ${safeSchoolName} 专业知识库 开设院校 就业方向`,
      url: "https://gaokao.chsi.com.cn/zyk/zybk/",
    },
    {
      id: "chsi-admission",
      label: "阳光高考招生章程",
      badge: "验招生",
      source: "阳光高考 / 学信网",
      evidenceKind: "major",
      detail: "招生章程经过主管部门审核，适合核对办学性质、校区、录取规则和专业计划。",
      query: `${safeSchoolName} 招生章程 办学性质 校区 专业计划`,
      url: "https://gaokao.chsi.com.cn/zsgs/zhangcheng/",
    },
    {
      id: "chsi-zyck",
      label: "阳光志愿信息服务",
      badge: "验参考",
      source: "阳光高考 / 学信网",
      evidenceKind: "major",
      detail: "补充院校、专业、职业和志愿参考入口，先当权威入口，不把推荐结果当就业结论。",
      query: `${safeSchoolName} ${safeMajorName} 阳光志愿 院校 专业 职业参考`,
      url: "https://gaokao.chsi.com.cn/zyck/",
    },
    {
      id: "ncss-campus",
      label: "国家大学生就业服务平台",
      badge: "查校招",
      source: "教育部学生服务与素质发展中心",
      evidenceKind: "campus",
      detail: "查国家级校园招聘、专场招聘和就业服务入口，用来反查目标学校相关行业是否有公开招聘活动。",
      query: `${safeSchoolName} ${safeMajorName} ${safeJobName} 国家大学生就业服务平台 校园招聘 专场招聘`,
      url: "https://www.ncss.cn/",
    },
    {
      id: "mohrss-public-jobs",
      label: "中国公共招聘网",
      badge: "查岗位",
      source: "人力资源和社会保障部",
      evidenceKind: "salary",
      detail: "用公共就业岗位入口反查目标专业和岗位在公开市场里的岗位名称、地区和招聘要求。",
      query: `${safeSchoolName} ${safeMajorName} ${safeJobName} 中国公共招聘网 岗位 地区 要求`,
      url: "https://job.mohrss.gov.cn/",
    },
    {
      id: "gov-employment-service",
      label: "国家政务服务平台就业招聘",
      badge: "查就业",
      source: "国家政务服务平台",
      evidenceKind: "salary",
      detail: "补一个政务侧就业招聘总入口，适合低知名度学校用户继续查公共招聘、就业创业和地方入口。",
      query: `${safeSchoolName} ${safeMajorName} ${safeJobName} 国家政务服务平台 就业招聘 公共招聘`,
      url: "https://gjzwfw.www.gov.cn/col/col1110/",
    },
  ];
}

export function buildUnknownSchoolEvidenceCaptureTemplate(
  source: UnknownSchoolEvidenceCaptureTemplateSource,
): UnknownSchoolEvidenceCaptureTemplate {
  const kind = source.evidenceKind ?? source.kind ?? getUnknownSchoolEvidenceKindForCategory(source.category);
  const base = getUnknownSchoolEvidenceCaptureBase(kind);
  const fields = mergeCaptureFields(source.saveFields ?? [], base.fields);
  const context = source.proofTarget || source.detail || source.openHint || source.saveHint || source.label;
  const detail = [
    context,
    `采集字段：${fields.join(" / ")}`,
    `原文必须包含：${base.requiredText}`,
    `不要算证据：${base.rejectIf}`,
    `查询口令：${source.query}`,
  ].filter(Boolean).join(" | ");

  return {
    kind,
    label: source.label,
    source: source.source || "公开入口",
    url: source.url,
    query: source.query,
    fields,
    requiredText: base.requiredText,
    rejectIf: base.rejectIf,
    detail,
  };
}

export function buildUnknownSchoolPublicDocumentMatrix({
  schoolName,
  majorName,
  jobName,
  officialDomain,
}: UnknownSchoolEntryPackInput): UnknownSchoolPublicDocumentMatrixItem[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "专业名";
  const safeJobName = jobName?.trim() || "目标岗位";
  const safeOfficialDomain = normalizeUnknownSchoolOfficialDomain(officialDomain) || "学校官网域名";
  const sitePrefix = `site:${safeOfficialDomain}`;

  return [
    makePublicDocumentMatrixItem({
      id: "major-proof",
      priority: 1,
      label: "专业目录 / 培养方案",
      proofTarget: "证明这个专业真实存在",
      evidenceKind: "major",
      source: "学校官网 / 学院 / 教务处",
      query: `${safeSchoolName} ${safeMajorName} 官网 专业设置 人才培养方案 核心课程`,
      siteQuery: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 专业设置 人才培养方案 核心课程`,
      openHint: "优先打开学校官网、学院页或教务处页面，不拿聚合站当证据。",
      saveFields: ["专业名", "学院", "核心课程", "培养方向"],
    }),
    makePublicDocumentMatrixItem({
      id: "admission-proof",
      priority: 2,
      label: "招生专业 / 招生计划",
      proofTarget: "确认招生口径和校区",
      evidenceKind: "major",
      source: "招生网 / 招生简章",
      query: `${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 招生计划 官网`,
      siteQuery: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 招生计划`,
      openHint: "招生网通常能确认专业名、招生计划、校区和录取口径。",
      saveFields: ["专业名", "招生年份", "招生计划", "校区"],
    }),
    makePublicDocumentMatrixItem({
      id: "employment-report",
      priority: 3,
      label: "就业质量报告",
      proofTarget: "核对就业率、升学和行业去向",
      evidenceKind: "report",
      source: "信息公开 / 就业质量报告 PDF",
      query: `${safeSchoolName} 2025 2024 就业质量报告 PDF 信息公开`,
      siteQuery: `${sitePrefix} ${safeSchoolName} 2025 2024 就业质量报告 信息公开 PDF`,
      openHint: "优先找近两年报告，保存年份和指标口径，不拿宣传文案代替报告。",
      saveFields: ["报告年份", "就业率", "升学率", "行业去向"],
    }),
    makePublicDocumentMatrixItem({
      id: "campus-recruiting",
      priority: 4,
      label: "宣讲会 / 双选会",
      proofTarget: "确认每年哪些企业来校招聘",
      evidenceKind: "campus",
      source: "就业信息网 / 双选会公告",
      query: `${safeSchoolName} ${safeMajorName} 宣讲会 双选会 企业名单 校园招聘`,
      siteQuery: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名单`,
      openHint: "看日期、企业名和岗位，合作单位 logo 墙不能直接当招聘证据。",
      saveFields: ["日期", "企业名", "岗位", "面向专业"],
    }),
    makePublicDocumentMatrixItem({
      id: "salary-crosscheck",
      priority: 5,
      label: "企业岗位 / 薪资交叉验证",
      proofTarget: "用岗位薪资反查专业价值",
      evidenceKind: "salary",
      source: "企业官网 / 校招公告 / 公开薪资",
      query: `${safeSchoolName} ${safeMajorName} ${safeJobName} 校招 岗位 薪资 官方招聘`,
      siteQuery: `${sitePrefix} ${safeSchoolName} ${safeMajorName} ${safeJobName} 岗位 薪资 就业信息网`,
      openHint: "最后再看薪资代理，把城市、岗位和来源分开记录。",
      saveFields: ["岗位", "城市", "薪资区间", "来源"],
    }),
  ];
}

export function buildUnknownSchoolOfficialSourceTaskFlow({
  schoolName,
  majorName,
  jobName,
  officialDomain,
}: UnknownSchoolEntryPackInput): UnknownSchoolOfficialSourceTask[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "目标专业";
  const safeJobName = jobName?.trim() || "目标岗位";
  const safeOfficialDomain = normalizeUnknownSchoolOfficialDomain(officialDomain);
  const sitePrefix = safeOfficialDomain ? `site:${safeOfficialDomain} ` : "";
  const makeSearchUrl = (query: string) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  return [
    {
      id: "verify-school",
      order: 1,
      label: "验学校",
      stage: "先确认学校和官网",
      evidenceKind: "major",
      source: "阳光高考 / 学校官网",
      purpose: "确认学校是真实办学主体，拿到官网、招生网和信息公开入口。",
      action: "先在阳光高考院校库查学校，再打开学校官网核对域名。",
      query: `${safeSchoolName} 院校库 官方网址 招生网址 site:gaokao.chsi.com.cn`,
      url: "https://gaokao.chsi.com.cn/sch/",
      proofTarget: "证明学校主体和官网入口可信",
      openHint: "保存阳光高考院校库、学校官网或招生网里能互相指向的页面。",
      saveFields: ["学校全称", "官方网址", "招生网址", "办学层次"],
    },
    {
      id: "verify-major",
      order: 2,
      label: "验专业",
      stage: "确认专业真实开设",
      evidenceKind: "major",
      source: "学校招生网 / 学院官网 / 阳光高考专业库",
      purpose: "确认目标专业不是宣传词，而是招生或培养方案里真实存在的专业。",
      action: "先看招生专业和培养方案，再用阳光高考专业库校准专业大类。",
      query: `${sitePrefix}${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 培养方案 核心课程`,
      url: makeSearchUrl(`${sitePrefix}${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 培养方案 核心课程`),
      siteQuery: safeOfficialDomain
        ? `site:${safeOfficialDomain} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 培养方案`
        : undefined,
      siteUrl: safeOfficialDomain
        ? makeSearchUrl(`site:${safeOfficialDomain} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 培养方案`)
        : undefined,
      proofTarget: "证明专业真实开设并能对应课程或培养方向",
      openHint: "优先保存招生网、学院页、教务处培养方案，不把聚合页当证据。",
      saveFields: ["专业名", "学院/系部", "招生年份", "核心课程"],
    },
    {
      id: "employment-report",
      order: 3,
      label: "抓就业报告",
      stage: "抓毕业去向和就业率",
      evidenceKind: "report",
      source: "学校信息公开 / 就业质量报告 PDF",
      purpose: "用近两年报告确认就业率、升学率、行业去向和统计口径。",
      action: "搜索学校信息公开和就业质量报告，优先打开 PDF 或学校发布页。",
      query: `${sitePrefix}${safeSchoolName} 2025 2024 就业质量报告 PDF 就业率 升学率 信息公开`,
      url: makeSearchUrl(`${sitePrefix}${safeSchoolName} 2025 2024 就业质量报告 PDF 就业率 升学率 信息公开`),
      siteQuery: safeOfficialDomain
        ? `site:${safeOfficialDomain} ${safeSchoolName} 2025 2024 就业质量报告 PDF 就业率 升学率`
        : undefined,
      siteUrl: safeOfficialDomain
        ? makeSearchUrl(`site:${safeOfficialDomain} ${safeSchoolName} 2025 2024 就业质量报告 PDF 就业率 升学率`)
        : undefined,
      proofTarget: "补毕业去向、就业率和升学率",
      openHint: "只保存带年份、比例和统计口径的报告，不保存泛泛就业宣传。",
      saveFields: ["报告年份", "就业率", "升学率", "行业去向"],
    },
    {
      id: "campus-recruiting",
      order: 4,
      label: "抓到校企业",
      stage: "确认谁来学校招聘",
      evidenceKind: "campus",
      source: "就业信息网 / 宣讲会 / 双选会",
      purpose: "看每年到底有哪些企业来校招，以及岗位是否面向目标专业。",
      action: "打开就业信息网、宣讲会或双选会日历，保存日期、企业和岗位。",
      query: `${sitePrefix}${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名 岗位`,
      url: makeSearchUrl(`${sitePrefix}${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名 岗位`),
      siteQuery: safeOfficialDomain
        ? `site:${safeOfficialDomain} ${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名`
        : undefined,
      siteUrl: safeOfficialDomain
        ? makeSearchUrl(`site:${safeOfficialDomain} ${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名`)
        : undefined,
      proofTarget: "补到校企业、岗位和招聘年份",
      openHint: "保存带日期的招聘活动记录，不把合作单位 logo 墙当招聘证据。",
      saveFields: ["日期", "企业名", "岗位", "面向专业"],
    },
    {
      id: "salary-proxy",
      order: 5,
      label: "补岗位薪资",
      stage: "用岗位反查薪资",
      evidenceKind: "salary",
      source: "企业官网 / 公共招聘 / 薪资代理",
      purpose: "用岗位和城市薪资给专业价值做代理，不冒充学校官方薪资。",
      action: "用专业和目标岗位反查企业招聘页、公共招聘页和公开薪资口径。",
      query: `${safeSchoolName} ${safeMajorName} ${safeJobName} 校招 岗位 薪资 官方招聘`,
      url: makeSearchUrl(`${safeSchoolName} ${safeMajorName} ${safeJobName} 校招 岗位 薪资 官方招聘`),
      proofTarget: "补岗位名、城市和薪资区间",
      openHint: "最后再看薪资代理，必须把城市、岗位和来源日期分开记录。",
      saveFields: ["岗位名", "城市/地区", "薪资区间", "来源日期"],
    },
  ];
}

export function buildUnknownSchoolEntryPack({
  schoolName,
  majorName,
  jobName,
}: UnknownSchoolEntryPackInput): UnknownSchoolEntryPackItem[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() ?? "";
  const safeJobName = jobName?.trim() ?? "";
  const majorClause = safeMajorName ? ` ${safeMajorName}` : "";
  const jobClause = safeJobName ? ` ${safeJobName}` : "";

  return [
    makeEntry({
      id: "school-official",
      label: "学校官网",
      category: "school-official",
      source: "Bing",
      detail: "先确认学校官网、院系入口和信息公开栏目，不从营销页开始。",
      query: `${safeSchoolName} 学校官网 官方 网站`,
      engine: "bing",
    }),
    makeEntry({
      id: "admissions",
      label: "招生专业",
      category: "admissions",
      source: "百度",
      detail: "招生网通常能看到专业介绍、招生计划、校区和录取口径。",
      query: `${safeSchoolName}${majorClause} 招生专业 专业介绍 招生计划 官网`,
      engine: "baidu",
    }),
    makeEntry({
      id: "major-catalog",
      label: "专业目录 / 培养方案",
      category: "major-catalog",
      source: "Bing · 官网/学院",
      detail: "用专业设置、培养方案、核心课程验证这个专业到底学什么。",
      query: `${safeSchoolName}${majorClause} 官网 学院 专业设置 人才培养方案 核心课程`,
      engine: "bing",
    }),
    makeEntry({
      id: "employment",
      label: "就业信息网",
      category: "employment",
      source: "Bing",
      detail: "就业网能看到招聘公告、实习、宣讲会、双选会和到校企业。",
      query: `${safeSchoolName} 就业信息网 招聘 宣讲会 双选会`,
      engine: "bing",
    }),
    makeEntry({
      id: "report",
      label: "就业质量报告",
      category: "report",
      source: "Bing · PDF",
      detail: "优先找近两年就业质量报告，核对就业率、行业流向和升学比例。",
      query: `${safeSchoolName} 2025 2024 就业质量报告 PDF 信息公开`,
      engine: "bing",
    }),
    makeEntry({
      id: "campus",
      label: "到校招聘企业",
      category: "campus",
      source: "百度",
      detail: "搜索企业名单和宣讲会记录，判断每年到底谁来学校招聘。",
      query: `${safeSchoolName}${majorClause} 宣讲会 双选会 企业名单 校园招聘`,
      engine: "baidu",
    }),
    makeEntry({
      id: "salary",
      label: "岗位薪资代理",
      category: "salary",
      source: "Bing",
      detail: "用专业或目标岗位反查公司官网岗位和公开薪资口径。",
      query: `${safeSchoolName}${majorClause}${jobClause} 校招 岗位 薪资 官方招聘`,
      engine: "bing",
    }),
  ];
}

export function pickUnknownSchoolFastEntranceEntries(
  entries: UnknownSchoolEntryPackItem[],
): UnknownSchoolEntryPackItem[] {
  const priorityIds = ["school-official", "admissions", "major-catalog", "employment", "report", "campus", "salary"];
  return priorityIds
    .map((id) => entries.find((entry) => entry.id === id))
    .filter((entry): entry is UnknownSchoolEntryPackItem => Boolean(entry));
}

export function buildUnknownSchoolOfficialSiteRecipes({
  schoolName,
  majorName,
  jobName,
  officialDomain,
}: UnknownSchoolEntryPackInput): UnknownSchoolOfficialSiteRecipe[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "专业名";
  const safeJobName = jobName?.trim() || "目标岗位";
  const safeOfficialDomain = normalizeUnknownSchoolOfficialDomain(officialDomain) || "已确认官网域名";
  const sitePrefix = `site:${safeOfficialDomain}`;

  return [
    makeOfficialSiteRecipe({
      id: "site-admissions",
      label: "站内查招生专业",
      target: "招生专业",
      evidenceKind: "major",
      evidenceLabel: "补专业存在",
      saveHint: "保存专业名、招生计划、学院或校区",
      detail: "确认专业名、招生计划、校区和学院归属。",
      query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 招生计划`,
    }),
    makeOfficialSiteRecipe({
      id: "site-major-catalog",
      label: "站内查专业设置",
      target: "专业设置",
      evidenceKind: "major",
      evidenceLabel: "补专业存在",
      saveHint: "保存培养方案、核心课程或学院专业页",
      detail: "用培养方案、核心课程和学院页验证专业真实存在。",
      query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 专业设置 人才培养方案 核心课程`,
    }),
    makeOfficialSiteRecipe({
      id: "site-report",
      label: "站内查就业报告",
      target: "就业质量报告",
      evidenceKind: "report",
      evidenceLabel: "补就业报告",
      saveHint: "保存年份、就业率、升学率和行业去向",
      detail: "优先找近两年就业率、升学率、行业流向和样本口径。",
      query: `${sitePrefix} ${safeSchoolName} 2025 2024 就业质量报告 信息公开 PDF`,
    }),
    makeOfficialSiteRecipe({
      id: "site-campus",
      label: "站内查宣讲双选",
      target: "宣讲会 / 双选会",
      evidenceKind: "campus",
      evidenceLabel: "补到校企业",
      saveHint: "保存日期、企业名、岗位或双选会名单",
      detail: "从日期和企业名判断每年到底谁来学校招聘。",
      query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 宣讲会 双选会 校园招聘 企业名单`,
    }),
    makeOfficialSiteRecipe({
      id: "site-job-salary",
      label: "站内查岗位薪资",
      target: "岗位薪资",
      evidenceKind: "salary",
      evidenceLabel: "补岗位薪资",
      saveHint: "保存岗位、城市、薪资区间和来源口径",
      detail: "把学校就业网线索和目标岗位分开核验，不把代理薪资当学校结论。",
      query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} ${safeJobName} 岗位 薪资 就业信息网`,
    }),
  ];
}

export function buildUnknownSchoolEntryPacketText({
  schoolName,
  majorName,
  jobName,
  officialDomain,
  entries,
}: UnknownSchoolEntryPacketTextInput) {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "待补专业";
  const safeJobName = jobName?.trim() || "待补岗位";
  const authorityEntrances = buildUnknownSchoolAuthorityEntrances({ schoolName, majorName, jobName });
  const officialSiteRecipes = buildUnknownSchoolOfficialSiteRecipes({ schoolName, majorName, jobName, officialDomain });
  const publicDocumentMatrix = buildUnknownSchoolPublicDocumentMatrix({ schoolName, majorName, jobName, officialDomain });
  const captureTemplates = publicDocumentMatrix.map(buildUnknownSchoolEvidenceCaptureTemplate);
  const sourceTasks = buildUnknownSchoolOfficialSourceTaskFlow({ schoolName, majorName, jobName, officialDomain });
  const lines = [
    `学校：${safeSchoolName}`,
    `专业：${safeMajorName}`,
    `岗位：${safeJobName}`,
    "",
    "核验顺序：",
    ...buildUnknownSchoolEvidenceGuide(entries).map((step) =>
      `${step.order}. ${step.title}：有效证据=${step.acceptedEvidence}；不要算=${step.rejectIf}；下一步=${step.nextAction}`,
    ),
    "",
    "普通学校证据任务流：",
    ...sourceTasks.map(
      (task) =>
        `${task.order}. ${task.label}：入口=${task.source}；目的=${task.purpose}；动作=${task.action}；保存字段=${task.saveFields.join(" / ")}\n${task.url}`,
    ),
    "",
    "官方公共库与就业入口：",
    ...authorityEntrances.map((entry, index) => `${index + 1}. ${entry.label}｜${entry.query}\n${entry.url}`),
    "",
    "证据采集模板：",
    ...captureTemplates.map(
      (template, index) =>
        `${index + 1}. ${template.label}：采集字段=${template.fields.join(" / ")}；原文必须包含=${template.requiredText}；不要算证据=${template.rejectIf}`,
    ),
    "",
    "公开入口查询包：",
    ...entries.map((entry, index) => `${index + 1}. ${entry.label}｜${entry.query}\n${entry.url}`),
    "",
    "官网站内追查口令：",
    ...officialSiteRecipes.map((recipe, index) => `${index + 1}. ${recipe.label}｜${recipe.query}\n${recipe.url}`),
  ];

  return lines.join("\n");
}

export function buildUnknownSchoolPublicEntranceDirectory({
  schoolName,
  majorName,
  jobName,
  officialDomain,
}: UnknownSchoolEntryPackInput): UnknownSchoolPublicEntranceDirectoryGroup[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() || "目标专业";
  const safeJobName = jobName?.trim() || "目标岗位";
  const normalizedDomain = normalizeUnknownSchoolOfficialDomain(officialDomain);
  const sitePrefix = normalizedDomain ? `site:${normalizedDomain}` : "site:学校官网域名";
  const entries = buildUnknownSchoolEntryPack({ schoolName, majorName, jobName });
  const authorityEntrances = buildUnknownSchoolAuthorityEntrances({ schoolName, majorName, jobName });
  const publicDocumentMatrix = buildUnknownSchoolPublicDocumentMatrix({ schoolName, majorName, jobName, officialDomain });
  const officialSiteRecipes = buildUnknownSchoolOfficialSiteRecipes({ schoolName, majorName, jobName, officialDomain });
  const findEntry = (id: UnknownSchoolEntryPackItem["id"]) => entries.find((entry) => entry.id === id);
  const findAuthority = (id: UnknownSchoolAuthorityEntrance["id"]) =>
    authorityEntrances.find((entry) => entry.id === id);
  const findMatrix = (id: UnknownSchoolPublicDocumentMatrixItem["id"]) =>
    publicDocumentMatrix.find((entry) => entry.id === id);
  const findRecipe = (id: UnknownSchoolOfficialSiteRecipe["id"]) =>
    officialSiteRecipes.find((entry) => entry.id === id);
  const officialTrust: UnknownSchoolPublicEntranceTrustLevel = normalizedDomain ? "official" : "search";

  return [
    {
      id: "official-identity",
      label: "学校主体入口",
      summary: "先确认学校真实存在、官网域名、招生网和信息公开入口。",
      primaryAction: "先打开阳光高考院校库，再用学校官网检索确认官方域名。",
      saveFields: ["学校全称", "官方网址", "招生网址", "办学层次"],
      entries: compactDirectoryEntries([
        makeDirectoryEntry({
          id: "chsi-school-identity",
          label: "阳光高考院校库",
          source: "阳光高考 / 学信网",
          detail: "教育部高校招生指定平台入口，用来确认学校主体和官网线索。",
          query: `${safeSchoolName} 院校库 官方网址 招生网址 site:gaokao.chsi.com.cn`,
          url: findAuthority("chsi-school")?.url,
          trustLevel: "authority",
        }),
        entryPackToDirectoryEntry(findEntry("school-official"), "search"),
        makeDirectoryEntry({
          id: "official-domain-site-search",
          label: "官网域名站内核验",
          source: normalizedDomain ? "学校官网站内检索" : "确认官网后替换域名",
          detail: "确认官网后，用站内检索找招生、学院、信息公开和就业入口。",
          query: `${sitePrefix} ${safeSchoolName} 招生网 信息公开 就业信息网`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} 招生网 信息公开 就业信息网`),
          trustLevel: officialTrust,
        }),
      ]),
    },
    {
      id: "major-material",
      label: "专业资料入口",
      summary: "专业名、学院归属、培养方案和核心课程通常在招生网、学院页或教务处公开。",
      primaryAction: "先查学校官网专业页，再用阳光高考专业库校准专业大类。",
      saveFields: getDirectorySaveFields(findMatrix("major-proof"), ["专业名", "学院", "核心课程", "培养方向"]),
      entries: compactDirectoryEntries([
        makeDirectoryEntry({
          id: "official-admissions-major",
          label: "招生网专业介绍",
          source: "学校招生网 / 招生简章",
          detail: "查招生专业、专业介绍、招生计划和校区，入口通常在学校招生网。",
          query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 招生计划 校区`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} ${safeMajorName} 招生专业 专业介绍 招生计划 校区`),
          trustLevel: officialTrust,
        }),
        makeDirectoryEntry({
          id: "official-teaching-plan",
          label: "教务处培养方案",
          source: "教务处 / 人才培养方案",
          detail: "查培养目标、课程体系、核心课程和实践环节，普通学校通常也会公开。",
          query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 教务处 人才培养方案 课程体系 核心课程`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} ${safeMajorName} 教务处 人才培养方案 课程体系 核心课程`),
          trustLevel: officialTrust,
        }),
        makeDirectoryEntry({
          id: "official-college-major-page",
          label: "二级学院专业页",
          source: "二级学院官网 / 专业建设",
          detail: "查专业归属、学院页面、专业建设和实训条件，适合验证专业不是聚合站编出来的。",
          query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 学院 专业介绍 专业建设 实训`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} ${safeMajorName} 学院 专业介绍 专业建设 实训`),
          trustLevel: officialTrust,
        }),
        makeDirectoryEntry({
          id: "official-info-major-catalog",
          label: "信息公开专业目录",
          source: "信息公开 / 专业设置",
          detail: "查学校信息公开、年度质量报告或专业设置公示，用来补充官方口径。",
          query: `${sitePrefix} ${safeSchoolName} ${safeMajorName} 信息公开 专业设置 专业目录 年度质量报告`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} ${safeMajorName} 信息公开 专业设置 专业目录 年度质量报告`),
          trustLevel: officialTrust,
        }),
        recipeToDirectoryEntry(findRecipe("site-major-catalog"), officialTrust),
        matrixToDirectoryEntry(findMatrix("major-proof"), officialTrust),
        recipeToDirectoryEntry(findRecipe("site-admissions"), officialTrust),
        authorityToDirectoryEntry(findAuthority("chsi-major"), "authority"),
      ]),
    },
    {
      id: "employment-outcome",
      label: "毕业去向入口",
      summary: "就业质量报告和信息公开页是就业率、升学率、行业流向的优先来源。",
      primaryAction: "找近两年就业质量报告，保存年份、比例和统计口径。",
      saveFields: getDirectorySaveFields(findMatrix("employment-report"), ["报告年份", "就业率", "升学率", "行业去向"]),
      entries: compactDirectoryEntries([
        recipeToDirectoryEntry(findRecipe("site-report"), officialTrust),
        matrixToDirectoryEntry(findMatrix("employment-report"), officialTrust),
        entryPackToDirectoryEntry(findEntry("report"), "search"),
        makeDirectoryEntry({
          id: "annual-quality-report-search",
          label: "年度质量报告补充",
          source: "学校信息公开 / 教育质量报告",
          detail: "有些学校把就业去向写在年度质量报告或信息公开年报里。",
          query: `${sitePrefix} ${safeSchoolName} 年度质量报告 就业率 升学率 毕业去向`,
          url: makeSearchUrl(`${sitePrefix} ${safeSchoolName} 年度质量报告 就业率 升学率 毕业去向`),
          trustLevel: officialTrust,
        }),
      ]),
    },
    {
      id: "campus-recruiting",
      label: "到校招聘入口",
      summary: "每年哪些企业来学校，要看就业信息网、宣讲会、双选会和公共校招平台。",
      primaryAction: "保存带日期的企业名单和岗位，不把合作 logo 墙当招聘证据。",
      saveFields: getDirectorySaveFields(findMatrix("campus-recruiting"), ["日期", "企业名", "岗位", "面向专业"]),
      entries: compactDirectoryEntries([
        recipeToDirectoryEntry(findRecipe("site-campus"), officialTrust),
        matrixToDirectoryEntry(findMatrix("campus-recruiting"), officialTrust),
        authorityToDirectoryEntry(findAuthority("ncss-campus"), "authority"),
        entryPackToDirectoryEntry(findEntry("employment"), "search"),
      ]),
    },
    {
      id: "salary-jobs",
      label: "岗位薪资入口",
      summary: "工资不要硬编，用企业官网、公共招聘和公开薪资口径做代理。",
      primaryAction: `用 ${safeMajorName} 和 ${safeJobName} 反查岗位、城市、薪资区间和来源日期。`,
      saveFields: getDirectorySaveFields(findMatrix("salary-crosscheck"), ["岗位", "城市", "薪资区间", "来源"]),
      entries: compactDirectoryEntries([
        authorityToDirectoryEntry(findAuthority("mohrss-public-jobs"), "authority"),
        authorityToDirectoryEntry(findAuthority("gov-employment-service"), "authority"),
        recipeToDirectoryEntry(findRecipe("site-job-salary"), officialTrust),
        matrixToDirectoryEntry(findMatrix("salary-crosscheck"), officialTrust),
        entryPackToDirectoryEntry(findEntry("salary"), "search"),
      ]),
    },
  ];
}

export function buildUnknownSchoolEntryPacketPreviewLines(packetText: string) {
  const lines = packetText.split("\n").map((line) => line.trim()).filter(Boolean);
  const headerLines = lines.slice(0, 3);
  const authoritySectionIndex = lines.indexOf("官方公共库与就业入口：");

  if (authoritySectionIndex === -1) return lines.slice(0, 8);

  const nextSectionIndex = lines.findIndex(
    (line, index) => index > authoritySectionIndex && /^公开入口查询包：|^官网站内追查口令：/.test(line),
  );
  const sectionEnd = nextSectionIndex === -1 ? lines.length : nextSectionIndex;
  const authorityPreviewLines = lines
    .slice(authoritySectionIndex, sectionEnd)
    .filter((line, index) => index === 0 || /^\d+\./.test(line));

  return [...headerLines, ...authorityPreviewLines].slice(0, 12);
}

export function buildUnknownSchoolEvidenceGuide(entries: UnknownSchoolEntryPackItem[]): UnknownSchoolEvidenceGuideStep[] {
  const pickEntryId = (category: UnknownSchoolEntryCategory) =>
    entries.find((entry) => entry.category === category)?.id ?? entries[0]?.id ?? "school-official";

  return [
    {
      id: "official-domain",
      order: 1,
      entryId: pickEntryId("school-official"),
      title: "先确认官方域名",
      acceptedEvidence: "学校官网、招生网或信息公开栏目能相互跳转，页面主体是学校发布",
      rejectIf: "只看到百科、广告聚合页、培训机构软文或无法确认主办单位",
      nextAction: "记录官网域名，再从站内找招生、教务、就业和信息公开入口",
    },
    {
      id: "major-exists",
      order: 2,
      entryId: pickEntryId("major-catalog"),
      title: "确认专业真实开设",
      acceptedEvidence: "招生专业、专业设置、培养方案或学院专业页出现同一个专业名",
      rejectIf: "只有短视频、论坛帖子、分数线聚合页，或专业名称和学校官网不一致",
      nextAction: "保存专业页标题、学院名称、核心课程和培养方向",
    },
    {
      id: "employment-report",
      order: 3,
      entryId: pickEntryId("report"),
      title: "找近两年就业报告",
      acceptedEvidence: "就业质量报告、信息公开或年度质量报告含就业率、行业流向、升学比例",
      rejectIf: "只写就业前景好、校企合作多，但没有年份、比例或报告来源",
      nextAction: "把就业率、主要行业、升学比例和样本年份记入查询包",
    },
    {
      id: "campus-employers",
      order: 4,
      entryId: pickEntryId("campus"),
      title: "核对到校招聘企业",
      acceptedEvidence: "就业信息网、宣讲会、双选会或招聘公告出现企业名称和日期",
      rejectIf: "只看到合作单位 logo 墙，没有招聘日期、岗位或宣讲记录",
      nextAction: "挑 3 到 5 家企业回到公司官网查岗位和要求",
    },
    {
      id: "salary-proxy",
      order: 5,
      entryId: pickEntryId("salary"),
      title: "最后看岗位薪资代理",
      acceptedEvidence: "公司官网岗位、校招公告、公开薪资或本项目市场代理能对应专业方向",
      rejectIf: "只拿平均薪资营销文案，或把城市/行业高薪直接当成本校毕业薪资",
      nextAction: "把岗位、城市、薪资区间和来源分开记录，不把代理当学校官方结论",
    },
  ];
}

function makeEntry({
  id,
  label,
  category,
  source,
  detail,
  query,
  engine,
}: Omit<UnknownSchoolEntryPackItem, "url"> & { engine: "baidu" | "bing" }): UnknownSchoolEntryPackItem {
  return {
    id,
    label,
    category,
    source,
    detail,
    query,
    url: engine === "baidu"
      ? `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`
      : `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  };
}

function makePublicDocumentMatrixItem({
  query,
  siteQuery,
  ...item
}: Omit<UnknownSchoolPublicDocumentMatrixItem, "url" | "siteUrl">): UnknownSchoolPublicDocumentMatrixItem {
  return {
    ...item,
    query,
    siteQuery,
    url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    siteUrl: `https://www.bing.com/search?q=${encodeURIComponent(siteQuery)}`,
  };
}

function makeOfficialSiteRecipe({
  id,
  label,
  target,
  evidenceKind,
  evidenceLabel,
  saveHint,
  detail,
  query,
}: Omit<UnknownSchoolOfficialSiteRecipe, "url">): UnknownSchoolOfficialSiteRecipe {
  return {
    id,
    label,
    target,
    evidenceKind,
    evidenceLabel,
    saveHint,
    detail,
    query,
    url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  };
}

function makeSearchUrl(query: string) {
  return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
}

function makeDirectoryEntry({
  id,
  label,
  source,
  detail,
  query,
  url,
  trustLevel,
}: {
  id: string;
  label: string;
  source: string;
  detail: string;
  query: string;
  url?: string;
  trustLevel: UnknownSchoolPublicEntranceTrustLevel;
}): UnknownSchoolPublicEntranceDirectoryEntry | null {
  if (!url) return null;

  return {
    id,
    label,
    source,
    detail,
    query,
    url,
    trustLevel,
  };
}

function compactDirectoryEntries(
  entries: Array<UnknownSchoolPublicEntranceDirectoryEntry | null | undefined>,
): UnknownSchoolPublicEntranceDirectoryEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry): entry is UnknownSchoolPublicEntranceDirectoryEntry => {
    if (!entry) return false;
    const key = `${entry.id}-${entry.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function authorityToDirectoryEntry(
  entry: UnknownSchoolAuthorityEntrance | undefined,
  trustLevel: UnknownSchoolPublicEntranceTrustLevel,
) {
  if (!entry) return null;
  return makeDirectoryEntry({
    id: `authority-${entry.id}`,
    label: entry.label,
    source: entry.source,
    detail: entry.detail,
    query: entry.query,
    url: entry.url,
    trustLevel,
  });
}

function entryPackToDirectoryEntry(
  entry: UnknownSchoolEntryPackItem | undefined,
  trustLevel: UnknownSchoolPublicEntranceTrustLevel,
) {
  if (!entry) return null;
  return makeDirectoryEntry({
    id: `search-${entry.id}`,
    label: entry.label,
    source: entry.source,
    detail: entry.detail,
    query: entry.query,
    url: entry.url,
    trustLevel,
  });
}

function matrixToDirectoryEntry(
  item: UnknownSchoolPublicDocumentMatrixItem | undefined,
  trustLevel: UnknownSchoolPublicEntranceTrustLevel,
) {
  if (!item) return null;
  return makeDirectoryEntry({
    id: `matrix-${item.id}`,
    label: item.label,
    source: item.source,
    detail: item.openHint,
    query: item.siteQuery,
    url: item.siteUrl,
    trustLevel,
  });
}

function recipeToDirectoryEntry(
  recipe: UnknownSchoolOfficialSiteRecipe | undefined,
  trustLevel: UnknownSchoolPublicEntranceTrustLevel,
) {
  if (!recipe) return null;
  return makeDirectoryEntry({
    id: `recipe-${recipe.id}`,
    label: recipe.label,
    source: recipe.target,
    detail: recipe.detail,
    query: recipe.query,
    url: recipe.url,
    trustLevel,
  });
}

function getDirectorySaveFields(item: UnknownSchoolPublicDocumentMatrixItem | undefined, fallback: string[]) {
  return item?.saveFields.length ? item.saveFields : fallback;
}

export function extractUnknownSchoolOfficialDomain(officialDomain?: string | null) {
  const trimmed = officialDomain?.trim();
  if (!trimmed) return "";

  const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>，。；;、)）]+/i);
  const domainMatch = trimmed.match(/(?:www\.)?[a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+\b/i);
  if (!urlMatch && !domainMatch) return "";

  const candidate = (urlMatch?.[0] ?? domainMatch?.[0] ?? trimmed).replace(/[，。；;、)）]+$/g, "");
  let host = candidate;

  try {
    host = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`).hostname;
  } catch {
    host = candidate.replace(/^https?:\/\//i, "").split(/[/?#]/)[0];
  }

  const normalized = host
    .toLowerCase()
    .replace(/^www\./i, "")
    .replace(/:\d+$/, "")
    .replace(/\/+$/, "");
  return /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(normalized) ? normalized : "";
}

function normalizeUnknownSchoolOfficialDomain(officialDomain?: string | null) {
  return extractUnknownSchoolOfficialDomain(officialDomain);
}

function getUnknownSchoolEvidenceKindForCategory(category?: UnknownSchoolEntryCategory): UnknownSchoolEvidenceKind {
  if (category === "report") return "report";
  if (category === "campus" || category === "employment") return "campus";
  if (category === "salary") return "salary";
  return "major";
}

function getUnknownSchoolEvidenceCaptureBase(kind: UnknownSchoolEvidenceKind) {
  if (kind === "report") {
    return {
      fields: ["报告年份", "毕业去向落实率/就业率", "升学率", "主要行业去向", "样本口径"],
      requiredText: "就业质量报告、信息公开页或年度报告原文里出现年份、比例和统计口径",
      rejectIf: "只有就业前景宣传、升学喜报或没有年份和比例的软文",
    };
  }

  if (kind === "campus") {
    return {
      fields: ["日期", "招聘活动/场次", "企业名", "岗位", "面向专业"],
      requiredText: "就业信息网、宣讲会、双选会或公共就业平台原文里出现企业、活动或岗位",
      rejectIf: "只有公共平台入口、合作 logo 墙、校企合作新闻或没有招聘日期的名单",
    };
  }

  if (kind === "salary") {
    return {
      fields: ["岗位名", "城市/地区", "薪资区间", "学历/经验要求", "来源日期"],
      requiredText: "公司官网、校招公告或公共招聘页出现岗位名、城市和薪资/待遇口径",
      rejectIf: "只有行业平均薪资、营销软文、无城市岗位的高薪榜或第三方猜测",
    };
  }

  return {
    fields: ["专业名", "学院/系部", "层次/学制", "招生年份", "核心课程/培养方向"],
    requiredText: "学校或学院官方页面出现专业名、学院归属、招生/培养/课程信息",
    rejectIf: "只有百科、广告页、聚合页、论坛帖子或无法确认学校主体的内容",
  };
}

function mergeCaptureFields(primaryFields: string[], fallbackFields: string[]) {
  const merged = [...primaryFields, ...fallbackFields].map((field) => field.trim()).filter(Boolean);
  return Array.from(new Set(merged));
}
