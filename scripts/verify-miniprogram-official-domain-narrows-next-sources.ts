import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceNextSourceAction = {
  label: string;
  source: string;
  taskTitle: string;
  url: string;
  copyText: string;
  draftTemplate: string;
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
  copyRescuePacket(this: RuntimePage): void;
  prefillEvidenceDraftFromTask(this: RuntimePage, event: { currentTarget: { dataset: { taskTitle: string } } }): void;
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
for (const token of ["buildEvidenceNextSourceActions", "evidenceNextSourceActions", "extractEvidenceDomainTermsFromText"]) {
  assert.ok(pageScript.includes(token), `index page should expose official-domain source narrowing via ${token}`);
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

const initialActions = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.ok(initialActions.some((item) => item.label === "专业资料"), "unknown school should start with broad public-source actions");
assert.ok(
  initialActions.every((item) => !decodeURIComponent(item.url).includes("site:xxgc.edu.cn")),
  "site-scoped actions should only appear after the official domain is verified",
);

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value:
      "来源：学校官网｜学校全称：新乡工程学院｜主管部门：河南省教育厅｜办学层次：本科｜官网域名：www.xxgc.edu.cn｜页面：https://www.xxgc.edu.cn/",
  },
});
capturedPage.saveEvidenceDraft.call(page);

const narrowedActions = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.ok(narrowedActions.every((item) => item.label !== "学校主体"), "verified school identity should close the school identity gap");

const majorAction = narrowedActions.find((item) => item.label === "专业资料");
assert.ok(majorAction, "professional material should remain as the next source gap");
assert.ok(majorAction.source.includes("已确认官网域名"));
assert.ok(decodeURIComponent(majorAction.url).includes("site:xxgc.edu.cn"));
assert.ok(majorAction.copyText.includes("site:xxgc.edu.cn"));
assert.ok(majorAction.draftTemplate.includes("site:xxgc.edu.cn"));

const reportAction = narrowedActions.find((item) => item.taskTitle === "抓报告");
assert.ok(reportAction, "report source gap should remain after school identity is verified");
assert.ok(reportAction.source.includes("已确认官网域名"));
assert.ok(decodeURIComponent(reportAction.url).includes("site:xxgc.edu.cn"));
assert.ok(reportAction.copyText.includes("就业质量报告"));
assert.ok(reportAction.copyText.includes("site:xxgc.edu.cn"));

const campusAction = narrowedActions.find((item) => item.taskTitle === "抓企业");
assert.ok(campusAction, "campus recruiting source gap should remain after school identity is verified");
assert.ok(campusAction.source.includes("已确认官网域名"));
assert.ok(decodeURIComponent(campusAction.url).includes("site:xxgc.edu.cn"));
assert.ok(campusAction.copyText.includes("宣讲会"));

capturedPage.prefillEvidenceDraftFromTask.call(page, {
  currentTarget: { dataset: { taskTitle: "抓报告" } },
});
assert.ok(String(page.data.evidenceDraftText).includes("site:xxgc.edu.cn"));
assert.ok(String(page.data.evidenceDraftText).includes("已确认官网域名"));
assert.ok(String(page.data.evidenceDraftText).includes("就业质量报告"));

capturedPage.prefillEvidenceDraftFromTask.call(page, {
  currentTarget: { dataset: { taskTitle: "抓企业" } },
});
assert.ok(String(page.data.evidenceDraftText).includes("site:xxgc.edu.cn"));
assert.ok(String(page.data.evidenceDraftText).includes("宣讲会"));

capturedPage.copyRescuePacket.call(page);
assert.ok(clipboardText.includes("已确认官网域名"));
assert.ok(clipboardText.includes("site:xxgc.edu.cn"));
assert.ok(clipboardText.includes("专业资料"));
assert.ok(clipboardText.includes("就业质量报告专业去向"));
assert.ok(clipboardText.includes("学校就业网到校企业"));

console.log("Mini program official-domain next-source narrowing verified.");
