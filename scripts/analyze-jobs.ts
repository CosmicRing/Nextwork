import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { jobDataMeta, jobs } from "../src/data/jobs";
import { getMarketInsights, getRecommendedJobs } from "../src/lib/analysis";
import { initialProfile } from "../src/data/profile";

const outDir = resolve("data");
mkdirSync(outDir, { recursive: true });

const analysis = {
  generatedAt: new Date().toISOString(),
  modelRole: "ClaudeCode-compatible analyzer",
  source: jobDataMeta,
  datasetSize: jobs.length,
  insights: getMarketInsights(jobs),
  recommendations: getRecommendedJobs(jobs, initialProfile).map(({ job, badge }) => ({
    jobId: job.id,
    companyName: job.companyName,
    title: job.title,
    category: job.category,
    direction: job.direction,
    majorSignals: job.majorSignals ?? [],
    abilitySignals: job.abilitySignals ?? job.requirements,
    salary: job.salary,
    matchScore: badge.matchScore,
    earnedBadge: badge.status === "earned",
    matchedSkills: badge.proof,
    missingSkills: badge.missingSkills,
  })),
};

writeFileSync(resolve(outDir, "analysis.json"), JSON.stringify(analysis, null, 2), "utf8");
console.log(`Wrote ${resolve(outDir, "analysis.json")}`);
