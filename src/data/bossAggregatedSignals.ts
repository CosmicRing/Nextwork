export type BossAggregatedSkillSignal = {
  id: string;
  label: string;
  sampleCount: number;
  topSkills: string[];
};

export const bossAggregatedSignalSource = {
  repoUrl: "https://github.com/radishT/Job_Analysis",
  license: "MIT",
  sourcePath: "result/模块二_各大编程语言的工作能力成熟度分析/数据清洗阶段-2018-4-27/清洗后_key_map.sql/key_map.sql",
  rowCount: 60033,
  categoryCount: 7,
  note: "Only aggregated keyword counts are imported. Raw BOSS/Lagou job records are not copied into the frontend fact base.",
} as const;

export const bossAggregatedSkillSignals: BossAggregatedSkillSignal[] = [
  {
    id: "java",
    label: "Java",
    sampleCount: 16595,
    topSkills: ["mysql", "spring", "oracle", "sql", "web", "mybatis", "linux", "javascript", "jquery", "hibernate", "tomcat", "redis"],
  },
  {
    id: "web",
    label: "Web 前端",
    sampleCount: 14299,
    topSkills: ["javascript", "css", "jquery", "html", "js", "ajax", "java", "vue", "react", "ui", "bootstrap", "mysql"],
  },
  {
    id: "linux",
    label: "Linux / 运维",
    sampleCount: 10557,
    topSkills: ["mysql", "java", "sql", "web", "oracle", "shell", "php", "redis", "python", "javascript", "spring", "tomcat"],
  },
  {
    id: "csharp",
    label: "C# / .NET",
    sampleCount: 7350,
    topSkills: ["net", "sql", "server", "javascript", "web", "oracle", "mysql", "mvc", "css", "jquery", "html", "ajax"],
  },
  {
    id: "python",
    label: "Python",
    sampleCount: 6786,
    topSkills: ["linux", "mysql", "java", "web", "shell", "redis", "sql", "django", "mongodb", "javascript", "php", "hadoop"],
  },
  {
    id: "android",
    label: "Android",
    sampleCount: 2919,
    topSkills: ["java", "app", "ui", "sdk", "http", "socket", "tcp/ip", "framework", "api", "studio", "git", "json"],
  },
  {
    id: "cpp",
    label: "C++",
    sampleCount: 1527,
    topSkills: ["c/c", "linux", "tcp/ip", "windows", "mysql", "socket", "stl", "qt", "python", "http", "shell", "redis"],
  },
];

export const bossAggregatedSampleCount = bossAggregatedSkillSignals.reduce((total, signal) => total + signal.sampleCount, 0);

export const bossAggregatedTopSkillCount = new Set(bossAggregatedSkillSignals.flatMap((signal) => signal.topSkills)).size;
