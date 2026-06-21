export type SchoolActionCommandInput = {
  schoolName: string;
  majorName: string;
  jobName: string;
  knownSchool: boolean;
  officialEntryCount: number;
  publicMajorEntryCount: number;
  verifiedReportCount: number;
  companyEntryCount: number;
  salaryLabel: string;
};

export type SchoolActionCommandAction = {
  id: "major" | "report" | "job";
  label: string;
  detail: string;
  metric: string;
  tone: "primary" | "evidence" | "next";
};

export type SchoolActionCommand = {
  statusLabel: string;
  title: string;
  summary: string;
  evidenceScore: number;
  evidenceLabel: string;
  actions: SchoolActionCommandAction[];
};

export function buildSchoolActionCommand(input: SchoolActionCommandInput): SchoolActionCommand {
  const schoolName = input.schoolName.trim() || "目标学校";
  const majorName = input.majorName.trim();
  const jobName = input.jobName.trim();
  const salaryLabel = input.salaryLabel.trim();
  const hasDirection = Boolean(majorName || jobName);
  const evidenceScore = Math.min(
    100,
    (input.knownSchool ? 26 : 0) +
      Math.min(20, input.officialEntryCount * 8) +
      Math.min(16, input.publicMajorEntryCount * 2) +
      Math.min(24, input.verifiedReportCount * 24) +
      (hasDirection ? 10 : 0) +
      Math.min(14, input.companyEntryCount * 4),
  );

  return {
    statusLabel: input.knownSchool ? "已命中学校样本" : "未收录也能推进",
    title: hasDirection ? `${schoolName}：先核资料，再看岗位` : `${schoolName}：先把专业方向补上`,
    summary: buildSummary({ schoolName, majorName, jobName, salaryLabel, input }),
    evidenceScore,
    evidenceLabel: getEvidenceLabel(evidenceScore),
    actions: [
      buildMajorAction(input, hasDirection),
      buildReportAction(input),
      buildJobAction(input, hasDirection),
    ],
  };
}

function buildSummary({
  schoolName,
  majorName,
  jobName,
  salaryLabel,
  input,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  input: SchoolActionCommandInput;
}) {
  const direction = [majorName, jobName].filter(Boolean).join(" → ") || "先填专业或目标岗位";
  const salary = salaryLabel ? `，薪资参考 ${salaryLabel}` : "";
  const source = input.knownSchool
    ? `${input.officialEntryCount} 个官方入口`
    : `${input.publicMajorEntryCount} 个公开入口`;
  return `${schoolName} · ${direction}${salary}。当前先用 ${source} 起步，别等数据库收录后才查。`;
}

function buildMajorAction(input: SchoolActionCommandInput, hasDirection: boolean): SchoolActionCommandAction {
  if (!hasDirection) {
    return {
      id: "major",
      label: "先补专业名称",
      detail: "不要只比较学校名。先填一个专业，入口和岗位才会收敛。",
      metric: `${input.publicMajorEntryCount} 个入口`,
      tone: "primary",
    };
  }

  return {
    id: "major",
    label: "核对专业资料",
    detail: "打开专业目录、招生专业和培养方案，确认课程、校区和培养方向。",
    metric: `${input.officialEntryCount} 官方 / ${input.publicMajorEntryCount} 入口`,
    tone: "primary",
  };
}

function buildReportAction(input: SchoolActionCommandInput): SchoolActionCommandAction {
  if (input.verifiedReportCount > 0) {
    return {
      id: "report",
      label: "读取就业报告",
      detail: "优先看就业率、升学率、行业去向和签约单位，不只看宣传页。",
      metric: `${input.verifiedReportCount} 个报告源`,
      tone: "evidence",
    };
  }

  return {
    id: "report",
    label: "查就业质量报告",
    detail: "找近两年 PDF、信息公开页或就业网公告，先确认数据口径。",
    metric: "报告待核",
    tone: "evidence",
  };
}

function buildJobAction(input: SchoolActionCommandInput, hasDirection: boolean): SchoolActionCommandAction {
  if (input.companyEntryCount > 0) {
    return {
      id: "job",
      label: "打开企业官网岗位",
      detail: "用公司招聘页核对岗位要求、校招入口和薪资是否为官方披露。",
      metric: `${input.companyEntryCount} 家企业`,
      tone: "next",
    };
  }

  return {
    id: "job",
    label: hasDirection ? "补企业官网样本" : "用岗位雷达反推",
    detail: hasDirection ? "先从就业网和公开招聘页找企业，再回到官网岗位。" : "先输入岗位，让雷达反推出相关专业和公司入口。",
    metric: "下一步",
    tone: "next",
  };
}

function getEvidenceLabel(score: number) {
  if (score >= 70) return "可以开始比较";
  if (score >= 45) return "资料还要补";
  return "只适合起步";
}
