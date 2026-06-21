import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceProgressItem = {
  title: string;
  done: boolean;
};

type EvidenceInboxItem = {
  slotLabel: string;
  trustStatus: "verified" | "pending";
};

type CandidateReadiness = {
  level: "blocked" | "screenable" | "ready";
  missingLabels: string[];
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
  parseEvidenceDraftBatch(this: RuntimePage): void;
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
  "splitEvidenceDraftBatch",
  "parseEvidenceDraftBatch",
  "批量解析",
]) {
  assert.ok(pageScript.includes(token), `index page should support batch evidence parsing via ${token}`);
}

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

capturedPage.onEvidenceDraftInput.call(page, {
  detail: {
    value: [
      "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
      "",
      "来源：招生网｜电子商务专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zsb.ztbu.edu.cn/",
      "",
      "来源：京东招聘官网｜岗位：供应链运营｜城市：郑州｜薪资：8-12K/月｜学历要求：本科｜更新时间：2025-04-01｜页面：https://careers.jd.com/",
    ].join("\n"),
  },
});

capturedPage.parseEvidenceDraftBatch.call(page);

const inbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(inbox.length, 3);
assert.deepEqual(
  Array.from(inbox.map((item) => item.slotLabel)).sort(),
  ["专业资料", "学校主体", "岗位薪资"].sort(),
);
assert.ok(inbox.every((item) => item.trustStatus === "verified"));
assert.equal(page.data.evidenceDraftText, "");

const progress = page.data.evidenceProgress as EvidenceProgressItem[];
for (const taskTitle of ["验学校", "验专业", "补薪资"]) {
  assert.ok(progress.find((item) => item.title === taskTitle)?.done, `${taskTitle} should be completed from batch parse`);
}
assert.equal((page.data.currentCandidateReadiness as CandidateReadiness).level, "screenable");
assert.deepEqual(
  Array.from((page.data.currentCandidateReadiness as CandidateReadiness).missingLabels),
  ["就业报告", "到校招聘"],
);

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "parseEvidenceDraftBatch",
  "批量解析证据",
]) {
  assert.ok(markup.includes(token), `index markup should expose batch parser via ${token}`);
}

console.log("Mini program evidence batch parser verified.");
