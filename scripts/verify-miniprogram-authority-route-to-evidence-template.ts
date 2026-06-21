import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onMajorInput(this: RuntimePage, event: { detail: { value: string } }): void;
  prefillEvidenceDraftFromAuthorityRoute(
    this: RuntimePage,
    event: { currentTarget: { dataset: { tier: string } } },
  ): void;
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
assert.ok(pageScript.includes("prefillEvidenceDraftFromAuthorityRoute"));
assert.ok(pageScript.includes("authorityTierToEvidenceLabel"));

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

capturedPage.onSchoolInput.call(page, { detail: { value: "河南开封科技传媒学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理学" } });

capturedPage.prefillEvidenceDraftFromAuthorityRoute.call(page, {
  currentTarget: { dataset: { tier: "专业开设" } },
});
let template = String(page.data.evidenceDraftText);
assert.ok(template.includes("证据槽：专业资料"));
assert.ok(template.includes("推荐来源：招生网 / 教务处 / 学院页"));
assert.ok(template.includes("入口："));
assert.ok(template.includes("护理学"));
assert.ok(template.includes("保存字段：专业名称、所属学院、核心课程、实践基地"));

capturedPage.prefillEvidenceDraftFromAuthorityRoute.call(page, {
  currentTarget: { dataset: { tier: "薪资交叉" } },
});
template = String(page.data.evidenceDraftText);
assert.ok(template.includes("证据槽：岗位薪资"));
assert.ok(template.includes("推荐来源：企业官网招聘 / 公开岗位"));
assert.ok(template.includes("保存字段：岗位名、城市、薪资范围、学历要求"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "prefillEvidenceDraftFromAuthorityRoute",
  "填模板",
  "data-tier",
]) {
  assert.ok(markup.includes(token), `authority route UI should expose template prefill via ${token}`);
}

console.log("Mini program authority route to evidence template verified.");
