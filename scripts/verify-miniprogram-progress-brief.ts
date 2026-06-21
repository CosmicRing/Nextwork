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
  onEvidenceDraftInput(this: RuntimePage, event: { detail: { value: string } }): void;
  saveEvidenceDraft(this: RuntimePage): void;
  copyProgressBrief(this: RuntimePage): void;
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
  "buildProgressBriefText",
  "progressBriefText",
  "progressBriefNextAction",
  "copyProgressBrief",
]) {
  assert.ok(pageScript.includes(token), `index page should support progress brief via ${token}`);
}

const sampleData = loadSampleData();
let capturedPage: IndexPageConfig | undefined;
let clipboardText = "";

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
        return [];
      },
      setStorageSync() {},
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
const runtimePage: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

function saveEvidence(text: string) {
  capturedPage?.onEvidenceDraftInput.call(runtimePage, { detail: { value: text } });
  capturedPage?.saveEvidenceDraft.call(runtimePage);
}

capturedPage.onLoad.call(runtimePage);
capturedPage.onSchoolInput.call(runtimePage, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(runtimePage, { detail: { value: "电子商务" } });

saveEvidence(
  "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
);
saveEvidence(
  "来源：招生网｜电子商务专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zsb.ztbu.edu.cn/",
);

assert.ok(String(runtimePage.data.progressBriefText).includes("郑州工商学院"));
assert.ok(String(runtimePage.data.progressBriefText).includes("电子商务"));
assert.ok(String(runtimePage.data.progressBriefText).includes("已完成：验学校、验专业"));
assert.ok(String(runtimePage.data.progressBriefText).includes("待补齐：抓报告、抓企业、补薪资"));
assert.ok(String(runtimePage.data.progressBriefNextAction).includes("抓报告"));

capturedPage.copyProgressBrief.call(runtimePage);
assert.ok(clipboardText.includes("郑州工商学院"));
assert.ok(clipboardText.includes("电子商务"));
assert.ok(clipboardText.includes("已完成：验学校、验专业"));
assert.ok(clipboardText.includes("待补齐：抓报告、抓企业、补薪资"));
assert.ok(clipboardText.includes("下一步："));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "progress-brief-card",
  "progressBriefNextAction",
  "copyProgressBrief",
  "复制进度简报",
]) {
  assert.ok(markup.includes(token), `index markup should expose progress brief via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".progress-brief-card", ".progress-brief-card button"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program progress brief verified.");
