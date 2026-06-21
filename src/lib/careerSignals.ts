import type { MajorSalaryProfile } from "../data/majorMarket";
import type { OfficialCompanySource } from "../data/officialSources";
import type { SchoolOutcomeProfile } from "../data/schoolOutcomes";
import type { CareerSignal, CareerSignalType, Job, SalaryEstimate } from "../types";

type CareerSignalInput = {
  jobs: Job[];
  majorSalaryProfiles: MajorSalaryProfile[];
  officialCompanySources: OfficialCompanySource[];
  schoolOutcomeProfiles: SchoolOutcomeProfile[];
};

export type CareerSignalSummary = {
  total: number;
  selected: number;
  byType: Record<CareerSignalType, number>;
  topMajors: Array<[string, number]>;
  topAbilities: Array<[string, number]>;
  sourceCoverage: {
    liveAdapterSources: number;
    officialLinkSources: number;
  };
};

const productEvidenceUrl = "https://kankan-salary.vercel.app";

export function buildCareerSignals({
  jobs,
  majorSalaryProfiles,
  officialCompanySources,
  schoolOutcomeProfiles,
}: CareerSignalInput): CareerSignal[] {
  const latestJobDate = getLatestJobSalaryDate(jobs);
  const signals = [
    ...buildJobSignals(jobs),
    ...buildSalarySignals(majorSalaryProfiles, latestJobDate),
    ...buildSchoolSignals(schoolOutcomeProfiles),
    ...buildOfficialSourceSignals(officialCompanySources, latestJobDate),
  ];

  return dedupeSignals(signals)
    .sort((left, right) => Number(right.selected) - Number(left.selected) || right.score - left.score || right.confidence - left.confidence)
    .slice(0, 96);
}

export function summarizeCareerSignals(signals: CareerSignal[]): CareerSignalSummary {
  return {
    total: signals.length,
    selected: signals.filter((signal) => signal.selected).length,
    byType: {
      job: signals.filter((signal) => signal.signalType === "job").length,
      salary: signals.filter((signal) => signal.signalType === "salary").length,
      school: signals.filter((signal) => signal.signalType === "school").length,
      "official-source": signals.filter((signal) => signal.signalType === "official-source").length,
    },
    topMajors: countTop(signals.flatMap((signal) => signal.relatedMajors), 8),
    topAbilities: countTop(signals.flatMap((signal) => signal.relatedAbilities), 8),
    sourceCoverage: {
      liveAdapterSources: signals.filter((signal) => signal.signalType === "official-source" && signal.tags.includes("live-adapter")).length,
      officialLinkSources: signals.filter((signal) => signal.signalType === "official-source" && signal.tags.includes("official-link")).length,
    },
  };
}

