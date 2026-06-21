import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type SavedCandidate = {
  key: string;
  schoolName: string;
  majorName: string;
  progressText: string;
  missingTasks: string[];
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
  removeSavedCandidate(this: RuntimePage, event: { currentTarget: { dataset: { key: string } } }): void;
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
  "SAVED_CANDIDATE_STORAGE_KEY",
  "savedCandidates",
  "savedCandidateSummary",
  "saveCurrentCandidate",
  "removeSavedCandidate",
  "copyCandidateReport",
  "buildCandidateReportText",
]) {
  assert.ok(pageScript.includes(token), `index page should support candidate comparison via ${token}`);
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
saveCandidate(page, "郑州工商学院", "护理学", [
  "来源：学校官网｜学校全称：郑州工商学院｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
  "来源：招生网｜护理学专业｜学院：医学院｜学制：四年｜核心课程：基础护理学、健康评估｜页面：https://zsb.ztbu.edu.cn/",
]);

assert.equal(page.data.savedCandidateSummary, "1 个候选");
assert.equal((page.data.savedCandidates as SavedCandidate[])[0].schoolName, "郑州工商学院");
assert.equal((page.data.savedCandidates as SavedCandidate[])[0].majorName, "护理学");
assert.ok((page.data.savedCandidates as SavedCandidate[])[0].missingTasks.includes("抓报告"));

saveCandidate(page, "武汉工商学院", "会计学", [
  "来源：学校官网｜学校全称：武汉工商学院｜主管部门：湖北省教育厅｜办学层次：民办本科｜官网域名：www.wtbu.edu.cn｜页面：https://www.wtbu.edu.cn/",
]);

assert.equal(page.data.savedCandidateSummary, "2 个候选");
assert.equal((page.data.savedCandidates as SavedCandidate[])[0].schoolName, "武汉工商学院");
assert.equal((page.data.savedCandidates as SavedCandidate[])[1].schoolName, "郑州工商学院");

capturedPage.copyCandidateReport.call(page);
assert.ok(clipboardText.includes("候选对比报告"));
assert.ok(clipboardText.includes("武汉工商学院"));
assert.ok(clipboardText.includes("郑州工商学院"));
assert.ok(clipboardText.includes("待补齐"));

const savedKeys = Array.from(storage.keys()).filter((key) => key.includes("savedCandidates"));
assert.equal(savedKeys.length, 1, "saved candidate list should persist to one scoped key");
assert.equal((storage.get(savedKeys[0]) as SavedCandidate[]).length, 2);

const restoredPage = createRuntimePage();
capturedPage.onLoad.call(restoredPage);
assert.equal(restoredPage.data.savedCandidateSummary, "2 个候选");

const removeKey = (restoredPage.data.savedCandidates as SavedCandidate[])[0].key;
capturedPage.removeSavedCandidate.call(restoredPage, { currentTarget: { dataset: { key: removeKey } } });
assert.equal(restoredPage.data.savedCandidateSummary, "1 个候选");
assert.equal((restoredPage.data.savedCandidates as SavedCandidate[]).length, 1);

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "saved-candidate-panel",
  "saveCurrentCandidate",
  "copyCandidateReport",
  "removeSavedCandidate",
  "savedCandidates",
]) {
  assert.ok(markup.includes(token), `index markup should expose candidate comparison via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".saved-candidate-panel", ".saved-candidate-card", ".candidate-action-row"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program candidate comparison verified.");
