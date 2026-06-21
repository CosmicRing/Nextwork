import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type MiniProgramSchool = {
  id: string;
  name: string;
  majors: Array<{ id: string; name: string }>;
};

type RescuePacket = {
  targetSchoolName: string;
  targetMajorName: string;
  copyText: string;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onLoad(this: RuntimePage): void;
  selectSchool(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
  selectMajor(this: RuntimePage, event: { currentTarget: { dataset: { id: string } } }): void;
  saveCurrentCandidate(this: RuntimePage): void;
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

  return sandbox.module.exports as { schools: MiniProgramSchool[] };
}

const sampleData = loadSampleData();
const pageScript = read("miniprogram/pages/index/index.js");

for (const token of ["resolveTargetMajorName", "selectMajor", "targetMajorName: major.name"]) {
  assert.ok(pageScript.includes(token), `index page should sync selected majors through ${token}`);
}

let capturedPage: IndexPageConfig | undefined;
const storage = new Map<string, unknown>();

vm.runInNewContext(pageScript, {
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
}, { filename: "miniprogram/pages/index/index.js" });

assert.ok(capturedPage, "index page should register through Page()");

const page: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onLoad.call(page);

assert.equal((page.data.selectedSchool as MiniProgramSchool).name, "郑州工商学院");
assert.equal((page.data.selectedMajor as { name: string }).name, "会计学");
assert.equal(page.data.targetMajorName, "会计学");
assert.equal((page.data.activeRescuePacket as RescuePacket).targetMajorName, "会计学");
assert.ok((page.data.activeRescuePacket as RescuePacket).copyText.includes("目标专业：会计学"));

const selectedSchool = page.data.selectedSchool as MiniProgramSchool;
const ecommerceMajor = selectedSchool.majors.find((major) => major.name === "电子商务");
assert.ok(ecommerceMajor, "郑州工商学院 sample should include 电子商务");

capturedPage.selectMajor.call(page, { currentTarget: { dataset: { id: ecommerceMajor.id } } });
assert.equal((page.data.selectedMajor as { name: string }).name, "电子商务");
assert.equal(page.data.targetMajorName, "电子商务");
assert.equal((page.data.activeRescuePacket as RescuePacket).targetMajorName, "电子商务");
assert.ok((page.data.activeRescuePacket as RescuePacket).copyText.includes("目标专业：电子商务"));

capturedPage.saveCurrentCandidate.call(page);
const savedCandidates = page.data.savedCandidates as Array<{ schoolName: string; majorName: string; key: string }>;
assert.equal(savedCandidates[0].schoolName, "郑州工商学院");
assert.equal(savedCandidates[0].majorName, "电子商务");
assert.equal(savedCandidates[0].key, "郑州工商学院::电子商务");

capturedPage.selectSchool.call(page, { currentTarget: { dataset: { id: "wtbu" } } });
assert.equal((page.data.selectedSchool as MiniProgramSchool).name, "武汉工商学院");
assert.equal((page.data.selectedMajor as { name: string }).name, "物流管理");
assert.equal(page.data.targetMajorName, "物流管理");
assert.equal((page.data.activeRescuePacket as RescuePacket).targetMajorName, "物流管理");

console.log("Mini program selected major rescue packet sync verified.");
