const schools = [
  {
    id: "ztbu",
    name: "郑州工商学院",
    city: "郑州",
    type: "民办应用型本科",
    summary: "普通学校优先样本：先看招生网、院部设置和就业信息网，再把会计、电商、计算机应用等专业反查到岗位薪资。",
    metrics: [
      { label: "公开入口", value: "已接入", note: "官网、招生网、院部设置、就业信息网" },
      { label: "专业资料", value: "官网核验", note: "先按学院/专业入口确认开设情况" },
      { label: "就业率", value: "待报告解析", note: "等待就业质量报告或就业信息网公开材料" },
      { label: "薪资状态", value: "岗位参考", note: "用企业官网岗位薪资反查，不当作学校承诺" },
    ],
    officialLinks: [
      { label: "学校官网", kind: "学校", url: "https://www.ztbu.edu.cn/" },
      { label: "招生网", kind: "招生", url: "https://zsb.ztbu.edu.cn/" },
      { label: "就业信息网", kind: "就业", url: "https://zzgsxy.goworkla.cn/" },
      { label: "院部设置", kind: "专业", url: "https://www.ztbu.edu.cn/html/828/" },
    ],
    recruitersByYear: [
      { year: 2025, companies: ["待接入就业信息网宣讲会/双选会日历"] },
      { year: 2024, companies: ["京东", "美的", "德勤", "本地会计师事务所"] },
    ],
    majors: [
      {
        id: "ztbu-accounting",
        name: "会计学",
        cluster: "财会 / 审计 / 税务",
        salary: "6-14K/月",
        employmentRate: "待就业报告解析",
        destinations: ["审计助理", "会计专员", "税务专员", "财务共享专员"],
        companies: ["Deloitte", "PwC", "JD", "Ant Group"],
      },
      {
        id: "ztbu-ecommerce",
        name: "电子商务",
        cluster: "电商 / 运营 / 供应链",
        salary: "6-16K/月",
        employmentRate: "待就业报告解析",
        destinations: ["电商运营", "直播运营", "供应链运营", "用户增长运营"],
        companies: ["JD", "Alibaba", "PDD", "Meituan"],
      },
      {
        id: "ztbu-cs",
        name: "计算机应用技术",
        cluster: "开发 / 运维 / 测试",
        salary: "7-18K/月",
        employmentRate: "待就业报告解析",
        destinations: ["初级开发工程师", "测试工程师", "运维工程师", "数据分析助理"],
        companies: ["Huawei", "Tencent", "Baidu", "Midea"],
      },
    ],
  },
  {
    id: "wtbu",
    name: "武汉工商学院",
    city: "武汉",
    type: "民办应用型本科",
    summary: "普通学校优先样本：用招生专业、就业信息网和企业官网岗位，把商科、物流、计算机方向做成可核验证据链。",
    metrics: [
      { label: "公开入口", value: "已接入", note: "学校官网、招生网、专业设置、就业信息网" },
      { label: "专业资料", value: "官网核验", note: "优先复制专业设置和学院介绍入口" },
      { label: "就业率", value: "待报告解析", note: "等待年度报告或就业质量公开材料" },
      { label: "薪资状态", value: "岗位参考", note: "用企业官网岗位薪资每日反查" },
    ],
    officialLinks: [
      { label: "学校官网", kind: "学校", url: "https://www.wtbu.edu.cn/" },
      { label: "招生网", kind: "招生", url: "https://goto.wtbu.edu.cn/" },
      { label: "专业设置", kind: "专业", url: "https://goto.wtbu.edu.cn/page/detail/FSBCMA/11455/45409" },
      { label: "就业信息网", kind: "就业", url: "https://wtbu.91wllm.cn/" },
    ],
    recruitersByYear: [
      { year: 2025, companies: ["待接入就业信息网招聘会/宣讲会日历"] },
      { year: 2024, companies: ["京东物流", "顺丰", "美团", "本地商贸企业"] },
    ],
    majors: [
      {
        id: "wtbu-logistics",
        name: "物流管理",
        cluster: "物流 / 供应链 / 仓配运营",
        salary: "6-15K/月",
        employmentRate: "待就业报告解析",
        destinations: ["物流运营", "供应链专员", "仓配运营", "采购专员"],
        companies: ["JD", "Amazon", "Meituan", "IKEA"],
      },
      {
        id: "wtbu-marketing",
        name: "市场营销",
        cluster: "销售 / 增长 / 品牌",
        salary: "6-18K/月",
        employmentRate: "待就业报告解析",
        destinations: ["市场运营", "销售管培生", "品牌助理", "用户增长运营"],
        companies: ["Unilever", "L'Oreal", "Meituan", "JD"],
      },
      {
        id: "wtbu-accounting",
        name: "会计学",
        cluster: "财会 / 审计 / 税务",
        salary: "6-14K/月",
        employmentRate: "待就业报告解析",
        destinations: ["会计专员", "审计助理", "税务专员", "财务分析助理"],
        companies: ["Deloitte", "PwC", "JD", "Ant Group"],
      },
    ],
  },
  {
    id: "cqytu",
    name: "重庆移通学院",
    city: "重庆",
    type: "民办应用型本科",
    summary: "普通学校优先样本：通信、软件、机械和电商方向用学校公开入口确认专业，再回到企业官网查岗位和薪资。",
    metrics: [
      { label: "公开入口", value: "已接入", note: "学校官网、招生网、专业介绍、就业信息网" },
      { label: "专业资料", value: "官网核验", note: "招生网专业介绍可作为首个专业证据" },
      { label: "就业率", value: "待报告解析", note: "等待就业质量报告或就业网公告解析" },
      { label: "薪资状态", value: "岗位参考", note: "岗位薪资只做市场代理" },
    ],
    officialLinks: [
      { label: "学校官网", kind: "学校", url: "https://www.cqytxy.edu.cn/" },
      { label: "招生网", kind: "招生", url: "https://www.cqytu.com/" },
      { label: "专业介绍", kind: "专业", url: "https://www.cqytu.com/zhuanye/" },
      { label: "就业信息网", kind: "就业", url: "https://cqyti.cqbys.com/" },
    ],
    recruitersByYear: [
      { year: 2025, companies: ["待接入就业信息网双选会/宣讲会日历"] },
      { year: 2024, companies: ["华为", "小米", "美的", "重庆本地制造企业"] },
    ],
    majors: [
      {
        id: "cqytu-communication",
        name: "通信工程",
        cluster: "通信 / 网络 / 云",
        salary: "8-20K/月",
        employmentRate: "待就业报告解析",
        destinations: ["通信工程师", "网络工程师", "售前解决方案", "云运维工程师"],
        companies: ["Huawei", "Tencent", "Microsoft", "Baidu"],
      },
      {
        id: "cqytu-mechanical",
        name: "机械设计制造及其自动化",
        cluster: "机械 / 工艺 / 智能制造",
        salary: "7-18K/月",
        employmentRate: "待就业报告解析",
        destinations: ["设备工程师", "工艺工程师", "制造工程师", "质量工程师"],
        companies: ["BYD", "Midea", "Xiaomi", "Huawei"],
      },
      {
        id: "cqytu-ecommerce",
        name: "电子商务",
        cluster: "电商 / 运营 / 供应链",
        salary: "6-16K/月",
        employmentRate: "待就业报告解析",
        destinations: ["电商运营", "跨境电商运营", "直播运营", "供应链运营"],
        companies: ["JD", "Alibaba", "PDD", "Amazon"],
      },
    ],
  },
  {
    id: "gcc",
    name: "广州商学院",
    city: "广州",
    type: "民办普通本科",
    summary: "普通学校优先样本：商科、酒店旅游、数字媒体和财会方向先看公开入口，再按企业岗位反查薪资。",
    metrics: [
      { label: "公开入口", value: "已接入", note: "学校官网、招生网、就业入口检索" },
      { label: "专业资料", value: "官网核验", note: "先核验专业是否开设和所属学院" },
      { label: "就业率", value: "待报告解析", note: "等待就业质量报告或信息公开材料" },
      { label: "薪资状态", value: "岗位参考", note: "珠三角岗位薪资需每日回企业官网核验" },
    ],
    officialLinks: [
      { label: "学校官网", kind: "学校", url: "https://www.gcc.edu.cn/" },
      { label: "招生网", kind: "招生", url: "https://zsb.gcc.edu.cn/" },
      { label: "就业入口检索", kind: "就业", url: "https://cn.bing.com/search?q=%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2+%E5%B0%B1%E4%B8%9A%E4%BF%A1%E6%81%AF%E7%BD%91+%E5%AE%A3%E8%AE%B2%E4%BC%9A" },
      { label: "专业资料检索", kind: "专业", url: "https://cn.bing.com/search?q=%E5%B9%BF%E5%B7%9E%E5%95%86%E5%AD%A6%E9%99%A2+%E4%B8%93%E4%B8%9A%E4%BB%8B%E7%BB%8D+%E6%8B%9B%E7%94%9F" },
    ],
    recruitersByYear: [
      { year: 2025, companies: ["待接入就业网宣讲会/双选会日历"] },
      { year: 2024, companies: ["Deloitte", "PwC", "Marriott", "L'Oreal", "本地跨境电商企业"] },
    ],
    majors: [
      {
        id: "gcc-hospitality",
        name: "酒店管理",
        cluster: "酒店 / 旅游 / 服务运营",
        salary: "5-15K/月",
        employmentRate: "待就业报告解析",
        destinations: ["酒店运营管培生", "收益管理助理", "会展执行", "客户体验专员"],
        companies: ["Marriott", "Hilton", "Hyatt", "Cathay Pacific"],
      },
      {
        id: "gcc-accounting",
        name: "会计学",
        cluster: "财会 / 审计 / 税务",
        salary: "6-14K/月",
        employmentRate: "待就业报告解析",
        destinations: ["会计专员", "审计助理", "税务专员", "财务共享专员"],
        companies: ["Deloitte", "PwC", "JD", "Ant Group"],
      },
      {
        id: "gcc-digital-media",
        name: "数字媒体技术",
        cluster: "内容产品 / 交互 / 运营",
        salary: "7-18K/月",
        employmentRate: "待就业报告解析",
        destinations: ["内容运营", "互动开发", "产品设计助理", "新媒体运营"],
        companies: ["ByteDance", "Bilibili", "Tencent", "NetEase Games"],
      },
    ],
  },
  {
    id: "xidian",
    name: "西安电子科技大学",
    city: "西安",
    type: "电子信息强校",
    summary: "已接入官方就业质量报告入口，适合先看电子信息、计算机、网络安全、人工智能方向。",
    metrics: [
      { label: "毕业去向落实率", value: "97.04%", note: "2024 届校级口径，本科 95.86%" },
      { label: "本科主要去向", value: "升学 54.79%", note: "单位就业 40.62%" },
      { label: "重点单位就业", value: "52.49%", note: "签约重点单位口径" },
      { label: "薪资状态", value: "市场估算", note: "学校报告未公开专业薪资" },
    ],
    officialLinks: [
      { label: "招生信息网", kind: "招生", url: "https://zsb.xidian.edu.cn/" },
      { label: "就业信息网", kind: "就业", url: "https://job.xidian.edu.cn/" },
      { label: "2024 就业报告", kind: "报告", url: "https://job.xidian.edu.cn/" },
    ],
    recruitersByYear: [
      { year: 2024, companies: ["华为", "腾讯", "阿里巴巴", "百度", "美团", "京东", "小米", "比亚迪"] },
      { year: 2025, companies: ["待接入就业中心宣讲会日历"] },
    ],
    majors: [
      {
        id: "xidian-ai",
        name: "人工智能",
        cluster: "AI / 计算机",
        salary: "18-35K/月",
        employmentRate: "本科总体 95.86%",
        destinations: ["AI 算法工程师", "机器学习工程师", "推荐算法工程师", "数据科学家"],
        companies: ["ByteDance", "Huawei", "Tencent", "Baidu"],
      },
      {
        id: "xidian-security",
        name: "网络空间安全",
        cluster: "安全 / 云 / 风控",
        salary: "14-30K/月",
        employmentRate: "本科总体 95.86%",
        destinations: ["安全工程师", "云安全工程师", "网络工程师", "风控工程师"],
        companies: ["Tencent", "Huawei", "Alibaba", "Baidu"],
      },
      {
        id: "xidian-ee",
        name: "电子信息工程",
        cluster: "电子 / 通信 / 芯片",
        salary: "13-28K/月",
        employmentRate: "本科总体 95.86%",
        destinations: ["通信研发工程师", "芯片验证工程师", "嵌入式工程师", "硬件工程师"],
        companies: ["Huawei", "Xiaomi", "BYD", "Midea"],
      },
    ],
  },
  {
    id: "zju",
    name: "浙江大学",
    city: "杭州",
    type: "综合强校",
    summary: "杭州互联网和智能制造机会密集，适合比较软件、AI、数据、产品和机器人方向。",
    metrics: [
      { label: "就业入口", value: "已定位", note: "就业服务平台与信息公开栏目" },
      { label: "区域机会", value: "杭州", note: "互联网、电商、智能制造密集" },
      { label: "薪资状态", value: "市场估算", note: "专业级薪资需继续解析报告" },
      { label: "校招入口", value: "待日历解析", note: "后续接宣讲会/双选会" },
    ],
    officialLinks: [
      { label: "本科招生网", kind: "招生", url: "https://zdzsc.zju.edu.cn/" },
      { label: "专业目录", kind: "专业", url: "https://zdzsc.zju.edu.cn/3288/list.htm" },
      { label: "就业服务平台", kind: "就业", url: "https://www.career.zju.edu.cn/" },
    ],
    recruitersByYear: [
      { year: 2024, companies: ["阿里巴巴", "ByteDance", "网易游戏", "华为", "美团", "京东"] },
      { year: 2026, companies: ["待接入就业中心宣讲会日历"] },
    ],
    majors: [
      {
        id: "zju-se",
        name: "软件工程",
        cluster: "软件 / 产品工程",
        salary: "18-35K/月",
        employmentRate: "待报告解析",
        destinations: ["后端研发工程师", "前端研发工程师", "产品经理", "数据工程师"],
        companies: ["Alibaba", "ByteDance", "Tencent", "Meituan"],
      },
      {
        id: "zju-robotics",
        name: "自动化",
        cluster: "机器人 / 智能制造",
        salary: "12-25K/月",
        employmentRate: "待报告解析",
        destinations: ["机器人工程师", "控制系统工程师", "自动驾驶工程师", "嵌入式工程师"],
        companies: ["Huawei", "Xiaomi", "BYD", "Midea"],
      },
      {
        id: "zju-product",
        name: "信息管理与信息系统",
        cluster: "数据 / 产品 / 业务",
        salary: "12-24K/月",
        employmentRate: "待报告解析",
        destinations: ["产品经理", "商业分析师", "数据分析师", "增长运营"],
        companies: ["Alibaba", "JD", "PDD", "Amazon"],
      },
    ],
  },
  {
    id: "bupt",
    name: "北京邮电大学",
    city: "北京",
    type: "通信与互联网",
    summary: "通信、计算机、网络空间安全和数字媒体方向适合直接联动互联网、云计算、运营商与硬件企业。",
    metrics: [
      { label: "专业入口", value: "已定位", note: "本科招生网专业介绍" },
      { label: "就业入口", value: "已定位", note: "就业信息网" },
      { label: "薪资状态", value: "市场估算", note: "待接入年度报告" },
      { label: "校招入口", value: "待日历解析", note: "后续补宣讲会企业名单" },
    ],
    officialLinks: [
      { label: "本科招生网", kind: "招生", url: "https://zsb.bupt.edu.cn/" },
      { label: "专业介绍", kind: "专业", url: "https://zsb.bupt.edu.cn/zyjs.htm" },
      { label: "就业信息网", kind: "就业", url: "https://job.bupt.edu.cn/" },
    ],
    recruitersByYear: [
      { year: 2025, companies: ["待接入就业中心宣讲会日历"] },
      { year: 2024, companies: ["华为", "腾讯", "百度", "京东", "Microsoft", "Amazon"] },
    ],
    majors: [
      {
        id: "bupt-comm",
        name: "通信工程",
        cluster: "通信 / 网络 / 云",
        salary: "13-28K/月",
        employmentRate: "待报告解析",
        destinations: ["通信研发工程师", "云网络工程师", "网络工程师", "售前解决方案"],
        companies: ["Huawei", "Tencent", "Microsoft", "Amazon"],
      },
      {
        id: "bupt-cs",
        name: "计算机科学与技术",
        cluster: "软件 / AI / 云",
        salary: "18-35K/月",
        employmentRate: "待报告解析",
        destinations: ["后端研发工程师", "云工程师", "AI 应用工程师", "安全工程师"],
        companies: ["Tencent", "Baidu", "JD", "Microsoft"],
      },
      {
        id: "bupt-media",
        name: "数字媒体技术",
        cluster: "内容产品 / 交互 / 游戏",
        salary: "9-20K/月",
        employmentRate: "待报告解析",
        destinations: ["产品设计师", "互动开发", "游戏策划", "内容产品"],
        companies: ["Tencent", "NetEase", "HoYoverse", "ByteDance"],
      },
    ],
  },
];

