import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const previewSource = readFileSync("src/lib/schoolInfoPacketPreview.ts", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolPrimaryActionFlow", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const candidateStart = mainSource.indexOf("function buildSchoolInfoCandidate");
const candidateEnd = mainSource.indexOf("function buildSchoolEvidenceTasks", candidateStart);
const candidateSource = mainSource.slice(candidateStart, candidateEnd);
const packetStart = mainSource.indexOf("function buildSchoolInfoPacketText");
const packetEnd = mainSource.indexOf("function OfficialSchoolLinksPanel", packetStart);
const packetSource = mainSource.slice(packetStart, packetEnd);

assert.ok(panelStart > -1, "SchoolPublicAccessPanel should exist");
assert.ok(candidateStart > -1, "buildSchoolInfoCandidate should exist");
assert.ok(packetStart > -1, "buildSchoolInfoPacketText should exist");

const manualStateIndex = panelSource.indexOf("const [manualEvidenceItems, setManualEvidenceItems] = useState<SchoolManualEvidenceItem[]>(");
const currentCandidateIndex = panelSource.indexOf("const currentCandidate = buildSchoolInfoCandidate({");
const infoPacketIndex = panelSource.indexOf("const infoPacketText = buildSchoolInfoPacketText({");
const previewIndex = panelSource.indexOf("const infoPacketPreviewLines = buildSchoolInfoPacketPreviewLines({");

assert.ok(manualStateIndex > -1, "manual evidence state should exist");
assert.ok(currentCandidateIndex > -1, "current candidate should be built");
assert.ok(manualStateIndex < currentCandidateIndex, "manual evidence state must be initialized before candidate judgment");
assert.ok(
  panelSource.includes("manualEvidenceItems,") &&
    panelSource.indexOf("manualEvidenceItems,", currentCandidateIndex) > currentCandidateIndex &&
    panelSource.indexOf("manualEvidenceItems,", currentCandidateIndex) < infoPacketIndex,
  "manual evidence items should be passed into buildSchoolInfoCandidate",
);
assert.ok(
  panelSource.includes("manualEvidenceItems,") &&
    panelSource.indexOf("manualEvidenceItems,", infoPacketIndex) > infoPacketIndex &&
    panelSource.indexOf("manualEvidenceItems,", infoPacketIndex) < previewIndex,
  "manual evidence items should be passed into buildSchoolInfoPacketText",
);
assert.ok(
  panelSource.includes("manualEvidenceCount: manualEvidenceItems.length") &&
    panelSource.includes("manualEvidenceLabels: manualEvidenceItems.map((item) => getSchoolManualEvidenceKindLabel(item.kind))"),
  "manual evidence summary should be passed into info packet preview",
);

assert.ok(
  candidateSource.includes("manualEvidenceItems,") &&
    candidateSource.includes("manualEvidenceItems: SchoolManualEvidenceItem[];"),
  "candidate builder should accept manual evidence items",
);
assert.ok(
  candidateSource.includes("const trustedManualEvidenceItems = manualEvidenceItems.filter((item) => getSchoolEvidencePacketTrustLevel(item) !== \"weak\");") &&
    candidateSource.includes("const manualEvidenceKinds = new Set(trustedManualEvidenceItems.map((item) => item.kind));"),
  "candidate builder should compute trusted manual evidence kind coverage",
);
assert.ok(
  candidateSource.includes("Math.min(16, manualEvidenceKinds.size * 4 + trustedManualEvidenceItems.length * 2)") &&
    candidateSource.includes("trustedManualEvidenceItems.length ? `${trustedManualEvidenceItems.length} 条可采信自存证据` : \"\"") &&
    candidateSource.includes("weakManualEvidenceCount ? `${weakManualEvidenceCount} 条弱证据仅作线索` : \"\""),
  "trusted manual evidence should improve evidence score while weak evidence remains only a lead",
);
assert.ok(
  candidateSource.includes('manualEvidenceKinds.has("major")') &&
    candidateSource.includes('manualEvidenceKinds.has("report")') &&
    candidateSource.includes('manualEvidenceKinds.has("campus")') &&
    candidateSource.includes('manualEvidenceKinds.has("salary")'),
  "manual evidence kinds should reduce matching missing-evidence gaps",
);
assert.ok(
  candidateSource.includes("getSchoolManualEvidenceKindLabel(kind)") &&
    candidateSource.includes("自存证据"),
  "candidate note should expose manual evidence coverage in user-facing text",
);

assert.ok(
  packetSource.includes("manualEvidenceItems,") &&
    packetSource.includes("manualEvidenceItems: SchoolManualEvidenceItem[];") &&
    packetSource.includes("const manualEvidenceGroups = groupSchoolManualEvidenceForPacket(manualEvidenceItems);"),
  "copyable info packet should accept and group manual evidence lines",
);
assert.ok(
  packetSource.includes('"官方结论证据："') &&
    packetSource.includes('"待复核线索："') &&
    packetSource.includes('"弱证据/不要当结论："') &&
    packetSource.includes("manualEvidenceGroups.official") &&
    packetSource.includes("manualEvidenceGroups.leads") &&
    packetSource.includes("manualEvidenceGroups.weak"),
  "copyable info packet should include grouped manual evidence sections",
);

assert.ok(
  previewSource.includes("manualEvidenceCount") &&
    previewSource.includes("manualEvidenceLabels") &&
    previewSource.includes("manualEvidenceTrustSummary") &&
    previewSource.includes("自存证据"),
  "info packet preview should surface manual evidence coverage and trust summary",
);
