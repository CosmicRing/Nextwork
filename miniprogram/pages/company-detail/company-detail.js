const { getCompany } = require("../../utils/sample-data");

Page({
  data: {
    company: null,
  },

  onLoad(query) {
    this.setData({ company: getCompany(query.id) });
  },

  copyEntrance() {
    wx.setClipboardData({
      data: this.data.company.officialEntrance,
      success() {
        wx.showToast({ title: "官网入口已复制", icon: "success" });
      },
    });
  },
});
