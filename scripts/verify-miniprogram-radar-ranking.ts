import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RadarMajor = {
  name: string;
  strength: number;
  ring: number;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type RadarPageConfig = {
  data: Record<string, unknown>;
  onRoleInput(this: RuntimePage, event: { detail: { value: string } }): void;
  selectRole(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
  copyRadarReport(this: RuntimePage): void;
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

const pageScript = read("miniprogram/pages/radar/radar.js");
for (const token of [
  "buildRoleRadarState",
  "radarRankedMajors",
  "radarReportText",
  "copyRadarReport",
]) {
  assert.ok(pageScript.includes(token), `radar page should expose role radar ranking via ${token}`);
}

const sampleData = loadSampleData();
let clipboardText = "";
let capturedPage: RadarPageConfig | undefined;

vm.runInNewContext(pageScript, {
  require(specifier: string) {
    if (specifier === "../../utils/sample-data") return sampleData;
    throw new Error(`unexpected require: ${specifier}`);
  },
  Page(config: RadarPageConfig) {
    capturedPage = config;
  },
  wx: {
    setClipboardData(options: { data: string; success?: () => void }) {
      clipboardText = options.data;
      options.success?.();
    },
    showToast() {},
  },
}, { filename: "miniprogram/pages/radar/radar.js" });

assert.ok(capturedPage, "radar page should register through Page()");

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onRoleInput.call(page, { detail: { value: "产品" } });
const productMajors = page.data.radarRankedMajors as RadarMajor[];
assert.equal((page.data.selectedRole as { title: string }).title, "产品经理");
assert.equal((page.data.selectedRole as { salary: string }).salary, "12-32K/月");
assert.equal(productMajors[0].name, "信息管理与信息系统");
assert.ok(productMajors.every((major, index, list) => index === 0 || list[index - 1].strength >= major.strength));

capturedPage.copyRadarReport.call(page);
assert.ok(clipboardText.includes("职业雷达报告"));
assert.ok(clipboardText.includes("岗位：产品经理"));
assert.ok(clipboardText.includes("薪资参考：12-32K/月"));
assert.ok(clipboardText.includes("1. 信息管理与信息系统｜关联强度 88｜第 1 圈"));
assert.ok(clipboardText.includes("常见公司：Alibaba、JD、ByteDance、Tencent、Amazon"));

capturedPage.selectRole.call(page, { currentTarget: { dataset: { id: "hotel-operations" } } });
const hotelMajors = page.data.radarRankedMajors as RadarMajor[];
assert.equal((page.data.selectedRole as { title: string }).title, "酒店运营管培生");
assert.equal(hotelMajors[0].name, "酒店管理");
assert.ok(String(page.data.radarReportText).includes("酒店运营管培生"));

const markup = read("miniprogram/pages/radar/radar.wxml");
for (const token of [
  "radarRankedMajors",
  "copyRadarReport",
  "radar-report-button",
  "radar-ring-legend",
]) {
  assert.ok(markup.includes(token), `radar markup should expose ranking report via ${token}`);
}

const styles = read("miniprogram/pages/radar/radar.wxss");
for (const token of [".radar-report-button", ".radar-ring-legend", ".radar-report-note"]) {
  assert.ok(styles.includes(token), `radar styles should include ${token}`);
}

console.log("Mini program career radar ranking verified.");
