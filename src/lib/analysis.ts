import type { Badge, Job, MarketInsight, Skill, StudentProfile } from "../types";

const normalizeSkill = (value: string) => value.toLowerCase().replace(/\s+/g, "");

const foundationSkills = ["Python", "SQL", "数据分析", "沟通协作", "工程稳定性", "问题定位"];

export function getSkillNames(skills: Skill[]) {
  return new Set(skills.map((skill) => normalizeSkill(skill.name)));
}

export function scoreJob(job: Job, profile: StudentProfile): Badge {
  const profileSkills = getSkillNames(profile.skills);
  const matched = job.requirements.filter((requirement) => profileSkills.has(normalizeSkill(requirement)));
  const missingSkills = job.requirements.filter((requirement) => !profileSkills.has(normalizeSkill(requirement)));
  const matchScore = Math.round((matched.length / job.requirements.length) * 100);

  return {
    id: `badge-${job.id}`,
    companyId: job.companyId,
    companyName: job.companyName,
    title: `${job.companyName} ${job.category} 勋章`,
    category: job.category,
    matchScore,
    status: matchScore >= 72 ? "earned" : matchScore >= 48 ? "near" : "locked",
    missingSkills,
    proof: matched,
    gradient: getCompanyGradient(job.companyId),
  };
}

export function getBadges(jobs: Job[], profile: StudentProfile) {
  const strongestByCompany = new Map<string, Badge>();

  jobs.forEach((job) => {
    const badge = scoreJob(job, profile);
    const current = strongestByCompany.get(job.companyId);
    if (!current || current.matchScore < badge.matchScore) {
      strongestByCompany.set(job.companyId, badge);
    }
  });

  return Array.from(strongestByCompany.values()).sort((a, b) => b.matchScore - a.matchScore);
}

export function getRecommendedJobs(jobs: Job[], profile: StudentProfile) {
  return jobs
    .map((job) => ({ job, badge: scoreJob(job, profile) }))
    .sort((a, b) => b.badge.matchScore - a.badge.matchScore);
}

export function getMarketInsights(jobs: Job[]): MarketInsight[] {
  const tagCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const requirementCounts = new Map<string, number>();

  jobs.forEach((job) => {
    categoryCounts.set(job.category, (categoryCounts.get(job.category) ?? 0) + 1);
    job.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
    job.requirements.forEach((skill) => {
      requirementCounts.set(skill, (requirementCounts.get(skill) ?? 0) + 1);
    });
  });

  const topTags = topEntries(tagCounts, 5).map(([tag]) => tag).join(" / ");
  const topCategories = topEntries(categoryCounts, 3).map(([category]) => category).join(" / ");
  const commonRequirements = topEntries(requirementCounts, 6).map(([skill]) => skill).join(" / ");
  const foundations = foundationSkills
    .filter((skill) => requirementCounts.has(skill))
    .join(" / ");

  return [
    {
      title: "大厂发力方向",
      value: topTags,
      detail: "样例岗位集中在大模型平台、Agent、推荐、云基础设施、智能驾驶和即时履约优化。",
    },
    {
      title: "岗位供给热区",
      value: topCategories,
      detail: "AI 工程和数据算法岗位占比更高，前端和后台更偏业务效率与交易转化。",
    },
    {
      title: "基础能力",
      value: foundations || commonRequirements,
      detail: "跨岗位重复出现的基础项通常是编程、数据意识、系统理解、沟通协作和问题定位。",
    },
    {
      title: "学习优先级",
      value: commonRequirements,
      detail: "先补重复出现的基础技能，再围绕目标公司方向补专门技能，投入产出更清晰。",
    },
  ];
}

export function getLearningAdvice(jobs: Job[], profile: StudentProfile) {
  const recommended = getRecommendedJobs(jobs, profile).slice(0, 3);
  const missingFrequency = new Map<string, number>();

  recommended.forEach(({ badge }) => {
    badge.missingSkills.forEach((skill) => {
      missingFrequency.set(skill, (missingFrequency.get(skill) ?? 0) + 1);
    });
  });

  return topEntries(missingFrequency, 6).map(([skill, count]) => ({
    skill,
    reason: count > 1 ? "多个高匹配岗位同时需要" : "目标岗位的关键补齐项",
  }));
}

function topEntries<T>(map: Map<T, number>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function getCompanyGradient(companyId: Job["companyId"]) {
  const gradients: Record<Job["companyId"], string> = {
    bytedance: "linear-gradient(135deg, #111827, #00c2ff 55%, #ff3566)",
    tencent: "linear-gradient(135deg, #123e72, #20b6ff)",
    alibaba: "linear-gradient(135deg, #3d1f00, #ff7a00 65%, #ffd166)",
    meituan: "linear-gradient(135deg, #211500, #ffd000 60%, #2f7d32)",
    baidu: "linear-gradient(135deg, #172554, #4f46e5 55%, #ef4444)",
    jd: "linear-gradient(135deg, #4a0d0d, #e1251b 60%, #f8fafc)",
  };

  return gradients[companyId];
}
