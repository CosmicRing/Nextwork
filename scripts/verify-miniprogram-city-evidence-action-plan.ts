import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type CityEvidenceAction = {
  id: string;
  label: string;
  source: string;
  evidenceSlot: string;
  query: string;
  url: string;
  saveFields: string[];
};

type RescuePacket = {
  targetCityName: string;
  cityEvidenceActions: CityEvidenceAction[];
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
  prefillEvidenceDraftFromCityEvidenceAction(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
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

const sampleData = loadSampleData();
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
  cityHint?: string,
) => RescuePacket;

const packet = buildOrdinarySchoolRescuePacket("新乡工程学院", "电子商务", "新乡");
assert.equal(packet.targetCityName, "新乡");
assert.ok(Array.isArray(packet.cityEvidenceActions));
assert.ok(packet.cityEvidenceActions.length >= 4);
assert.equal(
  packet.cityEvidenceActions.map((item) => item.id).join("|"),
  "city-salary-posts|school-career-events|official-employment-report|national-student-jobs",
);

const salaryAction = packet.cityEvidenceActions.find((item) => item.id === "city-salary-posts");
assert.ok(salaryAction);
assert.equal(salaryAction.evidenceSlot, "岗位薪资");
assert.equal(salaryAction.label, "新乡本地电商/商贸企业岗位薪资");
assert.ok(salaryAction.query.includes("新乡"));
assert.ok(salaryAction.query.includes("电子商务"));
assert.ok(salaryAction.saveFields.includes("薪资范围"));
assert.ok(packet.copyText.includes("城市证据动作清单"));
assert.ok(packet.copyText.includes("新乡本地电商/商贸企业岗位薪资"));

const reportAction = packet.cityEvidenceActions.find((item) => item.id === "official-employment-report");
assert.ok(reportAction);
assert.equal(reportAction.evidenceSlot, "就业报告");
assert.ok(reportAction.query.includes("就业率"));
assert.ok(reportAction.query.includes("毕业去向"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("cityEvidenceActions"));
assert.ok(pageScript.includes("prefillEvidenceDraftFromCityEvidenceAction"));
assert.ok(pageScript.includes("copyCityEvidenceAction"));

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
      getStorageSync() {
        return undefined;
      },
      setStorageSync() {},
      setClipboardData() {},
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

const activePacket = page.data.activeRescuePacket as RescuePacket;
const activeSalaryAction = activePacket.cityEvidenceActions.find((item) => item.id === "city-salary-posts");
assert.ok(activeSalaryAction);
assert.equal(activeSalaryAction.label, "新乡本地电商/商贸企业岗位薪资");

capturedPage.prefillEvidenceDraftFromCityEvidenceAction.call(page, {
  currentTarget: { dataset: { id: "city-salary-posts" } },
});
const draft = page.data.evidenceDraftText as string;
assert.ok(draft.includes("新乡工程学院｜电子商务"));
assert.ok(draft.includes("证据动作：新乡本地电商/商贸企业岗位薪资"));
assert.ok(draft.includes("证据槽：岗位薪资"));
assert.ok(draft.includes("保存字段：公司名称、城市、薪资范围、学历要求、发布日期"));

const markup = read("miniprogram/pages/index/index.wxml");
assert.ok(markup.includes("city-evidence-action-panel"));
assert.ok(markup.includes("bindtap=\"prefillEvidenceDraftFromCityEvidenceAction\""));
assert.ok(markup.includes("bindtap=\"copyCityEvidenceAction\""));

console.log("Mini program city evidence action plan verified.");
