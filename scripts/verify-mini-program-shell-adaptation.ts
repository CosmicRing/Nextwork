import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const shellStart = styleSource.indexOf("@media (max-width: 860px)");
const shellNextMedia = styleSource.indexOf("@media", shellStart + 1);
const shellSource = styleSource.slice(shellStart, shellNextMedia === -1 ? styleSource.length : shellNextMedia);
const finalShellStart = styleSource.lastIndexOf("@media (max-width: 860px)");
const finalShellSource = styleSource.slice(finalShellStart);
const mobileStart = styleSource.indexOf("@media (max-width: 560px)");
const nextMedia = styleSource.indexOf("@media", mobileStart + 1);
const mobileSource = styleSource.slice(mobileStart, nextMedia === -1 ? styleSource.length : nextMedia);

assert.ok(appSource.includes('className="salary-mobile-tabbar"'), "app should render a dedicated mini-program bottom tabbar");
assert.ok(shellStart > -1, "styles should include a mini-program shell breakpoint before phone-only refinements");
assert.ok(finalShellStart > shellStart, "styles should include a final mini-program overflow guard after page-specific styles");
assert.ok(mobileStart > -1, "styles should include a dedicated mini-program/mobile breakpoint");

for (const token of [
  ".salary-app {\n    padding-bottom:",
  ".salary-topbar {\n    grid-template-columns: minmax(0, 1fr) auto;",
  ".salary-nav {\n    display: none;",
  ".salary-mobile-tabbar {\n    position: fixed;",
  "bottom: max(10px, env(safe-area-inset-bottom));",
  "grid-template-columns: repeat(4, minmax(0, 1fr));",
  ".salary-mobile-tabbar button {\n    min-width: 0;",
  ".salary-refresh {\n    justify-items: end;",
  ".salary-workspace {\n    width: 100%;",
  ".school-public-access-panel {\n    border: 0;",
]) {
  assert.ok(shellSource.includes(token) || mobileSource.includes(token), `mini-program shell should include ${token}`);
}

const gridOverrideStart = finalShellSource.indexOf(".school-workbench-fast-entry-strip,\n  .unknown-school-authority-entry-strip,");
assert.ok(gridOverrideStart > -1, "final mini-program guard should include the single-column entry grid override");
const gridOverrideEnd = finalShellSource.indexOf("}", gridOverrideStart);
const gridOverrideBlock = finalShellSource.slice(gridOverrideStart, gridOverrideEnd);

for (const selector of [
  ".school-workbench-fast-entry-strip",
  ".unknown-school-authority-entry-strip",
  ".unknown-school-evidence-priority-grid",
  ".unknown-school-public-entrance-grid",
  ".unknown-school-source-task-list",
  ".unknown-school-evidence-rules",
]) {
  assert.ok(gridOverrideBlock.includes(selector), `mini-program shell styles should override ${selector}`);
}

assert.ok(gridOverrideBlock.includes("grid-template-columns: 1fr"), "mini-program entry grids should collapse to one column");
assert.ok(gridOverrideBlock.includes("overflow-x: visible"), "mini-program entry grids should not remain horizontal scrollers");
assert.ok(!gridOverrideBlock.includes("display: flex"), "mini-program entry grids should not use horizontal flex strips");
