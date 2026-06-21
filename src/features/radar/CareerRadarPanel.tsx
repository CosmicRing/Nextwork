import React, { useEffect, useMemo, useState } from "react";
import { Search, Target } from "lucide-react";
import { jobDataMeta, jobs } from "../../data/jobs";
import { majorPaths } from "../../data/gaokao";
import { buildOfficialSearchCards, officialCompanySources } from "../../data/officialSources";
import { formatMonthlyRange } from "../../data/majorMarket";
import { buildCareerRadar } from "../../lib/careerRadar";
import {
  buildCareerRadarEvidence,
  getAllAggregatedOfficialJobs,
  type AggregatedOfficialJob,
} from "../../lib/careerRadarEvidence";
import { diversifyOfficialJobMatches, jobCategoryLabels, type OfficialJobMatch } from "../../lib/officialJobSearch";
import type { Job, SalaryEstimate } from "../../types";

type CareerRadarSearchIntent = {
  target: string;
  query: string;
} | null;

type OfficialSearchSessionRow = {
  id: string;
  name: string;
  careerUrl: string;
  adapterStatus: "live-adapter" | "official-link";
  searchHint: string;
  sampleCount: number;
  matchCount: number;
  officialSalaryCount: number;
  estimatedSalaryCount: number;
  salaryRange: [number, number] | null;
  categories: string[];
  topMatch: OfficialJobMatch | null;
};

const categoryLabels = jobCategoryLabels;

