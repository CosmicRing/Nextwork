import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceInboxItem = {
  id: string;
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
  onEvidenceDraftInput(this: RuntimePage, event: { detail: { value: string } }): void;
  saveEvidenceDraft(this: RuntimePage): void;
  toggleEvidenceInboxItemDetail(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
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
assert.ok(pageScript.includes("expandedEvidenceInboxItemId"));
assert.ok(pageScript.includes("toggleEvidenceInboxItemDetail"));

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
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });
const evidenceText = "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/";
capturedPage.onEvidenceDraftInput.call(page, { detail: { value: evidenceText } });
capturedPage.saveEvidenceDraft.call(page);

const item = (page.data.evidenceInboxItems as EvidenceInboxItem[])[0];
assert.ok(item.id);
assert.equal(page.data.expandedEvidenceInboxItemId, "");
capturedPage.toggleEvidenceInboxItemDetail.call(page, { currentTarget: { dataset: { id: item.id } } });
assert.equal(page.data.expandedEvidenceInboxItemId, item.id);
capturedPage.toggleEvidenceInboxItemDetail.call(page, { currentTarget: { dataset: { id: item.id } } });
assert.equal(page.data.expandedEvidenceInboxItemId, "");

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "toggleEvidenceInboxItemDetail",
  "expandedEvidenceInboxItemId",
  "evidence-inbox-detail",
  "item.text",
  "详情",
]) {
  assert.ok(markup.includes(token), `index markup should expose evidence detail expansion via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
assert.ok(styles.includes(".evidence-inbox-detail"));

console.log("Mini program evidence inbox detail expansion verified.");
