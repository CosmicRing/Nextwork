import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceProgressItem = {
  title: string;
  done: boolean;
};

type EvidenceInboxItem = {
  slotLabel: string;
  taskTitle: string;
  trustStatus: "verified" | "pending";
  trustLabel: string;
  sourceHint: string;
};

type EvidenceNextSourceAction = {
  label: string;
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
  onCityInput(this: RuntimePage, event: { detail: { value: string } }): void;
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

const currentYear = new Date().getFullYear();
const staleYear = currentYear - 3;
const freshYear = currentYear;

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of ["classifyEvidenceDraft", "sourceHint", "trustStatus"]) {
  assert.ok(pageScript.includes(token), `index page should classify evidence freshness via ${token}`);
}

const sampleData = loadSampleData();
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
      getStorageSync() {
        return undefined;
      },
      setStorageSync() {},
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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "新乡工程学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });
capturedPage.onCityInput.call(page, { detail: { value: "新乡" } });

saveEvidence(`来源：京东招聘官网｜岗位：供应链运营｜城市：新乡｜薪资：8-12K/月｜学历要求：本科｜更新时间：${staleYear}-04-01｜页面：https://careers.jd.com/`);

const staleInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(staleInbox[0].slotLabel, "岗位薪资");
assert.equal(staleInbox[0].taskTitle, "补薪资");
assert.equal(staleInbox[0].trustStatus, "pending");
assert.equal(staleInbox[0].trustLabel, "待核验");
assert.ok(staleInbox[0].sourceHint.includes("薪资/招聘证据已过期"));
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "stale salary evidence should not advance salary progress",
);
assert.ok(
  (page.data.evidenceNextSourceActions as EvidenceNextSourceAction[]).some((item) => item.label === "新乡本地电商/商贸企业岗位薪资"),
  "stale salary evidence should keep the salary source gap open",
);

saveEvidence(`来源：京东招聘官网｜岗位：供应链运营｜城市：新乡｜薪资：8-12K/月｜学历要求：本科｜更新时间：${freshYear}-04-01｜页面：https://careers.jd.com/`);

const freshInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(freshInbox[0].slotLabel, "岗位薪资");
assert.equal(freshInbox[0].trustStatus, "verified");
assert.equal(freshInbox[0].trustLabel, "可信");
const salaryTask = (page.data.evidenceProgress as EvidenceProgressItem[]).find((task) => task.title === "补薪资");
assert.ok(salaryTask?.done, "fresh official salary evidence should advance salary progress");
assert.ok(
  (page.data.evidenceNextSourceActions as EvidenceNextSourceAction[]).every((item) => item.label !== "新乡本地电商/商贸企业岗位薪资"),
  "fresh salary evidence should close the salary source gap",
);

console.log("Mini program evidence freshness gate verified.");
