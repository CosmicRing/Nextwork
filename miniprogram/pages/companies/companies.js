const { companies } = require("../../utils/sample-data");

const filters = ["全部", "中国", "海外"];
const industryFilters = ["全部行业", "互联网 / AI", "硬件 / 制造", "零售 / 供应链", "金融 / 咨询", "酒店 / 服务"];

const companyIndustryGroups = {
  bytedance: "互联网 / AI",
  tencent: "互联网 / AI",
  alibaba: "互联网 / AI",
  meituan: "互联网 / AI",
  baidu: "互联网 / AI",
  kuaishou: "互联网 / AI",
  bilibili: "互联网 / AI",
  pdd: "互联网 / AI",
  ant: "互联网 / AI",
  netease: "互联网 / AI",
  hoyoverse: "互联网 / AI",
  google: "互联网 / AI",
  microsoft: "互联网 / AI",
  huawei: "硬件 / 制造",
  xiaomi: "硬件 / 制造",
  midea: "硬件 / 制造",
  byd: "硬件 / 制造",
  apple: "硬件 / 制造",
  jd: "零售 / 供应链",
  amazon: "零售 / 供应链",
  ikea: "零售 / 供应链",
  unilever: "零售 / 供应链",
  loreal: "零售 / 供应链",
  jpmorgan: "金融 / 咨询",
  goldman: "金融 / 咨询",
  deloitte: "金融 / 咨询",
  pwc: "金融 / 咨询",
  marriott: "酒店 / 服务",
  hilton: "酒店 / 服务",
  hyatt: "酒店 / 服务",
  cathay: "酒店 / 服务",
};

const catalogCompanies = companies.map((company) => ({
  ...company,
  industryGroup: companyIndustryGroups[company.id] || "其他",
}));

function buildVisibleCompanies(regionFilter, industryFilter) {
  return catalogCompanies.filter((company) => {
    const regionMatched = regionFilter === "全部" || company.region === regionFilter;
    const industryMatched = industryFilter === "全部行业" || company.industryGroup === industryFilter;
    return regionMatched && industryMatched;
  });
}

function buildCompanySections(visibleCompanies) {
  return industryFilters
    .filter((industry) => industry !== "全部行业")
    .map((industry) => {
      const sectionCompanies = visibleCompanies.filter((company) => company.industryGroup === industry);
      return {
        title: industry,
        count: sectionCompanies.length,
        companies: sectionCompanies,
      };
    })
    .filter((section) => section.count > 0);
}

function buildDirectoryState(regionFilter, industryFilter) {
  const visibleCompanies = buildVisibleCompanies(regionFilter, industryFilter);
  return {
    visibleCompanies,
    companySections: buildCompanySections(visibleCompanies),
  };
}

const initialDirectoryState = buildDirectoryState("全部", "全部行业");

Page({
  data: {
    filters,
    industryFilters,
    activeFilter: "全部",
    activeIndustryFilter: "全部行业",
    companies: catalogCompanies,
    ...initialDirectoryState,
  },

  setFilter(event) {
    const filter = event.currentTarget.dataset.filter;
    this.setData({
      activeFilter: filter,
      ...buildDirectoryState(filter, this.data.activeIndustryFilter),
    });
  },

  setIndustryFilter(event) {
    const industry = event.currentTarget.dataset.industry;
    this.setData({
      activeIndustryFilter: industry,
      ...buildDirectoryState(this.data.activeFilter, industry),
    });
  },

  viewDetail(event) {
    wx.navigateTo({
      url: `/pages/company-detail/company-detail?id=${event.currentTarget.dataset.id}`,
    });
  },
});
