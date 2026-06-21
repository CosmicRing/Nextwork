import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const actionIndex = mainSource.indexOf("<SchoolActionCommandPanel");
const publicAccessIndex = mainSource.indexOf("<SchoolPublicMajorAccessPanel");
const queryBoxIndex = mainSource.indexOf('className="school-public-query-box"');
const starterIndex = mainSource.indexOf('className="school-starter-preset-panel"');
const firstFoldoutIndex = mainSource.indexOf("<SchoolPublicFoldout");

assert.ok(actionIndex > -1, "action command panel should exist");
assert.ok(publicAccessIndex > -1, "public major access panel should exist");
assert.ok(queryBoxIndex > -1, "school query box should exist");
assert.ok(starterIndex > -1, "starter preset panel should exist");
assert.ok(firstFoldoutIndex > -1, "secondary foldouts should exist");

assert.ok(
  queryBoxIndex < publicAccessIndex && publicAccessIndex < actionIndex && actionIndex < starterIndex,
  "major/job inputs should feed public access entries before action and preset controls",
);
assert.ok(publicAccessIndex < firstFoldoutIndex, "public major access should appear before secondary foldouts");

assert.ok(
  styleSource.includes(".major-browser {\n    order: -1;"),
  "mobile school layout should put the main browser content before the sidebar",
);
