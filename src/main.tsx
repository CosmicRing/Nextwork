import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Circle,
  Compass,
  Factory,
  Flame,
  GraduationCap,
  Medal,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
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
  All: "全部",
  "AI Engineering": "AI 工程",
  Backend: "后端",
  Frontend: "前端",
  Data: "数据算法",
  Infrastructure: "基础设施",
  Product: "产品",
  Design: "设计",
  Security: "安全",
};

const mbtiQuestions = [
  {
    id: "energy",
    title: "你从哪里获得能量？",
    left: { code: "E", label: "外部协作", desc: "和人讨论、组队、表达想法时更有状态" },
    right: { code: "I", label: "独立深潜", desc: "独自研究、写作、做项目时更稳定" },
  },
  {
    id: "info",
    title: "你更相信哪类信息？",
    left: { code: "S", label: "现实证据", desc: "看数据、案例、规则和可落地路径" },
    right: { code: "N", label: "趋势可能", desc: "看趋势、模型、未来机会和抽象规律" },
  },
  {
    id: "decision",
    title: "你做决定时更看重什么？",
    left: { code: "T", label: "逻辑收益", desc: "重视因果、效率、长期回报和能力迁移" },
    right: { code: "F", label: "价值共鸣", desc: "重视意义、关系、体验和帮助他人" },
  },
  {
    id: "structure",
    title: "你习惯怎样推进目标？",
    left: { code: "J", label: "计划推进", desc: "喜欢清单、节点、确定路线和复盘" },
    right: { code: "P", label: "探索迭代", desc: "喜欢试错、开放选择和边做边调整" },
  },
] as const;

const mbtiProfiles: Record<string, { name: string; summary: string; strengths: string[]; caution: string }> = {
  INTJ: {
    name: "战略型建造者",
    summary: "适合从复杂趋势里抽出路线，把长期目标拆成系统工程。",
    strengths: ["长期规划", "模型思维", "独立学习", "系统设计"],
    caution: "容易过早追求完美方案，需要用真实项目校准判断。",
  },
  INTP: {
    name: "研究型探索者",
    summary: "适合技术研究、算法、产品原型和新问题拆解。",
    strengths: ["抽象分析", "深度学习", "问题拆解", "技术好奇心"],
    caution: "容易停在想法层，需要给自己设置交付期限。",
  },
  ENTJ: {
    name: "组织型推进者",
    summary: "适合产品、创业、项目管理和高强度目标推进。",
    strengths: ["目标感", "资源整合", "决策效率", "领导力"],
    caution: "需要补足用户共情，避免只用效率压过真实需求。",
  },
  ENFP: {
    name: "机会型连接者",
    summary: "适合内容产品、增长、社群、创意工具和跨界创业。",
    strengths: ["表达感染力", "机会感知", "人际连接", "创意发散"],
    caution: "需要稳定执行系统，避免方向频繁跳转。",
  },
  ISTJ: {
    name: "稳健型执行者",
    summary: "适合工程落地、质量体系、运营管理和稳定职业路径。",
    strengths: ["责任感", "流程意识", "稳定执行", "细节把控"],
    caution: "需要主动接触新工具，避免被变化速度甩开。",
  },
  INFJ: {
    name: "洞察型助推者",
    summary: "适合教育、咨询、产品研究、社会价值和长期陪伴型职业。",
    strengths: ["共情洞察", "长期主义", "文字表达", "价值判断"],
    caution: "需要把理想拆成可衡量成果，避免只停在愿景。",
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <div>
            <p>Nextwork</p>
            <strong>{mode === "gaokao" ? "人生规划仪表盘" : "就业能力雷达"}</strong>
          </div>
        </div>
        <div className="mode-switch" aria-label="功能切换">
          <button className={mode === "gaokao" ? "active" : ""} onClick={() => setMode("gaokao")}>
            <Compass size={16} />
            规划
          </button>
          <button className={mode === "talent" ? "active" : ""} onClick={() => setMode("talent")}>
            <Medal size={16} />
            就业
          </button>
        </div>
      </header>

      {mode === "gaokao" ? <LifeDashboard /> : <TalentDashboard />}
    </main>
  );
}

