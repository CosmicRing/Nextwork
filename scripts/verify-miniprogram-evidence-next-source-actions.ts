import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceNextSourceAction = {
  label: string;
  source: string;
  taskTitle: string;
  saveFieldsText: string;
  copyText: string;
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
  copyEvidenceNextSourceAction(this: RuntimePage, event: { currentTarget: { dataset: { label: string } } }): void;
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
  "buildEvidenceNextSourceActions",
  "evidenceNextSourceActions",
  "copyEvidenceNextSourceAction",
]) {
  assert.ok(pageScript.includes(token), `index page should expose next-source actions via ${token}`);
}

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
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

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

const initialActions = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.equal(initialActions.length, 5);
assert.deepEqual(
  Array.from(initialActions.map((item) => item.label)),
  ["学校主体", "专业资料", "就业质量报告专业去向", "学校就业网到校企业", "郑州本地医院/医养机构岗位薪资"],
);
assert.equal(initialActions[0].taskTitle, "验学校");
assert.ok(initialActions[0].source.includes("学校官网"));
assert.equal(initialActions[0].saveFieldsText, "学校全称、主管部门、办学层次、官网域名");
assert.equal(initialActions[2].taskTitle, "抓报告");
assert.equal(initialActions[2].saveFieldsText, "报告年份、就业率、升学率、行业去向、统计口径");
assert.equal(initialActions[4].taskTitle, "补薪资");
assert.equal(initialActions[4].source, "本地企业官网 / 岗位原文");
assert.ok(initialActions[4].saveFieldsText.includes("薪资范围"));

capturedPage.copyEvidenceNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "学校主体" } },
});
assert.ok(clipboardText.includes("郑州工商学院｜护理学 下一条证据"));
assert.ok(clipboardText.includes("证据槽：学校主体"));
assert.ok(clipboardText.includes("推荐来源：学校官网"));
assert.ok(clipboardText.includes("保存字段：学校全称、主管部门、办学层次、官网域名"));

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "护理学就业率较高，毕业生主要去医院和健康服务机构，信息来自同学转述。" },
});
capturedPage.saveEvidenceDraft.call(page);
const actionsAfterWeakEvidence = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.ok(
  actionsAfterWeakEvidence.some((item) => item.label === "就业质量报告专业去向"),
  "weak report evidence should not close the report source gap",
);

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "来源：学校官网信息公开栏目，郑州工商学院2024届毕业生就业质量报告显示护理学就业率94.2%。" },
});
capturedPage.saveEvidenceDraft.call(page);
const actionsAfterTrustedReport = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.equal(actionsAfterTrustedReport.length, 4);
assert.ok(
  actionsAfterTrustedReport.every((item) => item.label !== "就业质量报告专业去向"),
  "credible report evidence should remove the report source gap",
);
assert.ok(actionsAfterTrustedReport.some((item) => item.label === "学校主体"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "evidence-next-source-panel",
  "evidenceNextSourceActions",
  "copyEvidenceNextSourceAction",
  "下一步去哪查",
]) {
  assert.ok(markup.includes(token), `index markup should expose next-source actions via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".evidence-next-source-panel", ".evidence-next-source-card"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program evidence next-source actions verified.");
