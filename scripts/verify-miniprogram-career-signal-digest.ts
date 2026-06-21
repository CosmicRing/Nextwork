import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type CareerSignalDigest = {
  title: string;
  status: string;
  scoreLabel: string;
  salaryLabel: string;
  sourceCoverageText: string;
  opportunity: string;
  risk: string;
  nextActions: string[];
  tags: string[];
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
) => {
  careerSignalDigest: CareerSignalDigest;
  copyText: string;
};

const packet = buildOrdinarySchoolRescuePacket("郑州工商学院", "电子商务", "新乡");
assert.ok(packet.careerSignalDigest, "ordinary rescue packet should include a career signal digest");
assert.ok(packet.careerSignalDigest.title.includes("电子商务"));
assert.ok(packet.careerSignalDigest.title.includes("电商运营"));
assert.equal(packet.careerSignalDigest.salaryLabel, "6-16K/月");
assert.ok(packet.careerSignalDigest.status.includes("先核验"));
assert.ok(packet.careerSignalDigest.scoreLabel.endsWith("信号强度"));
assert.ok(packet.careerSignalDigest.sourceCoverageText.includes("企业官网入口"));
assert.ok(packet.careerSignalDigest.sourceCoverageText.includes("本地机会入口"));
assert.ok(packet.careerSignalDigest.sourceCoverageText.includes("新乡"));
assert.ok(packet.careerSignalDigest.opportunity.includes("薪资"));
assert.ok(packet.careerSignalDigest.risk.includes("不等于学校承诺"));
assert.ok(packet.careerSignalDigest.nextActions.some((action) => action.includes("企业官网岗位")));
assert.ok(packet.careerSignalDigest.nextActions.some((action) => action.includes("就业网")));
assert.ok(packet.careerSignalDigest.tags.includes("电子商务"));
assert.ok(packet.copyText.includes("职业信号摘要"));
assert.ok(packet.copyText.includes("信号风险"));

const pageScript = read("miniprogram/pages/index/index.js");
assert.ok(pageScript.includes("careerSignalDigest"));

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
capturedPage.onCityInput.call(page, { detail: { value: "新乡" } });

const activePacket = page.data.activeRescuePacket as { careerSignalDigest: CareerSignalDigest };
assert.ok(activePacket.careerSignalDigest.title.includes("电子商务"));
assert.ok(activePacket.careerSignalDigest.sourceCoverageText.includes("新乡"));
assert.ok(activePacket.careerSignalDigest.nextActions.length >= 3);

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "career-signal-digest",
  "activeRescuePacket.careerSignalDigest",
  "职业信号摘要",
  "activeRescuePacket.careerSignalDigest.nextActions",
]) {
  assert.ok(markup.includes(token), `index markup should render career signal digest via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".career-signal-digest",
  ".career-signal-metric-row",
  ".career-signal-next-actions",
]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program career signal digest verified.");
