import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);
const queueStart = mainSource.indexOf("function SchoolLookupActionQueue");
const queueEnd = mainSource.indexOf("function SchoolLookupSummaryStrip", queueStart);
const queueSource = mainSource.slice(queueStart, queueEnd);
const gapPanelStart = mainSource.indexOf("function SchoolEvidenceGapPanel");
const gapPanelEnd = mainSource.indexOf("function SchoolLookupActionQueue", gapPanelStart);
const gapPanelSource = mainSource.slice(gapPanelStart, gapPanelEnd);

assert.ok(queueStart > -1, "school UI should define a first-screen lookup action queue");
assert.ok(
  panelSource.includes("const lookupActionQueue =") &&
    panelSource.includes("evidenceTasks.filter") &&
    panelSource.includes("getSchoolEvidenceTaskSlotId(task)") &&
    panelSource.includes(".slice(0, 3)"),
  "school access panel should derive the next three uncovered evidence tasks from evidence slots",
);
assert.ok(
  panelSource.includes(
    "<SchoolLookupActionQueue tasks={lookupActionQueue} onUseEvidenceTaskTemplate={fillDraftFromEvidenceTask} />",
  ),
  "school access panel should render the action queue with evidence-template wiring",
);
assert.ok(
  panelSource.includes("const fillDraftFromEvidenceTask = (task: SchoolEvidenceTask) => {") &&
    panelSource.includes("kind: getSchoolEvidenceTaskSlotId(task)") &&
    panelSource.includes("title: task.label") &&
    panelSource.includes("detail: task.detail") &&
    panelSource.includes("url: task.url") &&
    panelSource.includes("openSchoolEvidenceInboxFoldout()"),
  "school access panel should prefill the evidence draft from a task before opening the inbox",
);

const summaryIndex = panelSource.indexOf("<SchoolLookupSummaryStrip");
const queueIndex = panelSource.indexOf("<SchoolLookupActionQueue");
const unknownIndex = panelSource.indexOf("<UnknownSchoolEvidenceWorkbench");
const queryIndex = panelSource.indexOf('className="school-public-query-box"');
const launcherIndex = panelSource.indexOf("<SchoolOfficialEntranceLauncher");

assert.ok(summaryIndex > -1 && queueIndex > -1 && unknownIndex > -1 && queryIndex > -1 && launcherIndex > -1);
assert.ok(
  queryIndex < launcherIndex && launcherIndex < summaryIndex && summaryIndex < queueIndex && queueIndex < unknownIndex,
  "query should feed the entrance launcher first, then summary and action queue should appear before the dense unknown-school panel",
);

assert.ok(
  queueSource.includes('className="school-lookup-action-queue"') &&
    queueSource.includes("tasks.map((task, index)") &&
    queueSource.includes("href={task.url}") &&
    queueSource.includes("onUseEvidenceTaskTemplate(task)") &&
    queueSource.includes("getSchoolEvidenceTaskStatusLabel(task.status)"),
  "action queue should render linked task cards with evidence-capture controls",
);
assert.ok(!queueSource.includes("onToggleTask"), "action queue must not expose manual task completion");
assert.ok(!queueSource.includes("aria-pressed"), "action queue must not look like a manual completion checklist");
assert.ok(!queueSource.includes("标记"), "action queue must not invite users to mark evidence as done");
assert.ok(queueSource.includes("粘贴证据"), "action queue should route users back to the evidence inbox");
assert.ok(
  gapPanelSource.includes("onUseEvidenceTaskTemplate") &&
    gapPanelSource.includes("onClick={() => onUseEvidenceTaskTemplate(task)}") &&
    gapPanelSource.includes("不能手动打勾") &&
    gapPanelSource.includes("粘贴证据"),
  "full evidence gap task list should use the same evidence-template handoff and avoid manual completion",
);

for (const className of [
  ".school-lookup-action-queue",
  ".school-lookup-action-card",
  ".school-lookup-action-card a",
  ".school-lookup-action-card button",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
