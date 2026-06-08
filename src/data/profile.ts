import type { StudentProfile } from "../types";

export const initialProfile: StudentProfile = {
  name: "同学 A",
  target: "AI 应用工程师 / 游戏 AI",
  skills: [
    { id: "python", name: "Python", level: "working" },
    { id: "typescript", name: "TypeScript", level: "working" },
    { id: "react", name: "React", level: "working" },
    { id: "sql", name: "SQL", level: "foundation" },
    { id: "pytorch", name: "PyTorch", level: "foundation" },
    { id: "rag", name: "RAG", level: "foundation" },
    { id: "api", name: "API 设计", level: "working" },
    { id: "communication", name: "沟通协作", level: "working" },
  ],
};

export const selectableSkills = [
  "Python",
  "TypeScript",
  "React",
  "Go",
  "C++",
  "SQL",
  "PyTorch",
  "机器学习",
  "推荐系统",
  "RAG",
  "Prompt Engineering",
  "API 设计",
  "分布式系统",
  "微服务",
  "MySQL",
  "Redis",
  "Linux",
  "数据分析",
  "计算机视觉",
  "游戏引擎",
  "图形学基础",
  "工程稳定性",
  "沟通协作",
  "产品理解",
];
