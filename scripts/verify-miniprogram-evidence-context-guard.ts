import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type EvidenceInboxItem = {
  slotLabel: string;
  taskTitle: string;
  trustStatus: "verified" | "pending";
  sourceHint: string;
  text: string;
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
assert.ok(pageScript.includes("classifyEvidenceDraft"), "index page should classify pasted evidence before advancing progress");

const sampleData = loadSampleData();
const storage = new Map<string, unknown>();
let capturedPage: IndexPageConfig | undefined;
const currentYear = new Date().getFullYear();

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

function createPage(): RuntimePage {
  return {
    data: JSON.parse(JSON.stringify(capturedPage?.data)) as Record<string, unknown>,
    setData(nextData: Record<string, unknown>) {
      this.data = { ...this.data, ...nextData };
    },
  };
}

function primeTarget(page: RuntimePage) {
  capturedPage?.onLoad.call(page);
  capturedPage?.onSchoolInput.call(page, { detail: { value: "新乡工程学院" } });
  capturedPage?.onMajorInput.call(page, { detail: { value: "电子商务" } });
  capturedPage?.onCityInput.call(page, { detail: { value: "新乡" } });
}

function saveEvidence(page: RuntimePage, text: string) {
  capturedPage?.onEvidenceDraftInput.call(page, { detail: { value: text } });
  capturedPage?.saveEvidenceDraft.call(page);
}

const unrelatedPage = createPage();
primeTarget(unrelatedPage);
saveEvidence(
  unrelatedPage,
  `来源：某医院招聘官网｜岗位：护士｜城市：郑州｜薪资：7-12K/月｜学历要求：大专｜更新时间：${currentYear}-04-01｜页面：https://careers.example.com/nurse`,
);

const unrelatedItems = unrelatedPage.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(unrelatedItems.length, 1, "unrelated evidence should still be kept as a reviewable local clue");
assert.equal(unrelatedItems[0].slotLabel, "岗位薪资");
assert.equal(unrelatedItems[0].taskTitle, "补薪资");
assert.equal(unrelatedItems[0].trustStatus, "pending", "salary evidence for another city/job should require review instead of advancing progress");
assert.ok(unrelatedItems[0].sourceHint.includes("当前学校/专业/城市"));
assert.equal(unrelatedPage.data.evidenceProgressText, "0/5 已完成", "unrelated salary evidence should not advance the current candidate");

storage.clear();
const relatedPage = createPage();
primeTarget(relatedPage);
saveEvidence(
  relatedPage,
  `来源：京东招聘官网｜岗位：电商运营｜城市：新乡｜薪资：8-12K/月｜学历要求：本科｜更新时间：${currentYear}-04-01｜页面：https://careers.jd.com/`,
);

const relatedItems = relatedPage.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(relatedItems.length, 1);
assert.equal(relatedItems[0].trustStatus, "verified", "matching salary evidence should still count");
assert.equal(relatedPage.data.evidenceProgressText, "1/5 已完成");

storage.clear();
const wrongDomainPage = createPage();
primeTarget(wrongDomainPage);
saveEvidence(
  wrongDomainPage,
  "来源：学校官网｜主管部门：河南省教育厅｜办学层次：本科｜官网域名：www.zzuli.edu.cn｜页面：https://www.zzuli.edu.cn/",
);

const wrongDomainItems = wrongDomainPage.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(wrongDomainItems.length, 1);
assert.equal(wrongDomainItems[0].slotLabel, "学校主体");
assert.equal(
  wrongDomainItems[0].trustStatus,
  "pending",
  "an arbitrary official-looking school domain should not verify the current unknown school without the target school name",
);
assert.equal(wrongDomainPage.data.evidenceProgressText, "0/5 已完成");

storage.clear();
const targetSchoolDomainPage = createPage();
primeTarget(targetSchoolDomainPage);
saveEvidence(
  targetSchoolDomainPage,
  "来源：学校官网｜学校全称：新乡工程学院｜主管部门：河南省教育厅｜办学层次：本科｜官网域名：www.xxgc.edu.cn｜页面：https://www.xxgc.edu.cn/",
);

const targetSchoolDomainItems = targetSchoolDomainPage.data.evidenceInboxItems as EvidenceInboxItem[];
assert.equal(targetSchoolDomainItems.length, 1);
assert.equal(targetSchoolDomainItems[0].slotLabel, "学校主体");
assert.equal(targetSchoolDomainItems[0].trustStatus, "verified", "target school name plus official domain should verify school identity evidence");
assert.equal(targetSchoolDomainPage.data.evidenceProgressText, "1/5 已完成");

console.log("Mini program evidence context guard verified.");
