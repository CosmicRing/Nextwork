import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolDirectionPresets } from "../src/lib/unknownSchoolDirectionPresets";

const vocational = buildUnknownSchoolDirectionPresets("周口职业技术学院");
assert.ok(vocational.length >= 4, "vocational schools should get several search-start directions");
assert.deepEqual(
  vocational.slice(0, 3).map((preset) => [preset.majorName, preset.jobName]),
  [
    ["护理", "护士"],
    ["电子商务", "电商运营"],
    ["计算机应用技术", "技术支持工程师"],
  ],
);
assert.ok(vocational.every((preset) => preset.disclaimer.includes("检索方向")), "presets should avoid claiming the school definitely offers the major");
assert.ok(vocational.every((preset) => preset.queryHints.length >= 3), "each preset should provide concrete query hints");

const medical = buildUnknownSchoolDirectionPresets("河南医学高等专科学校");
assert.equal(medical[0].majorName, "护理");
assert.equal(medical[0].jobName, "护士");
assert.ok(medical.some((preset) => preset.majorName.includes("药")), "medical schools should include medicine-related options");

const media = buildUnknownSchoolDirectionPresets("四川传媒学院");
assert.ok(media.some((preset) => preset.majorName === "数字媒体技术"), "media schools should include digital media");
assert.ok(media.some((preset) => preset.jobName.includes("运营")), "media schools should include operation roles");

const agriculture = buildUnknownSchoolDirectionPresets("河南农业职业学院");
assert.ok(agriculture.some((preset) => preset.majorName === "现代农业技术"), "agriculture schools should include modern agriculture");
assert.ok(agriculture.some((preset) => preset.jobName.includes("食品检验")), "agriculture schools should include food inspection roles");
assert.ok(agriculture.some((preset) => preset.queryHints.includes("乡村振兴")), "agriculture schools should point to rural revitalization evidence");

const architecture = buildUnknownSchoolDirectionPresets("重庆建筑工程职业学院");
assert.ok(architecture.some((preset) => preset.majorName === "工程造价"), "architecture schools should include cost engineering");
assert.ok(architecture.some((preset) => preset.jobName.includes("BIM")), "architecture schools should include BIM roles");

const law = buildUnknownSchoolDirectionPresets("河南司法警官职业学院");
assert.ok(law.some((preset) => preset.majorName === "法律事务"), "law schools should include legal affairs");
assert.ok(law.some((preset) => preset.jobName.includes("法务")), "law schools should include legal operations roles");

const sports = buildUnknownSchoolDirectionPresets("武汉体育学院体育科技学院");
assert.ok(sports.some((preset) => preset.majorName === "运动康复"), "sports schools should include sports rehabilitation");
assert.ok(sports.some((preset) => preset.jobName.includes("健身")), "sports schools should include fitness roles");

const fallback = buildUnknownSchoolDirectionPresets("某某学院");
assert.ok(fallback.some((preset) => preset.majorName === "会计学"), "fallback should still help users start with common majors");
assert.ok(fallback.every((preset) => preset.id.startsWith("unknown-direction-")), "preset ids should be stable enough for React keys");

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolLookupActionQueue", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function UnknownSchoolDirectionPresetStrip");
const componentEnd = mainSource.indexOf("function SchoolLookupActionQueue", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(mainSource.includes("buildUnknownSchoolDirectionPresets"), "main should import the direction preset helper");
assert.ok(accessSource.includes("const unknownDirectionPresets = selectedSchool ? [] : buildUnknownSchoolDirectionPresets(targetSchoolName);"), "school panel should derive unknown-school direction presets");
assert.ok(componentStart > -1 && componentEnd > componentStart, "direction preset strip component should exist");

const queryBoxIndex = accessSource.indexOf('className="school-public-query-box"');
const presetIndex = accessSource.indexOf("<UnknownSchoolDirectionPresetStrip");
const launcherIndex = accessSource.indexOf("<SchoolOfficialEntranceLauncher");
assert.ok(
  queryBoxIndex > -1 && presetIndex > queryBoxIndex && launcherIndex > presetIndex,
  "direction presets should sit after major/job inputs and before the larger official entrance cards",
);

for (const token of [
  'className="unknown-school-direction-presets"',
  "presets.map((preset)",
  "onApplyPreset(preset)",
  "preset.majorName",
  "preset.jobName",
  "preset.disclaimer",
]) {
  assert.ok(componentSource.includes(token), `direction preset component should include ${token}`);
}

for (const className of [
  ".unknown-school-direction-presets",
  ".unknown-school-direction-presets-head",
  ".unknown-school-direction-preset-grid",
  ".unknown-school-direction-preset-card",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
