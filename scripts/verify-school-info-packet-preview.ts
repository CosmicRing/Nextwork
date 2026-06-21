import assert from "node:assert/strict";

import { buildSchoolInfoPacketPreviewLines } from "../src/lib/schoolInfoPacketPreview";

const preview = buildSchoolInfoPacketPreviewLines({
  schoolName: "郑州工商学院",
  majorName: "电子商务",
  jobName: "电商运营",
  salaryLabel: "7-18K/月",
  salarySource: "快消 / 零售 / 品牌营销 市场代理",
  officialEntryCount: 3,
  searchEntryCount: 6,
  companyEntryNames: ["京东", "阿里巴巴", "Amazon"],
  manualEvidenceCount: 2,
  manualEvidenceLabels: ["专业目录", "就业报告"],
  manualEvidenceTrustSummary: "官方 1 / 线索 1 / 弱证据 0",
  nextActions: ["确认专业是否真实开设", "查校招和宣讲会企业", "打开企业官网岗位"],
});

assert.equal(preview.length, 8);
assert.deepEqual(preview, [
  "学校：郑州工商学院",
  "方向：电子商务 → 电商运营",
  "薪资：7-18K/月（快消 / 零售 / 品牌营销 市场代理）",
  "入口：3 个官方直达 · 6 个公开搜索",
  "企业：京东 / 阿里巴巴 / Amazon",
  "自存证据：2 条 · 专业目录 / 就业报告",
  "证据分级：官方 1 / 线索 1 / 弱证据 0",
  "下一步：确认专业是否真实开设 / 查校招和宣讲会企业 / 打开企业官网岗位",
]);
assert.ok(preview.every((line) => !/^https?:\/\//i.test(line)));
assert.ok(preview.every((line) => !line.includes("https://")));

const emptyPreview = buildSchoolInfoPacketPreviewLines({
  schoolName: "未收录学校",
  majorName: "",
  jobName: "",
  salaryLabel: "",
  salarySource: "",
  officialEntryCount: 0,
  searchEntryCount: 6,
  companyEntryNames: [],
  manualEvidenceCount: 0,
  manualEvidenceLabels: [],
  manualEvidenceTrustSummary: "官方 0 / 线索 0 / 弱证据 0",
  nextActions: [],
});

assert.deepEqual(emptyPreview, [
  "学校：未收录学校",
  "方向：待填写",
  "薪资：补专业/岗位后生成",
  "入口：6 个公开搜索",
  "企业：补方向后生成公司入口",
  "自存证据：暂无",
  "证据分级：官方 0 / 线索 0 / 弱证据 0",
  "下一步：先打开学校专业入口核验 / 查就业质量报告 / 查校招和宣讲会企业",
]);
