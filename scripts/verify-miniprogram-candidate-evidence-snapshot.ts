import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type SavedCandidate = {
  schoolName: string;
  majorName: string;
  cityName: string;
  salaryFocus: string;
  salaryRange: string;
  coveredSlots: string[];
  missingSlotLabels: string[];
  nextSourceLabel: string;
  nextSourceSource: string;
  nextSourceQuery: string;
  nextSourceUrl: string;
  nextSourceSaveFieldsText: string;
  nextSourceAction: string;
  sourceCoverageText: string;
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
  saveCurrentCandidate(this: RuntimePage): void;
  copyCandidateReport(this: RuntimePage): void;
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
  "buildCurrentCandidate",
  "buildCandidateReportText",
  "candidateVerdict",
]) {
  assert.ok(pageScript.includes(token), `index page should keep candidate comparison plumbing via ${token}`);
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

function saveEvidence(text: string) {
  capturedPage?.onEvidenceDraftInput.call(page, { detail: { value: text } });
  capturedPage?.saveEvidenceDraft.call(page);
}

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "新乡工程学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });
capturedPage.onCityInput.call(page, { detail: { value: "新乡" } });

saveEvidence("来源：学校官网｜学校全称：新乡工程学院｜主管部门：河南省教育厅｜办学层次：民办本科｜官网域名：www.xxgc.edu.cn｜页面：https://www.xxgc.edu.cn/");
saveEvidence("来源：招生网｜电子商务专业｜学院：商学院｜学制：四年｜核心课程：电商运营、供应链管理｜页面：https://zs.xxgc.edu.cn/");
saveEvidence("来源：京东招聘官网｜岗位：供应链运营｜城市：新乡｜薪资：8-12K/月｜学历要求：本科｜更新时间：2025-04-01｜页面：https://careers.jd.com/");

capturedPage.saveCurrentCandidate.call(page);

const candidate = (page.data.savedCandidates as SavedCandidate[])[0];
assert.equal(candidate.schoolName, "新乡工程学院");
assert.equal(candidate.majorName, "电子商务");
assert.equal(candidate.cityName, "新乡");
assert.equal(candidate.salaryFocus, "电商运营 / 供应链运营");
assert.equal(candidate.salaryRange, "6-16K/月");
assert.equal(candidate.coveredSlots.join("|"), "学校主体|专业资料|岗位薪资");
assert.equal(candidate.missingSlotLabels.join("|"), "就业报告|到校招聘");
assert.equal(candidate.nextSourceLabel, "就业质量报告专业去向");
assert.ok(candidate.nextSourceSource.includes("已确认官网域名 site:xxgc.edu.cn"));
assert.ok(candidate.nextSourceQuery.includes("site:xxgc.edu.cn"));
assert.ok(candidate.nextSourceQuery.includes("就业质量报告"));
assert.ok(decodeURIComponent(candidate.nextSourceUrl).includes("site:xxgc.edu.cn"));
assert.ok(candidate.nextSourceSaveFieldsText.includes("毕业去向落实率"));
assert.ok(candidate.nextSourceAction.includes("学校公开报告"));
assert.ok(candidate.sourceCoverageText.includes("已覆盖：学校主体、专业资料、岗位薪资"));
assert.ok(candidate.sourceCoverageText.includes("待补：就业报告、到校招聘"));

capturedPage.copyCandidateReport.call(page);
assert.ok(clipboardText.includes("城市：新乡"));
assert.ok(clipboardText.includes("薪资方向：电商运营 / 供应链运营｜6-16K/月"));
assert.ok(clipboardText.includes("证据覆盖：已覆盖：学校主体、专业资料、岗位薪资｜待补：就业报告、到校招聘"));
assert.ok(clipboardText.includes("下一条来源：就业质量报告专业去向"));
assert.ok(clipboardText.includes("下一条来源说明：已确认官网域名 site:xxgc.edu.cn"));
assert.ok(clipboardText.includes("下一条检索式：site:xxgc.edu.cn"));
assert.ok(clipboardText.includes("下一条入口："));
assert.ok(clipboardText.includes("site%3Axxgc.edu.cn"));
assert.ok(clipboardText.includes("下一条保存字段："));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "candidate-evidence-snapshot",
  "item.cityName",
  "item.salaryFocus",
  "item.salaryRange",
  "item.sourceCoverageText",
  "item.nextSourceLabel",
  "item.nextSourceSource",
  "item.nextSourceQuery",
]) {
  assert.ok(markup.includes(token), `saved candidate card should render evidence snapshot via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".candidate-evidence-snapshot", ".candidate-source-coverage", ".candidate-next-source", ".candidate-next-source-detail"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program candidate evidence snapshot verified.");
