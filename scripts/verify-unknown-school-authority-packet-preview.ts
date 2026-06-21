import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketPreviewLines,
  buildUnknownSchoolEntryPacketText,
} from "../src/lib/unknownSchoolEntryPack";

const packetText = buildUnknownSchoolEntryPacketText({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
  entries: buildUnknownSchoolEntryPack({
    schoolName: "周口职业技术学院",
    majorName: "护理学",
    jobName: "护士",
  }),
});
const previewLines = buildUnknownSchoolEntryPacketPreviewLines(packetText);

assert.ok(previewLines.length >= 8, "packet preview should show enough lines to expose the rescue path");
assert.ok(previewLines[0].includes("学校：周口职业技术学院"), "preview should start with the school line");
assert.ok(previewLines.some((line) => line.includes("官方公共库与就业入口")), "preview should expose the official/public entry section");
assert.ok(previewLines.some((line) => line.includes("国家大学生就业服务平台")), "preview should expose the NCSS campus recruiting entrance");
assert.ok(previewLines.some((line) => line.includes("中国公共招聘网")), "preview should expose the MOHRSS public jobs entrance");
assert.ok(previewLines.some((line) => line.includes("国家政务服务平台就业招聘")), "preview should expose the national gov employment entrance");

const mainSource = readFileSync("src/main.tsx", "utf8");
const workbenchStart = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench");
const workbenchEnd = mainSource.indexOf("function SchoolWorkbenchSchoolSwitch", workbenchStart);
const workbenchSource = mainSource.slice(workbenchStart, workbenchEnd);

assert.ok(
  mainSource.includes("buildUnknownSchoolEntryPacketPreviewLines"),
  "main should import the focused packet preview helper",
);
assert.ok(
  workbenchSource.includes("buildUnknownSchoolEntryPacketPreviewLines(packetText)") &&
    !workbenchSource.includes("packetText.split(\"\\n\").filter(Boolean).slice(0, 5)"),
  "unknown-school workbench preview should use the focused helper instead of blindly slicing the first five lines",
);
