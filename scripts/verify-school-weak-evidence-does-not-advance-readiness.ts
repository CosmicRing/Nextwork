import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const packetSource = readFileSync("src/lib/schoolEvidencePacket.ts", "utf8");

const importBlock = mainSource.slice(0, mainSource.indexOf("import { parseSchoolEvidenceText"));
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);

const coverageStart = mainSource.indexOf("function getSchoolManualEvidenceCoverage");
const coverageEnd = mainSource.indexOf("function getSchoolManualEvidenceKindLabel", coverageStart);
const coverageSource = mainSource.slice(coverageStart, coverageEnd);

const candidateStart = mainSource.indexOf("function buildSchoolInfoCandidate");
const candidateEnd = mainSource.indexOf("function buildSchoolEvidenceTasks", candidateStart);
const candidateSource = mainSource.slice(candidateStart, candidateEnd);

assert.ok(accessStart > -1 && accessEnd > accessStart, "SchoolPublicAccessPanel should exist");
assert.ok(coverageStart > -1 && coverageEnd > coverageStart, "manual evidence coverage helper should exist");
assert.ok(candidateStart > -1 && candidateEnd > candidateStart, "candidate builder should exist");

assert.ok(
  importBlock.includes("getSchoolEvidencePacketTrustLevel"),
  "main UI should import the evidence packet trust classifier",
);

assert.ok(
  packetSource.includes('return "weak"'),
  "packet trust classifier should keep weak evidence as a distinct trust level",
);

assert.ok(
  coverageSource.includes("getSchoolEvidencePacketTrustLevel(item) !== \"weak\"") &&
    coverageSource.includes("trustedItems.map((item) => item.kind)") &&
    coverageSource.includes("弱证据不计入覆盖"),
  "manual evidence coverage should ignore weak evidence while telling the user why",
);

assert.ok(
  accessSource.includes("const trustedManualEvidenceItems = manualEvidenceItems.filter") &&
    accessSource.includes("getSchoolEvidencePacketTrustLevel(item) !== \"weak\""),
  "school access panel should derive trusted manual evidence separately from all saved evidence",
);

assert.ok(
  accessSource.includes("evidenceKinds: trustedManualEvidenceItems.map((item) => item.kind)") &&
    !accessSource.includes("evidenceKinds: manualEvidenceItems.map((item) => item.kind)"),
  "readiness should be based on trusted manual evidence, not weak saved evidence",
);

assert.ok(
  candidateSource.includes("const trustedManualEvidenceItems = manualEvidenceItems.filter") &&
    candidateSource.includes("const weakManualEvidenceCount = manualEvidenceItems.length - trustedManualEvidenceItems.length") &&
    candidateSource.includes("new Set(trustedManualEvidenceItems.map((item) => item.kind))"),
  "candidate builder should separate trusted evidence from weak evidence",
);

assert.ok(
  candidateSource.includes("trustedManualEvidenceItems.length ? `${trustedManualEvidenceItems.length} 条可采信自存证据` : \"\"") &&
    candidateSource.includes("weakManualEvidenceCount ? `${weakManualEvidenceCount} 条弱证据仅作线索` : \"\""),
  "candidate evidence summary should distinguish trusted evidence from weak evidence",
);

assert.ok(
  candidateSource.includes("Math.min(16, manualEvidenceKinds.size * 4 + trustedManualEvidenceItems.length * 2)") &&
    !candidateSource.includes("Math.min(16, manualEvidenceKinds.size * 4 + manualEvidenceItems.length * 2)"),
  "candidate score should not increase from weak evidence count",
);

assert.ok(
  candidateSource.includes("const manualEvidenceNote = trustedManualEvidenceItems.length || weakManualEvidenceCount") &&
    candidateSource.includes("不计入正式判断"),
  "candidate note should warn that weak evidence does not advance the formal judgment",
);
