export type SchoolNextActionTask = {
  label: string;
  status: "open" | "search" | "verified";
  source: string;
  detail: string;
  url: string;
};

export type SchoolNextActionCandidate = {
  evidenceScore: number;
  evidenceLabel: string;
  missingEvidence: string[];
};

export type SchoolNextActionCoverage = {
  coveredCount: number;
  totalCount: number;
  nextMissingLabel: string;
};

export type SchoolNextActionKind =
  | "fill-direction"
  | "open-major"
  | "open-report"
  | "open-campus"
  | "open-salary"
  | "save-evidence"
  | "copy-packet";

export type SchoolNextAction = {
  kind: SchoolNextActionKind;
  statusLabel: string;
  title: string;
  detail: string;
  primaryLabel: string;
  secondaryLabel: string;
  url: string;
  evidenceTarget: string;
};

export function buildSchoolNextAction({
  majorName,
  jobName,
  candidate,
  tasks,
  checkedTaskKeys,
  coverage,
}: {
  majorName: string;
  jobName: string;
  candidate: SchoolNextActionCandidate;
  tasks: SchoolNextActionTask[];
  checkedTaskKeys: string[];
  coverage: SchoolNextActionCoverage;
}): SchoolNextAction {
  const hasDirection = Boolean(majorName.trim() || jobName.trim());
  if (!hasDirection) {
    return {
      kind: "fill-direction",
      statusLabel: "先别比较学校",
      title: "先补一个专业或目标岗位",
      detail: "不要只比较学校名。先写一个专业或岗位，入口、工资和企业官网才会收敛。",
      primaryLabel: "去填专业/岗位",
      secondaryLabel: "输入后刷新入口",
      url: "",
      evidenceTarget: "专业名或目标岗位",
    };
  }

  const firstOpenTask = pickNextOpenTask(candidate.missingEvidence, tasks, checkedTaskKeys);
  if (firstOpenTask) {
    return buildOpenTaskAction(firstOpenTask);
  }

  if (coverage.coveredCount < coverage.totalCount) {
    return {
      kind: "save-evidence",
      statusLabel: candidate.evidenceLabel,
      title: "把刚核到的内容收进本页",
      detail: `下一类还缺：${coverage.nextMissingLabel}。打开原始来源后，把报告数字、企业名或薪资口径粘到证据收件箱。`,
      primaryLabel: "去收证据",
      secondaryLabel: `${coverage.coveredCount}/${coverage.totalCount} 类已收`,
      url: "",
      evidenceTarget: coverage.nextMissingLabel,
    };
  }

  return {
    kind: "copy-packet",
    statusLabel: candidate.evidenceLabel,
    title: "可以带着查询包继续比较",
    detail: "四类证据已经覆盖，下一步复制入口、工资代理和证据摘要，拿去和另一所学校或专业对比。",
    primaryLabel: "复制查询包",
    secondaryLabel: `${candidate.evidenceScore}/100`,
    url: "",
    evidenceTarget: "查询包",
  };
}

function pickNextOpenTask(
  missingEvidence: string[],
  tasks: SchoolNextActionTask[],
  checkedTaskKeys: string[],
) {
  const uncheckedTasks = tasks.filter((task) => !checkedTaskKeys.includes(getTaskKey(task)));
  const missingText = missingEvidence.join(" ");

  if (/专业|招生/.test(missingText)) {
    return findTask(uncheckedTasks, /专业|招生/);
  }
  if (/就业质量报告|就业报告|报告/.test(missingText)) {
    return findTask(uncheckedTasks, /就业质量报告|就业报告|报告/);
  }
  if (/校招|宣讲|双选|企业名单|就业信息网/.test(missingText)) {
    return findTask(uncheckedTasks, /校招|宣讲|双选|就业信息网/);
  }
  if (/薪资|薪酬|岗位|企业官网/.test(missingText)) {
    return findTask(uncheckedTasks, /企业官网|岗位|薪资|薪酬/);
  }

  return uncheckedTasks[0] ?? null;
}

function buildOpenTaskAction(task: SchoolNextActionTask): SchoolNextAction {
  if (/就业质量报告|就业报告|报告/.test(task.label)) {
    return {
      kind: "open-report",
      statusLabel: task.status === "verified" ? "报告已定位" : "报告待核",
      title: "下一步只查就业质量报告",
      detail: "先拿年份、就业率、升学率、行业去向和样本口径，再决定这个专业值不值得继续看。",
      primaryLabel: "打开报告入口",
      secondaryLabel: task.source,
      url: task.url,
      evidenceTarget: "就业率 / 升学率 / 去向",
    };
  }

  if (/校招|宣讲|双选|就业信息网/.test(task.label)) {
    return {
      kind: "open-campus",
      statusLabel: "企业名单待核",
      title: "下一步只查校招企业",
      detail: "先看就业信息网、宣讲会或双选会，记录年份、企业名单和岗位类型。",
      primaryLabel: "打开校招入口",
      secondaryLabel: task.source,
      url: task.url,
      evidenceTarget: "企业名单 / 岗位类型",
    };
  }

  if (/企业官网|岗位|薪资|薪酬/.test(task.label)) {
    return {
      kind: "open-salary",
      statusLabel: "工资口径待核",
      title: "下一步只查企业官网岗位",
      detail: "先看企业官网校招、实习、岗位要求和薪资口径，不用第三方帖子当结论。",
      primaryLabel: "打开企业入口",
      secondaryLabel: task.source,
      url: task.url,
      evidenceTarget: "岗位要求 / 薪资",
    };
  }

  return {
    kind: "open-major",
    statusLabel: task.status === "open" ? "官方入口可打开" : "公开入口待核",
    title: "下一步只确认专业真实开设",
    detail: "先找到专业名称、所属学院、层次学制、招生年份和校区，再进入就业报告。",
    primaryLabel: "打开专业入口",
    secondaryLabel: task.source,
    url: task.url,
    evidenceTarget: "专业名称 / 学院 / 学制",
  };
}

function findTask(tasks: SchoolNextActionTask[], pattern: RegExp) {
  return tasks.find((task) => pattern.test(`${task.label} ${task.detail} ${task.source}`)) ?? null;
}

function getTaskKey(task: SchoolNextActionTask) {
  return `${task.label}::${task.url}`;
}

