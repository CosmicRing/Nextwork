import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceNextSourceAction = {
  label: string;
  source: string;
  taskTitle: string;
  saveFieldsText: string;
  draftTemplate: string;
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
  onCityInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onEvidenceDraftInput(this: RuntimePage, event: { detail: { value: string } }): void;
  saveEvidenceDraft(this: RuntimePage): void;
  copyEvidenceNextSourceAction(this: RuntimePage, event: { currentTarget: { dataset: { label: string } } }): void;
  prefillEvidenceDraftFromNextSourceAction(this: RuntimePage, event: { currentTarget: { dataset: { label: string } } }): void;
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
assert.ok(pageScript.includes("buildEvidenceNextSourceActions"));
assert.ok(pageScript.includes("cityEvidenceActions"));

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
assert.equal(initialActions.length, 5);
assert.equal(
  initialActions.map((item) => item.label).join("|"),
  "学校主体|专业资料|就业质量报告专业去向|学校就业网到校企业|新乡本地电商/商贸企业岗位薪资",
);

const salaryAction = initialActions.find((item) => item.label === "新乡本地电商/商贸企业岗位薪资");
assert.ok(salaryAction);
assert.equal(salaryAction.taskTitle, "补薪资");
assert.equal(salaryAction.source, "本地企业官网 / 岗位原文");
assert.equal(salaryAction.saveFieldsText, "公司名称、城市、薪资范围、学历要求、发布日期");
assert.ok(salaryAction.copyText.includes("检索式：新乡 电子商务 电商运营 / 供应链运营 招聘 薪资 应届 官网"));

capturedPage.prefillEvidenceDraftFromNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "新乡本地电商/商贸企业岗位薪资" } },
});
assert.ok((page.data.evidenceDraftText as string).includes("证据动作：新乡本地电商/商贸企业岗位薪资"));
assert.ok((page.data.evidenceDraftText as string).includes("保存字段：公司名称、城市、薪资范围、学历要求、发布日期"));

capturedPage.copyEvidenceNextSourceAction.call(page, {
  currentTarget: { dataset: { label: "就业质量报告专业去向" } },
});
assert.ok(clipboardText.includes("新乡工程学院｜电子商务 下一条证据"));
assert.ok(clipboardText.includes("证据槽：就业报告"));
assert.ok(clipboardText.includes("保存字段：报告年份、就业率、升学率、行业去向、统计口径"));

capturedPage.onEvidenceDraftInput.call(page, {
  detail: { value: "来源：学校官网信息公开栏目，新乡工程学院2024届毕业生就业质量报告显示电子商务专业就业率92.6%，毕业去向包含批发零售和电商运营。" },
});
capturedPage.saveEvidenceDraft.call(page);

const actionsAfterReport = page.data.evidenceNextSourceActions as EvidenceNextSourceAction[];
assert.equal(
  actionsAfterReport.map((item) => item.label).join("|"),
  "学校主体|专业资料|学校就业网到校企业|新乡本地电商/商贸企业岗位薪资",
);

console.log("Mini program next-source city action priority verified.");
