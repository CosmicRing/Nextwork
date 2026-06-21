import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceProgressItem = {
  id: string;
  title: string;
  done: boolean;
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
  "buildEvidenceProgressStorageKey",
  "buildEvidenceProgress",
  "evidenceProgress",
  "evidenceProgressText",
  "syncEvidenceProgressFromInbox",
  "wx.getStorageSync",
  "wx.setStorageSync",
]) {
  assert.ok(pageScript.includes(token), `index page should include evidence progress support via ${token}`);
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

function createRuntimePage(): RuntimePage {
  return {
    data: JSON.parse(JSON.stringify(capturedPage?.data ?? {})) as Record<string, unknown>,
    setData(nextData: Record<string, unknown>) {
      this.data = { ...this.data, ...nextData };
    },
  };
}

const page = createRuntimePage();
capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

assert.equal(page.data.evidenceProgressText, "0/5 已完成");
const progress = page.data.evidenceProgress as EvidenceProgressItem[];
assert.equal(progress.length, 5, "progress should track the five rescue evidence tasks");
const majorTask = progress.find((item) => item.title === "验专业");
assert.ok(majorTask, "progress should include the major verification task");

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value:
      "来源：招生网｜护理学专业｜学院：医学院｜学制：四年｜核心课程：基础护理学、健康评估｜页面：https://zsb.ztbu.edu.cn/",
  },
});
capturedPage.saveEvidenceDraft.call(page);

assert.equal(page.data.evidenceProgressText, "1/5 已完成");
assert.equal((page.data.evidenceProgress as EvidenceProgressItem[]).find((item) => item.id === majorTask.id)?.done, true);

const progressStorageKey = Array.from(storage.keys()).find((key) => key.startsWith("kankanSalary:evidenceProgress"));
assert.ok(progressStorageKey, "verified evidence should persist one scoped progress record");
assert.ok(progressStorageKey.includes("郑州工商学院") && progressStorageKey.includes("护理学"), "storage key should scope by school and major");
assert.deepEqual(
  Array.from(storage.get(progressStorageKey) as string[]),
  [majorTask.id],
  "storage should persist only verified evidence task ids",
);

const restoredPage = createRuntimePage();
capturedPage.onLoad.call(restoredPage);
capturedPage.onSchoolInput.call(restoredPage, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(restoredPage, { detail: { value: "护理学" } });
assert.equal(restoredPage.data.evidenceProgressText, "1/5 已完成");
assert.equal(
  (restoredPage.data.evidenceProgress as EvidenceProgressItem[]).find((item) => item.id === majorTask.id)?.done,
  true,
  "progress should restore from local storage for the same school and major",
);

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "evidence-progress-bar",
  "evidenceProgressText",
  "证据自动完成",
  "item.done",
]) {
  assert.ok(markup.includes(token), `index markup should render evidence progress via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".evidence-progress-bar",
  ".rescue-task-row.done",
  ".source-task-status-note",
]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program evidence progress verified.");
