import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const panelStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const panelEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(
  mainSource.includes("parseSchoolEvidenceText") && mainSource.includes("./lib/schoolEvidenceParser"),
  "main UI should import the school evidence parser",
);
assert.ok(panelStart > -1, "SchoolEvidenceInboxPanel should exist");
assert.ok(panelSource.includes("const [rawEvidenceText, setRawEvidenceText] = useState(\"\""), "inbox should keep pasted raw evidence text");
assert.ok(panelSource.includes("const parsedEvidenceItems = rawEvidenceText.trim()"), "inbox should parse only when pasted text exists");
assert.ok(panelSource.includes("parseSchoolEvidenceText({"), "inbox should call the parser");
assert.ok(panelSource.includes("onDraftChange((current) => ({") && panelSource.includes("kind: parsedEvidence.kind"), "parsed evidence should fill the draft kind");
assert.ok(
  panelSource.includes("title: parsedEvidence.title") &&
    panelSource.includes("parsedEvidence.detail") &&
    panelSource.includes("parsedEvidence.sourceTrust.label"),
  "parsed evidence should fill title, detail, and source trust",
);
assert.ok(panelSource.includes("school-evidence-parser-panel"), "inbox should render a visible parser panel");
assert.ok(panelSource.includes("粘贴官网、报告或宣讲会文本") && panelSource.includes("填入草稿"), "parser UI should explain the paste workflow");
assert.ok(panelSource.includes("parsedEvidence.metrics.map") && panelSource.includes("parsedEvidence.companies"), "parser UI should preview metrics and companies");
