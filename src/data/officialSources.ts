export type OfficialCompanySource = {
  id: string;
  name: string;
  careerUrl: string;
  domain: string;
  focus: string[];
  adapterStatus: "live-adapter" | "official-link";
};

export const officialCompanySources: OfficialCompanySource[] = [
  {
    id: "bytedance",
    name: "字节跳动",
    careerUrl: "https://jobs.bytedance.com",
    domain: "jobs.bytedance.com",
    focus: ["AI", "算法", "后端", "产品", "数据"],
    adapterStatus: "live-adapter",
  },
  {
    id: "tencent",
    name: "腾讯",
    careerUrl: "https://careers.tencent.com",
    domain: "careers.tencent.com",
    focus: ["游戏", "云计算", "AI", "算法", "后端", "安全"],
    adapterStatus: "live-adapter",
  },
  {
    id: "alibaba",
    name: "阿里巴巴",
    careerUrl: "https://campus-talent.alibaba.com/campus/index",
    domain: "campus-talent.alibaba.com",
    focus: ["电商", "云计算", "AI", "数据", "产品", "大模型"],
    adapterStatus: "live-adapter",
  },
  {
    id: "meituan",
    name: "美团",
    careerUrl: "https://hr.meituan.com/jobs",
    domain: "hr.meituan.com",
    focus: ["本地生活", "算法", "后端", "产品", "运营"],
    adapterStatus: "live-adapter",
  },
  {
    id: "baidu",
    name: "百度",
    careerUrl: "https://talent.baidu.com",
    domain: "talent.baidu.com",
    focus: ["AI", "算法", "搜索", "自动驾驶", "大模型", "数据"],
    adapterStatus: "live-adapter",
  },
  {
    id: "jd",
    name: "京东",
    careerUrl: "https://zhaopin.jd.com/web/job/job_info_list/3",
    domain: "zhaopin.jd.com",
    focus: ["供应链", "零售科技", "物流", "算法", "AI", "后端", "数据"],
    adapterStatus: "live-adapter",
  },
  {
    id: "huawei",
    name: "华为",
    careerUrl: "https://career.huawei.com",
    domain: "career.huawei.com",
    focus: ["通信", "芯片", "AI", "云计算", "终端"],
    adapterStatus: "live-adapter",
  },
  {
    id: "xiaomi",
    name: "小米",
    careerUrl: "https://hr.xiaomi.com/",
    domain: "hr.xiaomi.com",
    focus: ["硬件", "IoT", "软件", "产品", "供应链"],
    adapterStatus: "live-adapter",
  },
  {
    id: "kuaishou",
    name: "快手",
    careerUrl: "https://zhaopin.kuaishou.cn/",
    domain: "zhaopin.kuaishou.cn",
    focus: ["短视频", "推荐", "广告", "电商", "运营"],
    adapterStatus: "live-adapter",
  },
  {
    id: "pdd",
    name: "拼多多",
    careerUrl: "https://careers.pddglobalhr.com/campus/grad",
    domain: "careers.pddglobalhr.com",
    focus: ["电商", "供应链", "算法", "产品", "管培"],
    adapterStatus: "live-adapter",
  },
  {
    id: "ant",
    name: "蚂蚁集团",
    careerUrl: "https://www.ant-intl.com/en/job-search",
    domain: "ant-intl.com",
    focus: ["金融科技", "安全", "风控", "后端", "产品"],
    adapterStatus: "official-link",
  },
  {
    id: "netease",
    name: "网易游戏",
    careerUrl: "https://www.neteasegames.com/careers/en/",
    domain: "neteasegames.com",
    focus: ["游戏", "引擎", "美术", "策划", "全球发行"],
    adapterStatus: "official-link",
  },
  {
    id: "bilibili",
    name: "哔哩哔哩",
    careerUrl: "https://jobs.bilibili.com",
    domain: "jobs.bilibili.com",
    focus: ["内容", "社区", "推荐", "前端", "产品"],
    adapterStatus: "live-adapter",
  },
  {
    id: "midea",
    name: "美的",
    careerUrl: "https://careers.midea.com/schoolOut/post",
    domain: "careers.midea.com",
    focus: ["智能制造", "机器人", "硬件", "供应链", "新能源"],
    adapterStatus: "live-adapter",
  },
  {
    id: "byd",
    name: "比亚迪",
    careerUrl: "https://www.bydglobal.com/cn/en/BYD_ENJoinByd/Society_mob.html",
    domain: "bydglobal.com",
    focus: ["新能源", "汽车", "电气", "自动化", "制造"],
    adapterStatus: "official-link",
  },
  {
    id: "hoyoverse",
    name: "HoYoverse",
    careerUrl: "https://www.hoyoverse.com/en-us/careers",
    domain: "hoyoverse.com",
    focus: ["游戏", "引擎", "AI", "美术", "全球发行"],
    adapterStatus: "official-link",
  },
  {
    id: "google",
    name: "Google",
    careerUrl: "https://www.google.com/about/careers/applications/",
    domain: "google.com/about/careers",
    focus: ["搜索", "云计算", "AI", "产品", "销售", "运营"],
    adapterStatus: "official-link",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    careerUrl: "https://careers.microsoft.com/",
    domain: "careers.microsoft.com",
    focus: ["云计算", "AI", "客户成功", "销售", "产品", "安全"],
    adapterStatus: "official-link",
  },
  {
    id: "amazon",
    name: "Amazon",
    careerUrl: "https://www.amazon.jobs/",
    domain: "amazon.jobs",
    focus: ["云计算", "供应链", "运营", "零售", "物流", "数据"],
    adapterStatus: "live-adapter",
  },
  {
    id: "apple",
    name: "Apple",
    careerUrl: "https://www.apple.com/careers/us/",
    domain: "apple.com/careers",
    focus: ["硬件", "零售", "供应链", "设计", "运营", "客户体验"],
    adapterStatus: "official-link",
  },
  {
    id: "jpmorgan",
    name: "JPMorganChase",
    careerUrl: "https://www.jpmorganchase.com/careers",
    domain: "jpmorganchase.com/careers",
    focus: ["金融", "投行", "风险管理", "财富管理", "运营", "技术"],
    adapterStatus: "official-link",
  },
  {
    id: "goldman",
    name: "Goldman Sachs",
    careerUrl: "https://www.goldmansachs.com/careers",
    domain: "goldmansachs.com/careers",
    focus: ["投行", "金融市场", "资产管理", "风险", "工程", "研究"],
    adapterStatus: "official-link",
  },
  {
    id: "deloitte",
    name: "Deloitte",
    careerUrl: "https://www.deloitte.com/cn/en/cn-careers.html",
    domain: "deloitte.com/cn/en/cn-careers",
    focus: ["咨询", "审计", "税务", "AI 转型", "风险", "人力资本"],
    adapterStatus: "official-link",
  },
  {
    id: "pwc",
    name: "PwC",
    careerUrl: "https://www.pwccn.com/en/careers.html",
    domain: "pwccn.com/en/careers",
    focus: ["审计", "咨询", "税务", "风险", "数字化", "校园招聘"],
    adapterStatus: "official-link",
  },
  {
    id: "marriott",
    name: "Marriott",
    careerUrl: "https://careers.marriott.com/",
    domain: "careers.marriott.com",
    focus: ["酒店管理", "餐饮", "房务", "销售", "收益管理", "客户体验"],
    adapterStatus: "official-link",
  },
  {
    id: "hilton",
    name: "Hilton",
    careerUrl: "https://hilton.taleo.net/careersection/hww_cs_internal_global/moresearch.ftl",
    domain: "hilton.taleo.net",
    focus: ["酒店管理", "前厅", "餐饮", "财务", "销售", "人力资源"],
    adapterStatus: "official-link",
  },
  {
    id: "hyatt",
    name: "Hyatt",
    careerUrl: "https://www.hyatt.com/world-of-care/en-US",
    domain: "hyatt.com/world-of-care",
    focus: ["酒店管理", "服务运营", "餐饮", "人力资源", "客户体验"],
    adapterStatus: "official-link",
  },
  {
    id: "cathay",
    name: "Cathay Pacific",
    careerUrl: "https://careers.cathaypacific.com/en",
    domain: "careers.cathaypacific.com",
    focus: ["航空服务", "客户体验", "运营", "工程", "数字化", "国际业务"],
    adapterStatus: "official-link",
  },
  {
    id: "ikea",
    name: "IKEA",
    careerUrl: "https://jobs.ikea.com/en",
    domain: "jobs.ikea.com",
    focus: ["零售", "供应链", "可持续", "设计", "客户体验", "商业运营"],
    adapterStatus: "live-adapter",
  },
  {
    id: "unilever",
    name: "Unilever",
    careerUrl: "https://careers.unilever.com/en",
    domain: "careers.unilever.com",
    focus: ["快消", "品牌营销", "供应链", "研发", "人力资源", "财务"],
    adapterStatus: "live-adapter",
  },
  {
    id: "loreal",
    name: "L'Oreal",
    careerUrl: "https://careers.loreal.com/",
    domain: "careers.loreal.com",
    focus: ["美妆", "品牌营销", "零售", "研发", "供应链", "数字化"],
    adapterStatus: "live-adapter",
  },
];

export function buildOfficialSearchCards(query: string, limit = 16) {
  const normalized = query.trim().toLowerCase();
  const queryTokens = normalized.split(/[\/\s,，、|]+/).filter((token) => token.length >= 2);
  return officialCompanySources
    .map((source) => {
      const sourceName = source.name.toLowerCase();
      const sourceDomain = source.domain.toLowerCase();
      const companyScore =
        normalized && (normalized.includes(sourceName) || queryTokens.some((token) => sourceName.includes(token) || sourceDomain.includes(token)))
          ? 12
          : 0;
      const focusScore = source.focus.filter((item) => normalized && normalized.includes(item.toLowerCase())).length;
      const score = companyScore + focusScore;
      return {
        ...source,
        score,
        searchHint: normalized ? `${source.name} 官网检索：${query}` : `${source.name} 官方招聘入口`,
      };
    })
    .sort((a, b) => b.score - a.score || Number(a.adapterStatus !== "live-adapter") - Number(b.adapterStatus !== "live-adapter"))
    .slice(0, limit);
}
