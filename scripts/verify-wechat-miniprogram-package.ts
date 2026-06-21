import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve("miniprogram");

function readText(relativePath: string): string {
  const filePath = path.join(root, relativePath);
  assert.ok(existsSync(filePath), `missing miniprogram/${relativePath}`);
  return readFileSync(filePath, "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

const projectConfig = readJson<{
  appid?: string;
  compileType?: string;
  miniprogramRoot?: string;
  projectname?: string;
  setting?: Record<string, unknown>;
}>("project.config.json");

assert.equal(projectConfig.compileType, "miniprogram", "project should compile as a normal mini program");
assert.equal(projectConfig.miniprogramRoot, "./", "mini program source root should be miniprogram/");
assert.equal(projectConfig.projectname, "kankan-salary", "project name should match 看看工资");
assert.ok(projectConfig.appid, "project config should include an AppID placeholder or real AppID");

const appConfig = readJson<{
  entryPagePath?: string;
  pages?: string[];
  sitemapLocation?: string;
  tabBar?: { list?: Array<{ pagePath?: string; text?: string }> };
}>("app.json");

const requiredPages = [
  "pages/index/index",
  "pages/companies/companies",
  "pages/company-detail/company-detail",
  "pages/radar/radar",
];

assert.equal(appConfig.entryPagePath, "pages/index/index", "home page should be explicit");
assert.deepEqual(appConfig.pages, requiredPages, "app.json should expose the launch pages");
assert.equal(appConfig.sitemapLocation, "sitemap.json", "sitemap should be configured");
assert.deepEqual(
  appConfig.tabBar?.list?.map((item) => item.pagePath),
  ["pages/index/index", "pages/companies/companies", "pages/radar/radar"],
  "tab bar should keep search, company directory, and radar as first-class tabs",
);

for (const page of requiredPages) {
  const base = page.replace(/^pages\//, "pages/");
  for (const ext of [".js", ".json", ".wxml", ".wxss"]) {
    readText(`${base}${ext}`);
  }
}

readText("app.js");
readText("app.wxss");
readText("sitemap.json");

const dataSource = readText("utils/sample-data.js");
assert.ok(dataSource.includes("schools"), "sample data should include school entry points");
assert.ok(dataSource.includes("companies"), "sample data should include company cards");
assert.ok(dataSource.includes("radarRoles"), "sample data should include role-to-major radar data");

const allMiniProgramSource = [
  "app.js",
  "app.wxss",
  "utils/sample-data.js",
  ...requiredPages.flatMap((page) => {
    const base = page.replace(/^pages\//, "pages/");
    return [".js", ".json", ".wxml", ".wxss"].map((ext) => `${base}${ext}`);
  }),
]
  .map((relativePath) => readText(relativePath))
  .join("\n");

for (const forbidden of [
  "<web-view",
  "eval(",
  "new Function",
  "wx.getUserProfile",
  "wx.getLocation",
  "wx.request(",
  'src="http://',
  'src="https://',
]) {
  assert.ok(!allMiniProgramSource.includes(forbidden), `mini program package should not include ${forbidden}`);
}

assert.ok(dataSource.includes("officialLinks"), "school data should keep official public entry links for copying");

const dataSize = statSync(path.join(root, "utils/sample-data.js")).size;
assert.ok(dataSize < 96 * 1024, `sample data should stay compact for first upload, got ${dataSize} bytes`);

const logoPaths = Array.from(dataSource.matchAll(/logo:\s*"([^"]+)"/g)).map((match) => match[1]);
assert.ok(logoPaths.length >= 12, "company directory should expose a local logo for each launch company");
for (const logoPath of logoPaths) {
  assert.ok(logoPath.startsWith("/assets/company-logos/"), `logo should be local company asset: ${logoPath}`);
  const assetPath = path.join(root, logoPath.replace(/^\//, ""));
  assert.ok(existsSync(assetPath), `missing logo asset miniprogram/${logoPath.replace(/^\//, "")}`);
  assert.ok(statSync(assetPath).size < 40 * 1024, `logo asset should stay below tab/icon-friendly size: ${logoPath}`);
}

if (projectConfig.appid === "touristappid") {
  console.warn("UPLOAD_BLOCKED: project.config.json still uses touristappid; replace it with the real Mini Program AppID before upload.");
}

console.log("WeChat mini program package structure verified.");
