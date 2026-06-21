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
  title: string;
  text: string;
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
  copyEvidenceInboxBrief(this: RuntimePage): void;
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
  "EVIDENCE_INBOX_STORAGE_PREFIX",
  "classifyEvidenceDraft",
  "buildEvidenceInboxState",
  "evidenceInboxItems",
  "evidenceInboxSummary",
  "saveEvidenceDraft",
  "copyEvidenceInboxBrief",
]) {
  assert.ok(pageScript.includes(token), `index page should support local evidence inbox via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let clipboardText = "";
let capturedPage: IndexPageConfig | undefined;
const currentYear = new Date().getFullYear();

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
    setClipboardData(options: { data: string; success?: () => void }) {
      clipboardText = options.data;
      options.success?.();
    },
    showToast() {},
  },
}, { filename: "miniprogram/pages/index/index.js" });

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

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "郑州工商学院 2024届毕业生就业质量报告：护理学就业率94.2%，来源：学校官网信息公开栏目。" },
});
capturedPage.saveEvidenceDraft.call(page);

const firstInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(firstInbox.length, 1);
assert.equal(firstInbox[0].slotLabel, "就业报告");
assert.equal(firstInbox[0].taskTitle, "抓报告");
assert.ok(firstInbox[0].title.includes("郑州工商学院"));
assert.equal(page.data.evidenceDraftText, "");
assert.equal(page.data.evidenceInboxSummary, "1 条证据｜已覆盖：就业报告");

const reportTask = (page.data.evidenceProgress as EvidenceProgressItem[]).find((task) => task.title === "抓报告");
assert.ok(reportTask?.done, "saving employment report evidence should mark 抓报告 as done");

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: `就业信息网宣讲会：${currentYear}-03-18，京东方、比亚迪到校招聘，岗位含设备工程师、质量工程师，面向护理学等专业交叉岗位。` },
});
capturedPage.saveEvidenceDraft.call(page);

const secondInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(secondInbox.length, 2);
assert.equal(secondInbox[0].slotLabel, "到校招聘");
assert.equal(secondInbox[0].taskTitle, "抓企业");
assert.equal(page.data.evidenceInboxSummary, "2 条证据｜已覆盖：到校招聘、就业报告");

capturedPage.copyEvidenceInboxBrief.call(page);
assert.ok(clipboardText.includes("郑州工商学院｜护理学 证据箱汇总"));
assert.ok(clipboardText.includes("就业报告：郑州工商学院 2024届毕业生就业质量报告"));
assert.ok(clipboardText.includes("到校招聘：就业信息网宣讲会"));
assert.ok(clipboardText.includes("下一步：继续补学校主体、专业资料、岗位薪资"));

const savedKeys = Array.from(storage.keys()).filter((key) => key.includes("evidenceInbox"));
assert.equal(savedKeys.length, 1, "evidence inbox should persist to one scoped key");
assert.equal((storage.get(savedKeys[0]) as EvidenceInboxItem[]).length, 2);

const removeId = secondInbox[0].id;
capturedPage.removeEvidenceInboxItem.call(page, { currentTarget: { dataset: { id: removeId } } });
assert.equal((page.data.evidenceInboxItems as EvidenceInboxItem[]).length, 1);
assert.equal(page.data.evidenceInboxSummary, "1 条证据｜已覆盖：就业报告");

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "evidence-inbox-panel",
  "onEvidenceDraftInput",
  "saveEvidenceDraft",
  "copyEvidenceInboxBrief",
  "removeEvidenceInboxItem",
  "evidenceInboxItems",
]) {
  assert.ok(markup.includes(token), `index markup should expose evidence inbox via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".evidence-inbox-panel", ".evidence-draft-input", ".evidence-inbox-card"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program evidence inbox verified.");
