import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

type MiniProgramCompany = {
  id: string;
  name: string;
  cnName: string;
  region: string;
  industry: string;
  logo: string;
  salary: string;
  officialEntrance: string;
  roles: string[];
  majors: string[];
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
  return sandbox.module.exports as { companies: MiniProgramCompany[] };
}

const { companies } = loadSampleData();

assert.ok(companies.length >= 28, "mini program company directory should not be limited to the launch dozen");

const domestic = companies.filter((company) => company.region === "中国");
const overseas = companies.filter((company) => company.region === "海外");
assert.ok(domestic.length >= 12, "mini program should keep enough domestic employers");
assert.ok(overseas.length >= 12, "mini program should keep enough overseas employers");

const requiredIds = [
  "bytedance",
  "tencent",
  "huawei",
  "meituan",
  "pdd",
  "google",
  "apple",
  "goldman",
  "pwc",
  "hilton",
  "ikea",
  "unilever",
  "loreal",
];

for (const id of requiredIds) {
  assert.ok(companies.some((company) => company.id === id), `mini program should include ${id}`);
}

for (const company of companies) {
  assert.ok(company.logo.startsWith("/assets/company-logos/"), `${company.id} should use a local mini-program logo`);
  const assetPath = path.join(process.cwd(), "miniprogram", company.logo.replace(/^\//, ""));
  assert.ok(existsSync(assetPath), `missing mini-program logo asset for ${company.id}`);
  assert.ok(statSync(assetPath).size < 40 * 1024, `${company.id} logo should stay below 40KB`);
  assert.ok(company.salary.includes("/月"), `${company.id} should show a salary range`);
  assert.ok(company.officialEntrance.startsWith("https://"), `${company.id} should expose an official career entrance`);
  assert.ok(company.roles.length >= 3, `${company.id} should include role examples`);
  assert.ok(company.majors.length >= 3, `${company.id} should include major examples`);
}

const pageScript = read("miniprogram/pages/companies/companies.js");
for (const token of ["google", "goldman", "hilton", "unilever", "loreal"]) {
  assert.ok(pageScript.includes(token), `companies page industry grouping should classify ${token}`);
}

console.log("Mini program company directory coverage verified.");
