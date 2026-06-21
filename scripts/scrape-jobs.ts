import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Job, JobCategory } from "../src/types";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonRecord = Record<string, JsonValue | undefined>;

type ByteDanceNode = {
  id?: string;
  code?: string;
  name?: string;
  en_name?: string;
  i18n_name?: string;
  parent?: ByteDanceNode | null;
};

type ByteDanceRawJob = {
  id?: string;
  code?: string;
  title?: string;
  description?: string;
  requirement?: string;
  min_salary?: number | string;
  max_salary?: number | string;
  salary?: string;
  publish_time?: number;
  job_category?: ByteDanceNode | null;
  city_info?: ByteDanceNode | null;
  city_list?: ByteDanceNode[];
  city_info_list_for_delivery?: ByteDanceNode[];
  recruit_type?: ByteDanceNode | null;
  department_info?: ByteDanceNode | null;
  job_function?: ByteDanceNode | null;
  job_post_info?: {
    department?: ByteDanceNode | null;
    tag_list?: ByteDanceNode[];
    required_degree?: ByteDanceNode | null;
    experience?: ByteDanceNode | null;
    sequence?: ByteDanceNode | null;
    job_function?: ByteDanceNode | null;
    city_list?: ByteDanceNode[];
    min_salary?: number | string;
    max_salary?: number | string;
    salary?: string;
  } | null;
  tag_list?: ByteDanceNode[];
};

type ByteDanceListResponse = {
  code: number;
  data?: {
    count?: number;
    job_post_list?: ByteDanceRawJob[];
  };
  message?: string;
  error?: unknown;
};

type ByteDanceDetailResponse = {
  code: number;
  data?: {
    job_post_detail?: ByteDanceRawJob | null;
  };
  message?: string;
  error?: unknown;
};

type ByteDanceSigner = (payload: { body: JsonRecord; url: string }) => string;

type TencentRawJob = {
  PostId?: string;
  RecruitPostName?: string;
  LocationName?: string;
  BGName?: string;
  ProductName?: string;
  CategoryName?: string;
  Responsibility?: string;
  Requirement?: string;
  LastUpdateTime?: string;
  PostURL?: string;
  RequireWorkYearsName?: string;
};

type TencentQueryResponse = {
  Code: number;
  Data?: {
    Count?: number;
    Posts?: TencentRawJob[];
  };
};

type TencentDetailResponse = {
  Code: number;
  Data?: TencentRawJob;
};

type BaiduRawJob = {
  education?: string;
  name?: string;
  orgName?: string;
  postId?: string;
  jobId?: string;
  postType?: string;
  publishDate?: string;
  updateDate?: string;
  recruitNum?: string;
  serviceCondition?: string;
  workContent?: string;
  workPlace?: string;
  workYears?: string;
  projectType?: string;
  projectTypeCode?: string;
  hotFlag?: boolean;
  bgShortName?: string;
};

type BaiduInitialData = {
  listData?: {
    listDetailData?: BaiduRawJob[];
    total?: number;
  };
  detailData?: {
    postInfo?: BaiduRawJob | null;
  };
};

type MeituanNode = {
  code?: string | null;
  name?: string | null;
};

type MeituanRawJob = {
  jobUnionId?: string;
  name?: string;
  projectName?: string | null;
  jobFamily?: string | null;
  jobFamilyGroup?: string | null;
  cityList?: MeituanNode[];
  workYear?: string | null;
  department?: MeituanNode[];
  departmentIntro?: string | null;
  jobDuty?: string | null;
  jobRequirement?: string | null;
  highLight?: string | null;
  tag?: string | null;
  refreshTime?: number;
};

type MeituanListResponse = {
  status: number;
  message?: string;
  data?: {
    list?: MeituanRawJob[];
    total?: number;
  };
};

type MeituanDetailResponse = {
  status: number;
  message?: string;
  data?: MeituanRawJob;
};

type JdRawJob = {
  id?: number | string;
  requirementId?: number | string;
  positionId?: number | string;
  positionCode?: string;
  reqNumber?: string;
  positionName?: string;
  positionNameOpen?: string;
  positionDeptName?: string;
  jobType?: string;
  jobTypeCode?: string;
  workCity?: string;
  workCityCode?: string;
  workContent?: string;
  qualification?: string;
  lvlName?: string;
  publishTime?: number;
  formatPublishTime?: string;
  isHot?: number;
};

type HuaweiRawJob = {
  jobId?: number | string;
  jobRequirementId?: number | string;
  advertisementCode?: string;
  jobname?: string;
  nameCn?: string;
  nameEn?: string | null;
  mainBusiness?: string;
  mainBusinessEn?: string | null;
  jobRequire?: string;
  jobRequireEn?: string | null;
  jobFamilyCode?: string;
  jobFamilyName?: string;
  jobClass?: string;
  jobSubcategory?: string | null;
  jobAddress?: string;
  jobArea?: string;
  degree?: string;
  workYear?: string | null;
  jobType?: string;
  jobLevel?: string;
  deptName?: string | null;
  deptFullName?: string | null;
  keywords?: string | null;
  releaseDate?: string;
  creationDate?: string;
  expirationDate?: string;
  isHotJob?: number;
  positionReqCode?: string;
};

type HuaweiJobListResponse = {
  pageVO?: {
    totalRows?: number;
    curPage?: number;
    pageSize?: number;
    totalPages?: number;
  };
  result?: HuaweiRawJob[];
};

type WorkdayJobPosting = {
  title?: string;
  externalPath?: string;
  locationsText?: string;
  postedOn?: string;
  bulletFields?: string[];
  timeType?: string;
  startDate?: string;
};

type WorkdayJobsResponse = {
  total?: number;
  jobPostings?: WorkdayJobPosting[];
};

type WorkdayJobDetailResponse = {
  jobPostingInfo?: {
    id?: string;
    title?: string;
    jobDescription?: string;
    location?: string;
    postedOn?: string;
    startDate?: string;
    timeType?: string;
    jobReqId?: string;
    jobPostingId?: string;
    externalUrl?: string;
  };
  hiringOrganization?: {
    name?: string;
  };
};

type KuaishouRawJob = WorkdayJobPosting & WorkdayJobDetailResponse;

type UnileverRawJob = WorkdayJobPosting &
  WorkdayJobDetailResponse & {
    sitePath?: string;
    siteLabel?: string;
    searchKeyword?: string;
  };

type AmazonRawJob = {
  id?: number | string;
  title?: string;
  description?: string;
  description_short?: string;
  basic_qualifications?: string;
  preferred_qualifications?: string;
  business_category?: string;
  job_category?: string;
  job_family?: string;
  team?: string;
  company_name?: string;
  city?: string;
  state?: string;
  country_code?: string;
  location?: string;
  locations?: unknown[];
  normalized_location?: string;
  posted_date?: string;
  updated_time?: string;
  is_intern?: boolean;
  is_manager?: boolean;
  university_job?: boolean;
  job_schedule_type?: string;
  job_path?: string;
  url_next_step?: string;
  primary_search_label?: string;
  optional_search_labels?: string[];
};

type AmazonSearchResponse = {
  error?: string | null;
  hits?: number;
  jobs?: AmazonRawJob[];
};

type IkeaSearchResponse = {
  filters?: string;
  results?: string;
  hasJobs?: boolean;
  hasContent?: boolean;
};

type IkeaRawJob = {
  id: string;
  title: string;
  location: string;
  categoryName: string;
  jobType?: string;
  sourcePath: string;
  searchKeyword?: string;
};

type LorealRawJob = {
  id?: number | string;
  value?: string;
  label?: string;
  category?: string;
  location?: string;
  postedDate?: string;
  searchKeyword?: string;
};

type MideaProject = {
  projectRuleId?: string;
  projectRuleName?: string;
  projectType?: string;
  numberOfSessions?: string;
};

type MideaProjectListResponse = {
  code?: string;
  message?: string | null;
  data?: MideaProject[];
};

type MideaWorkplace = {
  workPlaceName?: string;
};

type MideaProjectPosition = {
  projectPositionId?: string;
  positionName?: string;
  largeTypeName?: string;
  jobResponsibility?: string;
  jobRequirement?: string;
  positionCode?: string;
};

type MideaRawJob = {
  positionId?: string;
  projectRuleId?: string;
  projectType?: string;
  recruitCategoryName?: string;
  projectPositionId?: string;
  projectPositionName?: string;
  workPlaceCode?: string;
  workplaceDtoList?: MideaWorkplace[];
  projectPositionDto?: MideaProjectPosition;
  employementCategory?: number | string;
  recommend?: number;
  sourceProjectName?: string;
  sourceProjectType?: string;
};

type MideaPositionListResponse = {
  code?: string;
  message?: string | null;
  data?: {
    data?: MideaRawJob[];
    total?: number;
  };
};

type BilibiliRawJob = {
  id?: number | string;
  atsPositionBasicId?: number | string;
  campusProjectId?: number | string;
  positionName?: string;
  positionDescription?: string;
  positionDescriptions?: string;
  jobHighlights?: string;
  deptName?: string;
  deptIntro?: string;
  postCodeName?: string;
  postCodeValue?: string;
  positionTypeName?: string;
  positionType?: string;
  recruitType?: number | string;
  workCity?: string;
  workLocation?: string;
  workExperience?: string;
  educationRequirements?: string;
  pushTime?: string;
  ctime?: string;
  hotRecruit?: number | boolean;
  sourceChannel?: "social" | "campus";
};

type BilibiliListResponse = {
  code?: number;
  message?: string;
  data?: {
    list?: BilibiliRawJob[];
    total?: number;
  };
};

type BilibiliTokenResponse = {
  code?: number;
  data?: string;
  message?: string;
};

type XiaomiNode = {
  id?: string;
  code?: string;
  name?: string;
  en_name?: string;
  i18n_name?: string;
};

type XiaomiRawJob = {
  id?: string;
  code?: string;
  title?: string;
  sub_title?: string | null;
  description?: string;
  requirement?: string;
  department?: string;
  department_name?: string;
  job_category?: XiaomiNode | null;
  city_info?: XiaomiNode | null;
  city_list?: XiaomiNode[];
  subject?: XiaomiNode | null;
  recruitment?: XiaomiNode | null;
  job_function?: XiaomiNode | null;
  job_function_info?: XiaomiNode | null;
  job_function_list?: XiaomiNode[];
  tag_list?: XiaomiNode[];
  updated_at?: string;
  created_at?: string;
};

type XiaomiListResponse = {
  code?: number;
  data?: {
    job_post_list?: XiaomiRawJob[];
    count?: number;
    extra?: string;
  };
  message?: string;
  error?: unknown;
};

type XiaomiTokenResponse = {
  code?: number;
  data?: {
    token?: string;
  };
  message?: string;
  error?: unknown;
};

type PddRawJob = {
  id?: string;
  name?: string;
  code?: string;
  workLocation?: string;
  workLocationName?: string;
  job?: string;
  jobName?: string;
  releaseTime?: number | string;
  jobDuty?: string;
  serveRequirement?: string;
  bonus?: string;
  labelList?: string[];
  recruitType?: string;
  recruitTypeName?: string;
  graduationYear?: string;
  batchId?: string;
  shareUrl?: string;
  normal?: boolean;
};

type PddListResponse = {
  success?: boolean;
  errorCode?: number;
  errorMsg?: string | null;
  result?: {
    list?: PddRawJob[];
    total?: number | string;
  };
};

type PddDetailResponse = {
  success?: boolean;
  errorCode?: number;
  errorMsg?: string | null;
  result?: PddRawJob;
};

type AlibabaBatch = {
  id?: number | string;
  name?: string;
  enName?: string;
  type?: string;
  remark?: string;
};

type AlibabaBatchListResponse = {
  success?: boolean;
  errorMsg?: string | null;
  errorCode?: number | string | null;
  content?: Record<string, AlibabaBatch[] | string[] | undefined> & {
    sequence?: string[];
  };
};

type AlibabaRawJob = {
  id?: number | string;
  name?: string;
  status?: string;
  modifyTime?: number | string;
  publishTime?: number | string | null;
  workLocations?: string[];
  interviewLocations?: string[];
  requirement?: string;
  description?: string;
  experience?: string | null;
  degree?: string | null;
  department?: string | null;
  project?: string | null;
  positionType?: string | null;
  code?: string | null;
  categoryName?: string;
  categoryType?: string;
  batchName?: string;
  batchId?: number | string;
  channels?: string[];
  circleNames?: string[];
  circleCodeList?: string[];
  niuKeProjectName?: string | null;
  isTongyi?: boolean;
  tongyi?: boolean;
};

type AlibabaPositionSearchResponse = {
  success?: boolean;
  errorMsg?: string | null;
  errorCode?: number | string | null;
  content?: {
    datas?: AlibabaRawJob[] | null;
    totalCount?: number;
    pageSize?: number;
    currentPage?: number;
  };
};

type AlibabaSession = {
  csrfToken: string;
  cookie: string;
  batches: Array<AlibabaBatch & { group: string; aliStar?: boolean }>;
};

const bytedanceBaseUrl = "https://jobs.bytedance.com";
const bytedanceHomeUrl = `${bytedanceBaseUrl}/`;
const bytedancePositionPath = "/experienced/position";
const bytedanceCompany = {
  companyId: "bytedance" as const,
  companyName: "字节跳动",
  sourceUrl: bytedanceHomeUrl,
};
const tencentBaseUrl = "https://careers.tencent.com";
const tencentCompany = {
  companyId: "tencent" as const,
  companyName: "腾讯",
  sourceUrl: `${tencentBaseUrl}/search.html`,
};
const alibabaBaseUrl = "https://campus-talent.alibaba.com";
const alibabaCampusPath = "/campus/index";
const alibabaCompany = {
  companyId: "alibaba" as const,
  companyName: "阿里巴巴",
  sourceUrl: `${alibabaBaseUrl}${alibabaCampusPath}`,
};
const baiduBaseUrl = "https://talent.baidu.com";
const baiduCompany = {
  companyId: "baidu" as const,
  companyName: "百度",
  sourceUrl: `${baiduBaseUrl}/jobs/social-list`,
};
const meituanBaseUrl = "https://hr.meituan.com";
const meituanDetailBaseUrl = "https://zhaopin.meituan.com/web";
const meituanCompany = {
  companyId: "meituan" as const,
  companyName: "美团",
  sourceUrl: `${meituanBaseUrl}/jobs`,
};
const jdBaseUrl = "https://zhaopin.jd.com";
const jdCompany = {
  companyId: "jd" as const,
  companyName: "京东",
  sourceUrl: `${jdBaseUrl}/web/job/job_info_list/3`,
};
const huaweiBaseUrl = "https://career.huawei.com";
const huaweiPortalPath = "/reccampportal/portal5/index.html";
const huaweiCompany = {
  companyId: "huawei" as const,
  companyName: "华为",
  sourceUrl: `${huaweiBaseUrl}/cn`,
};
const kuaishouBaseUrl = "https://kwai.wd3.myworkdayjobs.com";
const kuaishouSitePath = "Kuaishou_External";
const kuaishouCompany = {
  companyId: "kuaishou" as const,
  companyName: "快手",
  sourceUrl: `${kuaishouBaseUrl}/${kuaishouSitePath}`,
};
const bilibiliBaseUrl = "https://jobs.bilibili.com";
const bilibiliCompany = {
  companyId: "bilibili" as const,
  companyName: "哔哩哔哩",
  sourceUrl: bilibiliBaseUrl,
};
const xiaomiBaseUrl = "https://xiaomi.jobs.f.mioffice.cn";
const xiaomiPortalPath = "/index";
const xiaomiCompany = {
  companyId: "xiaomi" as const,
  companyName: "小米",
  sourceUrl: `${xiaomiBaseUrl}${xiaomiPortalPath}`,
};
const pddBaseUrl = "https://careers.pddglobalhr.com";
const pddCampusGradPath = "/campus/grad";
const pddCompany = {
  companyId: "pdd" as const,
  companyName: "拼多多",
  sourceUrl: `${pddBaseUrl}${pddCampusGradPath}`,
};
const mideaBaseUrl = "https://careers.midea.com";
const mideaApiBaseUrl = `${mideaBaseUrl}/backend`;
const mideaCompany = {
  companyId: "midea" as const,
  companyName: "美的",
  sourceUrl: `${mideaBaseUrl}/schoolOut/post`,
};
const amazonBaseUrl = "https://www.amazon.jobs";
const amazonCompany = {
  companyId: "amazon" as const,
  companyName: "Amazon",
  sourceUrl: `${amazonBaseUrl}/en/search`,
};
const ikeaBaseUrl = "https://jobs.ikea.com";
const ikeaCompany = {
  companyId: "ikea" as const,
  companyName: "IKEA",
  sourceUrl: `${ikeaBaseUrl}/en/search-jobs`,
};
const unileverBaseUrl = "https://unilever.wd3.myworkdayjobs.com";
const unileverTenant = "unilever";
const unileverSites = [
  { sitePath: "Unilever_Experienced_Professionals", label: "experienced" },
  { sitePath: "Unilever_Early_Careers", label: "early-careers" },
] as const;
const unileverCompany = {
  companyId: "unilever" as const,
  companyName: "Unilever",
  sourceUrl: `${unileverBaseUrl}/${unileverSites[0].sitePath}`,
};
const lorealBaseUrl = "https://careers.loreal.com";
const lorealCompany = {
  companyId: "loreal" as const,
  companyName: "L'Oreal",
  sourceUrl: `${lorealBaseUrl}/en_US/jobs/SearchJobs`,
};

const outputDir = resolve("data");
const normalizedJsonPath = resolve(outputDir, "jobs.normalized.json");
const legacySeedJsonPath = resolve(outputDir, "jobs.seed.json");
const generatedTsPath = resolve("src", "data", "jobs.generated.ts");

