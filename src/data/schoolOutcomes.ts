import { officialCompanySources, type OfficialCompanySource } from "./officialSources";
import { universities } from "./universities";

export type OutcomeMetric = {
  label: string;
  source: string;
  status: "verified" | "pending";
};

export type SchoolOutcomeMajor = {
  id: string;
  name: string;
  cluster: string;
  destinations: string[];
  employmentRate: OutcomeMetric;
  averageSalary: OutcomeMetric;
  recruiterSearchTargets: string[];
};

export type CampusRecruitingYear = {
  year: number;
  status: "verified" | "pending";
  source: string;
  companies: string[];
  events?: CampusRecruitingEvent[];
};

export type CampusRecruitingEvent = {
  title: string;
  date: string;
  venue: string;
  category: string;
  status: "verified" | "pending";
  url: string;
};

export type SchoolEvidenceMetric = {
  label: string;
  value: string;
  note: string;
};

export type SchoolEvidenceSource = {
  title: string;
  year: number;
  sourceName: string;
  url: string;
  status: "verified" | "partial";
  metrics: SchoolEvidenceMetric[];
};

export type SchoolOfficialLink = {
  label: string;
  url: string;
  kind: "major-catalog" | "admissions" | "employment" | "report" | "school";
  note: string;
};

export type SchoolOutcomeProfile = {
  id: string;
  name: string;
  city: string;
  dataNote: string;
  officialLinks: SchoolOfficialLink[];
  evidenceSources: SchoolEvidenceSource[];
  campusRecruitingYears: CampusRecruitingYear[];
  majors: SchoolOutcomeMajor[];
};

const pendingEmploymentReport = "待接入该校就业质量报告";
const pendingSalarySource = "待接入学校就业质量报告、税前薪资样本或第三方薪资源";
const pendingCampusCalendar = "待接入学校就业中心宣讲会日历";