const companies = [
  {
    id: "bytedance",
    name: "ByteDance",
    cnName: "字节跳动",
    region: "中国",
    industry: "内容平台 / AI",
    logo: "/assets/company-logos/bytedance.svg",
    salary: "18-45K/月",
    officialEntrance: "https://jobs.bytedance.com/",
    roles: ["AI 算法工程师", "后端研发", "产品经理", "内容安全"],
    majors: ["计算机", "人工智能", "数据科学", "数字媒体"],
    note: "适合用作品、算法项目、产品拆解证明能力。",
  },
  {
    id: "tencent",
    name: "Tencent",
    cnName: "腾讯",
    region: "中国",
    industry: "社交 / 游戏 / 云",
    logo: "/assets/company-logos/tencent.png",
    salary: "16-40K/月",
    officialEntrance: "https://careers.tencent.com/",
    roles: ["游戏技术", "云计算", "安全工程师", "产品运营"],
    majors: ["计算机", "软件工程", "网络安全", "数字媒体"],
    note: "技术、游戏内容、安全和云计算岗位并重。",
  },
  {
    id: "alibaba",
    name: "Alibaba",
    cnName: "阿里巴巴",
    region: "中国",
    industry: "电商 / 云 / AI",
    logo: "/assets/company-logos/alibaba.svg",
    salary: "16-38K/月",
    officialEntrance: "https://campus.alibaba.com/",
    roles: ["云计算", "推荐算法", "电商产品", "数据智能"],
    majors: ["计算机", "人工智能", "数据科学", "信息管理"],
    note: "适合电商、推荐系统、云原生和商业分析方向。",
  },
  {
    id: "huawei",
    name: "Huawei",
    cnName: "华为",
    region: "中国",
    industry: "通信 / 终端 / 云",
    logo: "/assets/company-logos/huawei.svg",
    salary: "14-35K/月",
    officialEntrance: "https://career.huawei.com/",
    roles: ["通信研发", "芯片验证", "云与 AI", "供应链"],
    majors: ["电子信息", "通信工程", "计算机", "微电子"],
    note: "硬科技方向强，适合通信、芯片、系统软件、云计算。",
  },
  {
    id: "baidu",
    name: "Baidu",
    cnName: "百度",
    region: "中国",
    industry: "AI / 搜索 / 自动驾驶",
    logo: "/assets/company-logos/baidu.svg",
    salary: "16-42K/月",
    officialEntrance: "https://talent.baidu.com/",
    roles: ["大模型算法", "自动驾驶", "搜索推荐", "产品经理"],
    majors: ["人工智能", "自动化", "计算机", "数据科学"],
    note: "AI、自动驾驶和搜索推荐方向岗位密度高。",
  },
  {
    id: "jd",
    name: "JD",
    cnName: "京东",
    region: "中国",
    industry: "零售 / 物流 / 供应链",
    logo: "/assets/company-logos/jd.png",
    salary: "12-28K/月",
    officialEntrance: "https://zhaopin.jd.com/",
    roles: ["供应链技术", "物流算法", "数据平台", "运营管培"],
    majors: ["工业工程", "物流管理", "数据科学", "计算机"],
    note: "供应链、零售科技和物流优化场景清晰。",
  },
  {
    id: "midea",
    name: "Midea",
    cnName: "美的",
    region: "中国",
    industry: "智能制造 / 家电",
    logo: "/assets/company-logos/midea.png",
    salary: "10-26K/月",
    officialEntrance: "https://careers.midea.com/",
    roles: ["智能制造", "嵌入式", "机器人", "供应链"],
    majors: ["自动化", "电气工程", "电子信息", "机械电子"],
    note: "更适合硬件、自动化、供应链和制造工程方向。",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    cnName: "微软",
    region: "海外",
    industry: "云 / 软件 / 企业服务",
    logo: "/assets/company-logos/microsoft.png",
    salary: "20-55K/月",
    officialEntrance: "https://careers.microsoft.com/",
    roles: ["Cloud Solution", "Security", "Customer Success", "Product"],
    majors: ["计算机", "网络安全", "信息管理", "市场营销"],
    note: "海外企业更看重英文表达、项目经历和跨文化协作。",
  },
  {
    id: "amazon",
    name: "Amazon",
    cnName: "亚马逊",
    region: "海外",
    industry: "云 / 零售 / 供应链",
    logo: "/assets/company-logos/amazon.png",
    salary: "16-48K/月",
    officialEntrance: "https://www.amazon.jobs/",
    roles: ["AWS", "Operations", "Supply Chain", "Program Manager"],
    majors: ["物流工程", "工业工程", "电子商务", "计算机"],
    note: "供应链、运营、AWS 和项目管理适配度高。",
  },
  {
    id: "jpmorgan",
    name: "JPMorganChase",
    cnName: "摩根大通",
    region: "海外",
    industry: "金融 / 投行 / 科技",
    logo: "/assets/company-logos/jpmorgan.png",
    salary: "18-55K/月",
    officialEntrance: "https://careers.jpmorgan.com/",
    roles: ["Analyst", "Risk", "Wealth", "Technology"],
    majors: ["金融", "会计", "统计", "计算机"],
    note: "金融岗位分层明显，英文、建模和实习很关键。",
  },
  {
    id: "deloitte",
    name: "Deloitte",
    cnName: "德勤",
    region: "海外",
    industry: "咨询 / 审计 / 税务",
    logo: "/assets/company-logos/deloitte.png",
    salary: "9-28K/月",
    officialEntrance: "https://www2.deloitte.com/cn/zh/careers.html",
    roles: ["Consulting", "Audit", "Tax", "Risk Advisory"],
    majors: ["会计", "审计", "工商管理", "信息管理"],
    note: "非计算机专业也能进入，但案例、表达和英文要早练。",
  },
  {
    id: "marriott",
    name: "Marriott",
    cnName: "万豪",
    region: "海外",
    industry: "酒店 / 旅游 / 服务",
    logo: "/assets/company-logos/marriott.svg",
    salary: "5-16K/月",
    officialEntrance: "https://careers.marriott.com/",
    roles: ["Hotel Operations", "Revenue", "Sales", "Guest Experience"],
    majors: ["酒店管理", "旅游管理", "英语", "市场营销"],
    note: "重现场服务、英文沟通和轮岗适应能力。",
  },
  {
    id: "meituan",
    name: "Meituan",
    cnName: "美团",
    region: "中国",
    industry: "本地生活 / 到店 / 配送",
    logo: "/assets/company-logos/meituan.svg",
    salary: "14-36K/月",
    officialEntrance: "https://hr.meituan.com/jobs",
    roles: ["算法工程师", "后端研发", "产品运营", "商业分析"],
    majors: ["计算机", "统计学", "信息管理", "市场营销"],
    note: "适合把本地生活、配送、交易和运营场景作为项目案例。",
  },
  {
    id: "kuaishou",
    name: "Kuaishou",
    cnName: "快手",
    region: "中国",
    industry: "短视频 / 推荐 / 电商",
    logo: "/assets/company-logos/kuaishou.svg",
    salary: "15-40K/月",
    officialEntrance: "https://zhaopin.kuaishou.cn/",
    roles: ["推荐算法", "广告技术", "电商运营", "内容安全"],
    majors: ["计算机", "人工智能", "电子商务", "数字媒体"],
    note: "推荐、广告和内容生态岗位密集，适合准备数据和产品项目。",
  },
  {
    id: "bilibili",
    name: "Bilibili",
    cnName: "哔哩哔哩",
    region: "中国",
    industry: "内容社区 / 游戏 / 商业化",
    logo: "/assets/company-logos/bilibili.svg",
    salary: "12-32K/月",
    officialEntrance: "https://jobs.bilibili.com/",
    roles: ["内容产品", "社区运营", "前端研发", "游戏发行"],
    majors: ["数字媒体", "计算机", "动画", "市场营销"],
    note: "适合内容、社区、互动产品和年轻用户增长方向。",
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    cnName: "小米",
    region: "中国",
    industry: "硬件 / IoT / 供应链",
    logo: "/assets/company-logos/xiaomi.svg",
    salary: "12-30K/月",
    officialEntrance: "https://hr.xiaomi.com/",
    roles: ["嵌入式开发", "测试工程师", "产品经理", "供应链"],
    majors: ["电子信息", "自动化", "计算机", "工业设计"],
    note: "硬件、系统软件、IoT 和消费电子产品方向适配度高。",
  },
  {
    id: "pdd",
    name: "PDD",
    cnName: "拼多多",
    region: "中国",
    industry: "电商 / 供应链 / 增长",
    logo: "/assets/company-logos/pdd.png",
    salary: "18-45K/月",
    officialEntrance: "https://careers.pddglobalhr.com/campus/grad",
    roles: ["电商运营", "算法工程师", "管培生", "商业分析"],
    majors: ["电子商务", "计算机", "统计学", "物流管理"],
    note: "岗位节奏快，适合用数据分析、增长和供应链项目证明能力。",
  },
  {
    id: "ant",
    name: "Ant Group",
    cnName: "蚂蚁集团",
    region: "中国",
    industry: "金融科技 / 风控 / 支付",
    logo: "/assets/company-logos/ant.png",
    salary: "16-42K/月",
    officialEntrance: "https://www.ant-intl.com/en/job-search",
    roles: ["风控算法", "后端研发", "安全工程师", "产品经理"],
    majors: ["金融工程", "计算机", "网络安全", "统计学"],
    note: "金融科技重合规、风控、安全和交易系统能力。",
  },
  {
    id: "netease",
    name: "NetEase Games",
    cnName: "网易游戏",
    region: "中国",
    industry: "游戏 / 引擎 / 发行",
    logo: "/assets/company-logos/netease.png",
    salary: "13-35K/月",
    officialEntrance: "https://www.neteasegames.com/careers/en/",
    roles: ["游戏研发", "游戏策划", "美术技术", "全球发行"],
    majors: ["计算机", "数字媒体", "动画", "软件工程"],
    note: "技术、美术、策划和发行差异大，作品集和项目很关键。",
  },
  {
    id: "byd",
    name: "BYD",
    cnName: "比亚迪",
    region: "中国",
    industry: "新能源 / 汽车 / 制造",
    logo: "/assets/company-logos/byd.png",
    salary: "9-26K/月",
    officialEntrance: "https://www.bydglobal.com/cn/en/BYD_ENJoinByd/Society_mob.html",
    roles: ["电池研发", "车辆工程", "电气工程", "工艺工程"],
    majors: ["车辆工程", "电气工程", "材料科学", "自动化"],
    note: "新能源链条长，非计算机专业也有研发、工艺和质量岗位。",
  },
  {
    id: "hoyoverse",
    name: "HoYoverse",
    cnName: "米哈游",
    region: "中国",
    industry: "游戏 / 全球发行 / AIGC",
    logo: "/assets/company-logos/hoyoverse.png",
    salary: "15-40K/月",
    officialEntrance: "https://www.hoyoverse.com/en-us/careers",
    roles: ["游戏客户端", "图形引擎", "剧情策划", "海外运营"],
    majors: ["计算机", "数字媒体", "动画", "英语"],
    note: "游戏研发、内容和全球发行都看作品集与用户理解。",
  },
  {
    id: "google",
    name: "Google",
    cnName: "谷歌",
    region: "海外",
    industry: "搜索 / 云 / AI",
    logo: "/assets/company-logos/google.svg",
    salary: "25-70K/月",
    officialEntrance: "https://www.google.com/about/careers/applications/",
    roles: ["Software Engineer", "Cloud Sales", "Data Scientist", "Product"],
    majors: ["计算机", "数据科学", "数学", "市场营销"],
    note: "海外岗位更看英文、算法基础、项目影响和跨团队协作。",
  },
  {
    id: "apple",
    name: "Apple",
    cnName: "苹果",
    region: "海外",
    industry: "硬件 / 零售 / 供应链",
    logo: "/assets/company-logos/apple.svg",
    salary: "18-55K/月",
    officialEntrance: "https://www.apple.com/careers/us/",
    roles: ["Hardware", "Retail", "Supply Chain", "Product Design"],
    majors: ["电子信息", "工业设计", "供应链管理", "市场营销"],
    note: "硬件、设计、零售运营和供应链岗位差异明显。",
  },
  {
    id: "goldman",
    name: "Goldman Sachs",
    cnName: "高盛",
    region: "海外",
    industry: "投行 / 资产管理 / 工程",
    logo: "/assets/company-logos/goldman.svg",
    salary: "20-60K/月",
    officialEntrance: "https://www.goldmansachs.com/careers",
    roles: ["Investment Banking", "Engineering", "Risk", "Research"],
    majors: ["金融", "金融工程", "统计学", "计算机"],
    note: "金融和工程岗位都重实习、英文、建模和抗压表达。",
  },
  {
    id: "pwc",
    name: "PwC",
    cnName: "普华永道",
    region: "海外",
    industry: "审计 / 咨询 / 税务",
    logo: "/assets/company-logos/pwc.png",
    salary: "8-26K/月",
    officialEntrance: "https://www.pwccn.com/en/careers.html",
    roles: ["Audit", "Tax", "Consulting", "Risk Assurance"],
    majors: ["会计", "审计", "工商管理", "信息管理"],
    note: "适合财会、商科和信息系统方向，证书和实习会加分。",
  },
  {
    id: "hilton",
    name: "Hilton",
    cnName: "希尔顿",
    region: "海外",
    industry: "酒店 / 餐饮 / 销售",
    logo: "/assets/company-logos/hilton.svg",
    salary: "5-15K/月",
    officialEntrance: "https://hilton.taleo.net/careersection/hww_cs_internal_global/moresearch.ftl",
    roles: ["Front Office", "F&B", "Sales", "Finance"],
    majors: ["酒店管理", "旅游管理", "英语", "财务管理"],
    note: "服务行业重实习、轮岗、英文沟通和现场问题处理。",
  },
  {
    id: "hyatt",
    name: "Hyatt",
    cnName: "凯悦",
    region: "海外",
    industry: "酒店 / 服务运营",
    logo: "/assets/company-logos/hyatt.png",
    salary: "5-15K/月",
    officialEntrance: "https://www.hyatt.com/world-of-care/en-US",
    roles: ["Hotel Operations", "HR", "F&B", "Guest Experience"],
    majors: ["酒店管理", "旅游管理", "人力资源", "英语"],
    note: "适合服务运营和管培方向，现场实践经历比单纯课程更有说服力。",
  },
  {
    id: "cathay",
    name: "Cathay Pacific",
    cnName: "国泰航空",
    region: "海外",
    industry: "航空 / 客户体验 / 运营",
    logo: "/assets/company-logos/cathay.png",
    salary: "7-22K/月",
    officialEntrance: "https://careers.cathaypacific.com/en",
    roles: ["Cabin Crew", "Digital", "Operations", "Customer Experience"],
    majors: ["英语", "旅游管理", "交通运输", "信息管理"],
    note: "航旅岗位看语言、服务意识、排班适应和跨文化沟通。",
  },
  {
    id: "ikea",
    name: "IKEA",
    cnName: "宜家",
    region: "海外",
    industry: "零售 / 供应链 / 可持续",
    logo: "/assets/company-logos/ikea.svg",
    salary: "6-20K/月",
    officialEntrance: "https://jobs.ikea.com/en",
    roles: ["Retail", "Supply Chain", "Design", "Sustainability"],
    majors: ["市场营销", "物流管理", "工业设计", "工商管理"],
    note: "零售、设计、供应链和可持续方向都有入口，不只看技术岗。",
  },
  {
    id: "unilever",
    name: "Unilever",
    cnName: "联合利华",
    region: "海外",
    industry: "快消 / 品牌 / 供应链",
    logo: "/assets/company-logos/unilever.svg",
    salary: "8-25K/月",
    officialEntrance: "https://careers.unilever.com/en",
    roles: ["Brand Marketing", "Supply Chain", "R&D", "Finance"],
    majors: ["市场营销", "食品科学", "物流管理", "财务管理"],
    note: "快消管培、品牌、供应链和研发都适合非计算机专业关注。",
  },
  {
    id: "loreal",
    name: "L'Oreal",
    cnName: "欧莱雅",
    region: "海外",
    industry: "美妆 / 零售 / 数字化",
    logo: "/assets/company-logos/loreal.png",
    salary: "8-24K/月",
    officialEntrance: "https://careers.loreal.com/",
    roles: ["Brand", "Retail", "Digital", "Supply Chain"],
    majors: ["市场营销", "电子商务", "化妆品科学", "供应链管理"],
    note: "品牌、零售、电商和供应链岗位更看商业敏感度与表达。",
  },
  {
    id: "yili",
    name: "Yili",
    cnName: "伊利",
    region: "中国",
    industry: "食品 / 乳业 / 供应链",
    logo: "/assets/company-logos/yili.svg",
    salary: "6-18K/月",
    officialEntrance: "https://career.yili.com/",
    roles: ["食品质检", "供应链", "生产管理", "市场运营"],
    majors: ["食品科学", "食品质量与安全", "物流管理", "市场营销"],
    note: "适合食品、质检、供应链和生产管理方向核验岗位。",
  },
  {
    id: "mengniu",
    name: "Mengniu",
    cnName: "蒙牛",
    region: "中国",
    industry: "食品 / 乳业 / 快消",
    logo: "/assets/company-logos/mengniu.svg",
    salary: "6-18K/月",
    officialEntrance: "https://career.mengniu.com.cn/",
    roles: ["质量管理", "生产技术", "品牌营销", "供应链"],
    majors: ["食品质量与安全", "生物工程", "市场营销", "物流管理"],
    note: "农业食品类学生可用来核验质检、生产和供应链岗位。",
  },
  {
    id: "cofco",
    name: "COFCO",
    cnName: "中粮",
    region: "中国",
    industry: "粮油食品 / 农产品 / 供应链",
    logo: "/assets/company-logos/cofco.svg",
    salary: "6-18K/月",
    officialEntrance: "https://www.cofco.com/cn/AboutCOFCO/JoinUs/",
    roles: ["农产品运营", "质量管理", "供应链", "管培生"],
    majors: ["食品科学", "农学", "供应链管理", "市场营销"],
    note: "适合把农业、食品和供应链方向落到央企岗位入口核验。",
  },
  {
    id: "cscec",
    name: "CSCEC",
    cnName: "中国建筑",
    region: "中国",
    industry: "建筑工程 / 基建 / 数字建造",
    logo: "/assets/company-logos/cscec.svg",
    salary: "7-18K/月",
    officialEntrance: "https://zhaopin.cscec.com/",
    roles: ["工程管理", "BIM", "造价", "施工技术"],
    majors: ["土木工程", "工程造价", "工程管理", "建筑工程技术"],
    note: "建筑土木方向要用项目岗位、城市和证书要求交叉核验。",
  },
  {
    id: "cccc",
    name: "CCCC",
    cnName: "中国交建",
    region: "中国",
    industry: "交通基建 / 市政 / 工程管理",
    logo: "/assets/company-logos/cccc.svg",
    salary: "7-18K/月",
    officialEntrance: "https://www.ccccltd.cn/rlzy/",
    roles: ["施工管理", "测绘", "造价", "项目管理"],
    majors: ["土木工程", "测绘工程", "工程管理", "道路桥梁工程"],
    note: "适合查交通基建、施工管理和测绘岗位的官方入口。",
  },
  {
    id: "crcc",
    name: "CRCC",
    cnName: "中国铁建",
    region: "中国",
    industry: "铁路基建 / 工程施工 / 项目管理",
    logo: "/assets/company-logos/crcc.svg",
    salary: "7-18K/月",
    officialEntrance: "https://www.crcc.cn/col/col327/index.html",
    roles: ["工程技术", "BIM", "项目管理", "造价"],
    majors: ["土木工程", "工程造价", "铁道工程", "工程管理"],
    note: "铁路和建筑工程类学生可用来核验项目制岗位和城市流向。",
  },
];

