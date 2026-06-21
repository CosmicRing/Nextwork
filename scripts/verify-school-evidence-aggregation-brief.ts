import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { buildSchoolEvidenceAggregationBrief } from "../src/lib/schoolEvidenceAggregationBrief";

const brief = buildSchoolEvidenceAggregationBrief({
  schoolName: "周口职业技术学院",
  majorName: "计算机应用技术",
  jobName: "Java开发",
  items: [
    {
      kind: "major",
      title: "计算机应用技术专业介绍",
      url: "https://www.zkvtc.edu.cn/xgxy/major",
      detail: "学校官方源；专业设置页面显示计算机应用技术专业，核心课程包含 Java 程序设计。",
    },
    {
      kind: "report",
      title: "2024届就业质量报告",
      url: "https://www.zkvtc.edu.cn/info/report",
      detail: "学校官方源；2024届毕业去向落实率92.3%，升学率18.6%。",
    },
    {
      kind: "campus",
      title: "2025年春季双选会企业名单",
      url: "https://job.zkvtc.edu.cn/campus",
      detail: "学校官方源；双选会包含京东物流、牧原集团、建设银行，岗位含技术支持和运营。",
    },
    {
      kind: "salary",
      title: "营销号说 Java 高薪",
      url: "https://example.com/best-major-java",
      detail: "弱证据；营销软文说 Java 开发工资 15-30K，不能替代企业官网岗位或学校报告。",
    },
  ],
});

assert.equal(brief.status, "can-screen");
assert.equal(brief.missingSlots.length, 1);
assert.equal(brief.missingSlots[0], "岗位薪资");
assert.ok(brief.title.includes("周口职业技术学院"));
assert.ok(brief.confirmedLines.some((line) => line.includes("计算机应用技术专业介绍")));
assert.ok(brief.confirmedLines.some((line) => line.includes("2024届就业质量报告")));
assert.ok(brief.confirmedLines.some((line) => line.includes("2025年春季双选会企业名单")));
assert.ok(brief.weakLines.some((line) => line.includes("营销号说 Java 高薪")));
assert.ok(brief.nextActions.some((line) => line.includes("继续补岗位薪资")));
assert.ok(brief.nextActions.some((line) => line.includes("弱证据不能当结论")));
assert.ok(brief.copyText.includes("公开资料聚合简报"));
assert.ok(brief.copyText.includes("可采信证据"));
assert.ok(brief.copyText.includes("待复核线索"));
assert.ok(brief.copyText.includes("弱证据"));
assert.ok(brief.copyText.includes("缺口"));
assert.ok(brief.copyText.includes("下一步"));

const emptyBrief = buildSchoolEvidenceAggregationBrief({
  schoolName: "未收录学校",
  majorName: "",
  jobName: "",
  items: [],
});

assert.equal(emptyBrief.status, "not-ready");
assert.deepEqual(emptyBrief.missingSlots, ["专业存在", "就业报告", "到校企业", "岗位薪资"]);
assert.ok(emptyBrief.nextActions[0].includes("先打开学校官网"));

const mainSource = readFileSync("src/main.tsx", "utf8");
assert.ok(mainSource.includes("buildSchoolEvidenceAggregationBrief"), "school page should build an aggregation brief");
assert.ok(mainSource.includes("evidenceAggregationBrief"), "school page should pass the brief into the inbox");
assert.ok(mainSource.includes("公开资料聚合简报"), "inbox should render a user-facing aggregation brief");
assert.ok(mainSource.includes("复制聚合简报"), "aggregation brief should be copyable");
assert.ok(mainSource.includes("aggregationBrief.copyText"), "copy action should use the generated aggregation text");
