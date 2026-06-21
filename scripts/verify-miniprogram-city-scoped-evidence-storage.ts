import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceInboxItem = {
  slotLabel: string;
  text: string;
  trustStatus: "verified" | "pending";
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
  "buildEvidenceInboxStorageKey",
  "targetCityName",
]) {
  assert.ok(pageScript.includes(token), `index page should scope evidence storage via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;
const currentYear = new Date().getFullYear();

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
capturedPage.onCityInput.call(page, { detail: { value: "新乡" } });

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value: `来源：京东招聘官网｜岗位：供应链运营｜城市：新乡｜薪资：8-12K/月｜学历要求：本科｜更新时间：${currentYear}-04-01｜页面：https://careers.jd.com/`,
  },
});
capturedPage.saveEvidenceDraft.call(page);

const xinxiangItems = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(xinxiangItems.length, 1);
assert.equal(xinxiangItems[0].slotLabel, "岗位薪资");
assert.equal(xinxiangItems[0].trustStatus, "verified");
assert.ok(xinxiangItems[0].text.includes("城市：新乡"));
assert.equal(page.data.evidenceProgressText, "1/5 已完成");

capturedPage.onCityInput.call(page, { detail: { value: "洛阳" } });

assert.equal(page.data.cityQuery, "洛阳");
assert.equal((page.data.activeRescuePacket as { targetCityName: string }).targetCityName, "洛阳");
assert.equal((page.data.evidenceInboxItems as EvidenceInboxItem[]).length, 0, "changing city should not reuse another city's evidence inbox");
assert.equal(page.data.evidenceProgressText, "0/5 已完成", "changing city should not reuse another city's progress");
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "city-scoped progress should reset for a different city",
);

const storageKeys = Array.from(storage.keys()).join("\n");
assert.ok(storageKeys.includes("新乡"), "storage keys should include the city scope");
assert.ok(!storageKeys.includes("洛阳"), "storage should not create a city scope until evidence is saved there");

console.log("Mini program city-scoped evidence storage verified.");