const maxJobs = getNumberEnv("XUANXUAN_BYTEDANCE_MAX_JOBS", 72);
const pageSize = getNumberEnv("XUANXUAN_BYTEDANCE_PAGE_SIZE", 18);
const keywords = getListEnv("XUANXUAN_BYTEDANCE_KEYWORDS", ["AI", "算法", "大模型", "后端", "前端", "数据", "产品", "安全", "云计算", "实习"]);
const tencentMaxJobs = getNumberEnv("XUANXUAN_TENCENT_MAX_JOBS", 60);
const tencentPageSize = getNumberEnv("XUANXUAN_TENCENT_PAGE_SIZE", 15);
const tencentKeywords = getListEnv("XUANXUAN_TENCENT_KEYWORDS", ["算法", "AI", "大模型", "后端", "云计算", "游戏", "安全", "数据", "产品", "实习"]);
const alibabaMaxJobs = getNumberEnv("XUANXUAN_ALIBABA_MAX_JOBS", 72);
const alibabaPageSize = getNumberEnv("XUANXUAN_ALIBABA_PAGE_SIZE", 12);
const alibabaKeywords = getListEnv("XUANXUAN_ALIBABA_KEYWORDS", ["AI", "算法", "大模型", "后端", "云计算", "数据", "产品", "安全", "推荐", ""]);
const baiduMaxJobs = getNumberEnv("XUANXUAN_BAIDU_MAX_JOBS", 60);
const baiduPages = getListEnv("XUANXUAN_BAIDU_PAGES", [
  `${baiduBaseUrl}/jobs/social-list`,
  `${baiduBaseUrl}/jobs/list`,
  baiduBaseUrl,
]);
const baiduKeywords = getListEnv("XUANXUAN_BAIDU_KEYWORDS", ["算法", "AI", "大模型", "后端", "自动驾驶", "数据", "产品", "搜索", "智能体", "实习"]);
const meituanMaxJobs = getNumberEnv("XUANXUAN_MEITUAN_MAX_JOBS", 60);
const meituanPageSize = getNumberEnv("XUANXUAN_MEITUAN_PAGE_SIZE", 15);
const meituanKeywords = getListEnv("XUANXUAN_MEITUAN_KEYWORDS", ["AI", "算法", "后端", "数据", "产品", "履约", "无人配送", "平台", "安全", "实习"]);
const jdMaxJobs = getNumberEnv("XUANXUAN_JD_MAX_JOBS", 72);
const jdPageSize = getNumberEnv("XUANXUAN_JD_PAGE_SIZE", 18);
const jdKeywords = getListEnv("XUANXUAN_JD_KEYWORDS", ["算法", "AI", "大模型", "后端", "数据", "产品", "供应链", "物流", "零售", "实习"]);
const huaweiMaxJobs = getNumberEnv("XUANXUAN_HUAWEI_MAX_JOBS", 84);
const huaweiPageSize = getNumberEnv("XUANXUAN_HUAWEI_PAGE_SIZE", 21);
const huaweiKeywords = getListEnv("XUANXUAN_HUAWEI_KEYWORDS", ["AI", "软件开发", "算法", "通信", "芯片", "云计算", "终端", "供应链", ""]);
const kuaishouMaxJobs = getNumberEnv("XUANXUAN_KUAISHOU_MAX_JOBS", 48);
const kuaishouPageSize = getNumberEnv("XUANXUAN_KUAISHOU_PAGE_SIZE", 12);
const kuaishouKeywords = getListEnv("XUANXUAN_KUAISHOU_KEYWORDS", ["AI", "recommendation", "data", "product", "e-commerce", "content", "creator"]);
const bilibiliMaxJobs = getNumberEnv("XUANXUAN_BILIBILI_MAX_JOBS", 72);
const bilibiliPageSize = getNumberEnv("XUANXUAN_BILIBILI_PAGE_SIZE", 18);
const bilibiliKeywords = getListEnv("XUANXUAN_BILIBILI_KEYWORDS", ["AI", "推荐", "算法", "前端", "产品", "内容", "安全", "数据", "实习"]);
const xiaomiMaxJobs = getNumberEnv("XUANXUAN_XIAOMI_MAX_JOBS", 72);
const xiaomiPageSize = getNumberEnv("XUANXUAN_XIAOMI_PAGE_SIZE", 12);
const xiaomiKeywords = getListEnv("XUANXUAN_XIAOMI_KEYWORDS", ["AI", "自动驾驶", "硬件", "嵌入式", "软件", "产品", "供应链", ""]);
const pddMaxJobs = getNumberEnv("XUANXUAN_PDD_MAX_JOBS", 48);
const pddPageSize = getNumberEnv("XUANXUAN_PDD_PAGE_SIZE", 10);
const mideaMaxJobs = getNumberEnv("XUANXUAN_MIDEA_MAX_JOBS", 64);
const mideaPageSize = getNumberEnv("XUANXUAN_MIDEA_PAGE_SIZE", 16);
const mideaProjectTypes = getListEnv("XUANXUAN_MIDEA_PROJECT_TYPES", ["1", "2", "9", "5", "8"]);
const mideaEmploymentCategories = getListEnv("XUANXUAN_MIDEA_EMPLOYMENT_CATEGORIES", ["1", "4"]);
const amazonMaxJobs = getNumberEnv("XUANXUAN_AMAZON_MAX_JOBS", 72);
const amazonPageSize = getNumberEnv("XUANXUAN_AMAZON_PAGE_SIZE", 12);
const amazonKeywords = getListEnv("XUANXUAN_AMAZON_KEYWORDS", ["marketing", "operations", "supply chain", "finance", "human resources", "retail", "program manager", "customer"]);
const ikeaMaxJobs = getNumberEnv("XUANXUAN_IKEA_MAX_JOBS", 56);
const ikeaPageSize = getNumberEnv("XUANXUAN_IKEA_PAGE_SIZE", 14);
const ikeaKeywords = getListEnv("XUANXUAN_IKEA_KEYWORDS", ["marketing", "retail", "customer", "supply chain", "logistics", "design", "sustainability", "finance"]);
const unileverMaxJobs = getNumberEnv("XUANXUAN_UNILEVER_MAX_JOBS", 64);
const unileverPageSize = getNumberEnv("XUANXUAN_UNILEVER_PAGE_SIZE", 16);
const unileverKeywords = getListEnv("XUANXUAN_UNILEVER_KEYWORDS", ["marketing", "brand", "supply chain", "finance", "human resources", "research", "retail", "sales"]);
const lorealMaxJobs = getNumberEnv("XUANXUAN_LOREAL_MAX_JOBS", 56);
const lorealKeywords = getListEnv("XUANXUAN_LOREAL_KEYWORDS", ["marketing", "brand", "retail", "finance", "supply chain", "digital", "sales", "research"]);

const knownSkills: Array<{ skill: string; patterns: RegExp[] }> = [
  { skill: "Python", patterns: [/\bpython\b/i] },
  { skill: "TypeScript", patterns: [/\btypescript\b|\bts\b/i] },
  { skill: "React", patterns: [/\breact\b/i] },
  { skill: "Go", patterns: [/\bgo\b|golang/i] },
  { skill: "Java", patterns: [/\bjava\b/i] },
  { skill: "C++", patterns: [/\bc\+\+\b/i] },
  { skill: "SQL", patterns: [/\bsql\b/i] },
  { skill: "PyTorch", patterns: [/\bpytorch\b/i] },
  { skill: "RAG", patterns: [/\brag\b|检索增强/i] },
  { skill: "Prompt Engineering", patterns: [/prompt/i] },
  { skill: "API 设计", patterns: [/\bapi\b|接口设计/i] },
  { skill: "机器学习", patterns: [/机器学习|machine learning/i] },
  { skill: "深度学习框架", patterns: [/深度学习|tensorflow|pytorch/i] },
  { skill: "大模型", patterns: [/大模型|llm|vlm|aigc|生成式/i] },
  { skill: "模型训练", patterns: [/模型训练|训练数据|训练方法/i] },
  { skill: "模型服务", patterns: [/模型服务|推理|部署/i] },
  { skill: "推荐系统", patterns: [/推荐系统|召回|排序|推荐算法/i] },
  { skill: "数据分析", patterns: [/数据分析|数据策略|指标|ab实验|a\/b/i] },
  { skill: "数据治理", patterns: [/数据治理|数据质量|数据生产|数据仓库/i] },
  { skill: "分布式系统", patterns: [/分布式|高并发|微服务/i] },
  { skill: "工程稳定性", patterns: [/稳定性|高可用|性能优化|工程效率/i] },
  { skill: "Linux", patterns: [/\blinux\b/i] },
  { skill: "MySQL", patterns: [/\bmysql\b/i] },
  { skill: "Redis", patterns: [/\bredis\b/i] },
  { skill: "云计算", patterns: [/云计算|云原生|火山引擎|云服务/i] },
  { skill: "前端工程化", patterns: [/前端工程|工程化|webpack|vite/i] },
  { skill: "产品理解", patterns: [/产品|用户需求|产品动态/i] },
  { skill: "项目推进", patterns: [/项目管理|项目推进|跨团队/i] },
  { skill: "沟通协作", patterns: [/沟通|协作|团队协作|供应商/i] },
  { skill: "英语", patterns: [/英语|英文|international|global/i] },
  { skill: "消费者洞察", patterns: [/消费者洞察|consumer insight|customer insight|market research|用户洞察/i] },
  { skill: "品牌策略", patterns: [/品牌|brand|campaign|整合营销|传播策略/i] },
  { skill: "渠道运营", patterns: [/渠道|channel|trade marketing|retail|门店|销售运营/i] },
  { skill: "供应链计划", patterns: [/供应链|supply chain|demand planning|inventory|物流|logistics|fulfillment/i] },
  { skill: "财务分析", patterns: [/财务|finance|financial analysis|p&l|预算|会计|审计|tax/i] },
  { skill: "客户服务", patterns: [/客户服务|customer service|guest|hospitality|customer experience|客户体验/i] },
  { skill: "门店运营", patterns: [/门店|store|retail operations|店铺|卖场/i] },
  { skill: "跨文化沟通", patterns: [/global|international|跨文化|英语|multicultural/i] },
];

const fallbackRequirements: Record<JobCategory, string[]> = {
  "AI Engineering": ["Python", "机器学习", "大模型", "模型训练", "沟通协作"],
  Backend: ["Go", "分布式系统", "Linux", "工程稳定性", "沟通协作"],
  Frontend: ["TypeScript", "React", "前端工程化", "产品理解", "沟通协作"],
  Data: ["SQL", "Python", "数据分析", "数据治理", "沟通协作"],
  Infrastructure: ["Linux", "分布式系统", "云计算", "工程稳定性", "沟通协作"],
  Product: ["产品理解", "数据分析", "项目推进", "沟通协作"],
  Design: ["产品理解", "沟通协作", "数据分析"],
  Security: ["工程稳定性", "数据分析", "沟通协作"],
  Business: ["消费者洞察", "品牌策略", "数据分析", "沟通协作", "英语"],
  Operations: ["供应链计划", "数据分析", "项目推进", "沟通协作"],
  Finance: ["财务分析", "数据分析", "Excel 建模", "合规意识", "英语"],
  Service: ["客户服务", "跨文化沟通", "沟通协作", "英语", "项目推进"],
};

const majorSignalRules: Array<{
  label: string;
  patterns: RegExp[];
  majors: string[];
  abilities: string[];
  weight: number;
}> = [
  {
    label: "AI/算法",
    patterns: [/ai|aigc|llm|agent|大模型|机器学习|深度学习|算法|推荐|搜索|nlp|cv|多模态|训练|推理/i],
    majors: ["人工智能", "计算机科学与技术", "软件工程", "数据科学与大数据技术"],
    abilities: ["Python", "机器学习", "数据结构", "模型训练", "工程落地"],
    weight: 42,
  },
  {
    label: "后端/平台",
    patterns: [/后端|服务端|server|java|go|c\+\+|分布式|高并发|微服务|架构|平台|数据库|存储/i],
    majors: ["计算机科学与技术", "软件工程", "网络工程", "信息管理与信息系统"],
    abilities: ["数据结构", "操作系统", "分布式系统", "数据库", "工程稳定性"],
    weight: 36,
  },
  {
    label: "前端/客户端",
    patterns: [/前端|客户端|web|react|vue|typescript|android|ios|小程序|体验|交互/i],
    majors: ["软件工程", "计算机科学与技术", "数字媒体技术", "工业设计"],
    abilities: ["TypeScript", "前端工程化", "用户体验", "产品理解", "工程交付"],
    weight: 34,
  },
  {
    label: "数据/商业分析",
    patterns: [/数据|数仓|bi|指标|分析|治理|ab实验|a\/b|策略|经营分析|商业分析|增长/i],
    majors: ["数据科学与大数据技术", "统计学", "信息管理与信息系统", "工业工程"],
    abilities: ["SQL", "Python", "指标体系", "数据分析", "业务理解"],
    weight: 34,
  },
  {
    label: "产品/运营",
    patterns: [/产品|用户|需求|运营|策略|商业化|增长|内容|社区|平台治理|管培/i],
    majors: ["信息管理与信息系统", "电子商务", "工业工程", "数字媒体技术"],
    abilities: ["产品理解", "用户研究", "数据分析", "项目推进", "沟通协作"],
    weight: 30,
  },
  {
    label: "安全/风控",
    patterns: [/安全|风控|隐私|攻防|漏洞|反作弊|反欺诈|合规|审核/i],
    majors: ["网络空间安全", "信息安全", "计算机科学与技术", "网络工程"],
    abilities: ["计算机网络", "操作系统", "安全攻防", "风险建模", "合规意识"],
    weight: 35,
  },
  {
    label: "机器人/自动化",
    patterns: [/机器人|自动化|自动驾驶|控制|嵌入式|传感器|智能制造|无人|飞控|slam/i],
    majors: ["自动化", "机器人工程", "智能制造工程", "机械电子工程", "人工智能"],
    abilities: ["C++", "控制理论", "嵌入式", "传感器", "工程实验"],
    weight: 36,
  },
  {
    label: "电子/硬件",
    patterns: [/硬件|芯片|半导体|集成电路|通信|射频|电路|pcb|iot|终端|mcu|电气/i],
    majors: ["电子信息工程", "通信工程", "集成电路设计与集成系统", "微电子科学与工程"],
    abilities: ["电路", "信号处理", "Linux", "硬件调试", "嵌入式"],
    weight: 35,
  },
  {
    label: "新能源/供应链",
    patterns: [/新能源|储能|电力|电气|供应链|物流|履约|采购|制造|质量|工厂|计划/i],
    majors: ["电气工程及其自动化", "新能源科学与工程", "工业工程", "物流工程"],
    abilities: ["工程现场", "运筹优化", "数据分析", "项目管理", "供应链建模"],
    weight: 31,
  },
  {
    label: "设计/内容",
    patterns: [/设计|视觉|交互|品牌|创意|游戏|策划|视频|美术|内容|aigc内容/i],
    majors: ["数字媒体技术", "工业设计", "产品设计", "网络与新媒体"],
    abilities: ["作品集", "用户体验", "审美表达", "内容策划", "AIGC 工具"],
    weight: 29,
  },
  {
    label: "金融/审计/精算",
    patterns: [/金融|投行|银行|证券|基金|财富|审计|会计|税务|精算|财务|估值|risk|wealth|audit|tax/i],
    majors: ["金融学", "会计学", "审计学", "经济学", "金融工程", "保险学", "精算学"],
    abilities: ["财务报表", "Excel 建模", "统计", "合规意识", "英语"],
    weight: 28,
  },
  {
    label: "咨询/人力/项目管理",
    patterns: [/咨询|商业分析|管培|人力资源|组织发展|项目管理|战略|客户成功|解决方案|consulting|human capital|customer success/i],
    majors: ["工商管理", "市场营销", "人力资源管理", "信息管理与信息系统", "社会学", "心理学"],
    abilities: ["结构化表达", "访谈调研", "数据分析", "PPT", "项目推进"],
    weight: 27,
  },
  {
    label: "快消/零售/品牌",
    patterns: [/快消|零售|品牌|营销|美妆|消费者|渠道|门店|销售|retail|marketing|brand|consumer/i],
    majors: ["市场营销", "广告学", "传播学", "电子商务", "食品科学与工程", "化妆品科学与技术"],
    abilities: ["消费者洞察", "品牌策略", "渠道运营", "数据复盘", "审美表达"],
    weight: 26,
  },
  {
    label: "酒店/旅游/航空服务",
    patterns: [/酒店|旅游|会展|航空|乘务|地勤|前厅|餐饮|客户体验|guest|hotel|aviation|hospitality/i],
    majors: ["酒店管理", "旅游管理", "会展经济与管理", "航空服务艺术与管理", "英语", "人力资源管理"],
    abilities: ["服务意识", "英语", "跨文化沟通", "运营排班", "危机处理"],
    weight: 25,
  },
  {
    label: "医护/药学/心理健康",
    patterns: [/临床|护理|药学|公共卫生|康复|心理|健康|医疗|医学|patient|clinical|pharma|health/i],
    majors: ["临床医学", "护理学", "药学", "公共卫生与预防医学", "心理学", "康复治疗学"],
    abilities: ["生命科学", "临床规范", "沟通共情", "统计", "伦理合规"],
    weight: 27,
  },
  {
    label: "教育/法务/公共事务",
    patterns: [/教师|教育|课程|培训|法务|法律|合规|公共事务|编辑|政策|legal|compliance|public affairs/i],
    majors: ["教育学", "汉语言文学", "英语", "法学", "公共事业管理", "新闻学"],
    abilities: ["写作表达", "公众表达", "法律检索", "政策理解", "组织协调"],
    weight: 26,
  },
  {
    label: "土木/建筑/环境",
    patterns: [/土木|建筑|城市|规划|环境|施工|工程管理|给排水|esg|双碳|bim|cad/i],
    majors: ["土木工程", "建筑学", "城乡规划", "工程管理", "环境工程", "给排水科学与工程"],
    abilities: ["工程图纸", "项目管理", "规范标准", "CAD/BIM", "现场沟通"],
    weight: 25,
  },
];

const categoryMajorFallbacks: Record<JobCategory, string[]> = {
  "AI Engineering": ["人工智能", "计算机科学与技术", "软件工程"],
  Backend: ["计算机科学与技术", "软件工程", "网络工程"],
  Frontend: ["软件工程", "计算机科学与技术", "数字媒体技术"],
  Data: ["数据科学与大数据技术", "统计学", "信息管理与信息系统"],
  Infrastructure: ["计算机科学与技术", "软件工程", "通信工程"],
  Product: ["信息管理与信息系统", "电子商务", "工业工程"],
  Design: ["数字媒体技术", "工业设计", "产品设计"],
  Security: ["网络空间安全", "信息安全", "计算机科学与技术"],
  Business: ["市场营销", "工商管理", "广告学", "传播学", "电子商务"],
  Operations: ["物流工程", "工业工程", "工程管理", "供应链管理"],
  Finance: ["金融学", "会计学", "审计学", "经济学"],
  Service: ["酒店管理", "旅游管理", "英语", "人力资源管理"],
};

const salaryBands: Record<JobCategory, Record<Job["seniority"], [number, number]>> = {
  "AI Engineering": {
    intern: [8, 16],
    junior: [25, 40],
    mid: [40, 70],
    senior: [70, 110],
  },
  Backend: {
    intern: [6, 12],
    junior: [22, 38],
    mid: [35, 65],
    senior: [55, 95],
  },
  Frontend: {
    intern: [5, 10],
    junior: [18, 32],
    mid: [30, 55],
    senior: [48, 82],
  },
  Data: {
    intern: [6, 12],
    junior: [22, 36],
    mid: [35, 65],
    senior: [55, 95],
  },
  Infrastructure: {
    intern: [6, 12],
    junior: [24, 40],
    mid: [38, 70],
    senior: [60, 105],
  },
  Product: {
    intern: [5, 10],
    junior: [18, 32],
    mid: [32, 58],
    senior: [52, 90],
  },
  Design: {
    intern: [4, 9],
    junior: [16, 28],
    mid: [28, 50],
    senior: [45, 75],
  },
  Security: {
    intern: [6, 12],
    junior: [24, 42],
    mid: [42, 75],
    senior: [65, 110],
  },
  Business: {
    intern: [4, 8],
    junior: [14, 26],
    mid: [26, 48],
    senior: [45, 82],
  },
  Operations: {
    intern: [4, 8],
    junior: [13, 24],
    mid: [24, 45],
    senior: [42, 78],
  },
  Finance: {
    intern: [5, 10],
    junior: [16, 30],
    mid: [30, 58],
    senior: [55, 95],
  },
  Service: {
    intern: [3, 7],
    junior: [10, 18],
    mid: [18, 35],
    senior: [32, 62],
  },
};

