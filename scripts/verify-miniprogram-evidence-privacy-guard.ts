import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceInboxItem = {
  text: string;
  title: string;
  privacyLabel?: string;
  privacyWarning?: string;
  wasTruncated?: boolean;
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
  onEvidenceDraftInput(this: RuntimePage, event: { detail: { value: string } }): void;
  saveEvidenceDraft(this: RuntimePage): void;
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

const pageScript = read("miniprogram/pages/index/index.js");
for (const token of [
  "sanitizeEvidenceTextForStorage",
  "privacyWarning",
  "privacyLabel",
  "evidenceTextStorageLimit",
]) {
  assert.ok(pageScript.includes(token), `index page should protect local evidence storage via ${token}`);
}

const sampleData = loadSampleData();
let capturedPage: IndexPageConfig | undefined;
const storage = new Map<string, unknown>();

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
      getStorageSync(key: string) {
        return storage.get(key);
      },
      setStorageSync(key: string, value: unknown) {
        storage.set(key, value);
      },
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

const repeatedPublicText = Array.from({ length: 80 }, (_, index) => `第${index + 1}段：就业质量报告显示电子商务就业率94.2%。`).join("");
const sensitiveEvidence = [
  "来源：学校官网信息公开栏目｜郑州工商学院2024届毕业生就业质量报告显示电子商务就业率94.2%。",
  "联系人手机号：13812345678，身份证：110105199001011234，邮箱：student@example.com。",
  repeatedPublicText,
].join("");

capturedPage.onEvidenceDraftInput.call(page, { detail: { value: sensitiveEvidence } });
capturedPage.saveEvidenceDraft.call(page);

const inbox = page.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(inbox.length, 1);
const item = inbox[0];

assert.ok(item.text.includes("[已隐藏手机号]"), "phone numbers should be redacted before local storage");
assert.ok(item.text.includes("[已隐藏身份证]"), "ID numbers should be redacted before local storage");
assert.ok(item.text.includes("[已隐藏邮箱]"), "emails should be redacted before local storage");
assert.ok(!item.text.includes("13812345678"));
assert.ok(!item.text.includes("110105199001011234"));
assert.ok(!item.text.includes("student@example.com"));
assert.ok(item.text.length <= 900, "stored evidence text should be capped to avoid huge clipboard payloads");
assert.equal(item.wasTruncated, true);
assert.equal(item.privacyLabel, "本地脱敏");
assert.ok(item.privacyWarning?.includes("已隐藏手机号"));
assert.ok(item.privacyWarning?.includes("已截断"));
assert.ok(!item.title.includes("13812345678"), "evidence title should also be derived from redacted text");

const savedEvidenceKey = Array.from(storage.keys()).find((key) => key.startsWith("kankanSalary:evidenceInbox"));
assert.ok(savedEvidenceKey, "redacted evidence should still persist to the local evidence inbox");
const persisted = storage.get(savedEvidenceKey) as EvidenceInboxItem[];
assert.ok(!persisted[0].text.includes("13812345678"));
assert.ok(persisted[0].text.length <= 900);

const markup = read("miniprogram/pages/index/index.wxml");
for (const token of [
  "item.privacyLabel",
  "item.privacyWarning",
  "evidence-privacy-badge",
  "evidence-privacy-warning",
]) {
  assert.ok(markup.includes(token), `index markup should surface privacy guard state via ${token}`);
}

const styles = read("miniprogram/pages/index/index.wxss");
for (const token of [".evidence-privacy-badge", ".evidence-privacy-warning"]) {
  assert.ok(styles.includes(token), `index styles should include ${token}`);
}

console.log("Mini program evidence privacy guard verified.");
