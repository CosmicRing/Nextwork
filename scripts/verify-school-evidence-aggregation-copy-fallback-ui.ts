import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(inboxStart > -1 && inboxEnd > inboxStart, "SchoolEvidenceInboxPanel should exist");
assert.ok(
  inboxSource.includes('const [showAggregationBriefText, setShowAggregationBriefText] = useState(false)'),
  "aggregation brief copy flow should track whether the manual copy text is visible",
);
assert.ok(
  inboxSource.includes("setShowAggregationBriefText(false)") &&
    inboxSource.includes("setShowAggregationBriefText(true)"),
  "aggregation brief copy flow should hide text after success and show it after failure",
);
assert.ok(
  inboxSource.includes('className="school-evidence-aggregation-copybox"') &&
    inboxSource.includes("value={aggregationBrief.copyText}") &&
    inboxSource.includes("readOnly"),
  "aggregation brief should expose a read-only fallback text area containing the generated copy text",
);
assert.ok(
  styleSource.includes(".school-evidence-aggregation-copybox"),
  "aggregation brief fallback text area should have dedicated styles",
);
