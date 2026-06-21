export type SchoolCandidateCompareReportItem = {
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  marketGroup: string;
  readinessTitle?: string;
  readinessAdvice?: string;
  evidenceScore: number;
  aggregationStatusLabel?: string;
  aggregationConfirmedCount?: number;
  aggregationLeadCount?: number;
  aggregationWeakCount?: number;
  aggregationMissingSlots?: string[];
  aggregationNextAction?: string;
  nextEvidenceLabel?: string;
  nextEvidenceSource?: string;
  nextEvidenceDetail?: string;
  nextEvidenceUrl?: string;
  nextEvidenceSaveFields?: string[];
};

export function buildSchoolCandidateCompareReport(candidates: SchoolCandidateCompareReportItem[]) {
  if (!candidates.length) return "候选对比报告\n暂无候选；先保存一个学校/专业/岗位方案。";

  return [
    "候选对比报告",
    "用途：把不同学校、专业、岗位放在同一页继续核验；不要把弱证据当结论。",
    "",
    ...candidates.flatMap((candidate, index) => formatCandidateReportBlock(candidate, index)),
  ].join("\n");
}

function formatCandidateReportBlock(candidate: SchoolCandidateCompareReportItem, index: number) {
  const direction = [candidate.majorName || "专业待补", candidate.jobName || "岗位待补"].join(" -> ");
  const missingSlots = candidate.aggregationMissingSlots?.length ? candidate.aggregationMissingSlots.join(" / ") : "四类证据已覆盖";
  const nextAction = candidate.aggregationNextAction || candidate.readinessAdvice || "继续打开原始来源复核细节。";
  const nextEvidenceLines = [
    candidate.nextEvidenceLabel && candidate.nextEvidenceSource
      ? `下一证据入口：${candidate.nextEvidenceLabel}｜${candidate.nextEvidenceSource}`
      : "",
    candidate.nextEvidenceDetail ? `下一证据说明：${candidate.nextEvidenceDetail}` : "",
    candidate.nextEvidenceUrl ? `下一证据链接：${candidate.nextEvidenceUrl}` : "",
    candidate.nextEvidenceSaveFields?.length ? `下一证据保存字段：${candidate.nextEvidenceSaveFields.join(" / ")}` : "",
  ].filter(Boolean);
  const lines = [
    `${index + 1}. ${candidate.schoolName || "目标学校"}`,
    `方向：${direction}`,
    `薪资：${candidate.salaryLabel || "待生成"}（${candidate.marketGroup || "市场代理待生成"}）`,
    `状态：${candidate.readinessTitle || candidate.aggregationStatusLabel || "待补证据"} · ${candidate.evidenceScore}/100`,
    `证据：可采信 ${candidate.aggregationConfirmedCount ?? 0} / 待复核 ${candidate.aggregationLeadCount ?? 0} / 弱证据 ${candidate.aggregationWeakCount ?? 0}`,
    `缺口：${missingSlots}`,
    `下一步：${nextAction}`,
    ...nextEvidenceLines,
    "",
  ];

  return lines;
}
