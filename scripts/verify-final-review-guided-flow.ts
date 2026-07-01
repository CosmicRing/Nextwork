import fs from "node:fs";

const main = fs.readFileSync("src/main.tsx", "utf8");
const styles = fs.readFileSync("src/styles.css", "utf8");

const requiredMainSnippets = [
  "先做这 3 步",
  "现在只填专业名",
  "系统会给你",
  "志愿表动作",
  "它不能替你判断录取概率",
  "职业侧先保留",
];

const requiredStyleSnippets = [
  ".final-review-flow",
  ".final-review-guidance",
  ".final-review-input-status",
  ".final-review-form-action",
  ".final-review-limits",
];

for (const snippet of requiredMainSnippets) {
  if (!main.includes(snippet)) {
    throw new Error(`Missing guided-flow copy in src/main.tsx: ${snippet}`);
  }
}

for (const snippet of requiredStyleSnippets) {
  if (!styles.includes(snippet)) {
    throw new Error(`Missing guided-flow style in src/styles.css: ${snippet}`);
  }
}

console.log("Final review guided flow is present.");
