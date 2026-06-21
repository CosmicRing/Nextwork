import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

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
};

type EvidenceProgressItem = {
  done: boolean;
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
  "buildEvidenceDraftTemplate",
  "draftTemplate",
  "prefillEvidenceDraftFromNextSourceAction",
]) {
  assert.ok(pageScript.includes(token), `index page should support evidence draft templates via ${token}`);
}

const sampleData = loadSampleData();
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

assert.equal(page.data.evidenceDraftText, "");
assert.equal((page.data.evidenceInboxItems as unknown[]).length, 0);
assert.ok((page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done));

capturedPage.prefillEvidenceDraftFromNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "学校就业网到校企业" } },
});

const template = String(page.data.evidenceDraftText);
assert.ok(template.includes("证据槽：到校招聘"));
assert.ok(template.includes("学校：郑州工商学院"));
assert.ok(template.includes("专业：护理学"));
assert.ok(template.includes("证据动作：学校就业网到校企业"));
assert.ok(template.includes("推荐来源：学校就业网 / 就业信息网"));
assert.ok(template.includes("https://zzgsxy.goworkla.cn/"));
assert.ok(template.includes("保存字段：企业名称、招聘形式、日期、岗位方向、学校页面链接"));
assert.ok(template.includes("摘录："));
assert.ok(template.includes("复制公开页面里的企业名称、招聘形式、日期、岗位方向、学校页面链接"));
assert.equal((page.data.evidenceInboxItems as unknown[]).length, 0, "prefilling a template should not save evidence");
assert.ok(
  (page.data.evidenceProgress as EvidenceProgressItem[]).every((task) => !task.done),
  "prefilling a template should not mark any task as done",
);

capturedPage.prefillEvidenceDraftFromNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "郑州本地医院/医养机构岗位薪资" } },
});
const salaryTemplate = String(page.data.evidenceDraftText);
assert.ok(salaryTemplate.includes("证据槽：岗位薪资"));
assert.ok(salaryTemplate.includes("保存字段：公司名称、城市、薪资范围、学历要求、发布日期"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "prefillEvidenceDraftFromNextSourceAction",
  "填模板",
  "evidence-next-source-actions",
]) {
  assert.ok(markup.includes(token), `index markup should expose template prefill via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
assert.ok(styles.includes(".evidence-next-source-actions"), "index styles should include source action button row");

console.log("Mini program evidence draft templates verified.");
