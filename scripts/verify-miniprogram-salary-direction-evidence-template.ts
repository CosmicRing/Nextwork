import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type SalaryDirection = {
  id: string;
  title: string;
  salary: string;
  companyText: string;
  url: string;
  evidenceSlot: string;
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
  prefillEvidenceDraftFromSalaryDirection(
    this: RuntimePage,
    event: { currentTarget: { dataset: { id: string } } },
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

const sampleData = loadSampleData();
const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("prefillEvidenceDraftFromSalaryDirection"));
assert.ok(pageScript.includes("岗位薪资方向证据模板"));

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
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });
capturedPage.onMajorInput.call(page, { detail: { value: "电子商务" } });

const activePacket = page.data.activeRescuePacket as { salaryDirections: SalaryDirection[] };
const ecommerceDirection = activePacket.salaryDirections.find((direction) => direction.title.includes("电商运营"));
assert.ok(ecommerceDirection);
capturedPage.prefillEvidenceDraftFromSalaryDirection.call(page, {
  currentTarget: { dataset: { id: ecommerceDirection.id } },
});

const draft = page.data.evidenceDraftText as string;
assert.ok(draft.includes("岗位薪资方向证据模板"));
assert.ok(draft.includes("证据槽：岗位薪资"));
assert.ok(draft.includes("岗位方向：电商运营"));
assert.ok(draft.includes("薪资参考：6-16K/月"));
assert.ok(draft.includes("企业/机构：JD / Alibaba"));
assert.ok(draft.includes("待粘贴：岗位原文、城市、薪资范围、学历要求、发布日期"));
assert.ok(draft.includes(ecommerceDirection.url));

const markup = read("miniprogram/pages/index/index.wxml");
assert.ok(markup.includes("prefillEvidenceDraftFromSalaryDirection"));
assert.ok(markup.includes("填模板"));

console.log("Mini program salary direction evidence template verified.");
