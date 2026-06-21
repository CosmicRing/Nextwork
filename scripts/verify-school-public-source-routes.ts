import assert from "node:assert/strict";

import { buildSchoolPublicSourceRoutes } from "../src/lib/schoolPublicSourceRoutes";

const routes = buildSchoolPublicSourceRoutes({
  schoolName: "周口职业技术学院",
  majorName: "护理学",
  jobName: "护士",
});

assert.ok(routes.length >= 7, "ordinary schools should get a complete public-source route map");
assert.deepEqual(
  routes.slice(0, 3).map((route) => route.id),
  ["chsi-school-library", "school-admissions-major", "school-major-plan"],
  "the first routes should verify authority, admissions major, and major plan before salary",
);

for (const route of routes) {
  assert.ok(route.label.trim(), `route ${route.id} needs a label`);
  assert.ok(route.url.startsWith("https://"), `route ${route.id} should open an https entrance`);
  assert.ok(route.target.trim(), `route ${route.id} should state what the user is checking`);
  assert.ok(route.openHint.trim(), `route ${route.id} should explain how to use the entrance`);
  assert.ok(route.saveFields.length >= 2, `route ${route.id} should name evidence fields to save`);
}

const chsiSchool = routes.find((route) => route.id === "chsi-school-library");
assert.ok(chsiSchool, "route map should include the CHSI / 阳光高考院校库");
assert.equal(chsiSchool.authority, "教育部/学信网");
assert.equal(chsiSchool.trustLevel, "authority");
assert.match(chsiSchool.url, /gaokao\.chsi\.com\.cn\/sch/);
assert.ok(chsiSchool.saveFields.includes("官方网址"), "CHSI school route should ask users to save official website");

const chsiMajor = routes.find((route) => route.id === "chsi-major-library");
assert.ok(chsiMajor, "route map should include the CHSI / 阳光高考专业知识库");
assert.match(chsiMajor.url, /gaokao\.chsi\.com\.cn\/zyk\/zybk/);
assert.ok(chsiMajor.query.includes("护理学"), "major library route should carry the major name");

const admissions = routes.find((route) => route.id === "school-admissions-major");
assert.ok(admissions, "route map should include a school admissions route");
assert.equal(admissions.trustLevel, "official");
assert.ok(admissions.query.includes("周口职业技术学院"));
assert.ok(admissions.query.includes("护理学"));

const majorPlan = routes.find((route) => route.id === "school-major-plan");
assert.ok(majorPlan, "route map should include a major plan route");
assert.ok(majorPlan.query.includes("官网"), "major plan route should search for official-site language");
assert.ok(majorPlan.query.includes("学院"), "major plan route should also search college/department pages");
assert.ok(
  !majorPlan.query.includes("site:.edu.cn"),
  "major plan route should not be restricted to .edu.cn because ordinary-school official admissions pages can live on other official domains",
);

const salary = routes.find((route) => route.id === "job-salary-proxy");
assert.ok(salary, "route map should include a salary proxy route");
assert.equal(salary.trustLevel, "proxy");
assert.ok(salary.query.includes("护士"), "salary route should include the target job when provided");
assert.ok(
  salary.openHint.includes("不是学校官方结论"),
  "salary route should warn that salary is a proxy, not a school official conclusion",
);
