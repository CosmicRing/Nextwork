import assert from "node:assert/strict";

import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";

const expectedOfficialEntrances = [
  {
    name: "郑州工商学院",
    majorUrl: "https://www.ztbu.edu.cn/html/828/",
  },
  {
    name: "广州南方学院",
    majorUrl: "https://zsb.nfu.edu.cn/yxsz.htm",
  },
  {
    name: "武汉工商学院",
    majorUrl: "https://goto.wtbu.edu.cn/page/detail/FSBCMA/11455/45409",
  },
  {
    name: "成都锦城学院",
    majorUrl: "https://zs.scujcc.edu.cn/zyxz.htm",
  },
  {
    name: "文华学院",
    majorUrl: "https://zhaosheng.hustwenhua.net/xbzy.htm",
  },
  {
    name: "武昌首义学院",
    majorUrl: "https://zs.wsyu.edu.cn/2092/list.htm",
  },
  {
    name: "西安培华学院",
    majorUrl: "https://www.peihua.edu.cn/zhaosheng/zyjs/bkzy.htm",
  },
  {
    name: "浙江树人学院",
    majorUrl: "https://www.zjsru.edu.cn/yxsz1.htm",
  },
  {
    name: "黄河科技学院",
    majorUrl: "https://www.hhstu.cn/zszy.htm",
  },
  {
    name: "三江学院",
    majorUrl: "https://zsb.sju.edu.cn/2814/list.htm",
  },
  {
    name: "重庆移通学院",
    majorUrl: "https://www.cqytu.com/zhuanye/",
  },
  {
    name: "郑州升达经贸管理学院",
    majorUrl: "https://www.shengda.edu.cn/zhao/index/zszyml.htm",
  },
] as const;

for (const expected of expectedOfficialEntrances) {
  const school = schoolOutcomeProfiles.find((item) => item.name === expected.name);
  assert.ok(school, `${expected.name} should be listed for ordinary-school users`);

  const kinds = new Set(school.officialLinks.map((link) => link.kind));
  assert.ok(kinds.has("school"), `${expected.name} should include the official school homepage`);
  assert.ok(kinds.has("admissions"), `${expected.name} should include the admissions entrance`);
  assert.ok(kinds.has("major-catalog"), `${expected.name} should include a professional or college entrance`);
  assert.ok(kinds.has("employment"), `${expected.name} should include the employment or campus recruiting entrance`);

  assert.ok(
    school.officialLinks.some((link) => link.kind === "major-catalog" && link.url === expected.majorUrl),
    `${expected.name} should expose ${expected.majorUrl} as the major or college entrance`,
  );
}

const coveredCount = expectedOfficialEntrances.filter((expected) => {
  const school = schoolOutcomeProfiles.find((item) => item.name === expected.name);
  return school?.officialLinks.some((link) => link.kind === "major-catalog" && link.url === expected.majorUrl);
}).length;

assert.equal(coveredCount, expectedOfficialEntrances.length, "all ordinary school samples should expose official major entrances");
