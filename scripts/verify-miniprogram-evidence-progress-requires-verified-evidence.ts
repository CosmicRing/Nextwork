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
  toggleEvidenceTask?: (this: RuntimePage, event: { currentTarget: { dataset: { taskId: string } } }) => void;
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

const markup = read("miniprogram/pages/index/index.wxml");
const runwayStart = markup.indexOf('class="source-task-runway rescue-task-list"');
const runwayEnd = markup.indexOf('class="source-ladder-panel"', runwayStart);
assert.ok(runwayStart > -1 && runwayEnd > runwayStart, "source task runway should render before the source ladder");
const runwayMarkup = markup.slice(runwayStart, runwayEnd);

assert.ok(!runwayMarkup.includes('bindtap="toggleEvidenceTask"'), "source task runway must not expose a manual completion button");
assert.ok(!runwayMarkup.includes("标记"), "source task runway must not invite users to mark evidence as complete manually");
assert.ok(runwayMarkup.includes("证据自动完成"), "source task runway should explain that progress is evidence-driven");

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;

vm.runInNewContext(
  read("miniprogram/pages/index/index.js"),
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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

const initialProgress = page.data.evidenceProgress as EvidenceProgressItem[];
assert.equal(page.data.evidenceProgressText, "0/5 已完成");
assert.ok(initialProgress.every((task) => !task.done), "new candidates should start without completed tasks");

const majorTask = initialProgress.find((task) => task.title === "验专业");
assert.ok(majorTask, "progress should include the major verification task");

capturedPage.toggleEvidenceTask?.call(page, { currentTarget: { dataset: { taskId: majorTask.id } } });
assert.equal(page.data.evidenceProgressText, "0/5 已完成", "manual task toggles must not advance evidence progress");
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "manual task toggles must not mark any task done",
);
assert.equal(storage.size, 0, "manual task toggles must not persist fake completion");

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value:
      "来源：招生网｜护理学专业｜学院：医学院｜学制：四年｜核心课程：基础护理学、健康评估｜页面：https://zsb.ztbu.edu.cn/",
  },
});
capturedPage.saveEvidenceDraft.call(page);

const verifiedProgress = page.data.evidenceProgress as EvidenceProgressItem[];
assert.equal(page.data.evidenceProgressText, "1/5 已完成");
assert.equal(verifiedProgress.find((task) => task.title === "验专业")?.done, true);
const progressStorageKey = Array.from(storage.keys()).find((key) => key.startsWith("kankanSalary:evidenceProgress"));
assert.ok(progressStorageKey, "verified evidence should persist scoped completion");
assert.deepEqual(Array.from(storage.get(progressStorageKey) as string[]), ["验专业"]);

console.log("Mini program evidence progress requires verified evidence.");
