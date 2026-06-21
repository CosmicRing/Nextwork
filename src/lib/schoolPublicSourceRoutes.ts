export type SchoolPublicSourceRouteTrustLevel = "authority" | "official" | "proxy";

export type SchoolPublicSourceRoute = {
  id:
    | "chsi-school-library"
    | "school-admissions-major"
    | "school-major-plan"
    | "chsi-major-library"
    | "school-employment-report"
    | "school-career-center"
    | "job-salary-proxy";
  label: string;
  authority: "教育部/学信网" | "学校官网" | "公开搜索" | "企业官网/薪资代理";
  trustLevel: SchoolPublicSourceRouteTrustLevel;
  target: string;
  query: string;
  url: string;
  openHint: string;
  saveFields: string[];
};

type BuildSchoolPublicSourceRoutesInput = {
  schoolName: string;
  majorName?: string | null;
  jobName?: string | null;
};

export function buildSchoolPublicSourceRoutes({
  schoolName,
  majorName,
  jobName,
}: BuildSchoolPublicSourceRoutesInput): SchoolPublicSourceRoute[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() ?? "";
  const safeJobName = jobName?.trim() ?? "";
  const majorClause = safeMajorName ? ` ${safeMajorName}` : "";
  const jobClause = safeJobName ? ` ${safeJobName}` : "";

  return [
    {
      id: "chsi-school-library",
      label: "阳光高考院校库",
      authority: "教育部/学信网",
      trustLevel: "authority",
      target: "先确认学校、官网和招生入口是不是正规口径",
      query: `${safeSchoolName} 院校信息库 官方网址 招生网址 site:gaokao.chsi.com.cn`,
      url: "https://gaokao.chsi.com.cn/sch/",
      openHint: "进入院校库后搜学校名，先保存官方主页、招生网址、招生章程和院校类型。",
      saveFields: ["学校全称", "官方网址", "招生网址", "办学层次"],
    },
    {
      id: "school-admissions-major",
      label: "学校招生网专业页",
      authority: "学校官网",
      trustLevel: "official",
      target: "确认这个专业今年是否招生、在哪个校区、面向哪个层次",
      query: `${safeSchoolName}${majorClause} 招生网 招生专业 专业介绍 招生计划 官网`,
      url: makeBaiduUrl(`${safeSchoolName}${majorClause} 招生网 招生专业 专业介绍 招生计划 官网`),
      openHint: "优先点学校招生网，不点广告聚合页；保存专业名称、招生年份、校区和计划口径。",
      saveFields: ["专业名称", "招生年份", "校区", "招生计划"],
    },
    {
      id: "school-major-plan",
      label: "培养方案 / 专业设置",
      authority: "学校官网",
      trustLevel: "official",
      target: "确认这个专业到底学什么，能不能对上目标岗位",
      query: `${safeSchoolName}${majorClause} 官网 学院 人才培养方案 专业设置 核心课程`,
      url: makeBingUrl(`${safeSchoolName}${majorClause} 官网 学院 人才培养方案 专业设置 核心课程`),
      openHint: "找教务处、本科生院或学院页面；保存核心课程、实践环节和培养方向。",
      saveFields: ["核心课程", "实践环节", "培养方向", "所属学院"],
    },
    {
      id: "chsi-major-library",
      label: "阳光高考专业知识库",
      authority: "教育部/学信网",
      trustLevel: "authority",
      target: "用全国专业口径校准专业名称、课程、就业方向和开设院校",
      query: `${safeMajorName || "目标专业"} 专业知识库 本科专业 高职专业 开设院校 就业方向`,
      url: "https://gaokao.chsi.com.cn/zyk/zybk/",
      openHint: "先用专业知识库确认专业大类、主要课程和开设院校，再回到学校官网核对本校版本。",
      saveFields: ["专业大类", "主要课程", "就业方向", "开设院校"],
    },
    {
      id: "school-employment-report",
      label: "就业质量报告",
      authority: "学校官网",
      trustLevel: "official",
      target: "找就业率、升学率、行业去向和签约单位",
      query: `${safeSchoolName}${majorClause} 2025 2024 毕业生就业质量报告 PDF 就业率 升学率 信息公开`,
      url: makeBingUrl(`${safeSchoolName}${majorClause} 2025 2024 毕业生就业质量报告 PDF 就业率 升学率 信息公开`),
      openHint: "优先找近两年 PDF、信息公开页或就业网发布页；保存年份和统计口径。",
      saveFields: ["报告年份", "就业率", "升学率", "行业去向"],
    },
    {
      id: "school-career-center",
      label: "就业信息网 / 宣讲会",
      authority: "学校官网",
      trustLevel: "official",
      target: "看每年哪些企业真的到校招聘，以及招聘什么岗位",
      query: `${safeSchoolName}${majorClause}${jobClause} 就业信息网 宣讲会 双选会 校园招聘 企业 名单`,
      url: makeBaiduUrl(`${safeSchoolName}${majorClause}${jobClause} 就业信息网 宣讲会 双选会 校园招聘 企业 名单`),
      openHint: "打开就业信息网、宣讲会或双选会日历；保存日期、企业名、岗位和面向专业。",
      saveFields: ["招聘年份", "企业名称", "岗位名称", "面向专业"],
    },
    {
      id: "job-salary-proxy",
      label: "岗位薪资代理",
      authority: "企业官网/薪资代理",
      trustLevel: "proxy",
      target: "用企业官网岗位和公开薪资口径估计方向，不冒充学校官方薪资",
      query: `${safeSchoolName}${majorClause}${jobClause} 校招 岗位 薪资 官方招聘`,
      url: makeBingUrl(`${safeSchoolName}${majorClause}${jobClause} 校招 岗位 薪资 官方招聘`),
      openHint: "最后再看岗位和薪资；这不是学校官方结论，只能作为专业方向和城市薪资的代理。",
      saveFields: ["岗位名称", "城市", "薪资区间", "来源口径"],
    },
  ];
}

function makeBaiduUrl(query: string) {
  return `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
}

function makeBingUrl(query: string) {
  return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
}