const radarRoles = [
  {
    id: "ai-engineer",
    title: "AI 算法工程师",
    salary: "18-45K/月",
    companies: ["ByteDance", "Baidu", "Tencent", "Alibaba", "Microsoft"],
    majors: [
      { name: "人工智能", strength: 96, ring: 1, pointClass: "ring-1 slot-0" },
      { name: "计算机科学与技术", strength: 92, ring: 1, pointClass: "ring-1 slot-1" },
      { name: "数据科学与大数据技术", strength: 84, ring: 2, pointClass: "ring-2 slot-2" },
      { name: "自动化", strength: 74, ring: 3, pointClass: "ring-3 slot-3" },
      { name: "统计学", strength: 68, ring: 4, pointClass: "ring-4 slot-4" },
    ],
  },
  {
    id: "security-engineer",
    title: "安全工程师",
    salary: "14-35K/月",
    companies: ["Tencent", "Huawei", "Alibaba", "Microsoft"],
    majors: [
      { name: "网络空间安全", strength: 96, ring: 1, pointClass: "ring-1 slot-0" },
      { name: "信息安全", strength: 91, ring: 1, pointClass: "ring-1 slot-1" },
      { name: "计算机科学与技术", strength: 82, ring: 2, pointClass: "ring-2 slot-2" },
      { name: "网络工程", strength: 78, ring: 3, pointClass: "ring-3 slot-3" },
      { name: "数学", strength: 62, ring: 4, pointClass: "ring-4 slot-4" },
    ],
  },
  {
    id: "product-manager",
    title: "产品经理",
    salary: "12-32K/月",
    companies: ["Alibaba", "JD", "ByteDance", "Tencent", "Amazon"],
    majors: [
      { name: "信息管理与信息系统", strength: 88, ring: 1, pointClass: "ring-1 slot-0" },
      { name: "计算机科学与技术", strength: 82, ring: 2, pointClass: "ring-2 slot-1" },
      { name: "电子商务", strength: 78, ring: 3, pointClass: "ring-3 slot-2" },
      { name: "市场营销", strength: 70, ring: 4, pointClass: "ring-4 slot-3" },
      { name: "心理学", strength: 64, ring: 5, pointClass: "ring-5 slot-4" },
    ],
  },
  {
    id: "ib-analyst",
    title: "投行分析师",
    salary: "18-55K/月",
    companies: ["JPMorganChase", "Goldman Sachs", "Deloitte", "PwC"],
    majors: [
      { name: "金融学", strength: 94, ring: 1, pointClass: "ring-1 slot-0" },
      { name: "金融工程", strength: 90, ring: 1, pointClass: "ring-1 slot-1" },
      { name: "会计学", strength: 84, ring: 2, pointClass: "ring-2 slot-2" },
      { name: "统计学", strength: 76, ring: 3, pointClass: "ring-3 slot-3" },
      { name: "计算机科学与技术", strength: 64, ring: 5, pointClass: "ring-5 slot-4" },
    ],
  },
  {
    id: "hotel-operations",
    title: "酒店运营管培生",
    salary: "5-16K/月",
    companies: ["Marriott", "Hilton", "Hyatt", "Cathay Pacific"],
    majors: [
      { name: "酒店管理", strength: 96, ring: 1, pointClass: "ring-1 slot-0" },
      { name: "旅游管理", strength: 88, ring: 1, pointClass: "ring-1 slot-1" },
      { name: "英语", strength: 76, ring: 3, pointClass: "ring-3 slot-2" },
      { name: "市场营销", strength: 68, ring: 4, pointClass: "ring-4 slot-3" },
      { name: "人力资源管理", strength: 60, ring: 5, pointClass: "ring-5 slot-4" },
    ],
  },
];

