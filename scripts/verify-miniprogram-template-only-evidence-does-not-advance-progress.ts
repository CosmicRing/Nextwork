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
  prefillEvidenceDraftFromNextSourceAction(
    this: RuntimePage,
    event: { currentTarget: { dataset: { label: string } } },
  ): void;
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

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });

capturedPage.prefillEvidenceDraftFromNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "学校就业网到校企业" } },
});

const templateText = String(page.data.evidenceDraftText);
assert.ok(templateText.includes("证据槽：到校招聘"));
assert.ok(templateText.includes("推荐来源：学校就业网 / 就业信息网"));
assert.ok(templateText.includes("摘录："));

capturedPage.saveEvidenceDraft.call(page);

const templateOnlyInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(templateOnlyInbox.length, 1);
assert.equal(templateOnlyInbox[0].slotLabel, "到校招聘");
assert.equal(templateOnlyInbox[0].taskTitle, "抓企业");
assert.equal(templateOnlyInbox[0].trustStatus, "pending");
assert.equal(templateOnlyInbox[0].trustLabel, "待核验");
assert.ok(
  templateOnlyInbox[0].sourceHint.includes("模板未填事实"),
  "template-only drafts should tell users to add real extracted facts",
);
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "saving a blank capture template must not advance any evidence task",
);
assert.ok(
  (page.data.evidenceNextSourceActions as EvidenceNextSourceAction[]).some((item) => item.label === "学校就业网到校企业"),
  "template-only evidence should keep the campus recruiting source gap open",
);

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value:
      "来源：郑州工商学院就业信息网｜宣讲会｜2025-03-18｜企业：京东｜岗位：供应链运营｜面向专业：电子商务｜页面：https://zzgsxy.goworkla.cn/module/getcareers",
  },
});
capturedPage.saveEvidenceDraft.call(page);

const factualInbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(factualInbox[0].slotLabel, "到校招聘");
assert.equal(factualInbox[0].trustStatus, "verified");
const campusRecruitingTask = (page.data.evidenceProgress as EvidenceProgressItem[]).find((task) => task.title === "抓企业");
assert.ok(campusRecruitingTask?.done, "fact-bearing official campus recruiting evidence should advance 抓企业");
assert.ok(
  (page.data.evidenceNextSourceActions as EvidenceNextSourceAction[]).every((item) => item.label !== "学校就业网到校企业"),
  "verified campus recruiting evidence should close the matching source gap",
);

console.log("Mini program template-only evidence trust gate verified.");
