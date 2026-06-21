import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const runnerPath = "scripts/wechat-miniprogram-cli.ps1";
assert.ok(existsSync(runnerPath), "WeChat mini program CLI runner should exist");

const runnerSource = readFileSync(runnerPath, "utf8");
for (const token of [
  "param(",
  "[ValidateSet(\"preview\", \"upload\")]",
  "touristappid",
  "cli.bat",
  "微信web开发者工具",
  "--project",
  "-v",
  "-d",
]) {
  assert.ok(runnerSource.includes(token), `CLI runner should include ${token}`);
}

assert.ok(
  runnerSource.includes("throw") && runnerSource.includes("replace project.config.json appid"),
  "CLI runner should block upload while project.config.json still uses touristappid",
);

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
};

assert.ok(packageJson.scripts?.["miniapp:preview"]?.includes("wechat-miniprogram-cli.ps1 -Mode preview"));
assert.ok(packageJson.scripts?.["miniapp:upload"]?.includes("wechat-miniprogram-cli.ps1 -Mode upload"));

const readmeSource = readFileSync("miniprogram/README.md", "utf8");
assert.ok(readmeSource.includes("npm.cmd run miniapp:preview"), "mini program README should document one-command preview");
assert.ok(readmeSource.includes("npm.cmd run miniapp:upload"), "mini program README should document one-command upload");
assert.ok(readmeSource.includes("-CliPath"), "mini program README should show how to pass an explicit WeChat cli.bat path");

console.log("WeChat mini program CLI runner verified.");