const ordinarySchoolRescue = {
  targetSchoolName: "目标学校",
  targetMajorName: "目标专业",
  title: "未收录学校也能查",
  subtitle: "先用公开入口确认学校、专业、就业报告、到校企业和岗位薪资，不等平台全量收录。",
  examples: ["郑州工商学院", "武汉工商学院", "广州商学院", "重庆移通学院"],
  entryGroups: [
    {
      label: "学校主体",
      source: "教育部阳光高考 / 学校官网",
      url: "https://gaokao.chsi.com.cn/sch/",
      trustLevel: "官方",
      saveFields: ["学校全称", "主管部门", "办学层次", "官网域名"],
      action: "确认学校是真实办学主体，再复制官网域名继续查。",
    },
    {
      label: "专业资料",
      source: "招生网 / 教务处 / 学院页",
      url: "https://cn.bing.com/search?q=学校名+专业介绍+招生网+培养方案",
      trustLevel: "官网优先",
      saveFields: ["专业名称", "所属学院", "核心课程", "实践基地"],
      action: "保存专业是否存在、培养方向和课程，不只看宣传口号。",
    },
    {
      label: "就业报告",
      source: "就业质量报告 / 信息公开",
      url: "https://cn.bing.com/search?q=学校名+就业质量报告+2024+pdf",
      trustLevel: "报告优先",
      saveFields: ["毕业去向落实率", "升学率", "行业去向", "重点单位"],
      action: "优先找近三年 PDF；没有专业粒度就先记学院或校级口径。",
    },
    {
      label: "到校招聘",
      source: "就业信息网 / 宣讲会 / 双选会",
      url: "https://cn.bing.com/search?q=学校名+就业信息网+宣讲会+双选会",
      trustLevel: "活动证据",
      saveFields: ["年份", "企业名", "岗位", "面向专业"],
      action: "记录每年真正到校的企业，不用只听招生口径。",
    },
    {
      label: "岗位薪资",
      source: "企业官网招聘 / 公开岗位",
      url: "https://cn.bing.com/search?q=专业名+岗位+校招+薪资+官网",
      trustLevel: "市场参考",
      saveFields: ["岗位名", "城市", "薪资范围", "学历要求"],
      action: "薪资为岗位市场参考，不等于学校官方承诺；每天重新查最新岗位。",
    },
  ],
  evidenceTasks: [
    { title: "验学校", check: "能否找到教育部或学校官网入口", output: "学校全称、官网域名、办学层次" },
    { title: "验专业", check: "招生网或学院页是否有该专业", output: "专业名称、学院、课程和实践方向" },
    { title: "抓报告", check: "近三年就业质量报告是否公开", output: "就业率、升学率、行业和单位口径" },
    { title: "抓企业", check: "就业网是否有宣讲会或双选会记录", output: "年份、企业、岗位、面向专业" },
    { title: "补薪资", check: "企业官网岗位是否有城市和薪资", output: "岗位薪资范围和更新时间" },
  ],
};

