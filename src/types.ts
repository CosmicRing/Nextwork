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
