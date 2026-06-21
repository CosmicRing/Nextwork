import assert from "node:assert/strict";

import { buildSchoolNextAction } from "../src/lib/schoolNextAction";

const emptyDirection = buildSchoolNextAction({
  majorName: "",
  jobName: "",
  candidate: {
    evidenceScore: 24,
    evidenceLabel: "只适合起步",
    missingEvidence: ["补一个专业名，避免泛泛比较学校"],
  },
  tasks: [],
  checkedTaskKeys: [],
  coverage: { coveredCount: 0, totalCount: 4, nextMissingLabel: "还缺专业存在" },
});

assert.equal(emptyDirection.kind, "fill-direction");
assert.equal(emptyDirection.title, "先补一个专业或目标岗位");
assert.ok(emptyDirection.detail.includes("不要只比较学校名"));
assert.equal(emptyDirection.primaryLabel, "去填专业/岗位");
assert.equal(emptyDirection.url, "");

const reportFirst = buildSchoolNextAction({
  majorName: "护理学",
  jobName: "护士",
  candidate: {
    evidenceScore: 43,
    evidenceLabel: "只适合起步",
    missingEvidence: ["找到近两年就业质量报告 PDF 或信息公开页", "核验就业信息网、宣讲会或双选会企业名单"],
  },
  tasks: [
    {
      label: "确认专业是否真实开设",
      status: "open",
      source: "招生网",
      detail: "专业目录",
      url: "https://example.edu.cn/major",
    },
    {
      label: "读取就业质量报告",
      status: "search",
      source: "Bing",
      detail: "就业报告检索",
      url: "https://www.bing.com/search?q=report",
    },
  ],
  checkedTaskKeys: ["确认专业是否真实开设::https://example.edu.cn/major"],
  coverage: { coveredCount: 1, totalCount: 4, nextMissingLabel: "还缺就业报告" },
});

assert.equal(reportFirst.kind, "open-report");
assert.equal(reportFirst.title, "下一步只查就业质量报告");
assert.equal(reportFirst.primaryLabel, "打开报告入口");
assert.equal(reportFirst.url, "https://www.bing.com/search?q=report");

const campusFirst = buildSchoolNextAction({
  majorName: "电子商务",
  jobName: "电商运营",
  candidate: {
    evidenceScore: 55,
    evidenceLabel: "可开始比较",
    missingEvidence: ["核验就业信息网、宣讲会或双选会企业名单"],
  },
  tasks: [
    {
      label: "查校招和宣讲会企业",
      status: "search",
      source: "就业信息网",
      detail: "双选会企业名单",
      url: "https://job.example.edu.cn",
    },
  ],
  checkedTaskKeys: [],
  coverage: { coveredCount: 2, totalCount: 4, nextMissingLabel: "还缺到校企业" },
});

assert.equal(campusFirst.kind, "open-campus");
assert.equal(campusFirst.primaryLabel, "打开校招入口");
assert.ok(campusFirst.detail.includes("企业名单"));

const saveEvidence = buildSchoolNextAction({
  majorName: "会计学",
  jobName: "审计助理",
  candidate: {
    evidenceScore: 70,
    evidenceLabel: "可开始比较",
    missingEvidence: ["继续打开原始来源复核细节"],
  },
  tasks: [],
  checkedTaskKeys: [],
  coverage: { coveredCount: 2, totalCount: 4, nextMissingLabel: "还缺岗位薪资" },
});

assert.equal(saveEvidence.kind, "save-evidence");
assert.equal(saveEvidence.primaryLabel, "去收证据");
assert.ok(saveEvidence.detail.includes("收件箱"));

const readyToCompare = buildSchoolNextAction({
  majorName: "网络工程",
  jobName: "安全工程师",
  candidate: {
    evidenceScore: 84,
    evidenceLabel: "资料较完整",
    missingEvidence: [],
  },
  tasks: [],
  checkedTaskKeys: [],
  coverage: { coveredCount: 4, totalCount: 4, nextMissingLabel: "四类证据已齐" },
});

assert.equal(readyToCompare.kind, "copy-packet");
assert.equal(readyToCompare.primaryLabel, "复制查询包");

