type OfficialLinkLike = {
  label: string;
  url: string;
  kind: "major-catalog" | "admissions" | "employment" | "report" | "school";
  note: string;
};

type CampusRecruitingYearLike = {
  year: number;
  status: "verified" | "pending";
  source: string;
  companies: string[];
};

type CompanySourceLike = {
  id: string;
  name: string;
  careerUrl: string;
};

export type SchoolCampusRecruitingLead = {
  label: string;
  type: "direct" | "search" | "report" | "company";
  source: string;
  detail: string;
  url: string;
  query?: string;
};

export function buildSchoolCampusRecruitingLeads({
  schoolName,
  majorName,
  jobName,
  officialLinks,
  campusRecruitingYears,
  companySources,
}: {
  schoolName: string;
  majorName?: string;
  jobName?: string;
  officialLinks: OfficialLinkLike[];
  campusRecruitingYears: CampusRecruitingYearLike[];
  companySources: CompanySourceLike[];
}): SchoolCampusRecruitingLead[] {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName?.trim() ?? "";
  const safeJobName = jobName?.trim() ?? "";
  const employmentLink = officialLinks.find((link) => link.kind === "employment");
  const reportLink = officialLinks.find((link) => link.kind === "report");
  const latestVerifiedYear = campusRecruitingYears
    .filter((year) => year.status === "verified")
    .sort((left, right) => right.year - left.year)[0];
  const firstCompanies = latestVerifiedYear?.companies.slice(0, 4) ?? [];
  const searchContext = [safeSchoolName, safeMajorName, safeJobName].filter(Boolean).join(" ");
  const companyNames = Array.from(new Set(companySources.map((company) => company.name))).slice(0, 4);
  const leads: SchoolCampusRecruitingLead[] = [
    employmentLink
      ? {
        label: "就业网校招入口",
        type: "direct",
        source: employmentLink.label,
        detail: "先看宣讲会、双选会、招聘公告和用人单位服务入口。",
        url: employmentLink.url,
      }
      : makeSearchLead(
        "就业网校招入口",
        `${searchContext} 就业信息网 宣讲会 双选会`,
        "搜索学校就业网、宣讲会和双选会入口。",
      ),
    makeSearchLead(
      "双选会企业名单",
      `${searchContext} 双选会 企业 名单 招聘会`,
      "找近两年双选会公告，看具体到校企业。",
    ),
    reportLink
      ? {
        label: "就业报告签约单位",
        type: "report",
        source: reportLink.label,
        detail: "从就业报告或信息公开页核对签约单位、行业流向和就业率。",
        url: reportLink.url,
        query: `${safeSchoolName} 就业质量报告 签约单位`,
      }
      : makeSearchLead(
        "就业报告签约单位",
        `${safeSchoolName} ${new Date().getFullYear() - 1} ${new Date().getFullYear() - 2} 就业质量报告 签约单位 重点企业`,
        "找就业质量报告里的签约单位或重点就业单位。",
      ),
    makeSearchLead(
      "按专业查宣讲会",
      `${searchContext} 宣讲会 招聘 专业`,
      "把专业和岗位一起搜，过滤掉无关行业。",
    ),
  ];

  if (companySources.length > 0) {
    leads.push({
      label: "企业官网补充",
      type: "company",
      source: companyNames.join(" / "),
      detail: "这些是岗位市场补充入口，不等于已到校；需要再回学校就业网交叉核验。",
      url: companySources[0].careerUrl,
      query: [safeSchoolName, safeMajorName, ...companyNames].filter(Boolean).join(" "),
    });
  } else if (firstCompanies.length > 0) {
    leads.push(
      makeSearchLead(
        "已核企业反查",
        `${safeSchoolName} ${firstCompanies.join(" ")} 校园招聘`,
        "从已核签约/到校企业继续反查校招岗位。",
      ),
    );
  }

  return leads.slice(0, 5);
}

function makeSearchLead(label: string, query: string, detail: string): SchoolCampusRecruitingLead {
  return {
    label,
    type: "search",
    source: "Bing · 公开检索",
    detail,
    url: `https://www.bing.com/search?q=${encodeURIComponent(query.replace(/\s+/g, " ").trim())}`,
    query,
  };
}
