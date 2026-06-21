import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolPublicDocumentMatrix,
  type UnknownSchoolPublicDocumentMatrixItem,
} from "../src/lib/unknownSchoolEntryPack";

const matrix = buildUnknownSchoolPublicDocumentMatrix({
  schoolName: "周口职业技术学院",
  majorName: "护理",
  jobName: "护士",
  officialDomain: "https://www.zkvtc.edu.cn/xxgk/",
});

assert.equal(matrix.length, 5, "unknown-school public document matrix should stay focused on five proof entrances");
assert.deepEqual(
  matrix.map((item) => item.id),
  ["major-proof", "admission-proof", "employment-report", "campus-recruiting", "salary-crosscheck"],
);
assert.deepEqual(
  matrix.map((item) => item.priority),
  [1, 2, 3, 4, 5],
  "matrix priorities should match the order a user should click",
);

const majorProof = matrix[0];
assert.equal(majorProof.label, "专业目录 / 培养方案");
assert.equal(majorProof.proofTarget, "证明这个专业真实存在");
assert.ok(majorProof.query.includes("周口职业技术学院") && majorProof.query.includes("护理"));
assert.ok(majorProof.siteQuery.includes("site:zkvtc.edu.cn"), "site query should use normalized official domain");
assert.ok(majorProof.saveFields.includes("专业名"));
assert.ok(majorProof.saveFields.includes("核心课程"));
assert.ok(majorProof.openHint.includes("官网"), "matrix should tell the user to prefer official pages");
assert.ok(majorProof.url.startsWith("https://www.bing.com/search?"), "matrix entries should be clickable search entrances");

const reportProof = matrix.find((item) => item.id === "employment-report") as UnknownSchoolPublicDocumentMatrixItem;
assert.ok(reportProof.query.includes("2025") && reportProof.query.includes("2024"));
assert.ok(reportProof.saveFields.includes("就业率"));
assert.ok(reportProof.saveFields.includes("行业去向"));

const campusProof = matrix.find((item) => item.id === "campus-recruiting") as UnknownSchoolPublicDocumentMatrixItem;
assert.ok(campusProof.saveFields.includes("企业名"));
assert.ok(campusProof.saveFields.includes("日期"));
assert.ok(campusProof.query.includes("宣讲会") && campusProof.query.includes("双选会"));

const withoutDomain = buildUnknownSchoolPublicDocumentMatrix({
  schoolName: "某某学院",
  majorName: "",
  jobName: "",
});
assert.ok(
  withoutDomain.every((item) => item.siteQuery.includes("site:学校官网域名")),
  "matrix should make the missing official domain obvious instead of pretending to know it",
);
assert.ok(
  withoutDomain.every((item) => item.url.includes(encodeURIComponent("某某学院"))),
  "matrix broad search URLs should still be usable when no domain is known",
);

const libSource = readFileSync("src/lib/unknownSchoolEntryPack.ts", "utf8");
const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

assert.ok(
  libSource.includes("export type UnknownSchoolPublicDocumentMatrixItem"),
  "unknown-school entry helper should expose public document matrix item records",
);
assert.ok(
  libSource.includes("export function buildUnknownSchoolPublicDocumentMatrix"),
  "unknown-school entry helper should build the public document matrix",
);

const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);
const matrixStart = mainSource.indexOf("function UnknownSchoolPublicDocumentMatrix");
const matrixEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", matrixStart);
const matrixSource = mainSource.slice(matrixStart, matrixEnd);

assert.ok(
  workbenchSource.includes("const publicDocumentMatrix = buildUnknownSchoolPublicDocumentMatrix({"),
  "unknown-school workbench should derive the public document matrix",
);
assert.ok(
  workbenchSource.includes("<UnknownSchoolPublicDocumentMatrix") &&
    workbenchSource.includes("items={publicDocumentMatrix}") &&
    workbenchSource.includes("onUseTemplate={onUseMatrixTemplate}"),
  "unknown-school workbench should render the matrix with an evidence-template action",
);
assert.ok(
  workbenchSource.indexOf('className="unknown-school-evidence-priority-grid"') <
    workbenchSource.indexOf("<UnknownSchoolPublicDocumentMatrix") &&
    workbenchSource.indexOf("<UnknownSchoolPublicDocumentMatrix") <
      workbenchSource.indexOf('className="unknown-school-official-recipes"'),
  "public document matrix should sit after first-hop entrances and before site-scoped recipes",
);

for (const token of [
  'className="unknown-school-public-document-matrix"',
  'className="unknown-school-public-document-grid"',
  'className="unknown-school-public-document-card"',
  "items.map((item)",
  "href={item.url}",
  "item.proofTarget",
  "item.saveFields.map((field)",
  "onUseTemplate(item)",
]) {
  assert.ok(matrixSource.includes(token), `matrix component should include ${token}`);
}

for (const className of [
  ".unknown-school-public-document-matrix",
  ".unknown-school-public-document-head",
  ".unknown-school-public-document-grid",
  ".unknown-school-public-document-card",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
