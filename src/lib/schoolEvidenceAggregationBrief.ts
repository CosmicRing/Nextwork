import { getSchoolEvidencePacketTrustLevel } from "./schoolEvidencePacket";

export type SchoolEvidenceAggregationKind = "major" | "report" | "campus" | "salary";
export type SchoolEvidenceAggregationStatus = "not-ready" | "can-screen" | "ready-to-compare";

export type SchoolEvidenceAggregationItem = {
  kind: string;
  title: string;
  detail: string;
  url: string;
};

export type SchoolEvidenceAggregationBrief = {
  title: string;
  status: SchoolEvidenceAggregationStatus;
  statusLabel: string;
  confirmedLines: string[];
  leadLines: string[];
  weakLines: string[];
  missingSlots: string[];
  nextActions: string[];
  copyText: string;
};

const evidenceSlotLabels: Record<SchoolEvidenceAggregationKind, string> = {
  major: "专业存在",
  report: "就业报告",
  campus: "到校企业",
  salary: "岗位薪资",
};

const evidenceSlotOrder: SchoolEvidenceAggregationKind[] = ["major", "report", "campus", "salary"];

export function buildSchoolEvidenceAggregationBrief({
  schoolName,
  majorName,
  jobName,
  items,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  items: SchoolEvidenceAggregationItem[];
}): SchoolEvidenceAggregationBrief {
  const normalizedSchoolName = schoolName.trim() || "目标学校";
  const direction = [majorName.trim(), jobName.trim()].filter(Boolean).join(" -> ") || "未填写专业/岗位";
  const confirmedLines: string[] = [];
  const leadLines: string[] = [];
  const weakLines: string[] = [];
  const trustedKinds = new Set<SchoolEvidenceAggregationKind>();

  items.slice(0, 12).forEach((item) => {
    const line = formatEvidenceLine(item);
    const trustLevel = getSchoolEvidencePacketTrustLevel(item);
    const kind = normalizeEvidenceKind(item.kind);

    if (trustLevel === "official") {
      confirmedLines.push(line);
      if (kind) trustedKinds.add(kind);
      return;
    }

    if (trustLevel === "weak") {
      weakLines.push(line);
      return;
    }

    leadLines.push(line);
    if (kind) trustedKinds.add(kind);
  });

  const missingSlots = evidenceSlotOrder.filter((kind) => !trustedKinds.has(kind)).map((kind) => evidenceSlotLabels[kind]);
  const status = getAggregationStatus(trustedKinds.size);
  const statusLabel =
    status === "ready-to-compare" ? "四类证据齐了，可以进入对比" : status === "can-screen" ? "能先粗筛，不能下最终结论" : "只能起步，先补公开资料";
  const nextActions = buildNextActions(missingSlots, weakLines.length);
  const title = `${normalizedSchoolName}公开资料聚合简报`;
  const copyText = [
    title,
    `方向：${direction}`,
    `状态：${statusLabel}`,
    "",
    "可采信证据：",
    ...(confirmedLines.length ? confirmedLines : ["暂无；先打开学校官网、就业网或企业官网保存原始链接。"]),
    "",
    "待复核线索：",
    ...(leadLines.length ? leadLines : ["暂无。"]),
    "",
    "弱证据：",
    ...(weakLines.length ? weakLines : ["暂无。"]),
    "",
    "缺口：",
    ...(missingSlots.length ? missingSlots.map((slot) => `- ${slot}`) : ["四类证据已覆盖。"]),
    "",
    "下一步：",
    ...nextActions.map((action) => `- ${action}`),
  ].join("\n");

  return {
    title,
    status,
    statusLabel,
    confirmedLines,
    leadLines,
    weakLines,
    missingSlots,
    nextActions,
    copyText,
  };
}

function normalizeEvidenceKind(kind: string): SchoolEvidenceAggregationKind | null {
  if (kind === "major" || kind === "report" || kind === "campus" || kind === "salary") return kind;
  return null;
}

function getAggregationStatus(coveredCount: number): SchoolEvidenceAggregationStatus {
  if (coveredCount >= 4) return "ready-to-compare";
  if (coveredCount >= 2) return "can-screen";
  return "not-ready";
}

function buildNextActions(missingSlots: string[], weakCount: number) {
  const actions = missingSlots.length
    ? missingSlots.slice(0, 3).map((slot) => `继续补${slot}，优先找学校官网、就业网、就业质量报告或企业招聘官网。`)
    : ["复制这份简报，拿去和另一所学校同专业做横向比较。"];

  if (weakCount) actions.push("弱证据不能当结论，只能当搜索线索继续回到官方来源复核。");
  if (missingSlots.length === evidenceSlotOrder.length) actions.unshift("先打开学校官网、招生网、就业信息网和近两年就业质量报告。");

  return actions;
}

function formatEvidenceLine(item: SchoolEvidenceAggregationItem) {
  const parts = [item.title.trim() || "未命名证据"];
  if (item.url.trim()) parts.push(item.url.trim());
  if (item.detail.trim()) parts.push(truncateText(item.detail.trim(), 96));
  return parts.join(" | ");
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}
