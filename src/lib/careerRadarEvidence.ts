import { jobs } from "../data/jobs";
import { formatMonthlyRange, majorSalaryProfiles } from "../data/majorMarket";
import { buildCareerRadar } from "./careerRadar";
import { jobCategoryLabels, searchOfficialJobs, type OfficialJobMatch } from "./officialJobSearch";

export type AggregatedOfficialJob = OfficialJobMatch;
export type CareerRadarItem = ReturnType<typeof buildCareerRadar>[number];

export type CareerRadarEvidenceItem = CareerRadarItem & {
  officialMatchCount: number;
  companyNames: string[];
  roleFamilies: string[];
  salaryProxy: string;
  evidenceJobs: AggregatedOfficialJob[];
};

export function buildCareerRadarEvidence(items: CareerRadarItem[], query: string): CareerRadarEvidenceItem[] {
  return items
    .map((item) => {
      const profile = findMarketProfileForRadarItem(item);
      const evidenceJobs = getAllAggregatedOfficialJobs([query, item.major, item.group], 42);
      const companyNames = Array.from(new Set(evidenceJobs.map((match) => match.job.companyName))).slice(0, 4);
      const roleFamilies = Array.from(new Set(evidenceJobs.map((match) => jobCategoryLabels[match.job.category]))).slice(0, 4);

      return {
        ...item,
        officialMatchCount: evidenceJobs.length,
        companyNames,
        roleFamilies,
        salaryProxy: formatMonthlyRange(profile.starterMonthlyK),
        evidenceJobs: evidenceJobs.slice(0, 3),
      };
    })
    .sort((left, right) => (right.rankScore ?? right.score) - (left.rankScore ?? left.score) || right.officialMatchCount - left.officialMatchCount);
}

export function findMarketProfileForRadarItem(item: CareerRadarItem) {
  const itemMajor = normalizeMarketText(item.major);
  const itemGroupTokens = getMarketTokens([item.group]);
  const ranked = majorSalaryProfiles
    .map((profile) => {
      let score = 0;
      profile.majors.forEach((major) => {
        const normalizedMajor = normalizeMarketText(major);
        if (normalizedMajor === itemMajor) score += 120;
        else if (areNormalizedTermsRelated(normalizedMajor, itemMajor)) score += 84;
      });
      getMarketTokens([profile.group]).forEach((profileToken) => {
        if (itemGroupTokens.some((groupToken) => areNormalizedTermsRelated(profileToken, groupToken))) score += 28;
      });
      profile.roles.forEach((role) => {
        const normalizedRole = normalizeMarketText(role);
        if (item.reasons.some((reason) => normalizeMarketText(reason).includes(normalizedRole))) score += 6;
      });
      return { profile, score };
    })
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.score ? ranked[0].profile : majorSalaryProfiles[0];
}

export function getAggregatedOfficialJobs(queries: string[], limit: number) {
  return getAllAggregatedOfficialJobs(queries).slice(0, limit);
}

export function getAllAggregatedOfficialJobs(queries: string[], minScore = 18) {
  return searchOfficialJobs(jobs, queries, minScore);
}

export function areNormalizedTermsRelated(left: string, right: string) {
  if (!left || !right) return false;
  return left.includes(right) || right.includes(left);
}

export function getMarketTokens(values: string[]) {
  return values
    .flatMap((value) => normalizeMarketText(value).split("/"))
    .map((value) => value.trim())
    .filter((value) => value.length >= 2);
}

export function normalizeMarketText(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "").replace(/[／|｜,，、]+/g, "/");
}
