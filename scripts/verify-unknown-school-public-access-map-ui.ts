import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildUnknownSchoolPublicDocumentMatrix } from "../src/lib/unknownSchoolEntryPack";

const items = buildUnknownSchoolPublicDocumentMatrix({
  schoolName: "周口职业技术学院",
  majorName: "电子商务",
  jobName: "电商运营",
  officialDomain: "zknu.edu.cn",
});

assert.equal(items.length, 5);
assert.deepEqual(
  items.map((item) => item.id),
  ["major-proof", "admission-proof", "employment-report", "campus-recruiting", "salary-crosscheck"],
);
assert.ok(items.every((item) => item.url.startsWith("https://www.bing.com/search?q=")));
assert.ok(items.every((item) => item.siteUrl.includes("site%3Azknu.edu.cn")));

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolPublicAccessMap", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function UnknownSchoolPublicAccessMap");
const componentEnd = mainSource.indexOf("function UnknownSchoolTypeStrategyCard", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(
  accessSource.includes("const unknownPublicAccessMapItems = selectedSchool ? [] : buildUnknownSchoolPublicDocumentMatrix({"),
  "school access panel should derive a top-level public access map for unknown schools",
);
assert.ok(
  accessSource.includes("onOfficialDomainChange={setUnknownOfficialDomain}"),
  "public access map should expose a top-level official-domain quick input",
);

const strategyIndex = accessSource.indexOf("<UnknownSchoolTypeStrategyCard");
const mapIndex = accessSource.indexOf("<UnknownSchoolPublicAccessMap");
const rescueEntryIndex = accessSource.indexOf("<SchoolPublicRescueEntryStrip");
assert.ok(
  mapIndex > -1 && strategyIndex > mapIndex && rescueEntryIndex > strategyIndex,
  "public access map should appear immediately after the school switch, before explanatory strategy and generic entrance strips",
);

for (const token of [
  'className="unknown-school-public-access-map"',
  "公开入口地图",
  "items.map((item)",
  "item.url",
  "item.siteUrl",
  "onUseTemplate(item)",
  "onOfficialDomainChange",
  'className="unknown-school-public-access-domain"',
  "value={officialDomain}",
  "onChange={(event) => onOfficialDomainChange(event.target.value)}",
  "extractUnknownSchoolOfficialDomain(officialDomain)",
]) {
  assert.ok(componentSource.includes(token), `public access map component should include ${token}`);
}

for (const className of [
  ".unknown-school-public-access-map",
  ".unknown-school-public-access-map-head",
  ".unknown-school-public-access-map-grid",
  ".unknown-school-public-access-map-card",
  ".unknown-school-public-access-map-actions",
  ".unknown-school-public-access-domain",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
