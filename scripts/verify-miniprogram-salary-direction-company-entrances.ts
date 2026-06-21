import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type CompanyEntrance = {
  id: string;
  name: string;
  cnName: string;
  region: string;
  salary: string;
  officialEntrance: string;
  note: string;
};

type SalaryDirection = {
  id: string;
  title: string;
  salary: string;
  companyEntrances: CompanyEntrance[];
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
  copySalaryDirectionCompanyEntrance(
    this: RuntimePage,
    event: { currentTarget: { dataset: { directionId: string; companyId: string } } },
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
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
) => { salaryDirections: SalaryDirection[]; copyText: string };

const packet = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务");
const ecommerceDirection: SalaryDirection | undefined = packet.salaryDirections.find((direction) =>
  direction.title.includes("电商运营"),
);
assert.ok(ecommerceDirection);
assert.ok(Array.isArray(ecommerceDirection.companyEntrances));
assert.ok(ecommerceDirection.companyEntrances.length >= 4);

for (const expected of [
  ["jd", "JD", "京东", "https://zhaopin.jd.com/"],
  ["alibaba", "Alibaba", "阿里巴巴", "https://campus.alibaba.com/"],
  ["pdd", "PDD", "拼多多", "https://careers.pddglobalhr.com/campus/grad"],
  ["meituan", "Meituan", "美团", "https://hr.meituan.com/jobs"],
] as const) {
  const [id, name, cnName, officialEntrance] = expected;
  const entrance: CompanyEntrance | undefined = ecommerceDirection.companyEntrances.find((company) => company.id === id);
  assert.ok(entrance, `${name} should be present`);
  assert.equal(entrance.name, name);
  assert.equal(entrance.cnName, cnName);
  assert.equal(entrance.officialEntrance, officialEntrance);
  assert.ok(entrance.salary.includes("K/月"));
}

assert.ok(packet.copyText.includes("公司官网入口包"));
assert.ok(packet.copyText.includes("JD｜京东｜https://zhaopin.jd.com/"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("companyEntrances"));
assert.ok(pageScript.includes("copySalaryDirectionCompanyEntrance"));

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
      getStorageSync() {
        return undefined;
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
const activeDirection = activePacket.salaryDirections.find((direction) => direction.title.includes("电商运营"));
assert.ok(activeDirection);
capturedPage.copySalaryDirectionCompanyEntrance.call(page, {
  currentTarget: { dataset: { directionId: activeDirection.id, companyId: "jd" } },
});

assert.ok(clipboardText.includes("JD｜京东"));
assert.ok(clipboardText.includes("企业官网招聘入口"));
assert.ok(clipboardText.includes("https://zhaopin.jd.com/"));
assert.ok(clipboardText.includes("电商运营"));
assert.ok(clipboardText.includes("岗位薪资"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "salary-direction-company-entry-row",
  "salary-direction-company-entry",
  "companyEntrances",
  "copySalaryDirectionCompanyEntrance",
]) {
  assert.ok(markup.includes(token), `index markup should expose company entrance token ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".salary-direction-company-entry-row", ".salary-direction-company-entry"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program salary direction company entrances verified.");
