import assert from "node:assert/strict";

import { buildUnknownSchoolOfficialSourceTaskFlow } from "../src/lib/unknownSchoolEntryPack";
import { buildUnknownSchoolSourceTaskProgress } from "../src/lib/unknownSchoolSourceTaskProgress";

const tasks = buildUnknownSchoolOfficialSourceTaskFlow({
  schoolName: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662",
  majorName: "\u7535\u5b50\u5546\u52a1",
  jobName: "\u7535\u5546\u8fd0\u8425",
  officialDomain: "zkvtc.edu.cn",
});

const unrelatedProgress = buildUnknownSchoolSourceTaskProgress({
  tasks,
  items: [
    {
      kind: "campus",
      title: "\u62a4\u7406\u5b66\u4e13\u573a\u53cc\u9009\u4f1a",
      detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u65e5\u671f\uff1a2025-04-12\uff5c\u5b66\u6821\uff1a\u6cb3\u5357\u62a4\u7406\u804c\u4e1a\u5b66\u9662\uff5c\u4f01\u4e1a\uff1a\u90d1\u5dde\u4eba\u6c11\u533b\u9662\uff5c\u5c97\u4f4d\uff1a\u62a4\u58eb",
      url: "https://job.hnnvc.edu.cn/campus/nursing-2025",
    },
    {
      kind: "salary",
      title: "\u533b\u9662\u62a4\u58eb\u6821\u62db\u5c97\u4f4d",
      detail: "\u4f01\u4e1a\u5b98\u65b9\u6e90\uff5c\u5c97\u4f4d\u540d\uff1a\u62a4\u58eb\uff5c\u57ce\u5e02\uff1a\u90d1\u5dde\uff5c\u85aa\u8d44\u533a\u95f4\uff1a7-12K\uff5c\u5b66\u5386\u8981\u6c42\uff1a\u5927\u4e13",
      url: "https://careers.example.com/nurse",
    },
  ],
});

assert.equal(
  unrelatedProgress.find((item) => item.task.id === "campus-recruiting")?.status,
  "missing",
  "unrelated campus evidence should not complete the current school's campus task just because it has kind=campus",
);
assert.equal(
  unrelatedProgress.find((item) => item.task.id === "salary-proxy")?.status,
  "missing",
  "unrelated salary evidence should not complete the current job salary task just because it has kind=salary",
);

const relatedProgress = buildUnknownSchoolSourceTaskProgress({
  tasks,
  items: [
    {
      kind: "campus",
      title: "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662\u7535\u5546\u8fd0\u8425\u5ba3\u8bb2\u4f1a",
      detail: "\u5b66\u6821\u5b98\u65b9\u6e90\uff5c\u65e5\u671f\uff1a2025-04-12\uff5c\u4f01\u4e1a\uff1a\u6cb3\u5357\u7535\u5546\u670d\u52a1\u6709\u9650\u516c\u53f8\uff5c\u5c97\u4f4d\uff1a\u7535\u5546\u8fd0\u8425",
      url: "https://job.zkvtc.edu.cn/campus/2025-04-12",
    },
    {
      kind: "salary",
      title: "\u4f01\u4e1a\u5b98\u7f51\u7535\u5546\u8fd0\u8425\u5c97\u4f4d",
      detail: "\u4f01\u4e1a\u5b98\u65b9\u6e90\uff5c\u5c97\u4f4d\u540d\uff1a\u7535\u5546\u8fd0\u8425\uff5c\u57ce\u5e02\uff1a\u90d1\u5dde\uff5c\u85aa\u8d44\u533a\u95f4\uff1a7-12K",
      url: "https://careers.example.com/ecommerce-operator",
    },
  ],
});

assert.equal(relatedProgress.find((item) => item.task.id === "campus-recruiting")?.status, "done");
assert.equal(relatedProgress.find((item) => item.task.id === "salary-proxy")?.status, "done");

console.log("Unknown school source task context matching verified.");
