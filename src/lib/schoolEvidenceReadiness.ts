export type SchoolEvidenceReadinessKind = "major" | "report" | "campus" | "salary";
export type SchoolEvidenceReadinessTier = "not-ready" | "can-screen" | "ready-to-compare";

export type SchoolEvidenceReadinessCandidate = {
  evidenceScore: number;
  evidenceLabel: string;
  missingEvidence: string[];
};

export type SchoolEvidenceReadiness = {
  tier: SchoolEvidenceReadinessTier;
  title: string;
  reason: string;
  score: number;
  confirmedKinds: string[];
  missingKinds: string[];
  primaryAdvice: string;
};

const evidenceKindLabels: Record<SchoolEvidenceReadinessKind, string> = {
  major: "专业存在",
  report: "就业报告",
  campus: "到校企业",
  salary: "岗位薪资",
};

const allEvidenceKinds: SchoolEvidenceReadinessKind[] = ["major", "report", "campus", "salary"];

export function buildSchoolEvidenceReadiness({
  majorName,
  jobName,
  candidate,
  evidenceKinds,
}: {
  majorName: string;
  jobName: string;
  candidate: SchoolEvidenceReadinessCandidate;
  evidenceKinds: SchoolEvidenceReadinessKind[];
}): SchoolEvidenceReadiness {
  const uniqueKinds = Array.from(new Set(evidenceKinds));
  const hasDirection = Boolean(majorName.trim() || jobName.trim());
  const confirmedKinds = allEvidenceKinds
    .filter((kind) => uniqueKinds.includes(kind))
    .map((kind) => evidenceKindLabels[kind]);
  const missingKinds = allEvidenceKinds
    .filter((kind) => !uniqueKinds.includes(kind))
    .map((kind) => evidenceKindLabels[kind]);
  const coverageScore = Math.round((confirmedKinds.length / allEvidenceKinds.length) * 100);
  const score = Math.round(candidate.evidenceScore * 0.55 + coverageScore * 0.45);

  if (!hasDirection) {
    return {
      tier: "not-ready",
      title: "现在还不能比较",
      reason: "先补专业或岗位，不要只比较学校名。没有方向时，就业率、工资和企业名单都无法收敛。",
      score: Math.min(score, 35),
      confirmedKinds,
      missingKinds,
      primaryAdvice: "先补专业/岗位，再打开入口",
    };
  }

  if (missingKinds.length === 0 && score >= 72) {
    return {
      tier: "ready-to-compare",
      title: "可以放进正式对比",
      reason: "四类证据都已覆盖，可以把这所学校和专业放进候选对比，再看另一所学校。",
      score,
      confirmedKinds,
      missingKinds,
      primaryAdvice: "复制查询包，拿去对比另一所学校",
    };
  }

  if (confirmedKinds.length >= 2 || candidate.evidenceScore >= 44) {
    return {
      tier: "can-screen",
      title: "可以先粗筛，不能下结论",
      reason: `已有 ${confirmedKinds.length} 类证据，还缺 ${missingKinds.join(" / ") || "原始来源复核"}。先用来排除明显不合适的方向，不要直接定志愿。`,
      score,
      confirmedKinds,
      missingKinds,
      primaryAdvice: "继续补齐缺口后再正式比较",
    };
  }

  return {
    tier: "not-ready",
    title: "现在还不能比较",
    reason: `证据太少：${candidate.missingEvidence[0] ?? "至少先拿到专业和就业报告两类证据"}。`,
    score,
    confirmedKinds,
    missingKinds,
    primaryAdvice: "先补专业目录和就业报告",
  };
}

