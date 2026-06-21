import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolSourceTaskProgress,
  summarizeUnknownSchoolSourceTaskProgress,
} from "../src/lib/unknownSchoolSourceTaskProgress";
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

const emptySummary = summarizeUnknownSchoolSourceTaskProgress(
  buildUnknownSchoolSourceTaskProgress({ tasks, items: [] }),
);
assert.equal(emptySummary.totalCount, 5);
assert.equal(emptySummary.doneCount, 0);
assert.equal(emptySummary.needsFieldsCount, 0);
assert.equal(emptySummary.missingCount, 5);
assert.equal(emptySummary.percentComplete, 0);
assert.equal(emptySummary.currentTaskId, "verify-school");
assert.ok(emptySummary.headline.includes("\u5148\u9a8c\u5b66\u6821"));
assert.ok(emptySummary.nextAction.includes("\u5b66\u6821\u5168\u79f0"));
assert.ok(emptySummary.copyText.includes("0/5"));

const verifySchoolTask = tasks.find((task) => task.id === "verify-school");
const campusTask = tasks.find((task) => task.id === "campus-recruiting");
assert.ok(verifySchoolTask);
assert.ok(campusTask);
const weakCampusTemplate = buildUnknownSchoolEvidenceCaptureTemplate(campusTask);
const partialSummary = summarizeUnknownSchoolSourceTaskProgress(
  buildUnknownSchoolSourceTaskProgress({
    tasks,
    items: [
      {
        kind: "major",
        title: "\u9633\u5149\u9ad8\u8003\u9662\u6821\u5e93",
        detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u5b66\u6821\u5168\u79f0\uff1a\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662\uff5c\u5b98\u65b9\u7f51\u5740\uff1awww.zkvtc.edu.cn",
        url: "https://gaokao.chsi.com.cn/sch/schoolInfo--schId-1.dhtml",
      },
      {
        kind: weakCampusTemplate.kind,
        title: campusTask.label,
        detail: weakCampusTemplate.detail,
        url: weakCampusTemplate.url,
      },
    ],
  }),
);
assert.equal(partialSummary.doneCount, 1);
assert.equal(partialSummary.needsFieldsCount, 1);
assert.equal(partialSummary.missingCount, 3);
assert.equal(partialSummary.percentComplete, 20);
assert.equal(partialSummary.currentTaskId, "verify-major", "summary should still follow the task order");
assert.ok(partialSummary.warning.includes("\u5f31\u8bc1\u636e"));

const completeSummary = summarizeUnknownSchoolSourceTaskProgress(
  buildUnknownSchoolSourceTaskProgress({
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
        kind: "report",
        title: "\u5c31\u4e1a\u8d28\u91cf\u62a5\u544a",
        detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u62a5\u544a\u5e74\u4efd\uff1a2025\uff5c\u5c31\u4e1a\u7387\uff1a92%\uff5c\u5347\u5b66\u7387\uff1a12%",
        url: "https://www.zkvtc.edu.cn/report/2025.pdf",
      },
      {
        kind: "campus",
        title: "\u5c31\u4e1a\u4fe1\u606f\u7f51\u5ba3\u8bb2\u4f1a",
        detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u65e5\u671f\uff1a2025-04-12\uff5c\u4f01\u4e1a\uff1a\u6cb3\u5357\u7535\u5546\u670d\u52a1\u6709\u9650\u516c\u53f8\uff5c\u5c97\u4f4d\uff1a\u7535\u5546\u8fd0\u8425",
        url: "https://job.zkvtc.edu.cn/campus/2025-04-12",
      },
      {
        kind: "salary",
        title: "\u4f01\u4e1a\u5b98\u7f51\u6821\u62db\u5c97\u4f4d",
        detail: "\u516c\u53f8\u5b98\u7f51\uff5c\u5c97\u4f4d\u540d\uff1a\u7535\u5546\u8fd0\u8425\uff5c\u57ce\u5e02\uff1a\u90d1\u5dde\uff5c\u85aa\u8d44\u533a\u95f4\uff1a7-12K",
        url: "https://example.com/jobs/ecommerce",
      },
    ],
  }),
);
assert.equal(completeSummary.doneCount, 5);
assert.equal(completeSummary.percentComplete, 100);
assert.equal(completeSummary.currentTaskId, "");
assert.ok(completeSummary.headline.includes("\u8bc1\u636e\u95ed\u73af"));
assert.ok(completeSummary.nextAction.includes("\u6a2a\u5411\u6bd4\u8f83"));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const flowStart = mainSource.indexOf("function UnknownSchoolSourceTaskFlow");
const flowEnd = mainSource.indexOf("function UnknownSchoolPublicDocumentMatrix", flowStart);
const flowSource = mainSource.slice(flowStart, flowEnd);

assert.ok(
  mainSource.includes("summarizeUnknownSchoolSourceTaskProgress"),
  "main UI should import the progress summary helper",
);
assert.ok(
  flowSource.includes("const progressSummary = summarizeUnknownSchoolSourceTaskProgress(taskProgress)") &&
    flowSource.includes('className="unknown-school-source-task-summary"') &&
    flowSource.includes("progressSummary.headline") &&
    flowSource.includes("progressSummary.nextAction"),
  "task flow should render a compact summary before the task cards",
);

for (const className of [
  ".unknown-school-source-task-summary",
  ".unknown-school-source-task-meter",
  ".unknown-school-source-task-summary-stats",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
