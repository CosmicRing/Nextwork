const {
  schools,
  ordinarySchoolRescue,
  ordinaryMajorPresets,
  buildOrdinarySchoolRescuePacket,
} = require("../../utils/sample-data");

function buildRescuePacketForQuery(query, majorName, cityHint) {
  return buildOrdinarySchoolRescuePacket(query, majorName, cityHint);
}

function getKnownSchoolOfficialLink(school, kinds) {
  if (!school || !Array.isArray(school.officialLinks)) return null;
  for (const kind of kinds) {
    const matched = school.officialLinks.find((link) => link.kind === kind);
    if (matched) return matched;
  }
  return null;
}

function rebuildRescuePacketCopyText(packet) {
  const authorityRoutes = Array.isArray(packet.authorityRoutes) ? packet.authorityRoutes : [];
  const typeStrategy = packet.typeStrategy || null;
  const typeStrategyActions = Array.isArray(packet.typeStrategyActions) ? packet.typeStrategyActions : [];
  const salaryDirections = Array.isArray(packet.salaryDirections) ? packet.salaryDirections : [];
  const cityEvidenceActions = Array.isArray(packet.cityEvidenceActions) ? packet.cityEvidenceActions : [];
  const careerSignalDigest = packet.careerSignalDigest || null;
  const copyText = [
    `${packet.targetSchoolName} 普通学校公开入口包`,
    `目标专业：${packet.targetMajorName}`,
    packet.targetCityName ? `城市线索：${packet.targetCityName}` : "城市线索：待补充",
    ...(typeStrategy
      ? [
          "院校类型策略",
          `${typeStrategy.label}：${typeStrategy.firstMove}`,
          `搜索重点：${typeStrategy.searchFocus.join("、")}`,
          `风险提醒：${typeStrategy.warnings.join("、")}`,
        ]
      : []),
    ...(typeStrategyActions.length
      ? [
          "类型专属检索入口",
          ...typeStrategyActions.map((action) => `${action.label}：${action.query}｜${action.url}｜保存到：${action.evidenceSlot}`),
        ]
      : []),
    ...(salaryDirections.length
      ? [
          "岗位薪资方向桥",
          ...salaryDirections.map((direction) => `${direction.title}：${direction.salary}｜企业/机构：${direction.companyText}｜入口：${direction.url}｜${direction.updateRule}`),
          "公司官网入口包",
          ...salaryDirections.flatMap((direction) =>
            (direction.companyEntrances || []).map(
              (company) => `${direction.title}：${company.name}｜${company.cnName}｜${company.officialEntrance}｜薪资参考：${company.salary}`,
            ),
          ),
          "本地机会入口包",
          ...salaryDirections.flatMap((direction) =>
            (direction.localOpportunityChannels || []).map(
              (channel) => `${direction.title}：${channel.label}｜${channel.source}｜${channel.url}｜保存到：${channel.evidenceSlot}`,
            ),
          ),
        ]
      : []),
    ...(cityEvidenceActions.length
      ? [
          "城市证据动作清单",
          ...cityEvidenceActions.map(
            (action) => `${action.label}：${action.query}｜${action.url}｜保存到：${action.evidenceSlot}｜字段：${action.saveFields.join("、")}`,
          ),
        ]
      : []),
    ...(careerSignalDigest
      ? [
          "职业信号摘要",
          `${careerSignalDigest.title}｜${careerSignalDigest.salaryLabel}｜${careerSignalDigest.sourceCoverageText}`,
          `信号机会：${careerSignalDigest.opportunity}`,
          `信号风险：${careerSignalDigest.risk}`,
          `下一步：${careerSignalDigest.nextActions.join(" / ")}`,
        ]
      : []),
    ...(authorityRoutes.length
      ? [
          "权威入口阶梯",
          ...authorityRoutes.map((route) => `${route.tier}：${route.source}｜${route.url}｜用途：${route.useFor}`),
        ]
      : []),
    ...packet.entryGroups.map((entry) => `${entry.label}：${entry.source}｜${entry.url}｜保存：${entry.saveFields.join("、")}`),
    "核验顺序：验学校 -> 验专业 -> 抓就业报告 -> 抓到校企业 -> 补岗位薪资",
    "薪资为岗位市场参考，不等于学校官方承诺；展示时必须标注来源和更新时间。",
  ].join("\n");

  return {
    ...packet,
    targetCityName: packet.targetCityName || "",
    typeStrategy,
    typeStrategyActions,
    salaryDirections,
    cityEvidenceActions,
    careerSignalDigest,
    authorityRoutes,
    copyText,
    packetLines: copyText.split("\n"),
  };
}

function resolveTargetMajorName(state) {
  const manualMajor = (state.majorQuery || "").trim();
  if (manualMajor) return manualMajor;
  if (state.selectedMajor && state.selectedMajor.name) return state.selectedMajor.name;
  if (state.selectedSchool && state.selectedSchool.majors && state.selectedSchool.majors[0]) {
    return state.selectedSchool.majors[0].name;
  }
  return state.targetMajorName || "目标专业";
}

function findSelectedMajorForTarget(school, targetMajorName) {
  if (!school || !Array.isArray(school.majors)) return null;
  if (!targetMajorName || targetMajorName === "目标专业") return school.majors[0] || null;
  return school.majors.find((major) => major.name === targetMajorName) || school.majors[0] || null;
}

function buildKnownSchoolRescuePacket(school, majorName, cityHint) {
  const packet = buildRescuePacketForQuery(school.name, majorName, cityHint || school.city);
  const officialLinksByLabel = {
    学校主体: getKnownSchoolOfficialLink(school, ["学校", "招生"]),
    专业资料: getKnownSchoolOfficialLink(school, ["专业", "招生"]),
    到校招聘: getKnownSchoolOfficialLink(school, ["就业"]),
  };
  const entryGroups = packet.entryGroups.map((entry) => {
    const officialLink = officialLinksByLabel[entry.label];
    if (!officialLink) return entry;

    return {
      ...entry,
      source: `${officialLink.label}（已收录官方入口）`,
      url: officialLink.url,
      action: `先打开${officialLink.label}，${entry.action}`,
    };
  });

  return rebuildRescuePacketCopyText({
    ...packet,
    entryGroups,
  });
}

function rebuildActiveRescuePacket(state) {
  const targetMajorName = resolveTargetMajorName(state);
  if (!state.isUnknownSchool && state.selectedSchool) {
    return buildKnownSchoolRescuePacket(state.selectedSchool, targetMajorName, state.cityQuery);
  }

  const targetSchoolName = state.isUnknownSchool
    ? state.unknownSchoolName
    : state.selectedSchool
      ? state.selectedSchool.name
      : state.query || "目标学校";
  return buildRescuePacketForQuery(targetSchoolName, targetMajorName, state.cityQuery);
}

function buildEvidenceStorageScope(packet) {
  return `${packet.targetSchoolName}:${packet.targetMajorName}:${packet.targetCityName || "未填城市"}`;
}

function buildLegacyEvidenceStorageScope(packet) {
  return `${packet.targetSchoolName}:${packet.targetMajorName}`;
}

function buildEvidenceProgressStorageKey(packet) {
  return `kankanSalary:evidenceProgress:${buildEvidenceStorageScope(packet)}`;
}

function buildLegacyEvidenceProgressStorageKey(packet) {
  return `kankanSalary:evidenceProgress:${buildLegacyEvidenceStorageScope(packet)}`;
}

const EVIDENCE_INBOX_STORAGE_PREFIX = "kankanSalary:evidenceInbox";
const SAVED_CANDIDATE_STORAGE_KEY = "kankanSalary:savedCandidates:v1";
const evidenceInboxLimit = 20;
const savedCandidateLimit = 4;
const evidenceTextStorageLimit = 820;

const evidenceSlotByTaskTitle = {
  验学校: "学校主体",
  验专业: "专业资料",
  抓报告: "就业报告",
  抓企业: "到校招聘",
  补薪资: "岗位薪资",
};

const cityScopedEvidenceSlotLabels = new Set(["岗位薪资", "到校招聘"]);

const authorityTierToEvidenceLabel = {
  身份核验: "学校主体",
  官网定位: "学校主体",
  专业开设: "专业资料",
  就业报告: "就业报告",
  到校招聘: "到校招聘",
  薪资交叉: "岗位薪资",
};

const candidateCoreTaskTitles = ["验学校", "验专业", "补薪资"];
const candidateContextTaskTitles = ["抓报告", "抓企业"];

function getEvidenceSlotLabelByTaskTitle(taskTitle) {
  return evidenceSlotByTaskTitle[taskTitle] || taskTitle;
}

