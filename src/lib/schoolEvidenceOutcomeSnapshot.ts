import { getSchoolEvidencePacketTrustLevel } from "./schoolEvidencePacket";

export type SchoolEvidenceOutcomeSnapshotItem = {
  kind: string;
  title: string;
  detail: string;
  url: string;
};

export type SchoolEvidenceOutcomeSnapshotCard = {
  label: string;
  value: string;
  detail: string;
  items: string[];
};

export type SchoolEvidenceOutcomeSnapshot = {
  major: SchoolEvidenceOutcomeSnapshotCard;
  employment: SchoolEvidenceOutcomeSnapshotCard;
  recruiters: SchoolEvidenceOutcomeSnapshotCard;
  salary: SchoolEvidenceOutcomeSnapshotCard;
  warnings: string[];
  copyText: string;
};

const emptyCard = (label: string, detail: string): SchoolEvidenceOutcomeSnapshotCard => ({
  label,
  value: "待补",
  detail,
  items: [],
});

export function buildSchoolEvidenceOutcomeSnapshot(
  items: SchoolEvidenceOutcomeSnapshotItem[],
): SchoolEvidenceOutcomeSnapshot {
  const trustedItems = items.filter((item) => getSchoolEvidencePacketTrustLevel(item) !== "weak");
  const weakCount = items.length - trustedItems.length;
  const majorItem = pickFirstEvidence(trustedItems, "major") ?? pickFirstEvidence(items, "major");
  const reportItems = trustedItems.filter((item) => item.kind === "report");
  const campusItems = trustedItems.filter((item) => item.kind === "campus");
  const salaryItems = trustedItems.filter((item) => item.kind === "salary");
  const metrics = reportItems.flatMap((item) => extractOutcomeMetrics(`${item.title} ${item.detail}`));
  const employmentMetric =
    metrics.find((metric) => /就业|去向/.test(metric.label)) ?? metrics.find((metric) => metric.label !== "升学率");
  const advancedMetric = metrics.find((metric) => /升学|考研|专升本/.test(metric.label));
  const companies = dedupe(campusItems.flatMap((item) => extractRecruiterNames(`${item.title} ${item.detail}`))).slice(0, 8);
  const salaryRanges = dedupe(salaryItems.flatMap((item) => extractSalaryRanges(`${item.title} ${item.detail}`))).slice(0, 4);
  const warnings = buildOutcomeWarnings(items.length, weakCount, {
    hasMajor: Boolean(majorItem),
    hasEmployment: Boolean(employmentMetric),
    hasRecruiters: companies.length > 0,
    hasSalary: salaryRanges.length > 0,
  });
  const major = majorItem
    ? {
        label: "专业证明",
        value: majorItem.title,
        detail: truncateText(majorItem.detail || majorItem.url || "已保存专业相关证据。", 86),
        items: [majorItem.url].filter(Boolean),
      }
    : emptyCard("专业证明", "先保存学校官网、招生网、学院页或培养方案里的专业证据。");
  const employment = employmentMetric
    ? {
        label: "毕业去向",
        value: employmentMetric.value,
        detail: [
          `${employmentMetric.label}${employmentMetric.value}`,
          advancedMetric ? `${advancedMetric.label}${advancedMetric.value}` : "",
        ]
          .filter(Boolean)
          .join(" · "),
        items: metrics.map((metric) => `${metric.label}${metric.value}`).slice(0, 4),
      }
    : emptyCard("毕业去向", "先保存就业质量报告里的就业率、升学率、行业去向或重点单位。");
  const recruiters = companies.length
    ? {
        label: "到校企业",
        value: `${companies.length} 家`,
        detail: companies.slice(0, 4).join(" / "),
        items: companies,
      }
    : emptyCard("到校企业", "先保存就业信息网、宣讲会、双选会或招聘会里的企业名单。");
  const salary = salaryRanges.length
    ? {
        label: "工资线索",
        value: salaryRanges.join(" / "),
        detail: "来自企业官网岗位或已复核薪资口径，不直接等同于本校平均工资。",
        items: salaryRanges,
      }
    : emptyCard("工资线索", "先保存企业官网岗位、校招公告或可复核薪资区间。");
  const copyText = [
    "自存证据读数",
    `专业证明：${major.value}`,
    `毕业去向落实率：${employment.value}`,
    advancedMetric ? `${advancedMetric.label}：${advancedMetric.value}` : "",
    `到校企业：${recruiters.items.length ? recruiters.items.slice(0, 6).join(" / ") : recruiters.value}`,
    `薪资线索：${salary.value}`,
    warnings.length ? `提醒：${warnings.join("；")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    major,
    employment,
    recruiters,
    salary,
    warnings,
    copyText,
  };
}

function pickFirstEvidence(items: SchoolEvidenceOutcomeSnapshotItem[], kind: string) {
  return items.find((item) => item.kind === kind);
}

function extractOutcomeMetrics(text: string) {
  const labels = ["毕业去向落实率", "去向落实率", "就业率", "升学率", "考研率", "专升本率", "签约率", "对口就业率"];
  return dedupeBy(
    labels.flatMap((label) => {
      const pattern = new RegExp(`${label}[^0-9%]{0,12}(\\d+(?:\\.\\d+)?%)`, "g");
      return Array.from(text.matchAll(pattern)).map((match) => ({ label, value: match[1] }));
    }),
    (metric) => `${metric.label}-${metric.value}`,
  );
}

function extractRecruiterNames(text: string) {
  const namesFromSegments = Array.from(
    text.matchAll(/(?:到校企业|参会企业|企业名单|重点单位|企业|单位)[:：]?([^。；;\n]+)/g),
  ).flatMap((match) => splitCompanySegment(match[1]));
  const namesFromSuffix = Array.from(
    text.matchAll(/[\u4e00-\u9fa5A-Za-z0-9（）()·]{2,24}(?:医院|集团|银行|公司|事务所|物流|科技|学校|中心)/g),
  ).map((match) => trimCompanyName(match[0]));

  return dedupe([...namesFromSegments, ...namesFromSuffix]).filter((name) => {
    if (name.length < 2) return false;
    return !/学校|学院|专业|报告|岗位|就业|源|名单|包含|到校企业|参会企业|平台|专场|招聘会|双选会|服务平台/.test(name);
  });
}

function splitCompanySegment(segment: string) {
  const cleanSegment = segment.split(/岗位|职位|面向|包含|提供/)[0] ?? segment;
  return cleanSegment.split(/[、,，/／;；\s]+/).map(trimCompanyName).filter(Boolean);
}

function extractSalaryRanges(text: string) {
  const ranges = [
    ...Array.from(text.matchAll(/\d+(?:\.\d+)?\s*[-~至]\s*\d+(?:\.\d+)?\s*K(?:\/月|每月|月薪)?/gi)).map((match) =>
      normalizeSalaryRange(match[0]),
    ),
    ...Array.from(text.matchAll(/\d{4,6}\s*[-~至]\s*\d{4,6}\s*元?(?:\/月|每月|月薪)?/g)).map((match) =>
      normalizeSalaryRange(match[0]),
    ),
  ];

  return dedupe(ranges);
}

function normalizeSalaryRange(value: string) {
  return value.replace(/\s+/g, "").replace(/[~至]/g, "-").replace(/\/月|每月|月薪/g, "");
}

function buildOutcomeWarnings(
  totalCount: number,
  weakCount: number,
  coverage: { hasMajor: boolean; hasEmployment: boolean; hasRecruiters: boolean; hasSalary: boolean },
) {
  const warnings: string[] = [];
  if (!totalCount) warnings.push("先收专业、就业报告、到校企业、工资四类证据，读数板才会有结论");
  if (weakCount) warnings.push(`弱证据 ${weakCount} 条只作线索，不进入读数`);
  if (!coverage.hasEmployment) warnings.push("缺就业率或升学率");
  if (!coverage.hasRecruiters) warnings.push("缺到校企业名单");
  if (!coverage.hasSalary) warnings.push("缺工资区间");
  if (!coverage.hasMajor) warnings.push("缺专业开设证明");
  return warnings;
}

function trimCompanyName(value: string) {
  return value.replace(/^[：:，,、；;\s]+|[：:，,、；;\s]+$/g, "");
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

function dedupe(items: string[]) {
  return dedupeBy(items, (item) => item);
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