async function main() {
  const byteDanceStartedAt = new Date().toISOString();
  const byteDanceResult = disabledSignedAdapterResult("ByteDance");
  const tencentStartedAt = new Date().toISOString();
  const tencentResult = await fetchTencentJobs();
  const alibabaStartedAt = new Date().toISOString();
  const alibabaResult = await fetchAlibabaJobs();
  const baiduStartedAt = new Date().toISOString();
  const baiduResult = await fetchBaiduJobs();
  const meituanStartedAt = new Date().toISOString();
  const meituanResult = await fetchMeituanJobs();
  const jdStartedAt = new Date().toISOString();
  const jdResult = await fetchJdJobs();
  const huaweiStartedAt = new Date().toISOString();
  const huaweiResult = await fetchHuaweiJobs();
  const kuaishouStartedAt = new Date().toISOString();
  const kuaishouResult = await fetchKuaishouJobs();
  const bilibiliStartedAt = new Date().toISOString();
  const bilibiliResult = await fetchBilibiliJobs();
  const xiaomiStartedAt = new Date().toISOString();
  const xiaomiResult = disabledSignedAdapterResult("Xiaomi");
  const pddStartedAt = new Date().toISOString();
  const pddResult = await fetchPddJobs();
  const mideaStartedAt = new Date().toISOString();
  const mideaResult = await fetchMideaJobs();
  const amazonStartedAt = new Date().toISOString();
  const amazonResult = await fetchAmazonJobs();
  const ikeaStartedAt = new Date().toISOString();
  const ikeaResult = await fetchIkeaJobs();
  const unileverStartedAt = new Date().toISOString();
  const unileverResult = await fetchUnileverJobs();
  const lorealStartedAt = new Date().toISOString();
  const lorealResult = await fetchLorealJobs();
  const jobs = dedupeJobs([
    ...byteDanceResult.jobs,
    ...tencentResult.jobs,
    ...alibabaResult.jobs,
    ...baiduResult.jobs,
    ...meituanResult.jobs,
    ...jdResult.jobs,
    ...huaweiResult.jobs,
    ...kuaishouResult.jobs,
    ...bilibiliResult.jobs,
    ...xiaomiResult.jobs,
    ...pddResult.jobs,
    ...mideaResult.jobs,
    ...amazonResult.jobs,
    ...ikeaResult.jobs,
    ...unileverResult.jobs,
    ...lorealResult.jobs,
  ])
    .map(enrichJobCareerSignals)
    .map(redactJobForPublication);

  if (jobs.length === 0) {
    throw new Error("Official-site adapters returned zero normalized jobs; refusing to write empty app data.");
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    note: "Official-site normalized job payload. Full official descriptions are not republished; records keep short generated summaries, source links, salary signals, and matching metadata. Official sites remain the source of truth.",
    careerSignalCoverage: summarizeCareerSignalCoverage(jobs),
    sources: [
      {
        ...bytedanceCompany,
        adapter: "official-site:bytedance",
        startedAt: byteDanceStartedAt,
        officialApiBase: bytedanceBaseUrl,
        signerChunkUrl: byteDanceResult.signerChunkUrl,
        queryKeywords: keywords,
        requestedLimit: maxJobs,
        fetchedRawCount: byteDanceResult.rawCount,
        normalizedCount: byteDanceResult.jobs.length,
        queryStats: byteDanceResult.queryStats,
      },
      {
        ...tencentCompany,
        adapter: "official-site:tencent",
        startedAt: tencentStartedAt,
        officialApiBase: tencentBaseUrl,
        queryKeywords: tencentKeywords,
        requestedLimit: tencentMaxJobs,
        fetchedRawCount: tencentResult.rawCount,
        normalizedCount: tencentResult.jobs.length,
        queryStats: tencentResult.queryStats,
      },
      {
        ...alibabaCompany,
        adapter: "official-site:alibaba-campus",
        startedAt: alibabaStartedAt,
        officialApiBase: `${alibabaBaseUrl}/position/search`,
        queryKeywords: alibabaKeywords,
        activeBatches: alibabaResult.activeBatches,
        requestedLimit: alibabaMaxJobs,
        fetchedRawCount: alibabaResult.rawCount,
        normalizedCount: alibabaResult.jobs.length,
        queryStats: alibabaResult.queryStats,
      },
      {
        ...baiduCompany,
        adapter: "official-site:baidu",
        startedAt: baiduStartedAt,
        officialApiBase: baiduBaseUrl,
        queryKeywords: baiduKeywords,
        sourcePages: baiduPages,
        requestedLimit: baiduMaxJobs,
        fetchedRawCount: baiduResult.rawCount,
        normalizedCount: baiduResult.jobs.length,
        queryStats: baiduResult.queryStats,
      },
      {
        ...meituanCompany,
        adapter: "official-site:meituan",
        startedAt: meituanStartedAt,
        officialApiBase: meituanBaseUrl,
        queryKeywords: meituanKeywords,
        requestedLimit: meituanMaxJobs,
        fetchedRawCount: meituanResult.rawCount,
        normalizedCount: meituanResult.jobs.length,
        queryStats: meituanResult.queryStats,
      },
      {
        ...jdCompany,
        adapter: "official-site:jd",
        startedAt: jdStartedAt,
        officialApiBase: jdBaseUrl,
        queryKeywords: jdKeywords,
        requestedLimit: jdMaxJobs,
        fetchedRawCount: jdResult.rawCount,
        normalizedCount: jdResult.jobs.length,
        queryStats: jdResult.queryStats,
      },
      {
        ...huaweiCompany,
        adapter: "official-site:huawei-career",
        startedAt: huaweiStartedAt,
        officialApiBase: `${huaweiBaseUrl}/reccampportal/services/portal/portalpub/getJob/newHr`,
        queryKeywords: huaweiKeywords,
        requestedLimit: huaweiMaxJobs,
        fetchedRawCount: huaweiResult.rawCount,
        normalizedCount: huaweiResult.jobs.length,
        queryStats: huaweiResult.queryStats,
      },
      {
        ...kuaishouCompany,
        adapter: "official-site:kuaishou-workday",
        startedAt: kuaishouStartedAt,
        officialApiBase: `${kuaishouBaseUrl}/wday/cxs/kwai/${kuaishouSitePath}`,
        queryKeywords: kuaishouKeywords,
        requestedLimit: kuaishouMaxJobs,
        fetchedRawCount: kuaishouResult.rawCount,
        normalizedCount: kuaishouResult.jobs.length,
        queryStats: kuaishouResult.queryStats,
      },
      {
        ...bilibiliCompany,
        adapter: "official-site:bilibili",
        startedAt: bilibiliStartedAt,
        officialApiBase: bilibiliBaseUrl,
        queryKeywords: bilibiliKeywords,
        requestedLimit: bilibiliMaxJobs,
        fetchedRawCount: bilibiliResult.rawCount,
        normalizedCount: bilibiliResult.jobs.length,
        queryStats: bilibiliResult.queryStats,
      },
      {
        ...xiaomiCompany,
        adapter: "official-site:xiaomi-feishu-ats",
        startedAt: xiaomiStartedAt,
        officialApiBase: xiaomiBaseUrl,
        signerChunkUrl: xiaomiResult.signerChunkUrl,
        queryKeywords: xiaomiKeywords,
        requestedLimit: xiaomiMaxJobs,
        fetchedRawCount: xiaomiResult.rawCount,
        normalizedCount: xiaomiResult.jobs.length,
        queryStats: xiaomiResult.queryStats,
      },
      {
        ...pddCompany,
        adapter: "official-site:pdd-campus",
        startedAt: pddStartedAt,
        officialApiBase: `${pddBaseUrl}/api/careers/api/recruit`,
        requestedLimit: pddMaxJobs,
        fetchedRawCount: pddResult.rawCount,
        normalizedCount: pddResult.jobs.length,
        queryStats: pddResult.queryStats,
      },
      {
        ...mideaCompany,
        adapter: "official-site:midea-campus",
        startedAt: mideaStartedAt,
        officialApiBase: mideaApiBaseUrl,
        queryProjectTypes: mideaProjectTypes,
        queryEmploymentCategories: mideaEmploymentCategories,
        requestedLimit: mideaMaxJobs,
        fetchedRawCount: mideaResult.rawCount,
        normalizedCount: mideaResult.jobs.length,
        queryStats: mideaResult.queryStats,
      },
      {
        ...amazonCompany,
        adapter: "official-site:amazon-search-json",
        startedAt: amazonStartedAt,
        officialApiBase: `${amazonBaseUrl}/en/search.json`,
        queryKeywords: amazonKeywords,
        requestedLimit: amazonMaxJobs,
        fetchedRawCount: amazonResult.rawCount,
        normalizedCount: amazonResult.jobs.length,
        queryStats: amazonResult.queryStats,
      },
      {
        ...ikeaCompany,
        adapter: "official-site:ikea-talentbrew",
        startedAt: ikeaStartedAt,
        officialApiBase: `${ikeaBaseUrl}/en/search-jobs/results`,
        queryKeywords: ikeaKeywords,
        requestedLimit: ikeaMaxJobs,
        fetchedRawCount: ikeaResult.rawCount,
        normalizedCount: ikeaResult.jobs.length,
        queryStats: ikeaResult.queryStats,
      },
      {
        ...unileverCompany,
        adapter: "official-site:unilever-workday",
        startedAt: unileverStartedAt,
        officialApiBase: `${unileverBaseUrl}/wday/cxs/${unileverTenant}`,
        queryKeywords: unileverKeywords,
        querySites: unileverSites.map((site) => site.sitePath),
        requestedLimit: unileverMaxJobs,
        fetchedRawCount: unileverResult.rawCount,
        normalizedCount: unileverResult.jobs.length,
        queryStats: unileverResult.queryStats,
      },
      {
        ...lorealCompany,
        adapter: "official-site:loreal-avature",
        startedAt: lorealStartedAt,
        officialApiBase: `${lorealBaseUrl}/en_US/jobs/SearchJobsAJAXJSON`,
        queryKeywords: lorealKeywords,
        requestedLimit: lorealMaxJobs,
        fetchedRawCount: lorealResult.rawCount,
        normalizedCount: lorealResult.jobs.length,
        queryStats: lorealResult.queryStats,
      },
    ],
    jobs,
  };

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(normalizedJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeFileSync(legacySeedJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeFileSync(generatedTsPath, renderGeneratedModule(payload.generatedAt, payload.sources, payload.careerSignalCoverage, jobs), "utf8");

  console.log(`Wrote ${normalizedJsonPath}`);
  console.log(`Wrote ${legacySeedJsonPath}`);
  console.log(`Wrote ${generatedTsPath}`);
  console.log(`Normalized ${jobs.length} official jobs from ${payload.sources.length} live adapters.`);
  for (const source of payload.sources) {
    console.log(`- ${source.companyName}: ${source.normalizedCount}/${source.fetchedRawCount} normalized records.`);
  }
}

async function createByteDanceClient() {
  const { signer, signerChunkUrl } = await loadByteDanceSigner();
  const auth = await refreshByteDanceToken();

  return {
    signer,
    signerChunkUrl,
    auth,
    async post<T>(path: string, body: JsonRecord): Promise<T> {
      const bodyWithEntrance = { ...body, portal_entrance: 1 };
      return requestSigned<T>(signer, auth, "POST", path, bodyWithEntrance);
    },
    async get<T>(path: string, params: JsonRecord): Promise<T> {
      return requestSigned<T>(signer, auth, "GET", path, params);
    },
  };
}

async function loadByteDanceSigner(): Promise<{ signer: ByteDanceSigner; signerChunkUrl: string }> {
  const homeHtml = await fetchText(bytedanceHomeUrl);
  const scriptUrls = extractScriptUrls(homeHtml);

  for (const scriptUrl of scriptUrls) {
    const source = await fetchText(scriptUrl);
    if (!source.includes("57195:function")) {
      continue;
    }

    throw new Error(`ByteDance signed adapter disabled: refusing to execute remote signer chunk ${scriptUrl}`);
  }

  throw new Error("ByteDance signed adapter disabled: no safe non-executing signer path is configured.");
}

async function refreshByteDanceToken() {
  const response = await fetch(`${bytedanceBaseUrl}/api/v1/csrf/token`, {
    method: "POST",
    headers: byteDanceHeaders(),
    body: JSON.stringify({ portal_entrance: 1 }),
  });

  if (!response.ok) {
    throw new Error(`ByteDance CSRF token request failed with HTTP ${response.status}`);
  }

  const json = (await response.json()) as { code?: number; data?: { token?: string }; message?: string };
  if (json.code !== 0 || !json.data?.token) {
    throw new Error(`ByteDance CSRF token response was not usable: ${JSON.stringify(json).slice(0, 240)}`);
  }

  return {
    csrfToken: json.data.token,
    cookie: response.headers.get("set-cookie")?.split(";")[0] ?? "",
  };
}

async function requestSigned<T>(
  signer: ByteDanceSigner,
  auth: { csrfToken: string; cookie: string },
  method: "GET" | "POST",
  path: string,
  payload: JsonRecord,
): Promise<T> {
  const signedPathBase = appendQuery(path, payload);
  const signature = signer({ body: method === "POST" ? payload : {}, url: signedPathBase });
  const separator = signedPathBase.includes("?") ? "&" : "?";
  const url = `${bytedanceBaseUrl}${signedPathBase}${separator}_signature=${encodeURIComponent(signature)}`;
  const response = await fetch(url, {
    method,
    headers: {
      ...byteDanceHeaders(),
      "x-csrf-token": auth.csrfToken,
      cookie: auth.cookie,
      "website-path": "/",
    },
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ByteDance ${method} ${path} failed with HTTP ${response.status}: ${body.slice(0, 240)}`);
  }

  const json = (await response.json()) as { code?: number; message?: string; error?: unknown };
  if (json.code !== 0) {
    throw new Error(`ByteDance ${method} ${path} returned code ${json.code}: ${json.message ?? JSON.stringify(json.error)}`);
  }

  return json as T;
}

async function fetchByteDanceJobs(adapter: Awaited<ReturnType<typeof createByteDanceClient>>) {
  const byId = new Map<string, ByteDanceRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of keywords) {
    let offset = 0;
    let returnedForKeyword = 0;

    while (byId.size < maxJobs && returnedForKeyword < pageSize) {
      const body = createListRequest(keyword, pageSize, offset);
      const response = await adapter.post<ByteDanceListResponse>("/api/v1/search/job/posts", body);
      const list = response.data?.job_post_list ?? [];

      for (const item of list) {
        if (item.id && !byId.has(item.id)) {
          byId.set(item.id, item);
        }
        if (byId.size >= maxJobs) {
          break;
        }
      }

      returnedForKeyword += list.length;
      offset += pageSize;

      if (list.length < pageSize) {
        break;
      }
    }

    queryStats.push({ keyword, returned: returnedForKeyword, total: undefined });
    if (byId.size >= maxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, maxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map((job) => fetchByteDanceDetail(adapter, job)));
  const jobs = dedupeJobs(enrichedJobs.map(normalizeByteDanceJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
    signerChunkUrl: adapter.signerChunkUrl,
  };
}

function createListRequest(keyword: string, limit: number, offset: number): JsonRecord {
  return {
    keyword,
    limit,
    offset,
    job_hot_flag: undefined,
    job_category_id_list: [],
    tag_id_list: [],
    location_code_list: [],
    subject_id_list: [],
    recruitment_id_list: [],
    portal_type: 2,
    job_function_id_list: [],
    storefront_id_list: [],
  };
}

async function fetchByteDanceDetail(adapter: Awaited<ReturnType<typeof createByteDanceClient>>, listItem: ByteDanceRawJob) {
  if (!listItem.id) {
    return listItem;
  }

  try {
    const response = await adapter.get<ByteDanceDetailResponse>(`/api/v1/job/posts/${listItem.id}`, {
      portal_type: 2,
      source_job_post_id: "",
      with_recommend: false,
    });
    return response.data?.job_post_detail ?? listItem;
  } catch (error) {
    console.warn(`Detail fetch failed for ByteDance job ${listItem.id}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

async function fetchTencentJobs() {
  const byId = new Map<string, TencentRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of tencentKeywords) {
    let pageIndex = 1;
    let returnedForKeyword = 0;

    while (byId.size < tencentMaxJobs && returnedForKeyword < tencentPageSize) {
      const url = `${tencentBaseUrl}/tencentcareer/api/post/Query?${new URLSearchParams({
        timestamp: String(Date.now()),
        countryId: "",
        cityId: "",
        bgIds: "",
        productId: "",
        categoryId: "",
        parentCategoryId: "",
        attrId: "",
        keyword,
        pageIndex: String(pageIndex),
        pageSize: String(tencentPageSize),
        language: "zh-cn",
        area: "cn",
      }).toString()}`;
      const response = await fetchJson<TencentQueryResponse>(url, tencentHeaders());
      if (response.Code !== 200) {
        throw new Error(`Tencent query returned code ${response.Code} for keyword ${keyword}`);
      }

      const list = response.Data?.Posts ?? [];
      for (const item of list) {
        if (item.PostId && !byId.has(item.PostId)) {
          byId.set(item.PostId, item);
        }
        if (byId.size >= tencentMaxJobs) {
          break;
        }
      }

      returnedForKeyword += list.length;
      pageIndex += 1;
      if (list.length < tencentPageSize) {
        break;
      }
    }

    queryStats.push({ keyword, returned: returnedForKeyword });
    if (byId.size >= tencentMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, tencentMaxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map(fetchTencentDetail));
  const jobs = dedupeJobs(enrichedJobs.map(normalizeTencentJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchTencentDetail(listItem: TencentRawJob) {
  if (!listItem.PostId) {
    return listItem;
  }

  try {
    const url = `${tencentBaseUrl}/tencentcareer/api/post/ByPostId?${new URLSearchParams({
      timestamp: String(Date.now()),
      postId: listItem.PostId,
      language: "zh-cn",
    }).toString()}`;
    const response = await fetchJson<TencentDetailResponse>(url, tencentHeaders());
    if (response.Code !== 200) {
      throw new Error(`Tencent detail returned code ${response.Code}`);
    }
    return response.Data ? { ...listItem, ...response.Data } : listItem;
  } catch (error) {
    console.warn(`Detail fetch failed for Tencent job ${listItem.PostId}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

async function fetchAlibabaJobs() {
  const session = await createAlibabaSession();
  const selectedBatches = session.batches.filter((batch) => batch.id);
  const byId = new Map<string, AlibabaRawJob>();
  const perBatchLimit = Math.max(alibabaPageSize, Math.ceil(alibabaMaxJobs / Math.max(selectedBatches.length, 1)));
  const perKeywordLimit = Math.max(2, Math.ceil(perBatchLimit / Math.max(alibabaKeywords.length, 1)));
  const queryStats: Array<{ keyword: string; batch: string; returned: number; total?: number; error?: string }> = [];

  for (const batch of selectedBatches) {
    let acceptedForBatch = 0;

    for (const keyword of alibabaKeywords) {
      if (byId.size >= alibabaMaxJobs || acceptedForBatch >= perBatchLimit) break;

      try {
        const response = await alibabaPost<AlibabaPositionSearchResponse>(session, "/position/search", {
          batchId: batch.id,
          searchKey: keyword || undefined,
          pageIndex: 1,
          pageSize: alibabaPageSize,
          ...(batch.aliStar ? { aliStar: "Y" } : {}),
        });

        if (!response.success) {
          throw new Error(`Alibaba search returned code ${response.errorCode}: ${response.errorMsg ?? "unknown"}`);
        }

        const list = response.content?.datas ?? [];
        queryStats.push({
          keyword: keyword || "<empty>",
          batch: cleanText(batch.name) || cleanString(batch.id),
          returned: list.length,
          total: response.content?.totalCount,
        });

        let acceptedForKeyword = 0;
        for (const item of list) {
          const key = alibabaJobKey(item);
          if (key && !byId.has(key)) {
            byId.set(key, item);
            acceptedForBatch += 1;
            acceptedForKeyword += 1;
          }
          if (byId.size >= alibabaMaxJobs || acceptedForBatch >= perBatchLimit || acceptedForKeyword >= perKeywordLimit) {
            break;
          }
        }
      } catch (error) {
        const message = formatError(error);
        queryStats.push({
          keyword: keyword || "<empty>",
          batch: cleanText(batch.name) || cleanString(batch.id),
          returned: 0,
          error: message,
        });
        console.warn(`Alibaba query failed for "${keyword || "<empty>"}"; continuing. ${message}`);
      }
    }

    let fillPageIndex = 1;
    while (byId.size < alibabaMaxJobs && acceptedForBatch < perBatchLimit) {
      try {
        const response = await alibabaPost<AlibabaPositionSearchResponse>(session, "/position/search", {
          batchId: batch.id,
          pageIndex: fillPageIndex,
          pageSize: alibabaPageSize,
          ...(batch.aliStar ? { aliStar: "Y" } : {}),
        });

        if (!response.success) {
          throw new Error(`Alibaba fill search returned code ${response.errorCode}: ${response.errorMsg ?? "unknown"}`);
        }

        const list = response.content?.datas ?? [];
        queryStats.push({
          keyword: `<fill:p${fillPageIndex}>`,
          batch: cleanText(batch.name) || cleanString(batch.id),
          returned: list.length,
          total: response.content?.totalCount,
        });

        for (const item of list) {
          const key = alibabaJobKey(item);
          if (key && !byId.has(key)) {
            byId.set(key, item);
            acceptedForBatch += 1;
          }
          if (byId.size >= alibabaMaxJobs || acceptedForBatch >= perBatchLimit) {
            break;
          }
        }

        const total = response.content?.totalCount ?? 0;
        if (list.length < alibabaPageSize || (total > 0 && fillPageIndex * alibabaPageSize >= total)) {
          break;
        }
        fillPageIndex += 1;
      } catch (error) {
        const message = formatError(error);
        queryStats.push({
          keyword: `<fill:p${fillPageIndex}>`,
          batch: cleanText(batch.name) || cleanString(batch.id),
          returned: 0,
          error: message,
        });
        console.warn(`Alibaba fill query failed for batch "${cleanText(batch.name) || cleanString(batch.id)}"; continuing. ${message}`);
        break;
      }
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, alibabaMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeAlibabaJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
    activeBatches: selectedBatches.map((batch) => ({
      id: cleanString(batch.id),
      name: cleanText(batch.name) || cleanText(batch.enName) || cleanString(batch.id),
      group: batch.group,
      aliStar: Boolean(batch.aliStar),
    })),
  };
}

async function createAlibabaSession(): Promise<AlibabaSession> {
  const response = await fetch(alibabaCompany.sourceUrl, {
    headers: {
      "user-agent": byteDanceHeaders()["user-agent"],
      referer: alibabaBaseUrl,
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${alibabaCompany.sourceUrl} failed with HTTP ${response.status}`);
  }

  const cookie = cookieHeaderFromResponse(response.headers);
  const html = await response.text();
  const csrfToken = html.match(/__token__:\s*"([^"]+)"/)?.[1] || cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || "";

  if (!csrfToken || !cookie) {
    throw new Error("Alibaba campus session did not expose a usable CSRF token and cookie.");
  }

  const session: AlibabaSession = { csrfToken, cookie, batches: [] };
  const responseBody = await alibabaPost<AlibabaBatchListResponse>(session, "/searchCondition/listBatch", {});

  if (!responseBody.success) {
    throw new Error(`Alibaba batch list returned code ${responseBody.errorCode}: ${responseBody.errorMsg ?? "unknown"}`);
  }

  const batches = extractAlibabaBatches(responseBody.content);
  if (!batches.length) {
    throw new Error("Alibaba campus site returned no active recruitment batches.");
  }

  return { ...session, batches };
}

async function alibabaPost<T>(session: Pick<AlibabaSession, "csrfToken" | "cookie">, path: string, body: JsonRecord): Promise<T> {
  const url = `${alibabaBaseUrl}${path}?_csrf=${encodeURIComponent(session.csrfToken)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: alibabaHeaders(session.cookie),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST ${url} failed with HTTP ${response.status}: ${text.slice(0, 240)}`);
  }

  return response.json() as Promise<T>;
}

function extractAlibabaBatches(content: AlibabaBatchListResponse["content"]) {
  if (!content) return [];
  const groups = content.sequence?.length ? content.sequence : ["graduate", "internship", "topTalentPlan"];
  const batches: Array<AlibabaBatch & { group: string; aliStar?: boolean }> = [];

  for (const group of groups) {
    const list = content[group];
    if (!Array.isArray(list)) continue;

    for (const item of list) {
      if (!item || typeof item !== "object" || !("id" in item)) continue;
      batches.push({
        ...(item as AlibabaBatch),
        group,
        aliStar: group === "topTalentPlan",
      });
    }
  }

  return batches;
}

async function fetchBaiduJobs() {
  const byId = new Map<string, BaiduRawJob>();
  const pageStats: Array<{ page: string; returned: number; total?: number }> = [];

  for (const pageUrl of baiduPages) {
    const response = await fetch(pageUrl, { headers: baiduHeaders(pageUrl) });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Baidu official page ${pageUrl} failed with HTTP ${response.status}: ${body.slice(0, 240)}`);
    }

    const data = extractBaiduInitialData(await response.text(), pageUrl);
    const list = extractBaiduJobs(data);
    for (const item of list) {
      const key = baiduJobKey(item);
      if (key && !byId.has(key)) {
        byId.set(key, item);
      }
    }

    pageStats.push({ page: pageUrl, returned: list.length, total: data.listData?.total });
  }

  const allRawJobs = Array.from(byId.values());
  const selected = new Map<string, BaiduRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of baiduKeywords) {
    const matching = allRawJobs.filter((job) => baiduJobMatchesKeyword(job, keyword));
    queryStats.push({ keyword, returned: matching.length, total: allRawJobs.length });

    for (const item of matching) {
      const key = baiduJobKey(item);
      if (key && !selected.has(key)) {
        selected.set(key, item);
      }
      if (selected.size >= baiduMaxJobs) {
        break;
      }
    }
    if (selected.size >= baiduMaxJobs) {
      break;
    }
  }

  for (const item of allRawJobs) {
    const key = baiduJobKey(item);
    if (key && !selected.has(key)) {
      selected.set(key, item);
    }
    if (selected.size >= baiduMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(selected.values()).slice(0, baiduMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeBaiduJob));

  return {
    jobs,
    rawCount: allRawJobs.length,
    queryStats: [...queryStats, ...pageStats.map((stat) => ({ keyword: `page:${stat.page}`, returned: stat.returned, total: stat.total }))],
  };
}

async function fetchMeituanJobs() {
  const byId = new Map<string, MeituanRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of meituanKeywords) {
    let pageNo = 1;
    let returnedForKeyword = 0;

    while (byId.size < meituanMaxJobs && returnedForKeyword < meituanPageSize) {
      const response = await fetchJson<MeituanListResponse>(
        `${meituanBaseUrl}/api/official/job/getJobList`,
        meituanHeaders(),
        {
          method: "POST",
          body: JSON.stringify({
            keywords: keyword,
            page: {
              pageNo,
              pageSize: meituanPageSize,
            },
          }),
        },
      );
      if (response.status !== 1) {
        throw new Error(`Meituan query returned status ${response.status} for keyword ${keyword}: ${response.message ?? "unknown"}`);
      }

      const list = response.data?.list ?? [];
      for (const item of list) {
        if (item.jobUnionId && !byId.has(item.jobUnionId)) {
          byId.set(item.jobUnionId, item);
        }
        if (byId.size >= meituanMaxJobs) {
          break;
        }
      }

      returnedForKeyword += list.length;
      queryStats.push({ keyword, returned: list.length, total: response.data?.total });
      pageNo += 1;
      if (list.length < meituanPageSize) {
        break;
      }
    }
    if (byId.size >= meituanMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, meituanMaxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map(fetchMeituanDetail));
  const jobs = dedupeJobs(enrichedJobs.map(normalizeMeituanJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchMeituanDetail(listItem: MeituanRawJob) {
  if (!listItem.jobUnionId) {
    return listItem;
  }

  try {
    const response = await fetchJson<MeituanDetailResponse>(
      `${meituanBaseUrl}/api/official/job/getJobDetail`,
      meituanHeaders(),
      {
        method: "POST",
        body: JSON.stringify({ jobUnionId: listItem.jobUnionId }),
      },
    );
    if (response.status !== 1) {
      throw new Error(`Meituan detail returned status ${response.status}: ${response.message ?? "unknown"}`);
    }
    return response.data ? { ...listItem, ...response.data } : listItem;
  } catch (error) {
    console.warn(`Detail fetch failed for Meituan job ${listItem.jobUnionId}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

async function fetchJdJobs() {
  const byId = new Map<string, JdRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of jdKeywords) {
    let pageIndex = 0;

    while (byId.size < jdMaxJobs) {
      const body = new URLSearchParams({
        pageIndex: String(pageIndex),
        pageSize: String(jdPageSize),
        workCityJson: "[]",
        jobTypeJson: "[]",
        jobSearch: keyword,
        depTypeJson: "[]",
      });
      const list = await fetchJson<JdRawJob[]>(`${jdBaseUrl}/web/job/job_list`, jdHeaders(), {
        method: "POST",
        body,
      });

      queryStats.push({ keyword: pageIndex > 0 ? `${keyword}:p${pageIndex + 1}` : keyword, returned: list.length });

      for (const item of list) {
        const key = jdJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, item);
        }
        if (byId.size >= jdMaxJobs) {
          break;
        }
      }

      pageIndex += 1;
      if (list.length < jdPageSize || pageIndex >= 3) {
        break;
      }
    }

    if (byId.size >= jdMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, jdMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeJdJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchHuaweiJobs() {
  const byId = new Map<string, HuaweiRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of huaweiKeywords) {
    let pageIndex = 1;
    let returnedForKeyword = 0;

    while (byId.size < huaweiMaxJobs && pageIndex <= 4) {
      const url = createHuaweiJobListUrl(keyword, pageIndex);
      const response = await fetchJson<HuaweiJobListResponse>(url, huaweiHeaders());
      const list = response.result ?? [];

      for (const item of list) {
        const key = huaweiJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, item);
        }
        if (byId.size >= huaweiMaxJobs) {
          break;
        }
      }

      returnedForKeyword += list.length;
      pageIndex += 1;
      if (list.length < huaweiPageSize) {
        break;
      }
    }

    queryStats.push({ keyword: keyword || "(all)", returned: returnedForKeyword, total: undefined });
    if (byId.size >= huaweiMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, huaweiMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeHuaweiJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

function createHuaweiJobListUrl(keyword: string, pageIndex: number) {
  const url = new URL(`${huaweiBaseUrl}/reccampportal/services/portal/portalpub/getJob/newHr/page/${huaweiPageSize}/${pageIndex}`);
  if (keyword) {
    url.searchParams.set("searchText", keyword);
  }
  url.searchParams.set("language", "zh_CN");
  url.searchParams.set("orderBy", "ISS_STARTDATE_DESC_AND_IS_HOT_JOB");
  url.searchParams.set("reqTime", String(Date.now()));
  return url.href;
}

async function fetchKuaishouJobs() {
  const byPath = new Map<string, WorkdayJobPosting>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of kuaishouKeywords) {
    let offset = 0;
    let returnedForKeyword = 0;

    while (byPath.size < kuaishouMaxJobs && offset < kuaishouMaxJobs) {
      const response = await fetchJson<WorkdayJobsResponse>(
        `${kuaishouBaseUrl}/wday/cxs/kwai/${kuaishouSitePath}/jobs`,
        kuaishouHeaders(),
        {
          method: "POST",
          body: JSON.stringify({
            appliedFacets: {},
            limit: kuaishouPageSize,
            offset,
            searchText: keyword,
          }),
        },
      );

      const list = response.jobPostings ?? [];
      for (const item of list) {
        if (item.externalPath && !byPath.has(item.externalPath)) {
          byPath.set(item.externalPath, item);
        }
        if (byPath.size >= kuaishouMaxJobs) {
          break;
        }
      }

      returnedForKeyword += list.length;
      offset += kuaishouPageSize;
      queryStats.push({ keyword, returned: list.length, total: response.total });

      if (list.length < kuaishouPageSize) {
        break;
      }
    }

    if (byPath.size >= kuaishouMaxJobs) {
      break;
    }

    queryStats.push({ keyword: `${keyword}:total`, returned: returnedForKeyword });
  }

  const rawJobs = Array.from(byPath.values()).slice(0, kuaishouMaxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map(fetchKuaishouDetail));
  const jobs = dedupeJobs(enrichedJobs.map(normalizeKuaishouJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchBilibiliJobs() {
  const csrfToken = await fetchBilibiliCsrfToken();
  const byId = new Map<string, BilibiliRawJob>();
  const queryStats: Array<{ keyword: string; channel: "social" | "campus"; returned: number; total?: number; error?: string }> = [];
  const channels: Array<{
    id: "social" | "campus";
    url: string;
    makeBody: (keyword: string) => JsonRecord;
  }> = [
    {
      id: "social",
      url: `${bilibiliBaseUrl}/api/rts/position/query/list`,
      makeBody: (keyword) => ({
        pageNum: 1,
        pageSize: bilibiliPageSize,
        positionName: keyword,
        postCode: "",
        postCodeList: "",
        workLocationList: "",
        workTypeList: [],
        positionTypeList: [],
        deptCodeList: "",
        onlyHotRecruit: 0,
      }),
    },
    {
      id: "campus",
      url: `${bilibiliBaseUrl}/api/campus/position/positionList`,
      makeBody: (keyword) => ({
        pageNum: 1,
        pageSize: bilibiliPageSize,
        positionName: keyword,
        postCode: "",
        postCodeList: "",
        workLocationList: "",
        workTypeList: [],
        positionTypeList: [],
        deptCodeList: "",
        recruitType: 1,
        practiceTypes: [],
        onlyHotRecruit: 0,
      }),
    },
  ];

  for (const keyword of bilibiliKeywords) {
    if (byId.size >= bilibiliMaxJobs) break;

    for (const channel of channels) {
      if (byId.size >= bilibiliMaxJobs) break;

      try {
        const response = await fetchJson<BilibiliListResponse>(channel.url, bilibiliHeaders(csrfToken), {
          method: "POST",
          body: JSON.stringify(channel.makeBody(keyword)),
        });

        if (response.code !== 0) {
          throw new Error(`Bilibili ${channel.id} list returned code ${response.code}: ${response.message ?? "unknown"}`);
        }

        const list = (response.data?.list ?? []).map((job) => ({ ...job, sourceChannel: channel.id }));
        queryStats.push({ keyword, channel: channel.id, returned: list.length, total: response.data?.total });

        for (const item of list) {
          const key = bilibiliJobKey(item);
          if (key && !byId.has(key)) {
            byId.set(key, item);
          }
          if (byId.size >= bilibiliMaxJobs) {
            break;
          }
        }
      } catch (error) {
        const message = formatError(error);
        queryStats.push({ keyword, channel: channel.id, returned: 0, error: message });
        console.warn(`Bilibili ${channel.id} query failed for "${keyword}"; continuing. ${message}`);
      }
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, bilibiliMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeBilibiliJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchBilibiliCsrfToken() {
  const response = await fetchJson<BilibiliTokenResponse>(
    `${bilibiliBaseUrl}/api/auth/v1/csrf/token`,
    bilibiliHeaders(),
  );

  if (response.code !== 0 || !response.data) {
    throw new Error(`Bilibili CSRF token response was not usable: ${response.message ?? JSON.stringify(response).slice(0, 240)}`);
  }

  return response.data;
}

async function fetchXiaomiJobs() {
  const signerResult = await loadXiaomiSigner();
  const auth = await fetchXiaomiCsrfToken();
  const byId = new Map<string, XiaomiRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number; error?: string }> = [];

  for (const keyword of xiaomiKeywords) {
    if (byId.size >= xiaomiMaxJobs) break;

    try {
      const response = await requestXiaomiSigned<XiaomiListResponse>(
        signerResult.signer,
        auth,
        "/api/v1/search/job/posts",
        {
          keyword,
          limit: xiaomiPageSize,
          offset: 0,
          job_category_id_list: [],
          tag_id_list: [],
          location_code_list: [],
          subject_id_list: [],
          recruitment_id_list: [],
          portal_type: 6,
          job_function_id_list: [],
          storefront_id_list: [],
          portal_entrance: 1,
        },
      );

      if (response.code !== 0) {
        throw new Error(`Xiaomi list returned code ${response.code}: ${response.message ?? "unknown"}`);
      }

      const list = response.data?.job_post_list ?? [];
      queryStats.push({ keyword: keyword || "<empty>", returned: list.length, total: response.data?.count });

      for (const item of list) {
        const key = xiaomiJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, item);
        }
        if (byId.size >= xiaomiMaxJobs) {
          break;
        }
      }
    } catch (error) {
      const message = formatError(error);
      queryStats.push({ keyword: keyword || "<empty>", returned: 0, error: message });
      console.warn(`Xiaomi query failed for "${keyword || "<empty>"}"; continuing. ${message}`);
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, xiaomiMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeXiaomiJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
    signerChunkUrl: signerResult.signerChunkUrl,
  };
}

async function fetchXiaomiCsrfToken() {
  const response = await fetch(`${xiaomiBaseUrl}/api/v1/csrf/token`, {
    method: "POST",
    headers: xiaomiHeaders(),
    body: JSON.stringify({ portal_entrance: 1 }),
  });

  if (!response.ok) {
    throw new Error(`Xiaomi CSRF token request failed with HTTP ${response.status}`);
  }

  const json = (await response.json()) as XiaomiTokenResponse;
  if (json.code !== 0 || !json.data?.token) {
    throw new Error(`Xiaomi CSRF token response was not usable: ${json.message ?? JSON.stringify(json).slice(0, 240)}`);
  }

  return {
    csrfToken: json.data.token,
    cookie: response.headers.get("set-cookie")?.split(";")[0] ?? `atsx-csrf-token=${encodeURIComponent(json.data.token)}`,
  };
}

async function loadXiaomiSigner(): Promise<{ signer: ByteDanceSigner; signerChunkUrl: string }> {
  const portalHtml = await fetchText(xiaomiCompany.sourceUrl);
  const scriptUrls = extractScriptUrls(portalHtml, xiaomiCompany.sourceUrl);

  for (const scriptUrl of scriptUrls) {
    const source = await fetchText(scriptUrl);
    if (!source.includes("57195:function")) {
      continue;
    }

    throw new Error(`Xiaomi signed adapter disabled: refusing to execute remote signer chunk ${scriptUrl}`);
  }

  throw new Error("Xiaomi signed adapter disabled: no safe non-executing signer path is configured.");
}

async function requestXiaomiSigned<T>(
  signer: ByteDanceSigner,
  auth: { csrfToken: string; cookie: string },
  path: string,
  body: JsonRecord,
): Promise<T> {
  const signedPathBase = appendQuery(path, body);
  const signature = signer({ body, url: signedPathBase });
  const separator = signedPathBase.includes("?") ? "&" : "?";
  const url = `${xiaomiBaseUrl}${signedPathBase}${separator}_signature=${encodeURIComponent(signature)}`;

  return fetchJson<T>(url, xiaomiHeaders(auth), {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function fetchPddJobs() {
  const byId = new Map<string, PddRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];
  const listEndpoints = [
    { keyword: "grad", path: "api/recruit/position/list" },
    { keyword: "intern", path: "api/recruit/position/train/list" },
  ];

  for (const endpoint of listEndpoints) {
    let page = 1;
    let total = 0;

    while (byId.size < pddMaxJobs) {
      const response = await fetchJson<PddListResponse>(
        `${pddBaseUrl}/api/careers/${endpoint.path}`,
        pddHeaders(),
        {
          method: "POST",
          body: JSON.stringify({ page, pageSize: pddPageSize }),
        },
      );

      if (!response.success) {
        throw new Error(`PDD ${endpoint.keyword} list returned code ${response.errorCode}: ${response.errorMsg ?? "unknown"}`);
      }

      const list = response.result?.list ?? [];
      total = Number(response.result?.total ?? total) || total;
      queryStats.push({ keyword: `${endpoint.keyword}:p${page}`, returned: list.length, total });

      for (const item of list) {
        const key = pddJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, item);
        }
        if (byId.size >= pddMaxJobs) {
          break;
        }
      }

      if (list.length < pddPageSize || (total > 0 && page * pddPageSize >= total)) {
        break;
      }
      page += 1;
    }

    if (byId.size >= pddMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, pddMaxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map(fetchPddDetail));
  const jobs = dedupeJobs(enrichedJobs.map(normalizePddJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchPddDetail(listItem: PddRawJob) {
  const id = cleanText(listItem.id);
  if (!id) {
    return listItem;
  }

  try {
    const response = await fetchJson<PddDetailResponse>(
      `${pddBaseUrl}/api/careers/api/recruit/position/detail`,
      pddHeaders(`${pddCompany.sourceUrl}/detail?positionId=${encodeURIComponent(id)}`),
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );

    if (!response.success) {
      throw new Error(`PDD detail returned code ${response.errorCode}: ${response.errorMsg ?? "unknown"}`);
    }

    return response.result ? { ...listItem, ...response.result } : listItem;
  } catch (error) {
    console.warn(`Detail fetch failed for PDD job ${id}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

async function fetchMideaJobs() {
  const byId = new Map<string, MideaRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];
  const projectQuery = appendQuery("/school/position/common/project/list", {
    status: "1",
    projectTypes: mideaProjectTypes.join(","),
    employementCategories: mideaEmploymentCategories.join(","),
  });
  const projectResponse = await fetchJson<MideaProjectListResponse>(`${mideaApiBaseUrl}${projectQuery}`, mideaHeaders());

  if (projectResponse.code !== "0") {
    throw new Error(`Midea project list returned code ${projectResponse.code}: ${projectResponse.message ?? "unknown"}`);
  }

  const projects = (projectResponse.data ?? []).filter((project) => cleanText(project.projectRuleId));

  for (const project of projects) {
    const projectRuleId = cleanText(project.projectRuleId);
    const projectName = cleanText(project.projectRuleName) || projectRuleId;
    let pageIndex = 1;

    while (byId.size < mideaMaxJobs) {
      const response = await fetchJson<MideaPositionListResponse>(
        `${mideaApiBaseUrl}/school/position/common/position/list`,
        mideaHeaders(),
        {
          method: "POST",
          body: JSON.stringify({
            keyword: null,
            superiorIds: [],
            recruitCategoryIds: [],
            workPlaceCodes: [],
            projectRuleId,
            pageIndex,
            pageSize: mideaPageSize,
          }),
        },
      );

      if (response.code !== "0") {
        throw new Error(`Midea position list returned code ${response.code}: ${response.message ?? "unknown"}`);
      }

      const list = response.data?.data ?? [];
      const total = response.data?.total;
      queryStats.push({ keyword: pageIndex > 1 ? `${projectName}:p${pageIndex}` : projectName, returned: list.length, total });

      for (const item of list) {
        const key = mideaJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, {
            ...item,
            sourceProjectName: projectName,
            sourceProjectType: cleanText(project.projectType),
          });
        }
        if (byId.size >= mideaMaxJobs) {
          break;
        }
      }

      pageIndex += 1;
      if (list.length < mideaPageSize || pageIndex > 4) {
        break;
      }
    }

    if (byId.size >= mideaMaxJobs) {
      break;
    }
  }

  const rawJobs = Array.from(byId.values()).slice(0, mideaMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeMideaJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchUnileverJobs() {
  const byKey = new Map<string, UnileverRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const site of unileverSites) {
    for (const keyword of unileverKeywords) {
      let offset = 0;
      let returnedForKeyword = 0;

      while (byKey.size < unileverMaxJobs && offset < unileverMaxJobs) {
        const response = await fetchJson<WorkdayJobsResponse>(
          `${unileverBaseUrl}/wday/cxs/${unileverTenant}/${site.sitePath}/jobs`,
          workdayHeaders(unileverCompany.sourceUrl),
          {
            method: "POST",
            body: JSON.stringify({
              appliedFacets: {},
              limit: unileverPageSize,
              offset,
              searchText: keyword,
            }),
          },
        );

        const list = response.jobPostings ?? [];
        for (const item of list) {
          if (!item.externalPath) continue;
          const key = `${site.sitePath}:${item.externalPath}`;
          if (!byKey.has(key)) {
            byKey.set(key, {
              ...item,
              sitePath: site.sitePath,
              siteLabel: site.label,
              searchKeyword: keyword,
            });
          }
          if (byKey.size >= unileverMaxJobs) break;
        }

        returnedForKeyword += list.length;
        queryStats.push({ keyword: `${site.label}:${keyword}:p${offset / unileverPageSize + 1}`, returned: list.length, total: response.total });
        offset += unileverPageSize;

        if (list.length < unileverPageSize) break;
      }

      queryStats.push({ keyword: `${site.label}:${keyword}:total`, returned: returnedForKeyword });
      if (byKey.size >= unileverMaxJobs) break;
    }
    if (byKey.size >= unileverMaxJobs) break;
  }

  const rawJobs = Array.from(byKey.values()).slice(0, unileverMaxJobs);
  const enrichedJobs = await Promise.all(rawJobs.map(fetchUnileverDetail));
  const jobs = dedupeJobs(enrichedJobs.map(normalizeUnileverJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchAmazonJobs() {
  const byId = new Map<string, AmazonRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of amazonKeywords) {
    let offset = 0;

    while (byId.size < amazonMaxJobs && offset < amazonMaxJobs) {
      const url = new URL(`${amazonBaseUrl}/en/search.json`);
      url.searchParams.set("offset", String(offset));
      url.searchParams.set("result_limit", String(amazonPageSize));
      url.searchParams.set("sort", "relevant");
      url.searchParams.set("base_query", keyword);

      const response = await fetchJson<AmazonSearchResponse>(url.href, amazonHeaders());
      const list = response.jobs ?? [];
      queryStats.push({ keyword: offset > 0 ? `${keyword}:p${offset / amazonPageSize + 1}` : keyword, returned: list.length, total: response.hits });

      for (const item of list) {
        const key = amazonJobKey(item);
        if (key && !byId.has(key)) {
          byId.set(key, item);
        }
        if (byId.size >= amazonMaxJobs) break;
      }

      offset += amazonPageSize;
      if (list.length < amazonPageSize) break;
    }

    if (byId.size >= amazonMaxJobs) break;
  }

  const rawJobs = Array.from(byId.values()).slice(0, amazonMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeAmazonJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchIkeaJobs() {
  const byId = new Map<string, IkeaRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of ikeaKeywords) {
    let page = 1;

    while (byId.size < ikeaMaxJobs && page <= 5) {
      const url = new URL(`${ikeaBaseUrl}/en/search-jobs/results`);
      url.searchParams.set("ActiveFacetID", "0");
      url.searchParams.set("CurrentPage", String(page));
      url.searchParams.set("RecordsPerPage", String(ikeaPageSize));
      url.searchParams.set("Keywords", keyword);
      url.searchParams.set("Distance", "50");
      url.searchParams.set("RadiusUnitType", "0");
      url.searchParams.set("ShowRadius", "False");
      url.searchParams.set("IsPagination", "True");
      url.searchParams.set("SearchResultsModuleName", "Search Results");
      url.searchParams.set("SearchFiltersModuleName", "Search Filters");
      url.searchParams.set("SortCriteria", "0");
      url.searchParams.set("SortDirection", "0");
      url.searchParams.set("SearchType", "5");
      url.searchParams.set("OrganizationIds", "22908");

      const response = await fetchJson<IkeaSearchResponse>(url.href, ikeaHeaders(), {
        headers: { "x-requested-with": "XMLHttpRequest" },
      });
      const parsedJobs = parseIkeaJobs(response.results ?? "", keyword);
      const total = Number(readHtmlDataAttribute(response.results ?? "", "total-job-results")) || undefined;
      queryStats.push({ keyword: page > 1 ? `${keyword}:p${page}` : keyword, returned: parsedJobs.length, total });

      for (const item of parsedJobs) {
        if (!byId.has(item.id)) {
          byId.set(item.id, item);
        }
        if (byId.size >= ikeaMaxJobs) break;
      }

      if (!response.hasJobs || parsedJobs.length < ikeaPageSize) break;
      page += 1;
    }

    if (byId.size >= ikeaMaxJobs) break;
  }

  const rawJobs = Array.from(byId.values()).slice(0, ikeaMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeIkeaJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchLorealJobs() {
  const byId = new Map<string, LorealRawJob>();
  const queryStats: Array<{ keyword: string; returned: number; total?: number }> = [];

  for (const keyword of lorealKeywords) {
    const url = new URL(`${lorealBaseUrl}/en_US/jobs/SearchJobsAJAXJSON`);
    url.searchParams.set("s", "1");
    url.searchParams.set("search", keyword);

    const list = await fetchJson<LorealRawJob[]>(url.href, lorealHeaders());
    queryStats.push({ keyword, returned: list.length, total: list.length });

    for (const item of list) {
      const key = lorealJobKey(item);
      if (key && !byId.has(key)) {
        byId.set(key, { ...item, searchKeyword: keyword });
      }
      if (byId.size >= lorealMaxJobs) break;
    }

    if (byId.size >= lorealMaxJobs) break;
  }

  const rawJobs = Array.from(byId.values()).slice(0, lorealMaxJobs);
  const jobs = dedupeJobs(rawJobs.map(normalizeLorealJob));

  return {
    jobs,
    rawCount: rawJobs.length,
    queryStats,
  };
}

async function fetchKuaishouDetail(listItem: WorkdayJobPosting): Promise<KuaishouRawJob> {
  if (!listItem.externalPath) {
    return listItem;
  }

  try {
    const detail = await fetchJson<WorkdayJobDetailResponse>(
      `${kuaishouBaseUrl}/wday/cxs/kwai/${kuaishouSitePath}${listItem.externalPath}`,
      kuaishouHeaders(),
    );
    return { ...listItem, ...detail };
  } catch (error) {
    console.warn(`Detail fetch failed for Kuaishou job ${listItem.externalPath}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

async function fetchUnileverDetail(listItem: UnileverRawJob): Promise<UnileverRawJob> {
  if (!listItem.externalPath || !listItem.sitePath) {
    return listItem;
  }

  try {
    const detail = await fetchJson<WorkdayJobDetailResponse>(
      `${unileverBaseUrl}/wday/cxs/${unileverTenant}/${listItem.sitePath}${listItem.externalPath}`,
      workdayHeaders(unileverCompany.sourceUrl),
    );
    return { ...listItem, ...detail };
  } catch (error) {
    console.warn(`Detail fetch failed for Unilever job ${listItem.externalPath}; using list record. ${formatError(error)}`);
    return listItem;
  }
}

function extractBaiduInitialData(html: string, pageUrl: string): BaiduInitialData {
  const match = html.match(/window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\})\s*;\s*window\.prefix=/);
  if (!match) {
    throw new Error(`Baidu official page ${pageUrl} did not expose window.__INITIAL_DATA__.`);
  }

  const serialized = match[1]
    .replace(/:\s*undefined/g, ":null")
    .replace(/\[\s*undefined\s*\]/g, "[null]")
    .replace(/,\s*undefined\s*,/g, ",null,");

  try {
    return JSON.parse(serialized) as BaiduInitialData;
  } catch (error) {
    throw new Error(`Could not parse Baidu SSR job payload from ${pageUrl}: ${formatError(error)}`);
  }
}

function extractBaiduJobs(data: BaiduInitialData) {
  const jobs = [...(data.listData?.listDetailData ?? [])];
  const detail = data.detailData?.postInfo;
  if (detail) {
    jobs.push(detail);
  }
  return jobs;
}

function baiduJobKey(raw: BaiduRawJob) {
  return cleanText(raw.postId) || cleanText(raw.jobId) || cleanText(raw.name);
}

function alibabaJobKey(raw: AlibabaRawJob) {
  return cleanString(raw.id) || cleanText(raw.code) || slugify(cleanText(raw.name));
}

function baiduJobMatchesKeyword(raw: BaiduRawJob, keyword: string) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return true;
  return [
    raw.name,
    raw.postType,
    raw.projectType,
    raw.bgShortName,
    raw.orgName,
    raw.workPlace,
    raw.workContent,
    raw.serviceCondition,
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase()
    .includes(normalized);
}

function jdJobKey(raw: JdRawJob) {
  return cleanText(raw.requirementId) || cleanText(raw.positionId) || cleanText(raw.positionCode) || cleanText(raw.reqNumber) || cleanText(raw.positionNameOpen);
}

function huaweiJobKey(raw: HuaweiRawJob) {
  return cleanString(raw.jobRequirementId) || cleanString(raw.jobId) || cleanText(raw.advertisementCode) || cleanText(raw.positionReqCode) || slugify(cleanText(raw.jobname));
}

function mideaJobKey(raw: MideaRawJob) {
  return cleanText(raw.positionId) || cleanText(raw.projectPositionDto?.positionCode) || cleanText(raw.projectPositionId) || cleanText(raw.projectPositionName);
}

function amazonJobKey(raw: AmazonRawJob) {
  return cleanString(raw.id) || cleanText(raw.job_path) || slugify(cleanText(raw.title));
}

function lorealJobKey(raw: LorealRawJob) {
  return cleanString(raw.id) || slugify(cleanText(raw.value) || cleanText(raw.label));
}

function bilibiliJobKey(raw: BilibiliRawJob) {
  const id = cleanText(raw.atsPositionBasicId) || cleanText(raw.id);
  const channel = cleanText(raw.sourceChannel);
  const title = slugify(cleanText(raw.positionName));
  const location = slugify(cleanText(raw.workCity) || cleanText(raw.workLocation));
  return id ? `${channel || "bilibili"}-${id}` : `${channel || "bilibili"}-${title}-${location}`;
}

function xiaomiJobKey(raw: XiaomiRawJob) {
  return cleanText(raw.id) || cleanText(raw.code) || slugify(cleanText(raw.title));
}

function pddJobKey(raw: PddRawJob) {
  return cleanText(raw.id) || cleanText(raw.code) || slugify(cleanText(raw.name));
}

function normalizeByteDanceJob(raw: ByteDanceRawJob): Job {
  const title = cleanText(raw.title) || "字节跳动岗位";
  const allText = [title, raw.description, raw.requirement, raw.job_category?.name, raw.job_category?.en_name].filter(Boolean).join("\n");
  const category = classifyJob(raw, allText);
  const requirements = extractRequirements(allText, category);
  const direction = inferDirection(title, raw, category);
  const location = inferLocation(raw);
  const seniority = inferSeniority(raw, allText);

  return {
    id: `bd-${raw.id ?? raw.code ?? slugify(title)}`,
    companyId: bytedanceCompany.companyId,
    companyName: bytedanceCompany.companyName,
    title,
    department: inferDepartment(raw, direction),
    location,
    category,
    sourceUrl: raw.id ? `${bytedanceBaseUrl}${bytedancePositionPath}/${raw.id}/detail` : bytedanceHomeUrl,
    description: cleanText(raw.description) || title,
    requirements,
    tags: inferTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferSalary(raw, category, seniority, location),
  };
}

function normalizeTencentJob(raw: TencentRawJob): Job {
  const title = cleanText(raw.RecruitPostName) || "腾讯岗位";
  const allText = [title, raw.Responsibility, raw.Requirement, raw.CategoryName, raw.ProductName, raw.BGName].filter(Boolean).join("\n");
  const category = classifyText(cleanText(raw.CategoryName), allText);
  const requirements = extractRequirements(allText, category);
  const location = cleanText(raw.LocationName) || "未标注城市";
  const seniority = inferTencentSeniority(raw, allText);
  const direction = cleanText(raw.ProductName) || cleanText(raw.BGName) || category;

  return {
    id: `tencent-${raw.PostId ?? slugify(title)}`,
    companyId: tencentCompany.companyId,
    companyName: tencentCompany.companyName,
    title,
    department: cleanText(raw.BGName) || direction || tencentCompany.companyName,
    location,
    category,
    sourceUrl: raw.PostId ? `${tencentBaseUrl}/jobdesc.html?postId=${raw.PostId}` : tencentCompany.sourceUrl,
    description: cleanText(raw.Responsibility) || title,
    requirements,
    tags: inferTencentTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "腾讯官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeAlibabaJob(raw: AlibabaRawJob): Job {
  const title = cleanText(raw.name) || "阿里巴巴岗位";
  const description = cleanText(raw.description) || title;
  const requirementText = cleanText(raw.requirement);
  const categoryName = cleanText(raw.categoryName) || cleanText(raw.categoryType);
  const businessGroup = (raw.circleNames ?? []).map(cleanText).filter(Boolean).join(" / ");
  const allText = [
    title,
    description,
    requirementText,
    categoryName,
    raw.batchName,
    raw.niuKeProjectName,
    raw.degree,
    raw.project,
    businessGroup,
  ]
    .filter(Boolean)
    .join("\n");
  const category = classifyAlibabaJob(title, categoryName, allText);
  const requirements = extractAlibabaRequirements(allText, category);
  const location = inferAlibabaLocation(raw);
  const seniority = inferAlibabaSeniority(raw, allText);
  const direction = inferAlibabaDirection(title, categoryName, allText, category);
  const key = alibabaJobKey(raw) || slugify(title);

  return {
    id: `alibaba-${key}`,
    companyId: alibabaCompany.companyId,
    companyName: alibabaCompany.companyName,
    title,
    department: businessGroup || cleanText(raw.department) || cleanText(raw.batchName) || direction || alibabaCompany.companyName,
    location,
    category,
    sourceUrl: `${alibabaBaseUrl}/campus/position-detail?positionId=${encodeURIComponent(key)}`,
    description,
    requirements,
    tags: inferAlibabaTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "阿里巴巴校园招聘官网未公开薪资；按岗位类别、校园批次和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeBaiduJob(raw: BaiduRawJob): Job {
  const title = cleanText(raw.name) || "百度岗位";
  const allText = [title, raw.workContent, raw.serviceCondition, raw.postType, raw.projectType, raw.bgShortName, raw.orgName].filter(Boolean).join("\n");
  const category = classifyText(cleanText(raw.postType), allText);
  const requirements = extractRequirements(allText, category);
  const location = cleanText(raw.workPlace) || "未标注城市";
  const seniority = inferBaiduSeniority(raw, allText);
  const direction = cleanText(raw.projectType) || cleanText(raw.bgShortName) || cleanText(raw.postType) || category;

  return {
    id: `baidu-${baiduJobKey(raw) ?? slugify(title)}`,
    companyId: baiduCompany.companyId,
    companyName: baiduCompany.companyName,
    title,
    department: cleanText(raw.orgName) || cleanText(raw.bgShortName) || direction || baiduCompany.companyName,
    location,
    category,
    sourceUrl: baiduCompany.sourceUrl,
    description: cleanText(raw.workContent) || cleanText(raw.serviceCondition) || title,
    requirements,
    tags: inferBaiduTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "百度官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeMeituanJob(raw: MeituanRawJob): Job {
  const title = cleanText(raw.name) || "美团岗位";
  const allText = [title, raw.jobDuty, raw.jobRequirement, raw.departmentIntro, raw.highLight, raw.jobFamily, raw.jobFamilyGroup, raw.projectName].filter(Boolean).join("\n");
  const category = classifyText(`${cleanText(raw.jobFamily)} ${cleanText(raw.jobFamilyGroup)}`, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferMeituanLocation(raw);
  const seniority = inferMeituanSeniority(raw, allText);
  const direction = cleanText(raw.projectName) || cleanText(raw.jobFamilyGroup) || cleanText(raw.jobFamily) || category;

  return {
    id: `meituan-${raw.jobUnionId ?? slugify(title)}`,
    companyId: meituanCompany.companyId,
    companyName: meituanCompany.companyName,
    title,
    department: inferMeituanDepartment(raw, direction),
    location,
    category,
    sourceUrl: raw.jobUnionId ? `${meituanDetailBaseUrl}/position/detail?jobUnionId=${raw.jobUnionId}` : meituanCompany.sourceUrl,
    description: cleanText(raw.jobDuty) || cleanText(raw.departmentIntro) || title,
    requirements,
    tags: inferMeituanTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "美团官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeJdJob(raw: JdRawJob): Job {
  const title = cleanText(raw.positionNameOpen) || cleanText(raw.positionName) || "京东岗位";
  const allText = [title, raw.workContent, raw.qualification, raw.jobType, raw.positionDeptName, raw.lvlName].filter(Boolean).join("\n");
  const category = classifyText(cleanText(raw.jobType), allText);
  const requirements = extractRequirements(allText, category);
  const location = cleanText(raw.workCity) || "未标注城市";
  const seniority = inferJdSeniority(raw, allText);
  const direction = cleanText(raw.jobType) || category;

  return {
    id: `jd-${jdJobKey(raw) ?? slugify(title)}`,
    companyId: jdCompany.companyId,
    companyName: jdCompany.companyName,
    title,
    department: cleanText(raw.positionDeptName) || direction || jdCompany.companyName,
    location,
    category,
    sourceUrl: jdCompany.sourceUrl,
    description: cleanText(raw.workContent) || title,
    requirements,
    tags: inferJdTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "京东官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeHuaweiJob(raw: HuaweiRawJob): Job {
  const title = cleanText(raw.jobname) || cleanText(raw.nameCn) || "华为岗位";
  const description = cleanText(raw.mainBusiness) || cleanText(raw.mainBusinessEn) || title;
  const requirementText = cleanText(raw.jobRequire) || cleanText(raw.jobRequireEn);
  const categoryName = cleanText(raw.jobFamilyName) || cleanText(raw.jobFamilyCode) || cleanText(raw.jobSubcategory);
  const allText = [
    title,
    description,
    requirementText,
    categoryName,
    raw.deptName,
    raw.deptFullName,
    raw.degree,
    raw.workYear,
    raw.jobArea,
  ]
    .filter(Boolean)
    .join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferHuaweiLocation(raw);
  const seniority = inferHuaweiSeniority(raw, allText);
  const direction = inferHuaweiDirection(title, categoryName, allText, category);
  const key = huaweiJobKey(raw) || slugify(title);
  const jobId = cleanString(raw.jobId) || cleanText(raw.advertisementCode) || key;
  const jobRequirementId = cleanString(raw.jobRequirementId);

  return {
    id: `huawei-${key}`,
    companyId: huaweiCompany.companyId,
    companyName: huaweiCompany.companyName,
    title,
    department: cleanText(raw.deptName) || cleanText(raw.deptFullName) || direction || huaweiCompany.companyName,
    location,
    category,
    sourceUrl: `${huaweiBaseUrl}/reccampportal/portal5/campus-recruitment-detail.html?jobId=${encodeURIComponent(jobId)}&jobRequirementId=${encodeURIComponent(jobRequirementId)}`,
    description,
    requirements,
    tags: inferHuaweiTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "华为招聘官网未公开薪资；按岗位类别、招聘类型和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeKuaishouJob(raw: KuaishouRawJob): Job {
  const detail = raw.jobPostingInfo;
  const title = cleanText(detail?.title) || cleanText(raw.title) || "快手岗位";
  const description = stripHtmlToText(detail?.jobDescription) || title;
  const location = cleanText(detail?.location) || cleanText(raw.locationsText) || "未标注城市";
  const organization = cleanText(raw.hiringOrganization?.name);
  const allText = [title, description, location, organization, raw.timeType, detail?.timeType].filter(Boolean).join("\n");
  const category = classifyText("", allText);
  const requirements = extractRequirements(allText, category);
  const seniority = inferKuaishouSeniority(raw, allText);
  const direction = inferKuaishouDirection(title, description, category);
  const sourceUrl = cleanText(detail?.externalUrl) || (raw.externalPath ? `${kuaishouCompany.sourceUrl}${raw.externalPath}` : kuaishouCompany.sourceUrl);

  return {
    id: `kuaishou-${cleanText(detail?.jobReqId) || cleanText(raw.bulletFields?.[0]) || slugify(title)}`,
    companyId: kuaishouCompany.companyId,
    companyName: kuaishouCompany.companyName,
    title,
    department: organization || direction || kuaishouCompany.companyName,
    location,
    category,
    sourceUrl,
    description,
    requirements,
    tags: inferKuaishouTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "快手 Workday 官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeUnileverJob(raw: UnileverRawJob): Job {
  const detail = raw.jobPostingInfo;
  const title = cleanText(detail?.title) || cleanText(raw.title) || "Unilever role";
  const description = stripHtmlToText(detail?.jobDescription) || title;
  const location = cleanText(detail?.location) || cleanText(raw.locationsText) || "Global / not specified";
  const organization = cleanText(raw.hiringOrganization?.name);
  const categoryName = [organization, raw.searchKeyword, raw.siteLabel].map(cleanText).filter(Boolean).join(" / ");
  const allText = [title, description, location, categoryName, raw.timeType, detail?.timeType].filter(Boolean).join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const seniority = inferGlobalSeniority(allText);
  const direction = inferGlobalDirection(title, categoryName, allText, category);
  const sourceUrl = cleanText(detail?.externalUrl) || (raw.externalPath && raw.sitePath ? `${unileverBaseUrl}/${raw.sitePath}${raw.externalPath}` : unileverCompany.sourceUrl);

  return {
    id: `unilever-${cleanText(detail?.jobReqId) || cleanText(raw.bulletFields?.[0]) || slugify(title)}`,
    companyId: unileverCompany.companyId,
    companyName: unileverCompany.companyName,
    title,
    department: organization || direction || unileverCompany.companyName,
    location,
    category,
    sourceUrl,
    description,
    requirements,
    tags: inferGlobalTags([categoryName, raw.postedOn, raw.siteLabel, raw.searchKeyword], requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "Unilever Workday 官方站未公开薪资；按岗位类别、资历层级和地区系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeAmazonJob(raw: AmazonRawJob): Job {
  const title = cleanText(raw.title) || "Amazon role";
  const description = stripHtmlToText(raw.description) || stripHtmlToText(raw.description_short) || title;
  const qualificationText = [raw.basic_qualifications, raw.preferred_qualifications].map(stripHtmlToText).filter(Boolean).join("\n");
  const categoryName = [raw.job_category, raw.job_family, raw.business_category, raw.team, raw.primary_search_label].map(cleanText).filter(Boolean).join(" / ");
  const location = inferAmazonLocation(raw);
  const allText = [
    title,
    description,
    qualificationText,
    categoryName,
    raw.company_name,
    raw.job_schedule_type,
    raw.normalized_location,
    raw.country_code,
    ...(raw.optional_search_labels ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const seniority = inferGlobalSeniority(allText, { isIntern: raw.is_intern, isManager: raw.is_manager, universityJob: raw.university_job });
  const direction = inferGlobalDirection(title, categoryName, allText, category);
  const key = amazonJobKey(raw) || slugify(title);
  const salary =
    inferAmazonOfficialSalary([description, qualificationText].filter(Boolean).join("\n")) ??
    inferEstimatedSalary(category, seniority, location, "Amazon 官方招聘 API 未公开薪资；按岗位类别、资历层级和地区系数生成市场估算，每日随采集任务刷新。");

  return {
    id: `amazon-${key}`,
    companyId: amazonCompany.companyId,
    companyName: amazonCompany.companyName,
    title,
    department: cleanText(raw.team) || cleanText(raw.business_category) || direction || amazonCompany.companyName,
    location,
    category,
    sourceUrl: raw.job_path ? new URL(raw.job_path, amazonBaseUrl).href : amazonCompany.sourceUrl,
    description: [description, qualificationText].filter(Boolean).join("\n"),
    requirements,
    tags: inferGlobalTags([categoryName, raw.company_name, raw.job_schedule_type, raw.country_code, raw.primary_search_label, ...(raw.optional_search_labels ?? [])], requirements, category),
    direction,
    seniority,
    salary,
  };
}

function normalizeIkeaJob(raw: IkeaRawJob): Job {
  const title = raw.title || "IKEA role";
  const categoryName = cleanText(raw.categoryName);
  const location = cleanText(raw.location) || "Global / not specified";
  const allText = [title, categoryName, location, raw.jobType, raw.searchKeyword].filter(Boolean).join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const seniority = inferGlobalSeniority(allText);
  const direction = inferGlobalDirection(title, categoryName, allText, category);

  return {
    id: `ikea-${raw.id || slugify(title)}`,
    companyId: ikeaCompany.companyId,
    companyName: ikeaCompany.companyName,
    title,
    department: categoryName || direction || ikeaCompany.companyName,
    location,
    category,
    sourceUrl: new URL(raw.sourcePath, ikeaBaseUrl).href,
    description: allText,
    requirements,
    tags: inferGlobalTags([categoryName, raw.jobType, raw.searchKeyword], requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "IKEA 官方 TalentBrew 站未公开薪资；按岗位类别、资历层级和地区系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeLorealJob(raw: LorealRawJob): Job {
  const title = cleanText(raw.value) || cleanText(raw.label) || "L'Oreal role";
  const categoryName = cleanText(raw.category);
  const location = cleanText(raw.location).replace(/\s*-\s*$/, "") || "Global / not specified";
  const allText = [title, categoryName, location, raw.postedDate, raw.searchKeyword].filter(Boolean).join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const seniority = inferGlobalSeniority(allText);
  const direction = inferGlobalDirection(title, categoryName, allText, category);
  const key = lorealJobKey(raw) || slugify(title);

  return {
    id: `loreal-${key}`,
    companyId: lorealCompany.companyId,
    companyName: lorealCompany.companyName,
    title,
    department: categoryName || direction || lorealCompany.companyName,
    location,
    category,
    sourceUrl: cleanString(raw.id) ? `${lorealBaseUrl}/en_US/jobs/JobDetail?jobId=${encodeURIComponent(cleanString(raw.id))}` : lorealCompany.sourceUrl,
    description: allText,
    requirements,
    tags: inferGlobalTags([categoryName, raw.postedDate, raw.searchKeyword], requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "L'Oreal 官方 Avature 站未公开薪资；按岗位类别、资历层级和地区系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeBilibiliJob(raw: BilibiliRawJob): Job {
  const title = cleanText(raw.positionName) || "哔哩哔哩岗位";
  const description = cleanText(raw.positionDescriptions) || cleanText(raw.positionDescription) || title;
  const highlights = cleanText(raw.jobHighlights);
  const department = cleanText(raw.deptName) || cleanText(raw.deptIntro);
  const categoryName = cleanText(raw.postCodeName) || cleanText(raw.postCodeValue) || cleanText(raw.positionTypeName);
  const allText = [title, description, highlights, department, categoryName, raw.workExperience, raw.educationRequirements].filter(Boolean).join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferBilibiliLocation(raw);
  const seniority = inferBilibiliSeniority(raw, allText);
  const direction = inferBilibiliDirection(title, allText, category);
  const key = bilibiliJobKey(raw) || slugify(title);

  return {
    id: `bilibili-${key}`,
    companyId: bilibiliCompany.companyId,
    companyName: bilibiliCompany.companyName,
    title,
    department: department || direction || bilibiliCompany.companyName,
    location,
    category,
    sourceUrl: `${bilibiliCompany.sourceUrl}/?positionId=${encodeURIComponent(cleanText(raw.id) || key)}`,
    description,
    requirements,
    tags: inferBilibiliTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "哔哩哔哩官方招聘站未公开薪资；按岗位类别、招聘类型和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeXiaomiJob(raw: XiaomiRawJob): Job {
  const title = cleanText(raw.title) || "小米岗位";
  const description = cleanText(raw.description) || title;
  const requirementText = cleanText(raw.requirement);
  const categoryName = cleanText(raw.job_category?.name) || cleanText(raw.job_category?.i18n_name) || cleanText(raw.job_function?.name);
  const allText = [
    title,
    raw.sub_title,
    description,
    requirementText,
    categoryName,
    raw.department,
    raw.department_name,
    raw.subject?.name,
    raw.recruitment?.name,
  ]
    .filter(Boolean)
    .join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferXiaomiLocation(raw);
  const seniority = inferXiaomiSeniority(raw, allText);
  const direction = inferXiaomiDirection(title, categoryName, allText, category);
  const key = xiaomiJobKey(raw) || slugify(title);

  return {
    id: `xiaomi-${key}`,
    companyId: xiaomiCompany.companyId,
    companyName: xiaomiCompany.companyName,
    title,
    department: cleanText(raw.department) || cleanText(raw.department_name) || direction || xiaomiCompany.companyName,
    location,
    category,
    sourceUrl: `${xiaomiCompany.sourceUrl}/position/${encodeURIComponent(cleanText(raw.id) || key)}/detail`,
    description,
    requirements,
    tags: inferXiaomiTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "小米官方招聘域未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizePddJob(raw: PddRawJob): Job {
  const title = cleanText(raw.name) || "拼多多岗位";
  const description = cleanText(raw.jobDuty) || title;
  const requirementText = cleanText(raw.serveRequirement);
  const bonusText = cleanText(raw.bonus);
  const categoryName = cleanText(raw.jobName) || cleanText(raw.job);
  const allText = [
    title,
    description,
    requirementText,
    bonusText,
    categoryName,
    raw.recruitTypeName,
    raw.graduationYear,
    ...(raw.labelList ?? []),
  ]
    .filter(Boolean)
    .join("\n");
  const category = classifyPddJob(title, categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferPddLocation(raw);
  const seniority = inferPddSeniority(raw, allText);
  const direction = inferPddDirection(title, categoryName, allText, category);
  const key = pddJobKey(raw) || slugify(title);

  return {
    id: `pdd-${key}`,
    companyId: pddCompany.companyId,
    companyName: pddCompany.companyName,
    title,
    department: cleanText(raw.recruitTypeName) || categoryName || direction || pddCompany.companyName,
    location,
    category,
    sourceUrl: cleanText(raw.shareUrl) || `${pddCompany.sourceUrl}/detail?positionId=${encodeURIComponent(cleanText(raw.id) || key)}`,
    description,
    requirements,
    tags: inferPddTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "拼多多校园招聘官网未公开薪资；按岗位类别、校招/实习类型和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function normalizeMideaJob(raw: MideaRawJob): Job {
  const position = raw.projectPositionDto;
  const title = cleanText(raw.projectPositionName) || cleanText(position?.positionName) || "美的岗位";
  const description = cleanText(position?.jobResponsibility) || title;
  const requirementText = cleanText(position?.jobRequirement);
  const categoryName = cleanText(raw.recruitCategoryName) || cleanText(position?.largeTypeName);
  const allText = [title, description, requirementText, categoryName, raw.sourceProjectName].filter(Boolean).join("\n");
  const category = classifyText(categoryName, allText);
  const requirements = extractRequirements(allText, category);
  const location = inferMideaLocation(raw);
  const seniority = inferMideaSeniority(raw, allText);
  const direction = inferMideaDirection(title, categoryName, allText, category);
  const jobKey = cleanText(position?.positionCode) || cleanText(raw.positionId) || cleanText(raw.projectPositionId) || slugify(title);

  return {
    id: `midea-${jobKey}`,
    companyId: mideaCompany.companyId,
    companyName: mideaCompany.companyName,
    title,
    department: categoryName || direction || mideaCompany.companyName,
    location,
    category,
    sourceUrl: raw.positionId ? `${mideaCompany.sourceUrl}?positionId=${encodeURIComponent(raw.positionId)}` : mideaCompany.sourceUrl,
    description,
    requirements,
    tags: inferMideaTags(raw, requirements, category),
    direction,
    seniority,
    salary: inferEstimatedSalary(category, seniority, location, "美的校园招聘官网未公开薪资；按岗位类别、学历/项目层级和城市系数生成市场估算，每日随采集任务刷新。"),
  };
}

function classifyJob(raw: ByteDanceRawJob, text: string): JobCategory {
  const categoryName = `${raw.job_category?.name ?? ""} ${raw.job_category?.en_name ?? ""}`;
  return classifyText(categoryName, text);
}

function classifyAlibabaJob(title: string, categoryName: string, text: string): JobCategory {
  const primary = `${title} ${categoryName}`.toLowerCase();
  const merged = `${primary} ${text}`.toLowerCase();

  if (/安全|风控|合规|隐私|security|risk|trust/.test(primary)) return "Security";
  if (/设计|视觉|交互|体验|design|ui|ux/.test(primary)) return "Design";
  if (/产品|运营|增长|商业化|用户|策略|product|operation|growth/.test(primary)) return "Product";
  if (/数据|分析|bi|数仓|指标|data|analytics/.test(primary)) return "Data";
  if (/前端|客户端|ios|android|web|frontend|react|vue/.test(primary)) return "Frontend";
  if (/后端|服务端|java|go|golang|c\+\+|server|backend/.test(primary)) return "Backend";
  if (/云|基础架构|infra|系统|数据库|存储|网络|sre|devops|kubernetes/.test(primary)) return "Infrastructure";
  if (/ai|aigc|llm|nlp|cv|算法|机器学习|深度学习|大模型|推荐|搜索|多模态|agent|模型/.test(primary)) return "AI Engineering";

  if (/安全|风控|合规|隐私|security|risk|trust/.test(merged)) return "Security";
  if (/设计|视觉|交互|体验|design|ui|ux/.test(merged)) return "Design";
  if (/数据|分析|bi|数仓|指标|data|analytics/.test(merged)) return "Data";
  if (/前端|客户端|ios|android|web|frontend|react|vue/.test(merged)) return "Frontend";
  if (/后端|服务端|java|go|golang|c\+\+|server|backend/.test(merged)) return "Backend";
  if (/云|基础架构|infra|系统|数据库|存储|网络|sre|devops|kubernetes/.test(merged)) return "Infrastructure";
  if (/ai|aigc|llm|nlp|cv|算法|机器学习|深度学习|大模型|推荐|搜索|多模态|agent|模型/.test(merged)) return "AI Engineering";
  if (/产品|运营|增长|商业化|用户|策略|product|operation|growth/.test(merged)) return "Product";

  return "Product";
}

function classifyText(categoryName: string, text: string): JobCategory {
  const normalized = `${categoryName} ${text}`.toLowerCase();
  const titleText = (text.split(/\n/)[0] ?? "").toLowerCase();
  const normalizedCategory = categoryName.toLowerCase();
  const normalizedPrimary = `${normalizedCategory} ${titleText}`;
  const productRolePattern = /产品经理|产品专家|产品运营|运营专家|数据运营|策略运营|项目经理|product manager|product owner|product operations|operations manager/;
  const productFallbackPattern = /产品|运营|项目|product management|product operation|operations/;
  const aiTitlePattern = /算法|机器学习|深度学习|大模型|多模态|自动驾驶|推荐|搜索|\b(ai|llm|vlm|vla|aigc|nlp|cv)\b|algorithm|machine learning|deep learning|model|recommendation/i;
  const hardwareTitlePattern = /芯片|半导体|集成电路|电路|硬件|嵌入式|通信|无线|射频|firmware|mcu|soc/i;
  const financePattern = /金融|投行|银行|证券|基金|财富|审计|会计|税务|精算|财务|finance|financial|audit|tax|accounting|treasury/i;
  const businessPattern = /市场|营销|品牌|销售|商务|渠道|快消|零售|美妆|广告|传播|消费者|marketing|brand|sales|commercial|business development|retail|consumer/i;
  const operationsPattern = /供应链|物流|履约|采购|制造|质量|计划|运营管理|仓储|supply chain|logistics|procurement|operations|fulfillment|manufacturing|quality|demand planning/i;
  const servicePattern = /酒店|旅游|会展|航空|乘务|地勤|前厅|餐饮|客户体验|客服|护理|教育|培训|guest|hotel|hospitality|aviation|customer service|customer experience|teacher|training/i;

  if (/安全|风控|隐私|security|trust/.test(titleText) || /安全与风控|信息安全|security|trust/.test(normalizedCategory)) return "Security";
  if (financePattern.test(normalizedPrimary)) return "Finance";
  if (servicePattern.test(normalizedPrimary)) return "Service";
  if (operationsPattern.test(normalizedPrimary)) return "Operations";
  if (businessPattern.test(normalizedPrimary)) return "Business";
  if (hardwareTitlePattern.test(normalizedPrimary)) return "Infrastructure";
  if (/设计|design|视觉|交互|体验/.test(normalizedPrimary)) return "Design";
  if (productRolePattern.test(titleText)) return "Product";
  if (aiTitlePattern.test(normalizedPrimary)) return "AI Engineering";
  if (/基础架构|infra|云|数据库|存储|sre|devops|kubernetes|容器|运维/.test(normalizedPrimary)) return "Infrastructure";
  if (/嵌入式|硬件|电气|电路|控制软件|自动化|机器人|芯片|firmware|stm32|dsp/.test(normalizedPrimary)) return "Infrastructure";
  if (/算法|机器学习|深度学习|大模型|llm|vlm|aigc|模型|nlp|cv|推荐/.test(normalizedPrimary)) return "AI Engineering";
  if (/前端|frontend|web前端|客户端/.test(normalizedPrimary)) return "Frontend";
  if (/后端|服务端|backend|server|java|golang|\bgo\b/.test(normalizedPrimary)) return "Backend";
  if (/数据|数仓|bi|data|分析|治理/.test(normalizedPrimary)) return "Data";
  if (productFallbackPattern.test(normalizedPrimary)) return "Product";
  if (/基础架构|infra|云|数据库|存储|sre|devops|kubernetes|容器|运维/.test(normalized)) return "Infrastructure";
  if (/嵌入式|硬件|电气|电路|控制软件|自动化|机器人|芯片|firmware|stm32|dsp/.test(normalized)) return "Infrastructure";
  if (/算法|机器学习|深度学习|大模型|llm|vlm|aigc|模型|nlp|cv|推荐/.test(normalized)) return "AI Engineering";
  if (/后端|服务端|backend|server|java|golang|\bgo\b/.test(normalized)) return "Backend";
  if (/前端|frontend|web前端|客户端/.test(normalized)) return "Frontend";
  if (/数据|数仓|bi|data|分析|治理/.test(normalized)) return "Data";
  if (financePattern.test(normalized)) return "Finance";
  if (servicePattern.test(normalized)) return "Service";
  if (operationsPattern.test(normalized)) return "Operations";
  if (businessPattern.test(normalized)) return "Business";

  return "Product";
}

function extractRequirements(text: string, category: JobCategory) {
  const matched = knownSkills
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
    .map(({ skill }) => skill);

  const merged = [...matched, ...fallbackRequirements[category]];
  return Array.from(new Set(merged)).slice(0, 8);
}

function extractAlibabaRequirements(text: string, category: JobCategory) {
  const explicitSkills = [
    { skill: "Python", pattern: /\bpython\b/i },
    { skill: "Java", pattern: /\bjava\b/i },
    { skill: "C++", pattern: /\bc\+\+\b/i },
    { skill: "Go", pattern: /\bgo\b|golang/i },
    { skill: "SQL", pattern: /\bsql\b|数仓|数据库/i },
    { skill: "PyTorch", pattern: /pytorch|tensorflow|jax/i },
    { skill: "大模型", pattern: /大模型|llm|aigc|agent|prompt|rag/i },
    { skill: "机器学习", pattern: /机器学习|深度学习|推荐系统|nlp|cv|多模态/i },
    { skill: "分布式系统", pattern: /分布式|高并发|微服务|云原生|kubernetes|容器/i },
    { skill: "数据分析", pattern: /数据分析|指标|a\/b|ab实验|bi/i },
    { skill: "产品理解", pattern: /产品|用户|需求|商业化|增长/i },
    { skill: "英语", pattern: /英语|英文|global|international/i },
  ]
    .filter(({ pattern }) => pattern.test(text))
    .map(({ skill }) => skill);

  return Array.from(new Set([...explicitSkills, ...extractRequirements(text, category)])).slice(0, 8);
}

function inferTags(raw: ByteDanceRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    ...(raw.tag_list ?? []),
    ...(raw.job_post_info?.tag_list ?? []),
    raw.job_category,
    raw.recruit_type,
  ]
    .map((tag) => tag?.name ?? tag?.en_name ?? tag?.i18n_name)
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferTencentTags(raw: TencentRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [raw.CategoryName, raw.ProductName, raw.BGName, raw.RequireWorkYearsName]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferAlibabaTags(raw: AlibabaRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.categoryName,
    raw.batchName,
    raw.niuKeProjectName,
    raw.degree,
    raw.isTongyi || raw.tongyi ? "通义相关" : undefined,
    ...(raw.circleNames ?? []),
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferBaiduTags(raw: BaiduRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [raw.postType, raw.projectType, raw.bgShortName, raw.education, raw.workYears]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferMeituanTags(raw: MeituanRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [raw.projectName, raw.jobFamily, raw.jobFamilyGroup, raw.workYear, raw.tag]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferJdTags(raw: JdRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [raw.jobType, raw.positionDeptName, raw.workCity, raw.lvlName, raw.formatPublishTime]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferHuaweiTags(raw: HuaweiRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.jobFamilyName,
    raw.jobFamilyCode,
    raw.degree,
    raw.jobArea,
    raw.isHotJob ? "热招" : undefined,
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferKuaishouTags(raw: KuaishouRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [raw.locationsText, raw.postedOn, raw.timeType, raw.jobPostingInfo?.timeType, raw.hiringOrganization?.name]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferBilibiliTags(raw: BilibiliRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.sourceChannel === "campus" ? "校招/实习" : "社会招聘",
    raw.postCodeName,
    raw.positionTypeName,
    raw.deptName,
    raw.hotRecruit ? "热招" : undefined,
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferXiaomiTags(raw: XiaomiRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.job_category?.name,
    raw.job_category?.i18n_name,
    raw.subject?.name,
    raw.recruitment?.name,
    raw.job_function?.name,
    raw.city_info?.name,
    ...(raw.tag_list ?? []).map((tag) => tag.name ?? tag.i18n_name),
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferPddTags(raw: PddRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.jobName,
    raw.recruitTypeName,
    raw.graduationYear ? `${raw.graduationYear}届` : undefined,
    raw.code,
    ...(raw.labelList ?? []),
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferMideaTags(raw: MideaRawJob, requirements: string[], category: JobCategory) {
  const officialTags = [
    raw.recruitCategoryName,
    raw.projectPositionDto?.largeTypeName,
    raw.sourceProjectName,
    raw.sourceProjectType,
    raw.recommend ? "推荐岗位" : undefined,
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 6);
}

function inferGlobalTags(parts: unknown[], requirements: string[], category: JobCategory) {
  const officialTags = parts
    .filter(isPresent)
    .map(cleanText)
    .flatMap((part) => part.split(/[\/|,，、]+/).map(cleanText))
    .filter(Boolean);

  return Array.from(new Set([category, ...officialTags, ...requirements])).slice(0, 7);
}

function inferDirection(title: string, raw: ByteDanceRawJob, category: JobCategory) {
  const titleParts = title.split(/[-－—]/).map(cleanText).filter(Boolean);
  if (titleParts.length > 1) {
    return titleParts.slice(1).join(" / ");
  }

  const sequence = raw.job_post_info?.sequence?.name ?? raw.job_function?.name ?? raw.job_post_info?.job_function?.name;
  return cleanText(sequence) || cleanText(raw.job_category?.name) || category;
}

function inferDepartment(raw: ByteDanceRawJob, direction: string) {
  return (
    cleanText(raw.job_post_info?.department?.name) ||
    cleanText(raw.department_info?.name) ||
    cleanText(raw.job_function?.name) ||
    cleanText(raw.job_post_info?.job_function?.name) ||
    direction ||
    bytedanceCompany.companyName
  );
}

function inferLocation(raw: ByteDanceRawJob) {
  const cityNames = [
    ...(raw.city_list ?? []),
    ...(raw.city_info_list_for_delivery ?? []),
    ...(raw.job_post_info?.city_list ?? []),
    raw.city_info,
  ]
    .map((city) => city?.name ?? city?.i18n_name ?? city?.en_name)
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set(cityNames)).slice(0, 4).join(" / ") || "未标注城市";
}

function inferMeituanLocation(raw: MeituanRawJob) {
  const cityNames = (raw.cityList ?? [])
    .map((city) => city.name)
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set(cityNames)).slice(0, 4).join(" / ") || "未标注城市";
}

function inferMideaLocation(raw: MideaRawJob) {
  const cityNames = (raw.workplaceDtoList ?? [])
    .map((city) => city.workPlaceName)
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set(cityNames)).slice(0, 4).join(" / ") || cleanText(raw.workPlaceCode) || "未标注城市";
}

function inferBilibiliLocation(raw: BilibiliRawJob) {
  const directCity = cleanText(raw.workCity);
  if (directCity) return directCity;
  const location = cleanText(raw.workLocation);
  if (!location) return "未标注城市";
  const parts = location.split("#$").map(cleanText).filter(Boolean);
  return Array.from(new Set(parts)).slice(0, 4).join(" / ") || location;
}

function inferXiaomiLocation(raw: XiaomiRawJob) {
  const cityNames = [
    raw.city_info?.name,
    raw.city_info?.i18n_name,
    ...(raw.city_list ?? []).map((city) => city.name ?? city.i18n_name ?? city.en_name),
  ]
    .filter(isPresent)
    .map(cleanText);

  return Array.from(new Set(cityNames)).slice(0, 4).join(" / ") || "未标注城市";
}

function inferPddLocation(raw: PddRawJob) {
  return cleanText(raw.workLocationName) || cleanText(raw.workLocation) || "未标注城市";
}

function inferAlibabaLocation(raw: AlibabaRawJob) {
  const cityNames = (raw.workLocations ?? []).map(cleanText).filter(Boolean);
  return Array.from(new Set(cityNames)).slice(0, 6).join(" / ") || "未标注城市";
}

function inferHuaweiLocation(raw: HuaweiRawJob) {
  const rawLocation = cleanText(raw.jobArea) || cleanText(raw.jobAddress);
  if (!rawLocation) return "未标注城市";
  const cleaned = rawLocation
    .replace(/China\\\\/g, "")
    .replace(/China\//g, "")
    .replace(/Guangdong-/g, "")
    .replace(/Zhejiang-/g, "")
    .replace(/Jiangsu-/g, "")
    .replace(/Hubei-/g, "")
    .replace(/Shaanxi-/g, "")
    .replace(/Sichuan-/g, "")
    .replace(/Anhui-/g, "")
    .replace(/Hunan-/g, "")
    .replace(/Shandong-/g, "")
    .replace(/Beijing-/g, "")
    .replace(/Shanghai-/g, "");
  const parts = cleaned
    .split(/[,;、，]/)
    .map(cleanText)
    .filter(Boolean)
    .map((part) => part.replace(/^中国\//, ""));

  return Array.from(new Set(parts)).slice(0, 5).join(" / ") || rawLocation;
}

function inferAmazonLocation(raw: AmazonRawJob) {
  const candidates = [
    raw.location,
    raw.normalized_location,
    [raw.city, raw.state, raw.country_code].map(cleanText).filter(Boolean).join(", "),
    ...(raw.locations ?? []),
  ]
    .map(formatAmazonLocationValue)
    .filter(Boolean);

  return Array.from(new Set(candidates)).slice(0, 4).join(" / ") || "Global / not specified";
}

function formatAmazonLocationValue(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        return formatAmazonLocationObject(JSON.parse(trimmed) as JsonRecord);
      } catch {
        return "";
      }
    }
    return cleanText(trimmed);
  }

  if (typeof value === "object" && value !== null) {
    return formatAmazonLocationObject(value as JsonRecord);
  }

  return cleanString(value);
}

function formatAmazonLocationObject(value: JsonRecord) {
  return (
    cleanString(value.normalizedLocation) ||
    cleanString(value.location) ||
    [value.normalizedCityName, value.normalizedStateName, value.normalizedCountryName].map(cleanString).filter(Boolean).join(", ") ||
    [value.city, value.region, value.countryIso3a].map(cleanString).filter(Boolean).join(", ")
  );
}

function inferMeituanDepartment(raw: MeituanRawJob, direction: string) {
  const departments = (raw.department ?? [])
    .map((department) => department.name)
    .filter(isPresent)
    .map(cleanText);

  return departments.slice(0, 2).join(" / ") || direction || meituanCompany.companyName;
}

function inferSeniority(raw: ByteDanceRawJob, text: string): Job["seniority"] {
  const recruitText = `${raw.recruit_type?.name ?? ""} ${raw.recruit_type?.parent?.name ?? ""} ${text}`;
  if (/实习|intern/i.test(recruitText)) return "intern";
  if (/校招|应届|校园|0\s*[-~至到]?\s*1\s*年|1年/.test(recruitText)) return "junior";
  if (/专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年/.test(recruitText)) return "senior";
  return "mid";
}

function inferTencentSeniority(raw: TencentRawJob, text: string): Job["seniority"] {
  const workYears = `${raw.RequireWorkYearsName ?? ""} ${text}`;
  if (/实习|intern/i.test(workYears)) return "intern";
  if (/应届|校园|校招|一年以下|0\s*[-~至到]?\s*1\s*年/.test(workYears)) return "junior";
  if (/五年|六年|七年|八年|十年|专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年/.test(workYears)) return "senior";
  return "mid";
}

function inferAlibabaSeniority(raw: AlibabaRawJob, text: string): Job["seniority"] {
  const seniorityText = `${raw.batchName ?? ""} ${raw.categoryType ?? ""} ${raw.degree ?? ""} ${text}`;
  if (/实习|intern|trainee|阿里星|研究型/i.test(seniorityText)) return "intern";
  if (/校招|校园|应届|毕业生|graduate|2026|2027/i.test(seniorityText)) return "junior";
  if (/博士|专家|资深|leader|lead|principal|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年/i.test(seniorityText)) return "senior";
  return "junior";
}

function inferBaiduSeniority(raw: BaiduRawJob, text: string): Job["seniority"] {
  const workYears = `${raw.workYears ?? ""} ${raw.projectType ?? ""} ${raw.postType ?? ""} ${text}`;
  if (/实习|intern/i.test(workYears)) return "intern";
  if (/校招|校园|应届|AIDU|0\s*[-~至到]?\s*1\s*年/.test(workYears)) return "junior";
  if (/5年以上|五年|六年|七年|八年|十年|专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年/.test(workYears)) return "senior";
  return "mid";
}

function inferMeituanSeniority(raw: MeituanRawJob, text: string): Job["seniority"] {
  const workYears = `${raw.workYear ?? ""} ${raw.jobFamily ?? ""} ${raw.jobFamilyGroup ?? ""} ${text}`;
  if (/实习|intern/i.test(workYears)) return "intern";
  if (/校招|校园|应届|一年以下|0\s*[-~至到]?\s*1\s*年/.test(workYears)) return "junior";
  if (/5年以上|五年|六年|七年|八年|十年|专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年/.test(workYears)) return "senior";
  return "mid";
}

function inferJdSeniority(raw: JdRawJob, text: string): Job["seniority"] {
  const seniorityText = `${raw.lvlName ?? ""} ${raw.positionNameOpen ?? ""} ${raw.positionName ?? ""} ${text}`;
  if (/实习|intern/i.test(seniorityText)) return "intern";
  if (/校招|校园|应届|管培|0\s*[-~至到]?\s*1\s*年|1年/.test(seniorityText)) return "junior";
  if (/专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/.test(seniorityText)) return "senior";
  return "mid";
}

function inferHuaweiSeniority(raw: HuaweiRawJob, text: string): Job["seniority"] {
  const titleText = `${raw.jobname ?? ""} ${raw.nameCn ?? ""}`;
  const seniorityText = `${titleText} ${raw.jobType ?? ""} ${raw.degree ?? ""} ${raw.workYear ?? ""} ${text}`;
  if (/实习|intern/i.test(titleText)) return "intern";
  if (/专家|资深|负责人|leader|lead|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/i.test(seniorityText)) return "senior";
  if (/校招|校园|应届|本科|毕业生|graduate/i.test(seniorityText) || raw.jobType === "0") return "junior";
  return "mid";
}

function inferKuaishouSeniority(raw: KuaishouRawJob, text: string): Job["seniority"] {
  const seniorityText = `${raw.title ?? ""} ${raw.jobPostingInfo?.title ?? ""} ${text}`;
  if (/intern|internship/i.test(seniorityText)) return "intern";
  if (/campus|graduate trainee|entry[-\s]?level/i.test(seniorityText)) return "junior";
  if (/senior|lead|principal|head of|manager|director|5\+?\s*years|6\+?\s*years|7\+?\s*years|8\+?\s*years|10\+?\s*years/i.test(seniorityText)) return "senior";
  if (/3\s*to\s*5\s*years|3\+?\s*years|4\+?\s*years/i.test(seniorityText)) return "mid";
  return "mid";
}

function inferGlobalSeniority(
  text: string,
  flags: { isIntern?: boolean; isManager?: boolean; universityJob?: boolean } = {},
): Job["seniority"] {
  if (flags.isIntern || /实习|intern|internship|placement|co-op/i.test(text)) return "intern";
  if (/vice president|\bvp\b|director|head of|principal|senior manager|lead|leader|负责人|总监|资深|专家|8\+?\s*years|10\+?\s*years/i.test(text)) return "senior";
  if (flags.universityJob || /part[-\s]?time|graduate|campus|early career|entry[-\s]?level|associate|assistant|coordinator|specialist|consultant|junior|trainee|apprentice|校招|应届|毕业生/i.test(text)) return "junior";
  if (flags.isManager || /manager|3\+?\s*years|4\+?\s*years|5\+?\s*years|6\+?\s*years|3\s*years|5\s*years/i.test(text)) return "mid";
  return "mid";
}

function inferBilibiliSeniority(raw: BilibiliRawJob, text: string): Job["seniority"] {
  const seniorityText = `${raw.positionTypeName ?? ""} ${raw.workExperience ?? ""} ${raw.sourceChannel ?? ""} ${text}`;
  if (/实习|intern/i.test(seniorityText) || raw.sourceChannel === "campus" || String(raw.recruitType) === "1") return "intern";
  if (/校招|应届|2027届|2026届|毕业生|fresh/i.test(seniorityText)) return "junior";
  if (/资深|专家|负责人|负责人|leader|lead|5\s*年以上|6\s*年以上|7\s*年以上|8\s*年以上|10\s*年以上|五年|六年|七年|八年|十年/i.test(seniorityText)) return "senior";
  if (/3\s*年以上|4\s*年以上|三年|四年/i.test(seniorityText)) return "mid";
  return "mid";
}

function inferXiaomiSeniority(raw: XiaomiRawJob, text: string): Job["seniority"] {
  const titleText = `${raw.title ?? ""} ${raw.sub_title ?? ""}`;
  const projectText = `${raw.recruitment?.name ?? ""} ${raw.subject?.name ?? ""}`;
  const seniorityText = `${titleText} ${projectText} ${text}`;
  if (/专家|资深|负责人|leader|lead|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/.test(titleText)) return "senior";
  if (/实习|intern|日常实习/i.test(`${titleText} ${projectText}`)) return "intern";
  if (/校招|校园|应届|毕业生|未来星|新零售/i.test(`${titleText} ${projectText}`)) return "junior";
  if (/专家|资深|负责人|leader|lead|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/.test(seniorityText)) return "senior";
  if (/3\s*年|4\s*年|三年|四年/.test(seniorityText)) return "mid";
  return "mid";
}

function inferPddSeniority(raw: PddRawJob, text: string): Job["seniority"] {
  const titleText = `${raw.name ?? ""} ${raw.recruitTypeName ?? ""}`;
  const seniorityText = `${titleText} ${raw.graduationYear ?? ""} ${text}`;
  if (/实习|intern/i.test(titleText)) return "intern";
  if (/校招|校园|应届|毕业生|2026|2027|云弧|技术专场|管培|trainee/i.test(seniorityText)) return "junior";
  if (/专家|资深|负责人|leader|lead|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/i.test(seniorityText)) return "senior";
  return "junior";
}

function inferMideaSeniority(raw: MideaRawJob, text: string): Job["seniority"] {
  const seniorityText = `${raw.sourceProjectName ?? ""} ${raw.projectType ?? ""} ${raw.sourceProjectType ?? ""} ${text}`;
  if (/实习|intern|dailyIntern/i.test(seniorityText) || raw.projectType === "9" || raw.sourceProjectType === "9") return "intern";
  if (/博士|doctor|博士生/i.test(seniorityText) || raw.projectType === "5" || raw.sourceProjectType === "5") return "junior";
  if (/校招|校园|应届|美的星|海外|美少年/.test(seniorityText)) return "junior";
  if (/专家|资深|负责人|5\s*年|6\s*年|7\s*年|8\s*年|10\s*年|五年|六年|七年|八年|十年/.test(seniorityText)) return "senior";
  return "junior";
}

function inferKuaishouDirection(title: string, description: string, category: JobCategory) {
  const text = `${title} ${description}`.toLowerCase();
  if (/advertising|ads|campaign|client solution|sales/.test(text)) return "广告商业化";
  if (/creator|content|community|short-video|video/.test(text)) return "内容与创作者生态";
  if (/e-?commerce|merchant|seller|shop/.test(text)) return "电商业务";
  if (/trust|safety|moderation|risk/.test(text)) return "安全与风控";
  if (/data|analytics|bi|insight/.test(text)) return "数据分析";
  if (/product|operation|growth/.test(text)) return "产品运营";
  return category;
}

function inferGlobalDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/finance|financial|accounting|audit|tax|treasury|财务|会计|审计|税务|金融/.test(merged)) return "金融财务";
  if (/supply chain|logistics|fulfillment|procurement|manufacturing|quality|demand planning|供应链|物流|履约|采购|制造|质量|计划/.test(merged)) return "运营与供应链";
  if (/marketing|brand|campaign|consumer|commercial|sales|retail|市场|营销|品牌|消费者|销售|零售|渠道/.test(merged)) return "品牌营销与零售";
  if (/human resources|people|talent|hr|人力资源|组织发展|招聘/.test(merged)) return "人力资源与组织";
  if (/research|r&d|innovation|lab|scientist|研发|研究|创新|实验室/.test(merged)) return "研发与创新";
  if (/guest|hotel|hospitality|aviation|customer service|customer experience|酒店|旅游|航空|客户体验|客服|餐饮/.test(merged)) return "服务体验";
  if (/data|analytics|insight|bi|数据|分析|洞察/.test(merged)) return "数据分析";
  if (/design|creative|ux|visual|设计|创意|视觉|体验/.test(merged)) return "设计与创意";
  return cleanText(categoryName) || category;
}

function inferBilibiliDirection(title: string, text: string, category: JobCategory) {
  const merged = `${title} ${text}`.toLowerCase();
  if (/推荐|recommendation|召回|粗排|精排|重排/.test(merged)) return "推荐系统与内容分发";
  if (/大模型|llm|agent|rag|workflow|多模态|aigc|ai native|ai-native/.test(merged)) return "AI 内容应用";
  if (/内容安全|社区治理|审核|风控|治理|风险/.test(merged)) return "社区治理与内容安全";
  if (/前端|javascript|typescript|react|vue|websocket|sse/.test(merged)) return "前端体验与互动";
  if (/直播|音频|视频|虚拟主播|创作者|up 主|内容生态/.test(merged)) return "内容产品与创作者生态";
  if (/商业化|广告|增长|运营|用户/.test(merged)) return "增长运营与商业化";
  return category;
}

function inferHuaweiDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/cloud|ai|昇腾|鲲鹏|大模型|算法|机器学习|智能|模型/.test(merged)) return "Cloud & AI / 算法研发";
  if (/通信|网络|5g|6g|无线|光网络|数据通信|ict/.test(merged)) return "通信网络与 ICT";
  if (/芯片|半导体|海思|集成电路|器件/.test(merged)) return "芯片与器件";
  if (/终端|鸿蒙|harmony|手机|操作系统|os/.test(merged)) return "终端软件与系统";
  if (/供应链|采购|物流|计划|交付|制造/.test(merged)) return "供应链与交付";
  if (/财经|客户经理|销售|法务|律师|公共关系/.test(merged)) return "商业与职能";
  return categoryName || category;
}

function inferXiaomiDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/自动驾驶|adas|智驾|车载|智能驾驶|泊车|感知|规控|仿真/.test(merged)) return "智能汽车与自动驾驶";
  if (/ai|大模型|llm|vlm|aigc|agent|rag|模型|算法/.test(merged)) return "AI 与算法应用";
  if (/硬件|电路|嵌入式|mcu|车规|pcb|电气|电子控制器|传感器/.test(merged)) return "智能硬件与嵌入式";
  if (/手机|系统|android|miui|澎湃|终端|客户端/.test(merged)) return "终端软件与系统体验";
  if (/iot|智能家居|家电|音箱|穿戴|生态链/.test(merged)) return "IoT 与智能家居";
  if (/供应链|采购|计划|物流|质量|制造|工厂/.test(merged)) return "供应链与智能制造";
  return categoryName || category;
}

function inferAlibabaDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/通义|大模型|llm|aigc|agent|多模态|nlp|cv|生成/.test(merged)) return "大模型与 AI 应用";
  if (/推荐|搜索|广告|召回|排序|ctr|电商/.test(merged)) return "电商推荐与搜索";
  if (/云|云原生|基础架构|infra|数据库|存储|网络|sre|devops/.test(merged)) return "云计算与基础架构";
  if (/数据|数仓|bi|指标|分析|治理/.test(merged)) return "数据智能与分析";
  if (/产品|用户|增长|商业化|运营|策略/.test(merged)) return "产品运营与增长";
  if (/安全|风控|合规|隐私|反作弊/.test(merged)) return "安全风控与合规";
  if (/前端|客户端|ios|android|web|体验/.test(merged)) return "端侧体验与前端";
  if (/后端|服务端|java|go|c\+\+|分布式|高并发/.test(merged)) return "后端平台与分布式系统";
  return categoryName || category;
}

function inferPddDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const titleCategory = `${title} ${categoryName}`.toLowerCase();
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/ai|infra|大模型|llm|模型|算法|机器学习/.test(titleCategory)) return "AI Infra 与算法";
  if (/服务端|后端|server/.test(titleCategory)) return "服务端与分布式系统";
  if (/客户端|前端|ios|android|web/.test(titleCategory)) return "客户端与前端体验";
  if (/安全|风控|反欺诈|攻防|漏洞|审核|合规/.test(titleCategory)) return "安全与合规";
  if (/视觉|设计|品牌|创意|摄影|视频/.test(titleCategory)) return "视觉与品牌设计";
  if (/数据|分析|指标|ab实验|a\/b|策略|经营分析|商业分析/.test(titleCategory)) return "数据策略与经营分析";
  if (/产品|用户|需求|体验|平台/.test(titleCategory)) return "电商产品";
  if (/运营|区域业务|管培|供应链|商家|招商|履约|采购|物流|增长|客服|消费者服务/.test(titleCategory)) return "电商经营与供应链";
  if (/财务|法务|hr|人力|市场|语言|小语种/.test(titleCategory)) return "商业职能";
  if (/ai|infra|大模型|llm|模型|算法|机器学习|训练|推理|gpu|pytorch|deepseed|deepspeed|vlm|aigc/.test(merged)) return "AI Infra 与算法";
  if (/安全|风控|反欺诈|攻防|漏洞|合规/.test(merged)) return "安全与合规";
  if (/服务端|后端|server|分布式|高并发|go|java|c\+\+|rust/.test(merged)) return "服务端与分布式系统";
  if (/客户端|前端|ios|android|web|react|vue|交互/.test(merged)) return "客户端与前端体验";
  if (/产品|用户|需求|体验|平台/.test(merged)) return "电商产品";
  if (/运营|区域业务|管培|供应链|商家|招商|履约|采购|物流|增长/.test(merged)) return "电商经营与供应链";
  if (/财务|法务|hr|人力|市场|语言|小语种/.test(merged)) return "商业职能";
  if (/数据|分析|指标|ab实验|a\/b|策略|经营分析|商业分析/.test(merged)) return "数据策略与经营分析";
  if (/视觉|设计|品牌|创意/.test(merged)) return "视觉与品牌设计";
  return categoryName || category;
}

function classifyPddJob(title: string, categoryName: string, text: string): JobCategory {
  const titleCategory = `${title} ${categoryName}`.toLowerCase();
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/ai|infra|大模型|llm|模型|算法|机器学习/.test(titleCategory)) return "AI Engineering";
  if (/服务端|后端|server/.test(titleCategory)) return "Backend";
  if (/客户端|前端|ios|android|web/.test(titleCategory)) return "Frontend";
  if (/安全|风控|反欺诈|攻防|漏洞|审核|合规/.test(titleCategory)) return "Security";
  if (/设计|视觉|创意|品牌|摄影|视频/.test(titleCategory)) return "Design";
  if (/数据|分析|指标|ab实验|a\/b|策略|经营分析|商业分析/.test(titleCategory)) return "Data";
  if (/财务|法务|hr|人力|市场|运营|管培|区域业务|仓配|物流|产品|客服|消费者服务|语言|小语种/.test(titleCategory)) return "Product";
  if (/ai|infra|大模型|llm|模型|算法|机器学习|训练|推理|gpu|pytorch|deepseed|deepspeed|vlm|aigc/.test(merged)) return "AI Engineering";
  if (/服务端|后端|server|分布式|高并发|go|java|c\+\+|rust/.test(merged)) return "Backend";
  if (/客户端|前端|ios|android|web|react|vue/.test(merged)) return "Frontend";
  if (/安全|风控|反欺诈|攻防|漏洞/.test(merged)) return "Security";
  if (/设计|视觉|创意|品牌/.test(merged)) return "Design";
  if (/数据|分析|指标|ab实验|a\/b|策略|经营分析|商业分析/.test(merged)) return "Data";
  if (/财务|法务|hr|人力|市场|运营|管培|区域业务|仓配|物流|产品|客服|消费者服务|合规|语言|小语种/.test(merged)) return "Product";
  return classifyText(categoryName, text);
}

function inferMideaDirection(title: string, categoryName: string, text: string, category: JobCategory) {
  const merged = `${title} ${categoryName} ${text}`.toLowerCase();
  if (/储能|新能源|电力电子|逆变器|电气/.test(merged)) return "新能源与电气控制";
  if (/嵌入式|单片机|stm32|cortex|硬件|pcb|电路/.test(merged)) return "硬件与嵌入式";
  if (/机器人|自动化|控制算法|智能制造|库卡/.test(merged)) return "智能制造与机器人";
  if (/信息技术|数字平台|系统|数据|算法|ai|大模型/.test(merged)) return "数字化与 AI";
  if (/供应链|物流|计划|采购|运营/.test(merged)) return "供应链与运营";
  return categoryName || category;
}

function inferSalary(raw: ByteDanceRawJob, category: JobCategory, seniority: Job["seniority"], location: string): Job["salary"] {
  const official = readOfficialSalary(raw);
  const updatedAt = new Date().toISOString();

  if (official) {
    return {
      monthlyMinK: official[0],
      monthlyMaxK: official[1],
      annualMinK: official[0] * 14,
      annualMaxK: official[1] * 14,
      months: 14,
      currency: "CNY",
      source: "official",
      confidence: "high",
      updatedAt,
      note: "来自官方岗位字段，按 14 薪折算年薪。",
    };
  }

  return inferEstimatedSalary(category, seniority, location, "官方站未公开薪资；按岗位类别、资历层级和城市系数生成市场估算，每日随采集任务刷新。");
}

function inferEstimatedSalary(category: JobCategory, seniority: Job["seniority"], location: string, note: string): Job["salary"] {
  const [baseMin, baseMax] = salaryBands[category][seniority];
  const multiplier = getLocationSalaryMultiplier(location);
  const monthlyMinK = Math.max(3, Math.round(baseMin * multiplier));
  const monthlyMaxK = Math.max(monthlyMinK + 2, Math.round(baseMax * multiplier));

  return {
    monthlyMinK,
    monthlyMaxK,
    annualMinK: monthlyMinK * 14,
    annualMaxK: monthlyMaxK * 14,
    months: 14,
    currency: "CNY",
    source: "market-estimate",
    confidence: seniority === "intern" ? "medium" : "low",
    updatedAt: new Date().toISOString(),
    note,
  };
}

function inferAmazonOfficialSalary(text: string): Job["salary"] | undefined {
  const ranges = Array.from(text.matchAll(/(\d{2,3},\d{3}(?:\.\d+)?)\s*-\s*(\d{2,3},\d{3}(?:\.\d+)?)\s*USD\s+annually/gi))
    .map((match) => {
      const minUsd = Number(match[1].replace(/,/g, ""));
      const maxUsd = Number(match[2].replace(/,/g, ""));
      return Number.isFinite(minUsd) && Number.isFinite(maxUsd) && maxUsd >= minUsd ? [minUsd, maxUsd] : undefined;
    })
    .filter((range): range is [number, number] => Boolean(range));

  if (ranges.length === 0) return undefined;

  const usdToCny = 7.15;
  const annualMinK = Math.round((Math.min(...ranges.map(([min]) => min)) * usdToCny) / 1000);
  const annualMaxK = Math.round((Math.max(...ranges.map(([, max]) => max)) * usdToCny) / 1000);
  const monthlyMinK = Math.max(3, Math.round(annualMinK / 12));
  const monthlyMaxK = Math.max(monthlyMinK + 2, Math.round(annualMaxK / 12));

  return {
    monthlyMinK,
    monthlyMaxK,
    annualMinK,
    annualMaxK,
    months: 12,
    currency: "CNY",
    source: "official",
    confidence: "high",
    updatedAt: new Date().toISOString(),
    note: "来自 Amazon 官方岗位描述中的 USD 年薪区间，按 1 USD≈7.15 CNY 粗略折算；实际薪酬以官网和当地 offer 为准。",
  };
}

function readOfficialSalary(raw: ByteDanceRawJob): [number, number] | undefined {
  const candidates: Array<[unknown, unknown]> = [
    [raw.min_salary, raw.max_salary],
    [raw.job_post_info?.min_salary, raw.job_post_info?.max_salary],
  ];

  for (const [minRaw, maxRaw] of candidates) {
    const min = normalizeSalaryK(minRaw);
    const max = normalizeSalaryK(maxRaw);
    if (min && max && max >= min) {
      return [min, max];
    }
  }

  return parseSalaryText(raw.salary) ?? parseSalaryText(raw.job_post_info?.salary);
}

function parseSalaryText(value: unknown): [number, number] | undefined {
  if (typeof value !== "string") return undefined;
  const match = value.match(/(\d+(?:\.\d+)?)\s*[kK]?\s*[-~至]\s*(\d+(?:\.\d+)?)\s*[kK]?/);
  if (!match) return undefined;
  const min = normalizeSalaryK(match[1]);
  const max = normalizeSalaryK(match[2]);
  return min && max && max >= min ? [min, max] : undefined;
}

function normalizeSalaryK(value: unknown) {
  const numeric = typeof value === "string" ? Number(value.replace(/[^\d.]/g, "")) : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
  return Math.round(numeric > 1000 ? numeric / 1000 : numeric);
}

function getLocationSalaryMultiplier(location: string) {
  if (/北京|上海|深圳|杭州/.test(location)) return 1;
  if (/广州|苏州|南京|成都/.test(location)) return 0.92;
  if (/武汉|西安|厦门|重庆|天津/.test(location)) return 0.84;
  if (/United States|USA|New York|Seattle|San Francisco|Mountain View|Austin|Arlington|London|United Kingdom|Germany|France|Netherlands|Australia|Canada|Singapore|Hong Kong|Switzerland/i.test(location)) return 1.25;
  if (/Japan|Korea|Dubai|United Arab Emirates|UAE|Ireland|Belgium|Denmark|Sweden|Norway/i.test(location)) return 1.12;
  return 0.8;
}

function dedupeJobs(jobs: Job[]) {
  const byId = new Map<string, Job>();
  for (const job of jobs) {
    byId.set(job.id, job);
  }
  return Array.from(byId.values()).sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
}

function disabledSignedAdapterResult(adapterName: string) {
  return {
    jobs: [] as Job[],
    rawCount: 0,
    signerChunkUrl: "disabled: remote signer execution is blocked by security policy",
    queryStats: [
      {
        keyword: "<disabled>",
        returned: 0,
        error: `${adapterName} adapter requires executing a remote signer chunk, so it is disabled until a non-executing official API path or sandbox is available.`,
      },
    ],
  };
}

function enrichJobCareerSignals(job: Job): Job {
  const focusText = [
    job.title,
    job.department,
    job.direction,
    job.category,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();
  const detailText = [
    job.companyName,
    job.title,
    job.department,
    job.location,
    job.direction,
    job.description,
    job.category,
    ...job.requirements,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();
  const majorScores = new Map<string, number>();
  const abilitySignals: string[] = [];
  const evidenceSignals: string[] = [];

  for (const rule of majorSignalRules) {
    const focusMatched = rule.patterns.some((pattern) => pattern.test(focusText));
    const detailMatched = focusMatched || rule.patterns.some((pattern) => pattern.test(detailText));
    if (!detailMatched) continue;
    const signalScore = focusMatched ? rule.weight : Math.round(rule.weight * 0.45);
    if (signalScore < 20) continue;

    rule.majors.forEach((major, index) => {
      majorScores.set(major, (majorScores.get(major) ?? 0) + signalScore - index * 3);
    });
    abilitySignals.push(...rule.abilities);
    evidenceSignals.push(`${rule.label}信号命中${focusMatched ? "岗位标题/方向/类别" : "岗位职责/要求"}`);
  }

  if (majorScores.size === 0) {
    categoryMajorFallbacks[job.category].forEach((major, index) => {
      majorScores.set(major, 24 - index * 2);
    });
    evidenceSignals.push(`按岗位类别 ${job.category} 使用专业兜底映射`);
  }

  const majorSignals = Array.from(majorScores.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .map(([major]) => major)
    .slice(0, 4);

  return {
    ...job,
    majorSignals,
    abilitySignals: Array.from(new Set([...job.requirements, ...abilitySignals])).slice(0, 8),
    evidenceSignals: Array.from(new Set(evidenceSignals)).slice(0, 5),
  };
}

function redactJobForPublication(job: Job): Job {
  const abilitySignals = Array.from(new Set([...(job.abilitySignals ?? []), ...job.requirements.map(cleanText).filter(Boolean)])).slice(0, 6);
  const requirements = abilitySignals.length ? abilitySignals.slice(0, 5) : [job.category, job.direction].map(cleanText).filter(Boolean).slice(0, 5);
  const summaryParts = [
    `${job.companyName}「${job.title}」`,
    [job.location, job.direction || job.category].filter(Boolean).join(" / "),
    requirements.length ? `能力信号：${requirements.slice(0, 3).join(" / ")}` : "",
    job.salary.source === "official" ? "薪资来自官网公开样本" : "薪资为市场估算，需回官网核验",
    "完整岗位说明请打开官方链接",
  ].filter(Boolean);

  return {
    ...job,
    description: truncatePublicText(`岗位摘要：${summaryParts.join("；")}`, 280),
    requirements,
    tags: Array.from(new Set(job.tags.map(cleanText).filter(Boolean))).slice(0, 6),
    abilitySignals,
    evidenceSignals: (job.evidenceSignals ?? []).map((signal) => truncatePublicText(signal, 120)).slice(0, 5),
  };
}

function summarizeCareerSignalCoverage(jobs: Job[]) {
  const majorCounts = new Map<string, number>();
  const abilityCounts = new Map<string, number>();

  for (const job of jobs) {
    job.majorSignals?.forEach((major) => majorCounts.set(major, (majorCounts.get(major) ?? 0) + 1));
    job.abilitySignals?.forEach((ability) => abilityCounts.set(ability, (abilityCounts.get(ability) ?? 0) + 1));
  }

  return {
    jobsWithMajorSignals: jobs.filter((job) => (job.majorSignals?.length ?? 0) > 0).length,
    jobsWithAbilitySignals: jobs.filter((job) => (job.abilitySignals?.length ?? 0) > 0).length,
    topMajors: topCountEntries(majorCounts, 12),
    topAbilities: topCountEntries(abilityCounts, 12),
  };
}

function topCountEntries(map: Map<string, number>, limit: number) {
  return Array.from(map.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function renderGeneratedModule(generatedAt: string, sources: JsonValue, careerSignalCoverage: JsonValue, jobs: Job[]) {
  return `import type { Job } from "../types";

// Auto-generated by npm run scrape:jobs. Do not hand edit.
export const jobDataMeta = ${JSON.stringify({ generatedAt, sources, careerSignalCoverage }, null, 2)} as const;

export const jobs: Job[] = ${JSON.stringify(jobs, null, 2)};
`;
}

function byteDanceHeaders() {
  return {
    "content-type": "application/json",
    "accept-language": "zh-CN",
    "Portal-Channel": "mainland",
    "Portal-Platform": "pc",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    referer: `${bytedanceBaseUrl}${bytedancePositionPath}`,
  };
}

function tencentHeaders() {
  return {
    "accept-language": "zh-CN,zh;q=0.9",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: `${tencentBaseUrl}/search.html`,
  };
}

function alibabaHeaders(cookie: string) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    origin: alibabaBaseUrl,
    referer: `${alibabaBaseUrl}/campus/position`,
    cookie,
  };
}

function baiduHeaders(pageUrl: string) {
  return {
    "accept-language": "zh-CN,zh;q=0.9",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: pageUrl === baiduBaseUrl ? baiduBaseUrl : `${baiduBaseUrl}/`,
  };
}

function meituanHeaders() {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: `${meituanBaseUrl}/jobs`,
  };
}

function jdHeaders() {
  return {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "user-agent": byteDanceHeaders()["user-agent"],
    "x-requested-with": "XMLHttpRequest",
    referer: jdCompany.sourceUrl,
  };
}

function huaweiHeaders() {
  return {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "user-agent": byteDanceHeaders()["user-agent"],
    "x-requested-with": "XMLHttpRequest",
    referer: `${huaweiBaseUrl}${huaweiPortalPath}`,
  };
}

function kuaishouHeaders() {
  return {
    accept: "application/json",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: kuaishouCompany.sourceUrl,
  };
}

function workdayHeaders(referer: string) {
  return {
    accept: "application/json",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer,
  };
}

function bilibiliHeaders(csrfToken?: string) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json;charset=UTF-8",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: `${bilibiliBaseUrl}/`,
    "X-AppKey": "ops.ehr-api.auth",
    "X-UserType": "2",
    ...(csrfToken
      ? {
          "X-CSRF": csrfToken,
          csrf: csrfToken,
          cookie: `X-CSRF=${csrfToken}`,
        }
      : {}),
  };
}

function xiaomiHeaders(auth?: { csrfToken: string; cookie: string }) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: xiaomiCompany.sourceUrl,
    "website-path": "index",
    "portal-channel": "saas-career",
    "portal-platform": "pc",
    ...(auth
      ? {
          "x-csrf-token": auth.csrfToken,
          cookie: auth.cookie,
        }
      : {}),
  };
}

function pddHeaders(referer = pddCompany.sourceUrl) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    origin: pddBaseUrl,
    referer,
  };
}

function mideaHeaders() {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: mideaCompany.sourceUrl,
  };
}

function amazonHeaders() {
  return {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: amazonCompany.sourceUrl,
  };
}

function ikeaHeaders() {
  return {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8",
    "user-agent": byteDanceHeaders()["user-agent"],
    referer: ikeaCompany.sourceUrl,
  };
}

function lorealHeaders() {
  return {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8",
    "user-agent": byteDanceHeaders()["user-agent"],
    "x-requested-with": "XMLHttpRequest",
    referer: lorealCompany.sourceUrl,
  };
}

async function fetchJson<T>(url: string, headers: Record<string, string>, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${init.method ?? "GET"} ${url} failed with HTTP ${response.status}: ${body.slice(0, 240)}`);
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": byteDanceHeaders()["user-agent"],
      referer: bytedanceHomeUrl,
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with HTTP ${response.status}`);
  }

  return response.text();
}

function cookieHeaderFromResponse(headers: Headers) {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const rawCookies = withGetSetCookie.getSetCookie?.() ?? splitSetCookieHeader(headers.get("set-cookie"));
  return rawCookies
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

function splitSetCookieHeader(value: string | null) {
  if (!value) return [];
  return value.split(/,(?=\s*[\w-]+=)/).map((cookie) => cookie.trim()).filter(Boolean);
}

function extractScriptUrls(html: string, baseUrl = bytedanceHomeUrl) {
  return Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g))
    .map((match) => toAbsoluteUrl(match[1], baseUrl))
    .filter((url) => url.endsWith(".js"));
}

function toAbsoluteUrl(url: string, baseUrl = bytedanceHomeUrl) {
  if (url.startsWith("//")) return `https:${url}`;
  return new URL(url, baseUrl).href;
}

function appendQuery(path: string, params: JsonRecord) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "undefined")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return query ? `${path}?${query}` : path;
}

function getNumberEnv(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getListEnv(name: string, fallback: string[]) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const values = raw.split(",").map((value) => value.trim()).filter(Boolean);
  return values.length > 0 ? values : fallback;
}

function parseIkeaJobs(resultsHtml: string, keyword: string): IkeaRawJob[] {
  const jobs: IkeaRawJob[] = [];
  const anchorPattern = /<a\s+href="([^"]+)"\s+data-job-id="([^"]+)"\s+class="job-list__anchor">([\s\S]*?)<\/a>/g;

  for (const match of resultsHtml.matchAll(anchorPattern)) {
    const [, sourcePath, id, body] = match;
    const title = extractHtmlClassText(body, "job-list__title");
    const location = extractHtmlClassText(body, "job-list__location");
    const categoryName = extractHtmlClassText(body, "job-list__categories");
    const jobType = extractHtmlClassText(body, "job-list__job-type");

    if (!id || !title || !sourcePath) continue;
    jobs.push({
      id: cleanText(id),
      title,
      location,
      categoryName,
      jobType,
      sourcePath,
      searchKeyword: keyword,
    });
  }

  return jobs;
}

function extractHtmlClassText(html: string, className: string) {
  const pattern = new RegExp(`<[^>]+class=["'][^"']*${escapeRegExp(className)}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i");
  const match = html.match(pattern);
  return match ? decodeHtmlEntities(stripHtmlToText(match[1])) : "";
}

function readHtmlDataAttribute(html: string, name: string) {
  const pattern = new RegExp(`data-${escapeRegExp(name)}=["']([^"']+)["']`, "i");
  return decodeHtmlEntities(html.match(pattern)?.[1] ?? "");
}

function cleanText(value: unknown) {
  return typeof value === "string" ? decodeHtmlEntities(value).replace(/\s+/g, " ").trim() : "";
}

function truncatePublicText(value: string, maxLength: number) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function cleanString(value: unknown) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function stripHtmlToText(value: unknown) {
  if (typeof value !== "string") return "";
  return cleanText(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<\/li>|<\/h\d>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, "\"")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"),
  );
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function isPresent(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error(formatError(error));
  process.exit(1);
});
