import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type SalaryDirection = {
  id: string;
  title: string;
  salary: string;
  companies: string[];
  companyText: string;
  query: string;
  url: string;
  evidenceSlot: string;
  action: string;
  updateRule: string;
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
  copySalaryDirection(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
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

const ecommercePacket = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务");
assert.ok(Array.isArray(ecommercePacket.salaryDirections));
assert.ok(ecommercePacket.salaryDirections.length >= 3);
assert.ok(ecommercePacket.copyText.includes("岗位薪资方向桥"));

const ecommerceDirection = ecommercePacket.salaryDirections.find((direction) => direction.title.includes("电商运营"));
assert.ok(ecommerceDirection);
assert.equal(ecommerceDirection.salary, "6-16K/月");
assert.ok(ecommerceDirection.companies.includes("JD"));
assert.ok(ecommerceDirection.companies.includes("Alibaba"));
assert.equal(ecommerceDirection.companyText, ecommerceDirection.companies.join(" / "));
assert.equal(ecommerceDirection.evidenceSlot, "岗位薪资");
assert.ok(ecommerceDirection.query.includes("郑州工商学院"));
assert.ok(ecommerceDirection.query.includes("电子商务"));
assert.ok(ecommerceDirection.query.includes("电商运营"));
assert.ok(ecommerceDirection.url.startsWith("https://cn.bing.com/search?q="));
assert.ok(ecommerceDirection.updateRule.includes("每天"));

const nursingPacket = buildOrdinarySchoolRescuePacket("河南医学高等专科学校", "护理");
const nursingDirection = nursingPacket.salaryDirections.find((direction) => direction.title.includes("护士"));
assert.ok(nursingDirection);
assert.equal(nursingDirection.salary, "5-13K/月");
assert.ok(nursingDirection.companies.some((company) => company.includes("医院")));
assert.ok(nursingDirection.query.includes("护理"));

const foodPacket = buildOrdinarySchoolRescuePacket("河南农业职业学院", "食品质量与安全");
const foodDirection = foodPacket.salaryDirections.find((direction) => direction.title.includes("食品检验"));
assert.ok(foodDirection);
assert.equal(foodDirection.salary, "5-12K/月");
assert.ok(foodDirection.companies.includes("Yili"));
assert.ok(foodDirection.query.includes("食品质量与安全"));
assert.ok(foodDirection.updateRule.includes("每天"));

const civilPacket = buildOrdinarySchoolRescuePacket("重庆建筑工程职业学院", "工程造价");
const civilDirection = civilPacket.salaryDirections.find((direction) => direction.title.includes("BIM"));
assert.ok(civilDirection);
assert.equal(civilDirection.salary, "6-15K/月");
assert.ok(civilDirection.companies.includes("CSCEC"));
assert.ok(civilDirection.query.includes("工程造价"));

const legalPacket = buildOrdinarySchoolRescuePacket("河南司法警官职业学院", "法律事务");
const legalDirection = legalPacket.salaryDirections.find((direction) => direction.title.includes("法务"));
assert.ok(legalDirection);
assert.equal(legalDirection.salary, "5-13K/月");
assert.ok(legalDirection.companies.includes("律所"));

const sportsPacket = buildOrdinarySchoolRescuePacket("武汉体育学院体育科技学院", "运动康复");
const sportsDirection = sportsPacket.salaryDirections.find((direction) => direction.title.includes("运动康复"));
assert.ok(sportsDirection);
assert.equal(sportsDirection.salary, "5-14K/月");
assert.ok(sportsDirection.companies.includes("健身连锁"));

const fallbackPacket = buildOrdinarySchoolRescuePacket("普通测试学院", "目标专业");
assert.ok(fallbackPacket.salaryDirections.some((direction) => direction.title.includes("岗位薪资核验")));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("salaryDirections"));
assert.ok(pageScript.includes("copySalaryDirection"));

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
const copiedDirection = activePacket.salaryDirections.find((direction) => direction.title.includes("电商运营"));
assert.ok(copiedDirection);
capturedPage.copySalaryDirection.call(page, {
  currentTarget: { dataset: { id: copiedDirection.id } },
});

assert.ok(clipboardText.includes("电商运营"));
assert.ok(clipboardText.includes("6-16K/月"));
assert.ok(clipboardText.includes("JD / Alibaba"));
assert.ok(clipboardText.includes("岗位市场参考"));
assert.ok(clipboardText.includes("https://cn.bing.com/search?q="));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "salary-direction-bridge",
  "activeRescuePacket.salaryDirections",
  "copySalaryDirection",
]) {
  assert.ok(markup.includes(token), `index markup should expose salary direction token ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".salary-direction-bridge", ".salary-direction-card", ".salary-direction-company-row"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program salary direction bridge verified.");