function buildJobSignals(jobs: Job[]): CareerSignal[] {
  return jobs
    .map((job) => {
      const confidence = getSalaryConfidence(job.salary);
      const score = clampScore(
        58 +
          (job.salary.source === "official" ? 10 : 3) +
          confidence * 16 +
          Math.min(10, (job.majorSignals?.length ?? 0) * 2) +
          Math.min(8, (job.abilitySignals?.length ?? 0) * 1.5),
      );
      return {
        id: `job-${slugify(job.id)}`,
        title: `${job.companyName} · ${job.title}`,
        sourceName: job.companyName,
        sourceUrl: job.sourceUrl,
        publishedAt: normalizeDate(job.salary.updatedAt),
        signalType: "job",
        category: job.category,
        summary: `${job.location} / ${job.department} / ${formatSalary(job.salary)}。${job.description}`,
        score,
        selected: score >= 76,
        tags: uniqueCompact([job.companyName, job.category, job.seniority, job.salary.source, ...job.tags]).slice(0, 10),
        relatedAbilities: uniqueCompact([...(job.abilitySignals ?? []), ...job.requirements, ...job.tags]).slice(0, 10),
        relatedMajors: uniqueCompact(job.majorSignals ?? []).slice(0, 8),
        relatedTracks: uniqueCompact([job.direction, job.category, job.department]).slice(0, 6),
        reason: `来自 ${job.companyName} 官方岗位样本，可用于判断 ${job.direction} 方向正在招聘的能力与薪资口径。`,
        risk:
          job.salary.source === "official"
            ? "官网岗位会随招聘周期变化，仍需打开原始链接确认城市、批次和投递资格。"
            : "薪资为市场估算，不代表企业承诺；必须结合官网岗位和学校就业证据交叉验证。",
        confidence,
      } satisfies CareerSignal;
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 36);
}

function buildSalarySignals(profiles: MajorSalaryProfile[], publishedAt: string): CareerSignal[] {
  return profiles.map((profile) => ({
    id: `salary-${slugify(profile.id)}`,
    title: `${profile.group} 薪资与岗位代理`,
    sourceName: "看看工资市场薪资代理",
    sourceUrl: productEvidenceUrl,
    publishedAt,
    signalType: "salary",
    category: "专业薪资",
    summary: `毕业初期 ${formatMonthlyRange(profile.starterMonthlyK)}，成熟阶段 ${formatMonthlyRange(profile.matureMonthlyK)}；代表岗位：${profile.roles.slice(0, 3).join(" / ")}。`,
    score: clampScore(profile.demandScore),
    selected: profile.demandScore >= 74,
    tags: uniqueCompact([profile.riskLevel, profile.evidence, ...profile.roles, ...profile.companies]).slice(0, 10),
    relatedAbilities: uniqueCompact(profile.coreSkills).slice(0, 10),
    relatedMajors: uniqueCompact(profile.majors).slice(0, 10),
    relatedTracks: uniqueCompact(profile.roles).slice(0, 8),
    reason: `把专业群、岗位族群和薪资区间放在同一口径下，帮助用户先判断方向价值。`,
    risk: `${profile.risk} 当前为市场代理口径，不替代学校就业质量报告或企业官网薪资。`,
    confidence: 0.62,
  }));
}

function buildSchoolSignals(schools: SchoolOutcomeProfile[]): CareerSignal[] {
  return schools.flatMap((school) =>
    school.evidenceSources.map((source) => {
      const score = clampScore(64 + source.metrics.length * 4 + (source.status === "verified" ? 10 : 3));
      return {
        id: `school-${slugify(school.id)}-${source.year}-${slugify(source.title)}`,
        title: `${school.name} · ${source.title}`,
        sourceName: source.sourceName,
        sourceUrl: source.url,
        publishedAt: `${source.year}-12-31`,
        signalType: "school",
        category: "学校就业证据",
        summary: source.metrics.map((metric) => `${metric.label} ${metric.value}`).join("；") || school.dataNote,
        score,
        selected: source.status === "verified" || score >= 78,
        tags: uniqueCompact([school.name, school.city, source.status, ...source.metrics.map((metric) => metric.label)]).slice(0, 10),
        relatedAbilities: uniqueCompact(source.metrics.map((metric) => metric.label)).slice(0, 8),
        relatedMajors: uniqueCompact(school.majors.map((major) => major.name)).slice(0, 12),
        relatedTracks: uniqueCompact(school.majors.flatMap((major) => major.destinations)).slice(0, 10),
        reason: `学校官方证据能校准专业去向，不把企业 logo 或宣传文案直接当成就业结论。`,
        risk: source.status === "verified" ? "这是校级或报告级证据，专业级薪资仍需继续补源。" : "该来源只定位到入口或部分字段，不能直接当作完整就业结论。",
        confidence: source.status === "verified" ? 0.84 : 0.58,
      } satisfies CareerSignal;
    }),
  );
}

function buildOfficialSourceSignals(sources: OfficialCompanySource[], publishedAt: string): CareerSignal[] {
  return sources.map((source) => {
    const live = source.adapterStatus === "live-adapter";
    return {
      id: `source-${slugify(source.id)}`,
      title: `${source.name} 官方招聘入口`,
      sourceName: source.name,
      sourceUrl: source.careerUrl,
      publishedAt,
      signalType: "official-source",
      category: live ? "Live Adapter" : "官方入口",
      summary: `${source.domain}；关注方向：${source.focus.join(" / ")}。`,
      score: live ? 76 : 62,
      selected: live,
      tags: uniqueCompact([source.adapterStatus, source.domain, ...source.focus]).slice(0, 10),
      relatedAbilities: uniqueCompact(source.focus).slice(0, 10),
      relatedMajors: [],
      relatedTracks: uniqueCompact(source.focus).slice(0, 10),
      reason: live ? "已接入 live adapter，可进入岗位聚合与每日刷新链路。" : "先保留官方入口，避免用非官方聚合站替代企业招聘源。",
      risk: live ? "adapter 返回结果受官网接口和招聘周期影响，样本数需要每日刷新后展示。" : "当前只有官方入口，还没有自动解析岗位样本，不能计入实时岗位数量。",
      confidence: live ? 0.78 : 0.52,
    } satisfies CareerSignal;
  });
}

function dedupeSignals(signals: CareerSignal[]) {
  const seen = new Set<string>();
  return signals.filter((signal) => {
    if (seen.has(signal.id)) return false;
    seen.add(signal.id);
    return true;
  });
}

function getLatestJobSalaryDate(jobs: Job[]) {
  const latest = jobs
    .map((job) => new Date(job.salary.updatedAt).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((left, right) => right - left)[0];
  return latest ? new Date(latest).toISOString() : "2026-06-20T00:00:00.000Z";
}

function getSalaryConfidence(salary: SalaryEstimate) {
  if (salary.confidence === "high") return 0.88;
  if (salary.confidence === "medium") return 0.68;
  return 0.42;
}

function formatSalary(salary: SalaryEstimate) {
  return `${salary.monthlyMinK}-${salary.monthlyMaxK}K/月，${salary.annualMinK}-${salary.annualMaxK}K/年`;
}

function formatMonthlyRange(range: [number, number]) {
  return `${range[0]}-${range[1]}K/月`;
}

function normalizeDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "2026-06-20T00:00:00.000Z" : date.toISOString();
}

function countTop(values: string[], limit: number): Array<[string, number]> {
  const counter = new Map<string, number>();
  uniqueCompact(values).forEach((value) => {
    counter.set(value, (counter.get(value) ?? 0) + values.filter((item) => item === value).length);
  });
  return Array.from(counter.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .slice(0, limit);
}

function uniqueCompact(values: Array<string | undefined | null>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\da-z\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