const ordinaryMajorPresets = [
  {
    id: "nursing",
    label: "护理",
    majorName: "护理学",
    roleHint: "护士 / 医养服务 / 健康管理",
    salaryKeyword: "护士 校招 薪资 医院 官网",
  },
  {
    id: "accounting",
    label: "财会",
    majorName: "会计学",
    roleHint: "会计 / 审计 / 财务共享",
    salaryKeyword: "会计 校招 薪资 审计 财务",
  },
  {
    id: "manufacturing",
    label: "机械",
    majorName: "机械设计制造及其自动化",
    roleHint: "设备工程师 / 工艺 / 智能制造",
    salaryKeyword: "机械 工艺 设备工程师 校招 薪资",
  },
  {
    id: "ecommerce",
    label: "电商",
    majorName: "电子商务",
    roleHint: "运营 / 供应链 / 电商产品",
    salaryKeyword: "电子商务 运营 校招 薪资",
  },
  {
    id: "hospitality",
    label: "酒店旅游",
    majorName: "酒店管理",
    roleHint: "管培生 / 收益管理 / 服务运营",
    salaryKeyword: "酒店管理 管培生 校招 薪资",
  },
  {
    id: "cs-applied",
    label: "计算机应用",
    majorName: "计算机应用技术",
    roleHint: "开发 / 运维 / 测试 / 数据",
    salaryKeyword: "计算机应用 开发 运维 测试 校招 薪资",
  },
];

ordinarySchoolRescue.copyText = [
  "普通学校公开入口包",
  ...ordinarySchoolRescue.entryGroups.map((entry) => `${entry.label}：${entry.source}｜${entry.url}｜保存：${entry.saveFields.join("、")}`),
  "核验顺序：验学校 -> 验专业 -> 抓就业报告 -> 抓到校企业 -> 补岗位薪资",
  "薪资为岗位市场参考，不等于学校官方承诺；展示时必须标注来源和更新时间。",
].join("\n");

ordinarySchoolRescue.packetLines = ordinarySchoolRescue.copyText.split("\n");

function buildSearchUrl(query) {
  return `https://cn.bing.com/search?q=${encodeURIComponent(query)}`;
}

function buildOrdinarySchoolTypeStrategy(schoolName) {
  const normalized = (schoolName || "").trim();
  if (/医|护理|药|卫生|健康|康复|口腔/.test(normalized)) {
    return {
      id: "medical-health",
      label: "医学 / 健康类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先找实习医院、实训基地、执业资格证要求和就业质量报告里的医疗卫生去向。",
      reason: "医药护理类专业强依赖实习单位、资格证和地域医疗资源，不能只看专业名字。",
      searchFocus: ["实习医院", "资格证", "规培/专升本", "医疗卫生去向"],
      warnings: ["留意是否需要资格证或升学", "区分合同制、劳务派遣和事业单位编制", "薪资要按城市和医院等级拆开看"],
    };
  }

  if (/农业|农林|林业|园林|园艺|畜牧|兽医|食品|粮食|水产|茶|生态|乡村/.test(normalized)) {
    return {
      id: "agriculture-food",
      label: "农业 / 食品类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实训基地、地方产业带和校企合作，再反查乡村振兴、食品检验、农产品运营岗位。",
      reason: "农业食品类普通院校更依赖地方产业和实训基地，公开信息要从学校入口和本地企业岗位一起拼。",
      searchFocus: ["实训基地", "乡村振兴", "食品检验", "农产品运营", "地方农业龙头"],
      warnings: ["农业食品岗位有季节和地区差异", "校企合作要核验年份和真实岗位", "薪资要按企业类型和城市拆开看"],
    };
  }

  if (/建筑|土木|城建|建设|工程造价|工程管理|BIM|测绘|城乡规划|给排水|市政|造价/.test(normalized)) {
    return {
      id: "architecture-civil",
      label: "建筑 / 土木类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实训软件、证书路径和就业网，再反查 BIM、造价、施工管理岗位。",
      reason: "建筑土木方向要区分设计、施工、造价、甲方和项目资料岗，平均薪资不能混在一起看。",
      searchFocus: ["BIM", "造价", "施工管理", "工程资料", "证书要求"],
      warnings: ["工地岗位、设计院和甲方岗位要分开", "项目制岗位要保存发布日期", "证书要求必须看岗位原文"],
    };
  }

  if (/政法|司法|警官|公安|法律|法学|公共管理|社会工作|民政/.test(normalized)) {
    return {
      id: "law-public-service",
      label: "政法 / 公共服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实习基地和就业质量报告，再分开看招录、法律服务、社工和企业法务岗位。",
      reason: "政法公共服务路径里考编、合同制、律所、企业法务和社工机构差异很大，需要按岗位族核验。",
      searchFocus: ["招录", "法律服务", "法务助理", "社工机构", "就业质量报告"],
      warnings: ["编制岗位和合同岗位必须分开", "招录公告不等于学校就业承诺", "薪资要标明机构类型和城市"],
    };
  }

  if (/体育|运动|体能|健身|休闲体育|康养/.test(normalized)) {
    return {
      id: "sports-health",
      label: "体育 / 健康服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实践基地和证书路径，再反查健身教练、运动康复、赛事运营岗位。",
      reason: "体育健康方向高度依赖证书、实习场馆、城市消费力和个人技能，不能只用学校层次判断。",
      searchFocus: ["健身教练", "运动康复", "赛事运营", "康养", "体育培训"],
      warnings: ["证书和实习时长要核验", "底薪提成制要分开看", "赛事和培训岗位有淡旺季"],
    };
  }

  if (/职业|技术|专科|高等专科|应用|技师/.test(normalized)) {
    return {
      id: "vocational-applied",
      label: "高职 / 应用技术类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查就业网双选会、订单班、校企合作单位，再反查企业岗位和城市薪资。",
      reason: "应用型院校的信息优势通常在到校招聘和校企合作，公开就业报告可能不够细。",
      searchFocus: ["双选会", "订单班", "校企合作", "岗位薪资"],
      warnings: ["专升本通道要单独核验", "订单班要看真实企业和岗位", "不要把实习补贴当毕业薪资"],
    };
  }

  if (/工商|财经|商贸|经济|管理|财|会计|金融/.test(normalized)) {
    return {
      id: "finance-business",
      label: "财经 / 商贸类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先找专业目录和学院页，再看电商运营、财会、销售管培、供应链等岗位去向。",
      reason: "商贸财经类专业横跨岗位很多，必须把课程方向映射到具体岗位族。",
      searchFocus: ["专业目录", "电商运营", "财会岗位", "销售/管培", "供应链"],
      warnings: ["核验实训平台是否真实对接企业", "区分底薪、绩效和提成", "不要只看热门专业名称"],
    };
  }

  if (/理工|工程|机电|电子|信息|通信|移通|网络|软件/.test(normalized)) {
    return {
      id: "engineering-it",
      label: "理工 / 信息技术类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业实验室、课程栈、就业网 IT/制造企业，再对照岗位技能要求。",
      reason: "技术类专业要看课程和项目能否对应岗位技能，不只看学校层次。",
      searchFocus: ["课程栈", "实验室", "软件/测试", "制造工程", "校招技能"],
      warnings: ["警惕课程过旧", "薪资要区分研发、实施、运维和销售技术支持", "项目经历比泛泛就业率更关键"],
    };
  }

  if (/传媒|艺术|影视|新闻|文化|数字媒体|动画/.test(normalized)) {
    return {
      id: "media-creative",
      label: "传媒 / 艺术设计类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先看作品集要求、实习基地、毕业展和到校招聘，再查新媒体/设计岗位薪资。",
      reason: "创意类去向高度依赖作品集和实习渠道，平均薪资容易被少数头部岗位拉高。",
      searchFocus: ["作品集", "实习基地", "新媒体运营", "设计岗位", "城市机会"],
      warnings: ["作品集质量要比宣传排名更重要", "区分全职、外包和项目制收入", "核验城市岗位密度"],
    };
  }

  if (/交通|铁道|铁路|航空|航运|旅游|酒店/.test(normalized)) {
    return {
      id: "transport-service",
      label: "交通 / 现代服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先找定向招聘、行业合作单位、实习安排和岗位体检/证书要求。",
      reason: "交通服务类专业经常有行业准入和定向招聘，适合先查真实企业入口。",
      searchFocus: ["定向招聘", "行业证书", "实习安排", "服务岗位", "城市流向"],
      warnings: ["核验岗位是否有体检或证书门槛", "区分一线服务、运营和管理岗", "关注班制与工作地点"],
    };
  }

  if (/师范|幼儿|教育/.test(normalized)) {
    return {
      id: "education-normal",
      label: "师范 / 教育类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查教师资格证、实习学校、考编去向和教育机构招聘，再看城市薪资。",
      reason: "教育类路径分考编、民办学校和教培机构，稳定性与薪资结构差异很大。",
      searchFocus: ["教师资格证", "实习学校", "考编去向", "民办学校", "教培岗位"],
      warnings: ["就业率不能替代考编率", "薪资要区分编制、合同制和机构课时费", "关注地区学段需求"],
    };
  }

  return {
    id: "general-local",
    label: "普通本科 / 待识别院校",
    confidenceLabel: "通用路径",
    firstMove: "先核验学校主体和官网域名，再按专业、就业报告、到校招聘、岗位薪资逐级补证据。",
    reason: "没有命中明确学校类型时，先用公开入口建立可信证据链，避免被零散宣传误导。",
    searchFocus: ["学校官网", "专业介绍", "就业质量报告", "到校招聘", "岗位薪资"],
    warnings: ["所有数据都要保存来源和日期", "就业率要看统计口径", "薪资必须用岗位市场数据交叉验证"],
  };
}

