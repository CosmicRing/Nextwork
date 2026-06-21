import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  getSchoolEvidencePacketTrustLevel,
  getSchoolEvidencePromotionHint,
} from "../src/lib/schoolEvidencePacket";
import {
  buildUnknownSchoolAuthorityEntrances,
  buildUnknownSchoolEvidenceCaptureTemplate,
} from "../src/lib/unknownSchoolEntryPack";

const authorityEntrances = buildUnknownSchoolAuthorityEntrances({
  schoolName: "testcollege",
  majorName: "\u62a4\u7406",
  jobName: "\u62a4\u58eb",
});

const ncssEntrance = authorityEntrances.find((entry) => entry.id === "ncss-campus");
assert.ok(ncssEntrance, "NCSS public employment entrance should exist");

const ncssTemplate = buildUnknownSchoolEvidenceCaptureTemplate(ncssEntrance);
const entranceOnlyItem = {
  kind: ncssTemplate.kind,
  title: ncssTemplate.label,
  detail: ncssTemplate.detail,
  url: ncssTemplate.url,
};

assert.equal(getSchoolEvidencePacketTrustLevel(entranceOnlyItem), "weak");

const campusPromotion = getSchoolEvidencePromotionHint(entranceOnlyItem);
assert.ok(campusPromotion, "weak entrance-only evidence should explain how to upgrade it");
assert.equal(campusPromotion.label, "\u5347\u7ea7\u6210\u53ef\u91c7\u4fe1\u8bc1\u636e");
for (const expectedField of ["\u65e5\u671f", "\u4f01\u4e1a\u540d", "\u5c97\u4f4d", "\u62db\u8058\u6d3b\u52a8/\u573a\u6b21"]) {
  assert.ok(campusPromotion.fields.includes(expectedField), `campus promotion should ask for ${expectedField}`);
}
assert.ok(
  campusPromotion.text.includes("\u5165\u53e3\u5df2\u4fdd\u5b58\u4e3a\u7ebf\u7d22") &&
    campusPromotion.text.includes("\u624d\u8ba1\u5165\u5230\u6821\u4f01\u4e1a"),
  "campus promotion should say an entrance needs original facts before it counts",
);

const salaryEntrance = authorityEntrances.find((entry) => entry.id === "mohrss-public-jobs");
assert.ok(salaryEntrance, "MOHRSS public jobs entrance should exist");
const salaryTemplate = buildUnknownSchoolEvidenceCaptureTemplate(salaryEntrance);
const salaryPromotion = getSchoolEvidencePromotionHint({
  kind: salaryTemplate.kind,
  title: salaryTemplate.label,
  detail: salaryTemplate.detail,
  url: salaryTemplate.url,
});
assert.ok(salaryPromotion, "salary entrance-only evidence should explain how to upgrade it");
for (const expectedField of ["\u5c97\u4f4d\u540d", "\u57ce\u5e02/\u5730\u533a", "\u85aa\u8d44\u533a\u95f4", "\u6765\u6e90\u65e5\u671f"]) {
  assert.ok(salaryPromotion.fields.includes(expectedField), `salary promotion should ask for ${expectedField}`);
}

const verifiedPublicOfficialItem = {
  kind: "campus",
  title: "\u56fd\u5bb6\u5927\u5b66\u751f\u5c31\u4e1a\u670d\u52a1\u5e73\u53f0\u533b\u836f\u536b\u751f\u4e13\u573a",
  detail:
    "\u6765\u6e90\uff1a\u516c\u5171\u5b98\u65b9\u6e90\u301c\u4f01\u4e1a\uff1a\u90d1\u5dde\u4eba\u6c11\u533b\u9662 / \u6cb3\u5357\u7701\u62a4\u7406\u670d\u52a1\u4e2d\u5fc3\uff5c\u5c97\u4f4d\uff1a\u62a4\u58eb\uff5c\u65e5\u671f\uff1a2025-04-12",
  url: "https://www.ncss.cn/student/jobs/ABCD",
};

assert.equal(getSchoolEvidencePacketTrustLevel(verifiedPublicOfficialItem), "official");
assert.equal(
  getSchoolEvidencePromotionHint(verifiedPublicOfficialItem),
  null,
  "verified public official evidence should not show a promotion hint",
);

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const inboxStart = mainSource.indexOf("function SchoolEvidenceInboxPanel");
const inboxEnd = mainSource.indexOf("function getSchoolManualEvidenceCoverage", inboxStart);
const inboxSource = mainSource.slice(inboxStart, inboxEnd);

assert.ok(
  mainSource.includes("getSchoolEvidencePromotionHint"),
  "main UI should import the shared promotion hint helper",
);
assert.ok(
  inboxSource.includes("const promotionHint = getSchoolEvidencePromotionHint(item)") &&
    inboxSource.includes("school-evidence-promotion-hint"),
  "saved evidence cards should render promotion hints for weak entrance-only evidence",
);
assert.ok(
  styleSource.includes(".school-evidence-promotion-hint"),
  "promotion hints need dedicated compact styling",
);
