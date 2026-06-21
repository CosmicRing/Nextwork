import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function SchoolEvidenceOutcomeSnapshotPanel", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(inboxStart >= 0 && inboxEnd > inboxStart, "SchoolEvidenceInboxPanel should be readable");

assert.ok(
  inboxSource.includes("upgradeWeakEvidenceDraft"),
  "weak evidence cards should expose a handler that moves the saved entrance back into the draft form",
);

assert.ok(
  inboxSource.includes("按缺字段回填") &&
    inboxSource.includes("promotionHint.fields.join") &&
    inboxSource.includes("school-evidence-promotion-actions"),
  "weak evidence promotion hints should include a visible action that pre-fills the missing fields",
);

assert.ok(
  styleSource.includes(".school-evidence-promotion-actions") &&
    styleSource.includes(".school-evidence-promotion-hint button"),
  "weak evidence upgrade actions need compact dedicated styling",
);
