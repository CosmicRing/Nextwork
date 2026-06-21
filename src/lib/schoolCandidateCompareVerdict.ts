export type SchoolCandidateCompareVerdictTier = "not-ready" | "can-screen" | "ready-to-compare";

export type SchoolCandidateCompareVerdictItem = {
  key: string;
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  marketGroup: string;
  evidenceScore: number;
  readinessTier?: SchoolCandidateCompareVerdictTier;
  readinessTitle?: string;
  readinessAdvice?: string;
  aggregationStatusLabel?: string;
  aggregationConfirmedCount?: number;
  aggregationLeadCount?: number;
  aggregationWeakCount?: number;
  aggregationMissingSlots?: string[];
  aggregationNextAction?: string;
};

export type SchoolCandidateCompareVerdictRank = SchoolCandidateCompareVerdictItem & {
  rankScore: number;
  rankLabel: "优先继续查" | "可以粗筛" | "先补证据";
  rankReason: string;
  missingLabel: string;
  nextAction: string;
};

export type SchoolCandidateCompareVerdict = {
  title: string;
  summary: string;
  nextAction: string;
  ranked: SchoolCandidateCompareVerdictRank[];
  copyText: string;
};

export function buildSchoolCandidateCompareVerdict(
  candidates: SchoolCandidateCompareVerdictItem[],
): SchoolCandidateCompareVerdict {
  if (!candidates.length) {
    return {
      title: "先保存一个候选",
      summary: "还没有学校/专业/岗位方案进入对比，先从上面的聚合判断点存入对比。",
      nextAction: "先点“存入对比”，再继续补证据。",
      ranked: [],
      copyText: "候选结论排序\n暂无候选；先点“存入对比”。",
    };
  }

  const ranked = candidates
    .map(toRankedCandidate)
    .sort((left, right) => right.rankScore - left.rankScore || right.evidenceScore - left.evidenceScore);
  const best = ranked[0];
  const summary = best
    ? `不是按工资最高排序；优先看证据完整度、可信来源和下一步能否复核。当前 ${ranked.length} 个候选里，${best.schoolName} 的资料最适合继续查。`
    : "不是按工资最高排序；优先看证据完整度、可信来源和下一步能否复核。";
  const title = best ? `优先看${best.schoolName}` : "先保存一个候选";
  const nextAction = best?.nextAction ?? "先点“存入对比”，再继续补证据。";
  const copyText = [
    "候选结论排序",
    summary,
    "",
    ...ranked.flatMap((candidate, index) => [
      `${index + 1}. ${candidate.schoolName}`,
      `方向：${candidate.majorName || "专业待补"} -> ${candidate.jobName || "岗位待补"}`,
      `排序：${candidate.rankLabel} · ${candidate.rankScore}/100`,
      `理由：${candidate.rankReason}`,
      `缺口：${candidate.missingLabel}`,
      `下一步：${candidate.nextAction}`,
      "",
    ]),
  ].join("\n");

  return {
    title,
    summary,
    nextAction,
    ranked,
    copyText,
  };
}

function toRankedCandidate(candidate: SchoolCandidateCompareVerdictItem): SchoolCandidateCompareVerdictRank {
  const confirmed = toCount(candidate.aggregationConfirmedCount);
  const leads = toCount(candidate.aggregationLeadCount);
  const weak = toCount(candidate.aggregationWeakCount);
  const missingSlots = candidate.aggregationMissingSlots ?? [];
  const readinessBonus = getReadinessBonus(candidate.readinessTier);
  const evidenceBonus = confirmed * 5 + leads * 1 - weak * 4 - missingSlots.length * 5;
  const rankScore = clampScore(candidate.evidenceScore + readinessBonus + evidenceBonus);
  const rankLabel = rankScore >= 76 ? "优先继续查" : rankScore >= 52 ? "可以粗筛" : "先补证据";
  const missingLabel = missingSlots.length ? missingSlots.join(" / ") : "四类证据已覆盖";
  const nextAction = candidate.aggregationNextAction || candidate.readinessAdvice || "继续打开原始来源复核细节。";
  const rankReason = [
    candidate.readinessTitle || candidate.aggregationStatusLabel || "证据待补",
    `可采信 ${confirmed}`,
    `待复核 ${leads}`,
    `弱证据 ${weak}`,
    missingSlots.length ? `还缺 ${missingSlots.length} 类` : "证据槽已齐",
  ].join(" · ");

  return {
    ...candidate,
    rankScore,
    rankLabel,
    rankReason,
    missingLabel,
    nextAction,
  };
}

function getReadinessBonus(tier?: SchoolCandidateCompareVerdictTier) {
  if (tier === "ready-to-compare") return 18;
  if (tier === "can-screen") return 6;
  if (tier === "not-ready") return -18;
  return 0;
}

function toCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
