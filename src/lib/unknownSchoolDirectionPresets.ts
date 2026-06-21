export type UnknownSchoolDirectionPreset = {
  id: string;
  label: string;
  majorName: string;
  jobName: string;
  reason: string;
  queryHints: string[];
  disclaimer: string;
};

export type UnknownSchoolTypeStrategyEvidenceId = "major-catalog" | "admissions" | "report" | "campus" | "salary";

export type UnknownSchoolTypeStrategy = {
  id:
    | "vocational-applied"
    | "medical-health"
    | "media-arts"
    | "agriculture-food"
    | "architecture-civil"
    | "law-public-service"
    | "sports-health"
    | "finance-business"
    | "engineering-polytechnic"
    | "transport-service"
    | "teacher-education"
    | "general-local";
  label: string;
  confidenceLabel: string;
  firstMove: string;
  reason: string;
  evidenceIds: UnknownSchoolTypeStrategyEvidenceId[];
  searchFocus: string[];
  warnings: string[];
};

type DirectionSeed = Omit<UnknownSchoolDirectionPreset, "id" | "disclaimer">;

const directionPresetDisclaimer = "仅作为检索方向，不代表学校一定开设该专业；必须回到学校官网专业目录核验。";

export function buildUnknownSchoolTypeStrategy(schoolName: string): UnknownSchoolTypeStrategy {
  const normalized = schoolName.trim();

  if (/医|护理|药|卫生|健康|康复|口腔/.test(normalized)) {
    return {
      id: "medical-health",
      label: "医药卫生类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查招生专业和实习医院，再开就业质量报告核对就业率。",
      reason: "医药卫生类学校最容易把专业名、资格证和实习医院混在宣传里，必须先回到官方专业目录和实习基地名单。",
      evidenceIds: ["admissions", "major-catalog", "campus", "report"],
      searchFocus: ["招生专业", "实习医院", "资格证", "就业质量报告"],
      warnings: ["不要把资格证通过率当就业率", "实习医院名单要看年份", "薪资只能用岗位和地区代理"],
    };
  }

  if (/传媒|艺术|影视|新闻|文化|数字媒体|动画/.test(normalized)) {
    return {
      id: "media-arts",
      label: "传媒 / 艺术类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录和作品集要求，再反查内容运营、设计、影视制作岗位。",
      reason: "传媒艺术方向的真实价值在课程、作品集、实习项目和企业岗位匹配，不适合只看学校宣传页。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["作品集", "内容运营", "实习基地", "双选会"],
      warnings: ["宣传片不能当就业证据", "获奖新闻不能替代毕业去向", "岗位薪资要按城市和作品门槛分层"],
    };
  }

  if (/农业|农林|林业|园林|园艺|畜牧|兽医|食品|粮食|水产|茶|生态|乡村/.test(normalized)) {
    return {
      id: "agriculture-food",
      label: "农业 / 食品类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实训基地和校企合作，再反查乡村振兴、食品检验、农产品运营岗位。",
      reason: "农业食品类普通院校的就业入口常在地方产业带、实训基地和食品/农产品企业，不适合只看校名层次。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["实训基地", "乡村振兴", "食品检验", "农产品运营"],
      warnings: ["农林食品岗位有季节和地区差异", "校企合作要看真实岗位年份", "薪资要按城市和企业类型交叉核验"],
    };
  }

  if (/建筑|土木|城建|建设|工程造价|工程管理|BIM|测绘|城乡规划|给排水|市政|造价/.test(normalized)) {
    return {
      id: "architecture-civil",
      label: "建筑 / 土木类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实训软件和就业网，再反查 BIM、造价、施工管理、资料员岗位。",
      reason: "建筑土木方向的去向受城市建设周期、证书、项目制和工地现场要求影响，必须拆到岗位看。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["BIM", "造价", "施工管理", "实训软件"],
      warnings: ["工地岗位、设计院和甲方岗位不能混成一个薪资", "证书要求要看岗位原文", "项目制岗位要保存发布日期"],
    };
  }

  if (/政法|司法|警官|公安|法律|法学|公共管理|社会工作|民政/.test(normalized)) {
    return {
      id: "law-public-service",
      label: "政法 / 公共服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实习基地和就业质量报告，再分开看招录、法律服务、社工和企业法务岗位。",
      reason: "政法公共服务方向要区分考公考编、辅警/协管、律所、企业法务和社会服务机构，不能只看就业率。",
      evidenceIds: ["major-catalog", "report", "campus", "salary"],
      searchFocus: ["招录", "法律服务", "社工机构", "法务助理"],
      warnings: ["编制岗位和合同岗位必须分开", "招录公告不等于学校就业承诺", "薪资要标明机构类型和城市"],
    };
  }

  if (/体育|运动|体能|健身|休闲体育|康养/.test(normalized)) {
    return {
      id: "sports-health",
      label: "体育 / 健康服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、实践基地和证书路径，再反查健身教练、运动康复、赛事运营岗位。",
      reason: "体育健康方向的就业质量很依赖证书、实习场馆、城市消费力和个人技能，平均值容易误导。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["健身教练", "运动康复", "赛事运营", "康养"],
      warnings: ["证书和实习时长要核验", "底薪提成制要分开看", "赛事和培训岗位有淡旺季"],
    };
  }

  if (/职业|技术|专科|高等专科|应用|技师/.test(normalized)) {
    return {
      id: "vocational-applied",
      label: "高职 / 应用型院校",
      confidenceLabel: "按校名识别",
      firstMove: "先打开招生专业和就业信息网，再看双选会企业、订单班、专升本入口。",
      reason: "这类学校公开信息通常分散在招生网、就业网和二级学院页面，入口比一页结论更重要。",
      evidenceIds: ["major-catalog", "admissions", "campus", "report"],
      searchFocus: ["招生专业", "就业信息网", "双选会", "专升本"],
      warnings: ["logo 墙只能当企业线索", "校企合作新闻要回到招聘年份核验", "高薪样本不能代表平均工资"],
    };
  }

  if (/工商|财经|商贸|经济|管理|财|会计|金融/.test(normalized)) {
    return {
      id: "finance-business",
      label: "财经 / 商贸类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、证书路径和校招企业，再对照财务、审计、电商、运营岗位。",
      reason: "商科方向专业名相似度高，必须用课程、证书和校招企业来区分含金量。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["会计", "审计助理", "电商运营", "双选会"],
      warnings: ["不要把实训平台当真实企业招聘", "证书路径不等于录用结果", "薪资要分销售岗和财务岗"],
    };
  }

  if (/理工|工程|机电|电子|信息|移通|邮电|网络|软件/.test(normalized)) {
    return {
      id: "engineering-polytechnic",
      label: "理工 / 工程类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查培养方案、实验实训平台和就业网，再反查制造、运维、软件岗位。",
      reason: "理工类学校的差异通常在实训设备、项目课和企业岗位要求，不能只看专业名称。",
      evidenceIds: ["major-catalog", "campus", "salary", "report"],
      searchFocus: ["培养方案", "实训基地", "校招企业", "工程师助理"],
      warnings: ["实验室新闻不等于就业渠道", "外包岗位和研发岗位要分开看", "薪资要看技术栈和城市"],
    };
  }

  if (/交通|铁道|铁路|航空|航运|旅游|酒店/.test(normalized)) {
    return {
      id: "transport-service",
      label: "交通 / 服务类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查订单班、实习基地和双选会，再看轨道、航空、酒店、文旅企业入口。",
      reason: "交通服务类学校经常有订单班和实习企业，入口要优先看年份、岗位和录用条件。",
      evidenceIds: ["admissions", "campus", "report", "salary"],
      searchFocus: ["订单班", "实习基地", "双选会", "管培生"],
      warnings: ["订单班要看是否真实就业承诺", "服务岗薪资要区分底薪和提成", "招聘公告年份必须保存"],
    };
  }

  if (/师范|幼儿|教育/.test(normalized)) {
    return {
      id: "teacher-education",
      label: "师范 / 教育类院校",
      confidenceLabel: "按校名识别",
      firstMove: "先查专业目录、教师资格路径和就业质量报告，再看学校招聘和教培岗位。",
      reason: "教育类去向要区分公办编制、民办学校、幼儿园、教培和跨境运营，不宜混成一个平均值。",
      evidenceIds: ["major-catalog", "report", "campus", "salary"],
      searchFocus: ["教师资格", "实习学校", "就业质量报告", "教培岗位"],
      warnings: ["资格证通过不等于入编", "就业率要看毕业去向类别", "教培薪资波动要单独标注"],
    };
  }

  return {
    id: "general-local",
    label: "普通本科 / 待识别院校",
    confidenceLabel: normalized ? "按通用路径处理" : "先填学校名",
    firstMove: "先打开专业目录、招生专业和近两年就业质量报告，再补就业网与双选会入口。",
    reason: "普通地方院校的公开资料通常够用，但需要从学校官网、招生网、就业网三个入口拼起来看。",
    evidenceIds: ["major-catalog", "admissions", "report", "campus"],
    searchFocus: ["专业目录", "招生专业", "就业质量报告", "就业信息网"],
    warnings: ["学校名要写全称再搜", "不要把百度百科当官方资料", "没有年份的企业名单只能当线索"],
  };
}

