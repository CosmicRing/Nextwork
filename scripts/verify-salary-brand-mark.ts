import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");

const brandStart = mainSource.indexOf('className="salary-brand"');
const brandEnd = mainSource.indexOf("</button>", brandStart);
const brandSource = mainSource.slice(brandStart, brandEnd);

assert.ok(brandStart > -1 && brandEnd > brandStart, "salary brand button should exist");
assert.ok(brandSource.includes("<strong>看看工资</strong>"), "brand should keep the product name");
assert.ok(!brandSource.includes("<span>看</span>"), "brand mark should not duplicate the first character of 看看工资");
assert.ok(brandSource.includes('aria-hidden="true"'), "brand mark should be decorative for screen readers");