function inferTypeStrategyEvidenceSlot(focus) {
  if (/薪资|运营|财会|岗位|销售|管培|供应链|软件|测试|制造|服务|教培|民办|食品检验|农产品|BIM|造价|施工|法务|法律服务|健身|运动康复|赛事/.test(focus)) {
    return "岗位薪资";
  }
  if (/就业|双选会|订单班|校企|实习|招聘|定向/.test(focus)) {
    return "到校招聘";
  }
  if (/报告|去向|考编|升学/.test(focus)) {
    return "就业报告";
  }
  return "专业资料";
}

function buildTypeStrategySearchHint(evidenceSlot) {
  if (evidenceSlot === "岗位薪资") return "校招 岗位 薪资 官网";
  if (evidenceSlot === "到校招聘") return "就业网 双选会 宣讲会 校企合作";
  if (evidenceSlot === "就业报告") return "就业质量报告 毕业去向 信息公开";
  return "招生网 专业介绍 培养方案 学院";
}

function buildTypeStrategyActions(typeStrategy, schoolName, majorName) {
  return typeStrategy.searchFocus.slice(0, 4).map((focus, index) => {
    const evidenceSlot = inferTypeStrategyEvidenceSlot(focus);
    const query = `${schoolName} ${majorName} ${focus} ${buildTypeStrategySearchHint(evidenceSlot)}`;
    return {
      id: `${typeStrategy.id}-${index + 1}`,
      label: focus,
      evidenceSlot,
      query,
      url: buildSearchUrl(query),
      action: `复制这个检索式，优先保存${evidenceSlot}证据；回到证据箱粘贴来源、日期和关键片段。`,
    };
  });
}

const salaryDirectionTemplates = [
  {
    id: "nursing-care",
    typeIds: ["medical-health"],
    majorPattern: /护理|临床|医学|药|康复|口腔|健康/,
    title: "护士 / 医养服务 / 健康管理",
    salary: "5-13K/月",
    companies: ["公立医院", "民营医院", "医养机构", "体检中心"],
    reason: "医学健康类普通学校先看实习医院和资格证，再用本地医院/医养岗位校准薪资。",
  },
  {
    id: "ecommerce-operations",
    typeIds: ["finance-business", "vocational-applied"],
    majorPattern: /电子商务|电商|运营|直播|供应链/,
    title: "电商运营 / 供应链运营",
    salary: "6-16K/月",
    companies: ["JD", "Alibaba", "PDD", "Meituan"],
    reason: "电商方向要把专业课、实训平台和企业岗位拆开看，薪资按运营/供应链岗位核验。",
  },
  {
    id: "accounting-audit",
    typeIds: ["finance-business"],
    majorPattern: /会计|财务|审计|税务|金融|财经/,
    title: "会计 / 审计 / 财务共享",
    salary: "6-14K/月",
    companies: ["Deloitte", "PwC", "JD", "Ant Group"],
    reason: "财经商贸类院校要同时核验事务所、企业财务和财务共享岗位。",
  },
  {
    id: "manufacturing-engineer",
    typeIds: ["engineering-it", "vocational-applied"],
    majorPattern: /机械|机电|制造|自动化|车辆|电气/,
    title: "设备工程师 / 工艺 / 智能制造",
    salary: "7-18K/月",
    companies: ["BYD", "Midea", "Xiaomi", "Huawei"],
    reason: "应用型理工专业要用制造企业官网岗位反查技能、城市和薪资。",
  },
  {
    id: "software-test-dev",
    typeIds: ["engineering-it", "vocational-applied"],
    majorPattern: /计算机|软件|网络|信息|通信|数据|人工智能/,
    title: "开发 / 测试 / 运维 / 数据",
    salary: "7-18K/月",
    companies: ["Huawei", "Tencent", "Baidu", "Midea"],
    reason: "普通学校计算机方向先看课程栈和项目，再按初级开发、测试、运维分开核验薪资。",
  },
  {
    id: "hotel-service",
    typeIds: ["transport-service", "vocational-applied"],
    majorPattern: /酒店|旅游|航空|交通|乘务|文旅/,
    title: "酒店运营管培生 / 服务运营",
    salary: "5-16K/月",
    companies: ["Marriott", "Hilton", "Hyatt", "Cathay Pacific"],
    reason: "服务类方向要看实习单位、班制和城市，不能只看平均薪资。",
  },
  {
    id: "media-operations",
    typeIds: ["media-creative"],
    majorPattern: /数字媒体|传媒|艺术|设计|动画|新闻|影视/,
    title: "内容运营 / 新媒体 / 设计助理",
    salary: "7-18K/月",
    companies: ["ByteDance", "Bilibili", "Tencent", "NetEase Games"],
    reason: "传媒艺术类方向先看作品集和实习，再用内容/设计岗位核验真实薪资。",
  },
  {
    id: "education-teacher",
    typeIds: ["education-normal"],
    majorPattern: /师范|教育|学前|英语|汉语言/,
    title: "教师 / 教务运营 / 教培顾问",
    salary: "5-14K/月",
    companies: ["公办学校", "民办学校", "教育机构", "托育机构"],
    reason: "教育类路径要区分编制、合同制和机构课时费，薪资不能混在一起看。",
  },
  {
    id: "food-quality-agri",
    typeIds: ["agriculture-food", "vocational-applied"],
    majorPattern: /农业|农学|食品|园艺|畜牧|兽医|林业|水产|乡村|粮食/,
    title: "食品检验 / 农产品运营 / 现代农业技术",
    salary: "5-12K/月",
    companies: ["Yili", "Mengniu", "COFCO", "本地农业龙头"],
    reason: "农业食品方向先看实训基地和地方产业，再用食品质检、生产管理和农产品运营岗位核验薪资。",
  },
  {
    id: "civil-bim-cost",
    typeIds: ["architecture-civil", "engineering-it", "vocational-applied"],
    majorPattern: /建筑|土木|工程造价|工程管理|BIM|测绘|城乡规划|给排水|道路桥梁/,
    title: "BIM / 工程造价 / 项目资料员",
    salary: "6-15K/月",
    companies: ["CSCEC", "CCCC", "CRCC", "本地设计院"],
    reason: "建筑土木方向要把 BIM、造价、施工管理和资料岗分开，用项目岗位原文校准薪资。",
  },
  {
    id: "legal-public-service",
    typeIds: ["law-public-service"],
    majorPattern: /法律|法学|司法|公安|警务|公共管理|社会工作|民政/,
    title: "法务助理 / 法律服务 / 公共服务",
    salary: "5-13K/月",
    companies: ["律所", "企业法务", "政务服务机构", "社工机构"],
    reason: "政法公共服务方向要区分招录、律所、企业法务和社会服务机构，分别核验薪资和稳定性。",
  },
  {
    id: "sports-rehab-fitness",
    typeIds: ["sports-health", "medical-health"],
    majorPattern: /体育|运动|康复|健身|体能|休闲体育|赛事/,
    title: "运动康复 / 健身教练 / 赛事运营",
    salary: "5-14K/月",
    companies: ["健身连锁", "康复机构", "赛事公司", "体育培训机构"],
    reason: "体育健康方向要看证书、实践基地、底薪提成结构和城市消费力。",
  },
  {
    id: "general-salary-check",
    typeIds: ["general-local"],
    majorPattern: /.*/,
    title: "岗位薪资核验 / 城市对比",
    salary: "5-15K/月",
    companies: ["企业官网", "就业信息网", "国家大学生就业服务平台", "本地招聘会"],
    reason: "未识别学校类型时，先用专业名和城市拆出 3 个岗位，再逐个核验官网薪资。",
  },
];

