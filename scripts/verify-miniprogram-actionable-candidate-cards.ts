import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RankedCandidate = {
  schoolName: string;
  majorName: string;
  rankScore: number;
  readinessTitle: string;
  missingTasks: string[];
  nextAction: string;
};

type CandidateVerdict = {
  ranked: RankedCandidate[];
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onLoad(this: RuntimePage): void;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onMajorInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onEvidenceDraftInput(this: RuntimePage, event: { detail: { value: string } }): void;
  saveEvidenceDraft(this: RuntimePage): void;
  saveCurrentCandidate(this: RuntimePage): void;
};

function read(relativePath: string) {
  return readFileSync(relativePath, "utf8");
}

function loadSampleData() {
  const sandbox = {
    module: { exports: {} as Record<string, unknown> },
    exports: {} as Record<string, unknown>,
  };
  vm.runInNewContext(read("miniprogram/utils/sample-data.js"), sandbox, {
    filename: "miniprogram/utils/sample-data.js",
  });
  return sandbox.module.exports as Record<string, unknown>;
}

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of [
  "rankScore",
  "readinessTitle",
  "nextAction",
]) {
  assert.ok(pageScript.includes(token), `index page should keep actionable candidate fields via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;

vm.runInNewContext(
  pageScript,
  {
    require(specifier: string) {
      if (specifier === "../../utils/sample-data") return sampleData;
      throw new Error(`unexpected require: ${specifier}`);
    },
    Page(config: IndexPageConfig) {
      capturedPage = config;
    },
    wx: {
      getStorageSync(key: string) {
        return storage.get(key);
      },
      setStorageSync(key: string, value: unknown) {
        storage.set(key, value);
      },
      setClipboardData() {},
      showToast() {},
    },
  },
  { filename: "miniprogram/pages/index/index.js" },
);

assert.ok(capturedPage, "index page should register through Page()");

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

function saveEvidence(text: string) {
  capturedPage?.onEvidenceDraftInput.call(page, { detail: { value: text } });
  capturedPage?.saveEvidenceDraft.call(page);
}

function saveEvidenceForTask(taskTitle: string, majorName: string) {
  const evidenceByTask: Record<string, string> = {
    验学校:
      "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
    验专业: `来源：招生网｜${majorName}专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zsb.ztbu.edu.cn/`,
    补薪资:
      "来源：京东招聘官网｜岗位：供应链运营｜城市：郑州｜薪资：8-12K/月｜学历要求：本科｜更新时间：2025-04-01｜页面：https://careers.jd.com/",
  };
  const evidence = evidenceByTask[taskTitle];
  assert.ok(evidence, `missing evidence fixture for ${taskTitle}`);
  saveEvidence(evidence);
}

function saveCandidate(schoolName: string, majorName: string, doneTaskTitles: string[]) {
  capturedPage?.onSchoolInput.call(page, { detail: { value: schoolName } });
  capturedPage?.onMajorInput.call(page, { detail: { value: majorName } });
  for (const title of doneTaskTitles) saveEvidenceForTask(title, majorName);
  capturedPage?.saveCurrentCandidate.call(page);
}

capturedPage.onLoad.call(page);
saveCandidate("郑州工商学院", "电子商务", ["验学校", "验专业", "补薪资"]);
saveCandidate("武汉工商学院", "会计学", ["验学校"]);

const ranked = (page.data.candidateVerdict as CandidateVerdict).ranked;
assert.equal(ranked[0].schoolName, "郑州工商学院");
assert.equal(ranked[0].readinessTitle, "可先初筛");
assert.ok(ranked[0].rankScore > ranked[1].rankScore);
assert.ok(ranked[0].missingTasks.includes("抓报告"));
assert.ok(ranked[0].nextAction.includes("下一步") || ranked[0].nextAction.includes("继续补"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  'wx:for="{{candidateVerdict.ranked}}"',
  "candidate-card-score",
  "candidate-card-readiness",
  "candidate-card-missing-row",
  "candidate-card-next-action",
  "item.rankScore",
  "item.readinessTitle",
  "item.nextAction",
]) {
  assert.ok(markup.includes(token), `saved candidate cards should expose actionable ranked details via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".candidate-card-score",
  ".candidate-card-readiness",
  ".candidate-card-missing-row",
  ".candidate-card-next-action",
]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program actionable candidate cards verified.");
