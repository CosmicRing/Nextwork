import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceInboxItem = {
  slotLabel: string;
  taskTitle: string;
  trustStatus: "verified" | "pending";
  text: string;
};

type EvidenceProgressItem = {
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
  onCityInput(this: RuntimePage, event: { detail: { value: string } }): void;
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
assert.ok(pageScript.includes("buildLegacyEvidenceInboxStorageKey"), "index page should make legacy inbox handling explicit");

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;

storage.set("kankanSalary:evidenceInbox:新乡工程学院:电子商务", [
  {
    id: "legacy-xinxiang-salary",
    slotLabel: "岗位薪资",
    taskTitle: "补薪资",
    trustStatus: "verified",
    trustLabel: "可信",
    trustLevel: "企业官网优先",
    sourceHint: "来源线索可核验，可计入进度",
    title: "京东供应链运营",
    text: "来源：京东招聘官网；岗位：供应链运营；城市：新乡；薪资：8-12K/月；更新时间：2026-04-01；页面：https://careers.jd.com/",
  },
]);

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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "新乡工程学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });
capturedPage.onCityInput.call(page, { detail: { value: "洛阳" } });

assert.equal((page.data.evidenceInboxItems as EvidenceInboxItem[]).length, 0, "legacy city-specific salary evidence should not load for another city");
assert.equal(page.data.evidenceProgressText, "0/5 已完成", "legacy city-specific inbox should not restore progress for another city");
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "legacy city-specific inbox should not mark another city's tasks as done",
);

const sameCityPage: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onLoad.call(sameCityPage);
capturedPage.onSchoolInput.call(sameCityPage, { detail: { value: "新乡工程学院" } });
capturedPage.onMajorInput.call(sameCityPage, { detail: { value: "电子商务" } });
capturedPage.onCityInput.call(sameCityPage, { detail: { value: "新乡" } });

assert.equal((sameCityPage.data.evidenceInboxItems as EvidenceInboxItem[]).length, 1, "legacy city-specific salary evidence should migrate for the matching city");
assert.equal(sameCityPage.data.evidenceProgressText, "1/5 已完成", "matching legacy city-specific inbox should restore progress");

console.log("Mini program legacy inbox city isolation verified.");
