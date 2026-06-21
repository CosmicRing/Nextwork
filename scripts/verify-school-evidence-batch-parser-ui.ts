import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolActionCommandPanel", accessStart);

assert.ok(mainSource.includes("parseSchoolEvidenceTextBatch"), "main UI should import the batch evidence parser");
assert.ok(accessStart > -1 && accessEnd > accessStart, "SchoolPublicAccessPanel should exist");
assert.ok(inboxStart > -1 && inboxEnd > inboxStart, "SchoolEvidenceInboxPanel should exist");

const accessSource = mainSource.slice(accessStart, accessEnd);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(
  accessSource.includes("const addParsedEvidenceItems"),
  "school access panel should convert parsed evidence items into saved page evidence",
);
assert.ok(
  accessSource.includes("onAddParsedEvidenceItems={addParsedEvidenceItems}"),
  "school access panel should pass the batch-save callback into the inbox",
);
assert.ok(
  inboxSource.includes("const parsedEvidenceItems = rawEvidenceText.trim()"),
  "evidence inbox should derive a batch parse result from pasted text",
);
assert.ok(
  inboxSource.includes("parsedEvidenceItems.map"),
  "evidence inbox should preview every parsed evidence item",
);
assert.ok(
  inboxSource.includes("批量收进本页"),
  "evidence inbox should expose a one-click batch save action",
);
assert.ok(
  styleSource.includes(".school-evidence-parser-batch"),
  "batch evidence preview should have dedicated styles",
);