export function buildUnknownSchoolDirectionPresets(schoolName: string): UnknownSchoolDirectionPreset[] {
  const normalized = schoolName.trim();
  const seeds: DirectionSeed[] = [];

  if (/医|护理|药|卫生|健康|康复|口腔/.test(normalized)) {
    seeds.push(...medicalSeeds);
  }

  if (/传媒|艺术|影视|新闻|文化|数字媒体|动画/.test(normalized)) {
    seeds.push(...mediaSeeds);
  }

  if (/农业|农林|林业|园林|园艺|畜牧|兽医|食品|粮食|水产|茶|生态|乡村/.test(normalized)) {
    seeds.push(...agricultureSeeds);
  }

  if (/建筑|土木|城建|建设|工程造价|工程管理|BIM|测绘|城乡规划|给排水|市政|造价/.test(normalized)) {
    seeds.push(...architectureSeeds);
  }

  if (/政法|司法|警官|公安|法律|法学|公共管理|社会工作|民政/.test(normalized)) {
    seeds.push(...lawPublicSeeds);
  }

  if (/体育|运动|体能|健身|休闲体育|康养/.test(normalized)) {
    seeds.push(...sportsSeeds);
  }

  if (/交通|铁道|铁路|航空|航运|旅游|酒店/.test(normalized)) {
    seeds.push(...transportSeeds);
  }

  if (/工商|财经|商贸|经济|管理|财|会计|金融/.test(normalized)) {
    seeds.push(...businessSeeds);
  }

  if (/理工|工程|机电|电子|信息|移通|邮电|网络|软件/.test(normalized)) {
    seeds.push(...engineeringSeeds);
  }

  if (/职业|技术|专科|高等专科|应用|技师/.test(normalized)) {
    seeds.push(...vocationalSeeds);
  }

  if (/师范|幼儿|教育/.test(normalized)) {
    seeds.push(...educationSeeds);
  }

  seeds.push(...fallbackSeeds);

  return dedupeSeeds(seeds)
    .slice(0, 6)
    .map((seed, index) => ({
      ...seed,
      id: `unknown-direction-${normalizePresetId(`${seed.majorName}-${seed.jobName}`)}-${index + 1}`,
      disclaimer: directionPresetDisclaimer,
    }));
}

