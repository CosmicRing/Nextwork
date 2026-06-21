import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type SchoolTypeStrategy = {
  id: string;
  label: string;
  confidenceLabel: string;
  firstMove: string;
  reason: string;
  searchFocus: string[];
  warnings: string[];
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

assert.equal(typeof sampleData.buildOrdinarySchoolTypeStrategy, "function");
const buildOrdinarySchoolTypeStrategy = sampleData.buildOrdinarySchoolTypeStrategy as (
  schoolName: string,
) => SchoolTypeStrategy;
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
) => { typeStrategy: SchoolTypeStrategy };

const business = buildOrdinarySchoolTypeStrategy("郑州工商学院");
assert.equal(business.id, "finance-business");
assert.equal(business.label, "财经 / 商贸类院校");
assert.ok(business.firstMove.includes("专业目录"));
assert.ok(business.searchFocus.includes("电商运营"));
assert.ok(business.warnings.some((warning) => warning.includes("实训平台")));

const medical = buildOrdinarySchoolTypeStrategy("河南医学高等专科学校");
assert.equal(medical.id, "medical-health");
assert.ok(medical.firstMove.includes("实习医院"));
assert.ok(medical.searchFocus.includes("资格证"));

const vocational = buildOrdinarySchoolTypeStrategy("广东职业技术学院");
assert.equal(vocational.id, "vocational-applied");
assert.ok(vocational.firstMove.includes("双选会"));
assert.ok(vocational.warnings.some((warning) => warning.includes("专升本")));

const agriculture = buildOrdinarySchoolTypeStrategy("河南农业职业学院");
assert.equal(agriculture.id, "agriculture-food");
assert.equal(agriculture.label, "农业 / 食品类院校");
assert.ok(agriculture.firstMove.includes("实训基地"));
assert.ok(agriculture.searchFocus.includes("乡村振兴"));
assert.ok(agriculture.searchFocus.includes("食品检验"));

const architecture = buildOrdinarySchoolTypeStrategy("重庆建筑工程职业学院");
assert.equal(architecture.id, "architecture-civil");
assert.equal(architecture.label, "建筑 / 土木类院校");
assert.ok(architecture.searchFocus.includes("BIM"));
assert.ok(architecture.searchFocus.includes("造价"));

const law = buildOrdinarySchoolTypeStrategy("河南司法警官职业学院");
assert.equal(law.id, "law-public-service");
assert.equal(law.label, "政法 / 公共服务类院校");
assert.ok(law.searchFocus.includes("招录"));
assert.ok(law.searchFocus.includes("法律服务"));

const sports = buildOrdinarySchoolTypeStrategy("武汉体育学院体育科技学院");
assert.equal(sports.id, "sports-health");
assert.equal(sports.label, "体育 / 健康服务类院校");
assert.ok(sports.searchFocus.includes("健身教练"));
assert.ok(sports.searchFocus.includes("康养"));

const fallback = buildOrdinarySchoolTypeStrategy("普通测试学院");
assert.equal(fallback.id, "general-local");
assert.equal(fallback.label, "普通本科 / 待识别院校");

const packet = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务");
assert.equal(packet.typeStrategy.id, "finance-business");

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("activeRescuePacket.typeStrategy"), "index page should read type strategy from the rescue packet");

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
capturedPage.onSchoolInput.call(page, { detail: { value: "河南医学高等专科学校" } });
capturedPage.onMajorInput.call(page, { detail: { value: "护理" } });

const activePacket = page.data.activeRescuePacket as { typeStrategy: SchoolTypeStrategy };
assert.equal(activePacket.typeStrategy.id, "medical-health");
assert.ok(activePacket.typeStrategy.firstMove.includes("实习医院"));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "school-type-strategy-card",
  "activeRescuePacket.typeStrategy.label",
  "activeRescuePacket.typeStrategy.firstMove",
  "activeRescuePacket.typeStrategy.searchFocus",
  "activeRescuePacket.typeStrategy.warnings",
]) {
  assert.ok(markup.includes(token), `index markup should expose type strategy via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".school-type-strategy-card",
  ".school-type-strategy-focus",
  ".school-type-strategy-warning",
]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program school type strategy verified.");
