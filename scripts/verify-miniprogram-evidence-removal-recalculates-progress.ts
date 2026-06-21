import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceProgressItem = {
  id: string;
  title: string;
  done: boolean;
};

type EvidenceInboxItem = {
  id: string;
  slotLabel: string;
  taskTitle: string;
  trustStatus: "verified" | "pending";
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
  removeEvidenceInboxItem(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
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
  "syncEvidenceProgressFromInbox",
  "getVerifiedTaskTitlesFromEvidenceInbox",
  "removeEvidenceInboxItem",
]) {
  assert.ok(pageScript.includes(token), `index page should recalculate progress from evidence inbox via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;

vm.runInNewContext(pageScript, {
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
}, { filename: "miniprogram/pages/index/index.js" });

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

function getReportTask() {
  const task = (page.data.evidenceProgress as EvidenceProgressItem[]).find((item) => item.title === "抓报告");
  assert.ok(task, "report task should exist");
  return task;
}

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

saveEvidence("来源：学校官网信息公开栏目，郑州工商学院2024届毕业生就业质量报告显示护理学就业率94.2%。");
saveEvidence("https://www.ztbu.edu.cn/info/2025 郑州工商学院毕业生就业质量报告 护理学毕业去向。");

const inboxAfterTwo = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(inboxAfterTwo.length, 2);
assert.ok(inboxAfterTwo.every((item) => item.taskTitle === "抓报告" && item.trustStatus === "verified"));
assert.ok(getReportTask().done, "verified report evidence should mark 抓报告 done");
assert.equal(page.data.evidenceProgressText, "1/5 已完成");

capturedPage.removeEvidenceInboxItem.call(page, { currentTarget: { dataset: { id: inboxAfterTwo[0].id } } });
assert.equal((page.data.evidenceInboxItems as EvidenceInboxItem[]).length, 1);
assert.ok(getReportTask().done, "removing one of two verified report items should keep 抓报告 done");
assert.equal(page.data.evidenceProgressText, "1/5 已完成");

const remainingId = (page.data.evidenceInboxItems as EvidenceInboxItem[])[0].id;
capturedPage.removeEvidenceInboxItem.call(page, { currentTarget: { dataset: { id: remainingId } } });
assert.equal((page.data.evidenceInboxItems as EvidenceInboxItem[]).length, 0);
assert.equal(getReportTask().done, false, "removing the last verified report evidence should clear 抓报告");
assert.equal(page.data.evidenceProgressText, "0/5 已完成");

const progressStorageKey = Array.from(storage.keys()).find((key) => key.includes("evidenceProgress:郑州工商学院:护理学"));
assert.ok(progressStorageKey, "progress storage should be scoped to the current school and major");
assert.deepEqual(
  Array.from((storage.get(progressStorageKey) as string[]) ?? []),
  [],
  "stored checked task ids should be cleared after removing last verified evidence",
);

console.log("Mini program evidence removal progress recalculation verified.");
