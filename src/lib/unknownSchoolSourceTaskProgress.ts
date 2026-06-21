import { getSchoolEvidencePacketTrustLevel } from "./schoolEvidencePacket";
import type { UnknownSchoolOfficialSourceTask } from "./unknownSchoolEntryPack";

export type UnknownSchoolSourceTaskProgressStatus = "done" | "needs-fields" | "missing";

export type UnknownSchoolSourceTaskEvidenceItem = {
  kind: string;
  title: string;
  detail: string;
  url: string;
};

export type UnknownSchoolSourceTaskProgressItem = {
  task: UnknownSchoolOfficialSourceTask;
  status: UnknownSchoolSourceTaskProgressStatus;
  statusLabel: string;
  detail: string;
  matchedTitle: string;
};

export type UnknownSchoolSourceTaskProgressSummary = {
  totalCount: number;
  doneCount: number;
  needsFieldsCount: number;
  missingCount: number;
  percentComplete: number;
  currentTaskId: UnknownSchoolOfficialSourceTask["id"] | "";
  currentTaskLabel: string;
  headline: string;
  nextAction: string;
  warning: string;
  copyText: string;
};

const statusLabels: Record<UnknownSchoolSourceTaskProgressStatus, string> = {
  done: "已完成",
  "needs-fields": "缺原文字段",
  missing: "缺证据",
};

export function buildUnknownSchoolSourceTaskProgress({
  tasks,
  items,
}: {
  tasks: UnknownSchoolOfficialSourceTask[];
  items: UnknownSchoolSourceTaskEvidenceItem[];
}): UnknownSchoolSourceTaskProgressItem[] {
  return tasks.map((task) => {
    const relatedItems = items.filter((item) => isEvidenceRelatedToTask(item, task));
    const trustedItem = relatedItems.find((item) => getSchoolEvidencePacketTrustLevel(item) !== "weak");
    if (trustedItem) {
      return buildProgressItem(task, "done", `已保存：${trustedItem.title}`, trustedItem.title);
    }

    const weakItem = relatedItems.find((item) => getSchoolEvidencePacketTrustLevel(item) === "weak");
    if (weakItem) {
      return buildProgressItem(task, "needs-fields", `入口已保存，补齐 ${task.saveFields.join(" / ")} 后才计入。`, weakItem.title);
    }

    return buildProgressItem(task, "missing", `还缺：${task.saveFields.slice(0, 3).join(" / ")}。`, "");
  });
}

export function summarizeUnknownSchoolSourceTaskProgress(
  progressItems: UnknownSchoolSourceTaskProgressItem[],
): UnknownSchoolSourceTaskProgressSummary {
  const totalCount = progressItems.length;
  const doneCount = progressItems.filter((item) => item.status === "done").length;
  const needsFieldsCount = progressItems.filter((item) => item.status === "needs-fields").length;
  const missingCount = progressItems.filter((item) => item.status === "missing").length;
  const percentComplete = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const currentItem = progressItems.find((item) => item.status !== "done");

  if (!currentItem) {
    const copyText = `普通学校证据进度：${doneCount}/${totalCount} 已完成。下一步：证据闭环已形成，可以拿去横向比较专业和岗位。`;
    return {
      totalCount,
      doneCount,
      needsFieldsCount,
      missingCount,
      percentComplete,
      currentTaskId: "",
      currentTaskLabel: "全部完成",
      headline: "证据闭环可进入对比",
      nextAction: "已经拿到学校、专业、就业、到校企业和岗位薪资证据，可以拿去横向比较。",
      warning: "",
      copyText,
    };
  }

  const fields = currentItem.task.saveFields.slice(0, 4).join(" / ");
  const headline = currentItem.status === "needs-fields"
    ? `补齐${currentItem.task.label}字段`
    : `先${currentItem.task.label}`;
  const nextAction = currentItem.status === "needs-fields"
    ? `已保存入口，但还不能当结论；补齐 ${fields} 后再计入进度。`
    : `先打开 ${currentItem.task.source}，保存 ${fields}。`;
  const warning = needsFieldsCount
    ? `${needsFieldsCount} 项弱证据只算入口，不算结论；必须补原文字段。`
    : "";
  const copyText = [
    `普通学校证据进度：${doneCount}/${totalCount} 已完成`,
    needsFieldsCount ? `弱证据：${needsFieldsCount} 项` : "",
    missingCount ? `缺证据：${missingCount} 项` : "",
    `当前任务：${currentItem.task.label}`,
    `下一步：${nextAction}`,
  ].filter(Boolean).join("；");

  return {
    totalCount,
    doneCount,
    needsFieldsCount,
    missingCount,
    percentComplete,
    currentTaskId: currentItem.task.id,
    currentTaskLabel: currentItem.task.label,
    headline,
    nextAction,
    warning,
    copyText,
  };
}

function buildProgressItem(
  task: UnknownSchoolOfficialSourceTask,
  status: UnknownSchoolSourceTaskProgressStatus,
  detail: string,
  matchedTitle: string,
): UnknownSchoolSourceTaskProgressItem {
  return {
    task,
    status,
    statusLabel: statusLabels[status],
    detail,
    matchedTitle,
  };
}

function isEvidenceRelatedToTask(item: UnknownSchoolSourceTaskEvidenceItem, task: UnknownSchoolOfficialSourceTask) {
  if (item.kind !== task.evidenceKind) return false;

  const haystack = normalizeSearchText([item.title, item.detail, item.url].join(" "));
  if (haystack.includes(normalizeSearchText(task.label))) return true;

  const keywords = getTaskMatchKeywords(task);
  const hitCount = keywords.filter((keyword) => haystack.includes(normalizeSearchText(keyword))).length;

  if (task.id === "verify-school" || task.id === "verify-major") {
    return hitCount >= 1;
  }

  const contextKeywords = getTaskContextKeywords(task);
  const contextHitCount = contextKeywords.filter((keyword) => haystack.includes(normalizeSearchText(keyword))).length;
  return hitCount >= 1 && contextHitCount >= 1;
}

function getTaskMatchKeywords(task: UnknownSchoolOfficialSourceTask) {
  if (task.id === "verify-school") {
    return ["学校全称", "官方网址", "招生网址", "办学层次", "院校库", "学校官网", "招生网"];
  }

  if (task.id === "verify-major") {
    return ["专业名", "专业名称", "学院/系部", "招生专业", "专业介绍", "培养方案", "核心课程", "专业设置"];
  }

  return [task.label, task.stage, task.source, task.proofTarget, ...task.saveFields];
}

function getTaskContextKeywords(task: UnknownSchoolOfficialSourceTask) {
  const queryTerms = [task.query, task.siteQuery ?? ""]
    .join(" ")
    .split(/\s+/)
    .map((term) => term.replace(/^site:/i, "").trim())
    .filter(Boolean);
  const commonTerms = new Set([
    "2025",
    "2024",
    "pdf",
    "site",
    "com",
    "cn",
    "edu",
    "www",
    "官网",
    "官方",
    "岗位",
    "薪资",
    "校招",
    "招聘",
    "校园招聘",
    "宣讲会",
    "双选会",
    "就业率",
    "升学率",
    "就业质量报告",
    "就业信息网",
    "专业介绍",
    "培养方案",
    "核心课程",
    "信息公开",
  ]);

  return Array.from(new Set(queryTerms))
    .filter((term) => term.length >= 2)
    .filter((term) => !commonTerms.has(term));
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}
