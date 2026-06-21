export const companyLogoAssets: Record<string, string> = {
  bytedance: "/company-logos/bytedance.svg",
  tencent: "/company-logos/tencent.png",
  alibaba: "/company-logos/alibaba.svg",
  meituan: "/company-logos/meituan.svg",
  baidu: "/company-logos/baidu.svg",
  jd: "/company-logos/jd.png",
  huawei: "/company-logos/huawei.svg",
  kuaishou: "/company-logos/kuaishou.svg",
  bilibili: "/company-logos/bilibili.svg",
  xiaomi: "/company-logos/xiaomi.svg",
  pdd: "/company-logos/pdd.png",
  midea: "/company-logos/midea.png",
  ant: "/company-logos/ant.png",
  netease: "/company-logos/netease.png",
  byd: "/company-logos/byd.png",
  hoyoverse: "/company-logos/hoyoverse.png",
  google: "/company-logos/google.svg",
  microsoft: "/company-logos/microsoft.png",
  amazon: "/company-logos/amazon.png",
  apple: "/company-logos/apple.svg",
  jpmorgan: "/company-logos/jpmorgan.png",
  goldman: "/company-logos/goldman.svg",
  deloitte: "/company-logos/deloitte.png",
  pwc: "/company-logos/pwc.png",
  marriott: "/company-logos/marriott.svg",
  hilton: "/company-logos/hilton.svg",
  hyatt: "/company-logos/hyatt.png",
  cathay: "/company-logos/cathay.png",
  ikea: "/company-logos/ikea.svg",
  unilever: "/company-logos/unilever.svg",
  loreal: "/company-logos/loreal.png",
};

const companyLogoDomains: Record<string, string> = {
  bytedance: "bytedance.com",
  tencent: "tencent.com",
  alibaba: "alibaba.com",
  meituan: "meituan.com",
  baidu: "baidu.com",
  jd: "jd.com",
  huawei: "huawei.com",
  xiaomi: "xiaomi.com",
  kuaishou: "kuaishou.com",
  pdd: "pinduoduo.com",
  ant: "ant-intl.com",
  netease: "neteasegames.com",
  bilibili: "bilibili.com",
  midea: "midea.com",
  byd: "byd.com",
  hoyoverse: "hoyoverse.com",
  google: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  apple: "apple.com",
  jpmorgan: "jpmorganchase.com",
  goldman: "goldmansachs.com",
  deloitte: "deloitte.com",
  pwc: "pwc.com",
  marriott: "marriott.com",
  hilton: "hilton.com",
  hyatt: "hyatt.com",
  cathay: "cathaypacific.com",
  ikea: "ikea.com",
  unilever: "unilever.com",
  loreal: "loreal.com",
};

const companyLogoText: Record<string, string> = {
  bytedance: "Byte",
  tencent: "腾讯",
  alibaba: "阿里",
  meituan: "美团",
  baidu: "百度",
  jd: "JD",
  huawei: "华为",
  kuaishou: "快手",
  bilibili: "B站",
  xiaomi: "MI",
  pdd: "PDD",
  midea: "美的",
  ant: "蚂蚁",
  netease: "网易",
  byd: "BYD",
  hoyoverse: "HoYo",
  google: "G",
  microsoft: "MS",
  amazon: "Amazon",
  apple: "Apple",
  jpmorgan: "JPM",
  goldman: "GS",
  deloitte: "D",
  pwc: "PwC",
  marriott: "M",
  hilton: "Hilton",
  hyatt: "Hyatt",
  cathay: "Cathay",
  ikea: "IKEA",
  unilever: "U",
  loreal: "L'Oreal",
};

export function getCompanyLogoSources(companyId: string, sourceDomain: string) {
  const localAsset = companyLogoAssets[companyId];
  const officialDomain = getCompanyLogoDomain(companyId, sourceDomain);
  return [
    ...(localAsset ? [localAsset] : []),
    `https://icons.duckduckgo.com/ip3/${officialDomain}.ico`,
    `https://www.google.com/s2/favicons?domain=${officialDomain}&sz=128`,
  ];
}

export function getCompanyLogoText(companyId: string, name: string) {
  return companyLogoText[companyId] ?? name.slice(0, 2);
}

function getCompanyLogoDomain(companyId: string, sourceDomain: string) {
  return companyLogoDomains[companyId] ?? sourceDomain.split("/")[0];
}
