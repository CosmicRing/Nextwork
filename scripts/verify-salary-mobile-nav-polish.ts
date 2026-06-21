import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const styleSource = readFileSync("src/styles.css", "utf8");

assert.ok(styleSource.includes(".salary-nav"), "salary nav styles should exist");
assert.ok(styleSource.includes("scrollbar-width: none"), "mobile nav should hide Firefox scrollbar chrome");
assert.ok(styleSource.includes(".salary-nav::-webkit-scrollbar"), "mobile nav should hide WebKit scrollbar chrome");
assert.ok(styleSource.includes("display: none"), "WebKit scrollbar rule should remove visible scrollbar");
