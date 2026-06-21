const { radarRoles, findRole } = require("../../utils/sample-data");

function buildRadarRankedMajors(role) {
  return [...role.majors].sort((left, right) => {
    if (right.strength !== left.strength) return right.strength - left.strength;
    return left.ring - right.ring;
  });
}

function buildRadarReportText(role, rankedMajors) {
  return [
    "职业雷达报告",
    `岗位：${role.title}`,
    `薪资参考：${role.salary}`,
    `常见公司：${role.companies.join("、")}`,
    ...rankedMajors.map((major, index) =>
      `${index + 1}. ${major.name}｜关联强度 ${major.strength}｜第 ${major.ring} 圈`,
    ),
    "说明：薪资为岗位市场参考，不等于学校官方承诺；需要结合官网岗位和就业质量报告继续核验。",
  ].join("\n");
}

function buildRoleRadarState(role, query) {
  const radarRankedMajors = buildRadarRankedMajors(role);
  return {
    query,
    selectedRole: role,
    radarRankedMajors,
    radarReportText: buildRadarReportText(role, radarRankedMajors),
  };
}

Page({
  data: {
    radarRoles,
    ...buildRoleRadarState(radarRoles[0], ""),
  },

  onRoleInput(event) {
    const query = event.detail.value;
    this.setData(buildRoleRadarState(findRole(query), query));
  },

  selectRole(event) {
    const role = radarRoles.find((item) => item.id === event.currentTarget.dataset.id) || radarRoles[0];
    this.setData(buildRoleRadarState(role, role.title));
  },

  copyRadarReport() {
    wx.setClipboardData({
      data: this.data.radarReportText,
      success() {
        wx.showToast({ title: "雷达已复制", icon: "success" });
      },
    });
  },
});
