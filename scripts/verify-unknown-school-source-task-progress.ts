import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolSourceTaskProgress } from "../src/lib/unknownSchoolSourceTaskProgress";
import {
  buildUnknownSchoolEvidenceCaptureTemplate,
  buildUnknownSchoolOfficialSourceTaskFlow,
} from "../src/lib/unknownSchoolEntryPack";

const tasks = buildUnknownSchoolOfficialSourceTaskFlow({
  schoolName: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662",
  majorName: "\u7535\u5b50\u5546\u52a1",
  jobName: "\u7535\u5546\u8fd0\u8425",
  officialDomain: "zkvtc.edu.cn",
});

const emptyProgress = buildUnknownSchoolSourceTaskProgress({ tasks, items: [] });
assert.deepEqual(
  emptyProgress.map((item) => item.status),
  ["missing", "missing", "missing", "missing", "missing"],
  "all source tasks should start missing before the user saves evidence",
);
assert.ok(emptyProgress.every((item) => item.statusLabel === "\u7f3a\u8bc1\u636e"));

const campusTask = tasks.find((task) => task.id === "campus-recruiting");
assert.ok(campusTask, "campus task should exist");
const campusTemplate = buildUnknownSchoolEvidenceCaptureTemplate(campusTask);
const weakCampusProgress = buildUnknownSchoolSourceTaskProgress({
  tasks,
  items: [
    {
      kind: campusTemplate.kind,
      title: campusTask.label,
      detail: campusTemplate.detail,
      url: campusTemplate.url,
    },
  ],
});
const campusProgress = weakCampusProgress.find((item) => item.task.id === "campus-recruiting");
assert.equal(campusProgress?.status, "needs-fields");
assert.equal(campusProgress?.statusLabel, "\u7f3a\u539f\u6587\u5b57\u6bb5");
assert.ok(campusProgress?.detail.includes("\u8865\u9f50"), "weak entrance task should tell users to fill fields");

const completeProgress = buildUnknownSchoolSourceTaskProgress({
  tasks,
  items: [
    {
      kind: "major",
      title: "\u9633\u5149\u9ad8\u8003\u9662\u6821\u5e93",
      detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u5b66\u6821\u5168\u79f0\uff1a\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662\uff5c\u5b98\u65b9\u7f51\u5740\uff1awww.zkvtc.edu.cn",
      url: "https://gaokao.chsi.com.cn/sch/schoolInfo--schId-1.dhtml",
    },
    {
      kind: "major",
      title: "\u7535\u5b50\u5546\u52a1\u57f9\u517b\u65b9\u6848",
      detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u4e13\u4e1a\u540d\uff1a\u7535\u5b50\u5546\u52a1\uff5c\u5b66\u9662\uff1a\u5546\u5b66\u9662\uff5c\u6838\u5fc3\u8bfe\u7a0b\uff1a\u7f51\u7edc\u8425\u9500",
      url: "https://www.zkvtc.edu.cn/sxy/major/ecommerce",
    },
    {
      kind: "campus",
      title: "\u5c31\u4e1a\u4fe1\u606f\u7f51\u5ba3\u8bb2\u4f1a",
      detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u65e5\u671f\uff1a2025-04-12\uff5c\u4f01\u4e1a\uff1a\u6cb3\u5357\u7535\u5546\u670d\u52a1\u6709\u9650\u516c\u53f8\uff5c\u5c97\u4f4d\uff1a\u7535\u5546\u8fd0\u8425",
      url: "https://job.zkvtc.edu.cn/campus/2025-04-12",
    },
  ],
});

assert.equal(completeProgress.find((item) => item.task.id === "verify-school")?.status, "done");
assert.equal(completeProgress.find((item) => item.task.id === "verify-major")?.status, "done");
assert.equal(completeProgress.find((item) => item.task.id === "campus-recruiting")?.status, "done");
assert.equal(completeProgress.find((item) => item.task.id === "employment-report")?.status, "missing");
assert.equal(completeProgress.find((item) => item.task.id === "salary-proxy")?.status, "missing");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function UnknownSchoolPublicDocumentMatrix", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(
  mainSource.includes("buildUnknownSchoolSourceTaskProgress"),
  "main UI should import the source-task progress helper",
);
assert.ok(
  workbenchSource.includes("const sourceTaskProgress = buildUnknownSchoolSourceTaskProgress({") &&
    workbenchSource.includes("items: evidenceItems"),
  "unknown-school workbench should compute source-task progress from saved evidence items",
);
assert.ok(
  mainSource.slice(accessStart, workbenchStart).includes("evidenceItems={manualEvidenceItems}"),
  "school access panel should pass saved evidence items into the unknown-school workbench",
);
assert.ok(
  workbenchSource.includes("taskProgress={sourceTaskProgress}") &&
    mainSource.includes("task-status-${progress.status}") &&
    mainSource.includes("progress.statusLabel") &&
    mainSource.includes("progress.detail"),
  "task flow cards should expose visible status labels and details",
);

for (const className of [
  ".unknown-school-source-task-status",
  ".unknown-school-source-task-card.task-status-done",
  ".unknown-school-source-task-card.task-status-needs-fields",
  ".unknown-school-source-task-card.task-status-missing",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