function LifeDashboard() {
  const [mbtiAnswers, setMbtiAnswers] = useState<MbtiAnswers>(defaultMbti);
  const [doneTodos, setDoneTodos] = useState<string[]>(["todo-identity", "todo-major-map"]);

  const mbtiCode = useMemo(() => getMbtiCode(mbtiAnswers), [mbtiAnswers]);
  const profile = mbtiProfiles[mbtiCode] ?? getFallbackMbtiProfile(mbtiCode);
  const traitProfile = useMemo(() => getTraitsFromMbti(mbtiCode), [mbtiCode]);
  const rankedMajors = useMemo(
    () => scoreMajorPaths(majorPaths, traitProfile, startupTracks),
    [traitProfile],
  );
  const rankedTracks = useMemo(() => scoreStartupTracks(startupTracks, traitProfile), [traitProfile]);
  const signals = useMemo(() => getEmploymentSignals(jobs), []);
  const recommendedJobs = useMemo(() => getRecommendedJobs(jobs, initialProfile).slice(0, 4), []);
  const topMajor = rankedMajors[0];
  const fourYearPlan = useMemo(() => getFourYearPlan(topMajor), [topMajor]);
  const todos = useMemo(() => getLifeTodos(mbtiCode, topMajor.group, rankedTracks[0].name), [mbtiCode, topMajor, rankedTracks]);
  const completion = Math.round((doneTodos.length / todos.length) * 100);

  const toggleTodo = (todoId: string) => {
    setDoneTodos((current) =>
      current.includes(todoId) ? current.filter((id) => id !== todoId) : [...current, todoId],
    );
  };

  const setAnswer = (dimension: MbtiDimension, value: "left" | "right") => {
    setMbtiAnswers((current) => ({ ...current, [dimension]: value }));
  };

  return (
    <>
      <section className="dashboard-hero">
        <div className="welcome-panel glass-card">
          <p className="eyebrow">Career Operating System</p>
          <h1>先认识自己，再用数据规划人生。</h1>
          <p className="hero-copy">
            做一个轻量 MBTI 测试，得到人格画像、专业方向、大厂岗位、创业赛道和人生规划 Todo。
          </p>
          <div className="hero-actions">
            <a href="#mbti-test">开始测试</a>
            <a href="#life-todos" className="ghost-link">看今日 Todo</a>
          </div>
        </div>

        <div className="profile-panel glass-card">
          <div className="avatar-orb">
            <UserRound size={34} />
          </div>
          <p className="eyebrow">Your current type</p>
          <h2>{mbtiCode}</h2>
          <strong>{profile.name}</strong>
          <p>{profile.summary}</p>
          <div className="progress-track">
            <span style={{ width: `${completion}%` }} />
          </div>
          <small>人生规划进度 {completion}%</small>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard icon={<Brain size={20} />} label="人格画像" value={profile.name} tone="pink" />
        <MetricCard icon={<GraduationCap size={20} />} label="首推专业群" value={topMajor.group} tone="purple" />
        <MetricCard icon={<Rocket size={20} />} label="机会赛道" value={rankedTracks[0].name} tone="teal" />
        <MetricCard icon={<BriefcaseBusiness size={20} />} label="大厂方向" value={recommendedJobs[0].job.companyName} tone="amber" />
      </section>

      <section className="dashboard-grid">
        <article className="glass-card mbti-card" id="mbti-test">
          <SectionHeader kicker="Step 01" title="MBTI 快速测试" icon={<Brain size={20} />} />
          <div className="question-list">
            {mbtiQuestions.map((question) => (
              <div key={question.id} className="question-row">
                <h3>{question.title}</h3>
                <div className="choice-pair">
                  <button
                    className={mbtiAnswers[question.id] === "left" ? "choice active" : "choice"}
                    onClick={() => setAnswer(question.id, "left")}
                  >
                    <strong>{question.left.code} · {question.left.label}</strong>
                    <span>{question.left.desc}</span>
                  </button>
                  <button
                    className={mbtiAnswers[question.id] === "right" ? "choice active" : "choice"}
                    onClick={() => setAnswer(question.id, "right")}
                  >
                    <strong>{question.right.code} · {question.right.label}</strong>
                    <span>{question.right.desc}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card identity-card">
          <SectionHeader kicker="Step 02" title="大致分类" icon={<UserRound size={20} />} />
          <div className="type-badge">{mbtiCode}</div>
          <h2>{profile.name}</h2>
          <p>{profile.summary}</p>
          <div className="tag-cloud">
            {profile.strengths.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="soft-warning">
            <Sparkles size={16} />
            <p>{profile.caution}</p>
          </div>
        </article>
      </section>

      <section className="dashboard-grid three-two">
        <article className="glass-card route-card">
          <SectionHeader kicker="Step 03" title="职业与专业推荐" icon={<Target size={20} />} />
          <div className="route-list">
            {rankedMajors.slice(0, 3).map((path, index) => (
              <div key={path.id} className="route-item">
                <span>{index + 1}</span>
                <div>
                  <h3>{path.group}</h3>
                  <p>{path.why}</p>
                  <div className="tag-cloud compact">
                    {path.majors.slice(0, 3).map((major) => (
                      <em key={major}>{major}</em>
                    ))}
                  </div>
                </div>
                <strong>{path.score}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card signal-card">
          <SectionHeader kicker="Live signals" title="社会需要什么" icon={<TrendingUp size={20} />} />
          <SignalLine label="岗位终局" value={signals.directions.slice(0, 3).join(" / ")} />
          <SignalLine label="基础能力" value={signals.requirements.slice(0, 4).join(" / ")} />
          <SignalLine label="热门赛道" value={rankedTracks.slice(0, 2).map((track) => track.name).join(" / ")} />
        </article>
      </section>

      <section className="dashboard-grid three-two reverse">
        <article className="glass-card job-card">
          <SectionHeader kicker="Big Tech" title="大厂就业推荐" icon={<Building2 size={20} />} />
          <div className="job-list">
            {recommendedJobs.map(({ job, badge }) => (
              <div key={job.id} className="job-row">
                <div>
                  <h3>{job.companyName} · {job.title}</h3>
                  <p>{job.direction}</p>
                </div>
                <strong>{badge.matchScore}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card todo-card" id="life-todos">
          <SectionHeader kicker="Life Todo" title="人生规划 Todo" icon={<CalendarCheck size={20} />} />
          <div className="todo-list">
            {todos.map((todo) => {
              const checked = doneTodos.includes(todo.id);
              return (
                <button key={todo.id} className={checked ? "todo-row done" : "todo-row"} onClick={() => toggleTodo(todo.id)}>
                  {checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  <div>
                    <strong>{todo.title}</strong>
                    <span>{todo.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="glass-card">
          <SectionHeader kicker="4-Year Roadmap" title="大学四年路线" icon={<BookOpenCheck size={20} />} />
          <div className="timeline-list">
            {fourYearPlan.map((step) => (
              <div key={step.year} className="timeline-row">
                <span>{step.year}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.items.join(" · ")}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card">
          <SectionHeader kicker="Startup Tracks" title="创业赛道雷达" icon={<Flame size={20} />} />
          <div className="track-list">
            {rankedTracks.slice(0, 4).map((track) => (
              <div key={track.id} className="track-row">
                <div>
                  <h3>{track.name}</h3>
                  <p>{track.opportunity}</p>
                </div>
                <strong>{track.score}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
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
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.category)))] as Array<JobCategory | "All">,
    [],
  );
  const filteredJobs =
    selectedCategory === "All" ? recommended : recommended.filter(({ job }) => job.category === selectedCategory);

  const toggleSkill = (skillName: string) => {
    const exists = profileSkills.some((skill) => skill.name === skillName);
    setProfileSkills((current) =>
      exists
        ? current.filter((skill) => skill.name !== skillName)
        : [...current, { id: skillName.toLowerCase(), name: skillName, level: "foundation" }],
    );
  };

  return (
    <>
      <section className="dashboard-hero compact-hero">
        <div className="welcome-panel glass-card">
          <p className="eyebrow">Talent Radar</p>
          <h1>把岗位能力变成可解释的技能勋章。</h1>
          <p className="hero-copy">勾选已有技能，系统会给出大厂岗位匹配、能力缺口和学习建议。</p>
        </div>
        <div className="profile-panel glass-card">
          <div className="avatar-orb">
            <Medal size={34} />
          </div>
          <p className="eyebrow">Best match</p>
          <h2>{badges[0].companyName}</h2>
          <strong>{badges[0].matchScore}% 匹配</strong>
          <p>{badges[0].title}</p>
        </div>
      </section>

      <section className="glass-card skill-dashboard">
        <SectionHeader kicker="Skill input" title="已有技能" icon={<Check size={20} />} />
        <div className="tag-cloud selectable">
          {selectableSkills.map((skill) => {
            const active = profileSkills.some((item) => item.name === skill);
            return (
              <button key={skill} className={active ? "skill-pill active" : "skill-pill"} onClick={() => toggleSkill(skill)}>
                {active && <Check size={14} />}
                {skill}
              </button>
            );
          })}
        </div>
      </section>

      <section className="metric-grid">
        {insights.map((insight, index) => (
          <MetricCard
            key={insight.title}
            icon={<BarChart3 size={20} />}
            label={insight.title}
            value={insight.value}
            tone={["pink", "purple", "teal", "amber"][index] as "pink" | "purple" | "teal" | "amber"}
          />
        ))}
      </section>

      <section className="dashboard-grid three-two">
        <article className="glass-card">
          <SectionHeader kicker="Badge Wall" title="大厂技能勋章" icon={<Factory size={20} />} />
          <div className="badge-grid">
            {badges.map((badge) => (
              <div key={badge.id} className={`company-badge ${badge.status}`}>
                <span>{badge.companyName}</span>
                <strong>{badge.matchScore}%</strong>
                <p>{badge.title}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card">
          <SectionHeader kicker="Learning Todo" title="补齐清单" icon={<BookOpenCheck size={20} />} />
          <div className="todo-list readonly">
            {advice.map((item, index) => (
              <div key={item.skill} className="todo-row">
                <span className="todo-index">{index + 1}</span>
                <div>
                  <strong>{item.skill}</strong>
                  <span>{item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-card">
        <SectionHeader kicker="Jobs" title="岗位推荐" icon={<BriefcaseBusiness size={20} />} />
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
        <div className="job-list">
          {filteredJobs.slice(0, 8).map(({ job, badge }) => (
            <div key={job.id} className="job-row">
              <div>
                <h3>{job.companyName} · {job.title}</h3>
                <p>{job.department} · {job.location} · {job.direction}</p>
              </div>
              <strong>{badge.matchScore}%</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "pink" | "purple" | "teal" | "amber";
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div>{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function SectionHeader({ kicker, title, icon }: { kicker: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      <span>{icon}</span>
    </div>
  );
}

function SignalLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="signal-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getMbtiCode(answers: MbtiAnswers) {
  return mbtiQuestions
    .map((question) => question[answers[question.id]].code)
    .join("");
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
    caution: judging ? "要留出探索窗口，不要过早锁死唯一答案。" : "要建立阶段节点，避免长期停留在探索状态。",
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
      desc: "用 2 个真实项目验证自己是更适合深潜研究、协作表达、稳定执行还是探索试错。",
    },
    {
      id: "todo-major-map",
      title: `建立专业群地图：${majorGroup}`,
      desc: "不要只看单一专业名，整理 3 个可替代专业和它们共同的底层课程。",
    },
    {
      id: "todo-signal",
      title: `追踪一个社会需求信号：${trackName}`,
      desc: "每周看 5 条岗位或赛道信息，记录正在变重要的能力。",
    },
    {
      id: "todo-project",
      title: "做一个可展示作品",
      desc: "用作品证明能力，而不是只用兴趣描述自己。",
    },
    {
      id: "todo-interview",
      title: "找 3 个真实从业者访谈",
      desc: "问他们每天做什么、门槛在哪里、哪些课真正有用。",
    },
  ];
}

createRoot(document.getElementById("root")!).render(<App />);