const schoolOfficialLinksById: Record<string, SchoolOfficialLink[]> = {
  tsinghua: [
    { label: "本科专业", url: "https://www.tsinghua.edu.cn/jyjx/bksjy/bkzy.htm", kind: "major-catalog", note: "学校官网本科专业设置" },
    { label: "本科招生专业类", url: "https://join-tsinghua.edu.cn/xkdl/zszyl.htm", kind: "admissions", note: "本科招生网招生专业类入口" },
    { label: "就业中心", url: "https://career.tsinghua.edu.cn/", kind: "employment", note: "后续用于宣讲会和招聘日历核验" },
  ],
  peking: [
    { label: "学部与院系", url: "https://bkzs.pku.edu.cn/xkzy/xy/index.htm", kind: "major-catalog", note: "本科招生网专业与院系列表" },
    { label: "本科招生网", url: "https://bkzs.pku.edu.cn/", kind: "admissions", note: "招生政策、报考指南和专业介绍入口" },
    { label: "学生就业指导服务中心", url: "https://scc.pku.edu.cn/", kind: "employment", note: "后续用于校招与就业活动核验" },
  ],
  sjtu: [
    { label: "招生专业", url: "https://admissions.sjtu.edu.cn/columnList?id=3810045&name=%E6%8B%9B%E7%94%9F%E4%B8%93%E4%B8%9A&pName=%E6%8A%A5%E8%80%83%E6%8C%87%E5%8D%97&pSubjectsID=3810049&typeStr=list", kind: "major-catalog", note: "本科招生专业年度入口" },
    { label: "本科招生网", url: "https://admissions.sjtu.edu.cn/", kind: "admissions", note: "招生章程、计划、分数和专业入口" },
    { label: "就业信息服务网", url: "https://www.job.sjtu.edu.cn/", kind: "employment", note: "后续用于招聘活动和企业入口核验" },
  ],
  zju: [
    { label: "本科生招生专业目录", url: "https://zdzsc.zju.edu.cn/3288/list.htm", kind: "major-catalog", note: "浙江大学本科招生网专业目录" },
    { label: "本科招生网", url: "https://zdzsc.zju.edu.cn/", kind: "admissions", note: "招生政策、专业介绍和录取入口" },
    { label: "就业服务平台", url: "https://www.career.zju.edu.cn/", kind: "employment", note: "后续用于招聘活动和企业名单核验" },
  ],
  hit: [
    { label: "本科专业设置", url: "https://www.hit.edu.cn/2015/0421/c11575a220692/page.htm", kind: "major-catalog", note: "学校官网本科专业设置" },
    { label: "2025本科招生专业", url: "https://zsb.hit.edu.cn/article/read/d1204b286bff12cb83f433f67a32c8c6", kind: "admissions", note: "招生办年度招生专业入口" },
    { label: "招生办", url: "https://zsb.hit.edu.cn/", kind: "admissions", note: "招生政策、计划和专业入口" },
  ],
  uestc: [
    { label: "专业介绍", url: "https://zs.uestc.edu.cn/intro/", kind: "major-catalog", note: "本科招生网专业目录和学院专业设置" },
    { label: "本科招生网", url: "https://zs.uestc.edu.cn/", kind: "admissions", note: "招生政策、专业目录和就业深造入口" },
    { label: "就业信息网", url: "https://jiuye.uestc.edu.cn/", kind: "employment", note: "后续用于宣讲会与招聘活动核验" },
  ],
  xidian: [
    { label: "本科招生信息网", url: "https://zsb.xidian.edu.cn/", kind: "admissions", note: "招生章程、招生计划和录取查询入口" },
    { label: "招生数据", url: "https://zsxc.xidian.edu.cn/auth/zsdata/lqxx/", kind: "admissions", note: "官方招生数据查询入口" },
    { label: "就业信息网", url: "https://job.xidian.edu.cn/", kind: "employment", note: "就业质量报告和招聘活动入口" },
  ],
  buaa: [
    { label: "招生专业", url: "https://zs.buaa.edu.cn/bkzn/zszy.htm", kind: "major-catalog", note: "北航招生网年度招生专业入口" },
    { label: "本科专业", url: "https://www.buaa.edu.cn/jyjx/bksjy1/bkzy.htm", kind: "major-catalog", note: "学校官网本科专业设置" },
    { label: "北航招生网", url: "https://zs.buaa.edu.cn/", kind: "admissions", note: "招生政策、计划、分数和专业入口" },
  ],
  bupt: [
    { label: "本科招生网", url: "https://zsb.bupt.edu.cn/", kind: "admissions", note: "专业介绍、招生计划和招生政策入口" },
    { label: "专业介绍", url: "https://zsb.bupt.edu.cn/zyjs.htm", kind: "major-catalog", note: "招生网专业介绍入口，若站点调整可回招生网导航" },
    { label: "就业信息网", url: "https://job.bupt.edu.cn/", kind: "employment", note: "后续用于招聘活动和企业名单核验" },
  ],
  hust: [
    { label: "本科专业", url: "https://www.hust.edu.cn/xkjs/bkzy.htm", kind: "major-catalog", note: "学校官网本科专业一览表" },
    { label: "本科生招生信息网", url: "https://zsb.hust.edu.cn/", kind: "admissions", note: "招生政策、计划和专业入口" },
    { label: "就业信息网", url: "https://job.hust.edu.cn/", kind: "employment", note: "后续用于招聘活动和就业数据核验" },
  ],
  tongji: [
    { label: "招生专业", url: "https://bkzs.tongji.edu.cn/", kind: "admissions", note: "本科招生网含招生专业导航" },
    { label: "专业设置", url: "https://jwc.tongji.edu.cn/zysz/list.htm", kind: "major-catalog", note: "本科生院专业设置列表" },
    { label: "就业信息网", url: "https://tj91.tongji.edu.cn/", kind: "employment", note: "后续用于招聘活动和就业数据核验" },
  ],
  sustech: [
    { label: "院系与专业", url: "https://www.sustech.edu.cn/zh/college.html", kind: "major-catalog", note: "学校官网院系和本科专业入口" },
    { label: "本科招生网", url: "https://zs.sustech.edu.cn/", kind: "admissions", note: "招生政策、专业和培养模式入口" },
    { label: "就业指导中心", url: "https://career.sustech.edu.cn/", kind: "employment", note: "后续用于招聘活动和就业数据核验" },
  ],
  ztbu: [
    { label: "学校官网", url: "https://www.ztbu.edu.cn/", kind: "school", note: "学校官网入口，可从院部设置继续核验专业归属" },
    { label: "招生网", url: "https://zsb.ztbu.edu.cn/", kind: "admissions", note: "招生章程、招生计划、历年分数和录取查询入口" },
    { label: "院部设置", url: "https://www.ztbu.edu.cn/html/828/", kind: "major-catalog", note: "学校官网院部设置入口，可继续进入学院核验专业归属" },
    { label: "就业信息网", url: "https://zzgsxy.goworkla.cn/", kind: "employment", note: "宣讲会、双选会、就业新闻和用人单位服务入口" },
  ],
  nfu: [
    { label: "学校官网", url: "https://www.nfu.edu.cn/", kind: "school", note: "学校官网入口，可继续进入院系和信息公开栏目" },
    { label: "招生网", url: "https://zsb.nfu.edu.cn/", kind: "admissions", note: "普高招生、专升本招生、院系师资和专业信息入口" },
    { label: "院系师资", url: "https://zsb.nfu.edu.cn/yxsz.htm", kind: "major-catalog", note: "招生网院系师资入口，适合继续进入学院核验专业与培养方向" },
    { label: "就业指导中心", url: "https://cddc.nfu.edu.cn/", kind: "employment", note: "职位信息、校园宣讲会、校园招聘会和就业质量年度报告入口" },
  ],
  wtbu: [
    { label: "学校官网", url: "https://www.wtbu.edu.cn/", kind: "school", note: "学校官网入口，可从学院页面继续核验专业设置" },
    { label: "招生网", url: "https://goto.wtbu.edu.cn/", kind: "admissions", note: "招生快讯、招生咨询和专业报考入口" },
    { label: "专业设置", url: "https://goto.wtbu.edu.cn/page/detail/FSBCMA/11455/45409", kind: "major-catalog", note: "学校官网导航公开的专业设置入口，可继续核验具体专业介绍" },
    { label: "就业信息网", url: "https://wtbu.91wllm.cn/", kind: "employment", note: "招聘信息、招聘会、宣讲会、实习岗位和档案查询入口" },
  ],
  cdjcc: [
    { label: "学校官网", url: "https://www.scujcc.cn/", kind: "school", note: "学校官网入口，含招生服务和就业服务导航" },
    { label: "招生网", url: "https://zs.scujcc.edu.cn/", kind: "admissions", note: "招生动态、录取查询、专业选择和学院专业入口" },
    { label: "专业选择", url: "https://zs.scujcc.edu.cn/zyxz.htm", kind: "major-catalog", note: "招生网专业选择入口，用于继续查看学院专业和报考方向" },
    { label: "就业服务平台", url: "https://jyxxgl.cdjcc.edu.cn/", kind: "employment", note: "校园招聘、就业快讯、政策法规和学院专业入口" },
  ],
  hustwenhua: [
    { label: "学校官网", url: "https://www.hustwenhua.net/", kind: "school", note: "学校官网入口，含招生网和就业网导航" },
    { label: "招生就业处", url: "https://zhaosheng.hustwenhua.net/", kind: "admissions", note: "招生信息、学部专业、招生计划和录取查询入口" },
    { label: "学部专业", url: "https://zhaosheng.hustwenhua.net/xbzy.htm", kind: "major-catalog", note: "招生就业处学部专业入口，适合先核验开设专业和学院归属" },
    { label: "就业网", url: "https://wenhua.91wllm.com/", kind: "employment", note: "就业指导中心入口，用于继续核验宣讲会和双选会" },
  ],
  wsyu: [
    { label: "学校官网", url: "https://www.wsyu.edu.cn/", kind: "school", note: "学校官网入口，可从院部和信息公开继续核验" },
    { label: "招生网", url: "https://zs.wsyu.edu.cn/", kind: "admissions", note: "招生动态、教授讲专业和招生计划入口" },
    { label: "专业介绍", url: "https://zs.wsyu.edu.cn/2092/list.htm", kind: "major-catalog", note: "招生网专业介绍入口，可继续查看学院专业和招生方向" },
    { label: "就业信息网", url: "https://wsyu.91wllm.cn/", kind: "employment", note: "职位信息、招聘公告、招聘会和宣讲会入口" },
  ],
  peihua: [
    { label: "学校官网", url: "https://www.peihua.cn/", kind: "school", note: "学校官网入口，可继续进入学院、招生和信息公开栏目" },
    { label: "招生信息网", url: "https://www.peihua.edu.cn/zhaosheng/", kind: "admissions", note: "专业介绍、招生简章、招生计划和录取查询入口" },
    { label: "本科专业", url: "https://www.peihua.edu.cn/zhaosheng/zyjs/bkzy.htm", kind: "major-catalog", note: "招生信息网本科专业目录，含学院、专业和专业建设说明" },
    { label: "就业信息网", url: "https://peihua.bysjy.com.cn/index", kind: "employment", note: "通知公告、招聘指南、校园招聘服务和双选会入口" },
  ],
  zjsru: [
    { label: "学校官网", url: "https://www.zjsru.edu.cn/", kind: "school", note: "学校官网入口，含本科生招生网和就业创业信息网导航" },
    { label: "招生就业", url: "https://www.zjsru.edu.cn/zsjy2.htm", kind: "admissions", note: "招生指南、应用型专业和就业服务入口" },
    { label: "院系设置", url: "https://www.zjsru.edu.cn/yxsz1.htm", kind: "major-catalog", note: "学校官网院系设置入口，适合继续进入学院核验专业信息" },
    { label: "就业创业信息网", url: "https://zjsru.jysd.com/", kind: "employment", note: "学校就业创业信息平台入口，可继续查招聘公告和就业报告" },
  ],
  hhstu: [
    { label: "学校官网", url: "https://www.hhstu.edu.cn/", kind: "school", note: "学校官网入口，可继续进入招生就业和信息公开栏目" },
    { label: "招生信息网", url: "https://www.hhstu.cn/", kind: "admissions", note: "招生电话、招生动态和专业报考入口" },
    { label: "招生专业", url: "https://www.hhstu.cn/zszy.htm", kind: "major-catalog", note: "招生信息网招生专业入口，可继续核验专业名称和招生计划" },
    { label: "就业信息网", url: "https://job.hhstu.edu.cn/", kind: "employment", note: "职位、双选会、宣讲会和就业指导入口" },
  ],
  sju: [
    { label: "学校官网", url: "https://www.sju.edu.cn/", kind: "school", note: "学校官网入口，含招生就业、信息公开和院系导航" },
    { label: "招生网", url: "https://zsb.sju.edu.cn/", kind: "admissions", note: "学院指南、招生计划和专业入口" },
    { label: "学院指南", url: "https://zsb.sju.edu.cn/2814/list.htm", kind: "major-catalog", note: "招生网学院指南入口，可继续进入学院核验本科专业" },
    { label: "就业信息服务平台", url: "https://sju.91job.org.cn/", kind: "employment", note: "岗位、招聘会和招聘公告入口" },
  ],
  cqytu: [
    { label: "学校官网", url: "https://www.cqytxy.edu.cn/", kind: "school", note: "学校官网入口，可继续进入学院和信息公开栏目" },
    { label: "招生网", url: "https://www.cqytu.com/", kind: "admissions", note: "重庆移通学院招生网入口" },
    { label: "专业介绍", url: "https://www.cqytu.com/zhuanye/", kind: "major-catalog", note: "招生网专业介绍入口，可继续查看专业方向和招生计划" },
    { label: "就业信息网", url: "https://cqyti.cqbys.com/", kind: "employment", note: "就业信息、双选会和校招指南入口" },
  ],
  shengda: [
    { label: "学校官网", url: "https://www.shengda.edu.cn/", kind: "school", note: "学校官网入口，可继续进入院系和专业设置" },
    { label: "招生网", url: "https://www.shengda.edu.cn/zhao/index/zszc.htm", kind: "admissions", note: "招生章程、招生政策和招生专业目录导航入口" },
    { label: "招生专业目录", url: "https://www.shengda.edu.cn/zhao/index/zszyml.htm", kind: "major-catalog", note: "招生网专业目录入口，含本专科专业、学制、层次和学费字段" },
    { label: "就业信息网", url: "https://job.shengda.edu.cn/", kind: "employment", note: "招聘活动、宣讲会、双选会、就业质量报告和推荐单位入口" },
  ],
  zzuli: [
    { label: "学校官网", url: "https://www.zzuli.edu.cn/", kind: "school", note: "学校官方主页，含本科招生、就业创业、学院和信息公开导航" },
    { label: "本科招生信息网", url: "https://zhaosheng.zzuli.edu.cn/", kind: "admissions", note: "本科招生、招生计划、往年高招和报考入口" },
    { label: "学院/专业入口", url: "https://www.zzuli.edu.cn/", kind: "major-catalog", note: "官网机构设置与招生网专业入口，可继续进入学院核验专业" },
    { label: "就业创业信息网", url: "https://job.zzuli.edu.cn/", kind: "employment", note: "推荐单位、在线招聘、双选会、宣讲会和用人单位报名入口" },
    { label: "双选会列表", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635", kind: "employment", note: "就业创业信息网公开双选会列表，含行业专场、时间和场地" },
    { label: "生源速览", url: "https://job.zzuli.edu.cn/module/newslist/id-1112/nid-1653", kind: "report", note: "就业创业信息网生源概况入口，含 2021-2025 届生源列表" },
  ],
};

const verifiedSchoolOutcomeProfiles: SchoolOutcomeProfile[] = [
  {
    id: "zzuli",
    name: "郑州轻工业大学",
    city: "郑州",
    dataNote: "已接入学校官网、就业创业信息网、双选会列表和生源速览入口。就业网可直接核验招聘活动；企业名单和专业薪资仍需打开活动详情、就业报告或企业官网岗位逐项补证据。",
    officialLinks: schoolOfficialLinksById.zzuli,
    evidenceSources: [
      {
        title: "就业创业信息网公开入口",
        year: 2026,
        sourceName: "郑州轻工业大学就业创业信息网",
        url: "https://job.zzuli.edu.cn/",
        status: "verified",
        metrics: [
          { label: "就业信息栏目", value: "推荐单位 / 在线招聘 / 双选会 / 宣讲会", note: "官网导航公开栏目，可作为招聘活动入口" },
          { label: "用人单位入口", value: "在线招聘申请 / 宣讲会申请 / 双选会报名", note: "用人单位发布和报名入口在就业网公开" },
          { label: "近期就业活动", value: "江苏盐城、荆门、洛阳等专场活动", note: "就业网首页新闻显示 2026 届就业活动持续更新" },
        ],
      },
      {
        title: "2026届双选会列表",
        year: 2026,
        sourceName: "郑州轻工业大学就业创业信息网",
        url: "https://job.zzuli.edu.cn/module/milkround/nid-1635",
        status: "verified",
        metrics: [
          { label: "双选会条目", value: "57 条", note: "就业网双选会列表公开口径" },
          { label: "行业分场", value: "信息、机械电气、能源化工、经管政法、建筑环境、艺术语言、数学数据", note: "按 2026 届公开专场标题归并" },
          { label: "时间覆盖", value: "2025-10 至 2026-04", note: "列表首屏公开条目，非全年完整统计" },
        ],
      },
      {
        title: "生源速览列表",
        year: 2025,
        sourceName: "郑州轻工业大学就业创业信息网",
        url: "https://job.zzuli.edu.cn/module/newslist/id-1112/nid-1653",
        status: "verified",
        metrics: [
          { label: "生源概况", value: "2021-2025 届", note: "就业网生源速览列表公开 5 篇年度生源材料" },
          { label: "校内院系入口", value: "电气、机电、食品、材料、艺术、经管、计算机、软件、政法等", note: "生源页同时公开院系链接，可继续进入学院核验专业" },
        ],
      },
    ],
    campusRecruitingYears: [
      {
        year: 2026,
        status: "verified",
        source: "郑州轻工业大学就业创业信息网 2026 届双选会列表；当前已核验活动标题、时间和场地，参会企业名单需进入详情页继续解析。",
        companies: [],
        events: [
          { title: "郑州轻工业大学2026届建筑环境类毕业生专场双选会", date: "2026-04-23", venue: "科学校区办公楼一楼就业服务大厅", category: "建筑环境", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届艺术类/语言类毕业生专场双选", date: "2026-04-09", venue: "东风校区图书馆广场", category: "艺术语言", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届政法/经管类毕业生就业专场双选会", date: "2026-04-09", venue: "科学校区办公楼一楼就业服务大厅", category: "政法经管", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届数学与数据科学类毕业生专场双选会", date: "2026-04-09", venue: "东风校区体育场", category: "数学数据", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届信息学部毕业生专场双选会", date: "2026-03-26", venue: "科学校区图书馆南广场", category: "信息技术", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届机械、电气行业毕业生就业专场双选会", date: "2026-03-25", venue: "东风校区图书馆广场", category: "机械电气", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届毕业生能源与化工学部专场双选会邀请函", date: "2026-03-19", venue: "科学校区活动中心楼西广场", category: "能源化工", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "豫荐未来·青春启航 郑州轻工业大学2026届毕业生冬季空中双选会", date: "2026-01-08 至 2026-03-01", venue: "线上", category: "综合空中双选", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "郑州轻工业大学2026届计算机/人工智能/软件/电子信息类高校毕业生就业专场双选会", date: "2025-11-13", venue: "科学校区图书馆南广场", category: "计算机电子", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
          { title: "2026届经管政法类毕业生就业专场双选会", date: "2025-10-30", venue: "经济与管理学院一楼大厅", category: "经管政法", status: "verified", url: "https://job.zzuli.edu.cn/module/milkround/nid-1635" },
        ],
      },
      { year: 2025, status: "pending", source: "就业网生源速览已定位；年度就业质量报告和参会企业明细待解析。", companies: [] },
    ],
    majors: [
      {
        id: "zzuli-food",
        name: "食品科学与工程",
        cluster: "食品 / 生物 / 轻工",
        destinations: ["食品研发助理", "食品检验员", "质量管理", "生产管培生"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "5-12K/月", source: "食品/快消岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["Unilever", "美的", "京东", "阿里巴巴"],
      },
      {
        id: "zzuli-mechanical",
        name: "机械设计制造及其自动化",
        cluster: "机械 / 智能制造",
        destinations: ["设备工程师", "工艺工程师", "智能制造工程师", "质量工程师"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "7-18K/月", source: "制造/设备岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["美的", "比亚迪", "华为", "小米"],
      },
      {
        id: "zzuli-electrical",
        name: "电气工程及其自动化",
        cluster: "电气 / 自动化 / 能源",
        destinations: ["电气工程师", "自动化工程师", "储能运维", "设备维护工程师"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "7-18K/月", source: "电气/能源岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["华为", "比亚迪", "美的", "京东"],
      },
      {
        id: "zzuli-cs",
        name: "计算机科学与技术",
        cluster: "计算机 / 软件 / AI",
        destinations: ["软件研发工程师", "测试工程师", "数据分析师", "AI 应用工程师"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "7-18K/月", source: "软件/测试/数据岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["华为", "腾讯", "阿里巴巴", "百度", "京东"],
      },
      {
        id: "zzuli-accounting",
        name: "会计学",
        cluster: "经管 / 财务 / 审计",
        destinations: ["会计专员", "审计助理", "财务共享专员", "税务专员"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "6-14K/月", source: "财会/审计岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["德勤", "普华永道", "京东", "蚂蚁集团"],
      },
      {
        id: "zzuli-product-design",
        name: "产品设计",
        cluster: "设计 / 工业设计 / 内容产品",
        destinations: ["产品设计师", "交互设计师", "品牌视觉设计", "工业设计助理"],
        employmentRate: { label: "待报告解析", source: "就业质量报告或学院去向明细待接入", status: "pending" },
        averageSalary: { label: "7-18K/月", source: "设计/内容产品岗位市场参考，每日回企业官网岗位核验", status: "pending" },
        recruiterSearchTargets: ["小米", "IKEA", "L'Oreal", "腾讯"],
      },
    ],
  },
  {
    id: "tsinghua",
    name: "清华大学",
    city: "北京",
    dataNote: "当前先给出字段结构和企业官网反查入口；就业率、平均工资、到校企业需接入学校就业质量报告与就业中心宣讲会日历后再填充。",
    officialLinks: schoolOfficialLinksById.tsinghua,
    evidenceSources: [
      {
        title: "2024届毕业生就业数据",
        year: 2024,
        sourceName: "清华大学新闻网",
        url: "https://www.tsinghua.edu.cn/info/1177/116404.htm",
        status: "verified",
        metrics: [
          { label: "出国/境深造", value: "9.6%", note: "校级总体口径，本科生为 18.4%" },
          { label: "国内重点单位", value: "85%+", note: "国内重要领域重点单位就业率" },
          { label: "京外就业", value: "56.2%", note: "连续十年超过 50%" },
        ],
      },
    ],
    campusRecruitingYears: [
      { year: 2024, status: "verified", source: "清华大学2024届毕业生就业数据", companies: ["华为", "中芯国际", "国家电网", "中国航天科技集团", "中国兵器工业集团", "中国核工业集团", "比亚迪", "腾讯", "阿里巴巴"] },
      { year: 2025, status: "pending", source: pendingCampusCalendar, companies: [] },
    ],
    majors: [
      {
        id: "tsinghua-cs",
        name: "计算机科学与技术",
        cluster: "计算机 / AI",
        destinations: ["AI 算法工程师", "后端研发工程师", "基础架构工程师", "大模型应用工程师"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["字节跳动", "腾讯", "阿里巴巴", "百度", "华为"],
      },
      {
        id: "tsinghua-auto",
        name: "自动化",
        cluster: "机器人 / 智能系统",
        destinations: ["机器人工程师", "自动驾驶算法工程师", "控制系统工程师", "嵌入式工程师"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["华为", "小米", "百度", "字节跳动"],
      },
    ],
  },
  {
    id: "zju",
    name: "浙江大学",
    city: "杭州",
    dataNote: "杭州互联网与智能制造机会密集；具体毕业去向和薪资仍应以学校就业质量报告、学院就业数据和企业宣讲会日历为准。",
    officialLinks: schoolOfficialLinksById.zju,
    evidenceSources: [
      {
        title: "毕业生就业质量年度报告栏目",
        year: 2024,
        sourceName: "浙江大学信息公开网",
        url: "https://www.zju.edu.cn/xxgk/17975/list.htm",
        status: "partial",
        metrics: [
          { label: "报告栏目", value: "已定位", note: "需继续解析年度 PDF 或就业平台 JS 数据" },
          { label: "就业平台", value: "已定位", note: "官方就业指导与服务中心入口可用于后续招聘活动 adapter" },
        ],
      },
      {
        title: "2024届夏季空中双选会",
        year: 2024,
        sourceName: "浙江大学就业服务平台",
        url: "https://www.career.zju.edu.cn/jyxt/sczp/kzzpgl/ckKzzpsqdw.zf?zphbh=197F60EC6919301DE0653A68DD0E9B18",
        status: "verified",
        metrics: [
          { label: "招聘单位", value: "46 家", note: "活动页汇总口径，非全年校园招聘总数" },
          { label: "活动周期", value: "2024.05.31-06.14", note: "2024届高校毕业生就业促进周系列活动" },
        ],
      },
    ],
    campusRecruitingYears: [
      { year: 2026, status: "pending", source: pendingCampusCalendar, companies: [] },
      { year: 2024, status: "verified", source: "浙江大学2024届夏季空中双选会：46 家招聘单位；企业名单需接入活动详情页解析。", companies: [] },
    ],
    majors: [
      {
        id: "zju-se",
        name: "软件工程",
        cluster: "软件 / 产品工程",
        destinations: ["后端研发工程师", "前端研发工程师", "产品经理", "数据工程师"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["阿里巴巴", "字节跳动", "腾讯", "美团", "京东"],
      },
      {
        id: "zju-ai",
        name: "人工智能",
        cluster: "AI / 数据智能",
        destinations: ["AIGC 算法工程师", "机器学习工程师", "推荐算法工程师", "数据科学家"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["字节跳动", "阿里巴巴", "百度", "华为", "腾讯"],
      },
    ],
  },
  {
    id: "uestc",
    name: "电子科技大学",
    city: "成都",
    dataNote: "电子信息、通信、网络安全方向适合和硬件、通信、云计算企业官网岗位联动；到校招聘记录仍需就业中心日历核验。",
    officialLinks: schoolOfficialLinksById.uestc,
    evidenceSources: [
      {
        title: "2024届毕业生就业质量年度报告",
        year: 2024,
        sourceName: "电子科技大学信息公开网",
        url: "https://xxgkw.uestc.edu.cn/info/1078/6257.htm",
        status: "partial",
        metrics: [
          { label: "报告入口", value: "已定位", note: "信息公开页确认 2024 届报告入口" },
          { label: "年度报告列表", value: "2013-2024", note: "学校信息公开栏目提供历年报告索引" },
        ],
      },
    ],
    campusRecruitingYears: [
      { year: 2026, status: "pending", source: pendingCampusCalendar, companies: [] },
      { year: 2024, status: "pending", source: "2024届就业质量报告入口已定位；企业名单需解析报告附件或就业中心招聘会日历。", companies: [] },
    ],
    majors: [
      {
        id: "uestc-ee",
        name: "电子信息工程",
        cluster: "电子信息 / 通信",
        destinations: ["通信研发工程师", "嵌入式软件工程师", "芯片验证工程师", "硬件产品经理"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["华为", "小米", "京东", "腾讯"],
      },
      {
        id: "uestc-security",
        name: "网络空间安全",
        cluster: "安全 / 网络工程",
        destinations: ["安全工程师", "风控算法工程师", "云安全工程师", "网络工程师"],
        employmentRate: { label: "待接入", source: pendingEmploymentReport, status: "pending" },
        averageSalary: { label: "待接入", source: pendingSalarySource, status: "pending" },
        recruiterSearchTargets: ["腾讯", "华为", "百度", "阿里巴巴"],
      },
    ],
  },
  {
    id: "xidian",
    name: "西安电子科技大学",
    city: "西安",
    dataNote: "西电官方 2024 届就业质量报告披露了学校级毕业去向落实率、行业/岗位流向、重点签约单位和本科专业规模；报告未披露专业级薪酬，页面继续用市场薪资代理作参考。",
    officialLinks: schoolOfficialLinksById.xidian,
    evidenceSources: [
      {
        title: "2024届毕业生就业质量年度报告",
        year: 2024,
        sourceName: "西安电子科技大学就业信息网",
        url: "https://job.xidian.edu.cn/attachment/xidian/ueditor/file/20250126/3369_%E8%A5%BF%E5%AE%89%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A62024%E5%B1%8A%E6%AF%95%E4%B8%9A%E7%94%9F%E5%B0%B1%E4%B8%9A%E8%B4%A8%E9%87%8F%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf",
        status: "verified",
        metrics: [
          { label: "毕业去向落实率", value: "97.04%", note: "截至 2024 年 12 月；本科 95.86%，研究生 98.44%" },
          { label: "本科主要去向", value: "升学 54.79%", note: "本科单位就业 40.62%，以升学为主" },
          { label: "研究生主要去向", value: "单位就业 95.04%", note: "研究生就业以单位就业为主" },
          { label: "重点单位就业", value: "52.49%", note: "行业领军企业就业 3106 人；国家战略导向单位 1881 人" },
        ],
      },
      {
        title: "2024届行业与岗位流向",
        year: 2024,
        sourceName: "西安电子科技大学就业质量报告",
        url: "https://job.xidian.edu.cn/attachment/xidian/ueditor/file/20250126/3369_%E8%A5%BF%E5%AE%89%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A62024%E5%B1%8A%E6%AF%95%E4%B8%9A%E7%94%9F%E5%B0%B1%E4%B8%9A%E8%B4%A8%E9%87%8F%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf",
        status: "verified",
        metrics: [
          { label: "本科行业", value: "制造业 33.35%", note: "信息传输、软件和信息技术服务业 32.49%" },
          { label: "研究生行业", value: "信息技术 44.89%", note: "科学研究和技术服务业 19.25%，制造业 17.91%" },
          { label: "本科岗位", value: "电子 29.53%", note: "计算机与数据处理 25.52%，互联网开发及应用 9.79%" },
          { label: "研究生岗位", value: "电子 30.85%", note: "计算机与数据处理 27.50%，互联网开发及应用 15.47%" },
        ],
      },
    ],
    campusRecruitingYears: [
      {
        year: 2024,
        status: "verified",
        source: "西电 2024 届签约集中单位统计；这是签约去向证据，不等同于全年到校招聘会完整名单。",
        companies: ["华为", "中国电子科技集团", "中国航空工业集团", "阿里巴巴", "中兴通讯", "比亚迪", "腾讯", "百度", "美团", "小米", "抖音视界", "科大讯飞"],
      },
      { year: 2025, status: "pending", source: pendingCampusCalendar, companies: [] },
    ],
    majors: [
      {
        id: "xidian-security",
        name: "网络空间安全",
        cluster: "网络安全 / 信息安全",
        destinations: ["安全工程师", "云安全工程师", "风控算法工程师", "网络工程师"],
        employmentRate: { label: "本科总体 95.86%", source: "西电2024报告校级本科口径；专业级落实率待接入", status: "verified" },
        averageSalary: { label: "报告未披露", source: "官方报告未披露薪酬；使用市场薪资代理参考", status: "pending" },
        recruiterSearchTargets: ["腾讯", "华为", "百度", "阿里巴巴", "京东"],
      },
      {
        id: "xidian-ai",
        name: "人工智能",
        cluster: "人工智能 / 计算机",
        destinations: ["AI 算法工程师", "机器学习工程师", "推荐算法工程师", "数据科学家"],
        employmentRate: { label: "本科总体 95.86%", source: "人工智能学院本科 310 人；专业级落实率待接入", status: "verified" },
        averageSalary: { label: "报告未披露", source: "官方报告未披露薪酬；使用市场薪资代理参考", status: "pending" },
        recruiterSearchTargets: ["华为", "百度", "腾讯", "京东", "美团"],
      },
      {
        id: "xidian-cs",
        name: "计算机科学与技术",
        cluster: "计算机 / 软件",
        destinations: ["后端研发工程师", "基础架构工程师", "数据工程师", "AI 应用工程师"],
        employmentRate: { label: "本科总体 95.86%", source: "计算机科学与技术学院本科 948 人；专业级落实率待接入", status: "verified" },
        averageSalary: { label: "报告未披露", source: "官方报告未披露薪酬；使用市场薪资代理参考", status: "pending" },
        recruiterSearchTargets: ["华为", "阿里巴巴", "腾讯", "百度", "美团", "京东"],
      },
    ],
  },
];

export const schoolOutcomeProfiles: SchoolOutcomeProfile[] = [
  ...verifiedSchoolOutcomeProfiles,
  ...buildOfficialEntrySchoolProfiles(),
];

function buildOfficialEntrySchoolProfiles(): SchoolOutcomeProfile[] {
  const verifiedIds = new Set(verifiedSchoolOutcomeProfiles.map((school) => school.id));
  return universities
    .filter((school) => !verifiedIds.has(school.id))
    .map((school) => ({
      id: school.id,
      name: school.name,
      city: school.city,
      dataNote: "已先接入学校公开专业和招生入口；就业率、平均工资、年度到校企业等字段等待就业质量报告和就业中心日历解析。",
      officialLinks: schoolOfficialLinksById[school.id] ?? [],
      evidenceSources: [],
      campusRecruitingYears: [
        { year: 2026, status: "pending" as const, source: pendingCampusCalendar, companies: [] },
      ],
      majors: school.majors.map((major) => buildOfficialEntryMajor(school.id, major)),
    }));
}

function buildOfficialEntryMajor(schoolId: string, majorName: string): SchoolOutcomeMajor {
  const recruiterSearchTargets = getDefaultRecruiterTargets(majorName);
  return {
    id: `${schoolId}-${majorName.toLowerCase().replace(/[^\da-z\u4e00-\u9fa5]+/g, "-")}`,
    name: majorName,
    cluster: getDefaultMajorCluster(majorName),
    destinations: getDefaultMajorDestinations(majorName),
    employmentRate: { label: "待解析", source: pendingEmploymentReport, status: "pending" },
    averageSalary: { label: "待解析", source: pendingSalarySource, status: "pending" },
    recruiterSearchTargets,
  };
}

function getDefaultMajorCluster(majorName: string) {
  if (/计算机|软件|人工智能|数据/.test(majorName)) return "计算机 / AI / 数据";
  if (/护理|康复|口腔|临床|药学|健康|家政/.test(majorName)) return "护理 / 医疗 / 康养服务";
  if (/会计|财务|审计|金融|税收/.test(majorName)) return "会计 / 金融 / 审计";
  if (/电子商务|跨境电子商务|物流|供应链|市场营销|工商管理/.test(majorName)) return "商科 / 电商 / 运营";
  if (/酒店|旅游|会展|航空服务/.test(majorName)) return "酒店 / 航旅 / 服务";
  if (/新闻|广告|网络与新媒体|传媒|数字媒体/.test(majorName)) return "传媒 / 内容 / 数字媒体";
  if (/通信|电子|集成电路|微电子|网络/.test(majorName)) return "电子信息 / 通信 / 安全";
  if (/自动化|机器|机械|智能制造|飞行器|航空/.test(majorName)) return "自动化 / 机器人 / 智能制造";
  if (/生物|医学|能源|电气/.test(majorName)) return "生命健康 / 能源工程";
  if (/工业设计|设计|数字媒体/.test(majorName)) return "设计 / 内容 / 产品";
  return "学校公开专业";
}

function getDefaultMajorDestinations(majorName: string) {
  if (/人工智能|计算机|软件|数据/.test(majorName)) return ["AI 算法工程师", "软件研发工程师", "数据分析师", "产品经理"];
  if (/护理|康复|口腔|临床|药学/.test(majorName)) return ["护士", "医药代表", "健康管理师", "医疗运营"];
  if (/家政|健康服务/.test(majorName)) return ["社区养老运营", "家政服务管理", "康养项目专员", "客户服务主管"];
  if (/会计|财务|审计|税收/.test(majorName)) return ["审计助理", "财务专员", "税务专员", "会计管培生"];
  if (/金融/.test(majorName)) return ["银行客户经理", "风控专员", "金融产品运营", "投资助理"];
  if (/电子商务|跨境电子商务/.test(majorName)) return ["电商运营", "跨境电商运营", "直播运营", "供应链运营"];
  if (/物流|供应链/.test(majorName)) return ["物流运营", "供应链专员", "仓配运营", "采购专员"];
  if (/市场营销|工商管理/.test(majorName)) return ["市场运营", "销售管培生", "用户增长运营", "门店运营"];
  if (/酒店|旅游|会展/.test(majorName)) return ["酒店运营管培生", "收益管理助理", "会展执行", "客户体验专员"];
  if (/新闻|广告|网络与新媒体|传媒/.test(majorName)) return ["内容运营", "新媒体运营", "品牌策划", "媒介投放"];
  if (/通信|电子|集成电路|微电子/.test(majorName)) return ["通信研发工程师", "芯片验证工程师", "嵌入式工程师", "硬件工程师"];
  if (/网络|安全/.test(majorName)) return ["安全工程师", "云安全工程师", "网络工程师", "风控工程师"];
  if (/自动化|机器|机械|飞行器|航空/.test(majorName)) return ["机器人工程师", "控制系统工程师", "自动驾驶工程师", "工程项目管理"];
  if (/工业设计|数字媒体|设计/.test(majorName)) return ["产品设计师", "交互设计师", "内容产品", "品牌体验"];
  return ["打开学校专业入口核验", "按专业名称搜索企业官网岗位", "对照就业质量报告"];
}

function getDefaultRecruiterTargets(majorName: string) {
  if (/人工智能|计算机|软件|数据/.test(majorName)) return ["字节跳动", "腾讯", "阿里巴巴", "百度", "华为"];
  if (/护理|康复|口腔|临床|药学|家政|健康/.test(majorName)) return ["美团", "京东", "阿里巴巴", "腾讯", "Amazon"];
  if (/会计|财务|审计|金融|税收/.test(majorName)) return ["普华永道", "德勤", "蚂蚁集团", "京东", "阿里巴巴"];
  if (/电子商务|跨境电子商务|物流|供应链|市场营销|工商管理/.test(majorName)) return ["京东", "阿里巴巴", "Amazon", "美团", "拼多多"];
  if (/酒店|旅游|会展/.test(majorName)) return ["Marriott", "Hilton", "Hyatt", "Cathay Pacific", "美团"];
  if (/新闻|广告|网络与新媒体|传媒/.test(majorName)) return ["字节跳动", "腾讯", "哔哩哔哩", "网易游戏", "阿里巴巴"];
  if (/通信|电子|集成电路|微电子|网络|安全/.test(majorName)) return ["华为", "腾讯", "百度", "京东", "小米"];
  if (/自动化|机器|机械|飞行器|航空|智能制造/.test(majorName)) return ["华为", "小米", "美的", "比亚迪", "京东"];
  if (/工业设计|数字媒体|设计/.test(majorName)) return ["腾讯", "网易游戏", "哔哩哔哩", "小米", "IKEA"];
  return ["华为", "腾讯", "阿里巴巴", "Amazon", "Microsoft"];
}

export function getRecruiterSources(major: SchoolOutcomeMajor) {
  return major.recruiterSearchTargets
    .map((name) => officialCompanySources.find((source) => source.name === name))
    .filter((source): source is OfficialCompanySource => Boolean(source));
}
