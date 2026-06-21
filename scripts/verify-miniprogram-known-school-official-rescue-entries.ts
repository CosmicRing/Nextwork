import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type RescueEntry = {
  label: string;
  source: string;
  url: string;
  saveFields: string[];
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onLoad(this: RuntimePage): void;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
  copyRescueEntry(this: RuntimePage, event: { currentTarget: { dataset: { label: string } } }): void;
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

for (const token of [
  "buildKnownSchoolRescuePacket",
  "getKnownSchoolOfficialLink",
  "rebuildRescuePacketCopyText",
]) {
  assert.ok(pageScript.includes(token), `known-school rescue entries should be implemented via ${token}`);
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

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onLoad.call(page);
capturedPage.onSchoolInput.call(page, { detail: { value: "郑州工商学院" } });

const packet = page.data.activeRescuePacket as { entryGroups: RescueEntry[]; copyText: string };
const entries = new Map(packet.entryGroups.map((entry) => [entry.label, entry]));

assert.equal(entries.get("学校主体")?.url, "https://www.ztbu.edu.cn/");
assert.equal(entries.get("专业资料")?.url, "https://www.ztbu.edu.cn/html/828/");
assert.equal(entries.get("到校招聘")?.url, "https://zzgsxy.goworkla.cn/");
assert.ok(entries.get("学校主体")?.source.includes("学校官网"));
assert.ok(entries.get("专业资料")?.source.includes("院部设置"));
assert.ok(entries.get("到校招聘")?.source.includes("就业信息网"));
assert.ok(!entries.get("专业资料")?.url.includes("bing.com"), "known school major evidence should start from the collected official page");
assert.ok(packet.copyText.includes("https://www.ztbu.edu.cn/html/828/"), "copyable packet should preserve official known-school URLs");

capturedPage.copyRescueEntry.call(page, { currentTarget: { dataset: { label: "专业资料" } } });
assert.ok(clipboardText.includes("https://www.ztbu.edu.cn/html/828/"));
assert.ok(!clipboardText.includes("bing.com/search"), "copying a known-school entry should not send users back to generic search");

console.log("Mini program known-school official rescue entries verified.");
