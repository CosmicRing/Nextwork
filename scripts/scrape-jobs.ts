import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { jobs } from "../src/data/jobs";

const companySources = [
  { companyName: "字节跳动", url: "https://jobs.bytedance.com/" },
  { companyName: "腾讯", url: "https://careers.tencent.com/" },
  { companyName: "阿里巴巴", url: "https://talent.alibaba.com/" },
  { companyName: "美团", url: "https://zhaopin.meituan.com/" },
  { companyName: "百度", url: "https://talent.baidu.com/" },
  { companyName: "京东", url: "https://campus.jd.com/" },
];

const outDir = resolve("data");
mkdirSync(outDir, { recursive: true });

const payload = {
  generatedAt: new Date().toISOString(),
  note: "Prototype seed. Replace each source adapter with official-site pagination and detail-page extraction.",
  companySources,
  jobs,
};

writeFileSync(resolve(outDir, "jobs.seed.json"), JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${resolve(outDir, "jobs.seed.json")}`);
