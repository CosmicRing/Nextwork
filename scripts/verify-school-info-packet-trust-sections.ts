import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildSchoolEvidenceTrustSummary,
  groupSchoolManualEvidenceForPacket,
} from "../src/lib/schoolEvidencePacket";

const evidenceItems = [
  {
    kind: "report",
    title: "2024 就业质量报告",
    url: "https://job.ztbu.edu.cn/report",
    detail: "来源：学校官方源｜指标：就业去向落实率92.36%｜仍需保留原始链接和年份",
  },
  {
    kind: "salary",
    title: "腾讯安全工程师校招",
    url: "https://careers.tencent.com/job/123",
    detail: "来源：企业官方源｜薪资：8-13K｜企业岗位不能直接代表本校就业结果",
  },
  {
    kind: "major",
    title: "百度搜索入口",
    url: "https://www.baidu.com/s?wd=test",
    detail: "来源：搜索线索｜搜索结果不能直接当结论，必须点进学校官网复核",
  },
  {
    kind: "campus",
    title: "热门专业软文",
    url: "https://example.com/best-major",
    detail: "来源：弱证据｜疑似营销内容，不能替代学校报告或企业官网证据",
  },
];

const grouped = groupSchoolManualEvidenceForPacket(evidenceItems);

assert.equal(grouped.official.length, 2);
assert.equal(grouped.leads.length, 1);
assert.equal(grouped.weak.length, 1);
assert.ok(grouped.official[0].includes("2024 就业质量报告"));
assert.ok(grouped.official[1].includes("腾讯安全工程师校招"));
assert.ok(grouped.leads[0].includes("百度搜索入口"));
assert.ok(grouped.weak[0].includes("热门专业软文"));

assert.equal(buildSchoolEvidenceTrustSummary(evidenceItems), "官方 2 / 线索 1 / 弱证据 1");
assert.equal(buildSchoolEvidenceTrustSummary([]), "官方 0 / 线索 0 / 弱证据 0");

const mainSource = readFileSync("src/main.tsx", "utf8");
const packetStart = mainSource.indexOf("function buildSchoolInfoPacketText");
const packetEnd = mainSource.indexOf("function OfficialSchoolLinksPanel", packetStart);
const packetSource = mainSource.slice(packetStart, packetEnd);

assert.ok(mainSource.includes('groupSchoolManualEvidenceForPacket'), "main should import packet evidence grouping helper");
assert.ok(mainSource.includes('buildSchoolEvidenceTrustSummary'), "main should import packet trust summary helper");
assert.ok(packetSource.includes("const manualEvidenceGroups = groupSchoolManualEvidenceForPacket(manualEvidenceItems);"));
assert.ok(packetSource.includes('"官方结论证据："'), "info packet should separate official evidence");
assert.ok(packetSource.includes('"待复核线索："'), "info packet should separate search leads");
assert.ok(packetSource.includes('"弱证据/不要当结论："'), "info packet should separate weak evidence");
assert.ok(packetSource.includes("manualEvidenceGroups.official"));
assert.ok(packetSource.includes("manualEvidenceGroups.leads"));
assert.ok(packetSource.includes("manualEvidenceGroups.weak"));

const previewSource = readFileSync("src/lib/schoolInfoPacketPreview.ts", "utf8");
assert.ok(previewSource.includes("manualEvidenceTrustSummary"), "preview should accept manual evidence trust summary");
assert.ok(previewSource.includes("证据分级"), "preview should show evidence trust summary");
