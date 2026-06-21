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
  copyLocalOpportunityChannel(
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
const buildOrdinarySchoolRescuePacket = sampleData.buildOrdinarySchoolRescuePacket as (
  schoolName: string,
  majorName: string,
) => { salaryDirections: SalaryDirection[]; copyText: string };

const packet = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务");
const ecommerceDirection: SalaryDirection | undefined = packet.salaryDirections.find((direction) =>
  direction.title.includes("电商运营"),
);
assert.ok(ecommerceDirection);
assert.ok(Array.isArray(ecommerceDirection.localOpportunityChannels));
assert.ok(ecommerceDirection.localOpportunityChannels.length >= 3);

const localSearch: LocalOpportunityChannel | undefined = ecommerceDirection.localOpportunityChannels.find(
  (channel) => channel.id === "local-employer-search",
);
assert.ok(localSearch);
assert.equal(localSearch.label, "郑州本地电商/商贸企业");
assert.equal(localSearch.source, "本地企业/产业带");
assert.equal(localSearch.evidenceSlot, "岗位薪资");
assert.ok(localSearch.query.includes("郑州"));
assert.ok(localSearch.query.includes("电子商务"));
assert.ok(localSearch.query.includes("电商运营"));
assert.ok(localSearch.url.startsWith("https://cn.bing.com/search?q="));

const schoolJobs: LocalOpportunityChannel | undefined = ecommerceDirection.localOpportunityChannels.find(
  (channel) => channel.id === "school-job-board",
);
assert.ok(schoolJobs);
assert.equal(schoolJobs.source, "学校就业网");
assert.equal(schoolJobs.evidenceSlot, "到校招聘");

const ncss: LocalOpportunityChannel | undefined = ecommerceDirection.localOpportunityChannels.find(
  (channel) => channel.id === "ncss-local",
);
assert.ok(ncss);
assert.equal(ncss.source, "国家大学生就业服务平台");
assert.ok(ncss.url.startsWith("https://www.ncss.cn/student/jobs/index.html?keyword="));

assert.ok(packet.copyText.includes("本地机会入口包"));
assert.ok(packet.copyText.includes("郑州本地电商/商贸企业｜本地企业/产业带"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("localOpportunityChannels"));
assert.ok(pageScript.includes("copyLocalOpportunityChannel"));

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
const activeDirection: SalaryDirection | undefined = activePacket.salaryDirections.find((direction) =>
  direction.title.includes("电商运营"),
);
assert.ok(activeDirection);
capturedPage.copyLocalOpportunityChannel.call(page, {
  currentTarget: { dataset: { directionId: activeDirection.id, channelId: "local-employer-search" } },
});

assert.ok(clipboardText.includes("郑州本地电商/商贸企业"));
assert.ok(clipboardText.includes("本地企业/产业带"));
assert.ok(clipboardText.includes("电商运营"));
assert.ok(clipboardText.includes("岗位薪资"));
assert.ok(clipboardText.includes("https://cn.bing.com/search?q="));

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "salary-direction-local-entry-row",
  "salary-direction-local-entry",
  "localOpportunityChannels",
  "copyLocalOpportunityChannel",
]) {
  assert.ok(markup.includes(token), `index markup should expose local opportunity token ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".salary-direction-local-entry-row", ".salary-direction-local-entry"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program local opportunity channels verified.");
