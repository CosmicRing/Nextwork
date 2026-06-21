export type SchoolRescueActionRunwayReadiness = "not-ready" | "can-screen" | "ready-to-compare";
export type SchoolRescueActionRunwayStepStatus = "ready" | "active" | "pending";
export type SchoolRescueActionRunwayAction = "open-evidence" | "save-candidate" | "copy-packet";

export type SchoolRescueActionRunwayInput = {
  knownSchool: boolean;
  entryCount: number;
  evidenceCount: number;
  readinessTier: SchoolRescueActionRunwayReadiness;
  salaryLabel: string;
  candidateCount: number;
};

export type SchoolRescueActionRunwayStep = {
  id: "entry" | "evidence" | "salary" | "compare";
  label: string;
  metric: string;
  hint: string;
  status: SchoolRescueActionRunwayStepStatus;
};

export type SchoolRescueActionRunway = {
  title: string;
  summary: string;
  primaryAction: SchoolRescueActionRunwayAction;
  primaryLabel: string;
  steps: SchoolRescueActionRunwayStep[];
};

export function buildSchoolRescueActionRunway({
  knownSchool,
  entryCount,
  evidenceCount,
  readinessTier,
  salaryLabel,
  candidateCount,
}: SchoolRescueActionRunwayInput): SchoolRescueActionRunway {
  const safeEntryCount = Math.max(0, Math.round(entryCount));
  const safeEvidenceCount = Math.max(0, Math.round(evidenceCount));
  const safeCandidateCount = Math.max(0, Math.round(candidateCount));
  const hasEntries = safeEntryCount > 0;
  const hasEvidence = safeEvidenceCount > 0;
  const hasSalary = Boolean(salaryLabel.trim());
  const hasCandidate = safeCandidateCount > 0;
  const evidenceReady = hasEvidence || readinessTier === "ready-to-compare";
  const primaryAction: SchoolRescueActionRunwayAction = !evidenceReady
    ? "open-evidence"
    : !hasCandidate
      ? "save-candidate"
      : "copy-packet";
  const title =
    primaryAction === "open-evidence"
      ? "先补证据箱"
      : primaryAction === "save-candidate"
        ? "把当前方案存入对比"
        : "可以带走信息包";
  const primaryLabel =
    primaryAction === "open-evidence"
      ? "补证据"
      : primaryAction === "save-candidate"
        ? "存入对比"
        : "复制信息包";
  const summary = [
    hasEntries ? "入口已就绪" : "入口待生成",
    knownSchool ? "命中学校样本" : "未收录也能查",
    hasEvidence ? `${safeEvidenceCount} 条证据` : "证据箱为空",
    hasSalary ? `工资 ${salaryLabel}` : "工资待方向",
  ].join(" · ");

  return {
    title,
    summary,
    primaryAction,
    primaryLabel,
    steps: [
      {
        id: "entry",
        label: "入口",
        metric: hasEntries ? `${safeEntryCount} 个` : "待生成",
        hint: knownSchool ? "官方入口和公开检索并用" : "先点官网、招生、专业、就业",
        status: hasEntries ? "ready" : "active",
      },
      {
        id: "evidence",
        label: "证据箱",
        metric: hasEvidence ? `${safeEvidenceCount} 条` : "待保存",
        hint: "把年份、数字、企业名存下来",
        status: hasEvidence ? "ready" : hasEntries ? "active" : "pending",
      },
      {
        id: "salary",
        label: "工资",
        metric: hasSalary ? salaryLabel : "待方向",
        hint: "工资只是岗位代理，不伪装成学校结论",
        status: hasSalary ? "ready" : hasEvidence ? "active" : "pending",
      },
      {
        id: "compare",
        label: "对比",
        metric: hasCandidate ? `${safeCandidateCount} 个候选` : "待保存",
        hint: "有证据后再横向比较",
        status: hasCandidate ? "ready" : evidenceReady ? "active" : "pending",
      },
    ],
  };
}
