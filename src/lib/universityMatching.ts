import type { Job, JobCategory, MajorPath, University, UniversityMajorJobMatch } from "../types";

const categoryMajorBoost: Record<JobCategory, string[]> = {
  "AI Engineering": ["人工智能", "计算机", "软件", "数据", "自动化", "机器"],
  Backend: ["计算机", "软件", "通信", "数据"],
  Frontend: ["软件", "计算机", "工业设计", "产品"],
  Data: ["数据", "统计", "计算机", "人工智能", "信息管理"],
  Infrastructure: ["计算机", "通信", "网络", "电子信息", "软件"],
  Product: ["信息管理", "工业设计", "计算机", "软件", "数据"],
  Design: ["工业设计", "产品", "数字媒体", "计算机"],
  Security: ["网络", "信息安全", "计算机", "通信", "电子信息"],
  Business: ["工商管理", "市场营销", "广告", "传播", "电子商务", "经济"],
  Operations: ["物流", "供应链", "工业工程", "工程管理", "旅游", "酒店"],
  Finance: ["金融", "会计", "审计", "经济", "保险", "精算"],
  Service: ["酒店", "旅游", "航空", "护理", "教育", "英语", "人力资源"],
};

export function buildUniversityMajorMatches(
  universities: University[],
  majorPaths: MajorPath[],
  jobs: Job[],
  limit = 18,
): UniversityMajorJobMatch[] {
  const matches: UniversityMajorJobMatch[] = [];

  for (const university of universities) {
    for (const majorPath of majorPaths) {
      const major = pickMatchedMajor(university, majorPath);
      if (!major) continue;

      const best = jobs
        .map((job) => ({ job, score: scoreJob(majorPath, major, university, job) }))
        .sort((a, b) => b.score - a.score)[0];

      if (!best || best.score < 42) continue;

      matches.push({
        id: `${university.id}-${majorPath.id}-${best.job.id}`,
        university,
        majorPath,
        major,
        job: best.job,
        score: clampScore(best.score),
        reasons: buildReasons(university, majorPath, major, best.job),
        gaps: buildGaps(majorPath, best.job),
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, limit);
}

function pickMatchedMajor(university: University, majorPath: MajorPath) {
  const offered = majorPath.majors.find((major) => university.majors.some((item) => textOverlaps(item, major)));
  if (offered) return offered;

  return majorPath.majors.find((major) => university.strengths.some((item) => textOverlaps(item, major)));
}

function scoreJob(majorPath: MajorPath, major: string, university: University, job: Job) {
  const jobText = normalize([job.title, job.department, job.direction, job.category, ...job.requirements, ...job.tags].join(" "));
  const pathText = normalize([majorPath.group, ...majorPath.majors, ...majorPath.coreAbilities, ...majorPath.careerTargets].join(" "));
  const universityText = normalize([university.name, university.city, ...university.strengths, ...university.majors].join(" "));
  const boostTerms = categoryMajorBoost[job.category] ?? [];

  const abilityOverlap = majorPath.coreAbilities.filter((ability) => jobText.includes(normalize(ability))).length * 8;
  const targetOverlap = majorPath.careerTargets.filter((target) => jobText.includes(normalize(target))).length * 6;
  const categoryBoost = boostTerms.filter((term) => pathText.includes(normalize(term)) || normalize(major).includes(normalize(term))).length * 7;
  const universityBoost = boostTerms.filter((term) => universityText.includes(normalize(term))).length * 4;
  const cityBoost = job.location.includes(university.city) ? 6 : 0;
  const tierBoost = university.tier === "A+" ? 7 : university.tier === "A" ? 4 : 2;
  const salaryBoost = Math.min(8, Math.round(job.salary.annualMaxK / 180));

  return 30 + abilityOverlap + targetOverlap + categoryBoost + universityBoost + cityBoost + tierBoost + salaryBoost;
}

function buildReasons(university: University, majorPath: MajorPath, major: string, job: Job) {
  const reasons = [
    `${university.name} 的 ${major} 与 ${majorPath.group} 方向一致`,
    `${job.companyName} ${job.title} 需要 ${job.requirements.slice(0, 3).join(" / ")}`,
  ];

  if (job.location.includes(university.city)) {
    reasons.push(`${university.city} 与岗位城市重合，实习和校招连接更近`);
  } else {
    reasons.push(`${university.city} 学科基础可迁移到 ${job.location.split(" / ")[0] || "目标城市"}`);
  }

  return reasons;
}

function buildGaps(majorPath: MajorPath, job: Job) {
  const jobText = normalize(job.requirements.join(" "));
  const gaps = majorPath.coreAbilities.filter((ability) => !jobText.includes(normalize(ability))).slice(0, 3);
  return gaps.length > 0 ? gaps : job.requirements.slice(0, 3);
}

function textOverlaps(a: string, b: string) {
  const left = normalize(a);
  const right = normalize(b);
  return left.includes(right) || right.includes(left) || left.slice(0, 2) === right.slice(0, 2);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function clampScore(value: number) {
  return Math.max(45, Math.min(98, Math.round(value)));
}
