import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = source.indexOf("function SchoolPublicAccessPanel");
const panelEnd = source.indexOf("function SchoolPrimaryActionFlow", panelStart);
const panelSource = source.slice(panelStart, panelEnd);
const inboxStart = source.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = source.indexOf("function SchoolEvidenceGapPanel", inboxStart);
const inboxSource = source.slice(inboxStart, inboxEnd);

assert.ok(source.includes("type SchoolManualEvidenceItem"), "manual evidence item type should exist");
assert.ok(source.includes("type SchoolManualEvidenceDraft"), "manual evidence draft type should exist");
assert.ok(source.includes("const schoolManualEvidenceKinds"), "manual evidence kinds should be defined");
assert.ok(
  source.includes("function getSchoolManualEvidenceCoverage"),
  "manual evidence coverage helper should summarize collected categories",
);

assert.ok(panelStart > -1, "SchoolPublicAccessPanel should exist");
assert.ok(inboxStart > -1, "SchoolEvidenceInboxPanel should exist");
assert.ok(
  panelSource.includes("const [manualEvidenceItems, setManualEvidenceItems] = useState<SchoolManualEvidenceItem[]>(") &&
    panelSource.includes("const initialSchoolWorkbenchSnapshot = readSchoolWorkbenchStorageSnapshot(") &&
    panelSource.includes("initialSchoolWorkbenchSnapshot.manualEvidenceItems") &&
    panelSource.includes("const [manualEvidenceDraft, setManualEvidenceDraft] = useState<SchoolManualEvidenceDraft>({"),
  "school workbench should keep manual evidence items and draft in local page state, restoring saved evidence when available",
);
assert.ok(
  panelSource.includes("const manualEvidenceCoverage = getSchoolManualEvidenceCoverage(manualEvidenceItems);"),
  "school workbench should derive coverage from manual evidence items",
);
assert.ok(
  panelSource.includes("const addManualEvidence = () => {") &&
    panelSource.includes("setManualEvidenceItems((current) =>") &&
    panelSource.includes("const removeManualEvidence = (id: string) =>"),
  "school workbench should support adding and removing manually collected evidence",
);
assert.ok(
  panelSource.includes("<SchoolEvidenceInboxPanel") &&
    panelSource.includes("items={manualEvidenceItems}") &&
    panelSource.includes("coverage={manualEvidenceCoverage}") &&
    panelSource.includes("onAdd={addManualEvidence}") &&
    panelSource.includes("onRemove={removeManualEvidence}"),
  "evidence inbox should be rendered inside the school evidence workflow",
);

assert.ok(
  inboxSource.includes('className="school-evidence-inbox-panel"') &&
    inboxSource.includes('aria-label="本页证据收件箱"'),
  "evidence inbox should have a stable wrapper and accessible label",
);
assert.ok(
  inboxSource.includes('className="school-evidence-inbox-kind-row"') &&
    inboxSource.includes("schoolManualEvidenceKinds.map") &&
    inboxSource.includes("aria-pressed={draft.kind === kind.id}"),
  "evidence inbox should expose segmented evidence-type controls",
);
assert.ok(
  inboxSource.includes('placeholder="证据标题，例如 2024 就业质量报告"') &&
    inboxSource.includes('placeholder="官方链接或检索结果链接"') &&
    inboxSource.includes('placeholder="摘录就业率、企业名、岗位、薪资口径等关键内容"'),
  "evidence inbox should collect title, URL and source notes",
);
assert.ok(
  inboxSource.includes("items.length > 0") &&
    inboxSource.includes("items.map((item)") &&
    inboxSource.includes("onRemove(item.id)"),
  "evidence inbox should render and remove collected evidence items",
);

assert.ok(
  styleSource.includes(".school-evidence-inbox-panel") &&
    styleSource.includes(".school-evidence-inbox-kind-row") &&
    styleSource.includes(".school-evidence-inbox-form") &&
    styleSource.includes(".school-evidence-inbox-list"),
  "evidence inbox should have dedicated responsive styles",
);