const vocationalSeeds: DirectionSeed[] = [
  {
    label: "护理 / 医疗服务",
    majorName: "护理",
    jobName: "护士",
    reason: "职业院校常见起步方向，先查专业目录、实习医院和就业报告。",
    queryHints: ["专业目录", "实习基地", "就业质量报告"],
  },
  {
    label: "电商 / 运营",
    majorName: "电子商务",
    jobName: "电商运营",
    reason: "适合先反查平台运营、供应链、直播和客服管理岗位。",
    queryHints: ["招生专业", "校招企业", "运营岗位"],
  },
  {
    label: "计算机 / 技术支持",
    majorName: "计算机应用技术",
    jobName: "技术支持工程师",
    reason: "先看课程是否覆盖网络、数据库、前端或运维，再查企业岗位。",
    queryHints: ["培养方案", "核心课程", "企业官网岗位"],
  },
  {
    label: "机电 / 设备",
    majorName: "机电一体化技术",
    jobName: "设备技术员",
    reason: "适合制造业、汽车零部件和设备维护方向的官网岗位反查。",
    queryHints: ["实训基地", "校企合作", "设备技术员"],
  },
];

const medicalSeeds: DirectionSeed[] = [
  {
    label: "护理 / 医院",
    majorName: "护理",
    jobName: "护士",
    reason: "医学类院校先查实习医院、资格证路径和就业质量报告。",
    queryHints: ["实习医院", "护士资格", "就业质量报告"],
  },
  {
    label: "药学 / 医药",
    majorName: "药学",
    jobName: "医药代表",
    reason: "把药学课程、药企校招和医药销售岗位分开核验。",
    queryHints: ["药学专业", "药企招聘", "医药代表"],
  },
  {
    label: "康复 / 健康服务",
    majorName: "康复治疗技术",
    jobName: "康复治疗师",
    reason: "适合查医院康复科、养老康养机构和资格证要求。",
    queryHints: ["康复治疗", "实习基地", "康养机构"],
  },
];

