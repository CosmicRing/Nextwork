import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolOfficialSourceTaskFlow,
} from "../src/lib/unknownSchoolEntryPack";

const input = {
  schoolName: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662",
  majorName: "\u7535\u5b50\u5546\u52a1",
  jobName: "\u7535\u5546\u8fd0\u8425",
  officialDomain: "zkvtc.edu.cn",
};

const tasks = buildUnknownSchoolOfficialSourceTaskFlow(input);
assert.equal(tasks.length, 5, "ordinary-school task flow should stay focused on five evidence jobs");
assert.deepEqual(
  tasks.map((task) => task.id),
  ["verify-school", "verify-major", "employment-report", "campus-recruiting", "salary-proxy"],
);
assert.deepEqual(tasks.map((task) => task.order), [1, 2, 3, 4, 5]);

assert.ok(tasks[0].label.includes("\u9a8c\u5b66\u6821"));
assert.ok(tasks[0].source.includes("\u9633\u5149\u9ad8\u8003"));
assert.ok(tasks[0].saveFields.includes("\u5b98\u65b9\u7f51\u5740"));
assert.ok(tasks[1].label.includes("\u9a8c\u4e13\u4e1a"));
assert.ok(tasks[1].saveFields.includes("\u4e13\u4e1a\u540d"));
assert.ok(tasks[2].label.includes("\u5c31\u4e1a\u62a5\u544a"));
assert.ok(tasks[2].saveFields.includes("\u5c31\u4e1a\u7387"));
assert.ok(tasks[3].label.includes("\u5230\u6821\u4f01\u4e1a"));
assert.ok(tasks[3].saveFields.includes("\u4f01\u4e1a\u540d"));
assert.ok(tasks[4].label.includes("\u5c97\u4f4d\u85aa\u8d44"));
assert.ok(tasks[4].saveFields.includes("\u85aa\u8d44\u533a\u95f4"));

for (const task of tasks) {
  assert.ok(task.url.startsWith("https://"), `${task.id} should have a direct public entry URL`);
  assert.ok(task.query.includes(input.schoolName), `${task.id} query should carry the school name`);
  assert.ok(task.action.length > 8, `${task.id} should describe the next action`);
}

const entries = buildUnknownSchoolEntryPack(input);
const packetText = buildUnknownSchoolEntryPacketText({ ...input, entries });
assert.ok(packetText.includes("\u666e\u901a\u5b66\u6821\u8bc1\u636e\u4efb\u52a1\u6d41\uff1a"));
for (const task of tasks) {
  assert.ok(packetText.includes(`${task.order}. ${task.label}`), `packet should include task ${task.label}`);
  assert.ok(packetText.includes(task.action), `packet should include task action ${task.action}`);
}

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const importBlock = mainSource.slice(
  mainSource.indexOf("from \"./lib/unknownSchoolEntryPack\"") - 900,
  mainSource.indexOf("from \"./lib/unknownSchoolEntryPack\"") + 80,
);
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function UnknownSchoolPublicDocumentMatrix", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(
  importBlock.includes("buildUnknownSchoolOfficialSourceTaskFlow"),
  "main UI should import the shared task-flow helper",
);
assert.ok(
  workbenchSource.includes("const sourceTasks = buildUnknownSchoolOfficialSourceTaskFlow({") &&
    workbenchSource.includes("<UnknownSchoolSourceTaskFlow"),
  "unknown-school workbench should derive and render the official-source task flow",
);
assert.ok(
  workbenchSource.indexOf("<UnknownSchoolSourceTaskFlow") <
    workbenchSource.indexOf("<UnknownSchoolPublicDocumentMatrix"),
  "task flow should appear before the broader document matrix",
);
assert.ok(
  mainSource.includes("function UnknownSchoolSourceTaskFlow") &&
    mainSource.includes('className="unknown-school-source-task-flow"') &&
    mainSource.includes("tasks.map((task)") &&
    mainSource.includes("onUseTemplate(task)"),
  "task flow component should render task cards and allow filling a template into the evidence inbox",
);

for (const className of [
  ".unknown-school-source-task-flow",
  ".unknown-school-source-task-flow-head",
  ".unknown-school-source-task-list",
  ".unknown-school-source-task-card",
  ".unknown-school-source-task-fields",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
