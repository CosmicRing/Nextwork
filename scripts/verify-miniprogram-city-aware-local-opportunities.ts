import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type LocalOpportunityChannel = {
  id: string;
  label: string;
  query: string;
  url: string;
};

type SalaryDirection = {
  id: string;
  title: string;
  localOpportunityChannels: LocalOpportunityChannel[];
};

type RescuePacket = {
  targetCityName: string;
  salaryDirections: SalaryDirection[];
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
  prefillEvidenceDraftFromLocalOpportunityChannel(
    this: RuntimePage,
    event: { currentTarget: { dataset: { directionId: string; channelId: string } } },
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

function findEcommerceDirection(packet: RescuePacket) {
  const direction = packet.salaryDirections.find((item) => item.title.includes("电商运营"));
  assert.ok(direction, "should build ecommerce salary direction");
  return direction;
}

const sampleData = loadSampleData();
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
  cityHint?: string,
) => RescuePacket;

const packet = buildOrdinarySchoolRescuePacket("新乡工程学院", "电子商务", "新乡");
assert.equal(packet.targetCityName, "新乡");
const ecommerceDirection = findEcommerceDirection(packet);
const localChannel = ecommerceDirection.localOpportunityChannels.find((channel) => channel.id === "local-employer-search");
assert.ok(localChannel);
assert.equal(localChannel.label, "新乡本地电商/商贸企业");
assert.ok(localChannel.query.includes("新乡"));
assert.ok(localChannel.query.includes("电子商务"));
assert.ok(localChannel.url.includes(encodeURIComponent("新乡")));
assert.ok(packet.copyText.includes("新乡本地电商/商贸企业"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("onCityInput"));
assert.ok(pageScript.includes("cityQuery"));
assert.ok(pageScript.includes("activeRescuePacket.targetCityName"));

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
assert.equal(page.data.cityQuery, "新乡");
assert.equal(activePacket.targetCityName, "新乡");
const activeDirection = findEcommerceDirection(activePacket);
const activeLocalChannel = activeDirection.localOpportunityChannels.find((channel) => channel.id === "local-employer-search");
assert.ok(activeLocalChannel);
assert.equal(activeLocalChannel.label, "新乡本地电商/商贸企业");

capturedPage.prefillEvidenceDraftFromLocalOpportunityChannel.call(page, {
  currentTarget: { dataset: { directionId: activeDirection.id, channelId: "local-employer-search" } },
});
const draft = page.data.evidenceDraftText as string;
assert.ok(draft.includes("新乡工程学院｜电子商务"));
assert.ok(draft.includes("入口名称：新乡本地电商/商贸企业"));
assert.ok(draft.includes("新乡"));

const markup = read("miniprogram/pages/index/index.wxml");
assert.ok(markup.includes("city-input"));
assert.ok(markup.includes("bindinput=\"onCityInput\""));
assert.ok(markup.includes("activeRescuePacket.targetCityName"));

console.log("Mini program city-aware local opportunities verified.");