function scoreSalaryDirectionTemplate(template, typeStrategy, majorName) {
  if (template.id === "general-salary-check") {
    return template.typeIds.includes(typeStrategy.id) ? 35 : 5;
  }

  let score = 0;
  if (template.majorPattern.test(majorName)) score += 80;
  if (template.typeIds.includes(typeStrategy.id)) score += 30;
  return score;
}

function findCompanyEntranceByName(companyName) {
  return companies.find(
    (company) =>
      company.name === companyName ||
      company.cnName === companyName ||
      companyName.includes(company.name) ||
      companyName.includes(company.cnName),
  );
}

function buildCompanyEntrances(companyNames) {
  return companyNames
    .map((companyName) => findCompanyEntranceByName(companyName))
    .filter(Boolean)
    .map((company) => ({
      id: company.id,
      name: company.name,
      cnName: company.cnName,
      region: company.region,
      salary: company.salary,
      officialEntrance: company.officialEntrance,
      logo: company.logo,
      note: company.note,
    }));
}

function getSchoolCityByName(schoolName) {
  const matchedSchool = schools.find((school) => school.name === schoolName);
  return matchedSchool ? matchedSchool.city : "";
}

function inferLocalIndustryLabel(directionTitle, majorName) {
  const text = `${directionTitle} ${majorName}`;
  if (/农业|农学|食品|园艺|畜牧|兽医|农产品|乡村|粮食/.test(text)) return "农业/食品企业";
  if (/建筑|土木|工程|BIM|造价|施工|测绘|设计院/.test(text)) return "建筑/工程企业";
  if (/法律|法务|司法|公共服务|社工|政务/.test(text)) return "法律/公共服务机构";
  if (/体育|运动|康复|健身|赛事|体能/.test(text)) return "体育/健康服务机构";
  if (/电子商务|电商|运营|供应链|商贸|物流|销售/.test(text)) return "电商/商贸企业";
  if (/会计|审计|财务|税务|金融/.test(text)) return "财会/事务所";
  if (/护理|护士|医院|健康|医养/.test(text)) return "医院/医养机构";
  if (/机械|制造|工艺|设备|自动化/.test(text)) return "制造/装备企业";
  if (/开发|测试|运维|数据|计算机|软件/.test(text)) return "软件/数字化岗位";
  if (/酒店|旅游|服务|航空/.test(text)) return "酒店/文旅服务企业";
  if (/媒体|内容|设计|新媒体|传媒/.test(text)) return "内容/设计服务企业";
  if (/教师|教育|教务|教培/.test(text)) return "学校/教育机构";
  return "岗位/产业带检索";
}

function buildLocalOpportunityChannels(schoolName, majorName, directionTitle, cityHint) {
  const city = (cityHint || "").trim() || getSchoolCityByName(schoolName);
  const cityLabel = city || "本地";
  const industryLabel = inferLocalIndustryLabel(directionTitle, majorName);
  const localLabel = city ? `${city}本地${industryLabel}` : "本地岗位/产业带检索";
  const localQuery = `${cityLabel} ${majorName} ${directionTitle} 招聘 薪资 校招`;
  const schoolJobQuery = `${schoolName} 就业信息网 ${majorName} ${directionTitle} 宣讲会 双选会`;
  const ncssKeyword = `${cityLabel} ${majorName} ${directionTitle}`;
  return [
    {
      id: "local-employer-search",
      label: localLabel,
      source: "本地企业/产业带",
      query: localQuery,
      url: buildSearchUrl(localQuery),
      evidenceSlot: "岗位薪资",
      action: "找本地企业岗位原文，保存城市、薪资范围、学历要求和发布日期。",
    },
    {
      id: "school-job-board",
      label: "学校就业网本方向岗位",
      source: "学校就业网",
      query: schoolJobQuery,
      url: buildSearchUrl(schoolJobQuery),
      evidenceSlot: "到校招聘",
      action: "找宣讲会、双选会、招聘会和真实到校企业，保存企业名和日期。",
    },
    {
      id: "ncss-local",
      label: "国家平台本地岗位",
      source: "国家大学生就业服务平台",
      query: ncssKeyword,
      url: `https://www.ncss.cn/student/jobs/index.html?keyword=${encodeURIComponent(ncssKeyword)}`,
      evidenceSlot: "到校招聘",
      action: "用国家平台交叉验证岗位是否面向应届生，保存岗位和更新时间。",
    },
  ];
}

function buildCityEvidenceActions(schoolName, majorName, cityName, salaryDirections) {
  const cityLabel = cityName || "目标城市";
  const primaryDirection = salaryDirections[0] || null;
  const primaryDirectionTitle = primaryDirection ? primaryDirection.title : "岗位方向";
  const industryLabel = inferLocalIndustryLabel(primaryDirectionTitle, majorName);
  const localSalaryQuery = `${cityLabel} ${majorName} ${primaryDirectionTitle} 招聘 薪资 应届 官网`;
  const schoolCareerQuery = `${schoolName} 就业信息网 ${majorName} 宣讲会 双选会 招聘会 ${cityLabel}`;
  const reportQuery = `${schoolName} ${majorName} 就业质量报告 毕业去向 就业率 2025 2024 pdf`;
  const nationalJobsKeyword = `${cityLabel} ${majorName} ${primaryDirectionTitle} 应届`;

  return [
    {
      id: "city-salary-posts",
      label: `${cityLabel}本地${industryLabel}岗位薪资`,
      source: "本地企业官网 / 岗位原文",
      evidenceSlot: "岗位薪资",
      query: localSalaryQuery,
      url: buildSearchUrl(localSalaryQuery),
      saveFields: ["公司名称", "城市", "薪资范围", "学历要求", "发布日期"],
      action: "先抓真实岗位原文，不用平均薪资替代；优先保存带城市、薪资范围和发布日期的页面。",
    },
    {
      id: "school-career-events",
      label: "学校就业网到校企业",
      source: "学校就业网 / 就业信息网",
      evidenceSlot: "到校招聘",
      query: schoolCareerQuery,
      url: buildSearchUrl(schoolCareerQuery),
      saveFields: ["企业名称", "招聘形式", "日期", "岗位方向", "学校页面链接"],
      action: "确认这些企业是否真的进过学校，重点看宣讲会、双选会、招聘会和校企合作页面。",
    },
    {
      id: "official-employment-report",
      label: "就业质量报告专业去向",
      source: "学校信息公开 / 就业质量报告",
      evidenceSlot: "就业报告",
      query: reportQuery,
      url: buildSearchUrl(reportQuery),
      saveFields: ["报告年份", "就业率", "升学率", "行业去向", "统计口径"],
      action: "只引用学校公开报告或信息公开页面，必须保留年份和统计口径，避免被宣传口径误导。",
    },
    {
      id: "national-student-jobs",
      label: "国家平台应届岗位交叉验证",
      source: "国家大学生就业服务平台",
      evidenceSlot: "到校招聘",
      query: nationalJobsKeyword,
      url: `https://www.ncss.cn/student/jobs/index.html?keyword=${encodeURIComponent(nationalJobsKeyword)}`,
      saveFields: ["岗位名称", "城市", "企业名称", "学历要求", "更新时间"],
      action: "用国家平台交叉验证岗位是否面向应届生，再和企业官网或学校就业网互相印证。",
    },
  ];
}

function clampSignalScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildCareerSignalDigest(schoolName, majorName, cityName, typeStrategy, salaryDirections, cityEvidenceActions) {
  const primaryDirection = salaryDirections[0] || {
    title: "岗位薪资核验",
    salary: "待核验",
    reason: "先把专业拆成岗位方向，再用企业官网岗位和学校就业网交叉验证。",
    companies: [],
    companyEntrances: [],
    localOpportunityChannels: [],
  };
  const officialEntranceCount = salaryDirections.reduce((total, direction) => total + (direction.companyEntrances || []).length, 0);
  const localOpportunityCount = salaryDirections.reduce((total, direction) => total + (direction.localOpportunityChannels || []).length, 0);
  const cityLabel = cityName || "本地";
  const score = clampSignalScore(
    48 +
      Math.min(14, officialEntranceCount * 3) +
      Math.min(10, localOpportunityCount * 2) +
      Math.min(8, salaryDirections.length * 3) +
      (cityName ? 5 : 0) +
      (typeStrategy && typeStrategy.id !== "general-local" ? 7 : 0),
  );

  return {
    title: `${majorName} -> ${primaryDirection.title}`,
    status: "先核验企业官网 + 学校就业网",
    scoreLabel: `${score} 分信号强度`,
    salaryLabel: primaryDirection.salary,
    sourceCoverageText: `${officialEntranceCount} 个企业官网入口 · ${localOpportunityCount} 个${cityLabel}本地机会入口 · ${cityEvidenceActions.length} 个证据动作`,
    opportunity: primaryDirection.reason || "把专业落到岗位方向，再用薪资和就业证据交叉判断。",
    risk: `${(typeStrategy && typeStrategy.warnings && typeStrategy.warnings[0]) || "所有数据都要保存来源和日期"}；薪资是岗位市场参考，不等于学校承诺。`,
    nextActions: [
      `先保存${schoolName}学校主体、官网域名和专业开设证据。`,
      `打开${primaryDirection.title}企业官网岗位，保存城市、薪资范围、学历要求和发布日期。`,
      `回学校就业网查${majorName}宣讲会、双选会或招聘会，确认企业是否真的到校。`,
    ],
    tags: [majorName, typeStrategy ? typeStrategy.label : "普通学校", cityLabel, primaryDirection.title, primaryDirection.salary].filter(Boolean),
  };
}

