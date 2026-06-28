export type SchoolCareerDirectoryHealthStatus = "reachable" | "redirected" | "http-error" | "protected";

export type SchoolCareerDirectoryHealth = {
  schoolId: string;
  sourceUrl: string;
  status: SchoolCareerDirectoryHealthStatus;
  statusCode: number;
  finalUrl: string;
  checkedAt: string;
  note: string;
};

export const schoolCareerDirectoryHealthByUrl: Record<string, SchoolCareerDirectoryHealth> = {
  "http://career.tsinghua.edu.cn/": {
    schoolId: "tsinghua",
    sourceUrl: "http://career.tsinghua.edu.cn/",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://career.tsinghua.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到 HTTPS。",
  },
  "http://www.career.zju.edu.cn/jyxt/jyweb/webIndex.zf": {
    schoolId: "zju",
    sourceUrl: "http://www.career.zju.edu.cn/jyxt/jyweb/webIndex.zf",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://www.career.zju.edu.cn/jyxt/jyweb/webIndex.zf",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到 HTTPS。",
  },
  "http://jiuye.uestc.edu.cn/career/index.html": {
    schoolId: "uestc",
    sourceUrl: "http://jiuye.uestc.edu.cn/career/index.html",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://jiuye.uestc.edu.cn/career/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到新版 HTTPS 入口。",
  },
  "https://job.xidian.edu.cn/": {
    schoolId: "xidian",
    sourceUrl: "https://job.xidian.edu.cn/",
    status: "reachable",
    statusCode: 200,
    finalUrl: "https://job.xidian.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问。",
  },
  "https://scc.pku.edu.cn/home!recruitList.action?category=1": {
    schoolId: "peking",
    sourceUrl: "https://scc.pku.edu.cn/home!recruitList.action?category=1",
    status: "http-error",
    statusCode: 404,
    finalUrl: "https://scc.pku.edu.cn/home!recruitList.action?category=1",
    checkedAt: "2026-06-28",
    note: "目录中的旧招聘列表路径返回 404，需回到学校就业中心官网入口复核。",
  },
  "http://www.job.sjtu.edu.cn/": {
    schoolId: "sjtu",
    sourceUrl: "http://www.job.sjtu.edu.cn/",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://www.job.sjtu.edu.cn/career/index",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到 HTTPS 新入口。",
  },
  "https://career.fudan.edu.cn/": {
    schoolId: "fudan",
    sourceUrl: "https://career.fudan.edu.cn/",
    status: "reachable",
    statusCode: 200,
    finalUrl: "https://career.fudan.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问。",
  },
  "http://job.nju.edu.cn/#!/home": {
    schoolId: "nju",
    sourceUrl: "http://job.nju.edu.cn/#!/home",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://job.nju.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到 HTTPS 入口。",
  },
  "http://job.hust.edu.cn/": {
    schoolId: "hust",
    sourceUrl: "http://job.hust.edu.cn/",
    status: "reachable",
    statusCode: 200,
    finalUrl: "http://job.hust.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问；当前探测仍停留在 HTTP。",
  },
  "http://job.hit.edu.cn/": {
    schoolId: "hit",
    sourceUrl: "http://job.hit.edu.cn/",
    status: "redirected",
    statusCode: 200,
    finalUrl: "https://career.hit.edu.cn/zhxy-xszyfzpt/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问，并跳转到新版 HTTPS 入口。",
  },
  "http://career.buaa.edu.cn/homePageAction.dhtml": {
    schoolId: "buaa",
    sourceUrl: "http://career.buaa.edu.cn/homePageAction.dhtml",
    status: "http-error",
    statusCode: 404,
    finalUrl: "https://career.buaa.edu.cn/homePageAction.dhtml",
    checkedAt: "2026-06-28",
    note: "目录中的旧路径返回 404，需回到学校就业信息网根入口复核。",
  },
  "https://job.bupt.edu.cn/": {
    schoolId: "bupt",
    sourceUrl: "https://job.bupt.edu.cn/",
    status: "protected",
    statusCode: 412,
    finalUrl: "https://job.bupt.edu.cn/",
    checkedAt: "2026-06-28",
    note: "入口返回 412，可能存在访问防护或请求条件限制，需要浏览器人工复核。",
  },
  "https://tj91.tongji.edu.cn/": {
    schoolId: "tongji",
    sourceUrl: "https://tj91.tongji.edu.cn/",
    status: "reachable",
    statusCode: 200,
    finalUrl: "https://tj91.tongji.edu.cn/",
    checkedAt: "2026-06-28",
    note: "目录入口可访问。",
  },
};

export function getCareerDirectoryHealth(sourceUrl: string) {
  return schoolCareerDirectoryHealthByUrl[sourceUrl] ?? null;
}

export function getCareerDirectoryHealthLabel(status: SchoolCareerDirectoryHealthStatus) {
  if (status === "reachable") return "可访问";
  if (status === "redirected") return "可访问·跳转";
  if (status === "protected") return "防护拦截";
  return "待复核";
}

export const checkedSchoolCareerDirectoryCount = Object.keys(schoolCareerDirectoryHealthByUrl).length;
