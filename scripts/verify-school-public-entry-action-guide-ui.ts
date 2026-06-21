import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const panelStart = mainSource.indexOf("function SchoolPublicMajorAccessPanel");
const panelEnd = mainSource.indexOf("async function copyTextToClipboard", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(panelStart > -1 && panelEnd > panelStart, "SchoolPublicMajorAccessPanel should exist");
assert.ok(panelSource.includes("entry.actionTitle"), "entry cards should render the user action title");
assert.ok(panelSource.includes("entry.acceptedEvidence"), "entry cards should render accepted evidence criteria");
assert.ok(panelSource.includes("entry.copyTemplate"), "entry cards should render the paste template");
assert.ok(
  panelSource.includes("要找什么") && panelSource.includes("收件箱格式"),
  "entry cards should label what to find and how to paste it",
);
assert.ok(
  styleSource.includes(".school-public-major-access-action") &&
    styleSource.includes(".school-public-major-access-proof") &&
    styleSource.includes(".school-public-major-access-template"),
  "entry action guide should have dedicated compact styles",
);

