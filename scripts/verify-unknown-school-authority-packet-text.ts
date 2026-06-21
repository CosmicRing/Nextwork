import assert from "node:assert/strict";

import {
  buildUnknownSchoolAuthorityEntrances,
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
} from "../src/lib/unknownSchoolEntryPack";

const schoolName = "周口职业技术学院";
const majorName = "护理学";
const jobName = "护士";
const authorityEntrances = buildUnknownSchoolAuthorityEntrances({ schoolName, majorName, jobName });
const packetText = buildUnknownSchoolEntryPacketText({
  schoolName,
  majorName,
  jobName,
  entries: buildUnknownSchoolEntryPack({ schoolName, majorName, jobName }),
});

assert.ok(
  packetText.includes("官方公共库与就业入口"),
  "copyable unknown-school packet should put official public and employment entrances in their own section",
);

for (const entry of authorityEntrances) {
  assert.ok(packetText.includes(entry.label), `packet should include authority entrance label: ${entry.label}`);
  assert.ok(packetText.includes(entry.url), `packet should include authority entrance URL: ${entry.url}`);
  assert.ok(packetText.includes(entry.query), `packet should include authority entrance query: ${entry.query}`);
}

assert.ok(
  packetText.indexOf("官方公共库与就业入口") < packetText.indexOf("公开入口查询包"),
  "official public and employment entrances should appear before broad search engines in the packet",
);
