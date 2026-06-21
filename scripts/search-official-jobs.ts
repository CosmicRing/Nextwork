import { buildOfficialSearchCards } from "../src/data/officialSources";
import { jobDataMeta, jobs } from "../src/data/jobs";
import { diversifyOfficialJobMatches, jobCategoryLabels, searchOfficialJobs } from "../src/lib/officialJobSearch";

const query = process.argv.slice(2).join(" ").trim();

if (!query) {
  console.error("Usage: npm run search:official -- <job keyword>");
  process.exit(1);
}

const officialSources = buildOfficialSearchCards(query);
const sampleCountByCompany = new Map<string, number>(
  jobDataMeta.sources.map((source) => [source.companyId, source.normalizedCount]),
);
const allMatches = searchOfficialJobs(jobs, [query], 14);
const matchedJobs = diversifyOfficialJobMatches(allMatches, 8, 2)
  .map(({ job, score, reasons }) => ({
    score,
    reasons,
    companyName: job.companyName,
    title: job.title,
    category: jobCategoryLabels[job.category],
    location: job.location,
    majorSignals: job.majorSignals?.slice(0, 4) ?? [],
    abilitySignals: job.abilitySignals?.slice(0, 5) ?? job.requirements.slice(0, 5),
    salary: `${job.salary.monthlyMinK}-${job.salary.monthlyMaxK}K/月`,
    salarySource: job.salary.source,
    sourceUrl: job.sourceUrl,
  }));
const matchedCompanies = Array.from(new Set(allMatches.map((match) => match.job.companyName)));

console.log(
  JSON.stringify(
    {
      query,
      mode: "search-only:no-persist",
      snapshotSize: jobs.length,
      matchedJobCount: allMatches.length,
      matchedCompanyCount: matchedCompanies.length,
      officialSources: officialSources.map((source) => ({
        name: source.name,
        adapterStatus: source.adapterStatus,
        currentSampleCount: sampleCountByCompany.get(source.id) ?? 0,
        careerUrl: source.careerUrl,
        focus: source.focus,
        searchHint: source.searchHint,
      })),
      adapterResults: matchedJobs,
      note: "Results are scored from the current official-adapter snapshot and should be rechecked on the company career site. This command does not persist search output.",
    },
    null,
    2,
  ),
);
