export type CompanyId = "bytedance" | "tencent" | "alibaba" | "meituan" | "baidu" | "jd";

export type JobCategory =
  | "AI Engineering"
  | "Backend"
  | "Frontend"
  | "Data"
  | "Infrastructure"
  | "Product"
  | "Design"
  | "Security";

export type SkillLevel = "foundation" | "working" | "strong";

export type Job = {
  id: string;
  companyId: CompanyId;
  companyName: string;
  title: string;
  department: string;
  location: string;
  category: JobCategory;
  sourceUrl: string;
  description: string;
  requirements: string[];
  tags: string[];
  direction: string;
  seniority: "intern" | "junior" | "mid" | "senior";
};

export type Skill = {
  id: string;
  name: string;
  level: SkillLevel;
};

export type StudentProfile = {
  name: string;
  target: string;
  skills: Skill[];
};

export type Badge = {
  id: string;
  companyId: CompanyId;
  companyName: string;
  title: string;
  category: JobCategory;
  matchScore: number;
  status: "earned" | "near" | "locked";
  missingSkills: string[];
  proof: string[];
  gradient: string;
};

export type MarketInsight = {
  title: string;
  value: string;
  detail: string;
};

export type AppMode = "talent" | "gaokao";

export type GaokaoProfile = {
  name: string;
  goal: string;
  traits: string[];
};

export type GaokaoTrait = {
  id: string;
  label: string;
  description: string;
};

export type StartupTrack = {
  id: string;
  name: string;
  heat: number;
  opportunity: string;
  demandBreakdown: string[];
  abilityTags: string[];
  relatedMajors: string[];
  fitTraits: string[];
  caution: string;
};

export type MajorPath = {
  id: string;
  group: string;
  majors: string[];
  score: number;
  why: string;
  careerTargets: string[];
  startupRoutes: string[];
  coreAbilities: string[];
  fitTraits: string[];
  firstYearPlan: string[];
  watchOut: string;
};

export type SourceNote = {
  title: string;
  publisher: string;
  url: string;
  note: string;
};
