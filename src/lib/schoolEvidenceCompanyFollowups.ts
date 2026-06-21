import { officialCompanySources } from "../data/officialSources";
import { getCompanyLogoSources } from "./companyLogos";
import { getSchoolEvidencePacketTrustLevel } from "./schoolEvidencePacket";

export type SchoolEvidenceCompanyFollowupItem = {
  kind: string;
  title: string;
  detail: string;
  url: string;
};

export type SchoolEvidenceCompanyFollowup = {
  name: string;
  type: "known-official" | "search-lead";
  officialSourceId?: string;
  sourceDomain: string;
  primaryUrl: string;
  officialSearchUrl: string;
  jobSearchUrl: string;
  salarySearchUrl: string;
  evidenceTitle: string;
  logoSources: string[];
};

export function buildSchoolEvidenceCompanyFollowups({
  majorName,
  jobName,
  items,
  limit = 8,
}: {
  majorName: string;
  jobName: string;
  items: SchoolEvidenceCompanyFollowupItem[];
  limit?: number;
}): SchoolEvidenceCompanyFollowup[] {
  const safeMajorName = majorName.trim();
  const safeJobName = jobName.trim();
  const campusItems = items.filter((item) => item.kind === "campus" && getSchoolEvidencePacketTrustLevel(item) !== "weak");
  const companyRows = campusItems.flatMap((item) =>
    extractRecruiterNames(`${item.title} ${item.detail}`).map((name) => ({
      name,
      evidenceTitle: item.title,
    })),
  );

  return dedupeBy(companyRows, (row) => normalizeCompanyName(row.name))
    .slice(0, limit)
    .map((row) => buildCompanyFollowup(row.name, row.evidenceTitle, safeMajorName, safeJobName));
}

function buildCompanyFollowup(
  name: string,
  evidenceTitle: string,
  majorName: string,
  jobName: string,
): SchoolEvidenceCompanyFollowup {
  const officialSource = officialCompanySources.find((source) => areCompanyNamesRelated(source.name, name));
  const roleQuery = jobName || majorName || "校招";

  if (officialSource) {
    return {
      name,
      type: "known-official",
      officialSourceId: officialSource.id,
      sourceDomain: officialSource.domain,
      primaryUrl: officialSource.careerUrl,
      officialSearchUrl: officialSource.careerUrl,
      jobSearchUrl: makeBingUrl(`${officialSource.name} ${roleQuery} 招聘 校招`),
      salarySearchUrl: makeBingUrl(`${officialSource.name} ${roleQuery} 薪资 工资 校招`),
      evidenceTitle,
      logoSources: getCompanyLogoSources(officialSource.id, officialSource.domain),
    };
  }

  const officialSearchQuery = `${name} 官网 招聘`;
  const jobSearchQuery = `${name} ${roleQuery} 招聘`;
  const salarySearchQuery = `${name} ${roleQuery} 薪资 工资`;

  return {
    name,
    type: "search-lead",
    sourceDomain: "",
    primaryUrl: makeBingUrl(officialSearchQuery),
    officialSearchUrl: makeBingUrl(officialSearchQuery),
    jobSearchUrl: makeBingUrl(jobSearchQuery),
    salarySearchUrl: makeBingUrl(salarySearchQuery),
    evidenceTitle,
    logoSources: [
      `https://icons.duckduckgo.com/ip3/${encodeURIComponent(name)}.ico`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(name)}&sz=128`,
    ],
  };
}

function extractRecruiterNames(text: string) {
  const namesFromSegments = Array.from(
    text.matchAll(/(?:到校企业|参会企业|企业名单|重点单位|企业|单位)[:：]?([^。；;\n]+)/g),
  ).flatMap((match) => splitCompanySegment(match[1]));
  const namesFromSuffix = Array.from(
    text.matchAll(/[\u4e00-\u9fa5A-Za-z0-9（）()·]{2,24}(?:医院|集团|银行|公司|事务所|物流|科技|中心)/g),
  ).map((match) => trimCompanyName(match[0]));

  return dedupe([...namesFromSegments, ...namesFromSuffix]).filter((name) => {
    if (name.length < 2) return false;
    return !/学校|学院|专业|报告|岗位|就业|来源|名单|包含|到校企业|参会企业/.test(name);
  });
}

function splitCompanySegment(segment: string) {
  const cleanSegment = segment.split(/岗位|职位|面向|包含|提供/)[0] ?? segment;
  return cleanSegment.split(/[、,，/／;；\s]+/).map(trimCompanyName).filter(Boolean);
}

function trimCompanyName(value: string) {
  return value.replace(/^[：:，,、；;\s]+|[：:，,、；;\s]+$/g, "");
}

function areCompanyNamesRelated(left: string, right: string) {
  const normalizedLeft = normalizeCompanyName(left);
  const normalizedRight = normalizeCompanyName(right);
  return Boolean(
    normalizedLeft &&
      normalizedRight &&
      (normalizedLeft === normalizedRight || normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft)),
  );
}

function normalizeCompanyName(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s·.,，。()（）-]/g, "")
    .replace(/有限责任公司|股份有限公司|有限公司|集团|控股|科技|官方|招聘|校招/g, "")
    .trim();
}

function makeBingUrl(query: string) {
  return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
}

function dedupe(items: string[]) {
  return dedupeBy(items, (item) => normalizeCompanyName(item));
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
