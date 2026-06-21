import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readme = readFileSync("miniprogram/README.md", "utf8");

for (const token of [
  "普通学校信息聚合流程",
  "输入学校和专业",
  "权威入口阶梯",
  "填模板",
  "剪贴板解析",
  "证据箱",
  "当前候选判断",
  "候选对比",
  "不上传、不远程存储",
]) {
  assert.ok(readme.includes(token), `mini program README should document rescue workflow token: ${token}`);
}

assert.ok(
  readme.indexOf("普通学校信息聚合流程") < readme.indexOf("本地预览"),
  "usage workflow should appear before setup instructions",
);

console.log("Mini program README rescue workflow verified.");
