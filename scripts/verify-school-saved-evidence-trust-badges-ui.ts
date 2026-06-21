import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(inboxStart > -1 && inboxEnd > inboxStart, "SchoolEvidenceInboxPanel should exist");

assert.ok(
  inboxSource.includes("const evidenceTrust = getSchoolEvidencePacketTrustLevel(item)") &&
    inboxSource.includes("getSchoolEvidencePacketTrustLabel(evidenceTrust)") &&
    inboxSource.includes("getSchoolEvidencePacketTrustHint(evidenceTrust)"),
  "saved evidence list should derive a visible trust label and hint for every saved evidence item",
);

assert.ok(
  inboxSource.includes('className={`school-evidence-saved-trust evidence-trust-${evidenceTrust}`}') &&
    inboxSource.includes("aria-label={`证据信任等级：${getSchoolEvidencePacketTrustLabel(evidenceTrust)}`}") &&
    inboxSource.includes("弱证据不计入覆盖"),
  "saved evidence cards should expose trust classes and weak-evidence warning",
);

assert.ok(
  mainSource.includes("function getSchoolEvidencePacketTrustLabel") &&
    mainSource.includes("function getSchoolEvidencePacketTrustHint") &&
    mainSource.includes('if (trustLevel === "official") return "可采信"') &&
    mainSource.includes('if (trustLevel === "lead") return "待复核线索"') &&
    mainSource.includes('return "弱证据"'),
  "main UI should provide concise trust labels for saved evidence",
);

for (const className of [
  ".school-evidence-saved-trust",
  ".school-evidence-saved-trust.evidence-trust-official",
  ".school-evidence-saved-trust.evidence-trust-lead",
  ".school-evidence-saved-trust.evidence-trust-weak",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