const mediaSeeds: DirectionSeed[] = [
  {
    label: "数媒 / 内容产品",
    majorName: "数字媒体技术",
    jobName: "内容产品运营",
    reason: "先查作品集、课程方向和内容平台岗位，避免只看宣传页。",
    queryHints: ["作品集", "培养方案", "内容运营"],
  },
  {
    label: "视觉 / 设计",
    majorName: "视觉传达设计",
    jobName: "UI设计师",
    reason: "把课程、作品集要求和企业设计岗位放在一起核验。",
    queryHints: ["视觉传达", "作品集", "UI设计"],
  },
  {
    label: "影视 / 新媒体",
    majorName: "广播电视编导",
    jobName: "新媒体运营",
    reason: "适合查校内实践、实习基地和内容公司招聘入口。",
    queryHints: ["实践教学", "实习基地", "新媒体运营"],
  },
];

const agricultureSeeds: DirectionSeed[] = [
  {
    label: "现代农业 / 技术服务",
    majorName: "现代农业技术",
    jobName: "农业技术员",
    reason: "先查实训基地、地方农业龙头企业和乡村振兴项目，再看岗位薪资。",
    queryHints: ["实训基地", "乡村振兴", "农业技术员"],
  },
  {
    label: "食品 / 质检",
    majorName: "食品质量与安全",
    jobName: "食品检验员",
    reason: "适合从食品企业、质检机构和实验实训平台反查真实岗位。",
    queryHints: ["食品检验", "质检岗位", "企业官网岗位"],
  },
  {
    label: "畜牧 / 宠物医疗",
    majorName: "畜牧兽医",
    jobName: "兽医助理",
    reason: "把校内实训、动物医院/养殖企业和资格证要求一起核验。",
    queryHints: ["畜牧兽医", "实训基地", "宠物医疗"],
  },
];

const architectureSeeds: DirectionSeed[] = [
  {
    label: "造价 / 项目",
    majorName: "工程造价",
    jobName: "造价员",
    reason: "先查造价软件、校企合作和工程咨询公司岗位，再保存薪资范围。",
    queryHints: ["工程造价", "造价员", "企业官网岗位"],
  },
  {
    label: "BIM / 数字建造",
    majorName: "建筑工程技术",
    jobName: "BIM建模员",
    reason: "适合反查 BIM、数字建造、施工管理和资料员岗位入口。",
    queryHints: ["BIM", "数字建造", "施工管理"],
  },
  {
    label: "土木 / 现场",
    majorName: "土木工程",
    jobName: "施工员",
    reason: "把现场岗位、设计助理和甲方工程岗分开核验，避免薪资混算。",
    queryHints: ["施工员", "就业信息网", "招聘会"],
  },
];

const lawPublicSeeds: DirectionSeed[] = [
  {
    label: "法律 / 法务",
    majorName: "法律事务",
    jobName: "法务助理",
    reason: "先查实习基地、律所/企业法务岗位和就业质量报告的去向分类。",
    queryHints: ["法律服务", "法务助理", "就业质量报告"],
  },
  {
    label: "司法 / 公共服务",
    majorName: "司法警务",
    jobName: "公共服务专员",
    reason: "把招录、辅警协管、公共服务和社工机构岗位分开看。",
    queryHints: ["招录", "公共服务", "社工机构"],
  },
];

