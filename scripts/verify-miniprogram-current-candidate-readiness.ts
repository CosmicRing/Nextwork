import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type CandidateReadiness = {
  level: "blocked" | "screenable" | "ready";
  title: string;
  summary: string;
  missingLabels: string[];
  nextAction: string;
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

function saveEvidence(page: RuntimePage, capturedPage: IndexPageConfig, text: string) {
  capturedPage.onEvidenceDraftInput.call(page, { detail: { value: text } });
  capturedPage.saveEvidenceDraft.call(page);
}

const pageScript = read("miniprogram/pages/index/index.js");
const currentYear = new Date().getFullYear();
for (const token of [
  "buildCurrentCandidateReadiness",
  "currentCandidateReadiness",
  "核心缺口",
]) {
  assert.ok(pageScript.includes(token), `index page should expose current candidate readiness via ${token}`);
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

let readiness = page.data.currentCandidateReadiness as CandidateReadiness;
assert.equal(readiness.level, "blocked");
assert.equal(readiness.title, "暂不建议比较");
assert.ok(readiness.missingLabels.includes("学校主体"));
assert.ok(readiness.missingLabels.includes("专业资料"));
assert.ok(readiness.missingLabels.includes("岗位薪资"));
assert.ok(readiness.summary.includes("先补齐核心证据"));

saveEvidence(
  page,
  capturedPage,
  "来源：学校官网｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.ztbu.edu.cn｜页面：https://www.ztbu.edu.cn/",
);
saveEvidence(
  page,
  capturedPage,
  "来源：招生网｜电子商务专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zsb.ztbu.edu.cn/",
);
saveEvidence(
  page,
  capturedPage,
  `来源：京东招聘官网｜岗位：供应链运营｜城市：郑州｜薪资：8-12K/月｜学历要求：本科｜更新时间：${currentYear}-04-01｜页面：https://careers.jd.com/`,
);

readiness = page.data.currentCandidateReadiness as CandidateReadiness;
assert.equal(readiness.level, "screenable");
assert.equal(readiness.title, "可先初筛");
assert.deepEqual(Array.from(readiness.missingLabels), ["就业报告", "到校招聘"]);
assert.ok(readiness.summary.includes("已经有学校、专业和薪资证据"));

saveEvidence(
  page,
  capturedPage,
  "来源：学校官网信息公开栏目｜郑州工商学院2024届毕业生就业质量报告显示电子商务就业率94.2%。",
);
saveEvidence(
  page,
  capturedPage,
  `来源：郑州工商学院就业信息网｜宣讲会｜${currentYear}-03-18｜企业：京东｜岗位：供应链运营｜面向专业：电子商务｜页面：https://zzgsxy.goworkla.cn/`,
);

readiness = page.data.currentCandidateReadiness as CandidateReadiness;
assert.equal(readiness.level, "ready");
assert.equal(readiness.title, "证据较完整");
assert.equal(readiness.missingLabels.length, 0);
assert.ok(readiness.nextAction.includes("保存当前候选"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "candidate-readiness-card",
  "currentCandidateReadiness.title",
  "currentCandidateReadiness.missingLabels",
  "当前候选判断",
]) {
  assert.ok(markup.includes(token), `index markup should render current candidate readiness via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".candidate-readiness-card",
  ".candidate-readiness-card.blocked",
  ".candidate-readiness-card.screenable",
  ".candidate-readiness-card.ready",
]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program current candidate readiness verified.");
