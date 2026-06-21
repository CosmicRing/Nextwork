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
  trustLabel: string;
  trustLevel: string;
  sourceHint: string;
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
  "buildEvidenceProgressStateFromInbox",
  "syncEvidenceProgressFromInbox",
  "readEvidenceInboxItems",
]) {
  assert.ok(pageScript.includes(token), `index page should restore progress from trusted inbox via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;

const trustedReportEvidence: EvidenceInboxItem = {
  id: "trusted-report-1",
  slotLabel: "就业报告",
  taskTitle: "抓报告",
  trustStatus: "verified",
  trustLabel: "可信",
  trustLevel: "官方报告优先",
  sourceHint: "来源线索可核验，可计入进度",
  title: "郑州工商学院2024届毕业生就业质量报告",
  text: "来源：学校官网信息公开栏目，郑州工商学院2024届毕业生就业质量报告显示护理学就业率94.2%。",
};

storage.set("kankanSalary:evidenceInbox:郑州工商学院:护理学", [trustedReportEvidence]);

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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

const restoredItems = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(restoredItems.length, 1);
assert.equal(restoredItems[0].trustStatus, "verified");
assert.equal(page.data.evidenceInboxSummary, "1 条证据｜已覆盖：就业报告");
assert.equal(page.data.evidenceProgressText, "1/5 已完成");

const reportTask = (page.data.evidenceProgress as EvidenceProgressItem[]).find((task) => task.title === "抓报告");
assert.ok(reportTask?.done, "trusted stored report evidence should restore 抓报告 on page rebuild");

const cityScopedProgressStorage = storage.get("kankanSalary:evidenceProgress:郑州工商学院:护理学:郑州") as string[] | undefined;
assert.deepEqual(
  Array.from(cityScopedProgressStorage ?? []),
  ["抓报告"],
  "legacy inbox evidence should be restored into city-scoped progress storage",
);

const legacyProgressStorage = storage.get("kankanSalary:evidenceProgress:郑州工商学院:护理学");
assert.equal(legacyProgressStorage, undefined, "restored progress should not write new completion back to legacy unscoped storage");

console.log("Mini program evidence inbox progress restoration verified.");
