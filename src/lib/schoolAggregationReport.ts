import { formatMonthlyRange, majorSalaryProfiles } from "../data/majorMarket";
import { getRecruiterSources, type SchoolOutcomeProfile } from "../data/schoolOutcomes";

export type SchoolAggregationReport = {
  schoolName: string;
  headline: string;
  sourceRows: SchoolAggregationSourceRow[];
  majorRows: SchoolAggregationMajorRow[];
  recruitingRows: SchoolAggregationRecruitingRow[];
  salaryRows: SchoolAggregationSalaryRow[];
  copyText: string;
};

export type SchoolAggregationSourceRow = {
  label: string;
  source: string;
  url: string;
  note: string;
};

export type SchoolAggregationMajorRow = {
  majorName: string;
  cluster: string;
  destinations: string;
  employmentLabel: string;
  salaryLabel: string;
  evidence: string;
};

export type SchoolAggregationRecruitingRow = {
  title: string;
  date: string;
  category: string;
  venue: string;
  sourceUrl: string;
};

export type SchoolAggregationSalaryRow = {
  majorName: string;
  salaryLabel: string;
  source: string;
  companyHints: string[];
};

export function buildSchoolAggregationReport(school: SchoolOutcomeProfile): SchoolAggregationReport {
  const sourceRows = buildSourceRows(school);
  const recruitingRows = school.campusRecruitingYears
    .flatMap((year) => year.events ?? [])
    .map((event) => ({
      title: event.title,
      date: event.date,
      category: event.category,
      venue: event.venue,
      sourceUrl: event.url,
    }))
    .slice(0, 12);
  const majorRows = school.majors.map((major) => ({
    majorName: major.name,
    cluster: major.cluster,
    destinations: major.destinations.join(" / "),
    employmentLabel: major.employmentRate.label,
    salaryLabel: getMajorSalaryLabel(major),
    evidence: major.employmentRate.source,
  }));
  const salaryRows = school.majors.map((major) => ({
    majorName: major.name,
    salaryLabel: getMajorSalaryLabel(major),
    source: major.averageSalary.source,
    companyHints: getRecruiterSources(major).map((source) => source.name).slice(0, 5),
  }));
  const headline = `${school.name}：已聚合学校官网、就业创业信息网、双选会列表、生源速览和岗位薪资代理。`;
  const copyText = buildReportCopyText({
    school,
    sourceRows,
    recruitingRows,
    majorRows,
    salaryRows,
  });

  return {
    schoolName: school.name,
    headline,
    sourceRows,
    majorRows,
    recruitingRows,
    salaryRows,
    copyText,
  };
}

function buildSourceRows(school: SchoolOutcomeProfile): SchoolAggregationSourceRow[] {
  return [
    ...school.officialLinks.map((link) => ({
      label: link.label,
      source: getLinkKindLabel(link.kind),
      url: link.url,
      note: link.note,
    })),
    ...school.evidenceSources.map((source) => ({
      label: source.title,
      source: source.sourceName,
      url: source.url,
      note: source.metrics.map((metric) => `${metric.label} ${metric.value}`).join("；"),
    })),
  ].slice(0, 12);
}

function getMajorSalaryLabel(major: SchoolOutcomeProfile["majors"][number]) {
  if (major.averageSalary.label.includes("/月")) return major.averageSalary.label;
  const profile = majorSalaryProfiles.find((candidate) =>
    [candidate.group, ...candidate.majors, ...candidate.roles].some((term) =>
      `${major.name} ${major.cluster} ${major.destinations.join(" ")}`.includes(term),
    ),
  );
  return profile ? formatMonthlyRange(profile.starterMonthlyK) : "5-15K/月";
}

function getLinkKindLabel(kind: SchoolOutcomeProfile["officialLinks"][number]["kind"]) {
  if (kind === "school") return "学校官网";
  if (kind === "admissions") return "招生入口";
  if (kind === "major-catalog") return "专业入口";
  if (kind === "employment") return "就业入口";
  return "报告/生源入口";
}

function buildReportCopyText({
  school,
  sourceRows,
  recruitingRows,
  majorRows,
  salaryRows,
}: {
  school: SchoolOutcomeProfile;
  sourceRows: SchoolAggregationSourceRow[];
  recruitingRows: SchoolAggregationRecruitingRow[];
  majorRows: SchoolAggregationMajorRow[];
  salaryRows: SchoolAggregationSalaryRow[];
}) {
  return [
    `专业就业聚合报告：${school.name}`,
    `城市：${school.city}`,
    `结论：${school.dataNote}`,
    "",
    "专业就业：",
    ...majorRows.map((row) => `- ${row.majorName}：${row.destinations}；就业率 ${row.employmentLabel}；薪资 ${row.salaryLabel}`),
    "",
    "招聘会常见行业：",
    ...recruitingRows.map((row) => `- ${row.date} ${row.category}：${row.title}｜${row.venue}`),
    "",
    "薪资情况：",
    ...salaryRows.map((row) => `- ${row.majorName}：${row.salaryLabel}｜企业核验入口：${row.companyHints.join(" / ") || "待补企业官网"}`),
    "",
    "来源入口：",
    ...sourceRows.map((row) => `- ${row.source}：${row.label}｜${row.url}`),
    "",
    "提示：薪资为岗位市场参考，不是学校官方承诺；到校公司必须回就业网双选会/宣讲会详情页核验。",
  ].join("\n");
}
