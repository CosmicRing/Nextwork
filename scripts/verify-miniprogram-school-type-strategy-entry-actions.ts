import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type TypeStrategyAction = {
  id: string;
  label: string;
  evidenceSlot: string;
  query: string;
  url: string;
  action: string;
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
  copySchoolTypeStrategyAction(
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
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
) => { typeStrategyActions: TypeStrategyAction[] };

const businessPacket = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务");
assert.ok(Array.isArray(businessPacket.typeStrategyActions));
assert.ok(businessPacket.typeStrategyActions.length >= 3);
assert.ok(businessPacket.typeStrategyActions.some((action) => action.label === "电商运营"));

const businessAction = businessPacket.typeStrategyActions.find((action) => action.label === "电商运营");
assert.ok(businessAction);
assert.equal(businessAction.evidenceSlot, "岗位薪资");
assert.ok(businessAction.query.includes("郑州工商学院"));
assert.ok(businessAction.query.includes("电子商务"));
assert.ok(businessAction.query.includes("电商运营"));
assert.ok(businessAction.url.startsWith("https://cn.bing.com/search?q="));
assert.ok(businessAction.action.includes("复制"));

const medicalPacket = buildOrdinarySchoolRescuePacket("河南医学高等专科学校", "护理");
assert.ok(medicalPacket.typeStrategyActions.some((action) => action.label === "实习医院"));
assert.ok(medicalPacket.typeStrategyActions.some((action) => action.label === "资格证"));

const agriculturePacket = buildOrdinarySchoolRescuePacket("河南农业职业学院", "食品质量与安全");
assert.ok(agriculturePacket.typeStrategyActions.some((action) => action.label === "乡村振兴"));
const foodAction = agriculturePacket.typeStrategyActions.find((action) => action.label === "食品检验");
assert.ok(foodAction);
assert.equal(foodAction.evidenceSlot, "岗位薪资");
assert.ok(foodAction.query.includes("食品质量与安全"));
assert.ok(foodAction.query.includes("食品检验"));

const civilPacket = buildOrdinarySchoolRescuePacket("重庆建筑工程职业学院", "工程造价");
assert.ok(civilPacket.typeStrategyActions.some((action) => action.label === "BIM"));
assert.ok(civilPacket.typeStrategyActions.some((action) => action.label === "造价"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("typeStrategyActions"));
assert.ok(pageScript.includes("copySchoolTypeStrategyAction"));

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

const activePacket = page.data.activeRescuePacket as { typeStrategyActions: TypeStrategyAction[] };
const targetAction = activePacket.typeStrategyActions.find((action) => action.label === "电商运营");
assert.ok(targetAction);
capturedPage.copySchoolTypeStrategyAction.call(page, {
  currentTarget: { dataset: { id: targetAction.id } },
});

assert.ok(clipboardText.includes("电商运营"));
assert.ok(clipboardText.includes("郑州工商学院"));
assert.ok(clipboardText.includes("电子商务"));
assert.ok(clipboardText.includes("https://cn.bing.com/search?q="));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "school-type-strategy-action-row",
  "activeRescuePacket.typeStrategyActions",
  "copySchoolTypeStrategyAction",
]) {
  assert.ok(markup.includes(token), `index markup should expose strategy action token ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".school-type-strategy-action-row", ".school-type-strategy-action"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program school type strategy entry actions verified.");
