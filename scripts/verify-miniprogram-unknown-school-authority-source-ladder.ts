import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type AuthorityRoute = {
  tier: string;
  label: string;
  source: string;
  url: string;
  useFor: string;
};

type RescuePacket = {
  targetSchoolName: string;
  targetMajorName: string;
  authorityRoutes: AuthorityRoute[];
  copyText: string;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  onMajorInput(this: RuntimePage, event: { detail: { value: string } }): void;
  copyRescuePacket(this: RuntimePage): void;
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
  return sandbox.module.exports as {
    buildOrdinarySchoolRescuePacket?: (schoolName?: string, majorName?: string) => RescuePacket;
  };
}

const sampleData = loadSampleData();
assert.equal(typeof sampleData.buildOrdinarySchoolRescuePacket, "function");

const packet = sampleData.buildOrdinarySchoolRescuePacket?.("河南开封科技传媒学院", "护理学");
assert.ok(packet);
assert.equal(packet.targetSchoolName, "河南开封科技传媒学院");
assert.equal(packet.targetMajorName, "护理学");
assert.ok(Array.isArray(packet.authorityRoutes), "unknown-school packet should include authority routes");
assert.ok(packet.authorityRoutes.length >= 6, "authority route ladder should give users multiple fallback entrances");
assert.deepEqual(
  Array.from(packet.authorityRoutes.map((route) => route.tier)),
  ["身份核验", "官网定位", "专业开设", "就业报告", "到校招聘", "薪资交叉"],
);
assert.ok(packet.authorityRoutes.some((route) => route.url.includes("gaokao.chsi.com.cn")));
assert.ok(packet.authorityRoutes.some((route) => route.url.includes("ncss.cn")));
assert.ok(packet.authorityRoutes.every((route) => !route.url.includes("学校名") && !route.url.includes("专业名")));
assert.ok(
  packet.authorityRoutes.some((route) => decodeURIComponent(route.url).includes("河南开封科技传媒学院")),
  "authority route URLs should include the entered school",
);
assert.ok(
  packet.authorityRoutes.some((route) => decodeURIComponent(route.url).includes("护理学")),
  "authority route URLs should include the entered major where relevant",
);
assert.ok(packet.copyText.includes("权威入口阶梯"));
assert.ok(packet.copyText.includes("国家大学生就业服务平台"));

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of [
  "authorityRoutes",
]) {
  assert.ok(pageScript.includes(token), `index page should keep authority route state via ${token}`);
}

let capturedPage: IndexPageConfig | undefined;
let clipboardText = "";
vm.runInNewContext(pageScript, {
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
}, { filename: "miniprogram/pages/index/index.js" });

assert.ok(capturedPage, "index page should register through Page()");
const runtimePage: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onSchoolInput.call(runtimePage, { detail: { value: "河南开封科技传媒学院" } });
capturedPage.onMajorInput.call(runtimePage, { detail: { value: "护理学" } });
const activePacket = runtimePage.data.activeRescuePacket as RescuePacket;
assert.ok(activePacket.authorityRoutes.length >= 6);
assert.ok(activePacket.copyText.includes("权威入口阶梯"));
capturedPage.copyRescuePacket.call(runtimePage);
assert.ok(clipboardText.includes("权威入口阶梯"));
assert.ok(clipboardText.includes("河南开封科技传媒学院"));
assert.ok(clipboardText.includes("护理学"));

const pageMarkup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "source-ladder-panel",
  "activeRescuePacket.authorityRoutes",
  "权威入口阶梯",
  "item.tier",
  "item.useFor",
]) {
  assert.ok(pageMarkup.includes(token), `index markup should render authority source ladder via ${token}`);
}

const pageStyles = read("miniprogram/pages/index/index.wxss");
for (const token of [
  ".source-ladder-panel",
  ".source-ladder-card",
  ".source-ladder-tier",
]) {
  assert.ok(pageStyles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program unknown-school authority source ladder verified.");
