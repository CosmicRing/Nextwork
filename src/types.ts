export type CompanyId =
  | "bytedance"
  | "tencent"
  | "alibaba"
  | "meituan"
  | "baidu"
  | "jd"
  | "huawei"
  | "kuaishou"
  | "bilibili"
  | "xiaomi"
  | "pdd"
  | "midea"
  | "amazon"
  | "ikea"
  | "unilever"
  | "loreal";

export type JobCategory =
  | "AI Engineering"
  | "Backend"
  | "Frontend"
  | "Data"
  | "Infrastructure"
  | "Product"
  | "Design"
  | "Security"
  | "Business"
  | "Operations"
  | "Finance"
  | "Service";

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
  majorSignals?: string[];
  abilitySignals?: string[];
  evidenceSignals?: string[];
  direction: string;
  seniority: "intern" | "junior" | "mid" | "senior";
  salary: SalaryEstimate;
};

export type SalaryEstimate = {
  monthlyMinK: number;
  monthlyMaxK: number;
  annualMinK: number;
  annualMaxK: number;
  months: number;
  currency: "CNY";
  source: "official" | "market-estimate";
  confidence: "high" | "medium" | "low";
  updatedAt: string;
  note: string;
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

export type University = {
  id: string;
  name: string;
  city: string;
  tier: "A+" | "A" | "B";
  strengths: string[];
  majors: string[];
};

export type UniversityMajorJobMatch = {
  id: string;
  university: University;
  majorPath: MajorPath;
  major: string;
  job: Job;
  score: number;
  reasons: string[];
  gaps: string[];
};

export type SourceNote = {
  title: string;
  publisher: string;
  url: string;
  note: string;
};

export type CareerSignalType = "job" | "salary" | "school" | "official-source";

export type CareerSignal = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  signalType: CareerSignalType;
  category: string;
  summary: string;
  score: number;
  selected: boolean;
  tags: string[];
  relatedAbilities: string[];
  relatedMajors: string[];
  relatedTracks: string[];
  reason: string;
  risk: string;
  confidence: number;
};
