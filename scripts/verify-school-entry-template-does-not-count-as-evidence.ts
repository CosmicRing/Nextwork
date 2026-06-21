import assert from "node:assert/strict";

import { buildSchoolEvidenceAggregationBrief } from "../src/lib/schoolEvidenceAggregationBrief";
import { getSchoolEvidencePacketTrustLevel, groupSchoolManualEvidenceForPacket } from "../src/lib/schoolEvidencePacket";
import {
  buildUnknownSchoolAuthorityEntrances,
  buildUnknownSchoolEvidenceCaptureTemplate,
} from "../src/lib/unknownSchoolEntryPack";

const authorityEntrances = buildUnknownSchoolAuthorityEntrances({
  schoolName: "testcollege",
  majorName: "护理",
  jobName: "护士",
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

assert.equal(
  getSchoolEvidencePacketTrustLevel(entranceOnlyItem),
  "weak",
  "an official/public URL plus capture template is still only an entrance, not verified evidence",
);

const grouped = groupSchoolManualEvidenceForPacket([entranceOnlyItem]);
assert.equal(grouped.official.length, 0, "entrance templates should not appear as official evidence");
assert.equal(grouped.weak.length, 1, "entrance templates should be visible as non-counting weak evidence");

const brief = buildSchoolEvidenceAggregationBrief({
  schoolName: "testcollege",
  majorName: "护理",
  jobName: "护士",
  items: [entranceOnlyItem],
});

assert.ok(
  brief.missingSlots.includes("到校企业"),
  "a bare NCSS entrance should not cover the campus recruiting slot",
);
assert.equal(brief.status, "not-ready", "entrance-only saved items should not make the school screenable");

const verifiedPublicOfficialItem = {
  kind: "campus",
  title: "国家大学生就业服务平台医药卫生专场",
  detail: "来源：公共官方源｜企业：郑州人民医院 / 河南省护理服务中心｜岗位：护士｜日期：2025-04-12",
  url: "https://www.ncss.cn/student/jobs/ABCD",
};

assert.equal(
  getSchoolEvidencePacketTrustLevel(verifiedPublicOfficialItem),
  "official",
  "public official pages with actual extracted recruiter facts should still count as official evidence",
);
