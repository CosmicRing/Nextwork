import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolAuthorityEntrances,
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolEvidenceCaptureTemplate,
  buildUnknownSchoolPublicDocumentMatrix,
} from "../src/lib/unknownSchoolEntryPack";

const schoolName = "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662";
const majorName = "\u62a4\u7406";
const jobName = "\u62a4\u58eb";

const entries = buildUnknownSchoolEntryPack({ schoolName, majorName, jobName });
const matrix = buildUnknownSchoolPublicDocumentMatrix({ schoolName, majorName, jobName, officialDomain: "zkvtc.edu.cn" });
const authorityEntries = buildUnknownSchoolAuthorityEntrances({ schoolName, majorName, jobName });

const majorTemplate = buildUnknownSchoolEvidenceCaptureTemplate({
  kind: "major",
  label: "\u4e13\u4e1a\u76ee\u5f55 / \u57f9\u517b\u65b9\u6848",
  source: "\u5b66\u6821\u5b98\u7f51",
  query: "\u62a4\u7406 \u4e13\u4e1a\u8bbe\u7f6e",
  url: "https://example.edu.cn/major",
});
assert.equal(majorTemplate.kind, "major");
assert.ok(majorTemplate.fields.includes("\u4e13\u4e1a\u540d"));
assert.ok(majorTemplate.fields.includes("\u5b66\u9662/\u7cfb\u90e8"));
assert.ok(majorTemplate.requiredText.includes("\u5b66\u6821\u6216\u5b66\u9662\u5b98\u65b9\u9875\u9762"));
assert.ok(majorTemplate.rejectIf.includes("\u805a\u5408\u9875"));
assert.ok(majorTemplate.detail.includes("\u91c7\u96c6\u5b57\u6bb5"));
assert.ok(majorTemplate.detail.includes("\u4e0d\u8981\u7b97\u8bc1\u636e"));

const campusAuthority = authorityEntries.find((entry) => entry.id === "ncss-campus");
assert.ok(campusAuthority, "authority entrances should include NCSS");
const campusTemplate = buildUnknownSchoolEvidenceCaptureTemplate(campusAuthority);
assert.equal(campusTemplate.kind, "campus");
assert.ok(campusTemplate.fields.includes("\u4f01\u4e1a\u540d"));
assert.ok(campusTemplate.fields.includes("\u62db\u8058\u6d3b\u52a8/\u573a\u6b21"));
assert.ok(campusTemplate.requiredText.includes("\u4f01\u4e1a"));
assert.ok(campusTemplate.rejectIf.includes("\u53ea\u6709\u516c\u5171\u5e73\u53f0\u5165\u53e3"));

const salaryAuthority = authorityEntries.find((entry) => entry.id === "mohrss-public-jobs");
assert.ok(salaryAuthority, "authority entrances should include MOHRSS public jobs");
const salaryTemplate = buildUnknownSchoolEvidenceCaptureTemplate(salaryAuthority);
assert.equal(salaryTemplate.kind, "salary");
assert.ok(salaryTemplate.fields.includes("\u85aa\u8d44\u533a\u95f4"));
assert.ok(salaryTemplate.fields.includes("\u57ce\u5e02/\u5730\u533a"));
assert.ok(salaryTemplate.requiredText.includes("\u5c97\u4f4d\u540d"));
assert.ok(salaryTemplate.rejectIf.includes("\u5e73\u5747\u85aa\u8d44"));

const reportMatrix = matrix.find((item) => item.id === "employment-report");
assert.ok(reportMatrix, "public document matrix should include employment report");
const reportTemplate = buildUnknownSchoolEvidenceCaptureTemplate(reportMatrix);
assert.equal(reportTemplate.kind, "report");
assert.ok(reportTemplate.fields.includes("\u62a5\u544a\u5e74\u4efd"));
assert.ok(reportTemplate.fields.includes("\u6bd5\u4e1a\u53bb\u5411\u843d\u5b9e\u7387/\u5c31\u4e1a\u7387"));

const packetText = buildUnknownSchoolEntryPacketText({ schoolName, majorName, jobName, entries });
assert.ok(packetText.includes("\u8bc1\u636e\u91c7\u96c6\u6a21\u677f"), "copy packet should include evidence capture templates");
assert.ok(packetText.includes("\u91c7\u96c6\u5b57\u6bb5"), "copy packet should tell users what fields to save");
assert.ok(packetText.includes("\u4e0d\u8981\u7b97\u8bc1\u636e"), "copy packet should include rejection criteria");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

assert.ok(
  mainSource.includes("buildUnknownSchoolEvidenceCaptureTemplate"),
  "main UI should use the shared capture template helper",
);
assert.ok(
  mainSource.includes("unknown-school-capture-fields"),
  "unknown-school cards should render visible capture fields",
);
assert.ok(
  styleSource.includes(".unknown-school-capture-fields"),
  "capture field chips need dedicated styles",
);
