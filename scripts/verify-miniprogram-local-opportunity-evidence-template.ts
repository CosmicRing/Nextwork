import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type LocalOpportunityChannel = {
  id: string;
  label: string;
  source: string;
  query: string;
  url: string;
  evidenceSlot: string;
  action: string;
};

type SalaryDirection = {
  id: string;
  title: string;
  localOpportunityChannels: LocalOpportunityChannel[];
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

const sampleData = loadSampleData();
const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("prefillEvidenceDraftFromLocalOpportunityChannel"));
assert.ok(pageScript.includes("本地机会证据模板"));

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
const activeDirection: SalaryDirection | undefined = activePacket.salaryDirections.find((direction) =>
  direction.title.includes("电商运营"),
);
assert.ok(activeDirection);
const localChannel: LocalOpportunityChannel | undefined = activeDirection.localOpportunityChannels.find(
  (channel) => channel.id === "local-employer-search",
);
assert.ok(localChannel);

capturedPage.prefillEvidenceDraftFromLocalOpportunityChannel.call(page, {
  currentTarget: { dataset: { directionId: activeDirection.id, channelId: localChannel.id } },
});

const draft = page.data.evidenceDraftText as string;
assert.ok(draft.includes("本地机会证据模板"));
assert.ok(draft.includes("郑州工商学院｜电子商务"));
assert.ok(draft.includes("岗位方向：电商运营"));
assert.ok(draft.includes("入口名称：郑州本地电商/商贸企业"));
assert.ok(draft.includes("来源：本地企业/产业带"));
assert.ok(draft.includes("证据槽：岗位薪资"));
assert.ok(draft.includes("待粘贴：岗位原文、公司名称、城市、薪资范围、学历要求、发布日期"));
assert.ok(draft.includes(localChannel.query));
assert.ok(draft.includes(localChannel.url));

const markup = read("miniprogram/pages/index/index.wxml");
assert.ok(markup.includes("prefillEvidenceDraftFromLocalOpportunityChannel"));
assert.ok(markup.includes("填模板"));

console.log("Mini program local opportunity evidence template verified.");
