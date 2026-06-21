export function buildSchoolInfoPacketPreviewLines({
  schoolName,
  majorName,
  jobName,
  salaryLabel,
  salarySource,
  officialEntryCount,
  searchEntryCount,
  companyEntryNames,
  manualEvidenceCount,
  manualEvidenceLabels,
  manualEvidenceTrustSummary,
  nextActions,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  salarySource: string;
  officialEntryCount: number;
  searchEntryCount: number;
  companyEntryNames: string[];
  manualEvidenceCount: number;
  manualEvidenceLabels: string[];
  manualEvidenceTrustSummary: string;
  nextActions: string[];
}) {
  const directionLabel = [majorName, jobName].filter(Boolean).join(" → ") || "待填写";
  const salaryLine = salaryLabel
    ? `薪资：${salaryLabel}${salarySource ? `（${salarySource}）` : ""}`
    : "薪资：补专业/岗位后生成";
  const entryParts = [
    officialEntryCount ? `${officialEntryCount} 个官方直达` : "",
    searchEntryCount ? `${searchEntryCount} 个公开搜索` : "",
  ].filter(Boolean);
  const companyLine = companyEntryNames.length
    ? `企业：${companyEntryNames.slice(0, 4).join(" / ")}`
    : "企业：补方向后生成公司入口";
  const manualEvidenceLine = manualEvidenceCount
    ? `自存证据：${manualEvidenceCount} 条 · ${Array.from(new Set(manualEvidenceLabels)).slice(0, 4).join(" / ")}`
    : "自存证据：暂无";
  const manualEvidenceTrustLine = `证据分级：${manualEvidenceTrustSummary}`;
  const actionLine = nextActions.length
    ? `下一步：${nextActions.slice(0, 3).join(" / ")}`
    : "下一步：先打开学校专业入口核验 / 查就业质量报告 / 查校招和宣讲会企业";

  return [
    `学校：${schoolName || "目标学校"}`,
    `方向：${directionLabel}`,
    salaryLine,
    `入口：${entryParts.join(" · ") || "待生成"}`,
    companyLine,
    manualEvidenceLine,
    manualEvidenceTrustLine,
    actionLine,
  ];
}
