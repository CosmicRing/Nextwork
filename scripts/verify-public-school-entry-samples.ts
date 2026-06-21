import assert from "node:assert/strict";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";

const requiredSchoolNames = [
  "郑州工商学院",
  "广州南方学院",
  "武汉工商学院",
  "成都锦城学院",
  "文华学院",
  "武昌首义学院",
  "西安培华学院",
  "浙江树人学院",
  "黄河科技学院",
  "三江学院",
  "重庆移通学院",
  "郑州升达经贸管理学院",
];

for (const schoolName of requiredSchoolNames) {
  const school = schoolOutcomeProfiles.find((item) => item.name === schoolName);
  assert.ok(school, `${schoolName} should be available as an entry school`);
  assert.ok(school.officialLinks.length > 0, `${schoolName} should expose official entry links`);
  assert.ok(
    school.officialLinks.some((link) => link.kind === "admissions" || link.kind === "major-catalog"),
    `${schoolName} should expose at least one official admissions or major entrance`,
  );
  assert.ok(school.majors.length >= 5, `${schoolName} should expose common major entry points`);
}

const directOfficialEntranceChecks = [
  ["武汉工商学院", "https://goto.wtbu.edu.cn/"],
  ["成都锦城学院", "https://zs.scujcc.edu.cn/"],
  ["西安培华学院", "https://www.peihua.edu.cn/zhaosheng/zyjs/bkzy.htm"],
  ["郑州升达经贸管理学院", "https://www.shengda.edu.cn/zhao/index/zszyml.htm"],
] as const;

for (const [schoolName, url] of directOfficialEntranceChecks) {
  const school = schoolOutcomeProfiles.find((item) => item.name === schoolName);
  assert.ok(
    school?.officialLinks.some((link) => link.url === url),
    `${schoolName} should expose ${url} as a direct official admissions or major entrance`,
  );
}

const destinationChecks = [
  ["郑州工商学院", "会计学", "审计助理"],
  ["广州南方学院", "护理学", "护士"],
  ["武汉工商学院", "电子商务", "电商运营"],
  ["武昌首义学院", "网络与新媒体", "内容运营"],
  ["成都锦城学院", "金融学", "银行客户经理"],
] as const;

for (const [schoolName, majorName, destination] of destinationChecks) {
  const school = schoolOutcomeProfiles.find((item) => item.name === schoolName);
  const major = school?.majors.find((item) => item.name === majorName);
  assert.ok(major, `${schoolName} should include ${majorName}`);
  assert.ok(
    major.destinations.includes(destination),
    `${schoolName} ${majorName} should map to ${destination}`,
  );
}
