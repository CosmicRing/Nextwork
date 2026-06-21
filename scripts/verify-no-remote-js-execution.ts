import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const scraperSource = readFileSync("scripts/scrape-jobs.ts", "utf8");

assert.ok(
  !/\bnew\s+Function\s*\(/.test(scraperSource),
  "scraper must not execute remote JavaScript chunks with new Function",
);

assert.ok(
  !/\bFunction\s*\(\s*source\s*\)\s*\(/.test(scraperSource),
  "scraper must not execute fetched source strings as code",
);
