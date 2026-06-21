type SchoolEvidencePacketItem = {
  kind: string;
  title: string;
  detail: string;
  url: string;
};

export type SchoolEvidencePromotionHint = {
  label: string;
  fields: string[];
  text: string;
};

export type SchoolEvidencePacketGroups = {
  official: string[];
  leads: string[];
  weak: string[];
};

export function groupSchoolManualEvidenceForPacket(items: SchoolEvidencePacketItem[]): SchoolEvidencePacketGroups {
  const groups: SchoolEvidencePacketGroups = {
    official: [],
    leads: [],
    weak: [],
  };

  items.slice(0, 8).forEach((item) => {
    const line = formatSchoolEvidencePacketLine(item, groups);
    const trustLevel = getSchoolEvidencePacketTrustLevel(item);

    if (trustLevel === "official") groups.official.push(line);
    else if (trustLevel === "weak") groups.weak.push(line);
    else groups.leads.push(line);
  });

  return groups;
}

export function buildSchoolEvidenceTrustSummary(items: SchoolEvidencePacketItem[]) {
  const groups = groupSchoolManualEvidenceForPacket(items);
  return `官方 ${groups.official.length} / 线索 ${groups.leads.length} / 弱证据 ${groups.weak.length}`;
}

export function getSchoolEvidencePacketTrustLevel(item: SchoolEvidencePacketItem): "official" | "lead" | "weak" {
  const detail = item.detail;
  const url = item.url.toLowerCase();

  if (isEntranceCaptureTemplateOnly(item)) {
    return "weak";
  }

  if (
    detail.includes("学校官方源") ||
    detail.includes("企业官方源") ||
    detail.includes("公共官方源") ||
    /\.edu\.cn|careers?\.|\/careers?|\/jobs?|\/campus|ncss\.cn|job\.mohrss\.gov\.cn|gjzwfw\.www\.gov\.cn|mohrss\.gov\.cn/i.test(url)
  ) {
    return "official";
  }
  if (detail.includes("弱证据") || detail.includes("营销") || detail.includes("不能替代") || /best-major|article|post|news/i.test(url)) {
    return "weak";
  }
  return "lead";
}

const SCHOOL_EVIDENCE_PROMOTION_HINTS: Record<string, SchoolEvidencePromotionHint> = {
  major: {
    label: "升级成可采信证据",
    fields: ["专业名", "学院/系部", "招生年份", "培养方案原文"],
    text: "入口已保存为线索；补专业名、学院/系部、招生年份和培养方案原文后，才计入专业资料。",
  },
  report: {
    label: "升级成可采信证据",
    fields: ["报告年份", "就业率/升学率", "统计口径", "原文摘录"],
    text: "入口已保存为线索；补报告年份、就业率/升学率、统计口径和原文摘录后，才计入毕业去向。",
  },
  campus: {
    label: "升级成可采信证据",
    fields: ["日期", "企业名", "岗位", "招聘活动/场次"],
    text: "入口已保存为线索；补日期、企业名、岗位或宣讲会/双选会场次后，才计入到校企业。",
  },
  salary: {
    label: "升级成可采信证据",
    fields: ["岗位名", "城市/地区", "薪资区间", "来源日期"],
    text: "入口已保存为线索；补岗位名、城市/地区、薪资区间和来源日期后，才计入岗位薪资。",
  },
};

export function getSchoolEvidencePromotionHint(item: SchoolEvidencePacketItem): SchoolEvidencePromotionHint | null {
  if (!isEntranceCaptureTemplateOnly(item) || getSchoolEvidencePacketTrustLevel(item) !== "weak") {
    return null;
  }

  return (
    SCHOOL_EVIDENCE_PROMOTION_HINTS[item.kind] ?? {
      label: "升级成可采信证据",
      fields: ["来源标题", "原文摘录", "来源日期"],
      text: "入口已保存为线索；补齐来源标题、原文摘录和来源日期后，才计入聚合判断。",
    }
  );
}

function isEntranceCaptureTemplateOnly(item: SchoolEvidencePacketItem) {
  const detail = item.detail;
  if (!detail.includes("采集字段：") || !detail.includes("查询口令：")) return false;
  return !hasExtractedEvidenceFact(item);
}

function hasExtractedEvidenceFact(item: SchoolEvidencePacketItem) {
  const detail = item.detail;
  if (/已摘录|原文摘录|证据摘录/.test(detail)) return true;

  if (item.kind === "campus") {
    return /(?:企业|单位|参会企业|用人单位)[:：]\s*\S/.test(detail);
  }

  if (item.kind === "salary") {
    return /(?:薪资|月薪|工资|待遇)[:：]?\s*\d|\d+(?:\.\d+)?\s*[kK千]|\d{3,6}\s*[-~至]\s*\d{3,6}\s*元/.test(detail);
  }

  if (item.kind === "report") {
    return /\d+(?:\.\d+)?%|(?:就业率|毕业去向落实率|升学率)[:：]\s*\S/.test(detail);
  }

  if (item.kind === "major") {
    return /(?:专业名|专业名称|学院|系部|学制|核心课程)[:：]\s*\S/.test(detail);
  }

  return false;
}

function formatSchoolEvidencePacketLine(item: SchoolEvidencePacketItem, groups: SchoolEvidencePacketGroups) {
  const groupSize = groups.official.length + groups.leads.length + groups.weak.length + 1;
  const urlPart = item.url ? `：${item.url}` : "";
  const detailPart = item.detail ? `｜${item.detail}` : "";
  return `${groupSize}. ${item.title}${urlPart}${detailPart}`;
}
