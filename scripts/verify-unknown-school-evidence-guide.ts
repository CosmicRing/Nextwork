import assert from "node:assert/strict";
import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolEvidenceGuide,
} from "../src/lib/unknownSchoolEntryPack";

const schoolName = "\u5468\u53e3\u804c\u4e1a\u6280\u672f\u5b66\u9662";
const entries = buildUnknownSchoolEntryPack({
  schoolName,
  majorName: "\u62a4\u7406\u5b66",
  jobName: "\u62a4\u58eb",
});
const guide = buildUnknownSchoolEvidenceGuide(entries);
const entryIds = new Set(entries.map((entry) => entry.id));

assert.deepEqual(
  guide.map((step) => step.id),
  ["official-domain", "major-exists", "employment-report", "campus-employers", "salary-proxy"],
  "unknown school evidence guide should enforce the correct verification order",
);

for (const [index, step] of guide.entries()) {
  assert.equal(step.order, index + 1, "guide order should be 1-indexed and sequential");
  assert.ok(entryIds.has(step.entryId), `guide step ${step.id} should point to an entry-pack item`);
  assert.ok(step.title.trim(), `guide step ${step.id} needs a title`);
  assert.ok(step.acceptedEvidence.trim(), `guide step ${step.id} needs accepted evidence criteria`);
  assert.ok(step.rejectIf.trim(), `guide step ${step.id} needs rejection criteria`);
  assert.ok(step.nextAction.trim(), `guide step ${step.id} needs a next action`);
}

assert.ok(
  guide.findIndex((step) => step.id === "salary-proxy") > guide.findIndex((step) => step.id === "campus-employers"),
  "salary should be checked after official school and campus evidence",
);

const packetText = buildUnknownSchoolEntryPacketText({
  schoolName,
  majorName: "\u62a4\u7406\u5b66",
  jobName: "\u62a4\u58eb",
  entries,
});

assert.ok(packetText.includes("\u6838\u9a8c\u987a\u5e8f"), "copy packet should include the verification order");
for (const step of guide) {
  assert.ok(packetText.includes(step.title), `copy packet should include guide step: ${step.title}`);
}
