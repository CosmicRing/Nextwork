import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RankedCandidate = {
  schoolName: string;
  majorName: string;
  rankScore: number;
  missingTasks: string[];
};

type CandidateVerdict = {
  title: string;
  reason: string;
  missingLabel: string;
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
  copyCandidateReport(this: RuntimePage): void;
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
  "buildCandidateVerdict",
  "candidateVerdict",
  "candidateVerdictText",
  "rankScore",
]) {
  assert.ok(pageScript.includes(token), `index page should produce candidate verdict via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let clipboardText = "";
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
      setClipboardData(options: { data: string; success?: () => void }) {
        clipboardText = options.data;
        options.success?.();
      },
      showToast() {},
    },
  },
  { filename: "miniprogram/pages/index/index.js" },
);

assert.ok(capturedPage, "index page should register through Page()");

function createRuntimePage(): RuntimePage {
  return {
    data: JSON.parse(JSON.stringify(capturedPage?.data ?? {})) as Record<string, unknown>,
    setData(nextData: Record<string, unknown>) {
      this.data = { ...this.data, ...nextData };
    },
  };
}

function saveEvidence(page: RuntimePage, text: string) {
  capturedPage?.onEvidenceDraftInput.call(page, { detail: { value: text } });
  capturedPage?.saveEvidenceDraft.call(page);
}

function saveCandidate(page: RuntimePage, schoolName: string, majorName: string, evidenceItems: string[]) {
  capturedPage?.onSchoolInput.call(page, { detail: { value: schoolName } });
  capturedPage?.onMajorInput.call(page, { detail: { value: majorName } });
  for (const evidence of evidenceItems) saveEvidence(page, evidence);
  capturedPage?.saveCurrentCandidate.call(page);
}

const page = createRuntimePage();
capturedPage.onLoad.call(page);
saveCandidate(page, "郑州工商学院", "电子商务", [
  "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
  "来源：招生网｜电子商务专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zsb.ztbu.edu.cn/",
]);
saveCandidate(page, "武汉工商学院", "会计学", [
  "来源：学校官网｜学校全称：武汉工商学院｜主管部门：湖北省教育厅｜办学层次：民办本科｜官网域名：www.wtbu.edu.cn｜页面：https://www.wtbu.edu.cn/",
]);

const verdict = page.data.candidateVerdict as CandidateVerdict;
assert.equal(verdict.title, "优先继续查：郑州工商学院｜电子商务");
assert.ok(verdict.reason.includes("证据进度更完整"), "verdict should explain why the top candidate wins");
assert.equal(verdict.missingLabel, "缺口：抓报告、抓企业、补薪资");
assert.equal(verdict.ranked[0].schoolName, "郑州工商学院");
assert.equal(verdict.ranked[0].majorName, "电子商务");
assert.ok(verdict.ranked[0].rankScore > verdict.ranked[1].rankScore, "higher evidence completion should rank first");

assert.ok(String(page.data.candidateVerdictText).includes("候选结论排序"));
assert.ok(String(page.data.candidateVerdictText).includes("优先继续查：郑州工商学院｜电子商务"));

capturedPage.copyCandidateReport.call(page);
assert.ok(clipboardText.includes("候选结论排序"));
assert.ok(clipboardText.includes("优先继续查：郑州工商学院｜电子商务"));
assert.ok(clipboardText.includes("1. 郑州工商学院｜电子商务"));
assert.ok(clipboardText.includes("2. 武汉工商学院｜会计学"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "candidate-verdict-card",
  "candidateVerdict.title",
  "candidateVerdict.reason",
  "candidateVerdict.missingLabel",
]) {
  assert.ok(markup.includes(token), `index markup should expose candidate verdict via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".candidate-verdict-card", ".candidate-verdict-title", ".candidate-verdict-card strong"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program candidate verdict verified.");