export function CareerRadarPanel({ searchIntent }: { searchIntent: CareerRadarSearchIntent }) {
  const [query, setQuery] = useState("AIGC 算法工程师");
  useEffect(() => {
    if (!searchIntent || searchIntent.target !== "career-radar") return;
    setQuery(searchIntent.query);
  }, [searchIntent]);

  const radarItems = useMemo(() => buildCareerRadar(query, majorPaths), [query]);
  const radarEvidence = useMemo(() => buildCareerRadarEvidence(radarItems, query), [radarItems, query]);
  const topEvidence = radarEvidence[0];
  const officialCards = useMemo(() => buildOfficialSearchCards(query), [query]);
  const searchSessionMatches = useMemo(() => getAllAggregatedOfficialJobs([query], 18), [query]);
  const searchSessionRows = useMemo(
    () => buildOfficialSearchSessionRows(query, searchSessionMatches, officialCards),
    [officialCards, query, searchSessionMatches],
  );
  const aggregatedJobs = useMemo(() => diversifyOfficialJobMatches(searchSessionMatches, 8, 2), [searchSessionMatches]);
  const radarTracks = ([1, 2, 3, 4] as const).map((ring) => ({
    ring,
    label: ring === 1 ? "强关联" : ring === 2 ? "可重点比较" : ring === 3 ? "可转入" : "弱关联",
    items: radarEvidence.filter((item) => item.ring === ring).slice(0, 4),
  }));

  return (
    <section className="panel career-radar-panel" id="career-radar">
      <RadarPanelHeader kicker="Function 02" title="输入岗位，生成专业关联雷达" icon={<Target size={20} />} />
      <div className="radar-query">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入岗位，例如：机器人算法工程师" />
        </label>
        <span>内圈表示强关联专业，外圈表示可转入或弱关联专业。</span>
      </div>

      <OfficialSearchSessionPanel query={query} matches={searchSessionMatches} rows={searchSessionRows} />

      <div className="radar-layout">
        <div className="radar-orbit" aria-label="专业关联雷达">
          <div className="radar-orbit-head">
            <div>
              <span>岗位</span>
              <strong>{query || "岗位"}</strong>
            </div>
            <em>从内到外 = 关联强度递减</em>
          </div>
          <div className="radar-track-stack">
            {radarTracks.map((track) => (
              <section key={track.ring} className={`radar-track ring-${track.ring}`}>
                <div className="radar-track-label">
                  <strong>{track.label}</strong>
                  <span>第 {track.ring} 层</span>
                </div>
                <div className="radar-track-nodes">
                  {track.items.length > 0 ? (
                    track.items.map((item) => {
                      const rank = radarEvidence.findIndex((candidate) => candidate.major === item.major && candidate.group === item.group) + 1;
                      return (
                        <div key={`${track.ring}-${item.group}-${item.major}`} className="radar-node" title={`${item.major} · ${item.score}%`}>
                          <b>{rank}</b>
                          <span>{item.score}%</span>
                        </div>
                      );
                    })
                  ) : (
                    <em>暂无</em>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="radar-ranking">
          {radarEvidence.slice(0, 6).map((item, index) => (
            <article key={`${item.group}-${item.major}-${index}`}>
              <b>{index + 1}</b>
              <div>
                <strong>{item.major}</strong>
                <span>{item.group}</span>
                <div className="radar-ranking-meta">
                  <small>{item.officialMatchCount} 条官网岗位</small>
                  <small>{item.salaryProxy}</small>
                  <small>{item.companyNames.length > 0 ? item.companyNames.join(" / ") : "待扩展 adapter"}</small>
                </div>
                <em>{item.reasons[1] ?? item.reasons[0]}</em>
              </div>
              <i>{item.score}%</i>
            </article>
          ))}
        </div>
      </div>

      {topEvidence && (
        <div className="radar-proof-strip">
          <section>
            <span>最强关联专业</span>
            <strong>{topEvidence.major}</strong>
            <em>{topEvidence.group}</em>
          </section>
          <section>
            <span>官网岗位证据</span>
            <strong>{topEvidence.officialMatchCount} 条</strong>
            <em>{topEvidence.roleFamilies.length > 0 ? topEvidence.roleFamilies.join(" / ") : "当前官网样本待扩展"}</em>
          </section>
          <section>
            <span>早期薪资参考</span>
            <strong>{topEvidence.salaryProxy}</strong>
            <em>{topEvidence.companyNames.length > 0 ? topEvidence.companyNames.join(" / ") : "暂无公司样本"}</em>
          </section>
        </div>
      )}

      <AggregatedOfficialJobsBlock
        title="官网聚合岗位"
        description="用岗位关键词聚合当前官方 adapter 返回的岗位，并保留企业官网跳转。"
        matches={aggregatedJobs}
      />

      <div className="official-source-strip">
        {officialCards.slice(0, 6).map((source) => (
          <a key={source.id} href={source.careerUrl} target="_blank" rel="noreferrer">
            <span>{source.adapterStatus === "live-adapter" ? "Live" : "Official"}</span>
            <strong>{source.name}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function RadarPanelHeader({ kicker, title, icon }: { kicker: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="panel-header">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <span>{icon}</span>
    </div>
  );
}

function OfficialSearchSessionPanel({
  query,
  matches,
  rows,
}: {
  query: string;
  matches: OfficialJobMatch[];
  rows: OfficialSearchSessionRow[];
}) {
  const matchedCompanyCount = rows.filter((row) => row.matchCount > 0).length;
  const liveAdapterHitCount = rows.filter((row) => row.adapterStatus === "live-adapter" && row.matchCount > 0).length;
  const officialSalaryCount = matches.filter((match) => match.job.salary.source === "official").length;
  const estimatedSalaryCount = matches.length - officialSalaryCount;
  const liveSourceCount = officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length;

  return (
    <article className="official-search-session-panel">
      <div className="official-search-session-head">
        <div>
          <p className="eyebrow">Search Session</p>
          <h3>“{query || "岗位"}”的官网聚合结果</h3>
          <span>
            搜索输出不写回仓库；当前页面只从最近一次官方 adapter 快照里临时聚合，并保留官网入口继续核验。
          </span>
        </div>
        <section>
          <strong>{matches.length} 条</strong>
          <span>{matchedCompanyCount} 家官网命中</span>
        </section>
      </div>

      <div className="official-search-session-stats">
        <section>
          <span>命中 adapter</span>
          <strong>{liveAdapterHitCount}/{liveSourceCount}</strong>
          <em>当前有结果 / 已接 live adapter</em>
        </section>
        <section>
          <span>薪资口径</span>
          <strong>{officialSalaryCount} 官网</strong>
          <em>{estimatedSalaryCount} 条为市场估算，不能当作企业承诺</em>
        </section>
        <section>
          <span>刷新时间</span>
          <strong>{formatRefreshTime(jobDataMeta.generatedAt)}</strong>
          <em>可用 `npm run update:salaries` 每日刷新</em>
        </section>
      </div>

      <div className="official-search-session-grid">
        {rows.map((row) => (
          <a key={row.id} href={row.topMatch?.job.sourceUrl ?? row.careerUrl} target="_blank" rel="noreferrer" className={row.matchCount > 0 ? "hit" : "empty"}>
            <div>
              <strong>{row.name}</strong>
              <span>{row.adapterStatus === "live-adapter" ? "Live adapter" : "Official link"}</span>
            </div>
            <p>{row.matchCount > 0 ? `${row.matchCount} 条命中 · ${row.searchHint}` : row.searchHint}</p>
            <div className="official-search-row-metrics">
              <em>{row.sampleCount ? `${row.sampleCount} 条样本` : "入口"}</em>
              <em>{row.salaryRange ? formatMonthlyRange(row.salaryRange) : "官网检索"}</em>
              <em>{row.officialSalaryCount ? `${row.officialSalaryCount} 条官网薪资` : `${row.estimatedSalaryCount || "待"} 条估算薪资`}</em>
            </div>
            <div className="official-search-row-tags">
              {(row.categories.length ? row.categories : ["打开官网继续查"]).slice(0, 3).map((category) => (
                <b key={`${row.id}-${category}`}>{category}</b>
              ))}
            </div>
          </a>
        ))}
      </div>
    </article>
  );
}

function buildOfficialSearchSessionRows(
  query: string,
  matches: OfficialJobMatch[],
  cards: ReturnType<typeof buildOfficialSearchCards>,
): OfficialSearchSessionRow[] {
  const sourceIds = new Set<string>(cards.map((card) => card.id));
  matches.forEach((match) => sourceIds.add(match.job.companyId));

  return Array.from(sourceIds)
    .map((sourceId): OfficialSearchSessionRow | null => {
      const source = officialCompanySources.find((item) => item.id === sourceId);
      if (!source) return null;
      const card = cards.find((item) => item.id === sourceId);
      const sourceMatches = matches.filter((match) => match.job.companyId === sourceId);
      const sourceJobs = sourceMatches.map((match) => match.job);
      const sourceMeta = jobDataMeta.sources.find((item) => item.companyId === sourceId);
      const topMatch: OfficialJobMatch | null = sourceMatches.length > 0 ? sourceMatches[0] : null;
      return {
        id: source.id,
        name: source.name,
        careerUrl: source.careerUrl,
        adapterStatus: source.adapterStatus,
        searchHint: card?.searchHint ?? `${source.name} 官网检索：${query || "岗位"}`,
        sampleCount: sourceMeta?.normalizedCount ?? jobs.filter((job) => job.companyId === sourceId).length,
        matchCount: sourceMatches.length,
        officialSalaryCount: sourceJobs.filter((job) => job.salary.source === "official").length,
        estimatedSalaryCount: sourceJobs.filter((job) => job.salary.source !== "official").length,
        salaryRange: getCompanySalaryRange(sourceJobs),
        categories: getTopJobEntries(sourceJobs.map((job) => categoryLabels[job.category]), 3).map(([category]) => category),
        topMatch,
      };
    })
    .filter((row): row is OfficialSearchSessionRow => Boolean(row))
    .sort(
      (left, right) =>
        right.matchCount - left.matchCount ||
        Number(left.adapterStatus !== "live-adapter") - Number(right.adapterStatus !== "live-adapter") ||
        right.sampleCount - left.sampleCount,
    )
    .slice(0, 10);
}

function AggregatedOfficialJobsBlock({
  title,
  description,
  matches,
}: {
  title: string;
  description: string;
  matches: AggregatedOfficialJob[];
}) {
  return (
    <article className="aggregated-jobs-block">
      <div className="aggregated-jobs-heading">
        <div>
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
        <strong>{matches.length} 条</strong>
      </div>
      {matches.length > 0 ? (
        <div className="aggregated-job-grid">
          {matches.map(({ job, score, reasons }) => (
            <a key={job.id} href={job.sourceUrl} target="_blank" rel="noreferrer">
              <div>
                <span>{job.companyName}</span>
                <b>{score}%</b>
              </div>
              <strong>{job.title}</strong>
              <em>{job.location} · {categoryLabels[job.category]}</em>
              <SalaryPill salary={job.salary} compact />
              <p>{[...reasons.slice(0, 1), ...getJobSignalTags(job, 2)].join(" / ")}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className="aggregated-empty">当前 live adapter 样本没有命中；可继续打开下方官方入口做即时搜索。</p>
      )}
    </article>
  );
}

function SalaryPill({ salary, compact = false }: { salary: SalaryEstimate; compact?: boolean }) {
  return (
    <em className={compact ? "salary-pill compact" : "salary-pill"} title={salary.note}>
      {formatSalary(salary)}
      <small>{salary.source === "official" ? "官" : "估"}</small>
    </em>
  );
}

function formatSalary(salary: SalaryEstimate) {
  return `${salary.monthlyMinK}-${salary.monthlyMaxK}K/月 · ${salary.annualMinK}-${salary.annualMaxK}K/年`;
}

function getJobSignalTags(job: Job, limit = 4) {
  const majorTags = (job.majorSignals ?? []).map((major) => `关联 ${major}`);
  const abilityTags = job.abilitySignals ?? job.requirements;
  return Array.from(new Set([...majorTags, ...abilityTags])).slice(0, limit);
}

function getCompanySalaryRange(companyJobs: Job[]): [number, number] | null {
  if (companyJobs.length === 0) return null;
  const min = Math.min(...companyJobs.map((job) => job.salary.monthlyMinK));
  const max = Math.max(...companyJobs.map((job) => job.salary.monthlyMaxK));
  return [min, max];
}

function getTopJobEntries(values: string[], limit: number) {
  const counts = values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map<string, number>());
  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .slice(0, limit);
}

function formatRefreshTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "待刷新";
  return date.toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" });
}
