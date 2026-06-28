import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Kino, Progress } from "react-kino";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  Layers3,
  LineChart,
  Medal,
  MessageSquare,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { jobDataMeta, jobs } from "./data/jobs";
import { aiItMarketInsightSource, aiItTalentPreferenceSignals } from "./data/aiItMarketInsightSignals";
import { beijingAdmissionSignalSource } from "./data/beijingAdmissionSignals";
import { beijingScoreSegmentSignalSource } from "./data/beijingScoreSegmentSignals";
import { bossAggregatedSampleCount, bossAggregatedSkillSignals, bossAggregatedTopSkillCount } from "./data/bossAggregatedSignals";
import { bossExcelAggregateSignalSource, bossExcelRoleBuckets, bossExcelSkillBuckets } from "./data/bossExcelAggregateSignals";
import { chinaUniversityAdmissionAggregateSignalSource } from "./data/chinaUniversityAdmissionAggregateSignals";
import { availableExternalSchoolRows, checkedExternalCareerDirectoryRows, connectedExternalCareerAggregateSourceCount, connectedExternalSchoolSourceCount, externalCareerDirectoryRows, externalDataSources, importedExternalSchoolRows, schoolDataReferenceSourceCount, type ExternalDataSource } from "./data/externalDataSources";
import { gaokaoAdvisorAuditSignalSource } from "./data/gaokaoAdvisorAuditSignals";
import { hubeiAdmissionOneScoreBandCount, hubeiAdmissionSignalSource } from "./data/gaokaoAdmissionSignals";
import { gtdimXuefengAdmissionAggregateSignalSource } from "./data/gtdimXuefengAdmissionAggregateSignals";
import { nationalEducationSignalSource } from "./data/nationalEducationSignals";
import { qinghaiPlanSignalSource } from "./data/qinghaiPlanSignals";
import { ruoyiCersSignalSource } from "./data/ruoyiCersSignals";
import { shandongAdminAggregateSignalSource, shandongAdminCategoryBuckets } from "./data/shandongAdminAggregateSignals";
import { shandongAdmissionSignalSource } from "./data/shandongAdmissionSignals";
import { spiderCollegeAggregateSignalSource } from "./data/spiderCollegeAggregateSignals";
import { yunnanScoreSegmentSignalSource } from "./data/yunnanScoreSegmentSignals";
import { majorPaths, startupTracks } from "./data/gaokao";
import { getCareerDirectoryMatchesForSchool, schoolCareerDirectorySource, type SchoolCareerDirectoryEntry } from "./data/schoolCareerDirectory";
import { getCareerDirectoryHealth, getCareerDirectoryHealthLabel } from "./data/schoolCareerDirectoryHealth";
import { buildOfficialSearchCards, officialCompanySources, type OfficialCompanySource } from "./data/officialSources";
import { companyDemandProfiles, formatMonthlyRange, majorSalaryProfiles, type MajorSalaryProfile } from "./data/majorMarket";
import { initialProfile, selectableSkills } from "./data/profile";
import { getRecruiterSources, schoolOutcomeProfiles, type SchoolOfficialLink, type SchoolOutcomeMajor } from "./data/schoolOutcomes";
import { universities } from "./data/universities";
import { CareerRadarPanel } from "./features/radar/CareerRadarPanel";
import { CareerSignalHubPanel } from "./features/signals/CareerSignalHubPanel";
import { getBadges, getLearningAdvice, getMarketInsights, getRecommendedJobs } from "./lib/analysis";
import { buildCareerRadar } from "./lib/careerRadar";
import {
  areNormalizedTermsRelated,
  buildCareerRadarEvidence,
  getAllAggregatedOfficialJobs,
  getMarketTokens,
  normalizeMarketText,
  type AggregatedOfficialJob,
} from "./lib/careerRadarEvidence";
import { buildCareerSignals, summarizeCareerSignals } from "./lib/careerSignals";
import { getCompanyLogoSources, getCompanyLogoText } from "./lib/companyLogos";
import { getEmploymentSignals, getFourYearPlan, scoreMajorPaths, scoreStartupTracks } from "./lib/gaokao";
import { diversifyOfficialJobMatches, jobCategoryLabels, searchOfficialJobs, type OfficialJobMatch } from "./lib/officialJobSearch";
import { buildSchoolActionCommand, type SchoolActionCommand } from "./lib/schoolActionCommand";
import { buildSchoolCandidateCompareReport } from "./lib/schoolCandidateCompareReport";
import {
  buildSchoolCandidateCompareVerdict,
  type SchoolCandidateCompareVerdict,
} from "./lib/schoolCandidateCompareVerdict";
import { buildSchoolCampusRecruitingLeads, type SchoolCampusRecruitingLead } from "./lib/schoolCampusRecruitingLeads";
import { buildSchoolAggregationReport, type SchoolAggregationReport } from "./lib/schoolAggregationReport";
import {
  buildSchoolEvidenceAggregationBrief,
  type SchoolEvidenceAggregationBrief,
} from "./lib/schoolEvidenceAggregationBrief";
import { buildSchoolInfoPacketPreviewLines } from "./lib/schoolInfoPacketPreview";
import { buildSchoolNextAction, type SchoolNextAction } from "./lib/schoolNextAction";
import {
  buildSchoolOfficialEntranceLauncherCards,
  buildSchoolPublicMajorAccessEntries,
  type SchoolOfficialEntranceLauncherCard,
  type SchoolPublicMajorAccessEntry,
} from "./lib/schoolPublicMajorAccess";
import { buildSchoolPublicSourceRoutes, type SchoolPublicSourceRoute } from "./lib/schoolPublicSourceRoutes";
import {
  buildSchoolRescueActionRunway,
  type SchoolRescueActionRunway,
} from "./lib/schoolRescueActionRunway";
import {
  buildSchoolRescueTakeaway,
  type SchoolRescueTakeaway,
} from "./lib/schoolRescueTakeaway";
import {
  buildSchoolWorkbenchStorageKey,
  getSchoolWorkbenchLocalStorage,
  readSchoolCandidateComparisonSnapshot,
  readSchoolWorkbenchStorageSnapshot,
  writeSchoolCandidateComparisonSnapshot,
  writeSchoolWorkbenchStorageSnapshot,
} from "./lib/schoolWorkbenchPersistence";
import {
  buildUnknownSchoolAuthorityEntrances,
  buildUnknownSchoolEntryPack,
  buildUnknownSchoolEntryPacketText,
  buildUnknownSchoolEvidenceCaptureTemplate,
  buildUnknownSchoolEntryPacketPreviewLines,
  buildUnknownSchoolEvidenceGuide,
  buildUnknownSchoolOfficialSiteRecipes,
  buildUnknownSchoolOfficialSourceTaskFlow,
  buildUnknownSchoolPublicEntranceDirectory,
  buildUnknownSchoolPublicDocumentMatrix,
  extractUnknownSchoolOfficialDomain,
  pickUnknownSchoolFastEntranceEntries,
  type UnknownSchoolAuthorityEntrance,
  type UnknownSchoolEntryPackItem,
  type UnknownSchoolEvidenceGuideStep,
  type UnknownSchoolOfficialSiteRecipe,
  type UnknownSchoolOfficialSourceTask,
  type UnknownSchoolPublicEntranceDirectoryGroup,
  type UnknownSchoolPublicDocumentMatrixItem,
} from "./lib/unknownSchoolEntryPack";
import {
  buildUnknownSchoolDirectionPresets,
  buildUnknownSchoolTypeStrategy,
  type UnknownSchoolDirectionPreset,
  type UnknownSchoolTypeStrategy,
} from "./lib/unknownSchoolDirectionPresets";
import { getSchoolEvidenceTaskKey } from "./lib/schoolEvidenceTaskProgress";
import {
  buildSchoolEvidenceTrustSummary,
  getSchoolEvidencePacketTrustLevel,
  getSchoolEvidencePromotionHint,
  groupSchoolManualEvidenceForPacket,
} from "./lib/schoolEvidencePacket";
import {
  buildSchoolEvidenceCompanyFollowups,
  type SchoolEvidenceCompanyFollowup,
} from "./lib/schoolEvidenceCompanyFollowups";
import {
  buildSchoolEvidenceOutcomeSnapshot,
  type SchoolEvidenceOutcomeSnapshot,
} from "./lib/schoolEvidenceOutcomeSnapshot";
import { buildSchoolEvidenceReadiness, type SchoolEvidenceReadiness } from "./lib/schoolEvidenceReadiness";
import {
  buildUnknownSchoolSourceTaskProgress,
  summarizeUnknownSchoolSourceTaskProgress,
  type UnknownSchoolSourceTaskProgressItem,
} from "./lib/unknownSchoolSourceTaskProgress";
import { parseSchoolEvidenceText, parseSchoolEvidenceTextBatch, type ParsedSchoolEvidence } from "./lib/schoolEvidenceParser";
import { buildUniversityMajorMatches } from "./lib/universityMatching";
import type { AppMode, Badge, Job, JobCategory, SalaryEstimate, Skill, UniversityMajorJobMatch } from "./types";
import "./styles.css";

type MbtiDimension = "energy" | "info" | "decision" | "structure";
type MbtiAnswers = Record<MbtiDimension, "left" | "right">;
type GlobalSearchKind = "school" | "major" | "job" | "company";
type GlobalSearchTarget = "school-major" | "career-radar" | "big-tech" | "major-salary";
type GlobalSearchIntent = {
  kind: GlobalSearchKind;
  target: GlobalSearchTarget;
  query: string;
  label: string;
  detail: string;
  value: string;
  schoolId?: string;
  majorId?: string;
  timestamp: number;
};
type GlobalSearchSuggestion = Omit<GlobalSearchIntent, "timestamp">;
type SchoolCareerRadarHandoff = {
  schoolName: string;
  majorName: string;
  jobName: string;
  query: string;
};
type LifeNextAction = {
  id: "school" | "radar" | "signals";
  query: string;
  label: string;
};

const categoryLabels = jobCategoryLabels;
const activeJobDataSourceCount = jobDataMeta.sources.filter((source) => Number(source.normalizedCount ?? 0) > 0).length;
const jobDataSourceSummary = `${activeJobDataSourceCount}/${jobDataMeta.sources.length} 个 live adapter 有当前样本`;

const bigTechJobFilters = [
  { id: "all", label: "全部", description: "先看官网聚合结果，理解公司真实需求分布。" },
  { id: "ai", label: "AI / 算法", description: "大模型、推荐、Agent、搜索和智能系统。" },
  { id: "software", label: "软件 / 平台", description: "后端、基础设施、云平台和工程效率。" },
  { id: "product-data", label: "产品 / 数据", description: "产品、运营、增长、数据分析和业务策略。" },
  { id: "security-cloud", label: "云 / 安全", description: "安全、风控、云服务和稳定性岗位。" },
  { id: "campus", label: "校招 / 实习", description: "更适合刚入学就反向准备的入口。" },
] as const;

type BigTechJobFilter = (typeof bigTechJobFilters)[number]["id"];

const mbtiQuestions: Array<{
  id: MbtiDimension;
  title: string;
  left: { code: string; label: string; desc: string };
  right: { code: string; label: string; desc: string };
}> = [
  {
    id: "energy",
    title: "你更容易从哪里获得能量？",
    left: { code: "E", label: "外部协作", desc: "讨论、表达、组队推进时状态更好" },
    right: { code: "I", label: "独立深潜", desc: "安静研究、写作、独立做项目时更稳定" },
  },
  {
    id: "info",
    title: "你更相信哪类信息？",
    left: { code: "S", label: "现实证据", desc: "案例、数据、规则、可落地路径更能说服你" },
    right: { code: "N", label: "趋势可能", desc: "模型、趋势、未来机会和抽象规律更吸引你" },
  },
  {
    id: "decision",
    title: "你做选择时更看重什么？",
    left: { code: "T", label: "逻辑收益", desc: "重视因果、效率、能力迁移和长期回报" },
    right: { code: "F", label: "价值共鸣", desc: "重视意义、关系、体验和能否帮助他人" },
  },
  {
    id: "structure",
    title: "你习惯怎样推进目标？",
    left: { code: "J", label: "计划推进", desc: "喜欢清单、节点、确定路线和复盘节奏" },
    right: { code: "P", label: "探索迭代", desc: "喜欢试错、开放选择和边做边调整" },
  },
];

const mbtiProfiles: Record<string, { name: string; summary: string; strengths: string[]; caution: string }> = {
  INTJ: {
    name: "战略型建造者",
    summary: "适合从复杂趋势里抽出路线，把长期目标拆成系统工程。",
    strengths: ["长期规划", "模型思维", "独立学习", "系统设计"],
    caution: "不要过早追求完美方案，用真实项目和外部反馈校准判断。",
  },
  INTP: {
    name: "研究型探索者",
    summary: "适合技术研究、算法、产品原型和新问题拆解。",
    strengths: ["抽象分析", "深度学习", "问题拆解", "技术好奇心"],
    caution: "想法需要被交付验证，给自己设置清晰截止日期。",
  },
  ENTJ: {
    name: "组织型推进者",
    summary: "适合产品、创业、项目管理和高强度目标推进。",
    strengths: ["目标感", "资源整合", "决策效率", "领导力"],
    caution: "补足用户共情，避免只用效率压过真实需求。",
  },
  ENFP: {
    name: "机会型连接者",
    summary: "适合内容产品、增长、社群、创意工具和跨界创业。",
    strengths: ["表达感染力", "机会感知", "人际连接", "创意发散"],
    caution: "建立稳定执行系统，避免方向频繁跳转。",
  },
  ISTJ: {
    name: "稳健型执行者",
    summary: "适合工程落地、质量体系、运营管理和稳定职业路径。",
    strengths: ["责任感", "流程意识", "稳定执行", "细节把控"],
    caution: "主动接触新工具和新场景，避免被变化速度甩开。",
  },
  INFJ: {
    name: "洞察型助推者",
    summary: "适合教育、咨询、产品研究、社会价值和长期陪伴型职业。",
    strengths: ["共情洞察", "长期主义", "文字表达", "价值判断"],
    caution: "把理想拆成可衡量成果，避免只停在愿景层。",
  },
};

const defaultMbti: MbtiAnswers = {
  energy: "right",
  info: "right",
  decision: "left",
  structure: "left",
};
const defaultLifeTodoIds = ["todo-identity", "todo-major-map"];
const lifeDashboardStorageKey = "kankan-salary.life-dashboard.v1";

type LifeDashboardState = {
  mbtiAnswers: MbtiAnswers;
  doneTodos: string[];
};

function App() {
  return <SalaryApp />;
}

type SalaryAppTab = "life" | "signals" | "companies" | "industries" | "school" | "radar";
type SalaryCompanyRegion = "domestic" | "overseas";
type SalaryIndustryId =
  | "internet-ai"
  | "manufacturing-auto"
  | "consumer-retail"
  | "finance-consulting"
  | "hospitality-aviation"
  | "game-content"
  | "public-other";

type SalaryIndustryDefinition = {
  id: SalaryIndustryId;
  label: string;
  shortLabel: string;
  description: string;
  companyIds: string[];
  keywords: string[];
  accent: string;
};

type SalaryCompanyProfile = {
  source: (typeof officialCompanySources)[number];
  demandProfile: (typeof companyDemandProfiles)[number] | null;
  jobs: Job[];
  sampleCount: number;
  officialSalaryCount: number;
  estimatedSalaryCount: number;
  region: SalaryCompanyRegion;
  industry: SalaryIndustryDefinition;
  salaryRange: [number, number];
  salaryMode: "official" | "job-estimate" | "market-estimate";
  salaryUpdatedAt: string;
  topCategories: string[];
  topLocations: string[];
  topMajors: string[];
  topRoles: string[];
  score: number;
};

const salaryAppTabs: Array<{ id: SalaryAppTab; label: string; icon: React.ElementType }> = [
  { id: "life", label: "人生规划", icon: Compass },
  { id: "school", label: "学校入口", icon: GraduationCap },
  { id: "radar", label: "岗位雷达", icon: Target },
  { id: "signals", label: "职业信号", icon: Bell },
  { id: "companies", label: "公司工资", icon: Building2 },
  { id: "industries", label: "行业对比", icon: BarChart3 },
];

const domesticCompanyIds = new Set([
  "bytedance",
  "tencent",
  "alibaba",
  "meituan",
  "baidu",
  "jd",
  "huawei",
  "kuaishou",
  "bilibili",
  "xiaomi",
  "pdd",
  "midea",
  "ant",
  "netease",
  "byd",
]);

const salaryIndustryDefinitions: SalaryIndustryDefinition[] = [
  {
    id: "internet-ai",
    label: "互联网 / AI / 云",
    shortLabel: "互联网 AI",
    description: "算法、软件、数据、产品、云平台和增长岗位集中。",
    companyIds: ["bytedance", "tencent", "alibaba", "meituan", "baidu", "kuaishou", "bilibili", "pdd", "google", "microsoft"],
    keywords: ["AI", "算法", "云", "大模型", "推荐", "搜索", "软件", "平台", "数据", "产品"],
    accent: "#2563eb",
  },
  {
    id: "manufacturing-auto",
    label: "硬件 / 制造 / 新能源",
    shortLabel: "制造硬件",
    description: "通信、芯片、终端、汽车、机器人、供应链和智能制造。",
    companyIds: ["huawei", "xiaomi", "midea", "byd", "apple"],
    keywords: ["硬件", "芯片", "通信", "制造", "新能源", "机器人", "汽车", "供应链", "终端"],
    accent: "#0f766e",
  },
  {
    id: "consumer-retail",
    label: "消费 / 零售 / 品牌",
    shortLabel: "消费零售",
    description: "品牌、零售、运营、供应链、研发和消费者洞察。",
    companyIds: ["jd", "amazon", "ikea", "unilever", "loreal", "apple"],
    keywords: ["消费", "零售", "品牌", "快消", "美妆", "电商", "门店", "客户体验", "供应链"],
    accent: "#b45309",
  },
  {
    id: "finance-consulting",
    label: "金融 / 咨询 / 审计",
    shortLabel: "金融咨询",
    description: "投行、风险、审计、税务、咨询、商业分析和金融科技。",
    companyIds: ["ant", "jpmorgan", "goldman", "deloitte", "pwc"],
    keywords: ["金融", "投行", "审计", "税务", "咨询", "风险", "财富", "会计", "Human Capital"],
    accent: "#7c3aed",
  },
  {
    id: "hospitality-aviation",
    label: "酒店 / 航旅 / 服务",
    shortLabel: "服务航旅",
    description: "酒店运营、餐饮、航空服务、收益管理、销售和客户体验。",
    companyIds: ["marriott", "hilton", "hyatt", "cathay"],
    keywords: ["酒店", "航空", "服务", "餐饮", "前厅", "旅游", "会展", "客户"],
    accent: "#047857",
  },
  {
    id: "game-content",
    label: "游戏 / 内容 / 发行",
    shortLabel: "游戏内容",
    description: "游戏技术、图形引擎、策划、美术、内容社区和全球发行。",
    companyIds: ["tencent", "netease", "hoyoverse", "bilibili"],
    keywords: ["游戏", "内容", "引擎", "美术", "策划", "发行", "社区", "AIGC"],
    accent: "#be123c",
  },
  {
    id: "public-other",
    label: "综合 / 其他",
    shortLabel: "综合",
    description: "暂未归入单一行业，优先看官网岗位和专业市场代理。",
    companyIds: [],
    keywords: [],
    accent: "#475569",
  },
];

const salaryPageSize = 8;
const detailJobPageSize = 5;
const ordinarySchoolFirstIds = ["ztbu", "nfu", "wtbu", "cdjcc", "hustwenhua", "wsyu", "peihua", "zjsru", "hhstu", "sju", "cqytu", "shengda"];
const schoolExplorerProfiles = orderSchoolOutcomeProfilesForExplorer(schoolOutcomeProfiles);
const defaultSchoolExplorerProfile = schoolExplorerProfiles[0] ?? schoolOutcomeProfiles[0];
const featuredSchoolExplorerProfile = schoolOutcomeProfiles.find((school) => school.id === "zzuli") ?? defaultSchoolExplorerProfile;

function SalaryApp() {
  const [activeTab, setActiveTab] = useState<SalaryAppTab>("life");
  const companyProfiles = useMemo(() => buildSalaryCompanyProfiles(), []);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyProfiles[0]?.source.id ?? "bytedance");
  const [regionFilter, setRegionFilter] = useState<"all" | SalaryCompanyRegion>("all");
  const [industryFilter, setIndustryFilter] = useState<"all" | SalaryIndustryId>("all");
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyPage, setCompanyPage] = useState(1);
  const [quickSchoolQuery, setQuickSchoolQuery] = useState("");
  const [salarySchoolIntent, setSalarySchoolIntent] = useState<GlobalSearchIntent | null>(null);
  const [salaryRadarIntent, setSalaryRadarIntent] = useState<GlobalSearchIntent | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>(() => companyProfiles.slice(0, 4).map((company) => company.source.id));
  const directMatches = useMemo(() => buildUniversityMajorMatches(universities, majorPaths, jobs), []);
  const liveAdapterCount = officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length;
  const officialSalaryCount = jobs.filter((job) => job.salary.source === "official").length;
  const domesticCount = companyProfiles.filter((company) => company.region === "domestic").length;
  const overseasCount = companyProfiles.length - domesticCount;
  const selectedCompany = companyProfiles.find((company) => company.source.id === selectedCompanyId) ?? companyProfiles[0];
  const latestSalaryDate = getLatestSalaryDate(jobs);
  const careerSignals = useMemo(
    () =>
      buildCareerSignals({
        jobs,
        majorSalaryProfiles,
        officialCompanySources,
        schoolOutcomeProfiles,
      }),
    [],
  );
  const careerSignalSummary = useMemo(() => summarizeCareerSignals(careerSignals), [careerSignals]);

  const filteredCompanies = useMemo(() => {
    const query = normalizeSalarySearchText(companyQuery);
    return companyProfiles.filter((company) => {
      if (regionFilter !== "all" && company.region !== regionFilter) return false;
      if (industryFilter !== "all" && company.industry.id !== industryFilter) return false;
      if (!query) return true;
      const haystack = normalizeSalarySearchText([
        company.source.name,
        company.source.domain,
        company.industry.label,
        company.region === "domestic" ? "国内企业" : "海外企业",
        ...company.source.focus,
        ...company.topRoles,
        ...company.topMajors,
        ...(company.demandProfile?.preferredMajors ?? []),
        ...(company.demandProfile?.roleFamilies ?? []),
      ].join(" "));
      return haystack.includes(query);
    });
  }, [companyProfiles, companyQuery, industryFilter, regionFilter]);

  useEffect(() => {
    setCompanyPage(1);
  }, [companyQuery, industryFilter, regionFilter]);

  useEffect(() => {
    setCompareIds((current) => {
      if (current.includes(selectedCompanyId)) return current;
      return [selectedCompanyId, ...current].slice(0, 4);
    });
  }, [selectedCompanyId]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / salaryPageSize));
  const visibleCompanies = filteredCompanies.slice((companyPage - 1) * salaryPageSize, companyPage * salaryPageSize);

  const toggleCompare = (companyId: string) => {
    setCompareIds((current) => {
      if (current.includes(companyId)) {
        return current.length <= 1 ? current : current.filter((id) => id !== companyId);
      }
      return [companyId, ...current].slice(0, 4);
    });
  };
  const startSchoolAggregation = (schoolName = quickSchoolQuery) => {
    const query = schoolName.trim();
    if (!query) return;
    setQuickSchoolQuery(query);
    setSalarySchoolIntent({
      kind: "school",
      target: "school-major",
      query,
      label: query,
      detail: "从首屏普通学校入口进入",
      value: query,
      timestamp: Date.now(),
    });
    setActiveTab("school");
  };
  const openCareerRadarFromSchool = ({ schoolName, majorName, jobName, query }: SchoolCareerRadarHandoff) => {
    const radarQuery = query.trim() || jobName.trim() || majorName.trim();
    if (!radarQuery) return;
    setSalaryRadarIntent({
      kind: "job",
      target: "career-radar",
      query: radarQuery,
      label: radarQuery,
      detail: `${schoolName} · ${majorName || "专业待补"}`,
      value: radarQuery,
      timestamp: Date.now(),
    });
    setActiveTab("radar");
  };
  const openLifeNextAction = (action: LifeNextAction) => {
    const query = action.query.trim();
    if (action.id === "school" && query) {
      setSalarySchoolIntent({
        kind: "major",
        target: "school-major",
        query,
        label: action.label,
        detail: "人生规划下一步：先核验目标学校和专业证据",
        value: query,
        timestamp: Date.now(),
      });
    }
    if (action.id === "radar" && query) {
      setSalaryRadarIntent({
        kind: "job",
        target: "career-radar",
        query,
        label: action.label,
        detail: "人生规划下一步：用岗位雷达倒推专业",
        value: query,
        timestamp: Date.now(),
      });
    }
    setActiveTab(action.id);
  };
  const renderSalaryTabs = () =>
    salaryAppTabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
          <Icon size={17} />
          <span>{tab.label}</span>
        </button>
      );
    });

  return (
    <div className="salary-app">
      <header className="salary-topbar">
        <button className="salary-brand" onClick={() => setActiveTab("life")} aria-label="回到人生规划仪表盘">
          <span aria-hidden="true">薪</span>
          <strong>看看工资</strong>
        </button>
        <nav className="salary-nav" aria-label="主要功能">{renderSalaryTabs()}</nav>
        <div className="salary-refresh">
          <span>薪资每日刷新</span>
          <strong>{latestSalaryDate}</strong>
        </div>
      </header>
      <nav className="salary-mobile-tabbar" aria-label="主要功能">{renderSalaryTabs()}</nav>

      <main className="salary-workspace">
        {activeTab === "life" && (
          <section className="salary-page salary-life-page">
            <LifeDashboard searchIntent={salarySchoolIntent ?? salaryRadarIntent} onOpenNextAction={openLifeNextAction} />
          </section>
        )}

        {activeTab === "school" && (
          <section className="salary-page salary-embedded-page salary-school-entry-page">
            <SchoolMajorExplorer searchIntent={salarySchoolIntent} onOpenCareerRadar={openCareerRadarFromSchool} />
            <SalarySnapshotBand
              officialCompanyCount={officialCompanySources.length}
              liveAdapterCount={liveAdapterCount}
              jobCount={jobs.length}
              officialSalaryCount={officialSalaryCount}
              domesticCount={domesticCount}
              overseasCount={overseasCount}
              industryCount={salaryIndustryDefinitions.length - 1}
            />
            <DirectMatchBoard matches={directMatches} salaryUpdatedAt={jobDataMeta.generatedAt} />
          </section>
        )}

        {activeTab === "companies" && (
          <>
            <SalarySchoolStartPanel
              value={quickSchoolQuery}
              onChange={setQuickSchoolQuery}
              onStart={startSchoolAggregation}
            />
            <SalarySnapshotBand
              officialCompanyCount={officialCompanySources.length}
              liveAdapterCount={liveAdapterCount}
              jobCount={jobs.length}
              officialSalaryCount={officialSalaryCount}
              domesticCount={domesticCount}
              overseasCount={overseasCount}
              industryCount={salaryIndustryDefinitions.length - 1}
            />
          </>
        )}

        {activeTab === "companies" && (
          <section className="salary-page salary-company-page" aria-label="公司工资">
            <div className="salary-page-heading">
              <div>
                <p className="salary-kicker">Company Salary Browser</p>
                <h1>先看公司，再进详情，不把所有岗位挤在一页。</h1>
              </div>
              <label className="salary-search">
                <Search size={18} />
                <input value={companyQuery} onChange={(event) => setCompanyQuery(event.target.value)} placeholder="搜公司、行业、专业或岗位" />
              </label>
            </div>

            <div className="salary-filter-row" aria-label="公司筛选">
              <div className="salary-segmented">
                {[
                  { id: "all", label: "全部" },
                  { id: "domestic", label: "国内企业" },
                  { id: "overseas", label: "海外企业" },
                ].map((option) => (
                  <button
                    key={option.id}
                    className={regionFilter === option.id ? "active" : ""}
                    onClick={() => setRegionFilter(option.id as "all" | SalaryCompanyRegion)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="salary-chip-row">
                <button className={industryFilter === "all" ? "active" : ""} onClick={() => setIndustryFilter("all")}>全部行业</button>
                {salaryIndustryDefinitions.filter((industry) => industry.id !== "public-other").map((industry) => (
                  <button
                    key={industry.id}
                    className={industryFilter === industry.id ? "active" : ""}
                    onClick={() => setIndustryFilter(industry.id)}
                  >
                    {industry.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="salary-company-layout">
              <section className="salary-company-list" aria-label="公司列表">
                <div className="salary-list-toolbar">
                  <span>{filteredCompanies.length} 家企业</span>
                  <div>
                    <button disabled={companyPage <= 1} onClick={() => setCompanyPage((page) => Math.max(1, page - 1))}>上一页</button>
                    <strong>{companyPage} / {totalPages}</strong>
                    <button disabled={companyPage >= totalPages} onClick={() => setCompanyPage((page) => Math.min(totalPages, page + 1))}>下一页</button>
                  </div>
                </div>

                <div className="salary-company-grid">
                  {visibleCompanies.map((company) => (
                    <SalaryCompanyCard
                      key={company.source.id}
                      company={company}
                      active={company.source.id === selectedCompany.source.id}
                      inCompare={compareIds.includes(company.source.id)}
                      onOpen={() => setSelectedCompanyId(company.source.id)}
                      onToggleCompare={() => toggleCompare(company.source.id)}
                    />
                  ))}
                </div>
              </section>

              {selectedCompany && (
                <SalaryCompanyDetail
                  company={selectedCompany}
                  inCompare={compareIds.includes(selectedCompany.source.id)}
                  onToggleCompare={() => toggleCompare(selectedCompany.source.id)}
                />
              )}
            </div>

            <SalaryCompanyCompare profiles={companyProfiles} compareIds={compareIds} onSelect={setSelectedCompanyId} />
          </section>
        )}

        {activeTab === "industries" && (
          <SalaryIndustryCompare profiles={companyProfiles} onSelectCompany={(companyId) => {
            setSelectedCompanyId(companyId);
            setActiveTab("companies");
          }} />
        )}

        {activeTab === "radar" && (
          <section className="salary-page salary-embedded-page">
            <div className="salary-page-heading compact">
              <div>
                <p className="salary-kicker">Career Radar</p>
                <h1>给一个岗位，按关联强度倒推专业。</h1>
              </div>
            </div>
            <CareerRadarPanel searchIntent={salaryRadarIntent} />
          </section>
        )}

        {activeTab === "signals" && (
          <section className="salary-page">
            <CareerSignalHubPanel signals={careerSignals} careerSignalSummary={careerSignalSummary} />
          </section>
        )}
      </main>
    </div>
  );
}

function SalarySnapshotBand({
  officialCompanyCount,
  liveAdapterCount,
  jobCount,
  officialSalaryCount,
  domesticCount,
  overseasCount,
  industryCount,
}: {
  officialCompanyCount: number;
  liveAdapterCount: number;
  jobCount: number;
  officialSalaryCount: number;
  domesticCount: number;
  overseasCount: number;
  industryCount: number;
}) {
  return (
    <section className="salary-snapshot-band" aria-label="数据概览">
      <div>
        <span>官方企业入口</span>
        <strong>{officialCompanyCount} 家</strong>
        <em>{liveAdapterCount} 个 live adapter</em>
      </div>
      <div>
        <span>岗位样本</span>
        <strong>{jobCount} 条</strong>
        <em>{officialSalaryCount} 条官网薪资，其余标估</em>
      </div>
      <div>
        <span>企业地域</span>
        <strong>{domesticCount} 中 / {overseasCount} 外</strong>
        <em>国内和海外分开对比</em>
      </div>
      <div>
        <span>行业覆盖</span>
        <strong>{industryCount} 类</strong>
        <em>不只看计算机</em>
      </div>
    </section>
  );
}

function SalarySchoolStartPanel({
  value,
  onChange,
  onStart,
}: {
  value: string;
  onChange: (value: string) => void;
  onStart: (value?: string) => void;
}) {
  const examples = schoolOutcomeProfiles
    .filter((school) => ordinarySchoolFirstIds.includes(school.id))
    .slice(0, 8)
    .map((school) => ({
      id: school.id,
      name: school.name,
      city: school.city,
      entryCount: school.officialLinks.length,
    }));

  return (
    <section className="salary-school-start-panel" aria-label="普通学校信息聚合入口">
      <div>
        <p className="salary-kicker">School Source Finder</p>
        <h2>不是名校也能查，先把公开入口和薪资反查跑起来。</h2>
        <span>输入学校名，直接生成专业目录、就业报告、就业信息网、企业官网和薪资代理入口。</span>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onStart();
        }}
      >
        <label>
          <Search size={17} />
          <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="输入你的学校，例如 郑州工商学院" />
        </label>
        <button type="submit">开始聚合</button>
      </form>
      <div className="salary-school-start-examples">
        {examples.map((example) => (
          <button key={example.id} type="button" onClick={() => onStart(example.name)}>
            <strong>{example.name}</strong>
            <span>
              {example.city} · {example.entryCount} 个入口
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SalaryCompanyCard({
  company,
  active,
  inCompare,
  onOpen,
  onToggleCompare,
}: {
  company: SalaryCompanyProfile;
  active: boolean;
  inCompare: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
}) {
  return (
    <article className={active ? "salary-company-card active" : "salary-company-card"}>
      <button className="salary-company-main" onClick={onOpen}>
        <CompanyLogoMark company={company} />
        <div className="salary-company-copy">
          <div>
            <strong>{company.source.name}</strong>
            <span>{company.region === "domestic" ? "国内企业" : "海外企业"} · {company.industry.shortLabel}</span>
          </div>
          <em>{formatMonthlyRange(company.salaryRange)} · {getSalaryModeLabel(company)}</em>
        </div>
        <ChevronRight size={18} />
      </button>
      <div className="salary-company-meta">
        <span>{company.sampleCount ? `${company.sampleCount} 条岗位` : "官网入口"}</span>
        <span>{company.officialSalaryCount ? `${company.officialSalaryCount} 条官网薪资` : "薪资估算"}</span>
      </div>
      <div className="salary-company-tags">
        {company.topRoles.slice(0, 3).map((role) => (
          <span key={`${company.source.id}-${role}`}>{role}</span>
        ))}
      </div>
      <button className={inCompare ? "salary-compare-button active" : "salary-compare-button"} onClick={onToggleCompare}>
        {inCompare ? "已加入对比" : "加入对比"}
      </button>
    </article>
  );
}

function CompanyLogoMark({ company }: { company: SalaryCompanyProfile }) {
  const sources = getCompanyLogoSources(company.source.id, company.source.domain);
  const [sourceIndex, setSourceIndex] = useState(0);
  const fallback = getCompanyLogoText(company.source.id, company.source.name);
  const activeSource = sources[sourceIndex];
  useEffect(() => {
    setSourceIndex(0);
  }, [company.source.id]);
  return (
    <span className="company-logo-mark" style={{ "--company-accent": company.industry.accent } as React.CSSProperties} aria-label={`${company.source.name} logo`}>
      {activeSource ? (
        <img
          src={activeSource}
          alt=""
          onError={() => setSourceIndex((current) => current + 1)}
        />
      ) : (
        <b>{fallback}</b>
      )}
    </span>
  );
}

function CompanySourceLogoMark({ source }: { source: OfficialCompanySource }) {
  const sources = getCompanyLogoSources(source.id, source.domain);
  const [sourceIndex, setSourceIndex] = useState(0);
  const fallback = getCompanyLogoText(source.id, source.name);
  const activeSource = sources[sourceIndex];
  useEffect(() => {
    setSourceIndex(0);
  }, [source.id]);
  return (
    <span className="company-source-logo-mark" aria-label={`${source.name} logo`}>
      {activeSource ? (
        <img
          src={activeSource}
          alt=""
          onError={() => setSourceIndex((current) => current + 1)}
        />
      ) : (
        <b>{fallback}</b>
      )}
    </span>
  );
}

function SalaryCompanyDetail({
  company,
  inCompare,
  onToggleCompare,
}: {
  company: SalaryCompanyProfile;
  inCompare: boolean;
  onToggleCompare: () => void;
}) {
  const [jobPage, setJobPage] = useState(1);
  useEffect(() => {
    setJobPage(1);
  }, [company.source.id]);
  const totalPages = Math.max(1, Math.ceil(company.jobs.length / detailJobPageSize));
  const visibleJobs = company.jobs.slice((jobPage - 1) * detailJobPageSize, jobPage * detailJobPageSize);

  return (
    <aside className="salary-company-detail" aria-label={`${company.source.name} 详情`}>
      <div className="salary-detail-head">
        <CompanyLogoMark company={company} />
        <div>
          <p className="salary-kicker">{company.region === "domestic" ? "Domestic Company" : "Overseas Company"}</p>
          <h2>{company.source.name}</h2>
          <span>{company.source.domain}</span>
        </div>
      </div>

      <div className="salary-detail-salary">
        <span>薪资区间</span>
        <strong>{formatMonthlyRange(company.salaryRange)}</strong>
        <em>{getSalaryModeLabel(company)} · 更新 {formatDataDate(company.salaryUpdatedAt)}</em>
      </div>

      <div className="salary-detail-metrics">
        <section>
          <span>岗位样本</span>
          <strong>{company.sampleCount || "待接"}</strong>
        </section>
        <section>
          <span>官网薪资</span>
          <strong>{company.officialSalaryCount}</strong>
        </section>
        <section>
          <span>行业</span>
          <strong>{company.industry.shortLabel}</strong>
        </section>
      </div>

      <div className="salary-detail-section">
        <span>岗位族群</span>
        <div className="salary-detail-tags">
          {company.topRoles.slice(0, 6).map((role) => (
            <em key={`${company.source.id}-${role}`}>{role}</em>
          ))}
        </div>
      </div>

      <div className="salary-detail-section">
        <span>偏好专业</span>
        <div className="salary-detail-tags muted">
          {company.topMajors.slice(0, 7).map((major) => (
            <em key={`${company.source.id}-${major}`}>{major}</em>
          ))}
        </div>
      </div>

      <div className="salary-detail-jobs">
        <div className="salary-detail-jobs-head">
          <span>岗位详情</span>
          <div>
            <button disabled={jobPage <= 1 || company.jobs.length === 0} onClick={() => setJobPage((page) => Math.max(1, page - 1))}>上一页</button>
            <strong>{jobPage} / {totalPages}</strong>
            <button disabled={jobPage >= totalPages || company.jobs.length === 0} onClick={() => setJobPage((page) => Math.min(totalPages, page + 1))}>下一页</button>
          </div>
        </div>
        {visibleJobs.length > 0 ? (
          <div className="salary-detail-job-list">
            {visibleJobs.map((job) => (
              <a key={job.id} href={job.sourceUrl} target="_blank" rel="noreferrer">
                <div>
                  <strong>{job.title}</strong>
                  <span>{job.location} · {categoryLabels[job.category]}</span>
                </div>
                <SalaryPill salary={job.salary} compact />
              </a>
            ))}
          </div>
        ) : (
          <div className="salary-empty-detail">
            <strong>当前只有官方入口，岗位 adapter 待接入。</strong>
            <span>薪资先按相关专业和岗位族群估算，点击官网继续查。</span>
          </div>
        )}
      </div>

      <div className="salary-detail-actions">
        <a href={company.source.careerUrl} target="_blank" rel="noreferrer">打开官网</a>
        <button className={inCompare ? "active" : ""} onClick={onToggleCompare}>{inCompare ? "已在对比" : "加入对比"}</button>
      </div>
    </aside>
  );
}

function SalaryCompanyCompare({
  profiles,
  compareIds,
  onSelect,
}: {
  profiles: SalaryCompanyProfile[];
  compareIds: string[];
  onSelect: (companyId: string) => void;
}) {
  const selected = compareIds
    .map((id) => profiles.find((company) => company.source.id === id))
    .filter((company): company is SalaryCompanyProfile => Boolean(company));

  return (
    <section className="salary-compare-panel" aria-label="公司对比">
      <div className="salary-section-head">
        <div>
          <p className="salary-kicker">Compare</p>
          <h2>公司对比</h2>
        </div>
        <span>最多展示 4 家，工资、岗位、行业和中外差异放一起看。</span>
      </div>
      <div className="salary-compare-table">
        <div className="salary-compare-row head">
          <span>公司</span>
          <span>地域</span>
          <span>行业</span>
          <span>工资</span>
          <span>岗位</span>
          <span>薪资口径</span>
        </div>
        {selected.map((company) => (
          <button key={company.source.id} className="salary-compare-row" onClick={() => onSelect(company.source.id)}>
            <span className="salary-compare-company-cell">
              <CompanyLogoMark company={company} />
              <b>{company.source.name}</b>
            </span>
            <span>{company.region === "domestic" ? "国内" : "海外"}</span>
            <span>{company.industry.shortLabel}</span>
            <span>{formatMonthlyRange(company.salaryRange)}</span>
            <span>{company.sampleCount || "待接"}</span>
            <span>{getSalaryModeLabel(company)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SalaryIndustryCompare({
  profiles,
  onSelectCompany,
}: {
  profiles: SalaryCompanyProfile[];
  onSelectCompany: (companyId: string) => void;
}) {
  const industryRows = salaryIndustryDefinitions
    .filter((industry) => industry.id !== "public-other")
    .map((industry) => {
      const companies = profiles.filter((company) => company.industry.id === industry.id);
      const salaryRange = getProfileRange(companies);
      const domesticCount = companies.filter((company) => company.region === "domestic").length;
      const overseasCount = companies.length - domesticCount;
      const officialSalaryCount = companies.reduce((total, company) => total + company.officialSalaryCount, 0);
      const jobCount = companies.reduce((total, company) => total + company.sampleCount, 0);
      const topMajors = getTopJobEntries(companies.flatMap((company) => company.topMajors), 5).map(([major]) => major);
      return { industry, companies, salaryRange, domesticCount, overseasCount, officialSalaryCount, jobCount, topMajors };
    });

  return (
    <section className="salary-page salary-industry-page" aria-label="行业对比">
      <div className="salary-page-heading">
        <div>
          <p className="salary-kicker">Industry Compare</p>
          <h1>按行业和中外企业分开看，别让计算机把所有专业盖住。</h1>
        </div>
      </div>
      <div className="salary-industry-grid">
        {industryRows.map((row) => (
          <article key={row.industry.id} className="salary-industry-card" style={{ "--industry-accent": row.industry.accent } as React.CSSProperties}>
            <div className="salary-industry-title">
              <span>{row.industry.shortLabel}</span>
              <strong>{formatMonthlyRange(row.salaryRange)}</strong>
            </div>
            <p>{row.industry.description}</p>
            <div className="salary-industry-stats">
              <section>
                <span>公司</span>
                <strong>{row.companies.length}</strong>
              </section>
              <section>
                <span>中 / 外</span>
                <strong>{row.domesticCount} / {row.overseasCount}</strong>
              </section>
              <section>
                <span>岗位</span>
                <strong>{row.jobCount}</strong>
              </section>
              <section>
                <span>官网薪资</span>
                <strong>{row.officialSalaryCount}</strong>
              </section>
            </div>
            <div className="salary-detail-tags muted">
              {row.topMajors.map((major) => (
                <em key={`${row.industry.id}-${major}`}>{major}</em>
              ))}
            </div>
            <div className="salary-industry-companies">
              {row.companies.slice(0, 8).map((company) => (
                <button key={company.source.id} onClick={() => onSelectCompany(company.source.id)}>
                  <CompanyLogoMark company={company} />
                  <span>{company.source.name}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildSalaryCompanyProfiles(): SalaryCompanyProfile[] {
  return officialCompanySources
    .map((source) => {
      const sourceJobs = jobs
        .filter((job) => job.companyId === source.id)
        .slice()
        .sort((left, right) => right.salary.monthlyMaxK - left.salary.monthlyMaxK);
      const demandProfile = companyDemandProfiles.find((profile) => profile.officialSourceId === source.id) ?? null;
      const officialSalaryCount = sourceJobs.filter((job) => job.salary.source === "official").length;
      const estimatedSalaryCount = sourceJobs.length - officialSalaryCount;
      const fallbackSalaryRange = getCompanyFallbackSalaryRange(source, demandProfile);
      const salaryRange = getCompanySalaryRange(sourceJobs) ?? fallbackSalaryRange;
      const salaryMode: SalaryCompanyProfile["salaryMode"] = officialSalaryCount > 0 ? "official" : sourceJobs.length > 0 ? "job-estimate" : "market-estimate";
      const topRoles = getSalaryCompanyRoles(source, demandProfile, sourceJobs);
      const topMajors = getSalaryCompanyMajors(source, demandProfile, sourceJobs);
      const topCategories = getTopJobEntries(sourceJobs.map((job) => categoryLabels[job.category]), 4).map(([category]) => category);
      const topLocations = getTopJobEntries(sourceJobs.map((job) => job.location), 4).map(([location]) => location);
      const industry = getSalaryCompanyIndustry(source, demandProfile, sourceJobs);
      const region: SalaryCompanyRegion = domesticCompanyIds.has(source.id) ? "domestic" : "overseas";
      const sourceMeta = jobDataMeta.sources.find((item) => item.companyId === source.id);
      const latestSalaryJob = sourceJobs
        .slice()
        .sort((left, right) => new Date(right.salary.updatedAt).getTime() - new Date(left.salary.updatedAt).getTime())[0];
      const sampleCount = sourceMeta?.normalizedCount ?? sourceJobs.length;
      const score =
        sourceJobs.length * 2 +
        officialSalaryCount * 6 +
        (source.adapterStatus === "live-adapter" ? 32 : 0) +
        salaryRange[1] +
        (domesticCompanyIds.has(source.id) ? 1 : 3);

      return {
        source,
        demandProfile,
        jobs: sourceJobs,
        sampleCount,
        officialSalaryCount,
        estimatedSalaryCount,
        region,
        industry,
        salaryRange,
        salaryMode,
        salaryUpdatedAt: latestSalaryJob?.salary.updatedAt ?? jobDataMeta.generatedAt,
        topCategories,
        topLocations,
        topMajors,
        topRoles,
        score,
      };
    })
    .sort((left, right) => right.score - left.score || left.source.name.localeCompare(right.source.name, "zh-CN"));
}

function orderSchoolOutcomeProfilesForExplorer(profiles: typeof schoolOutcomeProfiles) {
  const rank = new Map(ordinarySchoolFirstIds.map((id, index) => [id, index]));
  return [...profiles].sort((left, right) => {
    const leftRank = rank.get(left.id) ?? Number.POSITIVE_INFINITY;
    const rightRank = rank.get(right.id) ?? Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return 0;
  });
}

function resolveInitialSchoolExplorerProfile() {
  const directQuery = readInitialSchoolExplorerQuery();
  if (directQuery) return findSchoolExplorerProfile(directQuery) ?? featuredSchoolExplorerProfile;
  return featuredSchoolExplorerProfile;
}

function readInitialSchoolExplorerQuery() {
  if (typeof window === "undefined") return "";
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("school") ?? searchParams.get("q") ?? searchParams.get("schoolId") ?? "";
}

function findSchoolExplorerProfile(query: string) {
  const normalizedQuery = normalizeGlobalSearchText(query);
  if (!normalizedQuery) return null;
  return (
    schoolOutcomeProfiles.find((school) => normalizeGlobalSearchText(school.id) === normalizedQuery) ??
    schoolOutcomeProfiles.find((school) => normalizeGlobalSearchText(school.name).includes(normalizedQuery)) ??
    schoolOutcomeProfiles.find((school) =>
      normalizeGlobalSearchText([school.city, ...school.officialLinks.map((link) => link.label), ...school.majors.map((major) => major.name)].join(" ")).includes(
        normalizedQuery,
      ),
    ) ??
    null
  );
}

function getSalaryCompanyIndustry(
  source: (typeof officialCompanySources)[number],
  demandProfile: (typeof companyDemandProfiles)[number] | null,
  sourceJobs: Job[],
) {
  const direct = salaryIndustryDefinitions.find((industry) => industry.companyIds.includes(source.id));
  if (direct) return direct;

  const haystack = [
    source.name,
    ...source.focus,
    ...(demandProfile?.roleFamilies ?? []),
    ...(demandProfile?.preferredMajors ?? []),
    ...sourceJobs.map((job) => categoryLabels[job.category]),
    ...sourceJobs.flatMap((job) => job.tags),
  ].join(" ");
  return (
    salaryIndustryDefinitions.find((industry) => industry.keywords.some((keyword) => haystack.toLowerCase().includes(keyword.toLowerCase()))) ??
    salaryIndustryDefinitions[salaryIndustryDefinitions.length - 1]
  );
}

function getSalaryCompanyRoles(
  source: (typeof officialCompanySources)[number],
  demandProfile: (typeof companyDemandProfiles)[number] | null,
  sourceJobs: Job[],
) {
  const jobCategories = getTopJobEntries(sourceJobs.map((job) => categoryLabels[job.category]), 5).map(([category]) => category);
  return Array.from(new Set([...(demandProfile?.roleFamilies ?? []), ...jobCategories, ...source.focus])).slice(0, 7);
}

function getSalaryCompanyMajors(
  source: (typeof officialCompanySources)[number],
  demandProfile: (typeof companyDemandProfiles)[number] | null,
  sourceJobs: Job[],
) {
  const jobMajorSignals = getTopJobEntries(sourceJobs.flatMap((job) => job.majorSignals ?? []), 8).map(([major]) => major);
  const profileMajors = majorSalaryProfiles
    .filter((profile) => profile.companies.some((company) => areMarketTermsRelated(company, source.name)))
    .flatMap((profile) => profile.majors);
  return Array.from(new Set([...(demandProfile?.preferredMajors ?? []), ...jobMajorSignals, ...profileMajors])).slice(0, 9);
}

function getCompanyFallbackSalaryRange(
  source: (typeof officialCompanySources)[number],
  demandProfile: (typeof companyDemandProfiles)[number] | null,
): [number, number] {
  const targetText = normalizeSalarySearchText([
    source.name,
    ...source.focus,
    ...(demandProfile?.roleFamilies ?? []),
    ...(demandProfile?.preferredMajors ?? []),
    ...(demandProfile?.sampleQueries ?? []),
  ].join(" "));
  const ranked = majorSalaryProfiles
    .map((profile) => {
      let score = 0;
      if (profile.companies.some((company) => areMarketTermsRelated(company, source.name))) score += 120;
      [...profile.majors, ...profile.roles, ...profile.coreSkills, profile.group].forEach((term) => {
        const normalized = normalizeSalarySearchText(term);
        if (normalized && targetText.includes(normalized)) score += 12;
      });
      return { profile, score };
    })
    .sort((left, right) => right.score - left.score);
  return ranked[0]?.score ? ranked[0].profile.starterMonthlyK : [8, 18];
}

function getProfileRange(profiles: SalaryCompanyProfile[]): [number, number] {
  if (profiles.length === 0) return [0, 0];
  const mins = profiles.map((profile) => profile.salaryRange[0]).sort((a, b) => a - b);
  const maxes = profiles.map((profile) => profile.salaryRange[1]).sort((a, b) => a - b);
  return [mins[Math.floor((mins.length - 1) * 0.15)] ?? mins[0], maxes[Math.ceil((maxes.length - 1) * 0.85)] ?? maxes[maxes.length - 1]];
}

function getSalaryModeLabel(company: SalaryCompanyProfile) {
  if (company.salaryMode === "official") return "官网薪资";
  if (company.salaryMode === "job-estimate") return "岗位估算";
  return "市场估算";
}

function getLatestSalaryDate(allJobs: Job[]) {
  const latest = allJobs
    .map((job) => new Date(job.salary.updatedAt).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((left, right) => right - left)[0];
  return formatDataDate(latest ? new Date(latest).toISOString() : jobDataMeta.generatedAt);
}

function normalizeSalarySearchText(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "").replace(/[／|｜,，、]+/g, "/");
}

function CinematicIntro({
  onEnter,
  onSearchIntent,
}: {
  onEnter: () => void;
  onSearchIntent: (intent: GlobalSearchIntent) => void;
}) {
  const schoolMajorCount = schoolOutcomeProfiles.reduce((total, school) => total + school.majors.length, 0);
  const verifiedCampusYears = schoolOutcomeProfiles.reduce(
    (total, school) => total + school.campusRecruitingYears.filter((year) => year.status === "verified").length,
    0,
  );
  const liveCompanyCount = new Set(jobs.map((job) => job.companyName)).size;
  const quickQueries = ["浙江大学", "人工智能", "推荐算法", "阿里巴巴 推荐"];

  const commitQuickQuery = (query: string) => {
    const suggestion = buildGlobalSearchSuggestions(query)[0] ?? buildGlobalSearchFallback(query);
    if (!suggestion) return;
    onSearchIntent({ ...suggestion, timestamp: Date.now() });
  };

  return (
    <section className="product-intro" aria-label="看看工资首页">
      <div className="product-intro-main">
        <div className="product-intro-copy">
          <p className="eyebrow">看看工资</p>
          <h1>高考后，把专业、学校和未来岗位放在一起选。</h1>
          <p>
            输入学校看专业去向、就业率、薪资口径和校招企业；输入岗位生成职业雷达，按关联强度反推适合深挖的专业。
          </p>
          <div className="product-intro-search">
            <GlobalSearchBox
              onSearchIntent={onSearchIntent}
              placeholder="搜学校、专业、岗位、公司"
              className="intro-global-search"
            />
            <div className="intro-query-row" aria-label="热门查询">
              {quickQueries.map((query) => (
                <button key={query} onClick={() => commitQuickQuery(query)}>
                  {query}
                </button>
              ))}
            </div>
          </div>
          <div className="product-intro-actions">
            <a href="#school-major">
              <GraduationCap size={18} />
              输入学校
            </a>
            <a href="#career-radar">
              <Target size={18} />
              职业雷达
            </a>
            <button onClick={onEnter}>
              <LineChart size={18} />
              查看全量分析
            </button>
          </div>
        </div>

        <div className="product-intro-workbench" aria-label="核心功能概览">
          <a className="intro-work-card school" href="#school-major">
            <span>
              <GraduationCap size={22} />
            </span>
            <strong>学校 → 专业 → 去向</strong>
            <p>点击专业后展示毕业去向、就业率、平均工资口径，以及每年哪些企业来校招聘。</p>
            <div>
              <b>{schoolOutcomeProfiles.length} 所学校</b>
              <b>{schoolMajorCount} 个专业结果</b>
              <b>{verifiedCampusYears} 年校招证据</b>
            </div>
          </a>
          <a className="intro-work-card radar" href="#career-radar">
            <span>
              <Target size={22} />
            </span>
            <strong>岗位 → 雷达 → 专业</strong>
            <p>输入岗位后，把强关联、可转入和弱关联专业分层，并挂上官网岗位和薪资参考。</p>
            <div>
              <b>{jobs.length} 条官网岗位</b>
              <b>{liveCompanyCount} 家企业</b>
              <b>{formatRefreshTime(jobDataMeta.generatedAt)}</b>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Sidebar({
  mode,
  activeNav,
  onModeChange,
  onNavigate,
}: {
  mode: AppMode;
  activeNav: string;
  onModeChange: (mode: AppMode) => void;
  onNavigate: (target: string, mode?: AppMode) => void;
}) {
  const mainNav = [
    { id: "overview", label: "总览", icon: Home, mode: "gaokao" as AppMode },
    { id: "data-freshness", label: "数据刷新", icon: CalendarCheck, mode: "gaokao" as AppMode },
    { id: "major-finder", label: "专业筛选", icon: Search, mode: "gaokao" as AppMode },
    { id: "major-salary", label: "薪资回报", icon: LineChart, mode: "gaokao" as AppMode },
    { id: "school-major", label: "学校核验", icon: GraduationCap, mode: "gaokao" as AppMode },
    { id: "career-radar", label: "职业雷达", icon: Target, mode: "gaokao" as AppMode },
    { id: "company-demand", label: "大厂需求", icon: Building2, mode: "gaokao" as AppMode },
    { id: "big-tech", label: "官方岗位", icon: BriefcaseBusiness, mode: "gaokao" as AppMode },
  ];
  const toolNav = [
    { id: "talent-skills", label: "能力对照", icon: Target, mode: "talent" as AppMode },
    { id: "badge-wall", label: "勋章墙", icon: Medal, mode: "talent" as AppMode },
    { id: "job-table", label: "岗位列表", icon: BriefcaseBusiness, mode: "talent" as AppMode },
  ];

  return (
    <aside className="sidebar-card">
      <div className="brand-area">
        <div className="brand-symbol">
          <Sparkles size={22} />
        </div>
        <div>
          <h1>看看工资</h1>
          <p>高校 专业 岗位</p>
        </div>
      </div>

      <div className="mode-tabs" aria-label="模式切换">
        <button className={mode === "gaokao" ? "active" : ""} onClick={() => onModeChange("gaokao")}>
          选专业
        </button>
        <button className={mode === "talent" ? "active" : ""} onClick={() => onModeChange("talent")}>
          岗位
        </button>
      </div>

      <NavGroup title="选专业主线" items={mainNav} activeNav={activeNav} onNavigate={onNavigate} />
      <NavGroup title="进阶工具" items={toolNav} activeNav={activeNav} onNavigate={onNavigate} />

      <div className="sidebar-upgrade">
        <ShieldCheck size={30} />
        <strong>数据照亮前途</strong>
        <p>先看薪资水平和大厂需求，再判断学校、专业和岗位方向。</p>
        <button onClick={() => onNavigate("life-todos", "gaokao")}>
          核验清单
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="sidebar-footer">
        <button>
          <HelpCircle size={18} />
          咨询记录
        </button>
        <button>
          <Settings size={18} />
          规划设置
        </button>
      </div>
    </aside>
  );
}

function NavGroup({
  title,
  items,
  activeNav,
  onNavigate,
}: {
  title: string;
  items: Array<{ id: string; label: string; icon: typeof Home; mode: AppMode }>;
  activeNav: string;
  onNavigate: (target: string, mode?: AppMode) => void;
}) {
  return (
    <section className="nav-group">
      <h2>{title}</h2>
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={activeNav === item.id ? "active" : ""}
            onClick={() => onNavigate(item.id, item.mode)}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </section>
  );
}

function TopCommand({
  mode,
  onModeChange,
  onSearchIntent,
}: {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onSearchIntent: (intent: GlobalSearchIntent) => void;
}) {
  return (
    <header className="command-card" id="overview">
      <div>
        <p className="eyebrow">Match Engine</p>
        <h2>{mode === "gaokao" ? "专业薪资 × 大厂需求 × 志愿选择" : "岗位薪资与能力雷达"}</h2>
        <span>{mode === "gaokao" ? "给刚高考完的同学快速看懂：这个专业未来挣多少，大厂要什么。" : "把岗位要求、薪资和技能差距拆成可行动清单。"}</span>
      </div>
      <div className="command-actions">
        <GlobalSearchBox onSearchIntent={onSearchIntent} placeholder="搜学校、专业、岗位、公司" />
        <button className="icon-button" aria-label="通知">
          <Bell size={18} />
        </button>
        <button className="primary-command" onClick={() => onModeChange(mode === "gaokao" ? "talent" : "gaokao")}>
          {mode === "gaokao" ? "查看岗位薪资" : "返回专业匹配"}
        </button>
      </div>
    </header>
  );
}

function GlobalSearchBox({
  onSearchIntent,
  placeholder,
  className = "",
}: {
  onSearchIntent: (intent: GlobalSearchIntent) => void;
  placeholder: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = useMemo(() => buildGlobalSearchSuggestions(query), [query]);

  const commitSuggestion = (suggestion: GlobalSearchSuggestion) => {
    setQuery(suggestion.query);
    setIsOpen(false);
    onSearchIntent({ ...suggestion, timestamp: Date.now() });
  };

  const submitQuery = () => {
    const first = suggestions[0] ?? buildGlobalSearchFallback(query);
    if (first) commitSuggestion(first);
  };

  return (
    <div className={`search-box global-search-shell ${className}`.trim()} role="search">
      <Search size={17} />
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 140)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submitQuery();
          }
        }}
        placeholder={placeholder}
        aria-label="全局搜索"
      />
      {isOpen && (
        <div className="global-search-popover">
          <div className="global-search-popover-head">
            <span>{query.trim() ? "搜索结果" : "快速开始"}</span>
            <em>聚合结果</em>
          </div>
          <div className="global-search-results">
            {suggestions.map((suggestion) => (
              <button key={`${suggestion.kind}-${suggestion.label}-${suggestion.target}-${suggestion.value}`} onMouseDown={(event) => event.preventDefault()} onClick={() => commitSuggestion(suggestion)}>
                <span>{getGlobalSearchKindLabel(suggestion.kind)}</span>
                <div>
                  <strong>{suggestion.label}</strong>
                  <em>{suggestion.detail}</em>
                </div>
                <b>{suggestion.value}</b>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function buildGlobalSearchSuggestions(rawQuery: string): GlobalSearchSuggestion[] {
  const query = rawQuery.trim();
  const normalizedQuery = normalizeGlobalSearchText(query);
  if (!normalizedQuery) return buildGlobalSearchShortcuts();

  const suggestions: GlobalSearchSuggestion[] = [];

  schoolOutcomeProfiles.forEach((school) => {
    const schoolText = normalizeGlobalSearchText([school.name, school.city, school.dataNote].join(" "));
    const schoolMatches = schoolText.includes(normalizedQuery);
    if (schoolMatches) {
      const companyCount = new Set(school.campusRecruitingYears.flatMap((year) => year.companies)).size;
      suggestions.push({
        kind: "school",
        target: "school-major",
        query: school.name,
        label: school.name,
        detail: `${school.city} · ${school.majors.length} 个专业样本 · ${school.evidenceSources.length} 个学校来源`,
        value: companyCount ? `${companyCount} 家企业` : "待接入企业",
        schoolId: school.id,
      });
    }

    school.majors.forEach((major) => {
      const majorText = normalizeGlobalSearchText([major.name, major.cluster, ...major.destinations, ...major.recruiterSearchTargets].join(" "));
      if (!majorText.includes(normalizedQuery) && !schoolMatches) return;
      const marketProfile = findMarketProfileForSchoolMajor(major);
      suggestions.push({
        kind: "major",
        target: "school-major",
        query: major.name,
        label: `${school.name} · ${major.name}`,
        detail: `${major.cluster} · ${major.destinations.slice(0, 2).join(" / ")}`,
        value: formatMonthlyRange(marketProfile.starterMonthlyK),
        schoolId: school.id,
        majorId: major.id,
      });
    });
  });

  majorSalaryProfiles.forEach((profile) => {
    const profileText = normalizeGlobalSearchText([profile.group, ...profile.majors, ...profile.roles, ...profile.companies].join(" "));
    if (!profileText.includes(normalizedQuery)) return;
    suggestions.push({
      kind: "major",
      target: "major-salary",
      query: profile.group,
      label: profile.group,
      detail: `${profile.majors.slice(0, 3).join(" / ")} · ${profile.roles.slice(0, 2).join(" / ")}`,
      value: formatMonthlyRange(profile.starterMonthlyK),
    });
  });

  officialCompanySources.forEach((source) => {
    const sourceText = normalizeGlobalSearchText([source.name, source.domain, ...source.focus].join(" "));
    const companyMatched = normalizedQuery.includes(normalizeGlobalSearchText(source.name));
    const focusMatched = source.focus.some((focus) => normalizedQuery.includes(normalizeGlobalSearchText(focus)));
    if (!sourceText.includes(normalizedQuery) && !companyMatched && !focusMatched) return;
    const sampleCount = getOfficialSourceSampleCount(source.id);
    suggestions.push({
      kind: "company",
      target: "big-tech",
      query: normalizedQuery.includes(normalizeGlobalSearchText(source.name)) ? query : `${source.name} ${source.focus[0] ?? ""}`.trim(),
      label: source.name,
      detail: `${source.adapterStatus === "live-adapter" ? "已接官网 adapter" : "官方入口"} · ${source.focus.slice(0, 3).join(" / ")}`,
      value: sampleCount ? `${sampleCount} 条` : "入口",
    });
  });

  const fallback = buildGlobalSearchFallback(query);
  const orderedSuggestions = prioritizeGlobalSearchSuggestions(query, suggestions, fallback);
  return dedupeGlobalSearchSuggestions(orderedSuggestions).slice(0, 7);
}

function buildGlobalSearchShortcuts(): GlobalSearchSuggestion[] {
  const bestSchool = [...schoolOutcomeProfiles].sort(
    (left, right) =>
      new Set(right.campusRecruitingYears.flatMap((year) => year.companies)).size -
      new Set(left.campusRecruitingYears.flatMap((year) => year.companies)).size,
  )[0] ?? schoolOutcomeProfiles[0];
  const bestMajor = bestSchool?.majors[0];
  const bestMajorProfile = bestMajor ? findMarketProfileForSchoolMajor(bestMajor) : majorSalaryProfiles[0];

  return [
    {
      kind: "school",
      target: "school-major",
      query: bestSchool.name,
      label: bestSchool.name,
      detail: `看专业、就业率、工资口径和年度企业证据`,
      value: `${new Set(bestSchool.campusRecruitingYears.flatMap((year) => year.companies)).size || "待接入"} 家企业`,
      schoolId: bestSchool.id,
      majorId: bestMajor?.id,
    },
    {
      kind: "major",
      target: "school-major",
      query: bestMajor?.name ?? "计算机科学与技术",
      label: bestMajor ? `${bestSchool.name} · ${bestMajor.name}` : "计算机科学与技术",
      detail: bestMajor ? `${bestMajor.cluster} · ${bestMajor.destinations.slice(0, 2).join(" / ")}` : "先看薪资和岗位证据",
      value: formatMonthlyRange(bestMajorProfile.starterMonthlyK),
      schoolId: bestSchool.id,
      majorId: bestMajor?.id,
    },
    {
      kind: "job",
      target: "career-radar",
      query: "推荐算法工程师",
      label: "推荐算法工程师",
      detail: "按关联强度生成专业排名和官网岗位证据",
      value: `${searchOfficialJobs(jobs, ["推荐算法工程师"], 42).length} 条岗位`,
    },
    {
      kind: "company",
      target: "big-tech",
      query: "阿里巴巴 推荐",
      label: "阿里巴巴 · 推荐",
      detail: "聚合企业官网岗位样本和官方招聘入口",
      value: `${searchOfficialJobs(jobs, ["阿里巴巴 推荐"], 42).length} 条岗位`,
    },
  ];
}

function buildGlobalSearchFallback(query: string): GlobalSearchSuggestion {
  const normalized = query.trim() || "岗位";
  const matches = searchOfficialJobs(jobs, [normalized], 42);
  return {
    kind: "job",
    target: "career-radar",
    query: normalized,
    label: normalized,
    detail: "没有精确命中学校或专业时，先用岗位雷达倒推适合专业",
    value: matches.length ? `${matches.length} 条岗位` : "生成雷达",
  };
}

function dedupeGlobalSearchSuggestions(suggestions: GlobalSearchSuggestion[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.kind}-${suggestion.target}-${suggestion.label}-${suggestion.schoolId ?? ""}-${suggestion.majorId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function prioritizeGlobalSearchSuggestions(query: string, suggestions: GlobalSearchSuggestion[], fallback: GlobalSearchSuggestion) {
  if (looksLikeCompanyQuery(query)) {
    return [...suggestions.filter((item) => item.kind === "company"), fallback, ...suggestions.filter((item) => item.kind !== "company")];
  }
  if (looksLikeJobQuery(query)) {
    return [fallback, ...suggestions];
  }
  return [...suggestions, fallback];
}

function looksLikeCompanyQuery(query: string) {
  const normalized = normalizeGlobalSearchText(query);
  return officialCompanySources.some((source) => normalized.includes(normalizeGlobalSearchText(source.name)));
}

function looksLikeJobQuery(query: string) {
  return /工程师|经理|算法|推荐|搜索|安全|后端|前端|产品|运营|数据|机器人|嵌入式|芯片|供应链|设计/.test(query);
}

function getGlobalSearchKindLabel(kind: GlobalSearchKind) {
  if (kind === "school") return "学校";
  if (kind === "major") return "专业";
  if (kind === "company") return "企业";
  return "岗位";
}

function getOfficialSourceSampleCount(sourceId: string) {
  return jobDataMeta.sources.find((source) => source.companyId === sourceId)?.normalizedCount ?? 0;
}

function getJobSignalTags(job: Job, limit = 4) {
  const majorTags = (job.majorSignals ?? []).map((major) => `关联 ${major}`);
  const abilityTags = job.abilitySignals ?? job.requirements;
  return Array.from(new Set([...majorTags, ...abilityTags])).slice(0, limit);
}

function normalizeGlobalSearchText(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "").replace(/[／|｜,，、·.。\/]+/g, "");
}

function BigTechOpportunityPanel({
  recommendations,
  searchIntent,
}: {
  recommendations: Array<{ job: Job; badge: Badge }>;
  searchIntent: GlobalSearchIntent | null;
}) {
  const [activeFilter, setActiveFilter] = useState<BigTechJobFilter>("all");
  const [showAll, setShowAll] = useState(false);
  const [jobQuery, setJobQuery] = useState("AIGC 算法工程师");
  useEffect(() => {
    if (!searchIntent || searchIntent.target !== "big-tech") return;
    setJobQuery(searchIntent.query);
    setShowAll(false);
  }, [searchIntent]);
  const visibleRecommendations = useMemo(
    () => recommendations.filter(({ job }) => matchesBigTechFilter(job, activeFilter)),
    [activeFilter, recommendations],
  );
  const allSearchMatches = useMemo(() => searchOfficialJobs(jobs, [jobQuery], 14), [jobQuery]);
  const searchMatches = useMemo(() => diversifyOfficialJobMatches(allSearchMatches, 10, 2), [allSearchMatches]);
  const officialCards = useMemo(() => buildOfficialSearchCards(jobQuery, 10), [jobQuery]);
  const coverageRows = useMemo(() => buildOfficialCoverageRows(jobs), []);
  const shownLimit = showAll ? visibleRecommendations.length : 24;
  const shownRecommendations = visibleRecommendations.slice(0, shownLimit);
  const companyCount = new Set(jobs.map((job) => job.companyName)).size;
  const searchCompanyCount = new Set(allSearchMatches.map(({ job }) => job.companyName)).size;
  const topCompanies = getTopJobEntries(jobs.map((job) => job.companyName), 5);
  const topCategories = getTopJobEntries(jobs.map((job) => categoryLabels[job.category]), 5);
  const activeDescription = bigTechJobFilters.find((filter) => filter.id === activeFilter)?.description ?? "";
  const liveSourceCount = officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length;

  return (
    <section className="panel big-tech-opportunity-panel" id="big-tech">
      <PanelHeader kicker="Official Job Search" title="大厂官网聚合搜索：先搜岗位，再回专业" icon={<BriefcaseBusiness size={20} />} />
      <div className="job-pool-summary">
        <article>
          <span>当前快照</span>
          <strong>{jobs.length} 条</strong>
          <p>{activeJobDataSourceCount}/{liveSourceCount} 个 live adapter 有当前样本；搜索结果只临时聚合展示。</p>
        </article>
        <article>
          <span>已接企业</span>
          <strong>{companyCount} 家</strong>
          <p>{topCompanies.map(([company, count]) => `${company} ${count}`).join(" / ")}</p>
        </article>
        <article>
          <span>官网入口</span>
          <strong>{officialCompanySources.length} 家</strong>
          <p>未接 adapter 的企业仍给官方招聘入口，避免只看一家公司的岗位。</p>
        </article>
      </div>

      <OfficialCoverageMatrix rows={coverageRows} />

      <div className="official-job-search-panel">
        <div className="official-job-search-head">
          <div>
            <p className="eyebrow">Search-only</p>
            <h3>输入一个岗位，聚合当前官网样本和更多企业入口</h3>
            <span>这里不把一次搜索结果当长期事实库；岗位和薪资仍以企业官网与每日刷新快照为准。</span>
          </div>
          <label className="search-box official-job-search-input">
            <Search size={17} />
            <input value={jobQuery} onChange={(event) => setJobQuery(event.target.value)} placeholder="例如：安全工程师 / 产品经理 / 机器人算法" />
          </label>
        </div>

        <div className="quick-query-row" aria-label="岗位搜索快捷入口">
          {["AIGC 算法工程师", "安全工程师", "机器人工程师", "产品经理", "供应链算法"].map((query) => (
            <button key={query} className={query === jobQuery ? "active" : ""} onClick={() => setJobQuery(query)}>
              {query}
            </button>
          ))}
        </div>

        <div className="official-job-search-grid">
          <AggregatedOfficialJobsBlock
            title={`“${jobQuery || "岗位"}”官网快照命中`}
            description={`当前命中 ${allSearchMatches.length} 条，覆盖 ${searchCompanyCount || 0} 家 live adapter 企业；下方优先展示跨公司样本。`}
            matches={searchMatches.slice(0, 8)}
          />

          <aside className="official-search-source-panel">
            <div className="official-search-source-heading">
              <span>官方入口</span>
              <strong>{officialCards.length} 家</strong>
            </div>
            <div className="official-search-source-list">
              {officialCards.slice(0, 8).map((source) => (
                <a key={source.id} href={source.careerUrl} target="_blank" rel="noreferrer">
                  <span>{source.adapterStatus === "live-adapter" ? "已接 adapter" : "官方入口"}</span>
                  <strong>{source.name}</strong>
                  <em>{source.focus.slice(0, 3).join(" / ")} · {getOfficialSourceSampleCount(source.id)} 条</em>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="job-pool-secondary-head">
        <div>
          <p className="eyebrow">Recommended Pool</p>
          <h3>按方向浏览完整岗位快照</h3>
        </div>
        <section>
          <span>高频岗位族群</span>
          <strong>{topCategories[0]?.[0] ?? "待刷新"}</strong>
        </section>
      </div>

      <div className="big-tech-filter-row" aria-label="官网岗位聚合筛选">
        {bigTechJobFilters.map((filter) => {
          const count = recommendations.filter(({ job }) => matchesBigTechFilter(job, filter.id)).length;
          return (
            <button key={filter.id} className={filter.id === activeFilter ? "active" : ""} onClick={() => setActiveFilter(filter.id)}>
              <span>{filter.label}</span>
              <em>{count}</em>
            </button>
          );
        })}
      </div>
      <p className="job-pool-note">
        {activeDescription} 当前筛选 {visibleRecommendations.length} 条，展示 {shownRecommendations.length} 条；点“官网”回到企业官方招聘页核验。
      </p>

      <div className="big-tech-job-grid">
        {shownRecommendations.map(({ job, badge }) => (
          <article key={job.id} className="big-tech-job-card">
            <div className="job-card-heading">
              <div className="company-avatar">{job.companyName.slice(0, 1)}</div>
              <div>
                <span>{job.companyName} · {categoryLabels[job.category]}</span>
                <h3>{job.title}</h3>
              </div>
              <b className={badge.status}>{badge.matchScore}%</b>
            </div>
            <p>{job.department} · {job.location} · {job.direction}</p>
            <div className="job-card-actions">
              <SalaryPill salary={job.salary} />
              <a href={job.sourceUrl} target="_blank" rel="noreferrer">官网</a>
            </div>
            <div className="tag-row compact">
              {getJobSignalTags(job).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {visibleRecommendations.length > 24 && (
        <div className="job-pool-expand">
          <button onClick={() => setShowAll((current) => !current)}>
            {showAll ? "收起聚合结果" : `展开全部 ${visibleRecommendations.length} 条`}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

type OfficialCoverageRow = {
  id: string;
  name: string;
  careerUrl: string;
  domain: string;
  status: "live-adapter" | "official-link";
  sampleCount: number;
  focus: string[];
  topCategories: Array<[string, number]>;
  salaryRange: [number, number] | null;
  errorCount: number;
};

function OfficialCoverageMatrix({ rows }: { rows: OfficialCoverageRow[] }) {
  const liveRows = rows.filter((row) => row.status === "live-adapter" && row.sampleCount > 0);
  const pendingRows = rows.filter((row) => row.sampleCount === 0);

  return (
    <section className="official-coverage-panel" aria-label="企业官网覆盖矩阵">
      <div className="official-coverage-head">
        <div>
          <p className="eyebrow">Company Coverage</p>
          <h3>不只看字节，把多家官网放在同一张表里</h3>
          <span>每次刷新只保留当前快照和短期聚合结果；企业官网仍是岗位、薪资和投递状态的最终依据。</span>
        </div>
        <section>
          <strong>{liveRows.length}/{rows.length}</strong>
          <span>当前有样本 / 官方入口</span>
        </section>
      </div>

      <div className="official-coverage-grid">
        {rows.map((row) => (
          <a key={row.id} href={row.careerUrl} target="_blank" rel="noreferrer" className={row.sampleCount > 0 ? "live" : "pending"}>
            <div>
              <strong>{row.name}</strong>
              <span>{row.status === "live-adapter" ? "已接 adapter" : "官方入口"}</span>
            </div>
            <p>{row.focus.slice(0, 4).join(" / ")}</p>
            <div className="coverage-metrics">
              <em>{row.sampleCount > 0 ? `${row.sampleCount} 条` : "待接入"}</em>
              <em>{row.salaryRange ? formatMonthlyRange(row.salaryRange) : "官网检索"}</em>
              <em>{row.errorCount > 0 ? `${row.errorCount} 个警告` : row.domain}</em>
            </div>
            <div className="coverage-category-row">
              {(row.topCategories.length ? row.topCategories : [[row.focus[0] ?? "招聘入口", 0] as [string, number]]).slice(0, 3).map(([category, count]) => (
                <b key={category}>{count ? `${category} ${count}` : category}</b>
              ))}
            </div>
          </a>
        ))}
      </div>

      {pendingRows.length > 0 && (
        <p className="official-coverage-note">
          待接 adapter：{pendingRows.map((row) => row.name).join(" / ")}。这些入口只作为官网检索入口，不伪造岗位数量。
        </p>
      )}
    </section>
  );
}

function buildOfficialCoverageRows(allJobs: Job[]): OfficialCoverageRow[] {
  return officialCompanySources
    .map((source) => {
      const sourceJobs = allJobs.filter((job) => job.companyId === source.id);
      const sourceMeta = jobDataMeta.sources.find((item) => item.companyId === source.id);
      return {
        id: source.id,
        name: source.name,
        careerUrl: source.careerUrl,
        domain: source.domain,
        status: source.adapterStatus,
        sampleCount: sourceMeta?.normalizedCount ?? sourceJobs.length,
        focus: source.focus,
        topCategories: getTopJobEntries(sourceJobs.map((job) => categoryLabels[job.category]), 3),
        salaryRange: getCompanySalaryRange(sourceJobs),
        errorCount: getSourceErrorCount(sourceMeta),
      };
    })
    .sort((left, right) => right.sampleCount - left.sampleCount || Number(left.status !== "live-adapter") - Number(right.status !== "live-adapter"));
}

function getSourceErrorCount(sourceMeta: unknown) {
  const errors = (sourceMeta as { errors?: readonly unknown[] } | undefined)?.errors;
  return Array.isArray(errors) ? errors.length : 0;
}

function getCompanySalaryRange(companyJobs: Job[]): [number, number] | null {
  if (companyJobs.length === 0) return null;
  const earlyCareerJobs = companyJobs.filter((job) => job.seniority !== "senior");
  const salaryJobs = earlyCareerJobs.length >= 4 ? earlyCareerJobs : companyJobs;
  const minValues = salaryJobs.map((job) => job.salary.monthlyMinK).sort((a, b) => a - b);
  const maxValues = salaryJobs.map((job) => job.salary.monthlyMaxK).sort((a, b) => a - b);
  const lowIndex = Math.floor((minValues.length - 1) * 0.2);
  const highIndex = Math.ceil((maxValues.length - 1) * 0.8);
  const min = minValues[lowIndex];
  const max = maxValues[highIndex];
  return min && max ? [min, max] : null;
}

function matchesBigTechFilter(job: Job, filter: BigTechJobFilter) {
  if (filter === "all") return true;
  const text = [
    job.title,
    job.department,
    job.direction,
    job.category,
    ...job.tags,
    ...job.requirements,
    ...(job.majorSignals ?? []),
    ...(job.abilitySignals ?? []),
  ].join(" ").toLowerCase();

  if (filter === "ai") {
    return job.category === "AI Engineering" || /ai|算法|大模型|llm|agent|推荐|搜索|机器学习|智能/.test(text);
  }
  if (filter === "software") {
    return ["Backend", "Frontend", "Infrastructure"].includes(job.category) || /后端|前端|平台|工程|系统|服务端|go|java|cloud|kubernetes/.test(text);
  }
  if (filter === "product-data") {
    return ["Product", "Data", "Business", "Operations", "Finance", "Service"].includes(job.category) || /产品|运营|数据|增长|策略|分析|商业/.test(text);
  }
  if (filter === "security-cloud") {
    return ["Security", "Infrastructure"].includes(job.category) || /安全|风控|云|sre|devops|稳定性/.test(text);
  }
  if (filter === "campus") {
    return job.seniority === "intern" || job.seniority === "junior" || /实习|校招|校园|应届|aidu|trainee/.test(text);
  }

  return true;
}

function getTopJobEntries(values: string[], limit: number) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, limit);
}

function buildMajorDemandSnapshots(allJobs: Job[]): MajorDemandSnapshot[] {
  return majorSalaryProfiles
    .map((profile) => {
      const scoredJobs = allJobs
        .map((job) => ({ job, score: scoreJobForMajorProfile(job, profile) }))
        .filter(({ score }) => score >= 28)
        .sort((left, right) => right.score - left.score || right.job.salary.monthlyMaxK - left.job.salary.monthlyMaxK);

      const fallbackJobs = allJobs
        .filter((job) => profile.companies.some((company) => areMarketTermsRelated(company, job.companyName)))
        .map((job) => ({ job, score: 18 }))
        .sort((left, right) => right.job.salary.monthlyMaxK - left.job.salary.monthlyMaxK);

      const jobsForProfile = (scoredJobs.length > 0 ? scoredJobs : fallbackJobs).map(({ job }) => job);
      const uniqueJobs = Array.from(new Map(jobsForProfile.map((job) => [job.id, job])).values());
      const salaryRange = getSnapshotSalaryRange(uniqueJobs, profile);
      const liveCompanies = new Set(uniqueJobs.map((job) => job.companyName));
      const topCompanies = getTopJobEntries(uniqueJobs.map((job) => job.companyName), 6);
      const topCategories = getTopJobEntries(uniqueJobs.map((job) => categoryLabels[job.category]), 5);
      const topSkills = getTopJobEntries(uniqueJobs.flatMap((job) => job.abilitySignals ?? job.requirements), 8);
      const topMajorSignals = getTopJobEntries(uniqueJobs.flatMap((job) => job.majorSignals ?? []), 8);
      const signalScore = Math.min(
        99,
        Math.round(profile.demandScore * 0.45 + Math.min(55, uniqueJobs.length * 1.2) + Math.min(12, liveCompanies.size * 2)),
      );

      return {
        profile,
        jobs: uniqueJobs,
        officialJobCount: uniqueJobs.length,
        liveCompanyCount: liveCompanies.size,
        topCompanies,
        topCategories,
        topSkills,
        topMajorSignals,
        salaryRange,
        signalScore,
      };
    })
    .sort((left, right) => right.officialJobCount - left.officialJobCount || right.signalScore - left.signalScore);
}

function scoreJobForMajorProfile(job: Job, profile: MajorSalaryProfile) {
  const jobText = normalizeMarketText([
    job.title,
    job.direction,
    job.department,
    job.description,
    job.category,
    ...job.tags,
    ...job.requirements,
    ...(job.majorSignals ?? []),
    ...(job.abilitySignals ?? []),
  ].join(" "));
  let score = 0;

  if (profile.companies.some((company) => areMarketTermsRelated(company, job.companyName))) score += 20;
  if (categorySupportsMajorProfile(job.category, profile.id)) score += 22;

  profile.roles.forEach((role) => {
    const normalizedRole = normalizeMarketText(role);
    if (jobText.includes(normalizedRole) || normalizedRole.includes(normalizeMarketText(job.title))) score += 42;
    else if (getMarketTokens([role]).some((token) => token.length >= 2 && jobText.includes(token))) score += 12;
  });

  profile.coreSkills.forEach((skill) => {
    if (jobText.includes(normalizeMarketText(skill))) score += 8;
  });

  profile.majors.forEach((major) => {
    const normalizedMajor = normalizeMarketText(major);
    if ((job.majorSignals ?? []).some((signal) => areMarketTermsRelated(signal, major))) score += 30;
    if (jobText.includes(normalizedMajor)) score += 14;
  });

  getMarketTokens([profile.group]).forEach((token) => {
    if (jobText.includes(token)) score += 6;
  });

  return score;
}

function categorySupportsMajorProfile(category: JobCategory, profileId: string) {
  const profileCategories: Record<string, JobCategory[]> = {
    "computer-ai": ["AI Engineering", "Backend", "Frontend", "Infrastructure", "Data"],
    "robotics-auto": ["AI Engineering", "Backend", "Infrastructure"],
    "electronics-comm": ["Infrastructure", "Backend", "Security"],
    "data-product": ["Data", "Product", "Backend"],
    "cyber-cloud": ["Security", "Infrastructure", "Backend"],
    "bio-med": ["AI Engineering", "Data", "Product", "Service"],
    "energy-electric": ["Infrastructure", "Data", "Product", "Operations"],
    "design-content": ["Design", "Product", "Frontend", "Business"],
    "finance-accounting": ["Finance", "Data", "Product", "Security"],
    "consulting-business": ["Business", "Product", "Data", "Finance"],
    "consumer-retail-brand": ["Business", "Operations", "Product", "Data", "Design"],
    "hospitality-tourism-aviation": ["Service", "Operations", "Business", "Product"],
    "healthcare-care": ["Service", "Data", "Product", "AI Engineering"],
    "education-law-public": ["Service", "Business", "Product", "Design", "Data"],
    "civil-environment-urban": ["Infrastructure", "Operations", "Product", "Data"],
  };

  return profileCategories[profileId]?.includes(category) ?? false;
}

function getSnapshotSalaryRange(matchedJobs: Job[], profile: MajorSalaryProfile): [number, number] {
  if (matchedJobs.length === 0) return profile.starterMonthlyK;
  const earlyCareerJobs = matchedJobs.filter((job) => job.seniority !== "senior");
  const salaryJobs = earlyCareerJobs.length >= 4 ? earlyCareerJobs : matchedJobs;
  const minValues = salaryJobs.map((job) => job.salary.monthlyMinK).sort((a, b) => a - b);
  const maxValues = salaryJobs.map((job) => job.salary.monthlyMaxK).sort((a, b) => a - b);
  const lowIndex = Math.floor((minValues.length - 1) * 0.15);
  const highIndex = Math.ceil((maxValues.length - 1) * 0.85);
  const min = minValues[lowIndex] ?? profile.starterMonthlyK[0];
  const max = maxValues[highIndex] ?? profile.starterMonthlyK[1];
  return [min, max];
}

function readLifeDashboardState(): LifeDashboardState {
  const fallback = getDefaultLifeDashboardState();
  if (typeof window === "undefined") return fallback;

  try {
    return sanitizeLifeDashboardState(JSON.parse(window.localStorage.getItem(lifeDashboardStorageKey) ?? "null"));
  } catch {
    return fallback;
  }
}

function writeLifeDashboardState(state: LifeDashboardState) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(lifeDashboardStorageKey, JSON.stringify(sanitizeLifeDashboardState(state)));
  } catch {
    // localStorage may be disabled or full. The page should still work in memory.
  }
}

function getDefaultLifeDashboardState(): LifeDashboardState {
  return {
    mbtiAnswers: defaultMbti,
    doneTodos: defaultLifeTodoIds,
  };
}

function sanitizeLifeDashboardState(input: unknown): LifeDashboardState {
  const record = isPlainRecord(input) ? input : {};
  return {
    mbtiAnswers: sanitizeMbtiAnswers(record.mbtiAnswers),
    doneTodos: sanitizeLifeTodoIds(record.doneTodos),
  };
}

function sanitizeMbtiAnswers(input: unknown): MbtiAnswers {
  const record = isPlainRecord(input) ? input : {};
  return mbtiQuestions.reduce<MbtiAnswers>((answers, question) => {
    const value = record[question.id];
    return {
      ...answers,
      [question.id]: value === "left" || value === "right" ? value : defaultMbti[question.id],
    };
  }, { ...defaultMbti });
}

function sanitizeLifeTodoIds(input: unknown) {
  if (!Array.isArray(input)) return defaultLifeTodoIds;
  return Array.from(new Set(input.filter((item): item is string => typeof item === "string" && item.startsWith("todo-")))).slice(0, 16);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function LifeDashboard({
  searchIntent,
  onOpenNextAction,
}: {
  searchIntent: GlobalSearchIntent | null;
  onOpenNextAction: (action: LifeNextAction) => void;
}) {
  const [lifeDashboardState, setLifeDashboardState] = useState<LifeDashboardState>(() => readLifeDashboardState());
  const { mbtiAnswers, doneTodos } = lifeDashboardState;

  const mbtiCode = useMemo(() => getMbtiCode(mbtiAnswers), [mbtiAnswers]);
  const profile = mbtiProfiles[mbtiCode] ?? getFallbackMbtiProfile(mbtiCode);
  const traitProfile = useMemo(() => getTraitsFromMbti(mbtiCode), [mbtiCode]);
  const rankedMajors = useMemo(() => scoreMajorPaths(majorPaths, traitProfile, startupTracks), [traitProfile]);
  const rankedTracks = useMemo(() => scoreStartupTracks(startupTracks, traitProfile), [traitProfile]);
  const signals = useMemo(() => getEmploymentSignals(jobs), []);
  const recommendedJobs = useMemo(() => getRecommendedJobs(jobs, initialProfile), []);
  const badges = useMemo(() => getBadges(jobs, initialProfile), []);
  const directMatches = useMemo(() => buildUniversityMajorMatches(universities, majorPaths, jobs), []);
  const topMajor = rankedMajors[0];
  const topTrack = rankedTracks[0];
  const fourYearPlan = useMemo(() => getFourYearPlan(topMajor), [topMajor]);
  const todos = useMemo(() => getLifeTodos(mbtiCode, topMajor.group, topTrack.name), [mbtiCode, topMajor, topTrack]);
  const activeDoneTodoIds = useMemo(() => {
    const todoIds = new Set(todos.map((todo) => todo.id));
    return doneTodos.filter((todoId) => todoIds.has(todoId));
  }, [doneTodos, todos]);
  const completion = Math.round((activeDoneTodoIds.length / todos.length) * 100);

  useEffect(() => {
    writeLifeDashboardState(lifeDashboardState);
  }, [lifeDashboardState]);

  const setMbtiAnswer = (questionId: MbtiDimension, answer: "left" | "right") => {
    setLifeDashboardState((current) => ({
      ...current,
      mbtiAnswers: {
        ...current.mbtiAnswers,
        [questionId]: answer,
      },
    }));
  };

  const toggleTodo = (todoId: string) => {
    setLifeDashboardState((current) => ({
      ...current,
      doneTodos: current.doneTodos.includes(todoId)
        ? current.doneTodos.filter((id) => id !== todoId)
        : [...current.doneTodos, todoId],
    }));
  };
  const resetLifeDashboard = () => {
    setLifeDashboardState(getDefaultLifeDashboardState());
  };

  return (
    <div className="content-grid">
      <section className="center-stack">
        <HeroPanel
          mbtiCode={mbtiCode}
          profileName={profile.name}
          profileSummary={profile.summary}
          topMajor={topMajor.group}
          topMajorScore={topMajor.score}
          topTrack={topTrack.name}
          topTrackScore={topTrack.score}
          completion={completion}
        />
        <DecisionFlowPanel />
        <DecisionMetricGrid />
        <DataFreshnessPanel />
        <MajorFinderPanel />
        <MajorReturnTable />
        <CoreUseCasesPanel />
        <FlowSectionLabel kicker="Function 01" title="输入学校，核验专业去向" text="先看学校真实披露的专业、毕业去向、就业率和每年校招企业，再用官网招聘结果补充岗位需求。" />
        <SchoolMajorExplorer searchIntent={searchIntent} />
        <FlowSectionLabel kicker="Function 02" title="输入岗位，倒推适配专业" text="给一个岗位，雷达图会按关联强度把专业从内到外排开，并展示官网岗位、薪资代理区间和企业样本。" />
        <CareerRadarPanel searchIntent={searchIntent} />
        <DirectMatchBoard matches={directMatches} salaryUpdatedAt={jobDataMeta.generatedAt} />
        <MajorQuickComparePanel />
        <MajorDecisionBoard />
        <FlowSectionLabel kicker="补充 01" title="再判断专业回报" text="把专业群、毕业初期薪资、成熟阶段薪资和官网岗位信号放在一起看，先排除明显不适合的方向。" />
        <MajorSalaryOverview />
        <MajorDemandMatrix />
        <FlowSectionLabel kicker="补充 02" title="看企业真实需求" text="官网招聘站 adapter 只做按需搜索和短期聚合，按岗位族群、企业、能力词和薪资估算展示，不把一次搜索当长期事实库。" />
        <CompanyDemandPanel />
        <BigTechOpportunityPanel recommendations={recommendedJobs} searchIntent={searchIntent} />

        <details className="optional-tools-panel identity-onboarding-panel" open>
          <summary>
            <span>先测画像</span>
            <strong>MBTI 快测、专业路径和赛道信号</strong>
          </summary>

          <section className="panel two-column identity-test-panel" id="mbti-test">
            <div>
              <PanelHeader kicker="Step 01" title="先确认你是谁" icon={<Brain size={20} />} />
              <div className="question-list">
                {mbtiQuestions.map((question) => (
                  <div key={question.id} className="question-row">
                    <h3>{question.title}</h3>
                    <div className="choice-pair">
                      <ChoiceButton active={mbtiAnswers[question.id] === "left"} onClick={() => setMbtiAnswer(question.id, "left")} option={question.left} />
                      <ChoiceButton active={mbtiAnswers[question.id] === "right"} onClick={() => setMbtiAnswer(question.id, "right")} option={question.right} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="identity-summary">
              <ScoreRing value={completion} label="规划进度" />
              <h3>{mbtiCode} · {profile.name}</h3>
              <p>{profile.summary}</p>
              <div className="tag-row">
                {profile.strengths.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="life-state-actions">
                <span>进度已保存到本机</span>
                <button type="button" onClick={resetLifeDashboard}>
                  <RotateCcw size={15} />
                  重新测试
                </button>
              </div>
            </div>
          </section>

          <section className="panel identity-path-panel" id="major-paths">
            <PanelHeader kicker="Step 02" title="再从就业终局倒推专业路径" icon={<GraduationCap size={20} />} />
            <div className="recommend-list">
              {rankedMajors.slice(0, 4).map((path, index) => (
                <article key={path.id} className="recommend-card">
                  <div className="rank">{index + 1}</div>
                  <div>
                    <h3>{path.group}</h3>
                    <p>{path.why}</p>
                    <div className="tag-row compact">
                      {path.majors.slice(0, 4).map((major) => (
                        <span key={major}>{major}</span>
                      ))}
                    </div>
                  </div>
                  <strong>{path.score}%</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="panel split-panel identity-signal-panel" id="market-signals">
            <div>
              <PanelHeader kicker="Step 03" title="最后看社会正在需要什么" icon={<LineChart size={20} />} />
              <div className="signal-stack">
                <SignalBar label="岗位方向" value={signals.directions.slice(0, 3).join(" / ")} percent={92} />
                <SignalBar label="基础能力" value={signals.requirements.slice(0, 4).join(" / ")} percent={86} />
                <SignalBar label="赛道热度" value={rankedTracks.slice(0, 2).map((track) => track.name).join(" / ")} percent={89} />
              </div>
            </div>
            <div className="startup-list">
              {rankedTracks.slice(0, 3).map((track) => (
                <article key={track.id}>
                  <span>{track.score}%</span>
                  <h3>{track.name}</h3>
                  <p>{track.opportunity}</p>
                </article>
              ))}
            </div>
          </section>
        </details>

      </section>

      <aside className="right-stack">
        <section className="panel profile-card">
          <div className="profile-avatar">
            <UserRound size={34} />
          </div>
          <p className="eyebrow">Current Profile</p>
          <h2>{mbtiCode}</h2>
          <h3>{profile.name}</h3>
          <p>{profile.caution}</p>
          <ProgressLine value={completion} label="规划完成度" />
          <div className="life-state-actions compact">
            <span>本机保存</span>
            <button type="button" onClick={resetLifeDashboard}>
              <RotateCcw size={15} />
              重测
            </button>
          </div>
        </section>

        <LifeNextActionPanel mbtiCode={mbtiCode} topMajor={topMajor.group} topTrack={topTrack.name} onOpenAction={onOpenNextAction} />

        <section className="panel" id="life-todos">
          <PanelHeader kicker="Life Todo" title="人生规划 Todo" icon={<CalendarCheck size={20} />} />
          <div className="todo-list">
            {todos.map((todo) => {
              const checked = activeDoneTodoIds.includes(todo.id);
              return (
                <button key={todo.id} className={checked ? "todo-row done" : "todo-row"} onClick={() => toggleTodo(todo.id)}>
                  {checked ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                  <span>
                    <strong>{todo.title}</strong>
                    <em>{todo.desc}</em>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <PanelHeader kicker="Badge Wall" title="大厂技能勋章" icon={<Medal size={20} />} />
          <div className="mini-badge-grid">
            {badges.slice(0, 6).map((badge) => (
              <article key={badge.id} className={`mini-badge ${badge.status}`}>
                <span>{badge.companyName}</span>
                <strong>{badge.matchScore}%</strong>
                <p>{badge.category}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader kicker="Roadmap" title="大学四年路线" icon={<BookOpenCheck size={20} />} />
          <div className="timeline">
            {fourYearPlan.map((step) => (
              <article key={step.year}>
                <span>{step.year}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.items.slice(0, 2).join(" / ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function LifeNextActionPanel({
  mbtiCode,
  topMajor,
  topTrack,
  onOpenAction,
}: {
  mbtiCode: string;
  topMajor: string;
  topTrack: string;
  onOpenAction: (action: LifeNextAction) => void;
}) {
  const actions: Array<{
    id: LifeNextAction["id"];
    label: string;
    query: string;
    detail: string;
    icon: React.ElementType;
  }> = [
    {
      id: "school",
      label: "核验目标学校",
      query: topMajor,
      detail: `${topMajor} 先查学校专业、就业报告和校招企业。`,
      icon: GraduationCap,
    },
    {
      id: "radar",
      label: "岗位反推专业",
      query: topTrack,
      detail: `${topTrack} 相关岗位，用雷达看强弱关联。`,
      icon: Target,
    },
    {
      id: "signals",
      label: "查看市场信号",
      query: mbtiCode,
      detail: `${mbtiCode} 画像下，继续看行业热度和基础能力。`,
      icon: Bell,
    },
  ];

  return (
    <section className="panel life-next-panel" aria-label="下一步行动">
      <PanelHeader kicker="Next Step" title="下一步行动" icon={<Compass size={20} />} />
      <div className="life-next-action-list">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.id} type="button" className="life-next-action" onClick={() => onOpenAction({ id: action.id, query: action.query, label: action.label })}>
              <span>
                <Icon size={18} />
              </span>
              <strong>{action.label}</strong>
              <em>{action.detail}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TalentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "All">("All");
  const [profileSkills, setProfileSkills] = useState<Skill[]>(initialProfile.skills);
  const [jobQuery, setJobQuery] = useState("");
  const [showAllJobs, setShowAllJobs] = useState(false);

  const profile = useMemo(() => ({ ...initialProfile, skills: profileSkills }), [profileSkills]);
  const insights = useMemo(() => getMarketInsights(jobs), []);
  const badges = useMemo(() => getBadges(jobs, profile), [profile]);
  const recommended = useMemo(() => getRecommendedJobs(jobs, profile), [profile]);
  const advice = useMemo(() => getLearningAdvice(jobs, profile), [profile]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(jobs.map((job) => job.category)))] as Array<JobCategory | "All">, []);
  const queryMatches = useMemo(() => (jobQuery.trim() ? searchOfficialJobs(jobs, [jobQuery], 14) : []), [jobQuery]);
  const queryMatchIds = useMemo(() => new Map(queryMatches.map((match, index) => [match.job.id, index])), [queryMatches]);
  const filteredJobs = useMemo(() => {
    const categoryFiltered = selectedCategory === "All" ? recommended : recommended.filter(({ job }) => job.category === selectedCategory);
    if (!jobQuery.trim()) return categoryFiltered;
    return categoryFiltered
      .filter(({ job }) => queryMatchIds.has(job.id))
      .sort((left, right) => (queryMatchIds.get(left.job.id) ?? 9999) - (queryMatchIds.get(right.job.id) ?? 9999));
  }, [jobQuery, queryMatchIds, recommended, selectedCategory]);
  const shownTalentJobs = showAllJobs ? filteredJobs : filteredJobs.slice(0, 18);
  const talentQuickQueries = ["推荐算法", "机器人算法", "安全工程师", "产品经理", "云计算"];

  useEffect(() => {
    setShowAllJobs(false);
  }, [jobQuery, selectedCategory]);

  const toggleSkill = (skillName: string) => {
    const exists = profileSkills.some((skill) => skill.name === skillName);
    setProfileSkills((current) =>
      exists ? current.filter((skill) => skill.name !== skillName) : [...current, { id: skillName.toLowerCase(), name: skillName, level: "foundation" }],
    );
  };

  return (
    <div className="content-grid">
      <section className="center-stack">
        <section className="hero-card panel" id="talent-skills">
          <div>
            <p className="eyebrow">Talent Radar</p>
            <h2>把岗位能力变成可对照的技能资产</h2>
            <p>勾选当前技能，系统会重新计算大厂勋章、岗位匹配和学习优先级。</p>
          </div>
          <div className="hero-metric">
            <span>{badges[0].companyName}</span>
            <strong>{badges[0].matchScore}%</strong>
            <em>当前最高匹配</em>
          </div>
        </section>

        <section className="panel">
          <PanelHeader kicker="Skill Input" title="已掌握技能" icon={<Check size={20} />} />
          <div className="skill-cloud">
            {selectableSkills.map((skill) => {
              const active = profileSkills.some((item) => item.name === skill);
              return (
                <button key={skill} className={active ? "active" : ""} onClick={() => toggleSkill(skill)}>
                  {active && <Check size={14} />}
                  {skill}
                </button>
              );
            })}
          </div>
        </section>

        <div className="stats-grid">
          {insights.map((insight, index) => (
            <StatCard
              key={insight.title}
              icon={<BarChart3 size={24} />}
              label={insight.title}
              value={insight.value}
              change={insight.detail}
              tone={["blue", "green", "yellow", "purple"][index] as "blue" | "green" | "yellow" | "purple"}
            />
          ))}
        </div>

        <section className="panel" id="badge-wall">
          <PanelHeader kicker="Badge Wall" title="个人大厂勋章墙" icon={<Medal size={20} />} />
          <div className="badge-wall">
            {badges.map((badge) => (
              <article key={badge.id} className={`company-badge ${badge.status}`} style={{ "--badge-gradient": badge.gradient } as React.CSSProperties}>
                <span>{badge.companyName}</span>
                <strong>{badge.matchScore}%</strong>
                <p>{badge.title}</p>
                <em>{badge.status === "earned" ? "建议投递" : badge.status === "near" ? "接近达标" : "待补齐"}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="job-table">
          <PanelHeader kicker="Jobs" title="岗位推荐列表" icon={<BriefcaseBusiness size={20} />} />
          <div className="talent-job-toolbar">
            <label className="search-box talent-job-search">
              <Search size={17} />
              <input value={jobQuery} onChange={(event) => setJobQuery(event.target.value)} placeholder="搜索官网岗位，例如：推荐算法 / 机器人算法 / 产品经理" />
            </label>
            <div className="quick-query-row">
              {talentQuickQueries.map((query) => (
                <button key={query} className={query === jobQuery ? "active" : ""} onClick={() => setJobQuery(query)}>
                  {query}
                </button>
              ))}
            </div>
          </div>
          <div className="category-tabs">
            {categories.map((category) => (
              <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>
                {categoryLabels[category]}
              </button>
            ))}
          </div>
          <p className="job-pool-note">
            当前筛选 {filteredJobs.length} 条，展示 {shownTalentJobs.length} 条；{jobQuery.trim() ? `“${jobQuery}”按 search-only 官网样本排序。` : "按当前技能匹配度排序。"} 薪资每天随官方岗位刷新。
          </p>
          <div className="job-list">
            {shownTalentJobs.map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div className="company-avatar">{job.companyName.slice(0, 1)}</div>
                <div>
                  <h3>{job.companyName} · {job.title}</h3>
                  <p>{job.department} · {job.location} · {job.direction}</p>
                  <div className="talent-job-actions">
                    <SalaryPill salary={job.salary} />
                    <a href={job.sourceUrl} target="_blank" rel="noreferrer">官网</a>
                  </div>
                  <div className="tag-row compact">
                    {getJobSignalTags(job).map((tag) => (
                      <span key={`${job.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span className={badge.status}>{badge.matchScore}%</span>
              </article>
            ))}
            {filteredJobs.length === 0 && (
              <p className="aggregated-empty">当前技能和筛选条件下没有命中岗位；换一个关键词或切回“全部岗位”。</p>
            )}
          </div>
          {filteredJobs.length > 18 && (
            <div className="job-pool-expand">
              <button onClick={() => setShowAllJobs((current) => !current)}>
                {showAllJobs ? "收起岗位列表" : `展开全部 ${filteredJobs.length} 条`}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </section>

      <aside className="right-stack">
        <section className="panel profile-card">
          <div className="profile-avatar">
            <Medal size={34} />
          </div>
          <p className="eyebrow">Best Match</p>
          <h2>{badges[0].companyName}</h2>
          <h3>{badges[0].title}</h3>
          <p>{badges[0].missingSkills.length === 0 ? "当前技能已经满足建议投递线。" : `还需要补齐：${badges[0].missingSkills.slice(0, 3).join(" / ")}`}</p>
          <ProgressLine value={badges[0].matchScore} label="岗位匹配度" />
        </section>

        <section className="panel">
          <PanelHeader kicker="Learning Todo" title="补齐清单" icon={<BookOpenCheck size={20} />} />
          <div className="todo-list readonly">
            {advice.map((item, index) => (
              <article key={item.skill} className="todo-row">
                <b>{index + 1}</b>
                <span>
                  <strong>{item.skill}</strong>
                  <em>{item.reason}</em>
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader kicker="Market" title="市场偏好" icon={<TrendingUp size={20} />} />
          <div className="signal-stack">
            {insights.slice(0, 3).map((insight, index) => (
              <SignalBar key={insight.title} label={insight.title} value={insight.value} percent={88 - index * 7} />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function DecisionFlowPanel() {
  const topDemandProfile = [...majorSalaryProfiles].sort((a, b) => b.demandScore - a.demandScore)[0] ?? majorSalaryProfiles[0];
  const freshness = getJobDataFreshness(jobDataMeta.generatedAt);
  const decisionCards = [
    {
      icon: CalendarCheck,
      label: "数据今天有没有刷",
      value: freshness.label,
      text: `${activeJobDataSourceCount}/${officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length} 个 live adapter 有样本，先看口径再看结论。`,
      href: "#data-freshness",
    },
    {
      icon: Search,
      label: "输入兴趣先筛专业",
      value: `${majorSalaryProfiles.length} 类方向`,
      text: "用人工智能、机器人、网络安全这类关键词，先筛薪资、岗位和大一验证动作。",
      href: "#major-finder",
    },
    {
      icon: GraduationCap,
      label: "学校专业怎么核验",
      value: `${schoolOutcomeProfiles.length} 所学校`,
      text: "点学校和专业，看毕业去向、就业率、平均工资、年度企业证据字段。",
      href: "#school-major",
    },
    {
      icon: Target,
      label: "岗位反推什么专业",
      value: `${topDemandProfile.demandScore}% 热度`,
      text: `以 ${topDemandProfile.group} 为例，把岗位关联强度映射到专业排名。`,
      href: "#career-radar",
    },
  ];

  return (
    <section className="panel decision-flow-panel decision-command-panel" aria-label="高考后选专业决策台">
      <div className="decision-command-copy">
        <p className="eyebrow">3 分钟先看结论</p>
        <h2>不要先看专业名，先看薪资、岗位和学校证据</h2>
        <p>
          这页按“专业薪资 → 大厂岗位 → 学校去向 → 职业雷达”组织。官方岗位每天可刷新，学校数据只在有来源时标注为已核验。
        </p>
      </div>
      <div className="decision-command-grid">
        {decisionCards.map((step, index) => {
          const Icon = step.icon;
          return (
            <a key={step.label} href={step.href} className="decision-step">
              <span className="decision-index">{String(index + 1).padStart(2, "0")}</span>
              <Icon size={20} />
              <strong>{step.label}</strong>
              <b>{step.value}</b>
              <em>{step.text}</em>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function DecisionMetricGrid() {
  const strongestSalary = [...majorSalaryProfiles].sort((a, b) => b.starterMonthlyK[1] - a.starterMonthlyK[1])[0] ?? majorSalaryProfiles[0];
  const liveCompanies = new Set(jobs.map((job) => job.companyName));
  const topRequirement = getTopJobEntries(jobs.flatMap((job) => job.requirements), 1)[0]?.[0] ?? "编程";
  const verifiedEvidenceCount = schoolOutcomeProfiles.flatMap((school) => school.evidenceSources).filter((source) => source.status === "verified").length;

  return (
    <div className="stats-grid decision-metrics-grid">
      <StatCard icon={<LineChart size={24} />} label="最高毕业初期参考" value={formatMonthlyRange(strongestSalary.starterMonthlyK)} change={strongestSalary.group} tone="blue" />
      <StatCard icon={<BriefcaseBusiness size={24} />} label="当前官网搜索样本" value={`${jobs.length} 条`} change={`${jobDataSourceSummary} · 每日可刷新`} tone="yellow" />
      <StatCard icon={<Building2 size={24} />} label="已接岗位企业" value={`${liveCompanies.size} 家`} change={`${officialCompanySources.length} 家官方入口待扩展`} tone="green" />
      <StatCard icon={<Target size={24} />} label="高频能力信号" value={topRequirement} change={`${verifiedEvidenceCount} 个学校证据已核验`} tone="purple" />
    </div>
  );
}

function DataFreshnessPanel() {
  const freshness = getJobDataFreshness(jobDataMeta.generatedAt);
  const liveSourceCount = officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length;
  const officialSalaryCount = jobs.filter((job) => job.salary.source === "official").length;
  const estimatedSalaryCount = jobs.length - officialSalaryCount;
  const warningSourceCount = jobDataMeta.sources.filter((source) => getSourceErrorCount(source) > 0).length;
  const latestOfficialSalary = jobs
    .filter((job) => job.salary.source === "official")
    .sort((left, right) => new Date(right.salary.updatedAt).getTime() - new Date(left.salary.updatedAt).getTime())[0];

  return (
    <section className={`panel data-freshness-panel ${freshness.tone}`} id="data-freshness" aria-label="岗位薪资数据新鲜度">
      <div className="data-freshness-head">
        <div>
          <p className="eyebrow">Data Freshness</p>
          <h2>岗位和薪资数据是否今天更新</h2>
          <p>大厂官网岗位会每天刷新；官方站未公开薪资时才使用市场估算，并在页面上标“估”。</p>
        </div>
        <strong>{freshness.label}</strong>
      </div>

      <div className="data-freshness-grid">
        <section>
          <span>最近刷新</span>
          <strong>{formatRefreshTime(jobDataMeta.generatedAt)}</strong>
          <em>{freshness.detail}</em>
        </section>
        <section>
          <span>官网 adapter</span>
          <strong>{activeJobDataSourceCount}/{liveSourceCount}</strong>
          <em>{warningSourceCount ? `${warningSourceCount} 个来源有警告` : "当前来源无采集警告"}</em>
        </section>
        <section>
          <span>薪资口径</span>
          <strong>{officialSalaryCount} 官 / {estimatedSalaryCount} 估</strong>
          <em>{latestOfficialSalary ? `${latestOfficialSalary.companyName} 有官网薪资样本` : "大多数企业未公开薪资"}</em>
        </section>
        <section>
          <span>高校外部池</span>
          <strong>{importedExternalSchoolRows}/{availableExternalSchoolRows}</strong>
          <em>{connectedExternalSchoolSourceCount} 个 GitHub 开源高校/志愿数据源已接样本；{schoolDataReferenceSourceCount} 个高校覆盖参考源；{connectedExternalCareerAggregateSourceCount} 个职业聚合源已接，{externalCareerDirectoryRows} 个就业网入口入候选，{checkedExternalCareerDirectoryRows} 个重点入口已探测</em>
        </section>
        <section>
          <span>志愿录取样本</span>
          <strong>{hubeiAdmissionSignalSource.rowCount.toLocaleString("zh-CN")}</strong>
          <em>湖北 2024 本科批，{hubeiAdmissionSignalSource.uniqueSchoolCount.toLocaleString("zh-CN")} 所院校，{hubeiAdmissionOneScoreBandCount.toLocaleString("zh-CN")} 个一分一段分数段</em>
        </section>
        <section>
          <span>北京投档线</span>
          <strong>{beijingAdmissionSignalSource.rowCount.toLocaleString("zh-CN")}</strong>
          <em>
            {beijingAdmissionSignalSource.years.join("-")} 本科普通批，{beijingAdmissionSignalSource.uniqueSchoolCount.toLocaleString("zh-CN")} 所院校，{beijingAdmissionSignalSource.selectionRequirementCount} 种选科要求
          </em>
        </section>
        <section>
          <span>北京一分一段</span>
          <strong>{beijingScoreSegmentSignalSource.rowCount.toLocaleString("zh-CN")}</strong>
          <em>
            {beijingScoreSegmentSignalSource.years.join("-")} 分数分布，累计 {beijingScoreSegmentSignalSource.candidateTotal.toLocaleString("zh-CN")} 名考生；650 分位次点已聚合
          </em>
        </section>
        <section>
          <span>全国院校专业索引</span>
          <strong>{nationalEducationSignalSource.schoolCount.toLocaleString("zh-CN")}</strong>
          <em>
            {nationalEducationSignalSource.undergraduateMajorCount.toLocaleString("zh-CN")} 个本科专业，{nationalEducationSignalSource.provinceRuleCount} 省志愿规则；MIT 聚合
          </em>
        </section>
        <section>
          <span>高校覆盖参考</span>
          <strong>{spiderCollegeAggregateSignalSource.basicSchoolInfoCount.toLocaleString("zh-CN")}</strong>
          <em>
            {spiderCollegeAggregateSignalSource.cityCount} 个城市，{spiderCollegeAggregateSignalSource.scoreLineRowCount} 条历年分数线；README 覆盖量参考，不导入爬虫日志
          </em>
        </section>
        <section>
          <span>山东投档元数据</span>
          <strong>{shandongAdmissionSignalSource.schoolMetadataCount.toLocaleString("zh-CN")}</strong>
          <em>
            {shandongAdmissionSignalSource.years.join("-")} 普通类常规批，{shandongAdmissionSignalSource.majorDirectionGroupCount} 个专业方向组，{shandongAdmissionSignalSource.subjectEvaluationSchoolCount} 所学科评估覆盖
          </em>
        </section>
        <section>
          <span>山东管理数据</span>
          <strong>{shandongAdminAggregateSignalSource.aggregateRowCount.toLocaleString("zh-CN")}</strong>
          <em>
            {shandongAdminAggregateSignalSource.fileCount} 个 Excel/CSV，{shandongAdminAggregateSignalSource.years.join("-")} 年，{shandongAdminCategoryBuckets.length} 类目录；只接聚合行数
          </em>
        </section>
        <section>
          <span>全国招生 SQLite</span>
          <strong>{chinaUniversityAdmissionAggregateSignalSource.universityCount.toLocaleString("zh-CN")}</strong>
          <em>
            {chinaUniversityAdmissionAggregateSignalSource.undergraduateAdmissionRowCount.toLocaleString("zh-CN")} 条本科录取，{chinaUniversityAdmissionAggregateSignalSource.provinceCount} 省，source_url {chinaUniversityAdmissionAggregateSignalSource.sourceUrlFilledCount.toLocaleString("zh-CN")} 条；不复制 SQLite 原库
          </em>
        </section>
        <section>
          <span>历史录取库</span>
          <strong>{gtdimXuefengAdmissionAggregateSignalSource.rowCount.toLocaleString("zh-CN")}</strong>
          <em>
            {gtdimXuefengAdmissionAggregateSignalSource.years.join("-")} 年，{gtdimXuefengAdmissionAggregateSignalSource.provinceCount} 省，{gtdimXuefengAdmissionAggregateSignalSource.schoolNameDistinctCount.toLocaleString("zh-CN")} 个学校名；只接聚合覆盖
          </em>
        </section>
        <section>
          <span>青海计划标签</span>
          <strong>{qinghaiPlanSignalSource.schoolTagRowCount.toLocaleString("zh-CN")}</strong>
          <em>
            2025 计划标签库：公办 {qinghaiPlanSignalSource.publicSchoolCount.toLocaleString("zh-CN")} / 民办 {qinghaiPlanSignalSource.privateSchoolCount.toLocaleString("zh-CN")}，211 {qinghaiPlanSignalSource.project211Count}
          </em>
        </section>
        <section>
          <span>推荐系统 SQL 样本</span>
          <strong>{ruoyiCersSignalSource.universityCount.toLocaleString("zh-CN")}</strong>
          <em>
            {ruoyiCersSignalSource.provinceRowCount} 省分布行，{ruoyiCersSignalSource.majorScoreCount} 条专业投档线，2024 分数 {ruoyiCersSignalSource.minMajorScore2024}-{ruoyiCersSignalSource.maxMajorScore2024}
          </em>
        </section>
        <section>
          <span>云南分段样本</span>
          <strong>{yunnanScoreSegmentSignalSource.scoreSegmentRowCount.toLocaleString("zh-CN")}</strong>
          <em>
            2014-2017 文理分段，{yunnanScoreSegmentSignalSource.majorScoreRowCount} 条专业分数线，{yunnanScoreSegmentSignalSource.uniqueMajorCount} 个专业名
          </em>
        </section>
        <section>
          <span>全国审计覆盖</span>
          <strong>{gaokaoAdvisorAuditSignalSource.universityCount.toLocaleString("zh-CN")}</strong>
          <em>
            {gaokaoAdvisorAuditSignalSource.scoreSegment2025ProvinceCount} 省 2025 分数段，{gaokaoAdvisorAuditSignalSource.enrollmentPlanRowCount.toLocaleString("zh-CN")} 条招生计划审计；只接覆盖指标
          </em>
        </section>
        <section>
          <span>BOSS 历史能力词</span>
          <strong>{bossAggregatedSampleCount.toLocaleString("zh-CN")}</strong>
          <em>{bossAggregatedSkillSignals.length} 类技术方向，{bossAggregatedTopSkillCount} 个聚合能力词；MIT 历史样本，不导入岗位明细</em>
        </section>
        <section>
          <span>BOSS Excel 聚合</span>
          <strong>{bossExcelAggregateSignalSource.rowCount.toLocaleString("zh-CN")}</strong>
          <em>{bossExcelRoleBuckets.length} 个岗位族，{bossExcelAggregateSignalSource.regionCount} 城市，薪资中位 {bossExcelAggregateSignalSource.salaryMedianK}K；{bossExcelSkillBuckets.length} 个能力词 Top，不导入公司/岗位明细</em>
        </section>
        <section>
          <span>AI/IT 市场洞察</span>
          <strong>{aiItMarketInsightSource.insightCount}</strong>
          <em>{aiItMarketInsightSource.globalPeriod} 薪资与 {aiItMarketInsightSource.domesticPeriod} 国内岗位画像；{aiItTalentPreferenceSignals.length} 个能力偏好信号</em>
        </section>
      </div>

      <div className="data-source-radar" aria-label="开源数据源接入雷达">
        <div className="data-source-radar-head">
          <div>
            <p className="eyebrow">Source Radar</p>
            <h3>新发现的数据源如何进入系统</h3>
          </div>
          <strong>{externalDataSources.length} 个源</strong>
        </div>
        <div className="data-source-radar-list">
          {externalDataSources.map((source) => (
            <a key={source.id} className={`data-source-card source-status-${source.status}`} href={source.repoUrl} target="_blank" rel="noreferrer">
              <span>{getExternalDataSourceStatusLabel(source.status)}</span>
              <strong>{source.name}</strong>
              <em>{source.license} · {source.coverage}</em>
              <p>{source.currentUse}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function getExternalDataSourceStatusLabel(status: ExternalDataSource["status"]) {
  switch (status) {
    case "connected-sample":
      return "已接样本";
    case "data-reference":
      return "数据候选";
    case "directory-reference":
      return "入口目录";
    case "career-aggregate":
      return "职业聚合";
    case "model-reference":
      return "模型参考";
    case "decision-reference":
      return "决策参考";
    case "architecture-reference":
      return "架构参考";
    case "blocked-license":
      return "许可证待确认";
    case "blocked-raw-import":
      return "仅聚合";
  }
}

function getJobDataFreshness(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { label: "时间未知", tone: "unknown", detail: "无法解析刷新时间，请重跑 npm run update:salaries。" };
  }
  const ageHours = Math.max(0, (Date.now() - date.getTime()) / 3_600_000);
  if (ageHours <= 30) {
    return { label: "今日已刷新", tone: "fresh", detail: `约 ${formatAgeHours(ageHours)}前更新` };
  }
  if (ageHours <= 72) {
    return { label: "需要关注", tone: "watch", detail: `已 ${formatAgeHours(ageHours)} 未刷新` };
  }
  return { label: "建议立即刷新", tone: "stale", detail: `已 ${formatAgeHours(ageHours)} 未刷新` };
}

function formatAgeHours(ageHours: number) {
  if (ageHours < 1) return "1 小时内";
  if (ageHours < 24) return `${Math.round(ageHours)} 小时`;
  return `${Math.round(ageHours / 24)} 天`;
}

type MajorFinderRow = {
  snapshot: MajorDemandSnapshot;
  score: number;
  reason: string;
  matchedSignals: string[];
  companyNeeds: string[];
};

function MajorFinderPanel() {
  const [query, setQuery] = useState("人工智能");
  const snapshots = useMemo(() => buildMajorDemandSnapshots(jobs), []);
  const rows = useMemo(() => buildMajorFinderRows(snapshots, query), [query, snapshots]);
  const topRow = rows[0];
  const quickQueries = ["人工智能", "机器人", "产品经理", "网络安全", "新能源", "游戏内容"];

  return (
    <section className="panel major-finder-panel" id="major-finder" aria-label="专业筛选台">
      <div className="major-finder-head">
        <div>
          <p className="eyebrow">Major Finder</p>
          <h2>输入兴趣或岗位，先筛出值得看的专业方向</h2>
          <p>面向刚高考完的同学：不用先懂所有专业名，先用关键词看薪资、岗位密度、大厂能力要求和大一验证动作。</p>
        </div>
        {topRow && (
          <section>
            <span>当前最匹配</span>
            <strong>{topRow.snapshot.profile.group}</strong>
            <em>{formatMonthlyRange(topRow.snapshot.profile.starterMonthlyK)} · {topRow.snapshot.officialJobCount} 条官网岗位</em>
          </section>
        )}
      </div>

      <div className="major-finder-search-row">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：人工智能 / 机器人 / 产品经理 / 网络安全" />
        </label>
        <div className="major-finder-chips" aria-label="常用筛选词">
          {quickQueries.map((item) => (
            <button key={item} className={item === query ? "active" : ""} onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="major-finder-grid">
        {rows.slice(0, 4).map((row, index) => (
          <article key={row.snapshot.profile.id} className={index === 0 ? "top" : ""}>
            <div className="major-finder-rank">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{Math.round(row.score)} 分</span>
            </div>
            <div className="major-finder-main">
              <strong>{row.snapshot.profile.group}</strong>
              <p>{row.snapshot.profile.majors.slice(0, 4).join(" / ")}</p>
            </div>
            <div className="major-finder-metrics">
              <section>
                <span>毕业初期</span>
                <strong>{formatMonthlyRange(row.snapshot.profile.starterMonthlyK)}</strong>
              </section>
              <section>
                <span>官网岗位</span>
                <strong>{row.snapshot.officialJobCount} 条</strong>
              </section>
              <section>
                <span>覆盖企业</span>
                <strong>{row.snapshot.liveCompanyCount} 家</strong>
              </section>
            </div>
            <div className="major-finder-tags">
              {row.matchedSignals.slice(0, 4).map((signal) => (
                <em key={signal}>{signal}</em>
              ))}
            </div>
            <div className="major-finder-action">
              <span>大厂看什么</span>
              <p>{row.companyNeeds.join(" / ")}</p>
            </div>
            <div className="major-finder-action">
              <span>大一先验证</span>
              <p>{row.snapshot.profile.firstYearChecks[0]}</p>
            </div>
            <p className="major-finder-note">{row.reason}；薪资为市场代理，不等于学校官方平均工资。</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildMajorFinderRows(snapshots: MajorDemandSnapshot[], rawQuery: string): MajorFinderRow[] {
  const tokens = getMajorFinderTokens(rawQuery);

  return snapshots
    .map((snapshot) => {
      const profile = snapshot.profile;
      const searchableFields = [
        profile.group,
        ...profile.majors,
        ...profile.roles,
        ...profile.companies,
        ...profile.coreSkills,
        ...profile.fitFor,
        ...profile.firstYearChecks,
        ...profile.portfolioSignals,
        ...snapshot.topCompanies.map(([company]) => company),
        ...snapshot.topCategories.map(([category]) => category),
        ...snapshot.topSkills.map(([skill]) => skill),
      ];
      const matchedSignals = getMajorFinderMatchedSignals(searchableFields, tokens);
      const queryBoost = matchedSignals.length * 18 + getMajorFinderDirectRoleBoost(profile, tokens);
      const salaryScore = profile.starterMonthlyK[1] * 1.1 + profile.matureMonthlyK[1] * 0.2;
      const jobScore = Math.min(120, snapshot.officialJobCount) * 0.55 + snapshot.liveCompanyCount * 4;
      const riskPenalty = getRiskPenalty(profile.riskLevel) * 0.4;
      const score = salaryScore + jobScore + queryBoost - riskPenalty;
      const companyNeeds = (snapshot.topSkills.length ? snapshot.topSkills.map(([skill]) => skill) : profile.coreSkills).slice(0, 4);
      const reason = matchedSignals.length
        ? `命中 ${matchedSignals.slice(0, 3).join(" / ")} 信号`
        : rawQuery.trim()
          ? "没有精确命中，按岗位密度、薪资和风险排序"
          : "默认按岗位密度、薪资和风险排序";

      return {
        snapshot,
        score,
        reason,
        matchedSignals: matchedSignals.length ? matchedSignals : profile.coreSkills.slice(0, 4),
        companyNeeds,
      };
    })
    .sort((left, right) => right.score - left.score || right.snapshot.officialJobCount - left.snapshot.officialJobCount);
}

function getMajorFinderTokens(value: string) {
  const normalized = normalizeMarketText(value);
  const knownSignals = [
    "人工智能",
    "ai",
    "算法",
    "机器人",
    "自动化",
    "产品",
    "数据",
    "安全",
    "云",
    "芯片",
    "通信",
    "新能源",
    "电气",
    "设计",
    "内容",
    "游戏",
    "医学",
    "生物",
    "硬件",
    "软件",
    "后端",
    "前端",
  ];
  const rawParts = value
    .split(/[\/\s,，、|｜]+/)
    .map(normalizeMarketText)
    .filter((part) => part.length >= 2);
  return Array.from(
    new Set([
      normalized,
      normalized.replace(/(工程师|研发|开发|经理|专业|方向|岗位|职位)$/g, ""),
      ...rawParts,
      ...rawParts.map((part) => part.replace(/(工程师|研发|开发|经理|专业|方向|岗位|职位)$/g, "")),
      ...knownSignals.filter((signal) => normalized.includes(normalizeMarketText(signal))).map(normalizeMarketText),
    ]),
  ).filter((token) => token.length >= 2);
}

function getMajorFinderMatchedSignals(values: string[], tokens: string[]) {
  if (tokens.length === 0) return [];
  const matches: string[] = [];
  values.forEach((value) => {
    const normalizedValue = normalizeMarketText(value);
    if (tokens.some((token) => normalizedValue.includes(token) || token.includes(normalizedValue))) {
      matches.push(value);
    }
  });
  return Array.from(new Set(matches)).slice(0, 8);
}

function getMajorFinderDirectRoleBoost(profile: MajorSalaryProfile, tokens: string[]) {
  if (tokens.length === 0) return 0;
  let boost = 0;
  profile.roles.forEach((role) => {
    const normalizedRole = normalizeMarketText(role);
    if (tokens.some((token) => normalizedRole.includes(token) || token.includes(normalizedRole))) boost += 20;
  });
  profile.majors.forEach((major) => {
    const normalizedMajor = normalizeMarketText(major);
    if (tokens.some((token) => normalizedMajor.includes(token) || token.includes(normalizedMajor))) boost += 14;
  });
  return boost;
}

function CoreUseCasesPanel() {
  const verifiedCampusYears = schoolOutcomeProfiles.reduce(
    (total, school) => total + school.campusRecruitingYears.filter((year) => year.status === "verified").length,
    0,
  );
  const schoolMajorCount = schoolOutcomeProfiles.reduce((total, school) => total + school.majors.length, 0);
  const liveCompanyCount = new Set(jobs.map((job) => job.companyName)).size;
  const sampleRoles = Array.from(new Set(jobs.slice(0, 80).map((job) => job.title.split(/[（(]/)[0]).filter(Boolean))).slice(0, 3);
  const bestSchool = useMemo(() => {
    const scored = schoolOutcomeProfiles.map((school) => {
      const verifiedSources = school.evidenceSources.filter((source) => source.status === "verified").length;
      const knownCompanies = new Set(school.campusRecruitingYears.flatMap((year) => year.companies)).size;
      return { school, score: verifiedSources * 12 + knownCompanies + school.majors.length };
    });
    return scored.sort((left, right) => right.score - left.score)[0]?.school ?? schoolOutcomeProfiles[0];
  }, []);
  const schoolSnapshots = useMemo(() => bestSchool ? buildSchoolMajorSnapshots(bestSchool) : [], [bestSchool]);
  const topSchoolSnapshot = schoolSnapshots
    .slice()
    .sort((left, right) => right.officialJobCount - left.officialJobCount || right.companyNames.length - left.companyNames.length)[0];
  const allCampusCompanyNames = bestSchool
    ? Array.from(new Set(bestSchool.campusRecruitingYears.flatMap((year) => year.companies)))
    : [];
  const campusCompanyNames = allCampusCompanyNames.slice(0, 5);
  const radarPreviewQuery = "推荐算法工程师";
  const radarPreview = useMemo(
    () => buildCareerRadarEvidence(buildCareerRadar(radarPreviewQuery, majorPaths), radarPreviewQuery).slice(0, 3),
    [],
  );
  const radarTop = radarPreview[0];

  return (
    <section className="panel core-use-cases-panel" aria-label="核心使用入口">
      <div className="core-use-cases-head">
        <p className="eyebrow">两个主功能</p>
        <h2>按学校查专业，或按岗位倒推专业</h2>
        <p>官网招聘站返回的内容只做搜索聚合和短期刷新；学校端只展示有来源的就业报告、校招年份和专业结果。</p>
      </div>
      <div className="core-use-case-grid">
        <a className="core-use-card school" href="#school-major">
          <span>
            <GraduationCap size={22} />
          </span>
          <strong>输入学校</strong>
          <p>展示这个学校有哪些专业、毕业生去向、就业率、薪资代理区间，以及每年哪些企业来校招聘。</p>
          <div>
            <b>{schoolOutcomeProfiles.length} 所学校样本</b>
            <b>{schoolMajorCount} 个专业结果</b>
            <b>{verifiedCampusYears} 年校招证据</b>
          </div>
        </a>
        <a className="core-use-card radar" href="#career-radar">
          <span>
            <Target size={22} />
          </span>
          <strong>职业雷达</strong>
          <p>输入一个岗位，按关联强度把专业排成内圈、中过渡圈和外圈，并挂上官网岗位、企业和薪资参考。</p>
          <div>
            <b>{liveCompanyCount} 家 live 企业</b>
            <b>{jobs.length} 条官网样本</b>
            <b>{sampleRoles.join(" / ") || "岗位可搜索"}</b>
          </div>
        </a>
      </div>
      <div className="start-here-workbench" aria-label="立即开始工作台">
        <article className="start-path-panel school-path">
          <div className="start-path-heading">
            <span>输入学校</span>
            <strong>{bestSchool?.name ?? "学校样本待接入"}</strong>
            <p>先展示专业，再点专业看毕业去向、就业率、平均工资和年度企业证据。</p>
          </div>
          <div className="start-path-search">
            <Search size={17} />
            <span>{bestSchool?.name ?? "输入学校名称"}</span>
          </div>
          <div className="start-path-output">
            <section>
              <span>优先查看专业</span>
              <strong>{topSchoolSnapshot?.major.name ?? "待接入"}</strong>
              <em>{topSchoolSnapshot ? `${topSchoolSnapshot.officialJobCount} 条官网岗位 · ${formatMonthlyRange(topSchoolSnapshot.marketProfile.starterMonthlyK)}` : "需要学校报告和岗位快照"}</em>
            </section>
            <section>
              <span>年度企业证据</span>
              <strong>{allCampusCompanyNames.length || "待接入"}</strong>
              <em>{campusCompanyNames.length ? campusCompanyNames.join(" / ") : "等待就业中心日历或报告解析"}</em>
            </section>
          </div>
          <a href="#school-major" className="start-path-action">
            查看学校专业证据
            <ChevronRight size={16} />
          </a>
        </article>

        <article className="start-path-panel radar-path">
          <div className="start-path-heading">
            <span>职业雷达</span>
            <strong>{radarPreviewQuery}</strong>
            <p>输入岗位后，把专业按关联强度从内圈到外圈排序，并挂上官网岗位、企业和薪资参考。</p>
          </div>
          <div className="start-path-search">
            <Search size={17} />
            <span>{radarPreviewQuery}</span>
          </div>
          <div className="start-radar-preview">
            {radarPreview.map((item, index) => (
              <section key={item.major}>
                <b>{index + 1}</b>
                <div>
                  <strong>{item.major}</strong>
                  <span>{item.score}% · {item.salaryProxy}</span>
                </div>
              </section>
            ))}
          </div>
          <div className="start-path-output single">
            <section>
              <span>最强关联</span>
              <strong>{radarTop?.major ?? "待计算"}</strong>
              <em>{radarTop ? `${radarTop.officialMatchCount} 条官网岗位 · ${radarTop.companyNames.slice(0, 3).join(" / ") || "企业样本待扩展"}` : "输入岗位后生成"}</em>
            </section>
          </div>
          <a href="#career-radar" className="start-path-action">
            生成职业雷达
            <ChevronRight size={16} />
          </a>
        </article>
      </div>
    </section>
  );
}

type MajorCompareMode = "balanced" | "salary" | "jobs" | "steady" | "hardware";

const majorCompareModes: Array<{
  id: MajorCompareMode;
  label: string;
  description: string;
}> = [
  { id: "balanced", label: "综合优先", description: "薪资、岗位密度和证据一起看。" },
  { id: "salary", label: "高薪优先", description: "先找早期薪资上限高的方向。" },
  { id: "jobs", label: "岗位优先", description: "先找官网岗位样本最多的方向。" },
  { id: "steady", label: "稳妥优先", description: "降低竞争和长期不确定性。" },
  { id: "hardware", label: "硬件制造", description: "电气、自动化、机器人、新能源。" },
];

function MajorReturnTable() {
  const rows = useMemo(() => buildMajorReturnRows(), []);
  const topRow = rows[0];

  return (
    <section className="panel major-return-panel" id="major-salary" aria-label="专业回报决策表">
      <div className="major-return-head">
        <div>
          <p className="eyebrow">Major Return Map</p>
          <h2>先看专业未来能挣多少，再看大厂到底招不招</h2>
          <p>把毕业初期薪资、成熟阶段薪资、官网岗位样本、覆盖企业和学校证据压到一张表。学校未披露专业级薪酬时，只显示市场代理区间。</p>
        </div>
        {topRow && (
          <section>
            <span>当前优先深挖</span>
            <strong>{topRow.snapshot.profile.group}</strong>
            <em>{formatMonthlyRange(topRow.snapshot.salaryRange)} · {topRow.snapshot.officialJobCount} 条官网岗位</em>
          </section>
        )}
      </div>

      <div className="major-return-table">
        <div className="major-return-table-head" aria-hidden="true">
          <span>专业方向</span>
          <span>薪资</span>
          <span>大厂需求</span>
          <span>学校证据</span>
          <span>建议</span>
        </div>
        {rows.map((row, index) => (
          <article key={row.snapshot.profile.id} className={`major-return-row ${row.tone}`}>
            <div className="return-major-cell">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div>
                <strong>{row.snapshot.profile.group}</strong>
                <em>{row.snapshot.profile.majors.slice(0, 3).join(" / ")}</em>
              </div>
            </div>
            <div className="return-salary-cell">
              <strong>{formatMonthlyRange(row.snapshot.salaryRange)}</strong>
              <em>成熟 {formatMonthlyRange(row.snapshot.profile.matureMonthlyK)}</em>
            </div>
            <div className="return-demand-cell">
              <strong>{row.snapshot.officialJobCount} 条 · {row.snapshot.liveCompanyCount} 家</strong>
              <em>{row.snapshot.topCompanies.slice(0, 3).map(([company]) => company).join(" / ") || "待刷新"}</em>
            </div>
            <div className="return-evidence-cell">
              <strong>{row.schoolEvidenceCount ? `${row.schoolEvidenceCount} 个匹配` : "待补证据"}</strong>
              <em>{row.schoolEvidenceText}</em>
            </div>
            <div className="return-verdict-cell">
              <span>{row.label}</span>
              <em>{row.action}</em>
            </div>
          </article>
        ))}
      </div>

      <div className="major-return-foot">
        <span>薪资刷新：{formatRefreshTime(jobDataMeta.generatedAt)}</span>
        <span>来源：{activeJobDataSourceCount}/{officialCompanySources.filter((source) => source.adapterStatus === "live-adapter").length} 个 live adapter 有样本</span>
        <span>规则：无学校官方薪酬时不伪造平均工资</span>
      </div>
    </section>
  );
}

type MajorReturnRow = {
  snapshot: MajorDemandSnapshot;
  schoolEvidenceCount: number;
  schoolEvidenceText: string;
  label: string;
  tone: "strong" | "balanced" | "verify";
  action: string;
};

function buildMajorReturnRows(): MajorReturnRow[] {
  return buildMajorDemandSnapshots(jobs)
    .map((snapshot) => {
      const evidence = getSchoolEvidenceForProfile(snapshot.profile);
      const verdict = getMajorReturnVerdict(snapshot, evidence.length);
      const firstEvidence = evidence[0];
      return {
        snapshot,
        schoolEvidenceCount: evidence.length,
        schoolEvidenceText: firstEvidence
          ? `${firstEvidence.school.name} · ${firstEvidence.major.name}`
          : "先查目标学校就业质量报告",
        ...verdict,
      };
    })
    .sort((left, right) => scoreMajorReturnRow(right) - scoreMajorReturnRow(left));
}

function scoreMajorReturnRow(row: MajorReturnRow) {
  const salaryScore = row.snapshot.salaryRange[1] + row.snapshot.profile.matureMonthlyK[1] * 0.35;
  const demandScore = Math.min(130, row.snapshot.officialJobCount) * 0.72 + row.snapshot.liveCompanyCount * 5;
  const evidenceScore = Math.min(24, row.schoolEvidenceCount * 8);
  return salaryScore + demandScore + evidenceScore - getRiskPenalty(row.snapshot.profile.riskLevel) * 0.35;
}

function getMajorReturnVerdict(snapshot: MajorDemandSnapshot, schoolEvidenceCount: number): Pick<MajorReturnRow, "label" | "tone" | "action"> {
  if (snapshot.officialJobCount >= 120 && snapshot.salaryRange[1] >= 30) {
    return {
      label: "优先深挖",
      tone: "strong",
      action: "先查目标学校培养方案和就业报告",
    };
  }
  if (snapshot.liveCompanyCount >= 5 && snapshot.salaryRange[1] >= 25) {
    return {
      label: "重点比较",
      tone: "balanced",
      action: "用学校城市和实习资源做二次筛选",
    };
  }
  if (schoolEvidenceCount > 0) {
    return {
      label: "看学校证据",
      tone: "verify",
      action: "优先验证该校专业级去向",
    };
  }
  return {
    label: "谨慎验证",
    tone: "verify",
    action: "不要只按专业名判断",
  };
}

function MajorQuickComparePanel() {
  const snapshots = useMemo(() => buildMajorDemandSnapshots(jobs), []);
  const [mode, setMode] = useState<MajorCompareMode>("balanced");
  const rankedSnapshots = useMemo(() => rankMajorSnapshotsForMode(snapshots, mode).slice(0, 6), [snapshots, mode]);
  const [selectedId, setSelectedId] = useState(rankedSnapshots[0]?.profile.id ?? majorSalaryProfiles[0].id);
  const selected = rankedSnapshots.find((snapshot) => snapshot.profile.id === selectedId) ?? rankedSnapshots[0] ?? snapshots[0];
  const selectedEvidence = selected ? getSchoolEvidenceForProfile(selected.profile).slice(0, 2) : [];

  if (!selected) return null;

  return (
    <section className="panel major-quick-compare-panel" id="quick-compare" aria-label="专业快速对比台">
      <div className="quick-compare-header">
        <div>
          <p className="eyebrow">专业快速对比台</p>
          <h2>先选 3 个值得深挖的专业方向</h2>
          <p>高考后不要先被专业名字带着走。先按你的决策偏好筛一轮，再去看具体学校培养方案、就业报告和企业校招记录。</p>
        </div>
        <section>
          <span>刷新样本</span>
          <strong>{jobs.length} 条官网岗位</strong>
          <em>{jobDataSourceSummary} · {formatRefreshTime(jobDataMeta.generatedAt)}</em>
        </section>
      </div>

      <div className="quick-compare-modes" aria-label="专业对比偏好">
        {majorCompareModes.map((option) => (
          <button key={option.id} className={option.id === mode ? "active" : ""} onClick={() => setMode(option.id)}>
            <span>{option.label}</span>
            <em>{option.description}</em>
          </button>
        ))}
      </div>

      <div className="quick-compare-layout">
        <div className="quick-compare-table" role="list" aria-label="专业方向对比列表">
          <div className="quick-compare-table-head" aria-hidden="true">
            <span>专业方向</span>
            <span>早期薪资</span>
            <span>岗位</span>
            <span>结论</span>
          </div>
          {rankedSnapshots.map((snapshot, index) => {
            const verdict = getQuickCompareVerdict(snapshot);
            return (
              <button
                key={snapshot.profile.id}
                className={snapshot.profile.id === selected.profile.id ? "quick-compare-row active" : "quick-compare-row"}
                onClick={() => setSelectedId(snapshot.profile.id)}
                role="listitem"
              >
                <span>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <strong>{snapshot.profile.group}</strong>
                  <em>{snapshot.profile.majors.slice(0, 3).join(" / ")}</em>
                </span>
                <span>{formatMonthlyRange(snapshot.salaryRange)}</span>
                <span>{snapshot.officialJobCount} 条</span>
                <span>{verdict}</span>
              </button>
            );
          })}
        </div>

        <article className="quick-compare-detail">
          <div className="quick-detail-top">
            <div>
              <span>当前选中</span>
              <h3>{selected.profile.group}</h3>
            </div>
            <strong>{selected.signalScore}%</strong>
          </div>

          <div className="quick-detail-metrics">
            <section>
              <span>毕业初期</span>
              <strong>{formatMonthlyRange(selected.profile.starterMonthlyK)}</strong>
            </section>
            <section>
              <span>成熟阶段</span>
              <strong>{formatMonthlyRange(selected.profile.matureMonthlyK)}</strong>
            </section>
            <section>
              <span>大厂样本</span>
              <strong>{selected.liveCompanyCount} 家</strong>
            </section>
          </div>

          <div className="quick-detail-section">
            <h4>大厂在招岗位会看这些</h4>
            <div className="destination-tags">
              {selected.topSkills.slice(0, 6).map(([skill, count]) => (
                <span key={skill}>{skill} {count}</span>
              ))}
            </div>
          </div>

          <div className="quick-detail-section">
            <h4>适合先查这些学校证据</h4>
            {selectedEvidence.length ? (
              <div className="quick-evidence-list">
                {selectedEvidence.map((item) => (
                  <span key={`${item.school.id}-${item.major.name}`}>
                    {item.school.name} · {item.major.name} · {item.major.employmentRate.label}
                  </span>
                ))}
              </div>
            ) : (
              <p>当前样本没有足够专业级学校证据，先去查目标学校就业质量报告和企业宣讲日历。</p>
            )}
          </div>

          <div className="quick-detail-action">
            <span>第一年验证动作</span>
            <strong>{selected.profile.firstYearChecks[0]}</strong>
          </div>
          <p className="quick-detail-risk">{selected.profile.risk}</p>
        </article>
      </div>
    </section>
  );
}

function rankMajorSnapshotsForMode(snapshots: MajorDemandSnapshot[], mode: MajorCompareMode) {
  return [...snapshots].sort((left, right) => scoreMajorSnapshotForMode(right, mode) - scoreMajorSnapshotForMode(left, mode));
}

function scoreMajorSnapshotForMode(snapshot: MajorDemandSnapshot, mode: MajorCompareMode) {
  const salaryScore = snapshot.salaryRange[1] * 2 + snapshot.profile.matureMonthlyK[1] * 0.45;
  const jobScore = Math.min(100, snapshot.officialJobCount) + snapshot.liveCompanyCount * 4 + snapshot.signalScore * 0.4;
  const riskPenalty = getRiskPenalty(snapshot.profile.riskLevel);
  const hardwareBoost = /自动化|机器人|电子|通信|电气|能源|制造|机械|集成电路/.test(`${snapshot.profile.group} ${snapshot.profile.majors.join(" ")}`) ? 48 : 0;

  if (mode === "salary") return salaryScore + snapshot.signalScore * 0.3;
  if (mode === "jobs") return jobScore;
  if (mode === "steady") return jobScore + salaryScore * 0.35 - riskPenalty;
  if (mode === "hardware") return jobScore * 0.6 + salaryScore * 0.35 + hardwareBoost;
  return jobScore * 0.62 + salaryScore * 0.52 - riskPenalty * 0.35;
}

function getRiskPenalty(riskLevel: MajorSalaryProfile["riskLevel"]) {
  if (riskLevel === "高竞争") return 34;
  if (riskLevel === "中高竞争") return 22;
  if (riskLevel === "中等竞争") return 10;
  return 4;
}

function getQuickCompareVerdict(snapshot: MajorDemandSnapshot) {
  if (snapshot.officialJobCount >= 120 && snapshot.salaryRange[1] >= 30) return "优先深挖";
  if (snapshot.officialJobCount >= 70) return "重点比较";
  if (snapshot.salaryRange[1] >= 30) return "先查学校证据";
  return "谨慎验证";
}

function FlowSectionLabel({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className="flow-section-label">
      <span>{kicker}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

type MajorDecisionTone = "go" | "watch" | "verify";

type MajorDecisionCard = {
  snapshot: MajorDemandSnapshot;
  label: string;
  tone: MajorDecisionTone;
  summary: string;
  schoolEvidenceCount: number;
  schoolEvidenceText: string;
  action: string;
  caution: string;
};

function MajorDecisionBoard() {
  const decisionCards = useMemo(() => buildMajorDecisionCards(jobs), []);
  const strongest = decisionCards[0];

  return (
    <section className="panel major-decision-board" id="major-decision" aria-label="30 秒专业决策摘要">
      <div className="major-decision-header">
        <div>
          <p className="eyebrow">30 秒先判断</p>
          <h2>先把专业当成未来岗位组合来比较</h2>
          <p>
            这不是“热门专业榜”。这里把毕业初期薪资代理、官网岗位样本、学校就业证据和竞争风险放到同一张表里，先帮高考生判断哪些方向值得继续查学校和培养方案。
          </p>
        </div>
        {strongest && (
          <section>
            <span>当前最强信号</span>
            <strong>{strongest.snapshot.profile.group}</strong>
            <em>{strongest.snapshot.officialJobCount} 条官网岗位 · {formatMonthlyRange(strongest.snapshot.salaryRange)}</em>
          </section>
        )}
      </div>

      <div className="major-decision-rules" aria-label="专业决策规则">
        <section>
          <span>薪资</span>
          <strong>看区间，不看单点</strong>
          <em>优先比较毕业初期和成熟阶段上限</em>
        </section>
        <section>
          <span>岗位</span>
          <strong>看官网样本密度</strong>
          <em>{jobDataSourceSummary} 可刷新</em>
        </section>
        <section>
          <span>学校</span>
          <strong>看就业报告证据</strong>
          <em>专业级缺口会标成待接入</em>
        </section>
        <section>
          <span>风险</span>
          <strong>看第一年能否验证</strong>
          <em>能做出作品再决定是否加码</em>
        </section>
      </div>

      <div className="major-decision-card-grid">
        {decisionCards.map((card, index) => (
          <article key={card.snapshot.profile.id} className={`major-decision-card ${card.tone}`}>
            <div className="decision-card-topline">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{card.label}</b>
            </div>
            <h3>{card.snapshot.profile.group}</h3>
            <p>{card.summary}</p>

            <div className="decision-card-stats">
              <section>
                <span>早期薪资</span>
                <strong>{formatMonthlyRange(card.snapshot.salaryRange)}</strong>
              </section>
              <section>
                <span>官网岗位</span>
                <strong>{card.snapshot.officialJobCount} 条</strong>
              </section>
              <section>
                <span>学校证据</span>
                <strong>{card.schoolEvidenceCount ? `${card.schoolEvidenceCount} 个` : "待补"}</strong>
              </section>
            </div>

            <div className="decision-card-companies">
              {card.snapshot.topCompanies.slice(0, 4).map(([company, count]) => (
                <span key={company}>{company} {count}</span>
              ))}
            </div>

            <div className="decision-card-action">
              <span>下一步</span>
              <strong>{card.action}</strong>
            </div>
            <div className="decision-card-evidence">
              <span>学校核验</span>
              <em>{card.schoolEvidenceText}</em>
            </div>
            <p className="decision-card-caution">{card.caution}</p>
          </article>
        ))}
      </div>

      <p className="major-decision-note">
        薪资仍是市场代理区间；岗位来自当前官方 adapter 聚合样本，刷新时间 {formatRefreshTime(jobDataMeta.generatedAt)}。学校报告未披露薪酬或专业级就业率时不会伪造数字。
      </p>
    </section>
  );
}

function buildMajorDecisionCards(allJobs: Job[]): MajorDecisionCard[] {
  const rankedSnapshots = buildMajorDemandSnapshots(allJobs)
    .sort((left, right) => {
      const leftScore = left.signalScore * 2 + left.salaryRange[1] + Math.min(30, left.officialJobCount);
      const rightScore = right.signalScore * 2 + right.salaryRange[1] + Math.min(30, right.officialJobCount);
      return rightScore - leftScore;
    });
  const representativeIds = [
    "finance-accounting",
    "consumer-retail-brand",
    "hospitality-tourism-aviation",
    "healthcare-care",
    "education-law-public",
    "civil-environment-urban",
  ];
  const selectedSnapshots = new Map<string, MajorDemandSnapshot>();
  rankedSnapshots.slice(0, 3).forEach((snapshot) => selectedSnapshots.set(snapshot.profile.id, snapshot));
  representativeIds
    .map((id) => rankedSnapshots.find((snapshot) => snapshot.profile.id === id))
    .filter((snapshot): snapshot is MajorDemandSnapshot => Boolean(snapshot))
    .forEach((snapshot) => {
      if (selectedSnapshots.size < 8) selectedSnapshots.set(snapshot.profile.id, snapshot);
    });
  rankedSnapshots.forEach((snapshot) => {
    if (selectedSnapshots.size < 8) selectedSnapshots.set(snapshot.profile.id, snapshot);
  });

  return Array.from(selectedSnapshots.values())
    .map((snapshot) => {
      const schoolEvidence = getSchoolEvidenceForProfile(snapshot.profile);
      const verdict = getMajorDecisionVerdict(snapshot, schoolEvidence.length);
      const firstEvidence = schoolEvidence[0];

      return {
        snapshot,
        ...verdict,
        schoolEvidenceCount: schoolEvidence.length,
        schoolEvidenceText: firstEvidence
          ? `${firstEvidence.school.name} · ${firstEvidence.major.name}，${firstEvidence.major.employmentRate.label}`
          : "当前学校样本还没有强匹配，需要继续接入就业质量报告。",
        action: snapshot.profile.firstYearChecks[0] ?? "先做一个可展示项目验证兴趣和能力。",
        caution: snapshot.profile.risk,
      };
    });
}

function getMajorDecisionVerdict(snapshot: MajorDemandSnapshot, schoolEvidenceCount: number): Pick<MajorDecisionCard, "label" | "tone" | "summary"> {
  if (snapshot.signalScore >= 96 && snapshot.officialJobCount >= 120 && schoolEvidenceCount >= 3) {
    return {
      label: "优先研究",
      tone: "go",
      summary: "岗位密度、薪资上限和学校证据都比较强，适合作为第一梯队继续核验。",
    };
  }

  if (snapshot.officialJobCount >= 80 && snapshot.salaryRange[1] >= 28) {
    return {
      label: "重点比较",
      tone: "watch",
      summary: "官网岗位样本够多，但还要结合目标学校的专业实力、城市和实习资源再判断。",
    };
  }

  if (snapshot.officialJobCount >= 40 && schoolEvidenceCount > 0) {
    return {
      label: "学校核验",
      tone: "verify",
      summary: "岗位样本已经有一定密度，下一步要看具体学校是否有就业报告和企业去向证据。",
    };
  }

  if (snapshot.salaryRange[1] >= 30 && schoolEvidenceCount === 0) {
    return {
      label: "先补证据",
      tone: "verify",
      summary: "市场薪资上限不错，但当前学校证据不足，不能只靠专业名做决定。",
    };
  }

  return {
    label: "谨慎验证",
    tone: "verify",
    summary: "可以作为备选方向，但需要先验证课程兴趣、作品路径和真实招聘量。",
  };
}

function formatRefreshTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSchoolEvidenceForProfile(profile: MajorSalaryProfile) {
  return schoolOutcomeProfiles
    .flatMap((school) =>
      school.majors.map((major) => ({
        school,
        major,
        score: scoreMarketProfileForMajor(major, profile),
        verifiedEvidenceCount: school.evidenceSources.filter((source) => source.status === "verified").length,
      })),
    )
    .filter((item) => item.score >= 40)
    .sort((left, right) => right.verifiedEvidenceCount - left.verifiedEvidenceCount || right.score - left.score);
}

function MajorSalaryOverview() {
  const [selectedId, setSelectedId] = useState(majorSalaryProfiles[0].id);
  const selected = majorSalaryProfiles.find((profile) => profile.id === selectedId) ?? majorSalaryProfiles[0];

  return (
    <section className="panel major-salary-panel" id="major-salary-detail">
      <PanelHeader kicker="Start Here" title="高考后先看专业薪资水平" icon={<LineChart size={20} />} />
      <div className="salary-overview-layout">
        <div className="salary-card-grid">
          {majorSalaryProfiles.map((profile) => (
            <button key={profile.id} className={profile.id === selected.id ? "salary-major-card active" : "salary-major-card"} onClick={() => setSelectedId(profile.id)}>
              <span>{profile.group}</span>
              <strong>{formatMonthlyRange(profile.starterMonthlyK)}</strong>
              <em>需求热度 {profile.demandScore}% · {profile.riskLevel}</em>
            </button>
          ))}
        </div>

        <article className="salary-detail-card">
          <p className="eyebrow">Salary Map</p>
          <h3>{selected.group}</h3>
          <div className="salary-range-strip">
            <div>
              <span>毕业初期</span>
              <strong>{formatMonthlyRange(selected.starterMonthlyK)}</strong>
            </div>
            <div>
              <span>成熟阶段</span>
              <strong>{formatMonthlyRange(selected.matureMonthlyK)}</strong>
            </div>
            <div>
              <span>大厂需求热度</span>
              <strong>{selected.demandScore}%</strong>
            </div>
          </div>
          <div className="salary-detail-grid">
            <section>
              <h4>能去什么岗位</h4>
              <div className="destination-tags">
                {selected.roles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>大厂常看能力</h4>
              <div className="destination-tags">
                {selected.coreSkills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>适合什么学生</h4>
              <div className="destination-tags">
                {selected.fitFor.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>大一就该验证</h4>
              <ol className="decision-list">
                {selected.firstYearChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            <section>
              <h4>作品/实习信号</h4>
              <div className="destination-tags">
                {selected.portfolioSignals.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>重点企业</h4>
              <div className="destination-tags">
                {selected.companies.map((company) => (
                  <span key={company}>{company}</span>
                ))}
              </div>
            </section>
          </div>
          <p className="salary-risk">{selected.risk}</p>
          <p className="data-refresh-note">薪资为市场估算区间，用于快速比较方向；接入学校就业质量报告和第三方薪资源后替换为可验证统计。</p>
        </article>
      </div>
    </section>
  );
}

type MajorDemandSnapshot = {
  profile: MajorSalaryProfile;
  jobs: Job[];
  officialJobCount: number;
  liveCompanyCount: number;
  topCompanies: Array<[string, number]>;
  topCategories: Array<[string, number]>;
  topSkills: Array<[string, number]>;
  topMajorSignals: Array<[string, number]>;
  salaryRange: [number, number];
  signalScore: number;
};

function MajorDemandMatrix() {
  const snapshots = useMemo(() => buildMajorDemandSnapshots(jobs), []);
  const [selectedId, setSelectedId] = useState(snapshots[0]?.profile.id ?? majorSalaryProfiles[0].id);
  const selected = snapshots.find((snapshot) => snapshot.profile.id === selectedId) ?? snapshots[0];

  if (!selected) return null;

  return (
    <section className="panel major-demand-panel" id="major-demand">
      <PanelHeader kicker="Major × Jobs" title="专业对应多少大厂岗位" icon={<Layers3 size={20} />} />
      <div className="major-demand-layout">
        <div className="major-demand-list" aria-label="专业需求矩阵">
          {snapshots.map((snapshot) => (
            <button
              key={snapshot.profile.id}
              className={snapshot.profile.id === selected.profile.id ? "major-demand-choice active" : "major-demand-choice"}
              onClick={() => setSelectedId(snapshot.profile.id)}
            >
              <span>{snapshot.profile.group}</span>
              <strong>{snapshot.officialJobCount} 条官网岗位</strong>
              <em>{formatMonthlyRange(snapshot.salaryRange)} · {snapshot.liveCompanyCount} 家已接企业</em>
            </button>
          ))}
        </div>

        <article className="major-demand-detail">
          <div className="major-demand-hero">
            <div>
              <p className="eyebrow">官方岗位反推</p>
              <h3>{selected.profile.group}</h3>
              <span>用当前 {jobs.length} 条官网岗位样本反查，而不是只看专业名称。</span>
            </div>
            <div className="major-demand-score">
              <strong>{selected.signalScore}%</strong>
              <span>岗位信号</span>
            </div>
          </div>

          <div className="major-demand-bar" style={{ "--demand": `${selected.signalScore}%` } as React.CSSProperties}>
            <i />
          </div>

          <div className="major-demand-stats">
            <section>
              <span>匹配官网岗位</span>
              <strong>{selected.officialJobCount}</strong>
            </section>
            <section>
              <span>覆盖企业</span>
              <strong>{selected.liveCompanyCount}</strong>
            </section>
            <section>
              <span>早期岗位月薪参考</span>
              <strong>{formatMonthlyRange(selected.salaryRange)}</strong>
            </section>
          </div>

          <div className="major-demand-columns">
            <section>
              <h4>主要企业</h4>
              <div className="destination-tags">
                {selected.topCompanies.map(([company, count]) => (
                  <span key={company}>{company} {count}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>岗位族群</h4>
              <div className="destination-tags">
                {selected.topCategories.map(([category, count]) => (
                  <span key={category}>{category} {count}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>高频能力词</h4>
              <div className="destination-tags">
                {selected.topSkills.slice(0, 6).map(([skill, count]) => (
                  <span key={skill}>{skill} {count}</span>
                ))}
              </div>
            </section>
            <section>
              <h4>岗位反推专业</h4>
              <div className="destination-tags">
                {(selected.topMajorSignals.length ? selected.topMajorSignals : selected.profile.majors.map((major) => [major, 0] as [string, number])).slice(0, 6).map(([major, count]) => (
                  <span key={major}>{count ? `${major} ${count}` : major}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="major-demand-jobs">
            {selected.jobs.slice(0, 6).map((job) => (
              <a key={job.id} href={job.sourceUrl} target="_blank" rel="noreferrer">
                <span>{job.companyName}</span>
                <strong>{job.title}</strong>
                <em>{job.location} · {job.salary.monthlyMinK}-{job.salary.monthlyMaxK}K/月</em>
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function CompanyDemandPanel() {
  const filters = [
    { id: "all", label: "全部", keywords: [] },
    { id: "ai", label: "AI / 算法", keywords: ["AI", "算法", "大模型", "推荐", "自动驾驶"] },
    { id: "software", label: "软件 / 平台", keywords: ["后端", "云计算", "平台", "终端软件", "零售系统"] },
    { id: "hardware", label: "硬件 / 制造", keywords: ["通信", "芯片", "硬件", "制造", "新能源", "电气"] },
    { id: "product", label: "产品 / 数据", keywords: ["产品", "数据", "增长", "运营", "策略"] },
    { id: "content", label: "内容 / 游戏", keywords: ["游戏", "内容", "美术", "发行", "策划"] },
    { id: "finance", label: "金融 / 咨询", keywords: ["金融", "投行", "审计", "咨询", "税务", "风险", "财富", "Human Capital"] },
    { id: "service", label: "服务 / 航旅", keywords: ["酒店", "航空", "客户体验", "服务", "餐饮", "前厅", "旅游", "会展"] },
    { id: "consumer", label: "快消 / 零售", keywords: ["品牌", "快消", "零售", "美妆", "消费者", "门店", "Supply Chain"] },
  ];
  const [activeFilter, setActiveFilter] = useState(filters[0].id);
  const active = filters.find((filter) => filter.id === activeFilter) ?? filters[0];
  const visibleCompanies = active.id === "all"
    ? companyDemandProfiles
    : companyDemandProfiles.filter((company) => {
        const haystack = [...company.roleFamilies, ...company.preferredMajors, ...company.signals, ...company.sampleQueries].join(" ");
        return active.keywords.some((keyword) => haystack.includes(keyword));
      });

  return (
    <section className="panel company-demand-panel" id="company-demand">
      <PanelHeader kicker="Big Company Signals" title="大厂到底需要什么" icon={<Building2 size={20} />} />
      <div className="demand-intro">
        <strong>{jobDataSourceSummary} · {officialCompanySources.length} 家官方入口</strong>
        <span>当前展示“岗位族群 + 偏好专业 + 能力信号”，具体岗位优先通过官网即时搜索聚合，不把一次搜索结果当长期事实库。</span>
      </div>
      <div className="demand-filter-row" aria-label="大厂需求筛选">
        {filters.map((filter) => (
          <button key={filter.id} className={filter.id === activeFilter ? "active" : ""} onClick={() => setActiveFilter(filter.id)}>
            {filter.label}
          </button>
        ))}
        <span>{visibleCompanies.length} 家相关企业</span>
      </div>
      <div className="demand-grid">
        {visibleCompanies.map((company) => {
          const source = officialCompanySources.find((item) => item.id === company.officialSourceId);
          return (
            <article key={company.company} className="demand-card">
              <div>
                <div>
                  <h3>{company.company}</h3>
                  <span className={company.sourceConfidence === "live-adapter" ? "source-badge live" : "source-badge"}>
                    {company.sourceConfidence === "live-adapter" ? "岗位样本已接入" : "官方入口待 adapter"}
                  </span>
                </div>
                {source && (
                  <a href={source.careerUrl} target="_blank" rel="noreferrer">
                    {source.adapterStatus === "live-adapter" ? "已接官方 adapter" : "官方入口"}
                  </a>
                )}
              </div>
              <div className="demand-row">
                <span>岗位族群</span>
                <p>{company.roleFamilies.join(" / ")}</p>
              </div>
              <div className="demand-row">
                <span>偏好专业</span>
                <p>{company.preferredMajors.join(" / ")}</p>
              </div>
              <div className="demand-row">
                <span>校招切入点</span>
                <p>{company.campusRoutes.join(" / ")}</p>
              </div>
              <div className="demand-row">
                <span>官网搜索词</span>
                <p>{company.sampleQueries.join(" / ")}</p>
              </div>
              <div className="demand-signal-list">
                {company.signals.map((signal) => (
                  <em key={signal}>{signal}</em>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SchoolMajorExplorer({
  searchIntent,
  onOpenCareerRadar,
}: {
  searchIntent: GlobalSearchIntent | null;
  onOpenCareerRadar?: (handoff: SchoolCareerRadarHandoff) => void;
}) {
  const initialSchool = useMemo(() => resolveInitialSchoolExplorerProfile(), []);
  const [schoolId, setSchoolId] = useState(initialSchool.id);
  const [majorId, setMajorId] = useState(initialSchool.majors[0].id);
  const [schoolQuery, setSchoolQuery] = useState(initialSchool.name);
  const [publicMajorQuery, setPublicMajorQuery] = useState("");
  const [publicJobQuery, setPublicJobQuery] = useState("");
  useEffect(() => {
    if (!searchIntent || searchIntent.target !== "school-major") return;
    const normalizedIntent = normalizeGlobalSearchText(searchIntent.query);
    const matchedSchool =
      schoolOutcomeProfiles.find((school) => school.id === searchIntent.schoolId) ??
      schoolOutcomeProfiles.find((school) => normalizeGlobalSearchText(school.name).includes(normalizedIntent)) ??
      schoolOutcomeProfiles.find((school) =>
        school.majors.some((major) =>
          normalizeGlobalSearchText([major.name, major.cluster, ...major.destinations].join(" ")).includes(normalizedIntent)
        )
      );

    if (!matchedSchool) {
      setSchoolQuery(searchIntent.query);
      return;
    }
    const matchedMajor =
      matchedSchool.majors.find((major) => major.id === searchIntent.majorId) ??
      matchedSchool.majors.find((major) =>
        normalizeGlobalSearchText([major.name, major.cluster, ...major.destinations].join(" ")).includes(normalizedIntent)
      ) ??
      matchedSchool.majors[0];

    setSchoolId(matchedSchool.id);
    setMajorId(matchedMajor.id);
    setSchoolQuery(searchIntent.kind === "school" ? matchedSchool.name : searchIntent.query);
  }, [searchIntent]);
  const visibleSchools = useMemo(() => {
    const query = schoolQuery.trim().toLowerCase();
    if (!query) return schoolExplorerProfiles;
    return schoolExplorerProfiles.filter((school) =>
      [school.name, school.city, ...school.officialLinks.map((link) => link.label), ...school.majors.map((major) => major.name), ...school.majors.map((major) => major.cluster)]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [schoolQuery]);
  const ordinaryEntryCoverageSchools = useMemo(
    () =>
      ordinarySchoolFirstIds
        .map((id) => schoolExplorerProfiles.find((school) => school.id === id))
        .filter((school): school is (typeof schoolOutcomeProfiles)[number] => Boolean(school)),
    [],
  );
  const hasVisibleSchools = visibleSchools.length > 0;
  const fallbackSchool = schoolOutcomeProfiles.find((school) => school.id === schoolId) ?? schoolOutcomeProfiles[0];
  const selectedSchool = visibleSchools.find((school) => school.id === schoolId) ?? visibleSchools[0] ?? fallbackSchool;
  const selectedMajor = selectedSchool.majors.find((major) => major.id === majorId) ?? selectedSchool.majors[0];
  const publicAccessSchoolName = schoolQuery.trim() || selectedSchool.name;
  const recruiterSources = getRecruiterSources(selectedMajor);
  const officialCards = buildOfficialSearchCards(selectedMajor.destinations[0] ?? selectedMajor.name, 5);
  const marketProfile = useMemo(() => findMarketProfileForSchoolMajor(selectedMajor), [selectedMajor]);
  const allAggregatedJobs = useMemo(
    () => getAllAggregatedOfficialJobs([selectedMajor.name, selectedMajor.cluster, ...selectedMajor.destinations, ...marketProfile.roles], 42),
    [marketProfile, selectedMajor],
  );
  const aggregatedJobs = useMemo(
    () => allAggregatedJobs.slice(0, 6),
    [allAggregatedJobs],
  );
  const matchedCompanies = Array.from(new Set(allAggregatedJobs.map((match) => match.job.companyName))).slice(0, 5);
  const verifiedEvidenceCount = selectedSchool.evidenceSources.filter((source) => source.status === "verified").length;
  const schoolMajorSnapshots = useMemo(() => buildSchoolMajorSnapshots(selectedSchool), [selectedSchool]);
  const schoolAggregationReport = useMemo(() => buildSchoolAggregationReport(selectedSchool), [selectedSchool]);
  const careerDirectoryMatches = useMemo(() => getCareerDirectoryMatchesForSchool(selectedSchool.name).slice(0, 4), [selectedSchool.name]);
  useEffect(() => {
    if (!hasVisibleSchools || !selectedMajor) return;
    setPublicMajorQuery(selectedMajor.name);
    setPublicJobQuery(selectedMajor.destinations[0] ?? "");
  }, [hasVisibleSchools, selectedMajor.id]);
  useEffect(() => {
    if (hasVisibleSchools || !schoolQuery.trim()) return;
    setPublicMajorQuery("");
    setPublicJobQuery("");
  }, [hasVisibleSchools, schoolQuery]);

  return (
    <section className="panel school-major-panel school-major-search-first" id="school-major" aria-label="学校信息聚合入口">
      <div className="school-major-layout">
        <div className="major-browser">
          {hasVisibleSchools && <SchoolAggregationReportPanel aggregation={schoolAggregationReport} />}

          <SchoolPublicAccessPanel
            schoolName={publicAccessSchoolName}
            schoolQuery={schoolQuery}
            selectedSchool={hasVisibleSchools ? selectedSchool : null}
            selectedMajor={hasVisibleSchools ? selectedMajor : null}
            visibleSchoolCount={visibleSchools.length}
            majorQuery={publicMajorQuery}
            jobQuery={publicJobQuery}
            onSchoolQueryChange={setSchoolQuery}
            onMajorQueryChange={setPublicMajorQuery}
            onJobQueryChange={setPublicJobQuery}
            onOpenCareerRadar={onOpenCareerRadar}
          />
        </div>

        <div className="school-picker school-picker-secondary">
          <label className="inline-search">
            <Search size={16} />
            <input value={schoolQuery} onChange={(event) => setSchoolQuery(event.target.value)} placeholder="输入学校或专业" />
          </label>
          <OrdinarySchoolEntryCoveragePanel
            schools={ordinaryEntryCoverageSchools}
            selectedSchoolId={selectedSchool.id}
            onSelectSchool={(school) => {
              setSchoolId(school.id);
              setMajorId(school.majors[0].id);
              setSchoolQuery(school.name);
            }}
          />
          <div className="school-list">
            {visibleSchools.map((school) => (
              <button
                key={school.id}
                className={school.id === selectedSchool.id ? "active" : ""}
                onClick={() => {
                  setSchoolId(school.id);
                  setMajorId(school.majors[0].id);
                }}
              >
                <strong>{school.name}</strong>
                <span>
                  {school.city} · {school.officialLinks.length} 个官方入口 ·{" "}
                  {school.evidenceSources.length > 0 ? `${school.evidenceSources.length} 个报告源` : "报告源待接入"}
                </span>
              </button>
            ))}
            {visibleSchools.length === 0 && (
              <div className="empty-school-result">
                暂时没有结构化样本，但右侧已经生成公开入口。先查专业目录、就业报告和宣讲会，再回到岗位雷达反推专业。
              </div>
            )}
          </div>
        </div>

        <div className="major-detail-browser">
          {hasVisibleSchools ? (
            <SchoolKnownDetailFoldout
              title="已收录样本详情"
              summary="结构化专业、就业报告、岗位和去向样本默认折叠，避免把公开入口挤到后面。"
              metric={`${selectedSchool.majors.length} 个专业 · ${allAggregatedJobs.length} 条岗位`}
            >
              <SchoolMajorSnapshotBoard
                school={selectedSchool}
                snapshots={schoolMajorSnapshots}
                selectedMajorId={selectedMajor.id}
                onSelect={setMajorId}
              />

              <OfficialSchoolLinksPanel links={selectedSchool.officialLinks} />
              <CareerDirectoryLinksPanel entries={careerDirectoryMatches} />

              <div className="major-tabs">
                {selectedSchool.majors.map((major) => (
                  <button key={major.id} className={major.id === selectedMajor.id ? "active" : ""} onClick={() => setMajorId(major.id)}>
                    {major.name}
                  </button>
                ))}
              </div>

              <SchoolMajorEvidenceSummaryCard
                school={selectedSchool}
                major={selectedMajor}
                marketProfile={marketProfile}
                officialJobCount={allAggregatedJobs.length}
                matchedCompanies={matchedCompanies}
                verifiedEvidenceCount={verifiedEvidenceCount}
              />

              <MarketProxyCard major={selectedMajor} profile={marketProfile} />

              <AggregatedOfficialJobsBlock
                title="相关官网岗位聚合"
                description="按专业名、去向岗位和市场角色从已接官方 adapter 样本里聚合，点击可回到企业官网。"
                matches={aggregatedJobs}
              />

              <div className="school-evidence-grid">
                {selectedSchool.evidenceSources.map((source) => (
                  <article key={`${source.url}-${source.title}`} className={source.status === "verified" ? "school-evidence-card verified" : "school-evidence-card partial"}>
                    <div>
                      <span>{source.year}</span>
                      <strong>{source.title}</strong>
                      <a href={source.url} target="_blank" rel="noreferrer">{source.sourceName}</a>
                    </div>
                    <div className="evidence-metrics">
                      {source.metrics.map((metric) => (
                        <section key={`${source.title}-${metric.label}`}>
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                          <em>{metric.note}</em>
                        </section>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="destination-grid">
                <section>
                  <h4>毕业生去向</h4>
                  <div className="destination-tags">
                    {selectedMajor.destinations.map((destination) => (
                      <span key={destination}>{destination}</span>
                    ))}
                  </div>
                </section>
                <section>
                  <h4>年度到校/签约企业证据</h4>
                  <div className="campus-year-list">
                    {selectedSchool.campusRecruitingYears.map((year) => (
                      <article key={year.year} className={year.status === "verified" ? "campus-year verified" : "campus-year pending"}>
                        <div>
                          <strong>{year.year}</strong>
                          <span>{year.status === "verified" ? "已核验" : "待接入"}</span>
                        </div>
                        {year.companies.length > 0 ? (
                          <p>{year.companies.join(" / ")}</p>
                        ) : (
                          <p>{year.source}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
                <section>
                  <h4>企业入口与核验说明</h4>
                  <p>{selectedSchool.dataNote}</p>
                  <div className="recruiter-links">
                    {recruiterSources.map((source) => (
                      <a key={source.id} href={source.careerUrl} target="_blank" rel="noreferrer">
                        {source.name}
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <div className="official-search-grid">
                {officialCards.map((source) => (
                  <a key={source.id} href={source.careerUrl} target="_blank" rel="noreferrer">
                    <strong>{source.name}</strong>
                    <span>{source.adapterStatus === "live-adapter" ? "已接官方 adapter" : "官方入口待聚合"}</span>
                  </a>
                ))}
              </div>
            </SchoolKnownDetailFoldout>
          ) : (
            <UnknownSchoolPathPanel
              schoolName={publicAccessSchoolName}
              majorName={publicMajorQuery}
              jobName={publicJobQuery}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function OrdinarySchoolEntryCoveragePanel({
  schools,
  selectedSchoolId,
  onSelectSchool,
}: {
  schools: Array<(typeof schoolOutcomeProfiles)[number]>;
  selectedSchoolId: string;
  onSelectSchool: (school: (typeof schoolOutcomeProfiles)[number]) => void;
}) {
  if (schools.length === 0) return null;

  const completeCount = schools.filter((school) => {
    const kinds = new Set(school.officialLinks.map((link) => link.kind));
    return kinds.has("major-catalog") && kinds.has("admissions") && kinds.has("employment");
  }).length;

  return (
    <details open className="ordinary-school-entry-coverage" aria-label="普通学校公开入口覆盖">
      <summary className="ordinary-school-entry-coverage-head">
        <div>
          <span>普通学校入口覆盖</span>
          <strong>{completeCount}/{schools.length} 所已可直接查专业</strong>
        </div>
        <em>只给入口，先能查</em>
      </summary>
      <div className="ordinary-school-entry-coverage-grid">
        {schools.map((school) => {
          const kinds = new Set(school.officialLinks.map((link) => link.kind));
          const directLinks = school.officialLinks
            .filter((link) => link.kind === "admissions" || link.kind === "major-catalog" || link.kind === "employment")
            .sort((left, right) => getSchoolOfficialLinkKindRank(left.kind) - getSchoolOfficialLinkKindRank(right.kind))
            .slice(0, 3);
          const chips = [
            { id: "major-catalog", label: "专业入口", covered: kinds.has("major-catalog") },
            { id: "admissions", label: "招生入口", covered: kinds.has("admissions") },
            { id: "employment", label: "就业入口", covered: kinds.has("employment") },
            { id: "report", label: "报告源", covered: school.evidenceSources.length > 0 },
          ];
          return (
            <article
              key={school.id}
              className={school.id === selectedSchoolId ? "ordinary-school-entry-card active" : "ordinary-school-entry-card"}
            >
              <button type="button" className="ordinary-school-entry-select" onClick={() => onSelectSchool(school)}>
                <strong>{school.name}</strong>
                <span>{school.city} · {school.officialLinks.length} 个入口</span>
                <div className="ordinary-school-entry-chip-row">
                  {chips.map((chip) => (
                    <em
                      key={`${school.id}-${chip.id}`}
                      className={chip.covered ? "ordinary-school-entry-chip is-covered" : "ordinary-school-entry-chip is-missing"}
                    >
                      {chip.label}
                    </em>
                  ))}
                </div>
              </button>
              <div className="ordinary-school-entry-link-row">
                {directLinks.map((link) => (
                  <a
                    key={`${school.id}-${link.kind}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`ordinary-school-entry-link link-${link.kind}`}
                    title={link.note}
                  >
                    <span>{getSchoolOfficialLinkShortLabel(link)}</span>
                    <small>{getSchoolOfficialLinkAuthority(link.kind)}</small>
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </details>
  );
}

type SchoolAccessLink = {
  label: string;
  source: string;
  url: string;
  description: string;
  priority: "专业" | "就业" | "校招" | "薪资";
};

type SchoolInfoCandidate = {
  key: string;
  schoolName: string;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  marketGroup: string;
  evidenceScore: number;
  evidenceLabel: string;
  evidenceNote: string;
  confirmedEvidence: string[];
  missingEvidence: string[];
  companyNames: string[];
  requiredActions: string[];
  readinessTier?: SchoolEvidenceReadiness["tier"];
  readinessTitle?: string;
  readinessAdvice?: string;
  readinessMissingKinds?: string[];
  aggregationStatusLabel?: string;
  aggregationConfirmedCount?: number;
  aggregationLeadCount?: number;
  aggregationWeakCount?: number;
  aggregationMissingSlots?: string[];
  aggregationNextAction?: string;
  nextEvidenceLabel?: string;
  nextEvidenceSource?: string;
  nextEvidenceDetail?: string;
  nextEvidenceUrl?: string;
  nextEvidenceSaveFields?: string[];
};

type SchoolEvidenceTask = {
  label: string;
  status: "open" | "search" | "verified";
  source: string;
  detail: string;
  url: string;
};

type SchoolEvidenceSlotCard = {
  id: "major" | "report" | "campus" | "salary";
  label: string;
  isCovered: boolean;
  status: string;
  source: string;
  detail: string;
  url: string;
};

function getCandidateNextEvidenceSaveFields(slotId: SchoolEvidenceSlotCard["id"]) {
  const saveFieldsBySlot: Record<SchoolEvidenceSlotCard["id"], string[]> = {
    major: ["专业名称", "所属学院", "培养方案", "校区/学制"],
    report: ["就业率", "升学率", "行业去向", "统计口径"],
    campus: ["年份", "企业名", "岗位方向", "学校页面链接"],
    salary: ["岗位名", "城市", "薪资范围", "更新时间"],
  };
  return saveFieldsBySlot[slotId];
}

function getSchoolEvidenceTaskSlotId(task: SchoolEvidenceTask): SchoolEvidenceSlotCard["id"] {
  const taskText = `${task.label} ${task.source} ${task.detail}`;
  if (/就业质量报告|就业报告|报告/.test(taskText)) return "report";
  if (/就业信息网|宣讲|双选|校招|招聘会/.test(taskText)) return "campus";
  if (/企业官网|岗位|薪资|薪酬|工资/.test(taskText)) return "salary";
  return "major";
}

type SchoolManualEvidenceKind = "major" | "report" | "campus" | "salary";

type SchoolManualEvidenceItem = {
  id: string;
  kind: SchoolManualEvidenceKind;
  title: string;
  detail: string;
  url: string;
};

type SchoolManualEvidenceDraft = {
  kind: SchoolManualEvidenceKind;
  title: string;
  detail: string;
  url: string;
};

type SchoolManualEvidenceCoverage = {
  coveredCount: number;
  totalCount: number;
  label: string;
  nextMissingLabel: string;
};

const schoolManualEvidenceKinds: { id: SchoolManualEvidenceKind; label: string; hint: string }[] = [
  { id: "major", label: "专业存在", hint: "官网专业目录 / 招生专业" },
  { id: "report", label: "就业报告", hint: "就业率 / 升学率 / 去向" },
  { id: "campus", label: "到校企业", hint: "宣讲会 / 双选会 / 招聘日历" },
  { id: "salary", label: "岗位薪资", hint: "公司官网岗位 / 薪资口径" },
];

const ordinarySchoolStarterPresets = [
  { major: "会计学", job: "审计助理", label: "会计 / 审计", note: "适合先看事务所、财务岗和证书路径。" },
  { major: "护理学", job: "护士", label: "护理 / 医疗", note: "先确认实习医院、资格证和就业报告口径。" },
  { major: "电子商务", job: "电商运营", label: "电商 / 运营", note: "适合反查平台运营、供应链和数据分析岗位。" },
  { major: "网络工程", job: "安全工程师", label: "网络 / 安全", note: "看安全、运维、云平台岗位和实战项目要求。" },
  { major: "数字媒体技术", job: "内容产品运营", label: "数媒 / 内容", note: "重点看作品集、内容平台和设计/运营岗位。" },
  { major: "酒店管理", job: "酒店运营管培生", label: "酒店 / 航旅", note: "先看管培、实习、轮岗和一线强度。" },
];

function SchoolPublicAccessPanel({
  schoolName,
  schoolQuery,
  selectedSchool,
  selectedMajor,
  visibleSchoolCount,
  majorQuery,
  jobQuery,
  onSchoolQueryChange,
  onMajorQueryChange,
  onJobQueryChange,
  onOpenCareerRadar,
}: {
  schoolName: string;
  schoolQuery: string;
  selectedSchool: (typeof schoolOutcomeProfiles)[number] | null;
  selectedMajor: SchoolOutcomeMajor | null;
  visibleSchoolCount: number;
  majorQuery: string;
  jobQuery: string;
  onSchoolQueryChange: (value: string) => void;
  onMajorQueryChange: (value: string) => void;
  onJobQueryChange: (value: string) => void;
  onOpenCareerRadar?: (handoff: SchoolCareerRadarHandoff) => void;
}) {
  const targetSchoolName = schoolName.trim() || selectedSchool?.name || "你的学校";
  const targetMajorQuery = majorQuery.trim() || selectedMajor?.name || "";
  const targetJobQuery = jobQuery.trim() || selectedMajor?.destinations[0] || "";
  const hasCareerQuery = Boolean(targetMajorQuery || targetJobQuery);
  const links = buildSchoolAccessLinks(targetSchoolName, targetMajorQuery, targetJobQuery);
  const schoolWorkbenchStorageKey = buildSchoolWorkbenchStorageKey({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
  });
  const initialSchoolWorkbenchSnapshot = readSchoolWorkbenchStorageSnapshot(
    getSchoolWorkbenchLocalStorage(),
    schoolWorkbenchStorageKey,
  );
  const [unknownOfficialDomain, setUnknownOfficialDomain] = useState(initialSchoolWorkbenchSnapshot.officialDomain);
  const publicMajorAccessEntries = buildSchoolPublicMajorAccessEntries({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    officialDomain: unknownOfficialDomain,
    officialLinks: selectedSchool?.officialLinks ?? [],
  });
  const officialEntranceCards = buildSchoolOfficialEntranceLauncherCards(publicMajorAccessEntries);
  const publicSourceRoutes = buildSchoolPublicSourceRoutes({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
  });
  const marketProfile = hasCareerQuery
    ? findMarketProfileForPublicQuery([
      targetMajorQuery,
      targetJobQuery,
      selectedMajor?.cluster ?? "",
      ...(selectedMajor?.destinations ?? []),
    ])
    : null;
  const companyCards = marketProfile
    ? buildPublicCompanyCards(marketProfile, targetMajorQuery || targetJobQuery)
    : [];
  const exactOfficialCount = selectedSchool?.officialLinks.length ?? 0;
  const evidenceCount = selectedSchool?.evidenceSources.length ?? 0;
  const verifiedReportCount = selectedSchool?.evidenceSources.filter((source) => source.status === "verified").length ?? 0;
  const publicMajorOfficialCount = publicMajorAccessEntries.filter((entry) => entry.type === "official").length;
  const actionCommand = buildSchoolActionCommand({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    knownSchool: Boolean(selectedSchool),
    officialEntryCount: publicMajorOfficialCount,
    publicMajorEntryCount: publicMajorAccessEntries.length,
    verifiedReportCount,
    companyEntryCount: companyCards.length,
    salaryLabel: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "",
  });
  const [activeSchoolWorkbenchStorageKey, setActiveSchoolWorkbenchStorageKey] = useState(schoolWorkbenchStorageKey);
  const [manualEvidenceItems, setManualEvidenceItems] = useState<SchoolManualEvidenceItem[]>(
    initialSchoolWorkbenchSnapshot.manualEvidenceItems,
  );
  const [manualEvidenceDraft, setManualEvidenceDraft] = useState<SchoolManualEvidenceDraft>({
    kind: "major",
    title: "",
    detail: "",
    url: "",
  });
  const trustedManualEvidenceItems = manualEvidenceItems.filter((item) => getSchoolEvidencePacketTrustLevel(item) !== "weak");
  const manualEvidenceCoverage = getSchoolManualEvidenceCoverage(manualEvidenceItems);
  const evidenceAggregationBrief = buildSchoolEvidenceAggregationBrief({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    items: manualEvidenceItems,
  });
  const currentCandidate = buildSchoolInfoCandidate({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    selectedSchool,
    links,
    marketProfile,
    companyCards,
    manualEvidenceItems,
  });
  const infoPacketText = buildSchoolInfoPacketText({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    selectedSchool,
    links,
    marketProfile,
    companyCards,
    manualEvidenceItems,
  });
  const infoPacketPreviewLines = buildSchoolInfoPacketPreviewLines({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    salaryLabel: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "",
    salarySource: marketProfile ? `${marketProfile.group} 市场代理` : "",
    officialEntryCount: selectedSchool?.officialLinks.length ?? 0,
    searchEntryCount: links.length,
    companyEntryNames: companyCards.map((company) => company.name),
    nextActions: currentCandidate.requiredActions,
    manualEvidenceCount: manualEvidenceItems.length,
    manualEvidenceLabels: manualEvidenceItems.map((item) => getSchoolManualEvidenceKindLabel(item.kind)),
    manualEvidenceTrustSummary: buildSchoolEvidenceTrustSummary(manualEvidenceItems),
  });
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showInfoPacketText, setShowInfoPacketText] = useState(false);
  const quickMajors = ["会计学", "电子商务", "护理学", "网络工程", "数字媒体技术", "酒店管理"];
  const [candidates, setCandidates] = useState<SchoolInfoCandidate[]>(
    () => readSchoolCandidateComparisonSnapshot(getSchoolWorkbenchLocalStorage()).candidates,
  );
  const [selectedSchoolCompanyId, setSelectedSchoolCompanyId] = useState<string | null>(null);
  const evidenceTasks = buildSchoolEvidenceTasks({
    selectedSchool,
    links,
    companyCards,
  });
  const campusRecruitingLeads = buildSchoolCampusRecruitingLeads({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    officialLinks: selectedSchool?.officialLinks ?? [],
    campusRecruitingYears: selectedSchool?.campusRecruitingYears ?? [],
    companySources: companyCards,
  });
  const unknownEntryPack = selectedSchool ? [] : buildUnknownSchoolEntryPack({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
  });
  const unknownFastEntries = selectedSchool ? [] : pickUnknownSchoolFastEntranceEntries(unknownEntryPack);
  const knownFastEntries = selectedSchool
    ? [...selectedSchool.officialLinks]
      .sort((left, right) => getSchoolOfficialLinkKindRank(left.kind) - getSchoolOfficialLinkKindRank(right.kind))
      .slice(0, 4)
    : [];
  const unknownDirectionPresets = selectedSchool ? [] : buildUnknownSchoolDirectionPresets(targetSchoolName);
  const unknownSchoolTypeStrategy = selectedSchool ? null : buildUnknownSchoolTypeStrategy(targetSchoolName);
  const unknownPublicAccessMapItems = selectedSchool ? [] : buildUnknownSchoolPublicDocumentMatrix({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    officialDomain: unknownOfficialDomain,
  });
  const unknownPublicEntranceDirectory = selectedSchool ? [] : buildUnknownSchoolPublicEntranceDirectory({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    officialDomain: unknownOfficialDomain,
  });
  const unknownAuthorityEntrances = selectedSchool ? [] : buildUnknownSchoolAuthorityEntrances({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
  });
  const unknownEvidenceGuide = selectedSchool ? [] : buildUnknownSchoolEvidenceGuide(unknownEntryPack);
  const unknownPacketText = selectedSchool ? "" : buildUnknownSchoolEntryPacketText({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    officialDomain: unknownOfficialDomain,
    entries: unknownEntryPack,
  });
  const [unknownCopyState, setUnknownCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showUnknownPacketText, setShowUnknownPacketText] = useState(false);
  const nextAction = buildSchoolNextAction({
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    candidate: currentCandidate,
    tasks: evidenceTasks,
    checkedTaskKeys: [],
    coverage: manualEvidenceCoverage,
  });
  const evidenceReadiness = buildSchoolEvidenceReadiness({
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    candidate: currentCandidate,
    evidenceKinds: trustedManualEvidenceItems.map((item) => item.kind),
  });
  const rescueActionRunway = buildSchoolRescueActionRunway({
    knownSchool: Boolean(selectedSchool),
    entryCount: publicMajorAccessEntries.length || unknownEntryPack.length,
    evidenceCount: trustedManualEvidenceItems.length,
    readinessTier: evidenceReadiness.tier,
    salaryLabel: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "",
    candidateCount: candidates.length,
  });
  const rescueTakeaway = buildSchoolRescueTakeaway({
    schoolName: targetSchoolName,
    majorName: targetMajorQuery,
    jobName: targetJobQuery,
    knownSchool: Boolean(selectedSchool),
    officialEntryCount: selectedSchool?.officialLinks.length ?? 0,
    searchEntryCount: links.length,
    salaryLabel: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "",
    salarySource: marketProfile ? `${marketProfile.group} 市场代理` : "",
    companyNames: companyCards.map((company) => company.name),
    evidenceCount: trustedManualEvidenceItems.length,
    readinessTitle: evidenceReadiness.title,
    nextActions: currentCandidate.requiredActions,
  });
  const lookupSummaryCards = [
    {
      id: "school-coverage",
      label: "学校",
      value: selectedSchool ? "已命中" : "未收录",
      detail: selectedSchool ? `${exactOfficialCount} 个官网入口` : `${unknownEntryPack.length} 个公开入口`,
      state: selectedSchool ? "ready" : "proxy",
    },
    {
      id: "entry-coverage",
      label: "入口",
      value: `${publicMajorAccessEntries.length}`,
      detail: `${publicMajorOfficialCount} 官方 / ${Math.max(publicMajorAccessEntries.length - publicMajorOfficialCount, 0)} 检索`,
      state: publicMajorOfficialCount > 0 ? "ready" : "proxy",
    },
    {
      id: "direction-coverage",
      label: "专业岗位",
      value: targetMajorQuery || targetJobQuery ? "已填写" : "待补",
      detail: targetMajorQuery && targetJobQuery ? `${targetMajorQuery} / ${targetJobQuery}` : "补专业或岗位后再判",
      state: targetMajorQuery || targetJobQuery ? "ready" : "missing",
    },
    {
      id: "salary-coverage",
      label: "工资",
      value: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "待生成",
      detail: marketProfile ? `${marketProfile.group} 市场代理` : "不是学校官方结论",
      state: marketProfile ? "proxy" : "missing",
    },
  ] as const;
  const trustedManualEvidenceKindSet = new Set(trustedManualEvidenceItems.map((item) => item.kind));
  const majorSlotTask =
    evidenceTasks.find((task) => /专业|招生/.test(`${task.label} ${task.detail}`)) ?? publicMajorAccessEntries[0] ?? null;
  const reportSlotTask = evidenceTasks.find((task) => /就业质量报告|就业报告|报告/.test(`${task.label} ${task.detail}`)) ?? null;
  const campusSlotTask = evidenceTasks.find((task) => /就业信息网|校招|宣讲|双选/.test(`${task.label} ${task.detail}`)) ?? null;
  const salarySlotTask = evidenceTasks.find((task) => /企业官网|岗位|薪资|薪酬/.test(`${task.label} ${task.detail}`)) ?? null;
  const salarySlotCompany = companyCards[0] ?? null;
  const evidenceSlotCards: SchoolEvidenceSlotCard[] = [
    {
      id: "major",
      label: "专业存在",
      isCovered: trustedManualEvidenceKindSet.has("major") || Boolean(targetMajorQuery && publicMajorOfficialCount > 0),
      status: trustedManualEvidenceKindSet.has("major") ? "已收证据" : publicMajorOfficialCount > 0 ? "官网入口已定位" : "待打开入口",
      source: majorSlotTask?.source ?? "公开入口",
      detail: targetMajorQuery ? "核对专业名、学院、学制、校区" : "先填专业名再核对",
      url: majorSlotTask?.url ?? "",
    },
    {
      id: "report",
      label: "就业报告",
      isCovered: trustedManualEvidenceKindSet.has("report") || verifiedReportCount > 0,
      status: trustedManualEvidenceKindSet.has("report") ? "已收证据" : verifiedReportCount > 0 ? "报告已定位" : "待查近两年",
      source: reportSlotTask?.source ?? selectedSchool?.evidenceSources[0]?.sourceName ?? "公开检索",
      detail: "保存就业率、升学率、行业去向",
      url: reportSlotTask?.url ?? selectedSchool?.evidenceSources[0]?.url ?? "",
    },
    {
      id: "campus",
      label: "到校企业",
      isCovered:
        trustedManualEvidenceKindSet.has("campus") ||
        Boolean(selectedSchool?.campusRecruitingYears.some((year) => year.status === "verified" && year.companies.length > 0)),
      status: trustedManualEvidenceKindSet.has("campus") ? "已收证据" : "待核企业名单",
      source: campusSlotTask?.source ?? "就业信息网",
      detail: "保存年份、企业名、岗位类型",
      url: campusSlotTask?.url ?? "",
    },
    {
      id: "salary",
      label: "岗位薪资",
      isCovered: trustedManualEvidenceKindSet.has("salary") || Boolean(marketProfile),
      status: trustedManualEvidenceKindSet.has("salary") ? "已收证据" : marketProfile ? "市场代理已生成" : "待补岗位",
      source: salarySlotTask?.source ?? salarySlotCompany?.name ?? "企业官网/薪资代理",
      detail: marketProfile ? `${formatMonthlyRange(marketProfile.starterMonthlyK)}，非学校官方结论` : "填岗位后生成薪资代理",
      url: salarySlotTask?.url ?? salarySlotCompany?.careerUrl ?? "",
    },
  ];
  const evidenceGapPrioritySlots = evidenceSlotCards.filter((slot) => !slot.isCovered).slice(0, 3);
  const coveredEvidenceSlotIds = new Set(evidenceSlotCards.filter((slot) => slot.isCovered).map((slot) => slot.id));
  const lookupActionQueue =
    evidenceTasks.filter((task) => !coveredEvidenceSlotIds.has(getSchoolEvidenceTaskSlotId(task))).slice(0, 3);
  useEffect(() => {
    const snapshot = readSchoolWorkbenchStorageSnapshot(getSchoolWorkbenchLocalStorage(), schoolWorkbenchStorageKey);
    setUnknownOfficialDomain(snapshot.officialDomain);
    setManualEvidenceItems(snapshot.manualEvidenceItems);
    setActiveSchoolWorkbenchStorageKey(schoolWorkbenchStorageKey);
  }, [schoolWorkbenchStorageKey]);
  useEffect(() => {
    if (activeSchoolWorkbenchStorageKey !== schoolWorkbenchStorageKey) return;
    writeSchoolWorkbenchStorageSnapshot(getSchoolWorkbenchLocalStorage(), activeSchoolWorkbenchStorageKey, {
      officialDomain: unknownOfficialDomain,
      manualEvidenceItems,
    });
  }, [activeSchoolWorkbenchStorageKey, schoolWorkbenchStorageKey, unknownOfficialDomain, manualEvidenceItems]);
  useEffect(() => {
    writeSchoolCandidateComparisonSnapshot(getSchoolWorkbenchLocalStorage(), { candidates });
  }, [candidates]);
  const selectedSchoolCompany = companyCards.find((company) => company.id === selectedSchoolCompanyId) ?? companyCards[0] ?? null;
  useEffect(() => {
    setSelectedSchoolCompanyId((current) => {
      if (companyCards.length === 0) return null;
      if (current && companyCards.some((company) => company.id === current)) return current;
      return companyCards[0].id;
    });
  }, [companyCards.map((company) => company.id).join("|")]);
  const copyInfoPacket = async () => {
    try {
      await copyTextToClipboard(infoPacketText);
      setCopyState("copied");
      setShowInfoPacketText(false);
    } catch {
      setCopyState("failed");
      setShowInfoPacketText(true);
    }
  };
  const copyUnknownPacket = async () => {
    try {
      await copyTextToClipboard(unknownPacketText);
      setUnknownCopyState("copied");
      setShowUnknownPacketText(false);
    } catch {
      setUnknownCopyState("failed");
      setShowUnknownPacketText(true);
    }
  };
  const addCurrentCandidate = () => {
    const nextEvidenceSlot = evidenceGapPrioritySlots[0] ?? null;
    const candidateWithReadiness: SchoolInfoCandidate = {
      ...currentCandidate,
      readinessTier: evidenceReadiness.tier,
      readinessTitle: evidenceReadiness.title,
      readinessAdvice: evidenceReadiness.primaryAdvice,
      readinessMissingKinds: evidenceReadiness.missingKinds,
      aggregationStatusLabel: evidenceAggregationBrief.statusLabel,
      aggregationConfirmedCount: evidenceAggregationBrief.confirmedLines.length,
      aggregationLeadCount: evidenceAggregationBrief.leadLines.length,
      aggregationWeakCount: evidenceAggregationBrief.weakLines.length,
      aggregationMissingSlots: evidenceAggregationBrief.missingSlots,
      aggregationNextAction: evidenceAggregationBrief.nextActions[0],
      nextEvidenceLabel: nextEvidenceSlot?.label,
      nextEvidenceSource: nextEvidenceSlot?.source,
      nextEvidenceDetail: nextEvidenceSlot?.detail,
      nextEvidenceUrl: nextEvidenceSlot?.url,
      nextEvidenceSaveFields: nextEvidenceSlot ? getCandidateNextEvidenceSaveFields(nextEvidenceSlot.id) : undefined,
    };
    setCandidates((current) => [
      candidateWithReadiness,
      ...current.filter((candidate) => candidate.key !== candidateWithReadiness.key),
    ].slice(0, 4));
  };
  const removeCandidate = (key: string) => {
    setCandidates((current) => current.filter((candidate) => candidate.key !== key));
  };
  const addManualEvidence = () => {
    const title = manualEvidenceDraft.title.trim();
    const detail = manualEvidenceDraft.detail.trim();
    const url = manualEvidenceDraft.url.trim();
    if (!title && !detail && !url) return;

    setManualEvidenceItems((current) => [
      {
        id: `${Date.now()}-${manualEvidenceDraft.kind}-${current.length}`,
        kind: manualEvidenceDraft.kind,
        title: title || getSchoolManualEvidenceKindLabel(manualEvidenceDraft.kind),
        detail,
        url,
      },
      ...current,
    ].slice(0, 12));
    setManualEvidenceDraft((current) => ({
      ...current,
      title: "",
      detail: "",
      url: "",
    }));
  };
  const addParsedEvidenceItems = (parsedItems: ParsedSchoolEvidence[]) => {
    if (!parsedItems.length) return;

    const fallbackUrl = manualEvidenceDraft.url.trim();
    setManualEvidenceItems((current) => [
      ...parsedItems.map((item, index): SchoolManualEvidenceItem => ({
        id: `${Date.now()}-${item.kind}-${index}`,
        kind: item.kind,
        title: item.title || getSchoolManualEvidenceKindLabel(item.kind),
        detail: `${item.detail}｜来源：${item.sourceTrust.label}｜${item.sourceTrust.warning}`,
        url: item.url || fallbackUrl,
      })),
      ...current,
    ].slice(0, 12));
  };
  const openSchoolEvidenceInboxFoldout = () => {
    const foldout = document.querySelector<HTMLDetailsElement>(".school-public-section-stack .school-public-foldout");
    if (foldout) foldout.open = true;

    window.requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>(".school-evidence-inbox-form input")?.focus({ preventScroll: true });
    });
  };
  const fillDraftFromEvidenceTask = (task: SchoolEvidenceTask) => {
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: getSchoolEvidenceTaskSlotId(task),
      title: task.label,
      detail: task.detail,
      url: task.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const openCandidateCompareFoldout = () => {
    const foldout = document.querySelector<HTMLDetailsElement>('[data-school-foldout="candidate-compare"]');
    if (foldout) foldout.open = true;

    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(".school-candidate-report-actions button")?.focus({ preventScroll: true });
    });
  };
  const saveCurrentCandidateFromRescueBrief = () => {
    addCurrentCandidate();
    openCandidateCompareFoldout();
  };
  const fillDraftFromEntranceCard = (card: SchoolOfficialEntranceLauncherCard) => {
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: getSchoolManualEvidenceKindForEntranceSlot(card.slot),
      title: card.title,
      detail: `${card.actionTitle} | ${card.copyTemplate} | 打开原始入口后补年份、数字、企业名或岗位要求。`,
      url: card.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromRescueRoute = (item: SchoolPublicRescueEntryItem) => {
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: getSchoolManualEvidenceKindForPublicRoute(item.route.id),
      title: item.label,
      detail: `${item.detail} | 保存：${item.save} | ${item.route.openHint} | 打开入口后补真实字段。`,
      url: item.route.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromUnknownEntry = (entry: UnknownSchoolEntryPackItem) => {
    const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(entry);
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: getSchoolManualEvidenceKindForUnknownEntry(entry.category),
      title: entry.label,
      detail: captureTemplate.detail,
      url: entry.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromOfficialEntry = (entry: SchoolOfficialLink) => {
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: getSchoolManualEvidenceKindForOfficialLink(entry.kind),
      title: getSchoolOfficialLinkShortLabel(entry),
      detail: `${entry.note} | 打开官网入口后补年份、数字、专业归属、企业名或岗位要求。`,
      url: entry.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromUnknownPublicDocument = (item: UnknownSchoolPublicDocumentMatrixItem) => {
    const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(item);
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: item.evidenceKind,
      title: item.label,
      detail: captureTemplate.detail,
      url: item.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromUnknownSourceTask = (task: UnknownSchoolOfficialSourceTask) => {
    const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(task);
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: task.evidenceKind,
      title: task.label,
      detail: captureTemplate.detail,
      url: task.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromUnknownAuthorityEntry = (entry: UnknownSchoolAuthorityEntrance) => {
    const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(entry);
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: entry.evidenceKind,
      title: entry.label,
      detail: captureTemplate.detail,
      url: entry.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const fillDraftFromUnknownRecipe = (recipe: UnknownSchoolOfficialSiteRecipe) => {
    const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate({
      ...recipe,
      source: "官网站内追查",
      saveFields: [recipe.saveHint],
    });
    setManualEvidenceDraft((current) => ({
      ...current,
      kind: recipe.evidenceKind,
      title: recipe.label,
      detail: captureTemplate.detail,
      url: recipe.url,
    }));
    openSchoolEvidenceInboxFoldout();
  };
  const removeManualEvidence = (id: string) => {
    setManualEvidenceItems((current) => current.filter((item) => item.id !== id));
  };
  const applyStarterPreset = (preset: (typeof ordinarySchoolStarterPresets)[number]) => {
    onMajorQueryChange(preset.major);
    onJobQueryChange(preset.job);
  };
  const applyUnknownDirectionPreset = (preset: UnknownSchoolDirectionPreset) => {
    onMajorQueryChange(preset.majorName);
    onJobQueryChange(preset.jobName);
  };
  const focusSchoolDirectionInputs = () => {
    document.querySelector<HTMLInputElement>("#school-public-query-box input")?.focus({ preventScroll: true });
  };
  const openCareerRadarForCurrentDirection = () => {
    const radarQuery = targetJobQuery || targetMajorQuery;
    if (!radarQuery) {
      focusSchoolDirectionInputs();
      return;
    }
    onOpenCareerRadar?.({
      schoolName: targetSchoolName,
      majorName: targetMajorQuery,
      jobName: targetJobQuery,
      query: radarQuery,
    });
  };

  return (
    <article className="school-public-access-panel">
      <SchoolWorkbenchSchoolSwitch
        schoolName={targetSchoolName}
        schoolQuery={schoolQuery}
        knownSchool={Boolean(selectedSchool)}
        visibleSchoolCount={visibleSchoolCount}
        quickEntries={unknownFastEntries}
        officialEntries={knownFastEntries}
        onUseOfficialEntry={fillDraftFromOfficialEntry}
        onUseUnknownEntry={fillDraftFromUnknownEntry}
        onSchoolQueryChange={onSchoolQueryChange}
      />

      {!selectedSchool && unknownPublicEntranceDirectory.length > 0 && (
        <UnknownSchoolHierarchicalEntranceDirectory groups={unknownPublicEntranceDirectory} />
      )}

      {!selectedSchool && unknownPublicAccessMapItems.length > 0 && (
        <UnknownSchoolPublicAccessMap
          items={unknownPublicAccessMapItems}
          officialDomain={unknownOfficialDomain}
          authorityEntries={unknownAuthorityEntrances}
          packetText={unknownPacketText}
          copyState={unknownCopyState}
          showPacketText={showUnknownPacketText}
          onOfficialDomainChange={setUnknownOfficialDomain}
          onCopyPacket={copyUnknownPacket}
          onUseAuthorityEntry={fillDraftFromUnknownAuthorityEntry}
          onUseTemplate={fillDraftFromUnknownPublicDocument}
        />
      )}

      {unknownSchoolTypeStrategy && <UnknownSchoolTypeStrategyCard strategy={unknownSchoolTypeStrategy} />}

      <SchoolPublicRescueEntryStrip routes={publicSourceRoutes} onUseTemplate={fillDraftFromRescueRoute} />

      <div className="school-public-query-box" id="school-public-query-box">
        <label>
          <span>专业 / 学院</span>
          <input
            value={majorQuery}
            onChange={(event) => onMajorQueryChange(event.target.value)}
            placeholder="例如：会计学、护理学、网络工程"
          />
        </label>
        <label>
          <span>目标岗位</span>
          <input
            value={jobQuery}
            onChange={(event) => onJobQueryChange(event.target.value)}
            placeholder="例如：电商运营、审计助理、安全工程师"
          />
        </label>
        <div className="school-public-quick-majors" aria-label="常见专业快速填充">
          {quickMajors.map((major) => (
            <button key={major} type="button" onClick={() => onMajorQueryChange(major)}>
              {major}
            </button>
          ))}
        </div>
      </div>

      {!selectedSchool && unknownDirectionPresets.length > 0 && (
        <UnknownSchoolDirectionPresetStrip
          presets={unknownDirectionPresets}
          onApplyPreset={applyUnknownDirectionPreset}
        />
      )}

      <SchoolOfficialEntryStrip routes={publicSourceRoutes} officialLinks={selectedSchool?.officialLinks ?? []} />

      <SchoolRescueActionRunway
        runway={rescueActionRunway}
        onOpenEvidenceInbox={openSchoolEvidenceInboxFoldout}
        onSaveCandidate={saveCurrentCandidateFromRescueBrief}
        onCopyPacket={copyInfoPacket}
      />

      <SchoolRescueTakeawayCard
        takeaway={rescueTakeaway}
        copyState={copyState}
        onCopyPacket={copyInfoPacket}
        onOpenEvidenceInbox={openSchoolEvidenceInboxFoldout}
      />

      <SchoolOfficialEntranceLauncher cards={officialEntranceCards} onUseTemplate={fillDraftFromEntranceCard} />

      <SchoolLookupSummaryStrip cards={lookupSummaryCards} />

      <SchoolEvidenceGapPriorityStrip slots={evidenceGapPrioritySlots} onOpenEvidenceInbox={openSchoolEvidenceInboxFoldout} />

      <SchoolEvidenceSlotStrip slots={evidenceSlotCards} />

      <SchoolLookupActionQueue tasks={lookupActionQueue} onUseEvidenceTaskTemplate={fillDraftFromEvidenceTask} />

      <SchoolEvidenceRescueBrief
        readiness={evidenceReadiness}
        aggregationBrief={evidenceAggregationBrief}
        coverage={manualEvidenceCoverage}
        candidateCount={candidates.length}
        onOpenEvidenceInbox={openSchoolEvidenceInboxFoldout}
        onOpenCareerRadar={openCareerRadarForCurrentDirection}
        onSaveCandidate={saveCurrentCandidateFromRescueBrief}
      />

      {!selectedSchool && unknownEntryPack.length > 0 && (
        <UnknownSchoolEvidenceWorkbench
          schoolName={targetSchoolName}
          majorName={targetMajorQuery}
          jobName={targetJobQuery}
          officialDomain={unknownOfficialDomain}
          entries={unknownEntryPack}
          guide={unknownEvidenceGuide}
          evidenceItems={manualEvidenceItems}
          packetText={unknownPacketText}
          copyState={unknownCopyState}
          showPacketText={showUnknownPacketText}
          onOfficialDomainChange={setUnknownOfficialDomain}
          onCopyPacket={copyUnknownPacket}
          onUseEntryTemplate={fillDraftFromUnknownEntry}
          onUseSourceTaskTemplate={fillDraftFromUnknownSourceTask}
          onUseMatrixTemplate={fillDraftFromUnknownPublicDocument}
          onUseRecipeTemplate={fillDraftFromUnknownRecipe}
        />
      )}

      <SchoolNextActionBar
        nextAction={nextAction}
        copyState={copyState}
        onCopyPacket={copyInfoPacket}
        onFocusDirection={focusSchoolDirectionInputs}
      />

      <SchoolOrdinaryDecisionBrief
        readiness={evidenceReadiness}
        candidate={currentCandidate}
        nextAction={nextAction}
        salaryLabel={marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : ""}
        companyCount={companyCards.length}
        onOpenCareerRadar={openCareerRadarForCurrentDirection}
        onFocusDirection={focusSchoolDirectionInputs}
      />

      <SchoolCareerRadarBridge
        schoolName={targetSchoolName}
        majorName={targetMajorQuery}
        jobName={targetJobQuery}
        onOpen={openCareerRadarForCurrentDirection}
        onFocusDirection={focusSchoolDirectionInputs}
      />

      <details className="school-supporting-source-drawer">
        <summary>
          <span>更多入口和核验说明</span>
          <strong>路线图 / 专业入口 / 证据结论</strong>
        </summary>
        <div className="school-supporting-source-drawer-body">
          <SchoolEvidenceReadinessPanel readiness={evidenceReadiness} />

          <SchoolPublicSourceRoutePanel routes={publicSourceRoutes} />

          <SchoolPublicMajorAccessPanel entries={publicMajorAccessEntries} />

          <SchoolPrimaryActionFlow
            knownSchool={Boolean(selectedSchool)}
            entryCount={publicMajorAccessEntries.length}
            officialEntryCount={publicMajorOfficialCount}
            majorName={targetMajorQuery}
            jobName={targetJobQuery}
            salaryLabel={marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : ""}
            companyCount={companyCards.length}
            copyState={copyState}
            onCopyPacket={copyInfoPacket}
          />

          <div className="school-public-access-head">
            <div>
              <p className="eyebrow">公开资料入口</p>
              <h3>{selectedSchool ? `${selectedSchool.name}：官方入口 + 可核验字段` : `${targetSchoolName}：先找入口，再聚合判断`}</h3>
              <span>
                不要求学校先在库里。补一个专业或目标岗位后，先查官方入口，再用市场薪资和企业官网岗位做反向判断。
              </span>
            </div>
            <div className="school-public-access-status">
              <strong>{selectedSchool ? "已命中样本" : "未收录也能查"}</strong>
              <em>
                {exactOfficialCount
                  ? `${exactOfficialCount} 个官方直达 · ${evidenceCount > 0 ? `${evidenceCount} 个报告源` : "报告源待接入"}`
                  : "生成 6 个检索入口"}
              </em>
            </div>
          </div>

          <SchoolActionCommandPanel command={actionCommand} />
        </div>
      </details>

      <div className="school-starter-preset-panel">
        <div>
          <p className="eyebrow">普通学校常见起步方向</p>
          <h4>不知道岗位怎么填，先从这些方向启动。</h4>
        </div>
        <div className="school-starter-preset-grid">
          {ordinarySchoolStarterPresets.map((preset) => (
            <button key={`${preset.major}-${preset.job}`} type="button" onClick={() => applyStarterPreset(preset)}>
              <span>{preset.label}</span>
              <strong>{preset.major} → {preset.job}</strong>
              <em>{preset.note}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="school-public-section-stack">
        <SchoolPublicFoldout
          title="证据核验"
          kicker="Step 02"
          summary="就业率、就业报告、校招企业这些不是首屏结论，需要点开逐项核。"
          metric={`${verifiedReportCount > 0 ? `${verifiedReportCount} 个报告源` : "报告源待接入"} · ${campusRecruitingLeads.length} 个校招线索 · ${manualEvidenceItems.length} 条自存`}
        >
          <div className="school-public-decision-grid">
            <section>
              <span>薪资代理</span>
              <strong>{marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "补专业/岗位"}</strong>
              <em>{marketProfile ? `${marketProfile.group} · ${marketProfile.riskLevel}` : "不填专业就不展示薪资判断"}</em>
            </section>
            <section>
              <span>可反查岗位</span>
              <strong>{marketProfile ? marketProfile.roles.slice(0, 2).join(" / ") : "先定方向"}</strong>
              <em>{marketProfile ? marketProfile.roles.slice(2, 4).join(" / ") : "输入岗位后可跳到职业雷达"}</em>
            </section>
            <section>
              <span>第一年要验证</span>
              <strong>{marketProfile ? marketProfile.firstYearChecks[0] : "真实课程 + 真实岗位"}</strong>
              <em>{marketProfile ? marketProfile.portfolioSignals.slice(0, 2).join(" / ") : "不要只看学校宣传页"}</em>
            </section>
          </div>

          <SchoolEvidenceGapPanel
            candidate={currentCandidate}
            tasks={evidenceTasks}
            onUseEvidenceTaskTemplate={fillDraftFromEvidenceTask}
          />

          <SchoolEvidenceInboxPanel
            items={manualEvidenceItems}
            draft={manualEvidenceDraft}
            coverage={manualEvidenceCoverage}
            aggregationBrief={evidenceAggregationBrief}
            schoolName={targetSchoolName}
            majorName={targetMajorQuery}
            jobName={targetJobQuery}
            officialDomain={unknownOfficialDomain}
            onDraftChange={setManualEvidenceDraft}
            onAdd={addManualEvidence}
            onAddParsedEvidenceItems={addParsedEvidenceItems}
            onRemove={removeManualEvidence}
          />

          <SchoolCampusRecruitingLeadPanel leads={campusRecruitingLeads} />
        </SchoolPublicFoldout>

        <SchoolPublicFoldout
          title="企业与薪资"
          kicker="Step 03"
          summary="公司官网岗位和薪资代理放这里，避免默认把企业卡片铺满一屏。"
          metric={marketProfile ? `${formatMonthlyRange(marketProfile.starterMonthlyK)} · ${companyCards.length || "待"} 家企业` : "补方向后生成"}
        >
          <div className="school-public-company-panel">
            <div>
              <p className="eyebrow">企业官网入口</p>
              <h4>{marketProfile ? "按当前专业/岗位推荐公司入口" : "输入专业或岗位后显示公司入口"}</h4>
            </div>
            {companyCards.length > 0 ? (
              <div className="school-public-company-grid">
                {companyCards.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    className={`school-public-company-card ${selectedSchoolCompany?.id === source.id ? "active" : ""}`}
                    onClick={() => setSelectedSchoolCompanyId(source.id)}
                  >
                    <CompanySourceLogoMark source={source} />
                    <div>
                      <strong>{source.name}</strong>
                      <span>{source.adapterStatus === "live-adapter" ? "已接样本" : "官网入口"}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="school-public-company-empty">
                {marketProfile
                  ? "当前方向没有命中已接企业官网；先从就业报告、医院/机构名单和校招日历查真实去向。"
                  : "先填专业或目标岗位，再打开对应公司官网看校招、实习和薪资口径。"}
                </p>
              )}
            {selectedSchoolCompany && (
              <SchoolCompanyDetailPanel
                company={selectedSchoolCompany}
                marketProfile={marketProfile}
                majorName={targetMajorQuery}
                jobName={targetJobQuery}
              />
            )}
          </div>

          <div className="school-info-packet-panel">
            <div className="school-info-packet-head">
              <div>
                <p className="eyebrow">可带走的信息包</p>
                <h4>把公开入口、薪资代理和核验动作合成一份清单。</h4>
                <span>适合复制到备忘录、发给家长或自己继续查；里面只写入口和代理判断，不伪装成学校官方结论。</span>
              </div>
              <button type="button" onClick={copyInfoPacket}>
                {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制信息包"}
              </button>
            </div>

            <div className="school-info-packet-grid">
              <section>
                <span>学校</span>
                <strong>{targetSchoolName}</strong>
                <em>{selectedSchool ? "已有官方入口样本" : "未收录，走公开检索"}</em>
              </section>
              <section>
                <span>方向</span>
                <strong>{targetMajorQuery || targetJobQuery || "待填写"}</strong>
                <em>{targetMajorQuery && targetJobQuery ? `${targetMajorQuery} → ${targetJobQuery}` : "补专业或岗位后判断更准"}</em>
              </section>
              <section>
                <span>薪资</span>
                <strong>{marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "待生成"}</strong>
                <em>{marketProfile ? `${marketProfile.group} 市场代理` : "不填方向不显示代理薪资"}</em>
              </section>
              <section>
                <span>企业</span>
                <strong>{companyCards.length ? `${companyCards.length} 个入口` : "待生成"}</strong>
                <em>{companyCards.length ? companyCards.slice(0, 3).map((company) => company.name).join(" / ") : "补方向后显示公司官网"}</em>
              </section>
            </div>

            <div className="school-info-packet-preview">
              {infoPacketPreviewLines.map((line, index) => (
                <span key={`${line}-${index}`}>{line || " "}</span>
              ))}
            </div>
            {showInfoPacketText && (
              <textarea
                className="school-info-packet-copybox"
                value={infoPacketText}
                readOnly
                aria-label="信息包复制失败时的手动复制文本"
              />
            )}
          </div>
        </SchoolPublicFoldout>

        <SchoolPublicFoldout
          title="保存与继续比较"
          kicker="Step 04"
          summary="把候选专业保存起来，再打开通用搜索入口继续查。"
          metric={`${candidates.length} 个候选 · ${links.length} 个搜索入口`}
          foldoutId="candidate-compare"
        >
          <SchoolCandidateComparePanel
            readiness={evidenceReadiness}
            currentCandidate={currentCandidate}
            candidates={candidates}
            onAdd={addCurrentCandidate}
            onRemove={removeCandidate}
            onClear={() => setCandidates([])}
          />

          <div className="school-access-link-grid">
            {links.map((link) => (
              <a key={`${link.source}-${link.label}`} href={link.url} target="_blank" rel="noreferrer">
                <span>{link.priority}</span>
                <strong>{link.label}</strong>
                <em>{link.source}</em>
                <p>{link.description}</p>
              </a>
            ))}
          </div>

          <div className="school-access-playbook" aria-label="学校信息聚合步骤">
            {[
              ["01", "先定专业", "从招生网或专业设置页确认这个学校到底开哪些专业。"],
              ["02", "再看出口", "找就业质量报告里的去向落实率、行业流向、升学比例。"],
              ["03", "查校招", "就业信息网和宣讲会日历能看每年哪些企业来过。"],
              ["04", "回到岗位", "把目标岗位丢进职业雷达，看哪些专业关联更强、薪资更高。"],
            ].map(([step, title, desc]) => (
              <section key={step}>
                <b>{step}</b>
                <strong>{title}</strong>
                <span>{desc}</span>
              </section>
            ))}
          </div>
        </SchoolPublicFoldout>
      </div>
    </article>
  );
}

function UnknownSchoolPublicAccessMap({
  items,
  officialDomain,
  authorityEntries,
  packetText,
  copyState,
  showPacketText,
  onOfficialDomainChange,
  onCopyPacket,
  onUseAuthorityEntry,
  onUseTemplate,
}: {
  items: UnknownSchoolPublicDocumentMatrixItem[];
  officialDomain: string;
  authorityEntries: UnknownSchoolAuthorityEntrance[];
  packetText: string;
  copyState: "idle" | "copied" | "failed";
  showPacketText: boolean;
  onOfficialDomainChange: (value: string) => void;
  onCopyPacket: () => void;
  onUseAuthorityEntry: (entry: UnknownSchoolAuthorityEntrance) => void;
  onUseTemplate: (item: UnknownSchoolPublicDocumentMatrixItem) => void;
}) {
  if (!items.length) return null;

  const normalizedOfficialDomain = extractUnknownSchoolOfficialDomain(officialDomain);
  const hasOfficialDomain = Boolean(normalizedOfficialDomain);
  const copyLabel = copyState === "copied" ? "已复制入口包" : copyState === "failed" ? "复制失败，展开文本" : "复制 7 类入口包";

  return (
    <section className="unknown-school-public-access-map" aria-label="未收录学校公开入口地图">
      <div className="unknown-school-public-access-map-head">
        <div>
          <span>公开入口地图</span>
          <strong>先开这些入口，不需要等平台收录完整数据。</strong>
          <em>每个入口都是搜索口令：先找官网、招生、就业报告和双选会，再把有效页面存进证据槽。</em>
          <div className="unknown-school-public-access-map-head-actions">
            <button type="button" onClick={onCopyPacket}>
              {copyLabel}
            </button>
            <small>复制后可直接逐条打开搜索或交给人工核验。</small>
          </div>
        </div>
        <label className="unknown-school-public-access-domain">
          <span>官网域名</span>
          <input
            value={officialDomain}
            onChange={(event) => onOfficialDomainChange(event.target.value)}
            placeholder="例：school.edu.cn / https://www.school.edu.cn"
          />
          <em>{hasOfficialDomain ? `已识别 site:${normalizedOfficialDomain}` : "粘贴官网网址后，入口卡会解锁站内查。"}</em>
        </label>
      </div>
      {showPacketText && (
        <textarea
          aria-label="first-screen public entry packet"
          className="unknown-school-public-access-copybox"
          readOnly
          value={packetText}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      {authorityEntries.length > 0 && (
        <div className="unknown-school-authority-entry-strip" aria-label="官方公共库验真入口">
          {authorityEntries.map((entry) => {
            const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(entry);
            return (
              <article key={entry.id} className="unknown-school-authority-entry-card" data-evidence-kind={entry.evidenceKind}>
                <a href={entry.url} target="_blank" rel="noreferrer">
                  <span>{entry.badge}</span>
                  <strong>{entry.label}</strong>
                  <em>{entry.source}</em>
                  <p>{entry.detail}</p>
                  <code>{entry.query}</code>
                </a>
                <div className="unknown-school-capture-fields" aria-label={`${entry.label} 采集字段`}>
                  {captureTemplate.fields.slice(0, 5).map((field) => (
                    <b key={`${entry.id}-${field}`}>{field}</b>
                  ))}
                </div>
                <div className="unknown-school-authority-entry-actions">
                  <button type="button" onClick={() => onUseAuthorityEntry(entry)}>
                    填到证据箱
                  </button>
                  <small>打开后补原文</small>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="unknown-school-public-access-map-grid">
        {items.map((item) => {
          const captureTemplate = buildUnknownSchoolEvidenceCaptureTemplate(item);
          return (
            <article key={item.id} className="unknown-school-public-access-map-card">
              <a href={item.url} target="_blank" rel="noreferrer">
                <span>{String(item.priority).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <em>{item.proofTarget}</em>
                <code>{item.query}</code>
              </a>
              <div className="unknown-school-capture-fields" aria-label={`${item.label} 采集字段`}>
                {captureTemplate.fields.slice(0, 5).map((field) => (
                  <b key={`${item.id}-${field}`}>{field}</b>
                ))}
              </div>
              <div className="unknown-school-public-access-map-actions">
                <button type="button" onClick={() => onUseTemplate(item)}>
                  存到证据槽
                </button>
                {hasOfficialDomain ? (
                  <a href={item.siteUrl} target="_blank" rel="noreferrer">
                    站内查
                  </a>
                ) : (
                  <small>先填官网域名</small>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function UnknownSchoolTypeStrategyCard({ strategy }: { strategy: UnknownSchoolTypeStrategy }) {
  return (
    <section className="unknown-school-type-strategy-card" aria-label="未收录学校类型策略">
      <div className="unknown-school-type-strategy-main">
        <span>{strategy.confidenceLabel}</span>
        <strong>{strategy.label}</strong>
        <em>{strategy.firstMove}</em>
        <p>{strategy.reason}</p>
      </div>
      <div className="unknown-school-type-strategy-focus">
        <span>优先查</span>
        {strategy.searchFocus.map((focus) => (
          <b key={focus}>{focus}</b>
        ))}
      </div>
      <div className="unknown-school-type-strategy-warning">
        <span>别踩坑</span>
        {strategy.warnings.map((warning) => (
          <em key={warning}>{warning}</em>
        ))}
      </div>
      <div className="unknown-school-type-strategy-evidence">
        <span>证据槽</span>
        {strategy.evidenceIds.map((evidenceId) => (
          <b key={evidenceId}>{getUnknownSchoolStrategyEvidenceLabel(evidenceId)}</b>
        ))}
      </div>
    </section>
  );
}

function getUnknownSchoolStrategyEvidenceLabel(evidenceId: UnknownSchoolTypeStrategy["evidenceIds"][number]) {
  if (evidenceId === "major-catalog") return "专业目录";
  if (evidenceId === "admissions") return "招生专业";
  if (evidenceId === "report") return "就业报告";
  if (evidenceId === "campus") return "到校企业";
  return "岗位薪资";
}

function UnknownSchoolDirectionPresetStrip({
  presets,
  onApplyPreset,
}: {
  presets: UnknownSchoolDirectionPreset[];
  onApplyPreset: (preset: UnknownSchoolDirectionPreset) => void;
}) {
  if (!presets.length) return null;

  return (
    <section className="unknown-school-direction-presets" aria-label="未收录学校可试专业方向">
      <div className="unknown-school-direction-presets-head">
        <div>
          <span>可试方向</span>
          <strong>先按学校类型生成专业和岗位关键词。</strong>
          <em>点一下填入上方输入框，再打开学校官网专业目录、招生简章和就业报告核验。</em>
        </div>
      </div>
      <div className="unknown-school-direction-preset-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="unknown-school-direction-preset-card"
            onClick={() => onApplyPreset(preset)}
            aria-label={`${preset.majorName} 到 ${preset.jobName}`}
          >
            <span>{preset.label}</span>
            <strong>
              {preset.majorName} -&gt; {preset.jobName}
            </strong>
            <em>{preset.reason}</em>
            <small>{preset.disclaimer}</small>
            <b>
              {preset.queryHints.slice(0, 3).map((hint) => (
                <i key={`${preset.id}-${hint}`}>{hint}</i>
              ))}
            </b>
          </button>
        ))}
      </div>
    </section>
  );
}

function SchoolEvidenceGapPriorityStrip({
  slots,
  onOpenEvidenceInbox,
}: {
  slots: SchoolEvidenceSlotCard[];
  onOpenEvidenceInbox: () => void;
}) {
  const headline = slots.length ? "先补这些证据" : "四槽已可判断";
  const detail = slots.length
    ? "按顺序补齐下面几类证据，再看就业率、企业和薪资结论。"
    : "专业、报告、企业和薪资入口已经有可用线索，可以进入候选对比。";

  return (
    <section className="school-evidence-gap-priority-strip" aria-label="证据缺口优先级">
      <div className="school-evidence-gap-priority-head">
        <span>证据缺口</span>
        <strong>{slots.length ? "先补这些证据" : "四槽已可判断"}</strong>
        <em>{detail}</em>
      </div>
      <div className="school-evidence-gap-priority-grid">
        {slots.length ? (
          slots.map((slot) => (
            <article key={slot.id} className="school-evidence-gap-priority-card">
              <span>{slot.label}</span>
              <strong>{slot.status}</strong>
              <em>{slot.source}</em>
              <p>{slot.detail}</p>
              <div className="school-evidence-gap-priority-actions">
                <button type="button" onClick={onOpenEvidenceInbox}>
                  补证据
                </button>
                {slot.url ? (
                  <a href={slot.url} target="_blank" rel="noreferrer">
                    打开入口
                  </a>
                ) : (
                  <small>先从公开入口地图查</small>
                )}
              </div>
            </article>
          ))
        ) : (
          <article className="school-evidence-gap-priority-card is-ready">
            <span>可进入判断</span>
            <strong>{headline}</strong>
            <em>继续补强年份、来源和岗位细节，避免把宣传口径当结论。</em>
            <p>普通学校的信息聚合靠证据闭环，不靠单一榜单或 logo 墙。</p>
            <div className="school-evidence-gap-priority-actions">
              <button type="button" onClick={onOpenEvidenceInbox}>
                继续补强
              </button>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

function SchoolLookupActionQueue({
  tasks,
  onUseEvidenceTaskTemplate,
}: {
  tasks: SchoolEvidenceTask[];
  onUseEvidenceTaskTemplate: (task: SchoolEvidenceTask) => void;
}) {
  return (
    <section className="school-lookup-action-queue" aria-label="当前三步行动">
      <div>
        <span>现在就做</span>
        <strong>{tasks.length ? "按顺序打开前三个来源" : "四类证据已覆盖"}</strong>
      </div>
      {tasks.map((task, index) => {
        const taskKey = getSchoolEvidenceTaskKey(task);

        return (
          <article key={taskKey} className="school-lookup-action-card">
            <a href={task.url} target="_blank" rel="noreferrer">
              <span>
                {String(index + 1).padStart(2, "0")} / {getSchoolEvidenceTaskStatusLabel(task.status)}
              </span>
              <strong>{task.label}</strong>
              <em>{task.source}</em>
            </a>
            <button type="button" onClick={() => onUseEvidenceTaskTemplate(task)}>
              粘贴证据
            </button>
          </article>
        );
      })}
    </section>
  );
}

function SchoolLookupSummaryStrip({
  cards,
}: {
  cards: readonly {
    id: string;
    label: string;
    value: string;
    detail: string;
    state: "ready" | "missing" | "proxy";
  }[];
}) {
  return (
    <section className="school-lookup-summary-strip" aria-label="学校检索结果摘要">
      {cards.map((card) => (
        <article key={card.id} className={`school-lookup-summary-card ${card.state}`}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <em>{card.detail}</em>
        </article>
      ))}
    </section>
  );
}

function SchoolEvidenceSlotStrip({ slots }: { slots: SchoolEvidenceSlotCard[] }) {
  return (
    <section className="school-evidence-slot-strip" aria-label="四类证据槽">
      <div>
        <span>证据槽</span>
        <strong>先补齐这四类</strong>
      </div>
      {slots.map((slot) => {
        const cardClassName = `school-evidence-slot-card ${slot.isCovered ? "is-covered" : "is-missing"}`;
        const cardContent = (
          <>
            <span>{slot.isCovered ? "已定位" : "待补"}</span>
            <strong>{slot.label}</strong>
            <em>{slot.status}</em>
            <small>{slot.source}</small>
            <p>{slot.detail}</p>
          </>
        );

        return slot.url ? (
          <a key={slot.id} href={slot.url} target="_blank" rel="noreferrer" className={cardClassName}>
            {cardContent}
          </a>
        ) : (
          <article key={slot.id} className={cardClassName}>
            {cardContent}
          </article>
        );
      })}
    </section>
  );
}

function SchoolRescueActionRunway({
  runway,
  onOpenEvidenceInbox,
  onSaveCandidate,
  onCopyPacket,
}: {
  runway: SchoolRescueActionRunway;
  onOpenEvidenceInbox: () => void;
  onSaveCandidate: () => void;
  onCopyPacket: () => void;
}) {
  const stepNumberLabels: Record<SchoolRescueActionRunway["steps"][number]["id"], string> = {
    entry: "01",
    evidence: "02",
    salary: "03",
    compare: "04",
  };
  const handlePrimaryAction = () => {
    if (runway.primaryAction === "open-evidence") {
      onOpenEvidenceInbox();
      return;
    }
    if (runway.primaryAction === "save-candidate") {
      onSaveCandidate();
      return;
    }
    onCopyPacket();
  };

  return (
    <section className="school-rescue-action-runway" aria-label="普通学校信息聚合步骤">
      <div className="school-rescue-action-runway-head">
        <div>
          <p className="eyebrow">下一步</p>
          <h4>{runway.title}</h4>
          <span>{runway.summary}</span>
        </div>
        <button type="button" onClick={handlePrimaryAction}>
          {runway.primaryLabel}
        </button>
      </div>
      <div className="school-rescue-action-runway-steps">
        {runway.steps.map((step) => (
          <article key={step.id} className={`school-rescue-action-step ${step.status}`}>
            <b>{stepNumberLabels[step.id]}</b>
            <div>
              <span>{step.label}</span>
              <strong>{step.metric}</strong>
              <em>{step.hint}</em>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchoolRescueTakeawayCard({
  takeaway,
  copyState,
  onCopyPacket,
  onOpenEvidenceInbox,
}: {
  takeaway: SchoolRescueTakeaway;
  copyState: "idle" | "copied" | "failed";
  onCopyPacket: () => void;
  onOpenEvidenceInbox: () => void;
}) {
  return (
    <section className="school-rescue-takeaway-card" aria-label="普通学校可带走救援包">
      <div className="school-rescue-takeaway-head">
        <div>
          <p className="eyebrow">{takeaway.statusLabel}</p>
          <h4>{takeaway.title}</h4>
          <span>{takeaway.warning}</span>
        </div>
        <div className="school-rescue-takeaway-actions">
          <button type="button" onClick={onCopyPacket}>
            {copyState === "copied" ? "已复制" : copyState === "failed" ? "手动复制" : takeaway.primaryLabel}
          </button>
          <button type="button" onClick={onOpenEvidenceInbox}>
            {takeaway.secondaryLabel}
          </button>
        </div>
      </div>
      <div className="school-rescue-takeaway-chips">
        {takeaway.chips.map((chip) => (
          <section key={chip.id}>
            <span>{chip.label}</span>
            <strong>{chip.value}</strong>
          </section>
        ))}
      </div>
      <div className="school-rescue-takeaway-lines">
        {takeaway.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  );
}

function SchoolOfficialEntryStrip({
  routes,
  officialLinks,
}: {
  routes: SchoolPublicSourceRoute[];
  officialLinks: SchoolOfficialLink[];
}) {
  const directRouteIds: SchoolPublicSourceRoute["id"][] = [
    "chsi-school-library",
    "school-admissions-major",
    "school-major-plan",
    "chsi-major-library",
    "school-employment-report",
    "school-career-center",
  ];
  const directRoutes = directRouteIds
    .map((id) => routes.find((route) => route.id === id))
    .filter((route): route is SchoolPublicSourceRoute => Boolean(route));
  const officialDirectEntries = [...officialLinks]
    .sort((left, right) => getSchoolOfficialLinkKindRank(left.kind) - getSchoolOfficialLinkKindRank(right.kind))
    .map((official) => ({
      key: `official-${official.kind}-${official.url}`,
      url: official.url,
      badge: "官网直达",
      label: getSchoolOfficialLinkShortLabel(official),
      authority: getSchoolOfficialLinkAuthority(official.kind),
      hint: official.note,
      trustLevel: "official" as SchoolPublicSourceRoute["trustLevel"],
      dedupeKey: `${official.kind}-${official.url}`,
    }));
  const routeEntries = directRoutes.map((route) => ({
    key: `route-${route.id}`,
    url: route.url,
    badge: getSchoolPublicSourceRouteTrustLabel(route.trustLevel),
    label: getSchoolOfficialEntryShortLabel(route),
    authority: route.authority,
    hint: route.openHint,
    trustLevel: route.trustLevel,
    dedupeKey: route.id,
  }));
  const directEntries = dedupeSchoolOfficialEntryCards([...officialDirectEntries, ...routeEntries]).slice(0, 6);

  return (
    <section className="school-official-entry-strip" aria-label="学校公开资料直达入口">
      <div className="school-official-entry-strip-head">
        <span>先点入口</span>
        <strong>{directEntries.length} 个公开来源</strong>
      </div>
      <div className="school-official-entry-grid">
        {directEntries.map((entry) => (
          <a
            key={entry.key}
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            className={`school-official-entry-card source-route-${entry.trustLevel}`}
            title={entry.hint}
          >
            <span>{entry.badge}</span>
            <strong>{entry.label}</strong>
            <em>{entry.authority}</em>
          </a>
        ))}
      </div>
    </section>
  );
}

function SchoolOfficialEntranceLauncher({
  cards,
  onUseTemplate,
}: {
  cards: SchoolOfficialEntranceLauncherCard[];
  onUseTemplate: (card: SchoolOfficialEntranceLauncherCard) => void;
}) {
  if (!cards.length) return null;

  return (
    <section className="school-official-entrance-launcher" aria-label="学校专业和就业公开资料入口">
      <div className="school-official-entrance-launcher-head">
        <div>
          <span>4 个入口先点</span>
          <strong>不用等平台全量收录，先从公开入口拿证据。</strong>
        </div>
        <em>专业、招生、就业报告、到校企业</em>
      </div>
      <div className="school-official-entrance-grid">
        {cards.map((card, index) => (
          <article
            key={`${card.slot}-${card.type}-${card.url}`}
            className={`school-official-entrance-card entrance-${card.slot} entrance-${card.type}`}
          >
            <a href={card.url} target="_blank" rel="noreferrer">
              <span>{String(index + 1).padStart(2, "0")} · {getSchoolOfficialEntranceSlotLabel(card.slot)}</span>
              <strong>{card.title}</strong>
              <em>{card.label} · {card.source}</em>
              <p>{card.detail}</p>
              <b className="school-official-entrance-save">保存：{card.saveHint}</b>
            </a>
            <code className="school-official-entrance-template">{card.copyTemplate}</code>
            <div className="school-official-entrance-actions">
              <button type="button" onClick={() => onUseTemplate(card)}>
                填到证据箱
              </button>
              <span>打开原始入口后补真实字段</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getSchoolOfficialEntranceSlotLabel(slot: SchoolOfficialEntranceLauncherCard["slot"]) {
  if (slot === "major") return "专业";
  if (slot === "admissions") return "招生";
  if (slot === "report") return "就业";
  return "校招";
}

function getSchoolManualEvidenceKindForEntranceSlot(
  slot: SchoolOfficialEntranceLauncherCard["slot"],
): SchoolManualEvidenceKind {
  if (slot === "report") return "report";
  if (slot === "campus") return "campus";
  return "major";
}

function getSchoolManualEvidenceKindForUnknownEntry(
  category: UnknownSchoolEntryPackItem["category"],
): SchoolManualEvidenceKind {
  if (category === "report") return "report";
  if (category === "campus") return "campus";
  if (category === "employment") return "campus";
  if (category === "salary") return "salary";
  return "major";
}

function getSchoolManualEvidenceKindForOfficialLink(kind: SchoolOfficialLink["kind"]): SchoolManualEvidenceKind {
  if (kind === "report") return "report";
  if (kind === "employment") return "campus";
  return "major";
}

function dedupeSchoolOfficialEntryCards<T extends { dedupeKey: string; url: string }>(entries: T[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.dedupeKey}-${entry.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getSchoolOfficialLinkKindRank(kind: SchoolOfficialLink["kind"]) {
  if (kind === "school") return 0;
  if (kind === "admissions") return 1;
  if (kind === "major-catalog") return 2;
  if (kind === "report") return 3;
  return 4;
}

function getSchoolOfficialLinkShortLabel(official: SchoolOfficialLink) {
  if (official.kind === "school") return "学校官网";
  if (official.kind === "admissions") return "招生入口";
  if (official.kind === "major-catalog") return "专业目录";
  if (official.kind === "report") return "就业报告";
  return "就业入口";
}

function getSchoolOfficialLinkAuthority(kind: SchoolOfficialLink["kind"]) {
  if (kind === "employment") return "学校就业网";
  if (kind === "admissions") return "学校招生网";
  if (kind === "report") return "学校信息公开";
  return "学校官网";
}

function getSchoolOfficialEntryShortLabel(route: SchoolPublicSourceRoute) {
  if (route.id === "chsi-school-library") return "院校库";
  if (route.id === "school-admissions-major") return "招生专业";
  if (route.id === "school-major-plan") return "培养方案";
  if (route.id === "chsi-major-library") return "专业库";
  if (route.id === "school-employment-report") return "就业报告";
  return "宣讲会";
}

function UnknownSchoolHierarchicalEntranceDirectory({
  groups,
}: {
  groups: UnknownSchoolPublicEntranceDirectoryGroup[];
}) {
  if (!groups.length) return null;

  return (
    <section className="unknown-school-hierarchical-directory" aria-label="公开资料分级目录">
      <div className="unknown-school-hierarchical-directory-head">
        <div>
          <span>公开资料分级目录</span>
          <strong>先按一级类目找入口，再点二级公开栏目。</strong>
        </div>
        <em>只打开 HTTPS · 官网/权威优先 · 搜索结果需核验</em>
      </div>
      <div className="unknown-school-directory-security" aria-label="外链安全审查">
        <span>安全审查</span>
        <strong>外链统一新窗口打开，不自动抓取、不注入脚本；检索页只当入口，不能直接当证据。</strong>
      </div>
      <div className="unknown-school-directory-level-one">
        {groups.map((group, index) => (
          <details
            key={group.id}
            className={`unknown-school-directory-group entrance-${group.id}`}
            open={index < 2}
          >
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{group.label}</strong>
              <em>{group.entries.length} 个二级入口</em>
            </summary>
            <p>{group.summary}</p>
            <div className="unknown-school-directory-save-fields">
              {group.saveFields.slice(0, 5).map((field) => (
                <b key={`${group.id}-${field}`}>{field}</b>
              ))}
            </div>
            <div className="unknown-school-directory-entry-list">
              {group.entries.map((entry) => (
                <a
                  key={entry.id}
                  className={`unknown-school-directory-entry entrance-trust-${entry.trustLevel}`}
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  title={entry.query}
                >
                  <b>{getUnknownSchoolEntranceTrustLabel(entry.trustLevel)}</b>
                  <span>{entry.label}</span>
                  <strong>{entry.source}</strong>
                  <em>{entry.detail}</em>
                  <small>{getUnknownSchoolExternalLinkSafetyLabel(entry)}</small>
                </a>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function UnknownSchoolEvidenceWorkbench({
  schoolName,
  majorName,
  jobName,
  officialDomain,
  entries,
  guide,
  evidenceItems,
  packetText,
  copyState,
  showPacketText,
  onOfficialDomainChange,
  onCopyPacket,
  onUseEntryTemplate,
  onUseSourceTaskTemplate,
  onUseMatrixTemplate,
  onUseRecipeTemplate,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  officialDomain: string;
  entries: UnknownSchoolEntryPackItem[];
  guide: UnknownSchoolEvidenceGuideStep[];
  evidenceItems: SchoolManualEvidenceItem[];
  packetText: string;
  copyState: "idle" | "copied" | "failed";
  showPacketText: boolean;
  onOfficialDomainChange: (value: string) => void;
  onCopyPacket: () => void;
  onUseEntryTemplate: (entry: UnknownSchoolEntryPackItem) => void;
  onUseSourceTaskTemplate: (task: UnknownSchoolOfficialSourceTask) => void;
  onUseMatrixTemplate: (item: UnknownSchoolPublicDocumentMatrixItem) => void;
  onUseRecipeTemplate: (recipe: UnknownSchoolOfficialSiteRecipe) => void;
}) {
  const priorityEntries = [
    entries.find((entry) => entry.id === "school-official"),
    entries.find((entry) => entry.id === "admissions"),
    entries.find((entry) => entry.id === "major-catalog"),
    entries.find((entry) => entry.id === "employment"),
  ].filter((entry): entry is UnknownSchoolEntryPackItem => Boolean(entry));
  const officialSiteRecipes = buildUnknownSchoolOfficialSiteRecipes({
    schoolName,
    majorName,
    jobName,
    officialDomain,
  });
  const publicDocumentMatrix = buildUnknownSchoolPublicDocumentMatrix({
    schoolName,
    majorName,
    jobName,
    officialDomain,
  });
  const publicEntranceDirectory = buildUnknownSchoolPublicEntranceDirectory({
    schoolName,
    majorName,
    jobName,
    officialDomain,
  });
  const sourceTasks = buildUnknownSchoolOfficialSourceTaskFlow({
    schoolName,
    majorName,
    jobName,
    officialDomain,
  });
  const sourceTaskProgress = buildUnknownSchoolSourceTaskProgress({
    tasks: sourceTasks,
    items: evidenceItems,
  });
  const normalizedOfficialDomain = extractUnknownSchoolOfficialDomain(officialDomain);
  const packetPreviewLines = buildUnknownSchoolEntryPacketPreviewLines(packetText);

  return (
    <section className="unknown-school-evidence-workbench" aria-label="未收录学校证据工作台">
      <div className="unknown-school-evidence-workbench-head">
        <div>
          <p className="eyebrow">未收录学校也能查</p>
          <h4>{schoolName}：先拿入口，再判断专业和工资</h4>
          <span>普通学校不要等平台收录全量资料。先打开公开入口，保存证据，再回到岗位和薪资做反查。</span>
        </div>
        <button type="button" onClick={onCopyPacket}>
          {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制查询包"}
        </button>
      </div>
      {showPacketText && (
        <textarea
          aria-label="未知学校查询包文本"
          className="unknown-school-packet-copybox"
          readOnly
          value={packetText}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}

      <div className="unknown-school-evidence-priority-grid">
        <strong>先点这 4 个</strong>
        {priorityEntries.map((entry) => (
          <a key={entry.id} href={entry.url} target="_blank" rel="noreferrer">
            <span>{getUnknownSchoolEntryCategoryLabel(entry.category)}</span>
            <b>{entry.label}</b>
            <em>{entry.source}</em>
          </a>
        ))}
      </div>

      <UnknownSchoolPublicEntranceDirectory groups={publicEntranceDirectory} />

      <UnknownSchoolSourceTaskFlow
        tasks={sourceTasks}
        taskProgress={sourceTaskProgress}
        onUseTemplate={onUseSourceTaskTemplate}
      />

      <UnknownSchoolPublicDocumentMatrix items={publicDocumentMatrix} onUseTemplate={onUseMatrixTemplate} />

      <div className="unknown-school-official-recipes" aria-label="官网站内追查口令">
        <div>
          <strong>官网域名确认后</strong>
          <span>把官网域名替换进这些口令，直接追专业、报告、宣讲会和信息公开。</span>
        </div>
        <label className="unknown-school-official-domain">
          <span>官网域名</span>
          <input
            value={officialDomain}
            onChange={(event) => onOfficialDomainChange(event.target.value)}
            placeholder="例如：www.zkvtc.edu.cn"
          />
          <em>打开学校官网后，把地址栏域名粘到这里；下方 site: 口令会自动替换。</em>
          {normalizedOfficialDomain && (
            <strong className="unknown-school-domain-detected">已识别 site:{normalizedOfficialDomain}</strong>
          )}
        </label>
        <div>
          {officialSiteRecipes.map((recipe) => (
            <article key={recipe.id} className="unknown-school-official-recipe-card">
              <a href={recipe.url} target="_blank" rel="noreferrer">
                <span className={`unknown-school-recipe-slot slot-${recipe.evidenceKind}`}>{recipe.evidenceLabel}</span>
                <span>{recipe.target}</span>
                <strong>{recipe.label}</strong>
                <code>{recipe.query}</code>
                <em>{recipe.detail}</em>
                <small>{recipe.saveHint}</small>
              </a>
              <div className="unknown-school-template-actions">
                <button type="button" onClick={() => onUseRecipeTemplate(recipe)}>
                  填到证据箱
                </button>
                <span>打开站内结果后补真实字段</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="unknown-school-evidence-entry-grid" aria-label="未收录学校完整公开入口包">
        {entries.map((entry) => (
          <article key={entry.id} className="unknown-school-entry-card">
            <a href={entry.url} target="_blank" rel="noreferrer">
              <span>{getUnknownSchoolEntryCategoryLabel(entry.category)}</span>
              <strong>{entry.label}</strong>
              <em>{entry.source}</em>
              <p>{entry.detail}</p>
            </a>
            <div className="unknown-school-template-actions">
              <button type="button" onClick={() => onUseEntryTemplate(entry)}>
                填到证据箱
              </button>
              <span>先当入口，补原文后再保存</span>
            </div>
          </article>
        ))}
      </div>

      <div className="unknown-school-evidence-rules">
        {guide.map((step) => (
          <details key={step.id}>
            <summary>
              <b>{String(step.order).padStart(2, "0")}</b>
              <span>
                <strong>{step.title}</strong>
                <em>{step.acceptedEvidence}</em>
              </span>
            </summary>
            <dl>
              <dt>不要算</dt>
              <dd>{step.rejectIf}</dd>
              <dt>下一步</dt>
              <dd>{step.nextAction}</dd>
            </dl>
          </details>
        ))}
      </div>

      <div className="unknown-school-evidence-packet" aria-label="未知学校查询包预览">
        {packetPreviewLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    </section>
  );
}

function UnknownSchoolPublicEntranceDirectory({
  groups,
}: {
  groups: UnknownSchoolPublicEntranceDirectoryGroup[];
}) {
  if (!groups.length) return null;

  return (
    <section className="unknown-school-public-entrance-directory" aria-label="普通学校公开入口目录">
      <div className="unknown-school-public-entrance-head">
        <div>
          <span>公开入口目录</span>
          <strong>不用等数据库全量收录，先按 5 类公开入口查。</strong>
        </div>
        <em>{groups.length} 类入口</em>
      </div>
      <div className="unknown-school-public-entrance-grid">
        {groups.map((group) => (
          <article key={group.id} className={`unknown-school-public-entrance-card entrance-${group.id}`}>
            <div className="unknown-school-public-entrance-card-head">
              <span>{group.label}</span>
              <strong>{group.primaryAction}</strong>
              <p>{group.summary}</p>
            </div>
            <div className="unknown-school-public-entrance-save-fields">
              {group.saveFields.slice(0, 5).map((field) => (
                <b key={`${group.id}-${field}`}>{field}</b>
              ))}
            </div>
            <div className="unknown-school-public-entrance-links">
              {group.entries.map((entry) => (
                <a
                  key={entry.id}
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`entrance-trust-${entry.trustLevel}`}
                  title={entry.query}
                >
                  <b>{getUnknownSchoolEntranceTrustLabel(entry.trustLevel)}</b>
                  <span>{entry.label}</span>
                  <em>{entry.source}</em>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getUnknownSchoolEntranceTrustLabel(trustLevel: UnknownSchoolPublicEntranceDirectoryGroup["entries"][number]["trustLevel"]) {
  if (trustLevel === "official") return "官网";
  if (trustLevel === "authority") return "权威";
  return "检索";
}

function getUnknownSchoolExternalLinkSafetyLabel(entry: UnknownSchoolPublicEntranceDirectoryGroup["entries"][number]) {
  if (!entry.url.startsWith("https://")) return "风险：非 HTTPS，不建议打开";
  if (entry.trustLevel === "official") return "HTTPS 官网入口，仍需核对域名主体";
  if (entry.trustLevel === "authority") return "HTTPS 权威平台入口，可优先核验";
  return "HTTPS 检索入口，打开后只保存官网原文";
}

function UnknownSchoolSourceTaskFlow({
  tasks,
  taskProgress,
  onUseTemplate,
}: {
  tasks: UnknownSchoolOfficialSourceTask[];
  taskProgress: UnknownSchoolSourceTaskProgressItem[];
  onUseTemplate: (task: UnknownSchoolOfficialSourceTask) => void;
}) {
  if (!tasks.length) return null;
  const progressByTaskId = new Map(taskProgress.map((progress) => [progress.task.id, progress]));
  const progressSummary = summarizeUnknownSchoolSourceTaskProgress(taskProgress);

  return (
    <section className="unknown-school-source-task-flow" aria-label="普通学校证据任务流">
      <div className="unknown-school-source-task-flow-head">
        <div>
          <span>普通学校证据任务流</span>
          <strong>别让用户面对一堆入口，按 5 个证据任务查。</strong>
        </div>
        <em>学校主体 → 专业存在 → 就业报告 → 到校企业 → 岗位薪资</em>
      </div>
      <div className="unknown-school-source-task-summary">
        <div>
          <span>当前下一步</span>
          <strong>{progressSummary.headline}</strong>
          <p>{progressSummary.nextAction}</p>
          {progressSummary.warning && <em>{progressSummary.warning}</em>}
        </div>
        <div className="unknown-school-source-task-summary-stats">
          <b>{progressSummary.doneCount}/{progressSummary.totalCount}</b>
          <span>已完成</span>
          <small>{progressSummary.needsFieldsCount} 弱证据 · {progressSummary.missingCount} 缺口</small>
        </div>
        <div className="unknown-school-source-task-meter" aria-label={`证据任务完成度 ${progressSummary.percentComplete}%`}>
          <span style={{ width: `${progressSummary.percentComplete}%` }} />
        </div>
      </div>
      <div className="unknown-school-source-task-list">
        {tasks.map((task) => {
          const progress = progressByTaskId.get(task.id) ?? {
            task,
            status: "missing",
            statusLabel: "缺证据",
            detail: `还缺：${task.saveFields.slice(0, 3).join(" / ")}。`,
            matchedTitle: "",
          };
          return (
            <article key={task.id} className={`unknown-school-source-task-card task-status-${progress.status}`}>
              <a href={task.url} target="_blank" rel="noreferrer">
                <b>{String(task.order).padStart(2, "0")}</b>
                <small className="unknown-school-source-task-status">{progress.statusLabel}</small>
                <span>{task.stage}</span>
                <strong>{task.label}</strong>
                <em>{task.source}</em>
                <p>{task.action}</p>
                <p>{progress.detail}</p>
              </a>
              <div className="unknown-school-source-task-fields">
                {task.saveFields.map((field) => (
                  <i key={`${task.id}-${field}`}>{field}</i>
                ))}
              </div>
              <div className="unknown-school-template-actions">
                <button type="button" onClick={() => onUseTemplate(task)}>
                  填到证据箱
                </button>
                <span>{task.purpose}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function UnknownSchoolPublicDocumentMatrix({
  items,
  onUseTemplate,
}: {
  items: UnknownSchoolPublicDocumentMatrixItem[];
  onUseTemplate: (item: UnknownSchoolPublicDocumentMatrixItem) => void;
}) {
  if (!items.length) return null;

  return (
    <section className="unknown-school-public-document-matrix" aria-label="公开资料入口矩阵">
      <div className="unknown-school-public-document-head">
        <div>
          <span>公开资料入口矩阵</span>
          <strong>大部分学校官网都能查到专业、就业报告和到校招聘。</strong>
          <em>先按顺序打开入口，保存字段，再判断这个专业值不值得报。</em>
        </div>
      </div>
      <div className="unknown-school-public-document-grid">
        {items.map((item) => (
          <article key={item.id} className="unknown-school-public-document-card">
            <a href={item.url} target="_blank" rel="noreferrer">
              <span>{String(item.priority).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <em>{item.proofTarget}</em>
              <p>{item.openHint}</p>
              <code>{item.query}</code>
            </a>
            <div className="unknown-school-public-document-fields">
              {item.saveFields.map((field) => (
                <b key={`${item.id}-${field}`}>{field}</b>
              ))}
            </div>
            <div className="unknown-school-template-actions">
              <button type="button" onClick={() => onUseTemplate(item)}>
                填到证据箱
              </button>
              <span>{item.source}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchoolWorkbenchSchoolSwitch({
  schoolName,
  schoolQuery,
  knownSchool,
  visibleSchoolCount,
  quickEntries,
  officialEntries,
  onUseOfficialEntry,
  onUseUnknownEntry,
  onSchoolQueryChange,
}: {
  schoolName: string;
  schoolQuery: string;
  knownSchool: boolean;
  visibleSchoolCount: number;
  quickEntries: UnknownSchoolEntryPackItem[];
  officialEntries: SchoolOfficialLink[];
  onUseOfficialEntry: (entry: SchoolOfficialLink) => void;
  onUseUnknownEntry: (entry: UnknownSchoolEntryPackItem) => void;
  onSchoolQueryChange: (value: string) => void;
}) {
  const typedSchoolName = schoolQuery.trim();
  const visibleMatchLabel = typedSchoolName
    ? knownSchool
      ? `${visibleSchoolCount} 个已收录学校匹配`
      : "未收录也能查"
    : "先输入学校名";
  const statusDetail = knownSchool
    ? "已命中样本，继续打开专业目录、就业报告和校招入口。"
    : "直接生成公开检索入口包，不等数据库先收录。";

  return (
    <section className="school-workbench-school-switch" aria-label="学校切换与公开入口搜索">
      <div>
        <p className="eyebrow">先选学校</p>
        <strong>{schoolName}</strong>
        <span>学校专业目录、就业质量报告、就业信息网大多是公开资料。这里先给入口，再补专业和岗位判断。</span>
      </div>
      <label>
        <span>换学校</span>
        <input
          value={schoolQuery}
          onChange={(event) => onSchoolQueryChange(event.target.value)}
          placeholder="例：周口职业技术学院"
        />
      </label>
      <div className="school-workbench-school-switch-status">
        <strong>{visibleMatchLabel}</strong>
        <em>{statusDetail}</em>
      </div>
      {knownSchool && officialEntries.length > 0 && (
        <div className="school-workbench-fast-entry-strip official" aria-label="已收录学校官网入口快查">
          {officialEntries.map((entry) => (
            <article key={`${entry.kind}-${entry.url}`}>
              <a href={entry.url} target="_blank" rel="noreferrer" title={entry.note}>
                <span>{getSchoolOfficialLinkAuthority(entry.kind)}</span>
                <strong>{getSchoolOfficialLinkShortLabel(entry)}</strong>
                <em>{entry.note}</em>
              </a>
              <button type="button" onClick={() => onUseOfficialEntry(entry)}>
                填到证据箱
              </button>
            </article>
          ))}
        </div>
      )}
      {!knownSchool && quickEntries.length > 0 && (
        <div className="school-workbench-fast-entry-strip" aria-label="未收录学校七类入口快查">
          {quickEntries.map((entry) => (
            <article key={entry.id}>
              <a href={entry.url} target="_blank" rel="noreferrer">
                <span>{getUnknownSchoolEntryCategoryLabel(entry.category)}</span>
                <strong>{entry.label}</strong>
                <em>{entry.source}</em>
              </a>
              <button type="button" onClick={() => onUseUnknownEntry(entry)}>
                填到证据箱
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SchoolActionCommandPanel({ command }: { command: SchoolActionCommand }) {
  return (
    <div className="school-action-command-panel" aria-label="学校信息聚合行动台">
      <div className="school-action-command-summary">
        <div>
          <span>{command.statusLabel}</span>
          <h4>{command.title}</h4>
          <p>{command.summary}</p>
        </div>
        <section>
          <strong>{command.evidenceScore}</strong>
          <em>{command.evidenceLabel}</em>
        </section>
      </div>
      <div className="school-action-command-grid">
        {command.actions.map((action, index) => (
          <article key={action.id} className={`school-action-command-card ${action.tone}`}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <div>
              <strong>{action.label}</strong>
              <p>{action.detail}</p>
            </div>
            <span>{action.metric}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function SchoolOrdinaryDecisionBrief({
  readiness,
  candidate,
  nextAction,
  salaryLabel,
  companyCount,
  onOpenCareerRadar,
  onFocusDirection,
}: {
  readiness: SchoolEvidenceReadiness;
  candidate: SchoolInfoCandidate;
  nextAction: SchoolNextAction;
  salaryLabel: string;
  companyCount: number;
  onOpenCareerRadar: () => void;
  onFocusDirection: () => void;
}) {
  const canOpenRadar = Boolean(candidate.jobName || candidate.majorName);
  const radarActionLabel = canOpenRadar ? "去岗位雷达" : "先补岗位";
  const evidenceState =
    readiness.tier === "ready-to-compare" ? "可以进入正式对比" : readiness.tier === "can-screen" ? "只能先粗筛" : "先别比较";
  const missingSummary = readiness.missingKinds.length ? `还缺 ${readiness.missingKinds.slice(0, 3).join(" / ")}` : "四类证据已覆盖";
  const salarySummary = salaryLabel || candidate.salaryLabel;

  return (
    <section className="school-ordinary-decision-brief" aria-label="普通院校决策摘要">
      <article className="school-ordinary-decision-card action">
        <span>先做什么</span>
        <strong>{nextAction.title}</strong>
        <em>{nextAction.statusLabel} · {evidenceState}</em>
      </article>
      <article className="school-ordinary-decision-card warning">
        <span>怎么判断</span>
        <strong>别只看学校名</strong>
        <em>{missingSummary}，用入口证据压住主观印象。</em>
      </article>
      <article className="school-ordinary-decision-card">
        <span>工资口径</span>
        <strong>{salarySummary}</strong>
        <em>{companyCount ? `${companyCount} 个企业入口可继续核验` : "不是学校官方结论，先补岗位再查公司入口"}</em>
      </article>
      <button type="button" onClick={canOpenRadar ? onOpenCareerRadar : onFocusDirection}>
        {radarActionLabel}
      </button>
    </section>
  );
}

function SchoolCareerRadarBridge({
  schoolName,
  majorName,
  jobName,
  onOpen,
  onFocusDirection,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  onOpen: () => void;
  onFocusDirection: () => void;
}) {
  const radarQuery = jobName.trim() || majorName.trim();
  const isReady = Boolean(radarQuery);
  const actionLabel = isReady ? "去岗位雷达" : "先补岗位";

  return (
    <section className={`school-career-radar-bridge ${isReady ? "ready" : "missing"}`} aria-label="学校方向到岗位雷达">
      <div>
        <p className="eyebrow">岗位雷达</p>
        <h4>{isReady ? `用“${radarQuery}”反推专业关联强度` : "先填一个目标岗位，再看专业排名"}</h4>
        <span>
          {isReady
            ? `${schoolName} · ${majorName || "专业待补"} 会带入雷达，按关联强度从内到外排专业。`
            : "普通院校先拿入口，下一步要把岗位填上，才能反推哪些专业更贴近。"}
        </span>
      </div>
      <button type="button" onClick={isReady ? onOpen : onFocusDirection}>
        {actionLabel}
      </button>
    </section>
  );
}

function SchoolEvidenceRescueBrief({
  readiness,
  aggregationBrief,
  coverage,
  candidateCount,
  onOpenEvidenceInbox,
  onOpenCareerRadar,
  onSaveCandidate,
}: {
  readiness: SchoolEvidenceReadiness;
  aggregationBrief: SchoolEvidenceAggregationBrief;
  coverage: SchoolManualEvidenceCoverage;
  candidateCount: number;
  onOpenEvidenceInbox: () => void;
  onOpenCareerRadar: () => void;
  onSaveCandidate: () => void;
}) {
  const missingSlots = aggregationBrief.missingSlots.slice(0, 3);
  const missingLabel = missingSlots.length ? missingSlots.join(" / ") : "四类证据已覆盖";
  const nextAction = aggregationBrief.nextActions[0] ?? readiness.primaryAdvice;
  const canUseRadar = readiness.tier !== "not-ready" || coverage.coveredCount > 0;
  const candidateCountLabel = candidateCount ? `${candidateCount} 个候选` : "还没保存候选";

  return (
    <section className={`school-evidence-rescue-brief rescue-${aggregationBrief.status}`} aria-label="公开资料聚合判断">
      <div className="school-evidence-rescue-brief-head">
        <div>
          <p className="eyebrow">公开资料聚合判断</p>
          <h4>{readiness.title}</h4>
          <span>{aggregationBrief.statusLabel}</span>
        </div>
        <strong>
          {coverage.coveredCount}/{coverage.totalCount}
          <em>{coverage.nextMissingLabel}</em>
        </strong>
      </div>
      <div className="school-evidence-rescue-brief-grid">
        <section>
          <span>可采信</span>
          <strong>{aggregationBrief.confirmedLines.length}</strong>
          <em>{aggregationBrief.confirmedLines[0] ?? "先保存学校官网、就业网或企业官网原始链接。"}</em>
        </section>
        <section>
          <span>待复核</span>
          <strong>{aggregationBrief.leadLines.length}</strong>
          <em>{aggregationBrief.leadLines[0] ?? "搜索结果只能当入口，点进官方页后再保存。"}</em>
        </section>
        <section>
          <span>弱证据</span>
          <strong>{aggregationBrief.weakLines.length}</strong>
          <em>{aggregationBrief.weakLines.length ? "营销文、经验帖不能当正式结论。" : "暂时没有低可信来源。"}</em>
        </section>
        <section>
          <span>还差</span>
          <strong>{missingLabel}</strong>
          <em>{nextAction}</em>
        </section>
      </div>
      <div className="school-evidence-rescue-brief-actions">
        <button type="button" onClick={onOpenEvidenceInbox}>
          补证据
        </button>
        <button type="button" onClick={onSaveCandidate}>
          存入对比
        </button>
        <button type="button" onClick={onOpenCareerRadar} disabled={!canUseRadar}>
          去职业雷达
        </button>
        <small>{candidateCountLabel}</small>
      </div>
    </section>
  );
}

type SchoolPublicRescueEntrySpec = {
  routeId: SchoolPublicSourceRoute["id"];
  label: string;
  step: string;
  detail: string;
  save: string;
};

type SchoolPublicRescueEntryItem = SchoolPublicRescueEntrySpec & {
  route: SchoolPublicSourceRoute;
};

function SchoolPublicRescueEntryStrip({
  routes,
  onUseTemplate,
}: {
  routes: SchoolPublicSourceRoute[];
  onUseTemplate: (item: SchoolPublicRescueEntryItem) => void;
}) {
  const items: SchoolPublicRescueEntrySpec[] = [
    {
      routeId: "school-admissions-major",
      label: "专业入口",
      step: "01",
      detail: "先确认专业今年是否招生、在哪个学院和校区。",
      save: "专业名 / 学院 / 层次 / 招生年份",
    },
    {
      routeId: "school-employment-report",
      label: "就业报告",
      step: "02",
      detail: "找近两年就业率、升学率和行业去向。",
      save: "报告年份 / 就业率 / 升学率 / 去向",
    },
    {
      routeId: "school-career-center",
      label: "到校企业",
      step: "03",
      detail: "查宣讲会、双选会和招聘公告里的企业名单。",
      save: "日期 / 企业名 / 岗位 / 面向专业",
    },
    {
      routeId: "job-salary-proxy",
      label: "岗位薪资",
      step: "04",
      detail: "最后看企业官网岗位和薪资口径，不当学校结论。",
      save: "岗位 / 城市 / 薪资区间 / 来源",
    },
  ];
  const linkedItems = items
    .map((item) => ({
      ...item,
      route: routes.find((route) => route.id === item.routeId),
    }))
    .filter((item): item is SchoolPublicRescueEntryItem => Boolean(item.route));

  if (!linkedItems.length) return null;

  return (
    <section className="school-public-rescue-entry-strip" aria-label="普通学校救援入口">
      <div className="school-public-rescue-entry-head">
        <div>
          <span>普通学校救援入口</span>
          <strong>先打开这 4 个入口，不等平台全量收录。</strong>
        </div>
        <em>专业、就业、企业、薪资分开查</em>
      </div>
      <div className="school-public-rescue-entry-grid">
        {linkedItems.map((item) => (
          <article
            key={item.routeId}
            className={`school-public-rescue-entry-card route-${item.route.trustLevel}`}
          >
            <a href={item.route.url} target="_blank" rel="noreferrer" title={item.route.openHint}>
              <span>{item.step}</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
              <em>保存：{item.save}</em>
            </a>
            <div className="school-public-rescue-entry-actions">
              <button type="button" onClick={() => onUseTemplate(item)}>
                填到证据箱
              </button>
              <small>{getSchoolManualEvidenceKindLabel(getSchoolManualEvidenceKindForPublicRoute(item.route.id))}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getSchoolManualEvidenceKindForPublicRoute(routeId: SchoolPublicSourceRoute["id"]): SchoolManualEvidenceKind {
  if (routeId === "school-employment-report") return "report";
  if (routeId === "school-career-center") return "campus";
  if (routeId === "job-salary-proxy") return "salary";
  return "major";
}

function SchoolNextActionBar({
  nextAction,
  copyState,
  onCopyPacket,
  onFocusDirection,
}: {
  nextAction: SchoolNextAction;
  copyState: "idle" | "copied" | "failed";
  onCopyPacket: () => void;
  onFocusDirection: () => void;
}) {
  const buttonLabel = nextAction.kind === "copy-packet"
    ? copyState === "copied"
      ? "已复制"
      : copyState === "failed"
        ? "复制失败"
        : nextAction.primaryLabel
    : nextAction.primaryLabel;

  return (
    <section className={`school-next-action-bar next-${nextAction.kind}`} aria-label="下一步行动">
      <div>
        <p className="eyebrow">下一步只做这件事</p>
        <h4>{nextAction.title}</h4>
        <span>{nextAction.detail}</span>
      </div>
      <section>
        <b>{nextAction.statusLabel}</b>
        <em>{nextAction.evidenceTarget}</em>
        <small>{nextAction.secondaryLabel}</small>
      </section>
      {nextAction.url ? (
        <a href={nextAction.url} target="_blank" rel="noreferrer">
          {nextAction.primaryLabel}
        </a>
      ) : (
        <button type="button" onClick={nextAction.kind === "copy-packet" ? onCopyPacket : onFocusDirection}>
          {buttonLabel}
        </button>
      )}
    </section>
  );
}

function SchoolEvidenceReadinessPanel({ readiness }: { readiness: SchoolEvidenceReadiness }) {
  return (
    <section className={`school-evidence-readiness-panel readiness-${readiness.tier}`} aria-label="证据结论">
      <div>
        <p className="eyebrow">证据结论 · 能不能比较</p>
        <h4>{readiness.title}</h4>
        <span>{readiness.reason}</span>
      </div>
      <div className="school-evidence-readiness-kinds">
        <section>
          <b>已收</b>
          <p>{readiness.confirmedKinds.length ? readiness.confirmedKinds.join(" / ") : "暂无"}</p>
        </section>
        <section>
          <b>还缺</b>
          <p>{readiness.missingKinds.length ? readiness.missingKinds.join(" / ") : "四类证据齐了"}</p>
        </section>
      </div>
      <strong>
        {readiness.score}
        <em>{readiness.primaryAdvice}</em>
      </strong>
    </section>
  );
}

function SchoolPublicSourceRoutePanel({ routes }: { routes: SchoolPublicSourceRoute[] }) {
  const authorityOrOfficialCount = routes.filter((route) => route.trustLevel !== "proxy").length;
  const primaryRouteIds: SchoolPublicSourceRoute["id"][] = [
    "chsi-school-library",
    "school-admissions-major",
    "school-major-plan",
    "school-employment-report",
  ];
  const primaryRoutes = primaryRouteIds
    .map((id) => routes.find((route) => route.id === id))
    .filter((route): route is SchoolPublicSourceRoute => Boolean(route));
  const secondaryRoutes = routes.filter((route) => !primaryRouteIds.includes(route.id));
  const renderRouteCard = (route: SchoolPublicSourceRoute) => (
    <a
      key={route.id}
      href={route.url}
      target="_blank"
      rel="noreferrer"
      className={`source-route-${route.trustLevel}`}
      title={route.openHint}
    >
      <span>{getSchoolPublicSourceRouteTrustLabel(route.trustLevel)}</span>
      <strong>{route.label}</strong>
      <em>{route.authority}</em>
      <p>{route.target}</p>
      <b>保存：{route.saveFields.slice(0, 4).join(" / ")}</b>
    </a>
  );

  return (
    <section className="school-public-source-route-panel" aria-label="公开入口地图">
      <div className="school-public-source-route-head">
        <div>
          <p className="eyebrow">公开入口地图</p>
          <h4>每个学校都先走这些公开入口，不等平台收录完整数据库。</h4>
        </div>
        <strong>{authorityOrOfficialCount} 个权威/官网入口</strong>
      </div>
      <div className="school-public-source-route-grid">
        {primaryRoutes.map(renderRouteCard)}
      </div>
      {secondaryRoutes.length > 0 && (
        <details className="school-public-source-route-more">
          <summary>
            <span>更多入口</span>
            <b>{secondaryRoutes.map((route) => route.label).join(" / ")}</b>
          </summary>
          <div className="school-public-source-route-secondary-grid">
            {secondaryRoutes.map(renderRouteCard)}
          </div>
        </details>
      )}
    </section>
  );
}

function getSchoolPublicSourceRouteTrustLabel(trustLevel: SchoolPublicSourceRoute["trustLevel"]) {
  if (trustLevel === "authority") return "权威库";
  if (trustLevel === "official") return "官网";
  return "代理";
}

function SchoolPrimaryActionFlow({
  knownSchool,
  entryCount,
  officialEntryCount,
  majorName,
  jobName,
  salaryLabel,
  companyCount,
  copyState,
  onCopyPacket,
}: {
  knownSchool: boolean;
  entryCount: number;
  officialEntryCount: number;
  majorName: string;
  jobName: string;
  salaryLabel: string;
  companyCount: number;
  copyState: "idle" | "copied" | "failed";
  onCopyPacket: () => void;
}) {
  const directionLabel = majorName || jobName || "待补方向";
  const salaryState = salaryLabel || "补方向后生成";

  return (
    <div className="school-primary-action-flow" aria-label="学校信息聚合主操作流">
      <section className="school-primary-action-card ready">
        <b>01</b>
        <div>
          <span>{knownSchool ? `${officialEntryCount} 官方 / ${entryCount} 入口` : `${entryCount} 个公开入口`}</span>
          <strong>先打开入口</strong>
          <p>官网、招生、专业、就业报告和校招入口先过一遍。</p>
        </div>
      </section>
      <section className={majorName || jobName ? "school-primary-action-card ready" : "school-primary-action-card"}>
        <b>02</b>
        <div>
          <span>{directionLabel}</span>
          <strong>再补专业和岗位</strong>
          <p>方向补上后，页面才会生成薪资代理和企业官网入口。</p>
        </div>
      </section>
      <section className={salaryLabel ? "school-primary-action-card ready" : "school-primary-action-card"}>
        <b>03</b>
        <div>
          <span>{salaryState}{companyCount ? ` · ${companyCount} 家企业` : ""}</span>
          <strong>复制查询包</strong>
          <p>把入口、薪资代理和核验动作带走继续查。</p>
        </div>
        <button type="button" onClick={onCopyPacket}>
          {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制"}
        </button>
      </section>
    </div>
  );
}

function SchoolCompanyDetailPanel({
  company,
  marketProfile,
  majorName,
  jobName,
}: {
  company: OfficialCompanySource;
  marketProfile: MajorSalaryProfile | null;
  majorName: string;
  jobName: string;
}) {
  const source = company;
  const focusTags = source.focus.slice(0, 5);
  const salaryLabel = marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "补专业/岗位后生成";
  const roles = marketProfile?.roles.slice(0, 3) ?? [];
  const evidenceFields = [
    "官网岗位链接",
    "校招/实习入口",
    "岗位要求",
    "薪资口径",
  ];

  return (
    <section className="school-company-detail-panel" aria-label={`${company.name} 公司详情`}>
      <div className="school-company-detail-head">
        <CompanySourceLogoMark source={company} />
        <div>
          <span>{company.adapterStatus === "live-adapter" ? "已接官方样本" : "官方入口待 adapter"}</span>
          <h5>{company.name}</h5>
          <p>{company.domain}</p>
        </div>
      </div>
      <div className="school-company-detail-meta">
        <section>
          <span>薪资代理</span>
          <strong>{salaryLabel}</strong>
          <em>{marketProfile ? `${marketProfile.group} · 市场估算` : "不是学校官方结论"}</em>
        </section>
        <section>
          <span>当前方向</span>
          <strong>{majorName || jobName || "待填写"}</strong>
          <em>{roles.length ? roles.join(" / ") : "先补专业或目标岗位"}</em>
        </section>
      </div>
      <div className="school-company-detail-tags">
        {focusTags.map((tag) => (
          <span key={`${company.id}-${tag}`}>{tag}</span>
        ))}
      </div>
      <div className="school-company-detail-evidence">
        <b>点开官网后保存</b>
        <span>{evidenceFields.join(" / ")}</span>
      </div>
      <div className="school-company-detail-actions">
        <a href={company.careerUrl} target="_blank" rel="noreferrer">
          打开官网招聘
        </a>
        <em>先看岗位要求，再回到学校就业网核对是否到校招聘。</em>
      </div>
    </section>
  );
}

function SchoolPublicFoldout({
  title,
  kicker,
  summary,
  metric,
  foldoutId,
  children,
}: {
  title: string;
  kicker: string;
  summary: string;
  metric: string;
  foldoutId?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="school-public-foldout" data-school-foldout={foldoutId}>
      <summary>
        <div>
          <span>{kicker}</span>
          <strong>{title}</strong>
          <em>{summary}</em>
        </div>
        <b>{metric}</b>
      </summary>
      <div className="school-public-foldout-body">{children}</div>
    </details>
  );
}

function SchoolKnownDetailFoldout({
  title,
  summary,
  metric,
  children,
}: {
  title: string;
  summary: string;
  metric: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="school-public-foldout school-known-detail-foldout">
      <summary>
        <div>
          <span>已收录</span>
          <strong>{title}</strong>
          <em>{summary}</em>
        </div>
        <b>{metric}</b>
      </summary>
      <div className="school-public-foldout-body school-known-detail-foldout-body">{children}</div>
    </details>
  );
}

function SchoolPublicMajorAccessPanel({ entries }: { entries: SchoolPublicMajorAccessEntry[] }) {
  const officialCount = entries.filter((entry) => entry.type === "official").length;
  const searchCount = entries.length - officialCount;

  return (
    <div className="school-public-major-access-panel" aria-label="专业资料公开入口">
      <div className="school-public-major-access-head">
        <div>
          <p className="eyebrow">专业资料公开入口</p>
          <h4>先点这些入口，确认专业不是只看学校宣传。</h4>
        </div>
        <strong>{officialCount} 官方 / {searchCount} 检索</strong>
      </div>
      <div className="school-public-major-access-grid">
        {entries.map((entry) => (
          <a
            key={`${entry.type}-${entry.label}-${entry.url}`}
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            className={`major-access-${entry.type}`}
          >
            <span>{entry.category}</span>
            <strong>{entry.label}</strong>
            <em>{entry.source}</em>
            <p>{entry.detail}</p>
            <div className="school-public-major-access-action">
              <b>{entry.actionTitle}</b>
              <small>要找什么</small>
            </div>
            <div className="school-public-major-access-proof">
              <span>{entry.acceptedEvidence}</span>
            </div>
            <div className="school-public-major-access-template">
              <small>收件箱格式</small>
              <code>{entry.copyTemplate}</code>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function copyTextWithHiddenTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

async function copyTextToClipboard(text: string) {
  if (copyTextWithHiddenTextarea(text)) return;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some embedded browsers expose the Clipboard API but reject writes.
    }
  }

  if (!copyTextWithHiddenTextarea(text)) throw new Error("copy failed");
}

function SchoolEvidenceInboxPanel({
  items,
  draft,
  coverage,
  aggregationBrief,
  schoolName,
  majorName,
  jobName,
  officialDomain,
  onDraftChange,
  onAdd,
  onAddParsedEvidenceItems,
  onRemove,
}: {
  items: SchoolManualEvidenceItem[];
  draft: SchoolManualEvidenceDraft;
  coverage: SchoolManualEvidenceCoverage;
  aggregationBrief: SchoolEvidenceAggregationBrief;
  schoolName: string;
  majorName: string;
  jobName: string;
  officialDomain?: string;
  onDraftChange: React.Dispatch<React.SetStateAction<SchoolManualEvidenceDraft>>;
  onAdd: () => void;
  onAddParsedEvidenceItems: (items: ParsedSchoolEvidence[]) => void;
  onRemove: (id: string) => void;
}) {
  const [rawEvidenceText, setRawEvidenceText] = useState("");
  const [aggregationCopyState, setAggregationCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showAggregationBriefText, setShowAggregationBriefText] = useState(false);
  const outcomeSnapshot = buildSchoolEvidenceOutcomeSnapshot(items);
  const companyFollowups = buildSchoolEvidenceCompanyFollowups({
    majorName,
    jobName,
    items,
  });
  const parsedEvidenceItems = rawEvidenceText.trim()
    ? parseSchoolEvidenceTextBatch({
        schoolName,
        majorName,
        jobName,
        officialDomain,
        url: draft.url,
        text: rawEvidenceText,
      })
    : [];
  const parsedEvidence = parsedEvidenceItems[0] ?? (rawEvidenceText.trim()
    ? parseSchoolEvidenceText({
        schoolName,
        majorName,
        jobName,
        officialDomain,
        url: draft.url,
        text: rawEvidenceText,
      })
    : null);
  const canAdd = Boolean(draft.title.trim() || draft.detail.trim() || draft.url.trim());
  const fillDraftFromParsedEvidence = () => {
    if (!parsedEvidence) return;
    onDraftChange((current) => ({
      ...current,
      kind: parsedEvidence.kind,
      title: parsedEvidence.title,
      detail: `${parsedEvidence.detail}｜来源：${parsedEvidence.sourceTrust.label}｜${parsedEvidence.sourceTrust.warning}`,
      url: current.url || parsedEvidence.url,
    }));
  };
  const addAllParsedEvidenceItems = () => {
    onAddParsedEvidenceItems(parsedEvidenceItems.length ? parsedEvidenceItems : parsedEvidence ? [parsedEvidence] : []);
    setRawEvidenceText("");
  };
  const upgradeWeakEvidenceDraft = (
    item: SchoolManualEvidenceItem,
    promotionHint: NonNullable<ReturnType<typeof getSchoolEvidencePromotionHint>>,
  ) => {
    const missingFields = promotionHint.fields.join(" / ");
    const existingDetail = item.detail.trim();

    onDraftChange((current) => ({
      ...current,
      kind: item.kind,
      title: item.title,
      detail: existingDetail ? `${existingDetail}｜待补字段：${missingFields}` : `待补字段：${missingFields}`,
      url: item.url || current.url,
    }));
    document.querySelector<HTMLInputElement>(".school-evidence-inbox-form input")?.focus({ preventScroll: true });
  };
  const copyAggregationBrief = async () => {
    try {
      await copyTextToClipboard(aggregationBrief.copyText);
      setAggregationCopyState("copied");
      setShowAggregationBriefText(false);
    } catch {
      setAggregationCopyState("failed");
      setShowAggregationBriefText(true);
    }
  };

  return (
    <div className="school-evidence-inbox-panel" aria-label="本页证据收件箱">
      <div className="school-evidence-inbox-head">
        <div>
          <p className="eyebrow">本页证据收件箱</p>
          <h4>把官网链接、报告数字和企业线索先收进来。</h4>
          <span>只保存在当前页面，用来整理判断依据；不要把营销软文当成官方结论。</span>
        </div>
        <strong>
          {coverage.label}
          <em>{coverage.nextMissingLabel}</em>
        </strong>
      </div>

      <div className={`school-evidence-aggregation-brief brief-${aggregationBrief.status}`}>
        <div className="school-evidence-aggregation-head">
          <div>
            <p className="eyebrow">公开资料聚合简报</p>
            <h5>{aggregationBrief.title}</h5>
            <span>{aggregationBrief.statusLabel}</span>
          </div>
          <button type="button" onClick={copyAggregationBrief}>
            {aggregationCopyState === "copied" ? "已复制" : aggregationCopyState === "failed" ? "复制失败" : "复制聚合简报"}
          </button>
        </div>
        <div className="school-evidence-aggregation-grid">
          <section>
            <span>可采信证据</span>
            <strong>{aggregationBrief.confirmedLines.length}</strong>
            <em>{aggregationBrief.confirmedLines[0] ?? "先打开学校官网、就业网或企业官网保存原始链接。"}</em>
          </section>
          <section>
            <span>待复核线索</span>
            <strong>{aggregationBrief.leadLines.length}</strong>
            <em>{aggregationBrief.leadLines[0] ?? "搜索结果只能当入口，点进官方页面后再保存。"}</em>
          </section>
          <section>
            <span>弱证据</span>
            <strong>{aggregationBrief.weakLines.length}</strong>
            <em>{aggregationBrief.weakLines.length ? "弱证据不能当结论。" : "暂无营销软文或低可信来源。"}</em>
          </section>
          <section>
            <span>还缺</span>
            <strong>{aggregationBrief.missingSlots.length ? aggregationBrief.missingSlots.join(" / ") : "四类已覆盖"}</strong>
            <em>{aggregationBrief.nextActions[0]}</em>
          </section>
        </div>
        {showAggregationBriefText && (
          <textarea
            className="school-evidence-aggregation-copybox"
            value={aggregationBrief.copyText}
            readOnly
            aria-label="聚合简报复制失败时的手动复制文本"
          />
        )}
      </div>

      <SchoolEvidenceOutcomeSnapshotPanel snapshot={outcomeSnapshot} />

      <SchoolEvidenceCompanyFollowupPanel followups={companyFollowups} />

      <div className="school-evidence-inbox-kind-row" aria-label="证据类型">
        {schoolManualEvidenceKinds.map((kind) => (
          <button
            key={kind.id}
            type="button"
            aria-pressed={draft.kind === kind.id}
            onClick={() => onDraftChange((current) => ({ ...current, kind: kind.id }))}
          >
            <span>{kind.label}</span>
            <em>{kind.hint}</em>
          </button>
        ))}
      </div>

      <div className="school-evidence-parser-panel">
        <div className="school-evidence-parser-copy">
          <p className="eyebrow">文本证据解析</p>
          <h5>粘贴官网、报告或宣讲会文本</h5>
          <span>不用等平台全量收录。复制学校官网、就业报告或企业招聘页的一小段，先自动识别证据类型和关键数字。</span>
        </div>
        <textarea
          value={rawEvidenceText}
          onChange={(event) => setRawEvidenceText(event.target.value)}
          placeholder="粘贴官网、报告或宣讲会文本，例如：2024届毕业去向落实率、双选会企业名单、岗位月薪8-13K..."
          rows={4}
        />
        {parsedEvidence ? (
          <div className="school-evidence-parser-result">
            <div>
              <span>{getSchoolManualEvidenceKindLabel(parsedEvidence.kind)}</span>
              <strong>{parsedEvidence.title}</strong>
              <em>{parsedEvidence.confidence}% 可信度</em>
            </div>
            <div className={`school-evidence-source-trust trust-${parsedEvidence.sourceTrust.level}`}>
              <strong>{parsedEvidence.sourceTrust.label}</strong>
              <span>{parsedEvidence.sourceTrust.reason}</span>
              <em>{parsedEvidence.sourceTrust.warning}</em>
            </div>
            <p>{parsedEvidence.detail}</p>
            <div className="school-evidence-parser-tags">
              {parsedEvidence.metrics.map((metric) => (
                <b key={`${metric.label}-${metric.value}`}>{metric.label}{metric.value}</b>
              ))}
              {parsedEvidence.companies.slice(0, 5).map((company) => (
                <b key={company}>{company}</b>
              ))}
              {parsedEvidence.salaryRanges.map((range) => (
                <b key={range}>{range}</b>
              ))}
            </div>
            {parsedEvidenceItems.length > 1 && (
              <div className="school-evidence-parser-batch">
                <div>
                  <strong>识别到 {parsedEvidenceItems.length} 条证据</strong>
                  <span>可以一次收进本页，后面再逐条补链接和复核。</span>
                </div>
                <div className="school-evidence-parser-batch-list">
                  {parsedEvidenceItems.map((item) => (
                    <span key={`${item.kind}-${item.title}-${item.detail}`}>
                      <b>{getSchoolManualEvidenceKindLabel(item.kind)}</b>
                      <em>{item.title}</em>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="school-evidence-parser-actions">
              <button type="button" onClick={fillDraftFromParsedEvidence}>
                填入草稿
              </button>
              <button type="button" onClick={addAllParsedEvidenceItems}>
                {parsedEvidenceItems.length > 1 ? "批量收进本页" : "收进本页"}
              </button>
            </div>
          </div>
        ) : (
          <div className="school-evidence-parser-empty">
            <strong>粘贴一段文字后自动识别</strong>
            <span>能识别专业存在、就业报告、到校企业和岗位薪资四类证据。</span>
          </div>
        )}
      </div>

      <div className="school-evidence-inbox-form">
        <input
          value={draft.title}
          onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))}
          placeholder="证据标题，例如 2024 就业质量报告"
        />
        <input
          value={draft.url}
          onChange={(event) => onDraftChange((current) => ({ ...current, url: event.target.value }))}
          placeholder="官方链接或检索结果链接"
        />
        <textarea
          value={draft.detail}
          onChange={(event) => onDraftChange((current) => ({ ...current, detail: event.target.value }))}
          placeholder="摘录就业率、企业名、岗位、薪资口径等关键内容"
          rows={3}
        />
        <button type="button" onClick={onAdd} disabled={!canAdd}>
          收进本页
        </button>
      </div>

      {items.length > 0 ? (
        <div className="school-evidence-inbox-list">
          {items.map((item) => {
            const evidenceTrust = getSchoolEvidencePacketTrustLevel(item);
            const promotionHint = getSchoolEvidencePromotionHint(item);

            return (
              <article key={item.id}>
                <div>
                  <span>{getSchoolManualEvidenceKindLabel(item.kind)}</span>
                  <b
                    className={`school-evidence-saved-trust evidence-trust-${evidenceTrust}`}
                    aria-label={`证据信任等级：${getSchoolEvidencePacketTrustLabel(evidenceTrust)}`}
                  >
                    {getSchoolEvidencePacketTrustLabel(evidenceTrust)}
                  </b>
                  <button type="button" onClick={() => onRemove(item.id)}>移除</button>
                </div>
                <strong>{item.title}</strong>
                {item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a> : <em>还没填链接</em>}
                {item.detail && <p>{item.detail}</p>}
                <small className="school-evidence-saved-trust-hint">
                  {evidenceTrust === "weak" ? "弱证据不计入覆盖 · " : ""}
                  {getSchoolEvidencePacketTrustHint(evidenceTrust)}
                </small>
                {promotionHint && (
                  <div className="school-evidence-promotion-hint">
                    <strong>{promotionHint.label}</strong>
                    <span>{promotionHint.text}</span>
                    <div className="school-evidence-promotion-fields">
                      {promotionHint.fields.map((field) => (
                        <b key={field}>{field}</b>
                      ))}
                    </div>
                    <div className="school-evidence-promotion-actions">
                      <button type="button" onClick={() => upgradeWeakEvidenceDraft(item, promotionHint)}>
                        按缺字段回填
                      </button>
                      <small>补完原始事实后再收进本页，弱证据才会升级为可用线索。</small>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="school-evidence-inbox-empty">
          <strong>还没有自存证据</strong>
          <span>打开上面的入口后，把报告标题、就业率、到校企业名或岗位链接复制到这里。</span>
        </div>
      )}
    </div>
  );
}

function SchoolEvidenceOutcomeSnapshotPanel({ snapshot }: { snapshot: SchoolEvidenceOutcomeSnapshot }) {
  const cards = [
    snapshot.major,
    snapshot.employment,
    snapshot.recruiters,
    snapshot.salary,
  ];

  return (
    <div className="school-evidence-outcome-snapshot" aria-label="自存证据读数板">
      <div className="school-evidence-outcome-head">
        <div>
          <p className="eyebrow">自存证据读数板</p>
          <h5>把已保存证据翻译成用户能看的结果</h5>
          <span>专业证明、毕业去向、到校企业、工资线索分开显示；弱证据只做提醒，不进入读数。</span>
        </div>
      </div>
      <div className="school-evidence-outcome-grid">
        {cards.map((card) => (
          <section key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <em>{card.detail}</em>
            {card.items.length > 0 && (
              <div>
                {card.items.slice(0, 4).map((item) => (
                  <b key={item}>{item}</b>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      {snapshot.warnings.length > 0 && (
        <div className="school-evidence-outcome-warning">
          {snapshot.warnings.slice(0, 3).map((warning) => (
            <span key={warning}>{warning}</span>
          ))}
        </div>
      )}
      <textarea className="school-evidence-outcome-copy" value={snapshot.copyText} readOnly aria-label="自存证据读数文本" />
    </div>
  );
}

function SchoolEvidenceCompanyFollowupPanel({ followups }: { followups: SchoolEvidenceCompanyFollowup[] }) {
  if (!followups.length) {
    return (
      <div className="school-evidence-company-followup is-empty" aria-label="企业追踪">
        <div>
          <p className="eyebrow">企业追踪</p>
          <h5>保存到校企业名单后，这里会生成官网、岗位和薪资入口。</h5>
          <span>对普通学校尤其重要：先从校招名单找企业，再回到企业官网查岗位要求和工资口径。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="school-evidence-company-followup" aria-label="企业追踪">
      <div className="school-evidence-company-followup-head">
        <div>
          <p className="eyebrow">企业追踪</p>
          <h5>从到校企业继续查官网岗位和薪资</h5>
          <span>已知企业直达官方招聘入口；本地企业先走官网、岗位、薪资三条搜索入口。</span>
        </div>
        <strong>{followups.length} 家</strong>
      </div>
      <div className="school-evidence-company-followup-grid">
        {followups.map((followup) => (
          <article key={`${followup.name}-${followup.primaryUrl}`}>
            <div>
              <SchoolEvidenceCompanyLogo followup={followup} />
              <span>
                <strong>{followup.name}</strong>
                <em>{followup.type === "known-official" ? "官方企业入口" : "搜索线索入口"}</em>
              </span>
            </div>
            <p>{followup.evidenceTitle}</p>
            <div className="school-evidence-company-actions">
              <a href={followup.officialSearchUrl} target="_blank" rel="noreferrer">官网</a>
              <a href={followup.jobSearchUrl} target="_blank" rel="noreferrer">岗位</a>
              <a href={followup.salarySearchUrl} target="_blank" rel="noreferrer">薪资</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SchoolEvidenceCompanyLogo({ followup }: { followup: SchoolEvidenceCompanyFollowup }) {
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSrc = followup.logoSources[logoIndex] ?? "";
  const fallback = followup.name.slice(0, 2).toUpperCase();

  if (!logoSrc || followup.type === "search-lead") {
    return <span className="school-evidence-company-logo text-logo">{fallback}</span>;
  }

  return (
    <span className="school-evidence-company-logo">
      <img src={logoSrc} alt={`${followup.name} logo`} onError={() => setLogoIndex((index) => index + 1)} />
    </span>
  );
}

function getSchoolManualEvidenceCoverage(items: SchoolManualEvidenceItem[]): SchoolManualEvidenceCoverage {
  const trustedItems = items.filter((item) => getSchoolEvidencePacketTrustLevel(item) !== "weak");
  const weakCount = items.length - trustedItems.length;
  const coveredKinds = new Set(trustedItems.map((item) => item.kind));
  const coveredCount = coveredKinds.size;
  const missingKind = schoolManualEvidenceKinds.find((kind) => !coveredKinds.has(kind.id));

  return {
    coveredCount,
    totalCount: schoolManualEvidenceKinds.length,
    label: coveredCount ? `${coveredCount}/${schoolManualEvidenceKinds.length} 类可采信` : "还没收可采信证据",
    nextMissingLabel: weakCount
      ? `弱证据不计入覆盖 · 下一类：${missingKind?.label ?? "复核原始来源"}`
      : missingKind
        ? `下一类：${missingKind.label}`
        : "四类证据都有了",
  };
}

function getSchoolManualEvidenceKindLabel(kind: SchoolManualEvidenceKind) {
  return schoolManualEvidenceKinds.find((item) => item.id === kind)?.label ?? "证据";
}

function getSchoolEvidencePacketTrustLabel(trustLevel: ReturnType<typeof getSchoolEvidencePacketTrustLevel>) {
  if (trustLevel === "official") return "可采信";
  if (trustLevel === "lead") return "待复核线索";
  return "弱证据";
}

function getSchoolEvidencePacketTrustHint(trustLevel: ReturnType<typeof getSchoolEvidencePacketTrustLevel>) {
  if (trustLevel === "official") return "可计入覆盖和候选比较";
  if (trustLevel === "lead") return "先当线索，回到官方页复核后再下结论";
  return "不要当结论；回到学校官网、就业网或企业官网复核后再用";
}

function SchoolEvidenceGapPanel({
  candidate,
  tasks,
  onUseEvidenceTaskTemplate,
}: {
  candidate: SchoolInfoCandidate;
  tasks: SchoolEvidenceTask[];
  onUseEvidenceTaskTemplate: (task: SchoolEvidenceTask) => void;
}) {
  return (
    <div className="school-evidence-gap-panel">
      <div className="school-evidence-gap-head">
        <div>
          <p className="eyebrow">证据缺口</p>
          <h4>{candidate.evidenceLabel}</h4>
          <span>{candidate.evidenceNote}</span>
        </div>
        <strong>{candidate.evidenceScore}/100</strong>
      </div>

      <div className="school-evidence-gap-meter" aria-label={`证据完整度 ${candidate.evidenceScore}/100`}>
        <span style={{ width: `${candidate.evidenceScore}%` }} />
      </div>

      <div className="school-evidence-gap-grid">
        <section>
          <h5>已拿到</h5>
          <ul>
            {candidate.confirmedEvidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h5>还要补</h5>
          <ul>
            {candidate.missingEvidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="school-evidence-task-list">
        <div className="school-evidence-task-list-head">
          <div>
            <p className="eyebrow">下一步补证据</p>
            <h5>按顺序打开，不要跳过原始来源。</h5>
          </div>
          <span className="school-evidence-task-progress">
            证据箱自动计入 <strong>不能手动打勾</strong>
          </span>
        </div>
        <div className="school-evidence-task-grid">
          {tasks.map((task) => {
            const taskKey = getSchoolEvidenceTaskKey(task);

            return (
              <article key={taskKey}>
                <a href={task.url} target="_blank" rel="noreferrer">
                  <span className={`task-${task.status}`}>{getSchoolEvidenceTaskStatusLabel(task.status)}</span>
                  <strong>{task.label}</strong>
                  <em>{task.source}</em>
                  <p>{task.detail}</p>
                </a>
                <button type="button" onClick={() => onUseEvidenceTaskTemplate(task)}>
                  粘贴证据
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSchoolEvidenceTaskStatusLabel(status: SchoolEvidenceTask["status"]) {
  if (status === "verified") return "已定位";
  if (status === "open") return "直达";
  return "检索";
}

function SchoolCampusRecruitingLeadPanel({ leads }: { leads: SchoolCampusRecruitingLead[] }) {
  return (
    <div className="school-campus-lead-panel">
      <div className="school-campus-lead-head">
        <div>
          <p className="eyebrow">校招企业线索</p>
          <h4>先打开这些入口，再判断哪些企业真的来过。</h4>
        </div>
        <strong>{leads.length} 条</strong>
      </div>
      <div className="school-campus-lead-grid">
        {leads.map((lead) => (
          <a key={`${lead.label}-${lead.url}`} href={lead.url} target="_blank" rel="noreferrer" className={`campus-lead-${lead.type}`}>
            <span>{getCampusRecruitingLeadTypeLabel(lead.type)}</span>
            <strong>{lead.label}</strong>
            <em>{lead.source}</em>
            <p>{lead.detail}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function getCampusRecruitingLeadTypeLabel(type: SchoolCampusRecruitingLead["type"]) {
  if (type === "direct") return "学校直达";
  if (type === "report") return "报告核验";
  if (type === "company") return "企业补充";
  return "公开搜索";
}

function SchoolCandidateComparePanel({
  readiness,
  currentCandidate,
  candidates,
  onAdd,
  onRemove,
  onClear,
}: {
  readiness: SchoolEvidenceReadiness;
  currentCandidate: SchoolInfoCandidate;
  candidates: SchoolInfoCandidate[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}) {
  const addButtonLabel = readiness.tier === "not-ready" ? "先存草稿" : "加入当前方案";
  const [copyReportState, setCopyReportState] = useState<"idle" | "copied" | "failed">("idle");
  const [showReportText, setShowReportText] = useState(false);
  const compareReportText = buildSchoolCandidateCompareReport(candidates);
  const candidateVerdict = buildSchoolCandidateCompareVerdict(candidates);
  const copyCompareReport = async () => {
    try {
      await copyTextToClipboard(compareReportText);
      setCopyReportState("copied");
      setShowReportText(false);
    } catch {
      setCopyReportState("failed");
      setShowReportText(true);
    }
  };

  return (
    <div className="school-candidate-compare-panel">
      <div className="school-candidate-compare-head">
        <div>
          <p className="eyebrow">本页候选对比</p>
          <h4>把不同学校、专业、岗位放到一起看。</h4>
          <span>只在当前页面临时保留，不上传、不做后端存储；用于比较路径，不替代官方报告。</span>
        </div>
        <div className="school-candidate-report-actions">
          <button type="button" onClick={onAdd}>{addButtonLabel}</button>
          {candidates.length > 0 && (
            <button type="button" className="ghost" onClick={copyCompareReport}>
              {copyReportState === "copied" ? "已复制" : copyReportState === "failed" ? "复制失败" : "复制对比报告"}
            </button>
          )}
          {candidates.length > 0 && <button type="button" className="ghost" onClick={onClear}>清空</button>}
        </div>
      </div>
      {showReportText && candidates.length > 0 && (
        <textarea
          aria-label="候选对比报告文本"
          className="school-candidate-report-copybox"
          readOnly
          value={compareReportText}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}

      <div className={`school-candidate-readiness-gate ${readiness.tier}`}>
        <div>
          <p className="eyebrow">证据门槛</p>
          <strong>{readiness.title}</strong>
          <span>{readiness.primaryAdvice}</span>
        </div>
        <section>
          <b>{readiness.score}/100</b>
          <em>{readiness.reason}</em>
        </section>
        <div className="school-candidate-readiness-missing" aria-label="还缺的证据">
          {(readiness.missingKinds.length ? readiness.missingKinds : ["四类证据已覆盖"]).map((kind) => (
            <span key={kind}>{kind}</span>
          ))}
        </div>
      </div>

      <SchoolCandidateVerdictPanel verdict={candidateVerdict} />

      {candidates.length > 0 ? (
        <div className="school-candidate-table">
          {candidates.map((candidate) => (
            <article key={candidate.key}>
              <div>
                <span>{candidate.readinessTitle ?? candidate.evidenceLabel} · {candidate.evidenceScore}/100</span>
                <button type="button" onClick={() => onRemove(candidate.key)} aria-label={`移除 ${candidate.schoolName}`}>
                  移除
                </button>
              </div>
              <strong>{candidate.schoolName}</strong>
              <p>{candidate.majorName || "专业待补"} → {candidate.jobName || "岗位待补"}</p>
              <section>
                <b>{candidate.readinessTitle ?? candidate.evidenceLabel}</b>
                <em>{candidate.readinessAdvice ?? candidate.evidenceNote}</em>
              </section>
              <div className="school-candidate-evidence-snapshot">
                <div>
                  <span>公开资料聚合</span>
                  <strong>{candidate.aggregationStatusLabel ?? "暂未保存聚合简报"}</strong>
                </div>
                <div className="school-candidate-evidence-metrics" aria-label="候选证据快照">
                  <span>可采信 <b>{candidate.aggregationConfirmedCount ?? 0}</b></span>
                  <span>待复核 <b>{candidate.aggregationLeadCount ?? 0}</b></span>
                  <span>弱证据 <b>{candidate.aggregationWeakCount ?? 0}</b></span>
                </div>
                <div className="school-candidate-evidence-missing">
                  <span>缺口</span>
                  <em>{candidate.aggregationMissingSlots?.length ? candidate.aggregationMissingSlots.join(" / ") : "四类证据已覆盖"}</em>
                </div>
                <div className="school-candidate-evidence-missing">
                  <span>下一步</span>
                  <em>{candidate.aggregationNextAction ?? "继续打开原始来源复核细节。"}</em>
                </div>
                {candidate.nextEvidenceLabel && (
                  <div className="school-candidate-next-evidence">
                    <span>下一证据入口</span>
                    <strong>{candidate.nextEvidenceLabel}</strong>
                    <em>{candidate.nextEvidenceSource}</em>
                    <small>{candidate.nextEvidenceDetail}</small>
                    {candidate.nextEvidenceUrl && (
                      <a href={candidate.nextEvidenceUrl} target="_blank" rel="noreferrer">
                        打开入口
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="school-candidate-readiness-missing" aria-label="保存时还缺的证据">
                {(candidate.readinessMissingKinds?.length ? candidate.readinessMissingKinds : candidate.missingEvidence.slice(0, 3)).map((kind) => (
                  <span key={kind}>{kind}</span>
                ))}
              </div>
              <section>
                <b>{candidate.salaryLabel}</b>
                <em>{candidate.marketGroup}</em>
              </section>
              <section>
                <b>{candidate.companyNames.length ? candidate.companyNames.slice(0, 3).join(" / ") : "企业待生成"}</b>
                <em>{candidate.evidenceNote}</em>
              </section>
              <ul>
                {candidate.requiredActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <div className="school-candidate-empty">
          <strong>当前方案：{currentCandidate.schoolName}</strong>
          <span>{currentCandidate.majorName || "先补专业"} → {currentCandidate.jobName || "先补岗位"} · {currentCandidate.salaryLabel}</span>
        </div>
      )}
    </div>
  );
}

function SchoolCandidateVerdictPanel({ verdict }: { verdict: SchoolCandidateCompareVerdict }) {
  return (
    <div className="school-candidate-verdict-panel" aria-label="候选结论排序">
      <div className="school-candidate-verdict-head">
        <div>
          <p className="eyebrow">候选结论排序</p>
          <h5>{verdict.title}</h5>
          <span>{verdict.summary}</span>
        </div>
        <strong>{verdict.ranked.length ? `${verdict.ranked.length} 个候选` : "待保存"}</strong>
      </div>
      <div className="school-candidate-verdict-list">
        {verdict.ranked.length ? (
          verdict.ranked.map((candidate, index) => (
            <article key={candidate.key} className="school-candidate-verdict-row">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div>
                <span>{candidate.rankLabel} · {candidate.rankScore}/100</span>
                <strong>{candidate.schoolName}</strong>
                <em>{candidate.majorName || "专业待补"} → {candidate.jobName || "岗位待补"}</em>
              </div>
              <section>
                <span>{candidate.rankReason}</span>
                <small>缺口：{candidate.missingLabel}</small>
              </section>
            </article>
          ))
        ) : (
          <article className="school-candidate-verdict-row is-empty">
            <b>00</b>
            <div>
              <span>先保存候选</span>
              <strong>还没有可排序方案</strong>
              <em>{verdict.nextAction}</em>
            </div>
          </article>
        )}
      </div>
      <p>{verdict.nextAction}</p>
    </div>
  );
}

function buildSchoolInfoCandidate({
  schoolName,
  majorName,
  jobName,
  selectedSchool,
  links,
  marketProfile,
  companyCards,
  manualEvidenceItems,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  selectedSchool: (typeof schoolOutcomeProfiles)[number] | null;
  links: SchoolAccessLink[];
  marketProfile: MajorSalaryProfile | null;
  companyCards: OfficialCompanySource[];
  manualEvidenceItems: SchoolManualEvidenceItem[];
}): SchoolInfoCandidate {
  const officialDirectCount = selectedSchool?.officialLinks.length ?? 0;
  const verifiedReportCount = selectedSchool?.evidenceSources.filter((source) => source.status === "verified").length ?? 0;
  const trustedManualEvidenceItems = manualEvidenceItems.filter((item) => getSchoolEvidencePacketTrustLevel(item) !== "weak");
  const weakManualEvidenceCount = manualEvidenceItems.length - trustedManualEvidenceItems.length;
  const manualEvidenceKinds = new Set(trustedManualEvidenceItems.map((item) => item.kind));
  const manualEvidenceKindLabels = Array.from(manualEvidenceKinds).map((kind) => getSchoolManualEvidenceKindLabel(kind));
  const hasDirection = Boolean(majorName || jobName);
  const confirmedEvidence = [
    selectedSchool ? "学校已命中结构化样本" : "已生成公开检索入口",
    officialDirectCount ? `${officialDirectCount} 个学校官方直达入口` : "",
    verifiedReportCount ? `${verifiedReportCount} 个已核验就业报告/数据源` : "",
    trustedManualEvidenceItems.length ? `${trustedManualEvidenceItems.length} 条可采信自存证据` : "",
    weakManualEvidenceCount ? `${weakManualEvidenceCount} 条弱证据仅作线索` : "",
    manualEvidenceKindLabels.length ? `自存证据：${manualEvidenceKindLabels.join(" / ")}` : "",
    hasDirection ? "已填写专业或目标岗位" : "",
    marketProfile ? `${marketProfile.group} 薪资代理` : "",
    companyCards.length ? `${companyCards.length} 个企业官网入口` : "",
  ].filter(Boolean);
  const missingEvidence = [
    officialDirectCount || manualEvidenceKinds.has("major") ? "" : "找到学校官网专业目录或招生专业页",
    verifiedReportCount || manualEvidenceKinds.has("report") ? "" : "找到近两年就业质量报告 PDF 或信息公开页",
    selectedSchool?.campusRecruitingYears.some((year) => year.status === "verified" && year.companies.length > 0) || manualEvidenceKinds.has("campus")
      ? ""
      : "核验就业信息网、宣讲会或双选会企业名单",
    majorName ? "" : "补一个专业名，避免泛泛比较学校",
    jobName ? "" : "补一个目标岗位，方便反查企业官网",
    marketProfile || manualEvidenceKinds.has("salary") ? "" : "生成对应行业薪资代理",
  ].filter(Boolean);
  const rawEvidenceScore =
    (selectedSchool ? 28 : 0) +
    Math.min(22, officialDirectCount * 7) +
    Math.min(24, verifiedReportCount * 12) +
    Math.min(16, manualEvidenceKinds.size * 4 + trustedManualEvidenceItems.length * 2) +
    (hasDirection ? 14 : 0) +
    (marketProfile ? 8 : 0) +
    Math.min(12, companyCards.length * 2);
  const evidenceScore = Math.min(100, rawEvidenceScore);
  const evidenceLabel = evidenceScore >= 70 ? "资料较完整" : evidenceScore >= 44 ? "可开始比较" : "只适合起步";
  const manualEvidenceNote = trustedManualEvidenceItems.length || weakManualEvidenceCount
    ? ` · 可采信自存 ${trustedManualEvidenceItems.length} 条${weakManualEvidenceCount ? ` · 弱证据 ${weakManualEvidenceCount} 条不计入正式判断` : ""}`
    : "";
  const evidenceNote =
    (selectedSchool
      ? `${officialDirectCount} 个官方直达 · ${verifiedReportCount > 0 ? `${verifiedReportCount} 个已核报告` : "已核报告待接入"}`
      : `${links.length} 个公开检索入口 · 等待官方报告核验`) + manualEvidenceNote;
  const requiredActions = [
    majorName ? "核对专业培养方案" : "先补专业名称",
    jobName ? "打开企业官网查岗位" : "先补目标岗位",
    verifiedReportCount ? "读取就业报告关键页" : "查就业质量报告",
  ];

  return {
    key: normalizeMarketText([schoolName, majorName || "unknown-major", jobName || "unknown-job"].join("-")),
    schoolName,
    majorName,
    jobName,
    salaryLabel: marketProfile ? formatMonthlyRange(marketProfile.starterMonthlyK) : "待生成",
    marketGroup: marketProfile ? marketProfile.group : "补专业或岗位后生成市场代理",
    evidenceScore,
    evidenceLabel,
    evidenceNote,
    confirmedEvidence: confirmedEvidence.length ? confirmedEvidence : ["已生成基础查询结构"],
    missingEvidence: missingEvidence.length ? missingEvidence : ["继续打开原始来源复核细节"],
    companyNames: companyCards.map((company) => company.name),
    requiredActions,
  };
}

function buildSchoolEvidenceTasks({
  selectedSchool,
  links,
  companyCards,
}: {
  selectedSchool: (typeof schoolOutcomeProfiles)[number] | null;
  links: SchoolAccessLink[];
  companyCards: OfficialCompanySource[];
}): SchoolEvidenceTask[] {
  const majorDirect = selectedSchool?.officialLinks.find((link) => link.kind === "major-catalog");
  const admissionsDirect = selectedSchool?.officialLinks.find((link) => link.kind === "admissions");
  const employmentDirect = selectedSchool?.officialLinks.find((link) => link.kind === "employment");
  const schoolDirect = selectedSchool?.officialLinks.find((link) => link.kind === "school");
  const reportSource = selectedSchool?.evidenceSources.find((source) => source.status === "verified") ?? selectedSchool?.evidenceSources[0];
  const majorSearch = links.find((link) => link.label === "官网专业目录") ?? links[0];
  const admissionsSearch = links.find((link) => link.label === "本科招生专业") ?? majorSearch;
  const reportSearch = links.find((link) => link.label === "就业质量报告") ?? links[0];
  const employmentSearch = links.find((link) => link.label === "就业信息网") ?? links[0];
  const salarySearch = links.find((link) => link.label === "薪资线索") ?? links[0];
  const firstCompany = companyCards[0];

  return [
    {
      label: "确认专业是否真实开设",
      status: majorDirect || admissionsDirect || schoolDirect ? "open" : "search",
      source: majorDirect?.label ?? admissionsDirect?.label ?? schoolDirect?.label ?? majorSearch.source,
      detail: majorDirect?.note ?? admissionsDirect?.note ?? schoolDirect?.note ?? majorSearch.description,
      url: majorDirect?.url ?? admissionsDirect?.url ?? schoolDirect?.url ?? majorSearch.url,
    },
    {
      label: "核对招生口径和校区",
      status: admissionsDirect || schoolDirect ? "open" : "search",
      source: admissionsDirect?.label ?? schoolDirect?.label ?? admissionsSearch.source,
      detail: admissionsDirect?.note ?? schoolDirect?.note ?? admissionsSearch.description,
      url: admissionsDirect?.url ?? schoolDirect?.url ?? admissionsSearch.url,
    },
    {
      label: "读取就业质量报告",
      status: reportSource?.status === "verified" ? "verified" : "search",
      source: reportSource?.sourceName ?? reportSearch.source,
      detail: reportSource ? reportSource.title : reportSearch.description,
      url: reportSource?.url ?? reportSearch.url,
    },
    {
      label: "查校招和宣讲会企业",
      status: employmentDirect ? "open" : "search",
      source: employmentDirect ? employmentDirect.label : employmentSearch.source,
      detail: employmentDirect ? employmentDirect.note : employmentSearch.description,
      url: employmentDirect?.url ?? employmentSearch.url,
    },
    {
      label: "打开企业官网岗位",
      status: firstCompany ? "open" : "search",
      source: firstCompany?.name ?? salarySearch.source,
      detail: firstCompany ? "查看校招、实习、岗位要求和薪资口径。" : salarySearch.description,
      url: firstCompany?.careerUrl ?? salarySearch.url,
    },
  ];
}

function UnknownSchoolPathPanel({
  schoolName,
  majorName,
  jobName,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
}) {
  const targetSchoolName = schoolName.trim() || "这所学校";
  const targetMajorName = majorName.trim();
  const targetJobName = jobName.trim();
  const entries = buildUnknownSchoolEntryPack({
    schoolName: targetSchoolName,
    majorName: targetMajorName,
    jobName: targetJobName,
  });
  const evidenceGuide = buildUnknownSchoolEvidenceGuide(entries);
  const packetText = buildUnknownSchoolEntryPacketText({
    schoolName: targetSchoolName,
    majorName: targetMajorName,
    jobName: targetJobName,
    entries,
  });
  const packetPreviewLines = buildUnknownSchoolEntryPacketPreviewLines(packetText);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showUnknownPacketText, setShowUnknownPacketText] = useState(false);
  const copyUnknownSchoolPacket = async () => {
    try {
      await copyTextToClipboard(packetText);
      setCopyState("copied");
      setShowUnknownPacketText(false);
    } catch {
      setCopyState("failed");
      setShowUnknownPacketText(true);
    }
  };

  return (
    <article className="unknown-school-path-panel">
      <div className="unknown-school-pack-head">
        <div>
          <p className="eyebrow">未收录学校入口包</p>
          <h3>{targetSchoolName} 还没有结构化样本，先直接打开这些公开入口。</h3>
          <p>
            不要求学校已经在库里。先拿到官网专业、就业报告、就业网和宣讲会证据，再回到岗位薪资做反查。
          </p>
        </div>
        <button type="button" onClick={copyUnknownSchoolPacket}>
          {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制入口包"}
        </button>
      </div>
      {showUnknownPacketText && (
        <textarea
          aria-label="未知学校入口包文本"
          className="unknown-school-packet-copybox"
          readOnly
          value={packetText}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}

      <div className="unknown-school-entry-pack-grid">
        {entries.map((entry) => (
          <a key={entry.id} href={entry.url} target="_blank" rel="noreferrer">
            <span>{getUnknownSchoolEntryCategoryLabel(entry.category)}</span>
            <strong>{entry.label}</strong>
            <em>{entry.source}</em>
            <p>{entry.detail}</p>
          </a>
        ))}
      </div>

      <div className="unknown-school-evidence-guide" aria-label="未收录学校证据核验顺序">
        {evidenceGuide.map((step) => (
          <section key={step.id} className="unknown-school-evidence-card">
            <b>{String(step.order).padStart(2, "0")}</b>
            <div>
              <strong>{step.title}</strong>
              <p>{step.acceptedEvidence}</p>
            </div>
            <dl>
              <dt>不要算</dt>
              <dd>{step.rejectIf}</dd>
              <dt>下一步</dt>
              <dd>{step.nextAction}</dd>
            </dl>
          </section>
        ))}
      </div>

      <div className="unknown-school-packet-preview" aria-label="未收录学校查询包预览">
        {packetPreviewLines.map((line, index) => (
          <span key={`${line}-${index}`}>{line}</span>
        ))}
      </div>
    </article>
  );
}

function getUnknownSchoolEntryCategoryLabel(category: ReturnType<typeof buildUnknownSchoolEntryPack>[number]["category"]) {
  const labels: Record<ReturnType<typeof buildUnknownSchoolEntryPack>[number]["category"], string> = {
    "school-official": "官网",
    admissions: "招生",
    "major-catalog": "专业",
    employment: "就业",
    report: "报告",
    campus: "校招",
    salary: "薪资",
  };

  return labels[category];
}

function buildSchoolAccessLinks(schoolName: string, majorName?: string | null, jobName?: string | null): SchoolAccessLink[] {
  const safeSchoolName = schoolName.trim() || "学校";
  const currentReportYears = "2025 2024";
  const majorClause = majorName ? ` ${majorName}` : "";
  const jobClause = jobName ? ` ${jobName}` : "";
  const makeBaiduUrl = (query: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
  const makeBingUrl = (query: string) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  return [
    {
      label: "官网专业目录",
      source: "Bing · 限定 edu.cn",
      url: makeBingUrl(`${safeSchoolName}${majorClause} 本科专业 专业设置 site:.edu.cn`),
      description: "优先找学校官网、本科生院、教务处或学院的专业设置页。",
      priority: "专业",
    },
    {
      label: "本科招生专业",
      source: "百度 · 招生网",
      url: makeBaiduUrl(`${safeSchoolName}${majorClause} 本科招生 专业介绍 招生专业 官网`),
      description: "招生网通常比学校总官网更容易找到专业介绍、招生计划和培养方向。",
      priority: "专业",
    },
    {
      label: "就业质量报告",
      source: "Bing · PDF/信息公开",
      url: makeBingUrl(`${safeSchoolName} ${currentReportYears} 毕业生就业质量报告 PDF 就业率 薪酬`),
      description: "先找报告入口；能解析到就业率、升学率、行业去向，再进入结构化字段。",
      priority: "就业",
    },
    {
      label: "就业信息网",
      source: "百度 · 宣讲会/双选会",
      url: makeBaiduUrl(`${safeSchoolName}${majorClause}${jobClause} 就业信息网 宣讲会 双选会 招聘会 企业`),
      description: "这是判断“哪些企业每年来学校招聘”的核心入口。",
      priority: "校招",
    },
    {
      label: "录取分数与招生计划",
      source: "百度 · 官方招生",
      url: makeBaiduUrl(`${safeSchoolName} 招生计划 录取分数 专业 官网`),
      description: "适合高考填报前看专业门槛、校区和招生口径。",
      priority: "专业",
    },
    {
      label: "薪资线索",
      source: "Bing · 报告/学院去向",
      url: makeBingUrl(`${safeSchoolName}${majorClause}${jobClause} 就业质量报告 薪资 薪酬 毕业去向`),
      description: "学校通常不直接披露专业薪资；先找报告、学院去向和第三方薪资线索。",
      priority: "薪资",
    },
  ];
}

function buildSchoolInfoPacketText({
  schoolName,
  majorName,
  jobName,
  selectedSchool,
  links,
  marketProfile,
  companyCards,
  manualEvidenceItems,
}: {
  schoolName: string;
  majorName: string;
  jobName: string;
  selectedSchool: (typeof schoolOutcomeProfiles)[number] | null;
  links: SchoolAccessLink[];
  marketProfile: MajorSalaryProfile | null;
  companyCards: OfficialCompanySource[];
  manualEvidenceItems: SchoolManualEvidenceItem[];
}) {
  const officialDirectLinks = selectedSchool?.officialLinks ?? [];
  const directionLine = [majorName && `专业：${majorName}`, jobName && `目标岗位：${jobName}`].filter(Boolean).join("；") || "专业/岗位：待补充";
  const salaryLine = marketProfile
    ? `薪资代理：${formatMonthlyRange(marketProfile.starterMonthlyK)}；成熟阶段 ${formatMonthlyRange(marketProfile.matureMonthlyK)}；口径：${marketProfile.group} 市场估算`
    : "薪资代理：待补专业或目标岗位后生成";
  const companyLines = companyCards.length
    ? companyCards.slice(0, 6).map((company, index) => `${index + 1}. ${company.name}：${company.careerUrl}`)
    : ["1. 先补专业或目标岗位，再生成公司官网入口"];
  const directLinkLines = officialDirectLinks.length
    ? officialDirectLinks.slice(0, 4).map((link, index) => `${index + 1}. ${link.label}：${link.url}`)
    : links.slice(0, 4).map((link, index) => `${index + 1}. ${link.label}：${link.url}`);
  const searchLinkLines = links.slice(0, 6).map((link, index) => `${index + 1}. ${link.label}（${link.source}）：${link.url}`);
  const manualEvidenceGroups = groupSchoolManualEvidenceForPacket(manualEvidenceItems);
  const emptyManualEvidenceLine = "暂无；先把官网、报告、校招或薪资证据收进本页。";

  return [
    "看看工资 · 学校信息聚合包",
    `学校：${schoolName}`,
    directionLine,
    salaryLine,
    "",
    "优先打开入口：",
    ...directLinkLines,
    "",
    "企业官网入口：",
    ...companyLines,
    "",
    "公开检索入口：",
    ...searchLinkLines,
    "",
    "官方结论证据：",
    ...(manualEvidenceGroups.official.length ? manualEvidenceGroups.official : [emptyManualEvidenceLine]),
    "",
    "待复核线索：",
    ...(manualEvidenceGroups.leads.length ? manualEvidenceGroups.leads : ["暂无；搜索结果只能当入口，点进学校官网或企业官网后再保存。"]),
    "",
    "弱证据/不要当结论：",
    ...(manualEvidenceGroups.weak.length ? manualEvidenceGroups.weak : ["暂无；营销软文、经验帖、无年份截图不要当最终结论。"]),
    "",
    "核验顺序：",
    "1. 先在招生网/专业设置页确认这个学校真实开设的专业和培养方向。",
    "2. 再找就业质量报告里的就业率、升学率、行业去向和签约单位。",
    "3. 打开就业信息网/宣讲会日历，看近年哪些企业真的到校招聘。",
    "4. 回到企业官网岗位和薪资代理，判断这个专业是不是能通向目标岗位。",
    "",
    "注意：薪资代理不是学校官方统计，只用于先做方向判断；最终以学校报告、企业官网和真实招聘页为准。",
  ].join("\n");
}

function OfficialSchoolLinksPanel({ links }: { links: SchoolOfficialLink[] }) {
  if (links.length === 0) return null;

  return (
    <article className="official-school-links-panel">
      <div className="official-school-links-head">
        <div>
          <p className="eyebrow">官方入口</p>
          <h3>先给入口，详细指标后解析</h3>
        </div>
        <strong>{links.length} 个</strong>
      </div>
      <div className="official-school-links-grid">
        {links.map((link) => (
          <a key={`${link.kind}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className={`school-link-${link.kind}`}>
            <span>{getSchoolOfficialLinkKindLabel(link.kind)}</span>
            <strong>{link.label}</strong>
            <em>{link.note}</em>
          </a>
        ))}
      </div>
    </article>
  );
}

function CareerDirectoryLinksPanel({ entries }: { entries: SchoolCareerDirectoryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <article className="official-school-links-panel career-directory-links-panel">
      <div className="official-school-links-head">
        <div>
          <p className="eyebrow">MIT 目录候选</p>
          <h3>就业网入口候选，打开后再做逐校核验</h3>
        </div>
        <strong>{entries.length} 个</strong>
      </div>
      <div className="official-school-links-grid">
        {entries.map((entry) => {
          const health = getCareerDirectoryHealth(entry.url);
          return (
            <a key={entry.id} href={health?.finalUrl ?? entry.url} target="_blank" rel="noreferrer" className={`school-link-employment directory-health-${health?.status ?? "unknown"}`}>
              <span>{entry.province} · {entry.portalName}</span>
              <strong>{entry.schoolName}</strong>
              <em>{health ? `${getCareerDirectoryHealthLabel(health.status)} · HTTP ${health.statusCode} · ${health.checkedAt}` : "目录候选 · 待探测"}</em>
              <b>{health?.note ?? schoolCareerDirectorySource.repoUrl}</b>
            </a>
          );
        })}
      </div>
    </article>
  );
}

function getSchoolOfficialLinkKindLabel(kind: SchoolOfficialLink["kind"]) {
  if (kind === "major-catalog") return "专业目录";
  if (kind === "admissions") return "招生入口";
  if (kind === "employment") return "就业入口";
  if (kind === "report") return "就业报告";
  return "学校官网";
}

function SchoolAggregationReportPanel({ aggregation }: { aggregation: SchoolAggregationReport }) {
  const [showCopyText, setShowCopyText] = useState(false);

  return (
    <article className="school-aggregation-report-panel">
      <div className="school-aggregation-report-head">
        <div>
          <p className="eyebrow">聚合报告</p>
          <h3>{aggregation.schoolName}：专业就业 / 招聘会 / 薪资</h3>
          <span>{aggregation.headline}</span>
        </div>
        <button type="button" onClick={() => setShowCopyText((value) => !value)}>
          {showCopyText ? "收起报告" : "展开报告"}
        </button>
      </div>

      <div className="school-aggregation-report-grid">
        <section>
          <span>专业就业</span>
          <strong>{aggregation.majorRows.length} 个方向</strong>
          <p>{aggregation.majorRows.slice(0, 3).map((row) => `${row.majorName} -> ${row.destinations.split(" / ")[0]}`).join("；")}</p>
        </section>
        <section>
          <span>招聘会常见行业</span>
          <strong>{aggregation.recruitingRows.length} 场</strong>
          <p>{Array.from(new Set(aggregation.recruitingRows.map((row) => row.category))).slice(0, 6).join(" / ")}</p>
        </section>
        <section>
          <span>薪资情况</span>
          <strong>{aggregation.salaryRows[0]?.salaryLabel ?? "待核验"}</strong>
          <p>岗位市场参考，每天回企业官网和就业网岗位核验。</p>
        </section>
        <section>
          <span>来源入口</span>
          <strong>{aggregation.sourceRows.length} 个</strong>
          <p>{aggregation.sourceRows.slice(0, 4).map((row) => `${row.source}: ${row.label}`).join(" / ")}</p>
        </section>
      </div>

      <div className="school-aggregation-major-table">
        {aggregation.majorRows.slice(0, 8).map((row) => (
          <section key={`${aggregation.schoolName}-${row.majorName}`} className="school-aggregation-major-row">
            <div>
              <strong>{row.majorName}</strong>
              <span>{row.cluster}</span>
            </div>
            <p>{row.destinations}</p>
            <em>{row.salaryLabel}</em>
          </section>
        ))}
      </div>

      <div className="school-aggregation-recruiting-list">
        {aggregation.recruitingRows.slice(0, 8).map((row) => (
          <a
            key={`${row.date}-${row.title}`}
            href={row.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="school-aggregation-recruiting-row"
          >
            <span>{row.date}</span>
            <strong>{row.category}</strong>
            <p>{row.title}</p>
            <em>{row.venue}</em>
          </a>
        ))}
      </div>

      <div className="school-aggregation-salary-list">
        {aggregation.salaryRows.slice(0, 6).map((row) => (
          <section key={`${row.majorName}-salary`} className="school-aggregation-salary-row">
            <strong>{row.majorName}</strong>
            <span>{row.salaryLabel}</span>
            <p>{row.companyHints.length ? row.companyHints.join(" / ") : "企业入口待补"}</p>
          </section>
        ))}
      </div>

      {showCopyText && (
        <pre className="school-aggregation-copy-box">{aggregation.copyText}</pre>
      )}
    </article>
  );
}

function SchoolMajorEvidenceSummaryCard({
  school,
  major,
  marketProfile,
  officialJobCount,
  matchedCompanies,
  verifiedEvidenceCount,
}: {
  school: (typeof schoolOutcomeProfiles)[number];
  major: SchoolOutcomeMajor;
  marketProfile: MajorSalaryProfile;
  officialJobCount: number;
  matchedCompanies: string[];
  verifiedEvidenceCount: number;
}) {
  const verifiedCampusYears = school.campusRecruitingYears.filter((year) => year.status === "verified");
  const pendingCampusYears = school.campusRecruitingYears.filter((year) => year.status === "pending");
  const campusCompanyNames = Array.from(new Set(verifiedCampusYears.flatMap((year) => year.companies)));
  const latestVerifiedCampusYear = verifiedCampusYears.slice().sort((left, right) => right.year - left.year)[0];
  const hasVerifiedEmployment = major.employmentRate.status === "verified";
  const hasSchoolSalary = major.averageSalary.status === "verified";
  const verdict = getSchoolMajorEvidenceVerdict({
    hasVerifiedEmployment,
    hasSchoolSalary,
    officialJobCount,
    verifiedEvidenceCount,
    verifiedCampusYearCount: verifiedCampusYears.length,
    campusCompanyCount: campusCompanyNames.length,
  });
  const salaryLabel = hasSchoolSalary ? major.averageSalary.label : formatMonthlyRange(marketProfile.starterMonthlyK);
  const salarySource = hasSchoolSalary
    ? major.averageSalary.source
    : `学校未披露专业薪资；暂用 ${marketProfile.group} 的市场薪资代理。`;
  const campusYearLabel = [
    ...verifiedCampusYears.map((year) => `${year.year} 已核验`),
    ...pendingCampusYears.map((year) => `${year.year} 待接入`),
  ].join(" / ");
  const campusCompaniesLabel = campusCompanyNames.length
    ? campusCompanyNames.slice(0, 10).join(" / ")
    : latestVerifiedCampusYear
      ? `${latestVerifiedCampusYear.year} 年份已核验，企业名单还要解析活动详情或报告附件`
      : "就业中心宣讲会日历 adapter 待接入";

  return (
    <article className="school-major-verdict-card">
      <div className="school-major-verdict-head">
        <div>
          <p className="eyebrow">{school.name}</p>
          <h3>
            {major.name}
            <span>{major.cluster}</span>
          </h3>
          <p>{verdict.description}</p>
        </div>
        <strong className={`verdict-badge ${verdict.tone}`}>{verdict.title}</strong>
      </div>

      <div className="school-major-proof-grid">
        <section className={`school-major-proof-item ${major.employmentRate.status}`}>
          <div>
            <span>就业率</span>
            <b>{hasVerifiedEmployment ? "学校口径" : "待接入"}</b>
          </div>
          <strong>{major.employmentRate.label}</strong>
          <em>{major.employmentRate.source}</em>
        </section>
        <section className={`school-major-proof-item ${hasSchoolSalary ? "verified" : "proxy"}`}>
          <div>
            <span>平均工资</span>
            <b>{hasSchoolSalary ? "学校口径" : "市场代理"}</b>
          </div>
          <strong>{salaryLabel}</strong>
          <em>{salarySource}</em>
        </section>
        <section className="school-major-proof-item verified">
          <div>
            <span>官网岗位</span>
            <b>{matchedCompanies.length ? `${matchedCompanies.length} 家企业` : "样本聚合"}</b>
          </div>
          <strong>{officialJobCount} 条</strong>
          <em>{matchedCompanies.length ? matchedCompanies.join(" / ") : "当前 adapter 样本未命中"}</em>
        </section>
        <section className={campusCompanyNames.length ? "school-major-proof-item verified" : "school-major-proof-item pending"}>
          <div>
            <span>校招企业</span>
            <b>{verifiedCampusYears.length ? `${verifiedCampusYears.length} 年已核验` : "待接入"}</b>
          </div>
          <strong>{campusCompanyNames.length || "待解析"}</strong>
          <em>{campusCompaniesLabel}</em>
        </section>
      </div>

      <div className="school-major-company-row">
        <span>年度企业</span>
        <p>{campusYearLabel || "还没有可核验年度记录"}；{campusCompaniesLabel}</p>
      </div>

      <div className="school-major-action-strip">
        <section>
          <span>毕业去向</span>
          <p>{major.destinations.join(" / ")}</p>
        </section>
        <section>
          <span>下一步核验</span>
          <p>{marketProfile.firstYearChecks[0] ?? "补齐学校就业质量报告、学院去向和企业校招日历。"}</p>
        </section>
      </div>
    </article>
  );
}

function getSchoolMajorEvidenceVerdict({
  hasVerifiedEmployment,
  hasSchoolSalary,
  officialJobCount,
  verifiedEvidenceCount,
  verifiedCampusYearCount,
  campusCompanyCount,
}: {
  hasVerifiedEmployment: boolean;
  hasSchoolSalary: boolean;
  officialJobCount: number;
  verifiedEvidenceCount: number;
  verifiedCampusYearCount: number;
  campusCompanyCount: number;
}) {
  if (hasVerifiedEmployment && officialJobCount >= 20 && verifiedEvidenceCount > 0 && (verifiedCampusYearCount > 0 || campusCompanyCount > 0)) {
    return {
      title: "证据较强，可重点核验",
      tone: "strong",
      description: hasSchoolSalary
        ? "学校就业口径、薪资口径、官网岗位和年度企业记录都有支撑，可以作为优先对比对象。"
        : "学校就业口径和官网岗位证据较强，但专业级薪资未公开，工资仍按市场代理阅读。",
    };
  }

  if (officialJobCount >= 20 && verifiedEvidenceCount === 0) {
    return {
      title: "市场岗位强，学校证据待补",
      tone: "watch",
      description: "企业官网岗位对这个方向需求明显，但学校就业率、薪资和年度校招企业仍要接入报告后再下结论。",
    };
  }

  if (hasVerifiedEmployment) {
    return {
      title: "就业证据可看，薪资需代理",
      tone: "steady",
      description: "学校就业率有可追溯来源，薪资和企业校招名单仍应继续核验，当前先用岗位市场理解回报区间。",
    };
  }

  return {
    title: "先看市场，再补学校报告",
    tone: "pending",
    description: "当前还缺学校专业级就业数据，页面只把官网岗位和市场薪资作为方向参考，不把它们当作学校承诺。",
  };
}

type SchoolMajorSnapshot = {
  major: SchoolOutcomeMajor;
  marketProfile: MajorSalaryProfile;
  officialJobCount: number;
  companyNames: string[];
  recruiterSourceCount: number;
};

function SchoolMajorSnapshotBoard({
  school,
  snapshots,
  selectedMajorId,
  onSelect,
}: {
  school: (typeof schoolOutcomeProfiles)[number];
  snapshots: SchoolMajorSnapshot[];
  selectedMajorId: string;
  onSelect: (majorId: string) => void;
}) {
  const verifiedEvidenceCount = school.evidenceSources.filter((source) => source.status === "verified").length;
  const knownCampusCompanies = Array.from(new Set(school.campusRecruitingYears.flatMap((year) => year.companies)));
  const topSnapshot = snapshots
    .slice()
    .sort((left, right) => right.officialJobCount - left.officialJobCount || right.companyNames.length - left.companyNames.length)[0];

  return (
    <article className="school-major-snapshot-board">
      <div className="school-major-snapshot-head">
        <div>
          <p className="eyebrow">学校专业总览</p>
          <h3>{school.name}：先看哪些专业有证据</h3>
          <span>点击专业后再看详细去向、工资口径、就业率来源和年度企业证据。</span>
        </div>
        <section>
          <span>最强岗位证据</span>
          <strong>{topSnapshot ? topSnapshot.major.name : "待接入"}</strong>
          <em>{topSnapshot ? `${topSnapshot.officialJobCount} 条官网岗位 · ${topSnapshot.companyNames.length} 家企业` : "需要继续接入就业报告"}</em>
        </section>
      </div>

      <div className="school-major-proof-strip">
        <section>
          <span>学校报告证据</span>
          <strong>{verifiedEvidenceCount}/{school.evidenceSources.length}</strong>
          <em>只把有来源字段标为已核验</em>
        </section>
        <section>
          <span>年度企业证据</span>
          <strong>{knownCampusCompanies.length || "待接入"}</strong>
          <em>{knownCampusCompanies.length ? knownCampusCompanies.slice(0, 4).join(" / ") : "等就业中心日历或报告解析"}</em>
        </section>
        <section>
          <span>专业样本</span>
          <strong>{snapshots.length} 个</strong>
          <em>先覆盖可核验方向，再扩学校和学院</em>
        </section>
      </div>

      <div className="school-major-snapshot-grid">
        {snapshots.map((snapshot) => (
          <button
            key={snapshot.major.id}
            className={snapshot.major.id === selectedMajorId ? "active" : ""}
            onClick={() => onSelect(snapshot.major.id)}
          >
            <div>
              <span>{snapshot.major.cluster}</span>
              <strong>{snapshot.major.name}</strong>
            </div>
            <div className="school-major-snapshot-metrics">
              <section>
                <span>就业率</span>
                <strong>{snapshot.major.employmentRate.label}</strong>
              </section>
              <section>
                <span>平均工资</span>
                <strong>{snapshot.major.averageSalary.label}</strong>
              </section>
              <section>
                <span>官网岗位</span>
                <strong>{snapshot.officialJobCount} 条</strong>
              </section>
            </div>
            <div className="school-major-snapshot-tags">
              {snapshot.major.destinations.slice(0, 3).map((destination) => (
                <em key={destination}>{destination}</em>
              ))}
            </div>
            <p>
              {formatMonthlyRange(snapshot.marketProfile.starterMonthlyK)} 市场参考 · {snapshot.companyNames.length ? snapshot.companyNames.slice(0, 3).join(" / ") : `${snapshot.recruiterSourceCount} 个官方入口`}
            </p>
          </button>
        ))}
      </div>
    </article>
  );
}

function buildSchoolMajorSnapshots(school: (typeof schoolOutcomeProfiles)[number]): SchoolMajorSnapshot[] {
  return school.majors.map((major) => {
    const marketProfile = findMarketProfileForSchoolMajor(major);
    const matches = getAllAggregatedOfficialJobs([major.name, major.cluster, ...major.destinations, ...marketProfile.roles], 42);
    return {
      major,
      marketProfile,
      officialJobCount: matches.length,
      companyNames: Array.from(new Set(matches.map((match) => match.job.companyName))).slice(0, 5),
      recruiterSourceCount: getRecruiterSources(major).length,
    };
  });
}

function OutcomeMetricCard({ label, metric }: { label: string; metric: { label: string; source: string; status: "verified" | "pending" } }) {
  return (
    <div className={`outcome-metric ${metric.status}`}>
      <span>{label}</span>
      <strong>{metric.label}</strong>
      <em>{metric.source}</em>
    </div>
  );
}

function MarketProxyCard({ major, profile }: { major: SchoolOutcomeMajor; profile: MajorSalaryProfile }) {
  const companySignals = getMarketCompanySignals(major, profile);
  const relatedRoles = profile.roles.filter((role) =>
    major.destinations.some((destination) => areMarketTermsRelated(role, destination))
  );
  const rolesToShow = relatedRoles.length > 0 ? relatedRoles : profile.roles.slice(0, 4);

  return (
    <article className="market-proxy-card">
      <div className="market-proxy-heading">
        <div>
          <p className="eyebrow">市场参考</p>
          <h4>{profile.group}</h4>
          <span>不等于 {major.name} 的该校官方统计；用于在学校报告未接入时先理解岗位市场。</span>
        </div>
        <strong>{profile.riskLevel}</strong>
      </div>

      <div className="market-proxy-metrics">
        <section>
          <span>毕业初期</span>
          <strong>{formatMonthlyRange(profile.starterMonthlyK)}</strong>
        </section>
        <section>
          <span>成熟阶段</span>
          <strong>{formatMonthlyRange(profile.matureMonthlyK)}</strong>
        </section>
        <section>
          <span>需求热度</span>
          <strong>{profile.demandScore}%</strong>
        </section>
      </div>

      <div className="market-proxy-grid">
        <section>
          <h5>相关岗位</h5>
          <div>
            {rolesToShow.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
        </section>
        <section>
          <h5>企业信号</h5>
          <div>
            {companySignals.map((company) => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </section>
        <section>
          <h5>第一年验证</h5>
          <ul>
            {profile.firstYearChecks.slice(0, 3).map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function findMarketProfileForSchoolMajor(major: SchoolOutcomeMajor) {
  const ranked = majorSalaryProfiles
    .map((profile) => ({ profile, score: scoreMarketProfileForMajor(major, profile) }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.score ? ranked[0].profile : majorSalaryProfiles[0];
}

function findMarketProfileForPublicQuery(values: string[]) {
  const meaningfulValues = values.map((value) => value.trim()).filter(Boolean);
  if (meaningfulValues.length === 0) return null;
  const ranked = majorSalaryProfiles
    .map((profile) => ({ profile, score: scoreMarketProfileForText(meaningfulValues, profile) }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.score ? ranked[0].profile : null;
}

function scoreMarketProfileForText(values: string[], profile: MajorSalaryProfile) {
  let score = 0;
  const normalizedValues = values.map(normalizeMarketText).filter(Boolean);
  const tokens = getMarketTokens(values);

  profile.majors.forEach((major) => {
    const normalizedMajor = normalizeMarketText(major);
    if (normalizedValues.some((value) => value === normalizedMajor)) score += 120;
    else if (normalizedValues.some((value) => areNormalizedTermsRelated(value, normalizedMajor))) score += 82;
  });

  profile.roles.forEach((role) => {
    const normalizedRole = normalizeMarketText(role);
    if (normalizedValues.some((value) => areNormalizedTermsRelated(value, normalizedRole))) score += 58;
  });

  getMarketTokens([profile.group]).forEach((profileToken) => {
    if (tokens.some((token) => areNormalizedTermsRelated(token, profileToken))) score += 24;
  });

  profile.coreSkills.forEach((skill) => {
    const normalizedSkill = normalizeMarketText(skill);
    if (normalizedValues.some((value) => areNormalizedTermsRelated(value, normalizedSkill))) score += 10;
  });

  profile.companies.forEach((company) => {
    const normalizedCompany = normalizeMarketText(company);
    if (normalizedValues.some((value) => areNormalizedTermsRelated(value, normalizedCompany))) score += 8;
  });

  return score;
}

function buildPublicCompanyCards(profile: MajorSalaryProfile, query: string) {
  const profileCompanies = profile.companies
    .map((company) => officialCompanySources.find((source) => areMarketTermsRelated(source.name, company)))
    .filter((source): source is OfficialCompanySource => Boolean(source));
  const queryCompanies = buildOfficialSearchCards(query || profile.group, 8).filter((source) => source.score > 0);
  const cards = [...profileCompanies, ...queryCompanies];
  return Array.from(new Map(cards.map((source) => [source.id, source])).values()).slice(0, 6);
}

function scoreMarketProfileForMajor(major: SchoolOutcomeMajor, profile: MajorSalaryProfile) {
  let score = 0;
  const majorName = normalizeMarketText(major.name);
  const clusterTokens = getMarketTokens([major.cluster]);
  const destinationTerms = major.destinations.map(normalizeMarketText);
  const recruiterTerms = major.recruiterSearchTargets.map(normalizeMarketText);

  profile.majors.forEach((profileMajor) => {
    const normalizedProfileMajor = normalizeMarketText(profileMajor);
    if (normalizedProfileMajor === majorName) score += 120;
    else if (areNormalizedTermsRelated(normalizedProfileMajor, majorName)) score += 85;
  });

  getMarketTokens([profile.group]).forEach((profileToken) => {
    if (clusterTokens.some((clusterToken) => areNormalizedTermsRelated(profileToken, clusterToken))) score += 24;
  });

  profile.roles.forEach((role) => {
    const normalizedRole = normalizeMarketText(role);
    if (destinationTerms.some((destination) => areNormalizedTermsRelated(normalizedRole, destination))) score += 28;
  });

  profile.companies.forEach((company) => {
    const normalizedCompany = normalizeMarketText(company);
    if (recruiterTerms.some((recruiter) => areNormalizedTermsRelated(normalizedCompany, recruiter))) score += 6;
  });

  profile.coreSkills.forEach((skill) => {
    const normalizedSkill = normalizeMarketText(skill);
    if ([majorName, ...clusterTokens, ...destinationTerms].some((term) => areNormalizedTermsRelated(normalizedSkill, term))) score += 4;
  });

  return score;
}

function getMarketCompanySignals(major: SchoolOutcomeMajor, profile: MajorSalaryProfile) {
  const preferredSignals = major.recruiterSearchTargets.filter((company) =>
    profile.companies.some((profileCompany) => areMarketTermsRelated(company, profileCompany))
  );
  return Array.from(new Set([...preferredSignals, ...profile.companies])).slice(0, 6);
}

function areMarketTermsRelated(left: string, right: string) {
  return areNormalizedTermsRelated(normalizeMarketText(left), normalizeMarketText(right));
}

function AggregatedOfficialJobsBlock({
  title,
  description,
  matches,
}: {
  title: string;
  description: string;
  matches: AggregatedOfficialJob[];
}) {
  return (
    <article className="aggregated-jobs-block">
      <div className="aggregated-jobs-heading">
        <div>
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
        <strong>{matches.length} 条</strong>
      </div>
      {matches.length > 0 ? (
        <div className="aggregated-job-grid">
          {matches.map(({ job, score, reasons }) => (
            <a key={job.id} href={job.sourceUrl} target="_blank" rel="noreferrer">
              <div>
                <span>{job.companyName}</span>
                <b>{score}%</b>
              </div>
              <strong>{job.title}</strong>
              <em>{job.location} · {categoryLabels[job.category]}</em>
              <SalaryPill salary={job.salary} compact />
              <p>{[...reasons.slice(0, 1), ...getJobSignalTags(job, 2)].join(" / ")}</p>
            </a>
          ))}
        </div>
      ) : (
        <p className="aggregated-empty">当前 live adapter 样本没有命中；可继续打开下方官方入口做即时搜索。</p>
      )}
    </article>
  );
}

function DirectMatchBoard({ matches, salaryUpdatedAt }: { matches: UniversityMajorJobMatch[]; salaryUpdatedAt: string }) {
  const top = matches[0];
  if (!top) return null;

  return (
    <section className="panel direct-match-panel" id="direct-match">
      <PanelHeader kicker="Direct Match" title="高校 × 专业 × 岗位直接匹配" icon={<Layers3 size={20} />} />
      <div className="match-summary">
        <article className="match-spotlight">
          <span className="match-score">{top.score}%</span>
          <p className="eyebrow">Top Path</p>
          <h3>{top.university.name} · {top.major}</h3>
          <p>{top.job.companyName} / {top.job.title}</p>
          <SalaryPill salary={top.job.salary} />
          <div className="tag-row compact">
            {top.reasons.slice(0, 3).map((reason) => (
              <span key={reason}>{reason}</span>
            ))}
          </div>
        </article>

        <div className="match-card-stack">
          {matches.slice(1, 4).map((match) => (
            <article key={match.id} className="match-card">
              <div>
                <strong>{match.university.name}</strong>
                <span>{match.major} → {match.job.category}</span>
              </div>
              <b>{match.score}%</b>
            </article>
          ))}
        </div>
      </div>

      <div className="match-table">
        <div className="match-table-head">
          <span>高校</span>
          <span>专业</span>
          <span>公司岗位</span>
          <span>薪资</span>
        </div>
        {matches.slice(0, 8).map((match) => (
          <article key={match.id} className="match-row">
            <strong>{match.university.name}</strong>
            <span>{match.major}</span>
            <span>{match.job.companyName} · {match.job.title}</span>
            <div>
              <SalaryPill salary={match.job.salary} compact />
              <b>{match.score}%</b>
            </div>
          </article>
        ))}
      </div>

      <p className="data-refresh-note">薪资每日刷新：{formatDataDate(salaryUpdatedAt)}。标记“估”的薪资为市场估算，官方站给出薪资时会标记“官”。</p>
    </section>
  );
}

function SalaryPill({ salary, compact = false }: { salary: SalaryEstimate; compact?: boolean }) {
  return (
    <em className={compact ? "salary-pill compact" : "salary-pill"} title={salary.note}>
      {formatSalary(salary)}
      <small>{salary.source === "official" ? "官" : "估"}</small>
    </em>
  );
}

function formatSalary(salary: SalaryEstimate) {
  return `${salary.monthlyMinK}-${salary.monthlyMaxK}K/月 · ${salary.annualMinK}-${salary.annualMaxK}K/年`;
}

function formatDataDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" });
}

function HeroPanel({
  mbtiCode,
  profileName,
  profileSummary,
  topMajor,
  topMajorScore,
  topTrack,
  topTrackScore,
  completion,
}: {
  mbtiCode: string;
  profileName: string;
  profileSummary: string;
  topMajor: string;
  topMajorScore: number;
  topTrack: string;
  topTrackScore: number;
  completion: number;
}) {
  const dashboardMetrics = [
    { label: "身份画像", value: `${mbtiCode} · ${profileName}`, hint: "先知道自己是谁" },
    { label: "专业方向", value: `${topMajorScore}%`, hint: topMajor },
    { label: "就业赛道", value: `${topTrackScore}%`, hint: topTrack },
    { label: "行动进度", value: `${completion}%`, hint: "Todo 已同步本机" },
  ];

  return (
    <section className="hero-card panel">
      <div className="hero-copy">
        <p className="eyebrow">Life Dashboard</p>
        <h2>认识自己，匹配社会需求</h2>
        <p>{profileSummary} 当前推荐从 <strong>{topMajor}</strong> 切入，用 <strong>{topTrack}</strong> 的岗位需求反推课程、项目和面试准备。</p>
        <div className="hero-actions">
          <a href="#mbti-test">调整画像</a>
          <a href="#life-todos">查看行动</a>
        </div>
      </div>
      <div className="hero-metric-grid" aria-label="人生规划状态">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="hero-metric">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <em>{metric.hint}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  tone: "blue" | "green" | "yellow" | "purple";
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <em>{change}</em>
      </div>
      {icon}
    </article>
  );
}

function PanelHeader({ kicker, title, icon }: { kicker: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="panel-header">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <span>{icon}</span>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  option,
}: {
  active: boolean;
  onClick: () => void;
  option: { code: string; label: string; desc: string };
}) {
  return (
    <button className={active ? "choice-card active" : "choice-card"} onClick={onClick}>
      <strong>{option.code} · {option.label}</strong>
      <span>{option.desc}</span>
    </button>
  );
}

function SignalBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <article className="signal-bar">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bar-track">
        <i style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="score-ring" style={{ "--score": `${value * 3.6}deg` } as React.CSSProperties}>
      <strong>{value}%</strong>
      <span>{label}</span>
    </div>
  );
}

function ProgressLine({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-line">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <i>
        <b style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}

function getMbtiCode(answers: MbtiAnswers) {
  return mbtiQuestions.map((question) => (answers[question.id] === "left" ? question.left.code : question.right.code)).join("");
}

function getFallbackMbtiProfile(code: string) {
  const intuitive = code.includes("N");
  const thinking = code.includes("T");
  const judging = code.includes("J");

  return {
    name: `${intuitive ? "趋势" : "实证"}${thinking ? "分析" : "共情"}型规划者`,
    summary: `你更适合从${intuitive ? "未来趋势" : "现实证据"}出发，用${thinking ? "逻辑和数据" : "价值和体验"}筛选方向。`,
    strengths: [
      intuitive ? "趋势感知" : "落地执行",
      thinking ? "理性判断" : "用户共情",
      judging ? "计划推进" : "灵活试错",
      "自我复盘",
    ],
    caution: judging ? "留出探索窗口，不要过早锁死唯一答案。" : "建立阶段节点，避免长期停留在探索状态。",
  };
}

function getTraitsFromMbti(code: string) {
  const traits = ["math"];
  if (code.includes("N")) traits.push("startup", "coding");
  if (code.includes("S")) traits.push("stable", "hardware");
  if (code.includes("T")) traits.push("coding", "physics");
  if (code.includes("F")) traits.push("communication", "design");
  if (code.includes("E")) traits.push("business", "communication");
  if (code.includes("I")) traits.push("stable");

  return {
    name: "人生规划样例",
    goal: "从自我画像倒推专业、职业与行动计划",
    traits: Array.from(new Set(traits)),
  };
}

function getLifeTodos(mbtiCode: string, majorGroup: string, trackName: string) {
  return [
    {
      id: "todo-identity",
      title: `确认人格画像：${mbtiCode}`,
      desc: "用两个真实项目验证自己更适合研究、协作、执行还是探索。",
    },
    {
      id: "todo-major-map",
      title: `建立专业群地图：${majorGroup}`,
      desc: "整理三个可替代专业，以及它们共同需要的底层课程。",
    },
    {
      id: "todo-signal",
      title: `追踪一个社会需求信号：${trackName}`,
      desc: "每周看五条岗位或赛道信息，记录正在变重要的能力。",
    },
    {
      id: "todo-project",
      title: "做一个可展示作品",
      desc: "用作品证明能力，而不是只用兴趣描述自己。",
    },
    {
      id: "todo-interview",
      title: "找三位真实从业者访谈",
      desc: "问他们每天做什么、门槛在哪里、哪些课真正有用。",
    },
  ];
}

createRoot(document.getElementById("root")!).render(<App />);