const sportsSeeds: DirectionSeed[] = [
  {
    label: "运动 / 康复",
    majorName: "运动康复",
    jobName: "运动康复师",
    reason: "先查实践基地、证书路径和康复机构岗位，再看城市薪资。",
    queryHints: ["运动康复", "康养", "资格证"],
  },
  {
    label: "体能 / 健身",
    majorName: "体能训练",
    jobName: "健身教练",
    reason: "适合反查健身连锁、体能训练、体育培训和提成结构。",
    queryHints: ["健身教练", "体育培训", "薪资结构"],
  },
  {
    label: "赛事 / 运营",
    majorName: "休闲体育",
    jobName: "赛事运营",
    reason: "把赛事公司、体育场馆和文旅活动运营岗位一起核验。",
    queryHints: ["赛事运营", "体育场馆", "文旅活动"],
  },
];

const businessSeeds: DirectionSeed[] = [
  {
    label: "会计 / 审计",
    majorName: "会计学",
    jobName: "审计助理",
    reason: "先查专业目录、证书路径和事务所/财务岗位入口。",
    queryHints: ["会计学", "审计助理", "就业质量报告"],
  },
  {
    label: "电商 / 运营",
    majorName: "电子商务",
    jobName: "电商运营",
    reason: "适合工商商贸类学校从平台运营和供应链岗位切入。",
    queryHints: ["电子商务", "校招企业", "运营岗位"],
  },
  {
    label: "市场 / 品牌",
    majorName: "市场营销",
    jobName: "品牌运营",
    reason: "把品牌、销售、增长岗位和校招企业名单分开核验。",
    queryHints: ["市场营销", "品牌运营", "宣讲会"],
  },
];

const engineeringSeeds: DirectionSeed[] = [
  {
    label: "网络 / 安全",
    majorName: "网络工程",
    jobName: "安全工程师",
    reason: "先查网络、云、安全课程，再反查安全和运维岗位。",
    queryHints: ["网络工程", "安全工程师", "企业官网岗位"],
  },
  {
    label: "软件 / 开发",
    majorName: "软件工程",
    jobName: "软件研发工程师",
    reason: "适合用培养方案、项目实践和企业招聘要求三方核验。",
    queryHints: ["软件工程", "项目实践", "软件研发"],
  },
  {
    label: "电子 / 嵌入式",
    majorName: "电子信息工程",
    jobName: "嵌入式工程师",
    reason: "把硬件课程、实训平台和制造/通信企业岗位放在一起看。",
    queryHints: ["电子信息", "嵌入式", "通信企业"],
  },
];

const transportSeeds: DirectionSeed[] = [
  {
    label: "轨道 / 运营",
    majorName: "城市轨道交通运营管理",
    jobName: "轨道交通运营",
    reason: "交通类学校先查实训基地、订单班和城市轨道企业招聘。",
    queryHints: ["轨道交通", "订单班", "运营岗位"],
  },
  {
    label: "酒店 / 文旅",
    majorName: "酒店管理",
    jobName: "酒店运营管培生",
    reason: "适合查实习酒店、管培项目和文旅集团招聘入口。",
    queryHints: ["酒店管理", "实习基地", "管培生"],
  },
];

const educationSeeds: DirectionSeed[] = [
  {
    label: "学前 / 教育",
    majorName: "学前教育",
    jobName: "幼儿教师",
    reason: "师范类或教育类学校先查教师资格、实习园所和就业报告。",
    queryHints: ["学前教育", "教师资格", "就业质量报告"],
  },
  {
    label: "英语 / 教培",
    majorName: "英语",
    jobName: "跨境运营",
    reason: "把语言能力和跨境电商、客服、运营岗位一起反查。",
    queryHints: ["英语专业", "跨境电商", "运营岗位"],
  },
];

const fallbackSeeds: DirectionSeed[] = [
  ...businessSeeds,
  ...vocationalSeeds,
  ...engineeringSeeds.slice(0, 2),
];

function dedupeSeeds(seeds: DirectionSeed[]) {
  const seen = new Set<string>();
  return seeds.filter((seed) => {
    const key = `${seed.majorName}-${seed.jobName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizePresetId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\da-z\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "") || "preset";
}
