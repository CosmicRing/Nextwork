import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceProgressItem = {
  title: string;
  done: boolean;
};

type EvidenceInboxItem = {
  slotLabel: string;
  trustStatus: "verified" | "pending";
  trustLabel: string;
  sourceHint: string;
  taskTitle: string;
  title: string;
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
  "isCredibleEvidenceText",
  "trustStatus",
  "trustLabel",
  "sourceHint",
  "可信覆盖",
  "待核验",
]) {
  assert.ok(pageScript.includes(token), `index page should gate weak evidence via ${token}`);
}

const sampleData = loadSampleData();
let clipboardText = "";
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
    getStorageSync() {
      return undefined;
    },
    setStorageSync() {},
    setClipboardData(options: { data: string; success?: () => void }) {
      clipboardText = options.data;
      options.success?.();
    },
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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "护理学就业前景广阔，就业率高，薪资可观，名企认可，适合普通家庭报考。" },
});
capturedPage.saveEvidenceDraft.call(page);

const weakInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(weakInbox.length, 1);
assert.equal(weakInbox[0].trustStatus, "pending");
assert.equal(weakInbox[0].trustLabel, "待核验");
assert.ok(weakInbox[0].sourceHint.includes("补官网"));
assert.equal(page.data.evidenceInboxSummary, "1 条证据｜可信覆盖：暂无｜待核验：1");
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "weak promotional evidence must not mark any evidence task as done",
);

capturedPage.copyEvidenceInboxBrief.call(page);
assert.ok(clipboardText.includes("待核验证据：1 条"));
assert.ok(clipboardText.includes("护理学就业前景广阔"));
assert.ok(clipboardText.includes("下一步：继续补学校主体、专业资料、就业报告、到校招聘、岗位薪资"));

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "来源：学校官网信息公开栏目，郑州工商学院2024届毕业生就业质量报告显示护理学就业率94.2%。" },
});
capturedPage.saveEvidenceDraft.call(page);

const mixedInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(mixedInbox[0].trustStatus, "verified");
assert.equal(mixedInbox[0].trustLabel, "可信");
assert.equal(page.data.evidenceInboxSummary, "2 条证据｜可信覆盖：就业报告｜待核验：1");
const reportTask = (page.data.evidenceProgress as EvidenceProgressItem[]).find((task) => task.title === "抓报告");
assert.ok(reportTask?.done, "credible official report evidence should still complete 抓报告");

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "item.trustLabel",
  "item.trustStatus",
  "item.sourceHint",
  "evidence-trust-badge",
]) {
  assert.ok(markup.includes(token), `index markup should expose evidence trust state via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".evidence-trust-badge", ".evidence-trust-badge.pending", ".evidence-source-hint"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program evidence trust gate verified.");
