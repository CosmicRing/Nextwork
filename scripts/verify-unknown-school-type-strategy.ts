import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolTypeStrategy } from "../src/lib/unknownSchoolDirectionPresets";

const vocational = buildUnknownSchoolTypeStrategy("周口职业技术学院");
assert.equal(vocational.id, "vocational-applied");
assert.equal(vocational.label, "高职 / 应用型院校");
assert.ok(vocational.firstMove.includes("招生专业") && vocational.firstMove.includes("就业信息网"));
assert.ok(vocational.searchFocus.includes("专升本"));
assert.ok(vocational.searchFocus.includes("双选会"));
assert.ok(vocational.evidenceIds.includes("major-catalog"));
assert.ok(vocational.evidenceIds.includes("campus"));
assert.ok(vocational.warnings.some((warning) => warning.includes("logo 墙")));

const medical = buildUnknownSchoolTypeStrategy("河南医学高等专科学校");
assert.equal(medical.id, "medical-health");
assert.equal(medical.label, "医药卫生类院校");
assert.ok(medical.searchFocus.includes("实习医院"));
assert.ok(medical.warnings.some((warning) => warning.includes("资格证")));

const media = buildUnknownSchoolTypeStrategy("四川传媒学院");
assert.equal(media.id, "media-arts");
assert.equal(media.label, "传媒 / 艺术类院校");
assert.ok(media.searchFocus.includes("作品集"));
assert.ok(media.searchFocus.includes("内容运营"));
assert.ok(media.warnings.some((warning) => warning.includes("宣传片")));

const agriculture = buildUnknownSchoolTypeStrategy("河南农业职业学院");
assert.equal(agriculture.id, "agriculture-food");
assert.equal(agriculture.label, "农业 / 食品类院校");
assert.ok(agriculture.firstMove.includes("实训基地"));
assert.ok(agriculture.searchFocus.includes("乡村振兴"));
assert.ok(agriculture.searchFocus.includes("食品检验"));
assert.ok(agriculture.evidenceIds.includes("salary"));
assert.ok(agriculture.warnings.some((warning) => warning.includes("季节")));

const architecture = buildUnknownSchoolTypeStrategy("重庆建筑工程职业学院");
assert.equal(architecture.id, "architecture-civil");
assert.equal(architecture.label, "建筑 / 土木类院校");
assert.ok(architecture.searchFocus.includes("BIM"));
assert.ok(architecture.searchFocus.includes("造价"));
assert.ok(architecture.warnings.some((warning) => warning.includes("工地")));

const law = buildUnknownSchoolTypeStrategy("河南司法警官职业学院");
assert.equal(law.id, "law-public-service");
assert.equal(law.label, "政法 / 公共服务类院校");
assert.ok(law.searchFocus.includes("招录"));
assert.ok(law.searchFocus.includes("法律服务"));
assert.ok(law.warnings.some((warning) => warning.includes("编制")));

const sports = buildUnknownSchoolTypeStrategy("武汉体育学院体育科技学院");
assert.equal(sports.id, "sports-health");
assert.equal(sports.label, "体育 / 健康服务类院校");
assert.ok(sports.searchFocus.includes("健身教练"));
assert.ok(sports.searchFocus.includes("康养"));
assert.ok(sports.warnings.some((warning) => warning.includes("证书")));

const fallback = buildUnknownSchoolTypeStrategy("某某学院");
assert.equal(fallback.id, "general-local");
assert.equal(fallback.label, "普通本科 / 待识别院校");
assert.ok(fallback.firstMove.includes("专业目录"));
assert.ok(fallback.evidenceIds.includes("report"));
assert.ok(fallback.warnings.some((warning) => warning.includes("学校名")));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function SchoolLookupActionQueue", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function UnknownSchoolTypeStrategyCard");
const componentEnd = mainSource.indexOf("function UnknownSchoolDirectionPresetStrip", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(mainSource.includes("buildUnknownSchoolTypeStrategy"), "main should import the unknown-school type strategy helper");
assert.ok(
  accessSource.includes("const unknownSchoolTypeStrategy = selectedSchool ? null : buildUnknownSchoolTypeStrategy(targetSchoolName);"),
  "school access panel should derive a type strategy for uncollected schools",
);

const switchIndex = accessSource.indexOf("<SchoolWorkbenchSchoolSwitch");
const strategyIndex = accessSource.indexOf("<UnknownSchoolTypeStrategyCard");
const rescueEntryIndex = accessSource.indexOf("<SchoolPublicRescueEntryStrip");
assert.ok(
  switchIndex > -1 && strategyIndex > switchIndex && rescueEntryIndex > strategyIndex,
  "type strategy card should sit immediately after the school switch and before the entrance strips",
);

for (const token of [
  'className="unknown-school-type-strategy-card"',
  "strategy.label",
  "strategy.firstMove",
  "strategy.searchFocus.map((focus)",
  "strategy.warnings.map((warning)",
  "strategy.evidenceIds.map((evidenceId)",
]) {
  assert.ok(componentSource.includes(token), `type strategy component should include ${token}`);
}

for (const className of [
  ".unknown-school-type-strategy-card",
  ".unknown-school-type-strategy-main",
  ".unknown-school-type-strategy-focus",
  ".unknown-school-type-strategy-warning",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
