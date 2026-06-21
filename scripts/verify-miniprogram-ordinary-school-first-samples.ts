import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

type MiniProgramSchool = {
  id: string;
  name: string;
  city: string;
  type: string;
  officialLinks: Array<{ label: string; kind: string; url: string }>;
  recruitersByYear: Array<{ year: number; companies: string[] }>;
  majors: Array<{ name: string; salary: string; employmentRate: string; destinations: string[] }>;
};

type RuntimePage = {
  data: Record<string, unknown>;
  setData(nextData: Record<string, unknown>): void;
};

type IndexPageConfig = {
  data: Record<string, unknown>;
  onSchoolInput(this: RuntimePage, event: { detail: { value: string } }): void;
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
const ordinarySchoolNames = ["郑州工商学院", "武汉工商学院", "重庆移通学院", "广州商学院"];
const firstSchools = Array.from(sampleData.schools.slice(0, ordinarySchoolNames.length).map((school) => school.name));

assert.deepEqual(
  firstSchools,
  ordinarySchoolNames,
  "mini program school samples should put ordinary/private/applied schools before elite-school examples",
);
assert.ok(sampleData.schools.length >= 7, "mini program should keep ordinary schools plus a few verified stronger-school examples");

for (const school of sampleData.schools.slice(0, ordinarySchoolNames.length)) {
  assert.ok(/民办|应用型|普通|独立学院/.test(school.type), `${school.name} should be clearly labeled as an ordinary-school sample`);
  assert.ok(school.officialLinks.length >= 3, `${school.name} should include public school/admissions/employment entrances`);
  assert.ok(
    school.officialLinks.some((link) => link.kind === "招生") &&
      school.officialLinks.some((link) => link.kind === "就业"),
    `${school.name} should expose both admissions and employment entrances`,
  );
  assert.ok(school.recruitersByYear.length >= 2, `${school.name} should include yearly recruiting evidence placeholders`);
  assert.ok(school.majors.length >= 3, `${school.name} should include several majors instead of one computer-only path`);
  assert.ok(school.majors.every((major) => major.salary.includes("/月")), `${school.name} majors should show salary references`);
}

const firstOrdinaryMajors = sampleData.schools
  .slice(0, ordinarySchoolNames.length)
  .flatMap((school) => school.majors.map((major) => major.name));
for (const requiredMajor of ["会计学", "电子商务", "酒店管理", "机械设计制造及其自动化"]) {
  assert.ok(firstOrdinaryMajors.includes(requiredMajor), `ordinary school samples should include ${requiredMajor}`);
}

const pageMarkup = read("miniprogram/pages/index/index.wxml");
assert.ok(pageMarkup.includes("例如 郑州工商学院 / 武汉工商学院 / 重庆移通学院"));
assert.ok(!pageMarkup.includes("例如 西电 / 浙大 / 北邮"), "mini program placeholder should not center elite-school examples");

const pageScript = read("miniprogram/pages/index/index.js");
let capturedPage: IndexPageConfig | undefined;

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
    setClipboardData() {},
    showToast() {},
  },
}, { filename: "miniprogram/pages/index/index.js" });

assert.ok(capturedPage, "index page should register through Page()");
assert.equal((capturedPage.data.selectedSchool as MiniProgramSchool).name, "郑州工商学院");
assert.equal((capturedPage.data.filteredSchools as MiniProgramSchool[])[0].name, "郑州工商学院");

const runtimePage: RuntimePage = {
  data: JSON.parse(JSON.stringify(capturedPage.data)) as Record<string, unknown>,
  setData(nextData: Record<string, unknown>) {
    this.data = { ...this.data, ...nextData };
  },
};

capturedPage.onSchoolInput.call(runtimePage, { detail: { value: "郑州工商学院" } });
assert.equal((runtimePage.data.selectedSchool as MiniProgramSchool).name, "郑州工商学院");
assert.equal(runtimePage.data.isUnknownSchool, false, "ordinary sample schools should be known entries, not unknown fallbacks");
assert.ok(
  ((runtimePage.data.selectedMajor as { name: string } | null)?.name ?? "").length > 0,
  "ordinary sample school selection should expose a first major immediately",
);

console.log("Mini program ordinary-school-first samples verified.");
