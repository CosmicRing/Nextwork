import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");

assert.ok(
  source.includes("function SchoolPublicFoldout"),
  "SchoolPublicAccessPanel should use a reusable foldout component for secondary sections",
);
assert.ok(
  source.includes("function SchoolKnownDetailFoldout"),
  "known school structured details should be collapsed behind a dedicated foldout",
);

const actionIndex = source.indexOf("<SchoolActionCommandPanel");
const publicAccessIndex = source.indexOf("<SchoolPublicMajorAccessPanel");
const firstFoldoutIndex = source.indexOf("<SchoolPublicFoldout");

assert.ok(actionIndex > -1, "the action command panel should stay visible");
assert.ok(publicAccessIndex > -1, "the public major access panel should stay visible");
assert.ok(firstFoldoutIndex > -1, "secondary sections should be moved into foldouts");
assert.ok(
  publicAccessIndex < actionIndex && actionIndex < firstFoldoutIndex,
  "public major access should lead the school workflow, with action command before any foldout",
);

const requiredFoldoutTitles = [
  "\u8bc1\u636e\u6838\u9a8c",
  "\u4f01\u4e1a\u4e0e\u85aa\u8d44",
  "\u4fdd\u5b58\u4e0e\u7ee7\u7eed\u6bd4\u8f83",
];
for (const title of requiredFoldoutTitles) {
  assert.ok(source.includes(`title="${title}"`), `missing school foldout: ${title}`);
}

const knownDetailTitle = "\u5df2\u6536\u5f55\u6837\u672c\u8be6\u60c5";
assert.ok(source.includes(`title="${knownDetailTitle}"`), "missing known-school detail foldout");

const foldoutRenderCount = (source.match(/<SchoolPublicFoldout/g) ?? []).length;
assert.equal(foldoutRenderCount, 3, "school public access should render exactly three secondary foldouts");