function buildSalaryDirections(typeStrategy, schoolName, majorName, cityHint) {
  const sortedTemplates = salaryDirectionTemplates
    .map((template) => ({
      ...template,
      score: scoreSalaryDirectionTemplate(template, typeStrategy, majorName),
    }))
    .filter((template) => template.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const selectedTemplates = sortedTemplates.slice(0, 3);
  const directionTemplates = selectedTemplates.some((template) => template.id === "general-salary-check")
    ? selectedTemplates
    : [...selectedTemplates, salaryDirectionTemplates.find((template) => template.id === "general-salary-check")].filter(Boolean).slice(0, 3);

  return directionTemplates.map((template) => {
    const query = `${schoolName} ${majorName} ${template.title} 校招 岗位 薪资 官网`;
    return {
      id: template.id,
      title: template.title,
      salary: template.salary,
      companies: template.companies,
      companyText: template.companies.join(" / "),
      companyEntrances: buildCompanyEntrances(template.companies),
      localOpportunityChannels: buildLocalOpportunityChannels(schoolName, majorName, template.title, cityHint),
      query,
      url: buildSearchUrl(query),
      evidenceSlot: "岗位薪资",
      action: "岗位市场参考，不是学校承诺；复制后优先打开企业官网或就业网，保存城市、薪资范围、学历要求和更新时间。",
      reason: template.reason,
      updateRule: "每天重新查企业官网/就业网岗位，薪资只保留带日期的最新证据。",
    };
  });
}

function buildAuthorityRoutes(schoolName, majorName) {
  return [
    {
      tier: "身份核验",
      label: "教育部阳光高考院校库",
      source: "教育部阳光高考",
      url: `https://gaokao.chsi.com.cn/sch/search.do?searchName=${encodeURIComponent(schoolName)}`,
      useFor: "确认学校全称、主管部门、办学层次和官网入口。",
    },
    {
      tier: "官网定位",
      label: "学校官网与信息公开检索",
      source: "学校官网 / 信息公开",
      url: buildSearchUrl(`${schoolName} 学校官网 信息公开 官网域名`),
      useFor: "找官网域名、信息公开栏目和就业质量报告入口。",
    },
    {
      tier: "专业开设",
      label: "招生网 / 学院页 / 培养方案",
      source: "招生网 / 教务处 / 学院页",
      url: buildSearchUrl(`${schoolName} ${majorName} 专业介绍 招生网 培养方案 学院`),
      useFor: "确认目标专业是否开设、所属学院、核心课程和培养方向。",
    },
    {
      tier: "就业报告",
      label: "近三年就业质量报告 PDF",
      source: "信息公开 / 就业质量报告",
      url: buildSearchUrl(`${schoolName} 就业质量报告 2025 2024 2023 pdf 信息公开`),
      useFor: "提取就业率、升学率、行业去向和统计口径。",
    },
    {
      tier: "到校招聘",
      label: "国家大学生就业服务平台 / 学校就业网",
      source: "国家大学生就业服务平台 / 就业信息网",
      url: `https://www.ncss.cn/student/jobs/index.html?keyword=${encodeURIComponent(`${schoolName} ${majorName}`)}`,
      useFor: "找宣讲会、双选会、招聘会和真实到校企业。",
    },
    {
      tier: "薪资交叉",
      label: "企业官网岗位薪资检索",
      source: "企业官网招聘 / 公开岗位",
      url: buildSearchUrl(`${majorName} 校招 岗位 薪资 官网 ${schoolName}`),
      useFor: "用岗位城市、薪资范围和学历要求校准市场参考。",
    },
  ];
}

function buildOrdinarySchoolRescuePacket(schoolName, majorName, cityHint) {
  const targetSchoolName = (schoolName || "").trim() || "目标学校";
  const targetMajorName = (majorName || "").trim() || "目标专业";
  const targetCityName = (cityHint || "").trim() || getSchoolCityByName(targetSchoolName);
  const authorityRoutes = buildAuthorityRoutes(targetSchoolName, targetMajorName);
  const typeStrategy = buildOrdinarySchoolTypeStrategy(targetSchoolName);
  const typeStrategyActions = buildTypeStrategyActions(typeStrategy, targetSchoolName, targetMajorName);
  const salaryDirections = buildSalaryDirections(typeStrategy, targetSchoolName, targetMajorName, targetCityName);
  const cityEvidenceActions = buildCityEvidenceActions(targetSchoolName, targetMajorName, targetCityName, salaryDirections);
  const careerSignalDigest = buildCareerSignalDigest(
    targetSchoolName,
    targetMajorName,
    targetCityName,
    typeStrategy,
    salaryDirections,
    cityEvidenceActions,
  );
  const urlsByLabel = {
    学校主体: `https://gaokao.chsi.com.cn/sch/search.do?searchName=${encodeURIComponent(targetSchoolName)}`,
    专业资料: buildSearchUrl(`${targetSchoolName} ${targetMajorName} 专业介绍 招生网 培养方案`),
    就业报告: buildSearchUrl(`${targetSchoolName} 就业质量报告 2024 2025 pdf 信息公开`),
    到校招聘: buildSearchUrl(`${targetSchoolName} 就业信息网 宣讲会 双选会 ${targetMajorName}`),
    岗位薪资: buildSearchUrl(`${targetMajorName} 校招 岗位 薪资 官网 ${targetSchoolName}`),
  };

  const entryGroups = ordinarySchoolRescue.entryGroups.map((entry) => ({
    ...entry,
    url: urlsByLabel[entry.label] || buildSearchUrl(`${targetSchoolName} ${targetMajorName} ${entry.label}`),
  }));

  const copyText = [
    `${targetSchoolName} 普通学校公开入口包`,
    `目标专业：${targetMajorName}`,
    targetCityName ? `城市线索：${targetCityName}` : "城市线索：待补充",
    "院校类型策略",
    `${typeStrategy.label}：${typeStrategy.firstMove}`,
    `搜索重点：${typeStrategy.searchFocus.join("、")}`,
    `风险提醒：${typeStrategy.warnings.join("、")}`,
    "类型专属检索入口",
    ...typeStrategyActions.map((action) => `${action.label}：${action.query}｜${action.url}｜保存到：${action.evidenceSlot}`),
    "岗位薪资方向桥",
    ...salaryDirections.map((direction) => `${direction.title}：${direction.salary}｜企业/机构：${direction.companyText}｜入口：${direction.url}｜${direction.updateRule}`),
    "公司官网入口包",
    ...salaryDirections.flatMap((direction) =>
      direction.companyEntrances.map(
        (company) => `${direction.title}：${company.name}｜${company.cnName}｜${company.officialEntrance}｜薪资参考：${company.salary}`,
      ),
    ),
    "本地机会入口包",
    ...salaryDirections.flatMap((direction) =>
      direction.localOpportunityChannels.map(
        (channel) => `${direction.title}：${channel.label}｜${channel.source}｜${channel.url}｜保存到：${channel.evidenceSlot}`,
      ),
    ),
    "城市证据动作清单",
    ...cityEvidenceActions.map(
      (action) => `${action.label}：${action.query}｜${action.url}｜保存到：${action.evidenceSlot}｜字段：${action.saveFields.join("、")}`,
    ),
    "职业信号摘要",
    `${careerSignalDigest.title}｜${careerSignalDigest.salaryLabel}｜${careerSignalDigest.sourceCoverageText}`,
    `信号机会：${careerSignalDigest.opportunity}`,
    `信号风险：${careerSignalDigest.risk}`,
    `下一步：${careerSignalDigest.nextActions.join(" / ")}`,
    "权威入口阶梯",
    ...authorityRoutes.map((route) => `${route.tier}：${route.source}｜${route.url}｜用途：${route.useFor}`),
    ...entryGroups.map((entry) => `${entry.label}：${entry.source}｜${entry.url}｜保存：${entry.saveFields.join("、")}`),
    "核验顺序：验学校 -> 验专业 -> 抓就业报告 -> 抓到校企业 -> 补岗位薪资",
    "薪资为岗位市场参考，不等于学校官方承诺；展示时必须标注来源和更新时间。",
  ].join("\n");

  return {
    ...ordinarySchoolRescue,
    targetSchoolName,
    targetMajorName,
    targetCityName,
    title: `${targetSchoolName}也能查`,
    subtitle: `${targetSchoolName} 暂未命中结构化样本，先按公开入口聚合证据，再回到岗位薪资做交叉验证。`,
    typeStrategy,
    typeStrategyActions,
    salaryDirections,
    cityEvidenceActions,
    careerSignalDigest,
    authorityRoutes,
    entryGroups,
    copyText,
    packetLines: copyText.split("\n"),
  };
}

function getSchool(id) {
  return schools.find((school) => school.id === id) || schools[0];
}

function getCompany(id) {
  return companies.find((company) => company.id === id) || companies[0];
}

function findRole(query) {
  const text = (query || "").trim().toLowerCase();
  if (!text) return radarRoles[0];
  return radarRoles.find((role) => role.title.toLowerCase().includes(text)) || radarRoles[0];
}

schools.forEach((school) => {
  school.recruitersByYear.forEach((year) => {
    year.companyText = year.companies.join("、");
  });
  school.majors.forEach((major) => {
    major.companyText = major.companies.join(" / ");
  });
});

companies.forEach((company) => {
  company.roleText = company.roles.join(" / ");
});

module.exports = {
  schools,
  companies,
  radarRoles,
  ordinarySchoolRescue,
  ordinaryMajorPresets,
  buildOrdinarySchoolTypeStrategy,
  buildOrdinarySchoolRescuePacket,
  getSchool,
  getCompany,
  findRole,
};
