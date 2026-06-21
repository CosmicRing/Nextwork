export type SchoolRescueTakeawayChip = {
  id: "school" | "direction" | "salary" | "evidence";
  label: string;
  value: string;
};

export type SchoolRescueTakeaway = {
  title: string;
  statusLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
  warning: string;
  lines: string[];
  chips: SchoolRescueTakeawayChip[];
};

export function buildSchoolRescueTakeaway({
  schoolName,
  majorName,
  jobName,
  knownSchool,
  officialEntryCount,
  searchEntryCount,
  salaryLabel,
  salarySource,
  companyNames,
  evidenceCount,
  readinessTitle,
  nextActions,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  knownSchool: boolean;
  officialEntryCount: number;
  searchEntryCount: number;
  salaryLabel: string;
  salarySource: string;
  companyNames: string[];
  evidenceCount: number;
  readinessTitle: string;
  nextActions: string[];
}): SchoolRescueTakeaway {
  const safeSchoolName = schoolName.trim() || "目标学校";
  const safeMajorName = majorName.trim();
  const safeJobName = jobName.trim();
  const directionLabel = [safeMajorName, safeJobName].filter(Boolean).join(" -> ") || "先填专业或岗位";
  const salaryLine = salaryLabel
    ? `工资：${salaryLabel}${salarySource ? `（${salarySource}）` : ""}`
    : "工资：补专业或岗位后生成";
  const entryParts = [
    officialEntryCount > 0 ? `${officialEntryCount} 个官方直达` : "",
    searchEntryCount > 0 ? `${searchEntryCount} 个公开搜索` : "",
    companyNames.length > 0 ? companyNames.slice(0, 3).join(" / ") : "",
  ].filter(Boolean);
  const nextActionLine = nextActions.length
    ? nextActions.slice(0, 3).join(" / ")
    : "先打开学校专业入口 / 查就业质量报告 / 查校招企业";

  return {
    title: "先带走这份入口包",
    statusLabel: knownSchool ? "已命中学校样本" : "未收录也能查",
    primaryLabel: "复制救援包",
    secondaryLabel: "补证据",
    warning: "工资是岗位代理，不是学校官方结论；入口和证据要分开保存。",
    lines: [
      `学校：${safeSchoolName}`,
      `方向：${directionLabel}`,
      salaryLine,
      `入口：${entryParts.join(" · ") || "待生成"}`,
      `下一步：${nextActionLine}`,
    ],
    chips: [
      { id: "school", label: "学校", value: knownSchool ? "样本" : "搜索" },
      { id: "direction", label: "方向", value: safeMajorName || safeJobName ? "已填" : "待填" },
      { id: "salary", label: "工资", value: salaryLabel || "待生成" },
      { id: "evidence", label: "证据", value: evidenceCount ? `${evidenceCount} 条` : readinessTitle || "待补" },
    ],
  };
}