function buildCurrentCandidateReadiness(progress) {
  const completedTaskTitles = new Set(progress.filter((task) => task.done).map((task) => task.title));
  const missingCoreTasks = candidateCoreTaskTitles.filter((taskTitle) => !completedTaskTitles.has(taskTitle));
  const missingContextTasks = candidateContextTaskTitles.filter((taskTitle) => !completedTaskTitles.has(taskTitle));
  const missingCoreLabels = missingCoreTasks.map(getEvidenceSlotLabelByTaskTitle);
  const missingContextLabels = missingContextTasks.map(getEvidenceSlotLabelByTaskTitle);

  if (missingCoreLabels.length > 0) {
    return {
      level: "blocked",
      title: "暂不建议比较",
      summary: `核心缺口：${missingCoreLabels.join("、")}；先补齐核心证据，否则普通学校容易被营销话术带偏。`,
      missingLabels: missingCoreLabels,
      nextAction: buildProgressBriefNextAction(progress),
    };
  }

  if (missingContextLabels.length > 0) {
    return {
      level: "screenable",
      title: "可先初筛",
      summary: `已经有学校、专业和薪资证据；还缺${missingContextLabels.join("、")}，先保存候选再继续补就业去向。`,
      missingLabels: missingContextLabels,
      nextAction: `继续补${missingContextLabels.join("、")}，再和其他学校专业横向比较。`,
    };
  }

  return {
    level: "ready",
    title: "证据较完整",
    summary: "学校主体、专业资料、就业报告、到校招聘和岗位薪资都有可信证据，可以进入候选对比。",
    missingLabels: [],
    nextAction: "保存当前候选，与其他学校专业横向比较。",
  };
}

function buildEvidenceInboxStorageKey(packet) {
  return `${EVIDENCE_INBOX_STORAGE_PREFIX}:${buildEvidenceStorageScope(packet)}`;
}

function buildLegacyEvidenceInboxStorageKey(packet) {
  return `${EVIDENCE_INBOX_STORAGE_PREFIX}:${buildLegacyEvidenceStorageScope(packet)}`;
}

function buildEvidenceTaskId(task) {
  return task.title;
}

function readCheckedEvidenceTaskIds(packet) {
  try {
    const saved = wx.getStorageSync(buildEvidenceProgressStorageKey(packet));
    if (Array.isArray(saved)) return saved.filter((item) => typeof item === "string");
    if (packet.targetCityName) return [];
    const legacySaved = wx.getStorageSync(buildLegacyEvidenceProgressStorageKey(packet));
    return Array.isArray(legacySaved) ? legacySaved.filter((item) => typeof item === "string") : [];
  } catch (error) {
    return [];
  }
}

function writeCheckedEvidenceTaskIds(packet, checkedIds) {
  try {
    wx.setStorageSync(buildEvidenceProgressStorageKey(packet), checkedIds);
  } catch (error) {
    // Storage can be unavailable in devtools or private contexts; keep in-memory progress usable.
  }
}

function sanitizeEvidenceInboxItems(input) {
  return Array.isArray(input)
    ? input
        .filter((item) => item && typeof item === "object" && typeof item.id === "string" && typeof item.text === "string")
        .slice(0, evidenceInboxLimit)
    : [];
}

function evidenceItemMatchesPacketCity(packet, item) {
  const cityName = packet.targetCityName || "";
  if (!cityName || !cityScopedEvidenceSlotLabels.has(item.slotLabel)) return true;
  return [item.text, item.title, item.sourceHint].some((field) => typeof field === "string" && field.includes(cityName));
}

function readEvidenceInboxItems(packet) {
  try {
    const saved = sanitizeEvidenceInboxItems(wx.getStorageSync(buildEvidenceInboxStorageKey(packet)));
    if (saved.length) return saved;
    return sanitizeEvidenceInboxItems(wx.getStorageSync(buildLegacyEvidenceInboxStorageKey(packet))).filter((item) =>
      evidenceItemMatchesPacketCity(packet, item),
    );
  } catch (error) {
    return [];
  }
}

function writeEvidenceInboxItems(packet, items) {
  try {
    wx.setStorageSync(buildEvidenceInboxStorageKey(packet), items.slice(0, evidenceInboxLimit));
  } catch (error) {
    // Keep the current session usable even if local storage is blocked.
  }
}

function sanitizeSavedCandidates(input) {
  return Array.isArray(input)
    ? input
        .filter((item) => item && typeof item === "object" && typeof item.key === "string")
        .slice(0, savedCandidateLimit)
    : [];
}

function readSavedCandidates() {
  try {
    return sanitizeSavedCandidates(wx.getStorageSync(SAVED_CANDIDATE_STORAGE_KEY));
  } catch (error) {
    return [];
  }
}

function writeSavedCandidates(candidates) {
  try {
    wx.setStorageSync(SAVED_CANDIDATE_STORAGE_KEY, candidates.slice(0, savedCandidateLimit));
  } catch (error) {
    // Local storage failures should not block the current comparison list.
  }
}

function buildEvidenceProgress(packet, checkedIds) {
  return packet.evidenceTasks.map((task) => {
    const id = buildEvidenceTaskId(task);
    return {
      ...task,
      id,
      done: checkedIds.includes(id),
    };
  });
}

function summarizeEvidenceProgress(progress) {
  const total = progress.length;
  const done = progress.filter((task) => task.done).length;
  return {
    evidenceProgressText: `${done}/${total} 已完成`,
    evidenceProgressPercent: total ? Math.round((done / total) * 100) : 0,
  };
}

function buildProgressBriefNextAction(progress) {
  const nextTask = progress.find((task) => !task.done);
  return nextTask
    ? `下一步：${nextTask.title}，${nextTask.check}`
    : "下一步：证据闭环已完成，可以复制简报去横向比较学校和专业。";
}

function buildProgressBriefText(packet, progress, summary) {
  const doneTasks = progress.filter((task) => task.done).map((task) => task.title);
  const missingTasks = progress.filter((task) => !task.done).map((task) => task.title);
  return [
    `${packet.targetSchoolName} 信息聚合进度简报`,
    `目标专业：${packet.targetMajorName}`,
    `进度：${summary.evidenceProgressText}`,
    `已完成：${doneTasks.length ? doneTasks.join("、") : "暂无"}`,
    `待补齐：${missingTasks.length ? missingTasks.join("、") : "暂无"}`,
    buildProgressBriefNextAction(progress),
    "说明：薪资为岗位市场参考，不等于学校官方承诺；展示时必须标注来源和更新时间。",
  ].join("\n");
}

function isCredibleEvidenceText(text) {
  return /官网|官方网站|信息公开|就业质量报告|就业信息网|招生网|教育部|阳光高考|企业官网|招聘官网|宣讲会|双选会|http|https|\.edu\.cn|careers/i.test(text);
}

function stripEvidenceCaptureInstructions(text) {
  return text
    .replace(/复制公开页面里的[^。；;]*[。；;]?/g, " ")
    .replace(/保留来源名称、页面标题和更新时间[。；;]?/g, " ")
    .trim();
}

function getEvidenceCaptureExcerptText(text) {
  const marker = "摘录：";
  const markerIndex = text.indexOf(marker);
  return markerIndex >= 0 ? text.slice(markerIndex + marker.length) : text;
}

function hasExtractedEvidenceFact(text) {
  const factText = stripEvidenceCaptureInstructions(text);
  if (!factText) return false;
  return (
    /20\d{2}(?:[-年/.]\d{1,2}(?:[-月/.]\d{1,2})?|届)/.test(factText) ||
    /\d+(?:\.\d+)?%/.test(factText) ||
    /(?:企业|单位|参会企业|用人单位)[:：]\s*\S/.test(factText) ||
    /(?:岗位|职位)[:：]\s*\S/.test(factText) ||
    /(?:薪资|月薪|工资|待遇)[:：]?\s*\d|\d+(?:\.\d+)?\s*[kK千]|\d{3,6}\s*[-~至]\s*\d{3,6}\s*元/.test(factText) ||
    /(?:主管部门|办学层次|官网域名)[:：]\s*\S/.test(factText) ||
    /(?:学院|系部|学制|核心课程|主干课程|培养目标)[:：]?\s*\S/.test(factText)
  );
}

function isEvidenceCaptureTemplateOnly(text) {
  const hasTemplateMarkers =
    text.includes("证据槽：") &&
    text.includes("推荐来源：") &&
    text.includes("保存字段：") &&
    text.includes("摘录：");
  if (!hasTemplateMarkers) return false;
  return !hasExtractedEvidenceFact(getEvidenceCaptureExcerptText(text));
}

function extractEvidenceYears(text) {
  const matches = (text || "").match(/20\d{2}/g) || [];
  return Array.from(new Set(matches.map((yearText) => Number(yearText)).filter((year) => Number.isFinite(year))));
}

function buildFreshnessState(text, slotLabel, baseTrustState) {
  if (slotLabel !== "岗位薪资" && slotLabel !== "到校招聘") return baseTrustState;
  if (baseTrustState.trustStatus !== "verified") return baseTrustState;

  const years = extractEvidenceYears(text);
  const currentYear = new Date().getFullYear();
  const minFreshYear = currentYear - 1;
  const hasFreshYear = years.some((year) => year >= minFreshYear && year <= currentYear + 1);
  if (hasFreshYear) return baseTrustState;

  return {
    trustStatus: "pending",
    trustLabel: "待核验",
    sourceHint: years.length
      ? `薪资/招聘证据已过期：请补${minFreshYear}年以后官网岗位、就业网或招聘会原文后再计入进度`
      : `薪资/招聘证据缺少日期：请补${minFreshYear}年以后官网岗位、就业网或招聘会原文后再计入进度`,
  };
}

function normalizeEvidenceContextText(value) {
  return (value || "").toLowerCase().replace(/\s+/g, "");
}

