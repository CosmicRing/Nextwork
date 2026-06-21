import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type Company = {
  id: string;
  name: string;
  region: string;
  industryGroup?: string;
};

type CompanySection = {
  title: string;
  count: number;
  companies: Company[];
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type CompaniesPageConfig = {
  data: Record<string, unknown>;
  setFilter(this: RuntimePage, event: { currentTarget: { dataset: { filter: string } } }): void;
  setIndustryFilter(this: RuntimePage, event: { currentTarget: { dataset: { industry: string } } }): void;
  viewDetail(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
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

const pageScript = read("miniprogram/pages/companies/companies.js");
for (const token of [
  "industryFilters",
  "buildCompanySections",
  "companySections",
  "setIndustryFilter",
]) {
  assert.ok(pageScript.includes(token), `companies page should support hierarchical directory via ${token}`);
}

const sampleData = loadSampleData();
let capturedPage: CompaniesPageConfig | undefined;
let navigatedUrl = "";

vm.runInNewContext(pageScript, {
  require(specifier: string) {
    if (specifier === "../../utils/sample-data") return sampleData;
    throw new Error(`unexpected require: ${specifier}`);
  },
  Page(config: CompaniesPageConfig) {
    capturedPage = config;
  },
  wx: {
    navigateTo(options: { url: string }) {
      navigatedUrl = options.url;
    },
  },
}, { filename: "miniprogram/pages/companies/companies.js" });

assert.ok(capturedPage, "companies page should register through Page()");

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

assert.deepEqual(Array.from(page.data.industryFilters as string[]), [
  "全部行业",
  "互联网 / AI",
  "硬件 / 制造",
  "零售 / 供应链",
  "金融 / 咨询",
  "酒店 / 服务",
]);

const initialSections = page.data.companySections as CompanySection[];
assert.ok(initialSections.length >= 5, "company directory should be grouped by industry instead of one flat list");
assert.ok(initialSections.every((section) => section.count === section.companies.length));
assert.ok(
  initialSections.find((section) => section.title === "互联网 / AI")?.companies.some((company) => company.id === "bytedance"),
  "internet section should include ByteDance",
);
assert.ok(
  initialSections.find((section) => section.title === "金融 / 咨询")?.companies.some((company) => company.id === "jpmorgan"),
  "finance section should include overseas finance employers",
);

capturedPage.setFilter.call(page, { currentTarget: { dataset: { filter: "海外" } } });
assert.ok((page.data.visibleCompanies as Company[]).every((company) => company.region === "海外"));
assert.ok(
  (page.data.companySections as CompanySection[]).some((section) => section.title === "金融 / 咨询"),
  "overseas filter should keep industry grouping",
);

capturedPage.setIndustryFilter.call(page, { currentTarget: { dataset: { industry: "金融 / 咨询" } } });
assert.deepEqual(
  Array.from((page.data.visibleCompanies as Company[]).map((company) => company.id)),
  ["jpmorgan", "deloitte", "goldman", "pwc"],
);
assert.equal((page.data.companySections as CompanySection[]).length, 1);
assert.equal((page.data.companySections as CompanySection[])[0].title, "金融 / 咨询");

capturedPage.viewDetail.call(page, { currentTarget: { dataset: { id: "deloitte" } } });
assert.equal(navigatedUrl, "/pages/company-detail/company-detail?id=deloitte");

const markup = read("miniprogram/pages/companies/companies.wxml");
for (const token of [
  "industry-filter-row",
  "industryFilters",
  "setIndustryFilter",
  "companySections",
  "company-section",
]) {
  assert.ok(markup.includes(token), `companies markup should expose hierarchy via ${token}`);
}

const styles = read("miniprogram/pages/companies/companies.wxss");
for (const token of [".industry-filter-row", ".industry-filter-button", ".company-section"]) {
  assert.ok(styles.includes(token), `companies styles should include ${token}`);
}

console.log("Mini program company directory hierarchy verified.");
