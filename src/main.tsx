import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
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
  Download,
  FileText,
  Filter,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  Layers3,
  LineChart,
  Medal,
  MessageSquare,
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
import { jobs } from "./data/jobs";
import { majorPaths, startupTracks } from "./data/gaokao";
import { initialProfile, selectableSkills } from "./data/profile";
import { getBadges, getLearningAdvice, getMarketInsights, getRecommendedJobs } from "./lib/analysis";
import { getEmploymentSignals, getFourYearPlan, scoreMajorPaths, scoreStartupTracks } from "./lib/gaokao";
import type { AppMode, JobCategory, Skill } from "./types";
import "./styles.css";

type MbtiDimension = "energy" | "info" | "decision" | "structure";
type MbtiAnswers = Record<MbtiDimension, "left" | "right">;

const categoryLabels: Record<JobCategory | "All", string> = {
  All: "全部岗位",
  "AI Engineering": "AI 工程",
  Backend: "后端",
  Frontend: "前端",
  Data: "数据算法",
  Infrastructure: "基础设施",
  Product: "产品",
  Design: "设计",
  Security: "安全",
};

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

function App() {
  const [mode, setMode] = useState<AppMode>("gaokao");
  const [activeNav, setActiveNav] = useState("overview");

  const navigate = (target: string, nextMode?: AppMode) => {
    if (nextMode) {
      setMode(nextMode);
    }
    setActiveNav(target);
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div className="life-os">
      <div className="dashboard-frame">
        <Sidebar mode={mode} activeNav={activeNav} onModeChange={setMode} onNavigate={navigate} />
        <main className="workspace">
          <TopCommand mode={mode} onModeChange={setMode} />
          {mode === "gaokao" ? <LifeDashboard /> : <TalentDashboard />}
        </main>
      </div>
    </div>
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
    { id: "overview", label: "人生总览", icon: Home, mode: "gaokao" as AppMode },
    { id: "mbti-test", label: "MBTI 画像", icon: Brain, mode: "gaokao" as AppMode },
    { id: "major-paths", label: "专业路径", icon: GraduationCap, mode: "gaokao" as AppMode },
    { id: "market-signals", label: "社会需求", icon: TrendingUp, mode: "gaokao" as AppMode },
    { id: "big-tech", label: "大厂机会", icon: Building2, mode: "gaokao" as AppMode },
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
          <h1>Nextwork</h1>
          <p>Life Planning OS</p>
        </div>
      </div>

      <div className="mode-tabs" aria-label="模式切换">
        <button className={mode === "gaokao" ? "active" : ""} onClick={() => onModeChange("gaokao")}>
          规划
        </button>
        <button className={mode === "talent" ? "active" : ""} onClick={() => onModeChange("talent")}>
          就业
        </button>
      </div>

      <NavGroup title="Main Menu" items={mainNav} activeNav={activeNav} onNavigate={onNavigate} />
      <NavGroup title="Career Tools" items={toolNav} activeNav={activeNav} onNavigate={onNavigate} />

      <div className="sidebar-upgrade">
        <ShieldCheck size={30} />
        <strong>数据照亮前途</strong>
        <p>从自我画像、就业需求和创业赛道倒推专业选择。</p>
        <button onClick={() => onNavigate("life-todos", "gaokao")}>
          今日任务
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

function TopCommand({ mode, onModeChange }: { mode: AppMode; onModeChange: (mode: AppMode) => void }) {
  return (
    <header className="command-card" id="overview">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h2>{mode === "gaokao" ? "人生规划仪表盘" : "就业能力雷达"}</h2>
        <span>{mode === "gaokao" ? "先认识自己，再判断社会需要什么。" : "把岗位要求拆成可行动的技能清单。"}</span>
      </div>
      <div className="command-actions">
        <label className="search-box">
          <Search size={17} />
          <input placeholder="搜索专业、岗位、能力" />
        </label>
        <button className="icon-button" aria-label="通知">
          <Bell size={18} />
        </button>
        <button className="primary-command" onClick={() => onModeChange(mode === "gaokao" ? "talent" : "gaokao")}>
          {mode === "gaokao" ? "查看就业匹配" : "返回人生规划"}
        </button>
      </div>
    </header>
  );
}

function LifeDashboard() {
  const [mbtiAnswers, setMbtiAnswers] = useState<MbtiAnswers>(defaultMbti);
  const [doneTodos, setDoneTodos] = useState<string[]>(["todo-identity", "todo-major-map"]);

  const mbtiCode = useMemo(() => getMbtiCode(mbtiAnswers), [mbtiAnswers]);
  const profile = mbtiProfiles[mbtiCode] ?? getFallbackMbtiProfile(mbtiCode);
  const traitProfile = useMemo(() => getTraitsFromMbti(mbtiCode), [mbtiCode]);
  const rankedMajors = useMemo(() => scoreMajorPaths(majorPaths, traitProfile, startupTracks), [traitProfile]);
  const rankedTracks = useMemo(() => scoreStartupTracks(startupTracks, traitProfile), [traitProfile]);
  const signals = useMemo(() => getEmploymentSignals(jobs), []);
  const recommendedJobs = useMemo(() => getRecommendedJobs(jobs, initialProfile), []);
  const badges = useMemo(() => getBadges(jobs, initialProfile), []);
  const topMajor = rankedMajors[0];
  const fourYearPlan = useMemo(() => getFourYearPlan(topMajor), [topMajor]);
  const todos = useMemo(() => getLifeTodos(mbtiCode, topMajor.group, rankedTracks[0].name), [mbtiCode, topMajor, rankedTracks]);
  const completion = Math.round((doneTodos.length / todos.length) * 100);

  const toggleTodo = (todoId: string) => {
    setDoneTodos((current) => (current.includes(todoId) ? current.filter((id) => id !== todoId) : [...current, todoId]));
  };

  return (
    <div className="content-grid">
      <section className="center-stack">
        <HeroPanel mbtiCode={mbtiCode} profileName={profile.name} topMajor={topMajor.group} topTrack={rankedTracks[0].name} />

        <div className="stats-grid">
          <StatCard icon={<Brain size={24} />} label="当前画像" value={profile.name} change={mbtiCode} tone="blue" />
          <StatCard icon={<GraduationCap size={24} />} label="专业优先级" value={topMajor.group} change={`${topMajor.score}% fit`} tone="green" />
          <StatCard icon={<Flame size={24} />} label="创业赛道" value={rankedTracks[0].name} change={`${rankedTracks[0].score}% heat`} tone="yellow" />
          <StatCard icon={<Building2 size={24} />} label="大厂入口" value={recommendedJobs[0].job.companyName} change={`${recommendedJobs[0].badge.matchScore}% match`} tone="purple" />
        </div>

        <section className="panel two-column" id="mbti-test">
          <div>
            <PanelHeader kicker="Step 01" title="MBTI 快速画像" icon={<Brain size={20} />} />
            <div className="question-list">
              {mbtiQuestions.map((question) => (
                <div key={question.id} className="question-row">
                  <h3>{question.title}</h3>
                  <div className="choice-pair">
                    <ChoiceButton active={mbtiAnswers[question.id] === "left"} onClick={() => setMbtiAnswers({ ...mbtiAnswers, [question.id]: "left" })} option={question.left} />
                    <ChoiceButton active={mbtiAnswers[question.id] === "right"} onClick={() => setMbtiAnswers({ ...mbtiAnswers, [question.id]: "right" })} option={question.right} />
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
          </div>
        </section>

        <section className="panel" id="major-paths">
          <PanelHeader kicker="Step 02" title="从就业终局倒推专业路径" icon={<GraduationCap size={20} />} />
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

        <section className="panel split-panel" id="market-signals">
          <div>
            <PanelHeader kicker="Step 03" title="社会需求信号" icon={<LineChart size={20} />} />
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

        <section className="panel" id="big-tech">
          <PanelHeader kicker="Big Tech" title="大厂岗位推荐" icon={<BriefcaseBusiness size={20} />} />
          <div className="table-actions">
            <button>
              <Filter size={16} />
              筛选
            </button>
            <button>
              <Download size={16} />
              导出
            </button>
          </div>
          <div className="job-list">
            {recommendedJobs.slice(0, 6).map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div className="company-avatar">{job.companyName.slice(0, 1)}</div>
                <div>
                  <h3>{job.companyName} · {job.title}</h3>
                  <p>{job.department} · {job.location} · {job.direction}</p>
                </div>
                <span className={badge.status}>{badge.matchScore}%</span>
              </article>
            ))}
          </div>
        </section>
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
        </section>

        <section className="panel" id="life-todos">
          <PanelHeader kicker="Life Todo" title="人生规划 Todo" icon={<CalendarCheck size={20} />} />
          <div className="todo-list">
            {todos.map((todo) => {
              const checked = doneTodos.includes(todo.id);
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

function TalentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "All">("All");
  const [profileSkills, setProfileSkills] = useState<Skill[]>(initialProfile.skills);

  const profile = useMemo(() => ({ ...initialProfile, skills: profileSkills }), [profileSkills]);
  const insights = useMemo(() => getMarketInsights(jobs), []);
  const badges = useMemo(() => getBadges(jobs, profile), [profile]);
  const recommended = useMemo(() => getRecommendedJobs(jobs, profile), [profile]);
  const advice = useMemo(() => getLearningAdvice(jobs, profile), [profile]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(jobs.map((job) => job.category)))] as Array<JobCategory | "All">, []);
  const filteredJobs = selectedCategory === "All" ? recommended : recommended.filter(({ job }) => job.category === selectedCategory);

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
          <div className="category-tabs">
            {categories.map((category) => (
              <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>
                {categoryLabels[category]}
              </button>
            ))}
          </div>
          <div className="job-list">
            {filteredJobs.slice(0, 8).map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div className="company-avatar">{job.companyName.slice(0, 1)}</div>
                <div>
                  <h3>{job.companyName} · {job.title}</h3>
                  <p>{job.department} · {job.location} · {job.direction}</p>
                </div>
                <span className={badge.status}>{badge.matchScore}%</span>
              </article>
            ))}
          </div>
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

function HeroPanel({ mbtiCode, profileName, topMajor, topTrack }: { mbtiCode: string; profileName: string; topMajor: string; topTrack: string }) {
  return (
    <section className="hero-card panel">
      <div>
        <p className="eyebrow">Career Operating System</p>
        <h2>先知道自己是谁，再知道社会需要什么</h2>
        <p>把当前就业岗位和热门创业赛道拆成可学习、可选择、可投递的路线图。</p>
        <div className="hero-actions">
          <a href="#mbti-test">开始画像</a>
          <a href="#major-paths">查看专业建议</a>
        </div>
      </div>
      <div className="hero-metric">
        <span>{mbtiCode} · {profileName}</span>
        <strong>{topMajor}</strong>
        <em>{topTrack}</em>
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