function splitEvidenceContextTerms(value) {
  return (value || "")
    .split(/[\/／、,，;；|｜\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMeaningfulEvidenceContextTerms(values) {
  const ignoredTerms = new Set(["目标学校", "目标专业", "待补城市", "未填城市", "岗位薪资", "校招", "岗位", "薪资"]);
  return Array.from(new Set(values.flatMap(splitEvidenceContextTerms)))
    .filter((term) => term.length >= 2 && !ignoredTerms.has(term));
}

function evidenceTextIncludesAnyContext(text, terms) {
  const haystack = normalizeEvidenceContextText(text);
  return terms.some((term) => haystack.includes(normalizeEvidenceContextText(term)));
}

function extractEvidenceHostTerms(url) {
  if (!url || /(?:bing|baidu)\.com/i.test(url)) return [];
  const match = String(url).trim().match(/^(?:https?:\/\/)?([^/?#]+)/i);
  if (!match) return [];
  const host = match[1].toLowerCase().replace(/^www\./, "");
  const root = host.split(".")[0];
  return [host, root].filter((item) => item && item.length >= 3);
}

function extractEvidenceDomainTermsFromText(text) {
  const matches = text.match(/https?:\/\/[a-z0-9.-]+\/?|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi) || [];
  return getMeaningfulEvidenceContextTerms(
    matches.flatMap((match) => {
      if (/^https?:\/\//i.test(match)) return extractEvidenceHostTerms(match);
      const host = match.toLowerCase().replace(/^www\./, "").replace(/\/$/, "");
      const root = host.split(".")[0];
      return [host, root].filter((item) => item && item.length >= 3);
    }),
  );
}

function getPacketOfficialDomainTerms(packet) {
  const entryUrls = Array.isArray(packet.entryGroups)
    ? packet.entryGroups.map((entry) => entry.url)
    : [];
  return getMeaningfulEvidenceContextTerms(entryUrls.flatMap(extractEvidenceHostTerms));
}

function evidenceTextIncludesKnownOfficialDomain(text, officialDomainTerms) {
  const textDomainTerms = extractEvidenceDomainTermsFromText(text).map(normalizeEvidenceContextText);
  const officialTerms = officialDomainTerms.map(normalizeEvidenceContextText);
  return textDomainTerms.some((textTerm) => officialTerms.some((officialTerm) => textTerm === officialTerm || textTerm.includes(officialTerm)));
}

function evidenceTextMatchesPacketOfficialEntry(packet, text) {
  const entryUrls = Array.isArray(packet.entryGroups)
    ? packet.entryGroups.map((entry) => entry.url)
    : [];
  const officialTerms = getMeaningfulEvidenceContextTerms(entryUrls.flatMap(extractEvidenceHostTerms));
  return evidenceTextIncludesKnownOfficialDomain(text, officialTerms);
}

function hasExplicitDifferentSchoolName(packet, text) {
  const expectedSchoolName = (packet.targetSchoolName || "").trim();
  if (!expectedSchoolName) return false;
  const match = text.match(/学校全称[:：]\s*([^｜|，,。；;\s]+)/);
  if (!match) return false;
  return !normalizeEvidenceContextText(match[1]).includes(normalizeEvidenceContextText(expectedSchoolName));
}

function buildEvidenceContextTrustState(packet, text, slotLabel, baseTrustState) {
  if (!packet || baseTrustState.trustStatus !== "verified") return baseTrustState;

  const schoolTerms = getMeaningfulEvidenceContextTerms([packet.targetSchoolName]);
  const officialDomainTerms = getPacketOfficialDomainTerms(packet);
  const majorTerms = getMeaningfulEvidenceContextTerms([packet.targetMajorName]);
  const cityTerms = getMeaningfulEvidenceContextTerms([packet.targetCityName]);
  const salaryDirectionTerms = getMeaningfulEvidenceContextTerms(
    Array.isArray(packet.salaryDirections) ? packet.salaryDirections.map((direction) => direction.title) : [],
  );
  const directionTerms = getMeaningfulEvidenceContextTerms([...majorTerms, ...salaryDirectionTerms]);
  const hasSchool =
    evidenceTextIncludesAnyContext(text, schoolTerms) ||
    evidenceTextIncludesAnyContext(text, officialDomainTerms) ||
    evidenceTextIncludesKnownOfficialDomain(text, officialDomainTerms);
  const hasDirection = evidenceTextIncludesAnyContext(text, directionTerms);
  const hasCity = evidenceTextIncludesAnyContext(text, cityTerms);

  let matchesCurrentContext = true;
  if (slotLabel === "学校主体") {
    const hasCurrentSchoolIdentity = evidenceTextIncludesAnyContext(text, schoolTerms) || evidenceTextMatchesPacketOfficialEntry(packet, text);
    matchesCurrentContext = !hasExplicitDifferentSchoolName(packet, text) && (!schoolTerms.length || hasCurrentSchoolIdentity);
  } else if (slotLabel === "专业资料") {
    matchesCurrentContext = (!majorTerms.length || hasDirection) && (!schoolTerms.length || hasSchool || hasDirection);
  } else if (slotLabel === "就业报告") {
    matchesCurrentContext = !schoolTerms.length || hasSchool || hasDirection;
  } else if (slotLabel === "到校招聘") {
    matchesCurrentContext = hasSchool || hasDirection;
  } else if (slotLabel === "岗位薪资") {
    matchesCurrentContext = (!cityTerms.length || hasCity) && (!directionTerms.length || hasDirection);
  }

  if (matchesCurrentContext) return baseTrustState;

  return {
    trustStatus: "pending",
    trustLabel: "待核验",
    sourceHint: "与当前学校/专业/城市不匹配：请粘贴当前学校、专业、城市或岗位方向的官网原文后再计入进度",
  };
}

function classifyEvidenceDraft(text, packet) {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const lowerText = normalizedText.toLowerCase();
  const isTemplateOnly = isEvidenceCaptureTemplateOnly(normalizedText);
  const isCredible = isCredibleEvidenceText(normalizedText) && !isTemplateOnly;
  const trustState = {
    trustStatus: isCredible ? "verified" : "pending",
    trustLabel: isCredible ? "可信" : "待核验",
    sourceHint: isCredible
      ? "来源线索可核验，可计入进度"
      : isTemplateOnly
        ? "模板未填事实：补年份、企业、岗位、就业率或薪资摘录后再计入进度"
        : "待核验：补官网/报告/企业来源后再计入进度",
  };
  if (/就业质量报告|毕业生就业|就业率|升学率|毕业去向/.test(normalizedText)) {
    const slotLabel = "就业报告";
    return { slotLabel, taskTitle: "抓报告", trustLevel: "官方报告优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, trustState) };
  }
  if (/宣讲会|双选会|招聘会|就业信息网|到校|校招/.test(normalizedText)) {
    const slotLabel = "到校招聘";
    const freshTrustState = buildFreshnessState(normalizedText, slotLabel, trustState);
    return { slotLabel, taskTitle: "抓企业", trustLevel: "就业网优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, freshTrustState) };
  }
  if (/薪资|月薪|年薪|k\/月|k-/.test(lowerText)) {
    const slotLabel = "岗位薪资";
    const freshTrustState = buildFreshnessState(normalizedText, slotLabel, trustState);
    return { slotLabel, taskTitle: "补薪资", trustLevel: "企业官网优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, freshTrustState) };
  }
  if (/学校全称|主管部门|办学层次|官网域名|阳光高考|教育部/.test(normalizedText)) {
    const slotLabel = "学校主体";
    return { slotLabel, taskTitle: "验学校", trustLevel: "官方入口优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, trustState) };
  }
  if (/专业介绍|培养方案|核心课程|主干课程|所属学院|学院[:：]|实践/.test(normalizedText)) {
    const slotLabel = "专业资料";
    return { slotLabel, taskTitle: "验专业", trustLevel: "招生网优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, trustState) };
  }
  const slotLabel = "学校主体";
  return { slotLabel, taskTitle: "验学校", trustLevel: "官方入口优先", ...buildEvidenceContextTrustState(packet, normalizedText, slotLabel, trustState) };
}

function sanitizeEvidenceTextForStorage(text) {
  const warnings = [];
  let cleanText = (text || "").replace(/\s+/g, " ").trim();

  const redactions = [
    { label: "已隐藏身份证", pattern: /\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g, replacement: "[已隐藏身份证]" },
    { label: "已隐藏手机号", pattern: /1[3-9]\d{9}/g, replacement: "[已隐藏手机号]" },
    { label: "已隐藏邮箱", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, replacement: "[已隐藏邮箱]" },
  ];

  for (const redaction of redactions) {
    if (redaction.pattern.test(cleanText)) {
      warnings.push(redaction.label);
      cleanText = cleanText.replace(redaction.pattern, redaction.replacement);
    }
  }

  let wasTruncated = false;
  if (cleanText.length > evidenceTextStorageLimit) {
    cleanText = `${cleanText.slice(0, evidenceTextStorageLimit)}……[已截断，仅保留公开证据摘要]`;
    wasTruncated = true;
    warnings.push("已截断");
  }

  return {
    text: cleanText,
    wasTruncated,
    privacyLabel: warnings.length ? "本地脱敏" : "",
    privacyWarning: warnings.length ? `本地保存前已处理：${warnings.join("、")}。不要粘贴身份证、手机号、准考证号等个人隐私。` : "",
  };
}

function buildEvidenceInboxItem(text, packet) {
  const sanitized = sanitizeEvidenceTextForStorage(text);
  const cleanText = sanitized.text;
  const classification = classifyEvidenceDraft(cleanText, packet);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...classification,
    privacyLabel: sanitized.privacyLabel,
    privacyWarning: sanitized.privacyWarning,
    wasTruncated: sanitized.wasTruncated,
    title: cleanText.slice(0, 34),
    text: cleanText,
  };
}

function normalizeEvidenceTextForDedupe(text) {
  return (text || "")
    .replace(/\s+/g, "")
    .replace(/[｜|]/g, "|")
    .trim();
}

function mergeUniqueEvidenceInboxItems(newItems, existingItems) {
  const seen = new Set();
  return [...newItems, ...existingItems]
    .filter((item) => {
      const key = normalizeEvidenceTextForDedupe(item.text);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, evidenceInboxLimit);
}

function splitEvidenceDraftBatch(text) {
  const cleanText = (text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s*(?:\d+[.)、]|[-*•])\s*/, "").trimEnd())
    .join("\n")
    .trim();
  if (!cleanText) return [];
  const blankLineBlocks = cleanText
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
  if (blankLineBlocks.length > 1) return blankLineBlocks;

  const sourceBlocks = cleanText
    .split(/\n(?=来源[:：])/g)
    .map((item) => item.trim())
    .filter(Boolean);
  return sourceBlocks.length > 1 ? sourceBlocks : [cleanText];
}

function commitEvidenceDraftBlocks(pageContext, draftBlocks, successTitle) {
  const cleanBlocks = draftBlocks.map((item) => (item || "").replace(/\s+/g, " ").trim()).filter(Boolean);
  if (!cleanBlocks.length) return false;
  const newItems = cleanBlocks.map((block) => buildEvidenceInboxItem(block, pageContext.data.activeRescuePacket));
  const evidenceInboxItems = mergeUniqueEvidenceInboxItems(newItems, pageContext.data.evidenceInboxItems);
  writeEvidenceInboxItems(pageContext.data.activeRescuePacket, evidenceInboxItems);

  const verifiedTaskTitles = Array.from(new Set(newItems
    .filter((item) => item.trustStatus === "verified")
    .map((item) => item.taskTitle)));
  const progressState = verifiedTaskTitles.length
    ? syncEvidenceProgressFromInbox(pageContext.data.activeRescuePacket, pageContext.data.evidenceProgress, evidenceInboxItems, verifiedTaskTitles)
    : {};

  pageContext.setData({
    evidenceDraftText: "",
    ...progressState,
    ...buildEvidenceInboxState(pageContext.data.activeRescuePacket, evidenceInboxItems),
  });
  if (successTitle) wx.showToast({ title: successTitle, icon: "success" });
  return true;
}

function buildEvidenceInboxSummary(items) {
  if (!items.length) return "0 条证据｜先粘贴官网/报告/岗位片段";
  const verifiedItems = items.filter((item) => item.trustStatus === "verified");
  const pendingCount = items.length - verifiedItems.length;
  const coveredSlots = Array.from(new Set(verifiedItems.map((item) => item.slotLabel)));
  if (pendingCount > 0) {
    return `${items.length} 条证据｜可信覆盖：${coveredSlots.length ? coveredSlots.join("、") : "暂无"}｜待核验：${pendingCount}`;
  }
  return `${items.length} 条证据｜已覆盖：${coveredSlots.join("、")}`;
}

function buildEvidenceInboxBriefText(packet, items) {
  const verifiedItems = items.filter((item) => item.trustStatus === "verified");
  const pendingItems = items.filter((item) => item.trustStatus !== "verified");
  const coveredSlots = new Set(verifiedItems.map((item) => item.slotLabel));
  const missingSlots = packet.evidenceTasks
    .map((task) => evidenceSlotByTaskTitle[task.title] || task.title)
    .filter((slot) => !coveredSlots.has(slot));
  return [
    `${packet.targetSchoolName}｜${packet.targetMajorName} 证据箱汇总`,
    `已覆盖：${coveredSlots.size ? Array.from(coveredSlots).join("、") : "暂无"}`,
    `待核验证据：${pendingItems.length} 条`,
    ...items.map((item) => `${item.slotLabel}：${item.title}（${item.trustLabel || "待核验"}）`),
    `下一步：${missingSlots.length ? `继续补${missingSlots.join("、")}` : "证据槽已覆盖，继续核验来源和更新时间"}`,
    "说明：证据箱只保存本地聚合线索；薪资为岗位市场参考，不等于学校官方承诺。",
  ].join("\n");
}

function buildCurrentRescuePacketCopyText(packet, nextSourceActions) {
  const narrowedActions = Array.isArray(nextSourceActions)
    ? nextSourceActions.filter((action) => action.source && action.source.includes("已确认官网域名"))
    : [];
  if (!narrowedActions.length) return packet.copyText;

  return [
    packet.copyText,
    "已确认官网后续入口",
    ...narrowedActions.map((action) => `${action.label}：${action.source}｜${action.url}｜保存：${action.saveFieldsText}`),
    "说明：官网域名确认后，优先使用这些站内入口继续查专业、就业报告和到校招聘，避免被泛搜索结果带偏。",
  ].join("\n");
}

function getVerifiedSlotLabelsFromEvidenceInbox(items) {
  return new Set(
    sanitizeEvidenceInboxItems(items)
      .filter((item) => item.trustStatus === "verified")
      .map((item) => item.slotLabel),
  );
}

function buildTaskTitleBySlotLabel(packet) {
  return packet.evidenceTasks.reduce((lookup, task) => {
    lookup[evidenceSlotByTaskTitle[task.title] || task.title] = task.title;
    return lookup;
  }, {});
}

function getEvidenceEntryByTaskTitle(packet, taskTitle) {
  const slotLabel = getEvidenceSlotLabelByTaskTitle(taskTitle);
  return packet.entryGroups.find((entry) => entry.label === slotLabel) || null;
}

function buildEvidenceDraftTemplate(packet, entry) {
  return [
    `证据槽：${entry.label}`,
    `学校：${packet.targetSchoolName}`,
    `专业：${packet.targetMajorName}`,
    `推荐来源：${entry.source}`,
    `入口：${entry.url}`,
    `保存字段：${entry.saveFields.join("、")}`,
    "摘录：",
    `复制公开页面里的${entry.saveFields.join("、")}；保留来源名称、页面标题和更新时间。`,
  ].join("\n");
}

function buildMiniProgramSearchUrl(query) {
  return `https://cn.bing.com/search?q=${encodeURIComponent(query)}`;
}

function getVerifiedSchoolOfficialDomain(items) {
  const schoolIdentityItem = sanitizeEvidenceInboxItems(items).find(
    (item) => item.trustStatus === "verified" && item.slotLabel === "学校主体",
  );
  if (!schoolIdentityItem) return "";
  const domains = extractEvidenceDomainTermsFromText(schoolIdentityItem.text)
    .filter((term) => term.includes(".") && !/(?:bing|baidu|chsi)\.com/i.test(term))
    .sort((left, right) => right.length - left.length);
  return domains[0] || "";
}

function buildSiteScopedEvidenceQuery(packet, slotLabel, officialDomain) {
  if (slotLabel === "专业资料") {
    return `site:${officialDomain} ${packet.targetMajorName} 专业介绍 招生 培养方案 学院`;
  }
  if (slotLabel === "就业报告") {
    return `site:${officialDomain} 就业质量报告 ${packet.targetMajorName} 毕业去向 就业率 2026 2025 2024`;
  }
  if (slotLabel === "到校招聘") {
    return `site:${officialDomain} ${packet.targetMajorName} 宣讲会 双选会 招聘会 就业信息网`;
  }
  return "";
}

function shouldUseSiteScopedEvidenceAction(entry, officialDomain) {
  return Boolean(officialDomain) && ["专业资料", "就业报告", "到校招聘"].includes(entry.label);
}

function buildSiteScopedEvidenceAction(packet, entry, taskTitle, officialDomain) {
  const query = buildSiteScopedEvidenceQuery(packet, entry.label, officialDomain);
  const saveFieldsText = entry.saveFields.join("、");
  const source = `已确认官网域名 site:${officialDomain}`;
  const label =
    entry.label === "就业报告"
      ? "就业质量报告专业去向"
      : entry.label === "到校招聘"
        ? "学校就业网到校企业"
        : entry.label;
  const action =
    entry.label === "就业报告"
      ? `先用已确认官网域名查学校公开报告，保存${saveFieldsText}，再粘贴回证据箱。`
      : entry.label === "到校招聘"
        ? `先用已确认官网域名查学校就业网、宣讲会和双选会，保存${saveFieldsText}，再粘贴回证据箱。`
        : `先用已确认官网域名做站内检索，保存${saveFieldsText}，再粘贴回证据箱。`;
  return {
    label,
    source,
    query,
    url: buildMiniProgramSearchUrl(query),
    trustLevel: entry.trustLevel,
    taskTitle,
    action,
    saveFieldsText,
    draftTemplate: [
      `${packet.targetSchoolName}｜${packet.targetMajorName} 下一条证据模板`,
      `证据槽：${entry.label}`,
      `学校：${packet.targetSchoolName}`,
      `专业：${packet.targetMajorName}`,
      `推荐来源：${source}`,
      `检索式：${query}`,
      `入口：${buildMiniProgramSearchUrl(query)}`,
      `保存字段：${saveFieldsText}`,
      "摘录：",
      `复制官网站内页面里的${saveFieldsText}；保留来源名称、页面标题和更新时间。`,
    ].join("\n"),
    copyText: [
      `${packet.targetSchoolName}｜${packet.targetMajorName} 下一条证据`,
      `证据槽：${entry.label}`,
      `推荐来源：${source}`,
      `检索式：${query}`,
      `入口：${buildMiniProgramSearchUrl(query)}`,
      `保存字段：${saveFieldsText}`,
      `动作：先用已确认官网域名做站内检索，避免被泛搜索结果带偏。`,
      "保存后粘贴回证据箱；只有官网/报告/就业网/企业官网等可核验来源才会推进进度。",
    ].join("\n"),
  };
}

function getPreferredCityEvidenceAction(cityActions, slotLabel) {
  const actions = Array.isArray(cityActions) ? cityActions : [];
  if (slotLabel === "就业报告") {
    return actions.find((action) => action.id === "official-employment-report") || actions.find((action) => action.evidenceSlot === slotLabel) || null;
  }
  if (slotLabel === "到校招聘") {
    return actions.find((action) => action.id === "school-career-events") || actions.find((action) => action.evidenceSlot === slotLabel) || null;
  }
  if (slotLabel === "岗位薪资") {
    return actions.find((action) => action.id === "city-salary-posts") || actions.find((action) => action.evidenceSlot === slotLabel) || null;
  }
  return null;
}

function buildCityEvidenceNextSourceAction(packet, entry, cityAction, taskTitle) {
  const saveFieldsText = cityAction.saveFields.join("、");
  const actionUrl = cityAction.id === "school-career-events" && entry.url ? entry.url : cityAction.url;
  return {
    label: cityAction.label,
    source: cityAction.source,
    query: cityAction.query || "",
    url: actionUrl,
    trustLevel: entry.trustLevel,
    taskTitle,
    action: cityAction.action,
    saveFieldsText,
    draftTemplate: [
      `${packet.targetSchoolName}｜${packet.targetMajorName} 下一条证据模板`,
      `证据槽：${cityAction.evidenceSlot}`,
      `学校：${packet.targetSchoolName}`,
      `专业：${packet.targetMajorName}`,
      `证据动作：${cityAction.label}`,
      `推荐来源：${cityAction.source}`,
      `检索式：${cityAction.query}`,
      `入口：${actionUrl}`,
      `保存字段：${saveFieldsText}`,
      "摘录：",
      `复制公开页面里的${saveFieldsText}；保留来源名称、页面标题和更新时间。`,
    ].join("\n"),
    copyText: [
      `${packet.targetSchoolName}｜${packet.targetMajorName} 下一条证据`,
      `证据槽：${cityAction.evidenceSlot}`,
      `证据动作：${cityAction.label}`,
      `推荐来源：${cityAction.source}`,
      `检索式：${cityAction.query}`,
      `入口：${actionUrl}`,
      `保存字段：${saveFieldsText}`,
      `动作：${cityAction.action}`,
      "保存后粘贴回证据箱；只有官网/报告/就业网/企业官网等可核验来源才会推进进度。",
    ].join("\n"),
  };
}

function buildEvidenceNextSourceActions(packet, items) {
  const verifiedSlotLabels = getVerifiedSlotLabelsFromEvidenceInbox(items);
  const taskTitleBySlotLabel = buildTaskTitleBySlotLabel(packet);
  const cityActions = Array.isArray(packet.cityEvidenceActions) ? packet.cityEvidenceActions : [];
  const officialDomain = getVerifiedSchoolOfficialDomain(items);
  return packet.entryGroups
    .filter((entry) => !verifiedSlotLabels.has(entry.label))
    .map((entry) => {
      const taskTitle = taskTitleBySlotLabel[entry.label] || entry.label;
      if (shouldUseSiteScopedEvidenceAction(entry, officialDomain)) {
        return buildSiteScopedEvidenceAction(packet, entry, taskTitle, officialDomain);
      }
      const preferredCityAction = getPreferredCityEvidenceAction(cityActions, entry.label);
      if (preferredCityAction) {
        return buildCityEvidenceNextSourceAction(packet, entry, preferredCityAction, taskTitle);
      }

      const saveFieldsText = entry.saveFields.join("、");
      return {
        label: entry.label,
        source: entry.source,
        query: "",
        url: entry.url,
        trustLevel: entry.trustLevel,
        taskTitle,
        action: entry.action,
        saveFieldsText,
        draftTemplate: buildEvidenceDraftTemplate(packet, entry),
        copyText: [
          `${packet.targetSchoolName}｜${packet.targetMajorName} 下一条证据`,
          `证据槽：${entry.label}`,
          `推荐来源：${entry.source}`,
          `入口：${entry.url}`,
          `保存字段：${saveFieldsText}`,
          `动作：${entry.action}`,
          "保存后粘贴回证据箱；只有官网/报告/就业网/企业官网等可核验来源才会推进进度。",
        ].join("\n"),
      };
    });
}

function buildEvidenceInboxState(packet, items) {
  const safeItems = sanitizeEvidenceInboxItems(items);
  return {
    evidenceInboxItems: safeItems,
    evidenceInboxSummary: buildEvidenceInboxSummary(safeItems),
    evidenceInboxBriefText: buildEvidenceInboxBriefText(packet, safeItems),
    evidenceNextSourceActions: buildEvidenceNextSourceActions(packet, safeItems),
  };
}

function getVerifiedTaskTitlesFromEvidenceInbox(items) {
  return new Set(
    sanitizeEvidenceInboxItems(items)
      .filter((item) => item.trustStatus === "verified")
      .map((item) => item.taskTitle),
  );
}

function syncEvidenceProgressFromInbox(packet, currentProgress, items, affectedTaskTitle) {
  const verifiedTaskTitles = getVerifiedTaskTitlesFromEvidenceInbox(items);
  const affectedTaskTitles = Array.isArray(affectedTaskTitle)
    ? affectedTaskTitle
    : affectedTaskTitle
      ? [affectedTaskTitle]
      : packet.evidenceTasks.map((task) => task.title);
  const taskTitlesToSync = new Set(affectedTaskTitles);
  const evidenceProgress = currentProgress.map((task) => {
    if (verifiedTaskTitles.has(task.title)) return { ...task, done: true };
    if (taskTitlesToSync.has(task.title)) return { ...task, done: false };
    return task;
  });
  const checkedIds = evidenceProgress.filter((task) => task.done).map((task) => task.id);
  const summary = summarizeEvidenceProgress(evidenceProgress);
  writeCheckedEvidenceTaskIds(packet, checkedIds);
  return {
    evidenceProgress,
    currentCandidateReadiness: buildCurrentCandidateReadiness(evidenceProgress),
    ...summary,
    progressBriefNextAction: buildProgressBriefNextAction(evidenceProgress),
    progressBriefText: buildProgressBriefText(packet, evidenceProgress, summary),
  };
}

function buildSavedCandidateSummary(candidates) {
  return `${candidates.length} 个候选`;
}

function buildCandidateEvidenceSnapshot(packet, evidenceInboxItems, evidenceNextSourceActions) {
  const verifiedSlotLabels = getVerifiedSlotLabelsFromEvidenceInbox(evidenceInboxItems);
  const orderedSlotLabels = packet.evidenceTasks.map((task) => getEvidenceSlotLabelByTaskTitle(task.title));
  const coveredSlots = orderedSlotLabels.filter((slot) => verifiedSlotLabels.has(slot));
  const missingSlotLabels = orderedSlotLabels.filter((slot) => !verifiedSlotLabels.has(slot));
  const salaryDirection = Array.isArray(packet.salaryDirections) && packet.salaryDirections.length ? packet.salaryDirections[0] : null;
  const nextSource = Array.isArray(evidenceNextSourceActions) && evidenceNextSourceActions.length ? evidenceNextSourceActions[0] : null;

  return {
    cityName: packet.targetCityName || "待补城市",
    salaryFocus: salaryDirection ? salaryDirection.title : "待补岗位方向",
    salaryRange: salaryDirection ? salaryDirection.salary : "待补薪资",
    coveredSlots,
    missingSlotLabels,
    nextSourceLabel: nextSource ? nextSource.label : "证据槽已覆盖",
    nextSourceSource: nextSource ? nextSource.source : "",
    nextSourceQuery: nextSource ? nextSource.query || "" : "",
    nextSourceUrl: nextSource ? nextSource.url : "",
    nextSourceSaveFieldsText: nextSource ? nextSource.saveFieldsText : "",
    nextSourceCopyText: nextSource ? nextSource.copyText : "",
    nextSourceAction: nextSource ? nextSource.action : "继续核验来源和更新时间。",
    sourceCoverageText: `已覆盖：${coveredSlots.length ? coveredSlots.join("、") : "暂无"}｜待补：${missingSlotLabels.length ? missingSlotLabels.join("、") : "暂无"}`,
  };
}

function buildCurrentCandidate(packet, progress, summary, progressBriefText, evidenceInboxItems, evidenceNextSourceActions) {
  const doneTasks = progress.filter((task) => task.done).map((task) => task.title);
  const missingTasks = progress.filter((task) => !task.done).map((task) => task.title);
  const readiness = buildCurrentCandidateReadiness(progress);
  const evidenceSnapshot = buildCandidateEvidenceSnapshot(packet, evidenceInboxItems, evidenceNextSourceActions);
  return {
    key: `${packet.targetSchoolName}::${packet.targetMajorName}`,
    schoolName: packet.targetSchoolName,
    majorName: packet.targetMajorName,
    ...evidenceSnapshot,
    progressText: summary.evidenceProgressText,
    progressPercent: summary.evidenceProgressPercent,
    readinessLevel: readiness.level,
    readinessTitle: readiness.title,
    completedTasks: doneTasks,
    missingTasks,
    nextAction: buildProgressBriefNextAction(progress),
    briefText: progressBriefText,
  };
}

function calculateCandidateRankScore(candidate) {
  const progressScore = Number(candidate.progressPercent) || 0;
  const completedScore = Array.isArray(candidate.completedTasks) ? candidate.completedTasks.length * 5 : 0;
  const missingPenalty = Array.isArray(candidate.missingTasks) ? candidate.missingTasks.length : 0;
  return Math.max(0, Math.round(progressScore + completedScore - missingPenalty));
}

function buildRankedCandidates(candidates) {
  return candidates
    .map((candidate, index) => ({
      ...candidate,
      rankScore: calculateCandidateRankScore(candidate),
      originalIndex: index,
    }))
    .sort((left, right) => {
      if (right.rankScore !== left.rankScore) return right.rankScore - left.rankScore;
      if ((right.progressPercent || 0) !== (left.progressPercent || 0)) {
        return (right.progressPercent || 0) - (left.progressPercent || 0);
      }
      return left.originalIndex - right.originalIndex;
    })
    .map(({ originalIndex, ...candidate }) => candidate);
}

function buildCandidateVerdict(candidates) {
  const ranked = buildRankedCandidates(candidates);
  if (!ranked.length) {
    return {
      title: "先保存候选",
      reason: "保存 2-4 个学校和专业后，再按证据进度看优先级。",
      missingLabel: "缺口：暂无",
      ranked,
    };
  }
  const best = ranked[0];
  return {
    title: `优先继续查：${best.schoolName}｜${best.majorName}`,
    reason: "理由：证据进度更完整，先补最少缺口再做横向比较。",
    missingLabel: `缺口：${best.missingTasks.length ? best.missingTasks.join("、") : "暂无"}`,
    ranked,
  };
}

function buildCandidateVerdictText(verdict) {
  return [
    "候选结论排序",
    verdict.title,
    verdict.reason,
    verdict.missingLabel,
  ].join("\n");
}

function buildCandidateReportText(candidates) {
  const verdict = buildCandidateVerdict(candidates);
  if (!candidates.length) return `候选对比报告\n${buildCandidateVerdictText(verdict)}\n暂无候选；先保存一个学校和专业。`;
  return [
    "候选对比报告",
    buildCandidateVerdictText(verdict),
    ...verdict.ranked.flatMap((candidate, index) => {
      const nextSourceLines = [
        `下一条来源：${candidate.nextSourceLabel || "证据槽已覆盖"}`,
        candidate.nextSourceSource ? `下一条来源说明：${candidate.nextSourceSource}` : "",
        candidate.nextSourceQuery ? `下一条检索式：${candidate.nextSourceQuery}` : "",
        candidate.nextSourceUrl ? `下一条入口：${candidate.nextSourceUrl}` : "",
        candidate.nextSourceSaveFieldsText ? `下一条保存字段：${candidate.nextSourceSaveFieldsText}` : "",
      ].filter(Boolean);
      return [
        `${index + 1}. ${candidate.schoolName}｜${candidate.majorName}`,
        `城市：${candidate.cityName || "待补城市"}`,
        `薪资方向：${candidate.salaryFocus || "待补岗位方向"}｜${candidate.salaryRange || "待补薪资"}`,
        `证据覆盖：${candidate.sourceCoverageText || "待补证据覆盖"}`,
        ...nextSourceLines,
        `排序分：${candidate.rankScore}`,
        `可用性：${candidate.readinessTitle || "未计算"}`,
        `进度：${candidate.progressText}`,
        `已完成：${candidate.completedTasks.length ? candidate.completedTasks.join("、") : "暂无"}`,
        `待补齐：${candidate.missingTasks.length ? candidate.missingTasks.join("、") : "暂无"}`,
        `下一步：${candidate.nextAction.replace(/^下一步：/, "")}`,
      ];
    }),
  ].join("\n");
}

function buildSavedCandidatesState(candidates) {
  const safeCandidates = sanitizeSavedCandidates(candidates);
  const candidateVerdict = buildCandidateVerdict(safeCandidates);
  return {
    savedCandidates: safeCandidates,
    savedCandidateSummary: buildSavedCandidateSummary(safeCandidates),
    candidateVerdict,
    candidateVerdictText: buildCandidateVerdictText(candidateVerdict),
    candidateReportText: buildCandidateReportText(safeCandidates),
  };
}

function buildEvidenceProgressState(packet) {
  const evidenceProgress = buildEvidenceProgress(packet, readCheckedEvidenceTaskIds(packet));
  const summary = summarizeEvidenceProgress(evidenceProgress);
  return {
    evidenceProgress,
    currentCandidateReadiness: buildCurrentCandidateReadiness(evidenceProgress),
    ...summary,
    progressBriefNextAction: buildProgressBriefNextAction(evidenceProgress),
    progressBriefText: buildProgressBriefText(packet, evidenceProgress, summary),
  };
}

function buildEvidenceProgressStateFromInbox(packet, items) {
  const verifiedTaskTitles = getVerifiedTaskTitlesFromEvidenceInbox(items);
  const evidenceProgress = buildEvidenceProgress(packet, readCheckedEvidenceTaskIds(packet)).map((task) =>
    verifiedTaskTitles.has(task.title) ? { ...task, done: true } : task,
  );
  const checkedIds = evidenceProgress.filter((task) => task.done).map((task) => task.id);
  const summary = summarizeEvidenceProgress(evidenceProgress);
  if (verifiedTaskTitles.size > 0) {
    writeCheckedEvidenceTaskIds(packet, checkedIds);
  }
  return {
    evidenceProgress,
    currentCandidateReadiness: buildCurrentCandidateReadiness(evidenceProgress),
    ...summary,
    progressBriefNextAction: buildProgressBriefNextAction(evidenceProgress),
    progressBriefText: buildProgressBriefText(packet, evidenceProgress, summary),
  };
}

function buildRescueState(state) {
  const activeRescuePacket = rebuildActiveRescuePacket(state);
  const evidenceInboxItems = readEvidenceInboxItems(activeRescuePacket);
  return {
    activeRescuePacket,
    cityQuery: activeRescuePacket.targetCityName || state.cityQuery || "",
    schoolTypeStrategy: activeRescuePacket.typeStrategy,
    schoolTypeStrategyActions: activeRescuePacket.typeStrategyActions,
    salaryDirections: activeRescuePacket.salaryDirections,
    ...buildEvidenceProgressStateFromInbox(activeRescuePacket, evidenceInboxItems),
    ...buildEvidenceInboxState(activeRescuePacket, evidenceInboxItems),
  };
}

const initialSelectedSchool = schools[0];
const initialSelectedMajor = initialSelectedSchool.majors[0];
const initialTargetMajorName = resolveTargetMajorName({
  selectedSchool: initialSelectedSchool,
  selectedMajor: initialSelectedMajor,
  majorQuery: "",
  targetMajorName: "目标专业",
});
const initialRescuePacket = buildKnownSchoolRescuePacket(initialSelectedSchool, initialTargetMajorName, initialSelectedSchool.city);
const initialEvidenceProgress = buildEvidenceProgress(initialRescuePacket, []);
const initialEvidenceSummary = summarizeEvidenceProgress(initialEvidenceProgress);
const initialSavedCandidatesState = buildSavedCandidatesState([]);
const initialCurrentCandidateReadiness = buildCurrentCandidateReadiness(initialEvidenceProgress);

Page({
  data: {
    schools,
    ordinarySchoolRescue,
    ordinaryMajorPresets,
    activeRescuePacket: initialRescuePacket,
    schoolTypeStrategy: initialRescuePacket.typeStrategy,
    schoolTypeStrategyActions: initialRescuePacket.typeStrategyActions,
    salaryDirections: initialRescuePacket.salaryDirections,
    evidenceProgress: initialEvidenceProgress,
    currentCandidateReadiness: initialCurrentCandidateReadiness,
    evidenceProgressText: initialEvidenceSummary.evidenceProgressText,
    evidenceProgressPercent: initialEvidenceSummary.evidenceProgressPercent,
    progressBriefNextAction: buildProgressBriefNextAction(initialEvidenceProgress),
    progressBriefText: buildProgressBriefText(initialRescuePacket, initialEvidenceProgress, initialEvidenceSummary),
    evidenceDraftText: "",
    expandedEvidenceInboxItemId: "",
    ...buildEvidenceInboxState(initialRescuePacket, []),
    ...initialSavedCandidatesState,
    isUnknownSchool: false,
    unknownSchoolName: "",
    query: "",
    majorQuery: "",
    cityQuery: initialRescuePacket.targetCityName || initialSelectedSchool.city,
    targetMajorName: initialTargetMajorName,
    filteredSchools: schools,
    selectedSchool: initialSelectedSchool,
    selectedMajor: initialSelectedMajor,
  },

  onLoad() {
    this.setData({
      ...buildRescueState(this.data),
      ...buildSavedCandidatesState(readSavedCandidates()),
    });
  },

  onSchoolInput(event) {
    const query = event.detail.value.trim();
    const filteredSchools = schools.filter((school) => {
      const text = `${school.name}${school.city}${school.type}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
    const hasQuery = query.length > 0;
    const nextSchool = filteredSchools[0] || null;
    const isUnknownSchool = hasQuery && !nextSchool;
    const targetMajorName = this.data.majorQuery || (nextSchool && nextSchool.majors[0] ? nextSchool.majors[0].name : this.data.targetMajorName);
    const selectedMajor = nextSchool ? findSelectedMajorForTarget(nextSchool, targetMajorName) : null;
    const cityQuery = nextSchool ? nextSchool.city : this.data.cityQuery;
    const nextState = {
      query,
      cityQuery,
      filteredSchools,
      selectedSchool: nextSchool,
      selectedMajor,
      isUnknownSchool,
      unknownSchoolName: isUnknownSchool ? query : "",
      targetMajorName,
    };
    this.setData({
      ...nextState,
      ...buildRescueState(nextState),
    });
  },

  onCityInput(event) {
    const cityQuery = event.detail.value.trim();
    const nextState = {
      ...this.data,
      cityQuery,
    };
    this.setData({
      cityQuery,
      ...buildRescueState(nextState),
    });
  },

  onMajorInput(event) {
    const majorQuery = event.detail.value.trim();
    const targetMajorName = majorQuery || "目标专业";
    const selectedMajor = majorQuery
      ? findSelectedMajorForTarget(this.data.selectedSchool, targetMajorName) || this.data.selectedMajor
      : this.data.selectedMajor;
    const nextState = {
      ...this.data,
      majorQuery,
      selectedMajor,
      targetMajorName,
    };
    this.setData({
      majorQuery,
      selectedMajor,
      targetMajorName,
      ...buildRescueState(nextState),
    });
  },

  applyMajorPreset(event) {
    const majorName = event.currentTarget.dataset.major;
    if (!majorName) return;
    const selectedMajor = findSelectedMajorForTarget(this.data.selectedSchool, majorName) || this.data.selectedMajor;
    const nextState = {
      ...this.data,
      majorQuery: majorName,
      selectedMajor,
      targetMajorName: majorName,
    };
    this.setData({
      majorQuery: majorName,
      selectedMajor,
      targetMajorName: majorName,
      ...buildRescueState(nextState),
    });
  },

  selectSchool(event) {
    const school = schools.find((item) => item.id === event.currentTarget.dataset.id) || schools[0];
    const selectedMajor = school.majors[0];
    const targetMajorName = selectedMajor ? selectedMajor.name : "目标专业";
    const nextState = {
      ...this.data,
      selectedSchool: school,
      selectedMajor,
      isUnknownSchool: false,
      unknownSchoolName: "",
      majorQuery: targetMajorName,
      targetMajorName,
    };
    this.setData({
      selectedSchool: school,
      selectedMajor,
      isUnknownSchool: false,
      unknownSchoolName: "",
      majorQuery: targetMajorName,
      targetMajorName,
      ...buildRescueState(nextState),
    });
  },

  toggleEvidenceTask(event) {
    const taskId = event.currentTarget.dataset.taskId;
    const task = this.data.evidenceProgress.find((item) => item.id === taskId);
    if (!task) return;

    if (task.done) {
      wx.showToast({ title: "请在证据箱移除证据", icon: "none" });
      return;
    }

    const entry = getEvidenceEntryByTaskTitle(this.data.activeRescuePacket, task.title);
    if (entry) {
      this.setData({
        evidenceDraftText: buildEvidenceDraftTemplate(this.data.activeRescuePacket, entry),
      });
    }
    wx.showToast({ title: "先保存可核验证据", icon: "none" });
  },

  onEvidenceDraftInput(event) {
    this.setData({ evidenceDraftText: event.detail.value });
  },

  saveEvidenceDraft() {
    const cleanText = (this.data.evidenceDraftText || "").replace(/\s+/g, " ").trim();
    if (!cleanText) return;
    commitEvidenceDraftBlocks(this, [cleanText]);
  },

  parseEvidenceDraftBatch() {
    const draftBlocks = splitEvidenceDraftBatch(this.data.evidenceDraftText || "");
    commitEvidenceDraftBlocks(this, draftBlocks, "批量解析完成");
  },

  importEvidenceFromClipboard() {
    wx.getClipboardData({
      success: (result) => {
        const draftBlocks = splitEvidenceDraftBatch(result.data || "");
        const imported = commitEvidenceDraftBlocks(this, draftBlocks, "剪贴板已解析");
        if (!imported) wx.showToast({ title: "剪贴板为空", icon: "none" });
      },
      fail: () => {
        wx.showToast({ title: "读取剪贴板失败", icon: "none" });
      },
    });
  },

  removeEvidenceInboxItem(event) {
    const id = event.currentTarget.dataset.id;
    const removedItem = this.data.evidenceInboxItems.find((item) => item.id === id);
    const evidenceInboxItems = this.data.evidenceInboxItems.filter((item) => item.id !== id);
    writeEvidenceInboxItems(this.data.activeRescuePacket, evidenceInboxItems);
    const progressState =
      removedItem && removedItem.trustStatus === "verified"
        ? syncEvidenceProgressFromInbox(this.data.activeRescuePacket, this.data.evidenceProgress, evidenceInboxItems, removedItem.taskTitle)
        : {};
    this.setData({
      expandedEvidenceInboxItemId:
        this.data.expandedEvidenceInboxItemId === id ? "" : this.data.expandedEvidenceInboxItemId,
      ...progressState,
      ...buildEvidenceInboxState(this.data.activeRescuePacket, evidenceInboxItems),
    });
  },

  toggleEvidenceInboxItemDetail(event) {
    const id = event.currentTarget.dataset.id;
    this.setData({
      expandedEvidenceInboxItemId: this.data.expandedEvidenceInboxItemId === id ? "" : id,
    });
  },

  saveCurrentCandidate() {
    const summary = summarizeEvidenceProgress(this.data.evidenceProgress);
    const progressBriefText = buildProgressBriefText(this.data.activeRescuePacket, this.data.evidenceProgress, summary);
    const candidate = buildCurrentCandidate(
      this.data.activeRescuePacket,
      this.data.evidenceProgress,
      summary,
      progressBriefText,
      this.data.evidenceInboxItems,
      this.data.evidenceNextSourceActions,
    );
    const savedCandidates = [
      candidate,
      ...this.data.savedCandidates.filter((item) => item.key !== candidate.key),
    ].slice(0, savedCandidateLimit);
    writeSavedCandidates(savedCandidates);
    this.setData(buildSavedCandidatesState(savedCandidates));
  },

  removeSavedCandidate(event) {
    const key = event.currentTarget.dataset.key;
    const savedCandidates = this.data.savedCandidates.filter((item) => item.key !== key);
    writeSavedCandidates(savedCandidates);
    this.setData(buildSavedCandidatesState(savedCandidates));
  },

  selectMajor(event) {
    if (!this.data.selectedSchool) return;
    const major = this.data.selectedSchool.majors.find((item) => item.id === event.currentTarget.dataset.id);
    if (major) {
      const nextState = {
        ...this.data,
        selectedMajor: major,
        majorQuery: major.name,
        targetMajorName: major.name,
      };
      this.setData({
        selectedMajor: major,
        majorQuery: major.name,
        targetMajorName: major.name,
        ...buildRescueState(nextState),
      });
    }
  },

  copyLink(event) {
    wx.setClipboardData({
      data: event.currentTarget.dataset.url,
      success() {
        wx.showToast({ title: "入口已复制", icon: "success" });
      },
    });
  },

  copyRescueEntry(event) {
    const label = event.currentTarget.dataset.label;
    const entry = this.data.activeRescuePacket.entryGroups.find((item) => item.label === label);
    if (!entry) return;

    wx.setClipboardData({
      data: `${entry.label}\n${entry.source}\n${entry.url}\n保存字段：${entry.saveFields.join("、")}\n动作：${entry.action}`,
      success() {
        wx.showToast({ title: "入口已复制", icon: "success" });
      },
    });
  },

  copySchoolTypeStrategyAction(event) {
    const id = event.currentTarget.dataset.id;
    const actions = this.data.activeRescuePacket.typeStrategyActions || [];
    const action = actions.find((item) => item.id === id);
    if (!action) return;

    wx.setClipboardData({
      data: `${action.label}\n证据槽：${action.evidenceSlot}\n检索式：${action.query}\n入口：${action.url}\n动作：${action.action}`,
      success() {
        wx.showToast({ title: "检索入口已复制", icon: "success" });
      },
    });
  },

  copySalaryDirection(event) {
    const id = event.currentTarget.dataset.id;
    const directions = this.data.activeRescuePacket.salaryDirections || [];
    const direction = directions.find((item) => item.id === id);
    if (!direction) return;

    wx.setClipboardData({
      data: [
        direction.title,
        `薪资范围：${direction.salary}`,
        `企业/机构：${direction.companyText}`,
        `证据槽：${direction.evidenceSlot}`,
        `检索式：${direction.query}`,
        `入口：${direction.url}`,
        `动作：${direction.action}`,
        `更新规则：${direction.updateRule}`,
      ].join("\n"),
      success() {
        wx.showToast({ title: "薪资方向已复制", icon: "success" });
      },
    });
  },

  prefillEvidenceDraftFromSalaryDirection(event) {
    const id = event.currentTarget.dataset.id;
    const directions = this.data.activeRescuePacket.salaryDirections || [];
    const direction = directions.find((item) => item.id === id);
    if (!direction) return;

    this.setData({
      evidenceDraftText: [
        `${this.data.activeRescuePacket.targetSchoolName}｜${this.data.activeRescuePacket.targetMajorName} 岗位薪资方向证据模板`,
        `证据槽：${direction.evidenceSlot}`,
        `岗位方向：${direction.title}`,
        `薪资参考：${direction.salary}`,
        `企业/机构：${direction.companyText}`,
        "推荐来源：企业官网招聘 / 学校就业网 / 国家大学生就业服务平台",
        `入口：${direction.url}`,
        "待粘贴：岗位原文、城市、薪资范围、学历要求、发布日期",
        `说明：${direction.action}`,
      ].join("\n"),
    });
    wx.showToast({ title: "薪资模板已填", icon: "none" });
  },

  copySalaryDirectionCompanyEntrance(event) {
    const directionId = event.currentTarget.dataset.directionId;
    const companyId = event.currentTarget.dataset.companyId;
    const directions = this.data.activeRescuePacket.salaryDirections || [];
    const direction = directions.find((item) => item.id === directionId);
    const company = direction && (direction.companyEntrances || []).find((item) => item.id === companyId);
    if (!direction || !company) return;

    wx.setClipboardData({
      data: [
        `${company.name}｜${company.cnName}`,
        `岗位方向：${direction.title}`,
        "证据槽：岗位薪资",
        `企业官网招聘入口：${company.officialEntrance}`,
        `公司薪资参考：${company.salary}`,
        `地区属性：${company.region}`,
        `核验说明：${company.note}`,
        "保存字段：岗位名、城市、薪资范围、学历要求、发布日期、官网链接",
      ].join("\n"),
      success() {
        wx.showToast({ title: "公司入口已复制", icon: "success" });
      },
    });
  },

  copyLocalOpportunityChannel(event) {
    const directionId = event.currentTarget.dataset.directionId;
    const channelId = event.currentTarget.dataset.channelId;
    const directions = this.data.activeRescuePacket.salaryDirections || [];
    const direction = directions.find((item) => item.id === directionId);
    const channel = direction && (direction.localOpportunityChannels || []).find((item) => item.id === channelId);
    if (!direction || !channel) return;

    wx.setClipboardData({
      data: [
        channel.label,
        `岗位方向：${direction.title}`,
        `来源：${channel.source}`,
        `证据槽：${channel.evidenceSlot}`,
        `检索式：${channel.query}`,
        `入口：${channel.url}`,
        `动作：${channel.action}`,
      ].join("\n"),
      success() {
        wx.showToast({ title: "本地入口已复制", icon: "success" });
      },
    });
  },

  prefillEvidenceDraftFromLocalOpportunityChannel(event) {
    const directionId = event.currentTarget.dataset.directionId;
    const channelId = event.currentTarget.dataset.channelId;
    const directions = this.data.activeRescuePacket.salaryDirections || [];
    const direction = directions.find((item) => item.id === directionId);
    const channel = direction && (direction.localOpportunityChannels || []).find((item) => item.id === channelId);
    if (!direction || !channel) return;

    this.setData({
      evidenceDraftText: [
        `${this.data.activeRescuePacket.targetSchoolName}｜${this.data.activeRescuePacket.targetMajorName} 本地机会证据模板`,
        `证据槽：${channel.evidenceSlot}`,
        `岗位方向：${direction.title}`,
        `入口名称：${channel.label}`,
        `来源：${channel.source}`,
        `检索式：${channel.query}`,
        `入口：${channel.url}`,
        "待粘贴：岗位原文、公司名称、城市、薪资范围、学历要求、发布日期",
        `动作：${channel.action}`,
      ].join("\n"),
    });
    wx.showToast({ title: "本地模板已填", icon: "none" });
  },

  copyCityEvidenceAction(event) {
    const id = event.currentTarget.dataset.id;
    const actions = this.data.activeRescuePacket.cityEvidenceActions || [];
    const action = actions.find((item) => item.id === id);
    if (!action) return;

    wx.setClipboardData({
      data: [
        action.label,
        `来源：${action.source}`,
        `证据槽：${action.evidenceSlot}`,
        `检索式：${action.query}`,
        `入口：${action.url}`,
        `保存字段：${action.saveFields.join("、")}`,
        `动作：${action.action}`,
      ].join("\n"),
      success() {
        wx.showToast({ title: "证据动作已复制", icon: "success" });
      },
    });
  },

  prefillEvidenceDraftFromCityEvidenceAction(event) {
    const id = event.currentTarget.dataset.id;
    const actions = this.data.activeRescuePacket.cityEvidenceActions || [];
    const action = actions.find((item) => item.id === id);
    if (!action) return;

    this.setData({
      evidenceDraftText: [
        `${this.data.activeRescuePacket.targetSchoolName}｜${this.data.activeRescuePacket.targetMajorName} 城市证据动作模板`,
        `证据槽：${action.evidenceSlot}`,
        `证据动作：${action.label}`,
        `来源：${action.source}`,
        `检索式：${action.query}`,
        `入口：${action.url}`,
        `保存字段：${action.saveFields.join("、")}`,
        "待粘贴：来源页面标题、公开日期/更新日期、关键原文片段、链接",
        `动作：${action.action}`,
      ].join("\n"),
    });
    wx.showToast({ title: "动作模板已填", icon: "none" });
  },

  copyRescuePacket() {
    wx.setClipboardData({
      data: buildCurrentRescuePacketCopyText(this.data.activeRescuePacket, this.data.evidenceNextSourceActions),
      success() {
        wx.showToast({ title: "入口包已复制", icon: "success" });
      },
    });
  },

  copyProgressBrief() {
    wx.setClipboardData({
      data: this.data.progressBriefText,
      success() {
        wx.showToast({ title: "简报已复制", icon: "success" });
      },
    });
  },

  copyEvidenceInboxBrief() {
    wx.setClipboardData({
      data: this.data.evidenceInboxBriefText,
      success() {
        wx.showToast({ title: "证据已复制", icon: "success" });
      },
    });
  },

  copyEvidenceNextSourceAction(event) {
    const label = event.currentTarget.dataset.label;
    const action = this.data.evidenceNextSourceActions.find((item) => item.label === label);
    if (!action) return;

    wx.setClipboardData({
      data: action.copyText,
      success() {
        wx.showToast({ title: "涓嬩竴姝ュ凡澶嶅埗", icon: "success" });
      },
    });
  },

  prefillEvidenceDraftFromNextSourceAction(event) {
    const label = event.currentTarget.dataset.label;
    const action = this.data.evidenceNextSourceActions.find((item) => item.label === label);
    if (!action) return;

    this.setData({ evidenceDraftText: action.draftTemplate });
    wx.showToast({ title: "模板已填入", icon: "success" });
  },

  prefillEvidenceDraftFromTask(event) {
    const taskTitle = event.currentTarget.dataset.taskTitle;
    const nextSourceAction = this.data.evidenceNextSourceActions.find((item) => item.taskTitle === taskTitle);
    if (nextSourceAction) {
      this.setData({ evidenceDraftText: nextSourceAction.draftTemplate });
      wx.showToast({ title: "模板已填入", icon: "success" });
      return;
    }

    const entry = getEvidenceEntryByTaskTitle(this.data.activeRescuePacket, taskTitle);
    if (!entry) return;

    this.setData({
      evidenceDraftText: buildEvidenceDraftTemplate(this.data.activeRescuePacket, entry),
    });
    wx.showToast({ title: "模板已填入", icon: "success" });
  },

  prefillEvidenceDraftFromAuthorityRoute(event) {
    const tier = event.currentTarget.dataset.tier;
    const route = this.data.activeRescuePacket.authorityRoutes.find((item) => item.tier === tier);
    const label = authorityTierToEvidenceLabel[tier];
    const entry = this.data.activeRescuePacket.entryGroups.find((item) => item.label === label);
    if (!route || !entry) return;

    this.setData({
      evidenceDraftText: buildEvidenceDraftTemplate(this.data.activeRescuePacket, {
        ...entry,
        source: route.source,
        url: route.url,
      }),
    });
    wx.showToast({ title: "模板已填入", icon: "success" });
  },

  copyCandidateReport() {
    wx.setClipboardData({
      data: this.data.candidateReportText,
      success() {
        wx.showToast({ title: "对比已复制", icon: "success" });
      },
    });
  },
});
