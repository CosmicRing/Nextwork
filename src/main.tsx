import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Compass,
  ExternalLink,
  Factory,
  Filter,
  GraduationCap,
  Medal,
  Rocket,
  Route,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { jobs } from "./data/jobs";
import {
  gaokaoSourceNotes,
  gaokaoTraits,
  initialGaokaoProfile,
  majorPaths,
  startupTracks,
} from "./data/gaokao";
import { initialProfile, selectableSkills } from "./data/profile";
import { getBadges, getLearningAdvice, getMarketInsights, getRecommendedJobs } from "./lib/analysis";
import { getEmploymentSignals, getFourYearPlan, scoreMajorPaths, scoreStartupTracks } from "./lib/gaokao";
import type { AppMode, GaokaoProfile, JobCategory, Skill } from "./types";
import "./styles.css";

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

const modeCopy: Record<AppMode, { eyebrow: string; title: string; stages: Array<{ icon: React.ReactNode; label: string }> }> = {
  talent: {
    eyebrow: "Nextwork Talent Radar",
    title: "大厂岗位偏好分析与个人技能勋章墙",
    stages: [
      { icon: <BriefcaseBusiness size={16} />, label: "官网岗位" },
      { icon: <Sparkles size={16} />, label: "Claude 标签" },
      { icon: <Award size={16} />, label: "技能勋章" },
    ],
  },
  gaokao: {
    eyebrow: "Gaokao Major Navigator",
    title: "以就业和创业终局倒推高考专业选择",
    stages: [
      { icon: <BriefcaseBusiness size={16} />, label: "岗位需求" },
      { icon: <Rocket size={16} />, label: "创业赛道" },
      { icon: <GraduationCap size={16} />, label: "专业路径" },
    ],
  },
};

function App() {
  const [mode, setMode] = useState<AppMode>("gaokao");

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">{modeCopy[mode].eyebrow}</p>
          <h1>{modeCopy[mode].title}</h1>
        </div>
        <div className="top-actions">
          <div className="mode-switch" aria-label="功能切换">
            <button className={mode === "gaokao" ? "active" : ""} onClick={() => setMode("gaokao")}>
              <GraduationCap size={16} />
              高考选专业
            </button>
            <button className={mode === "talent" ? "active" : ""} onClick={() => setMode("talent")}>
              <Medal size={16} />
              技能勋章墙
            </button>
          </div>
          <div className="pipeline">
            {modeCopy[mode].stages.map((stage) => (
              <span key={stage.label}>
                {stage.icon}
                {stage.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {mode === "gaokao" ? <GaokaoView /> : <TalentView />}
    </main>
  );
}

function TalentView() {
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
      <section className="dashboard">
        <aside className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Student Profile</p>
              <h2>{profile.name}</h2>
            </div>
            <Target size={24} />
          </div>
          <p className="target-text">{profile.target}</p>
          <div className="skill-picker">
            {selectableSkills.map((skill) => {
              const active = profileSkills.some((item) => item.name === skill);
              return (
                <button key={skill} className={active ? "skill-chip active" : "skill-chip"} onClick={() => toggleSkill(skill)}>
                  {active && <Check size={14} />}
                  {skill}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="main-panel">
          <div className="insight-grid">
            {insights.map((insight) => (
              <article key={insight.title} className="insight-card">
                <div className="icon-box">
                  <BarChart3 size={18} />
                </div>
                <p>{insight.title}</p>
                <strong>{insight.value}</strong>
                <span>{insight.detail}</span>
              </article>
            ))}
          </div>

          <section className="badge-section">
            <div className="section-title">
              <div>
                <p className="eyebrow">Badge Wall</p>
                <h2>个人勋章墙</h2>
              </div>
              <Medal size={24} />
            </div>
            <div className="badge-wall">
              {badges.map((badge) => (
                <article
                  key={badge.id}
                  className={`badge-card ${badge.status}`}
                  style={{ "--badge-gradient": badge.gradient } as React.CSSProperties}
                >
                  <div className="badge-emblem">
                    <Factory size={30} />
                  </div>
                  <div>
                    <p>{badge.companyName}</p>
                    <h3>{badge.title}</h3>
                    <span>{badge.matchScore}% 匹配</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>

      <section className="bottom-grid">
        <section className="jobs-panel">
          <div className="section-title compact">
            <div>
              <p className="eyebrow">Official Jobs Dataset</p>
              <h2>岗位分类与推荐</h2>
            </div>
            <Filter size={22} />
          </div>
          <div className="tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "tab active" : "tab"}
                onClick={() => setSelectedCategory(category)}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
          <div className="job-list">
            {filteredJobs.map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div>
                  <p className="job-meta">
                    {job.companyName} · {job.department} · {job.location}
                  </p>
                  <h3>{job.title}</h3>
                  <span>{job.direction}</span>
                </div>
                <div className="job-side">
                  <strong>{badge.matchScore}%</strong>
                  <a href={job.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${job.companyName} 招聘官网`}>
                    <ExternalLink size={18} />
                  </a>
                </div>
                <div className="tag-line">
                  {job.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="advice-panel">
          <div className="section-title compact">
            <div>
              <p className="eyebrow">Learning Adjustment</p>
              <h2>学习调整建议</h2>
            </div>
            <BookOpenCheck size={22} />
          </div>
          <div className="advice-list">
            {advice.map((item, index) => (
              <article key={item.skill} className="advice-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.skill}</h3>
                  <p>{item.reason}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="claude-note">
            <Sparkles size={20} />
            <p>真实接入时，ClaudeCode 负责把官网岗位描述抽成统一 JSON：分类、技能标签、方向判断、基础能力、稀缺能力和学习建议。</p>
          </div>
        </section>
      </section>
    </>
  );
}

function GaokaoView() {
  const [profile, setProfile] = useState<GaokaoProfile>(initialGaokaoProfile);
  const employmentSignals = useMemo(() => getEmploymentSignals(jobs), []);
  const rankedTracks = useMemo(() => scoreStartupTracks(startupTracks, profile), [profile]);
  const rankedMajors = useMemo(() => scoreMajorPaths(majorPaths, profile, startupTracks), [profile]);
  const topMajor = rankedMajors[0];
  const fourYearPlan = useMemo(() => getFourYearPlan(topMajor), [topMajor]);

  const toggleTrait = (traitId: string) => {
    setProfile((current) => {
      const traits = current.traits.includes(traitId)
        ? current.traits.filter((id) => id !== traitId)
        : [...current.traits, traitId];
      return { ...current, traits };
    });
  };

  return (
    <>
      <section className="gaokao-layout">
        <aside className="profile-panel gaokao-profile">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Student Snapshot</p>
              <h2>{profile.name}</h2>
            </div>
            <Compass size={24} />
          </div>
          <p className="target-text">{profile.goal}</p>
          <div className="skill-picker">
            {gaokaoTraits.map((trait) => {
              const active = profile.traits.includes(trait.id);
              return (
                <button
                  key={trait.id}
                  className={active ? "skill-chip active" : "skill-chip"}
                  onClick={() => toggleTrait(trait.id)}
                  title={trait.description}
                >
                  {active && <Check size={14} />}
                  {trait.label}
                </button>
              );
            })}
          </div>
          <div className="principle-box">
            <Route size={20} />
            <p>倒推逻辑：就业岗位和创业赛道先拆成能力，再映射到专业群、大学四年任务和可验证作品。</p>
          </div>
        </aside>

        <section className="gaokao-main">
          <div className="signal-grid">
            <article className="signal-card">
              <div className="icon-box">
                <BriefcaseBusiness size={18} />
              </div>
              <p>岗位终局信号</p>
              <strong>{employmentSignals.directions.join(" / ")}</strong>
              <span>来自当前原型的大厂岗位数据，后续可替换成官网全量抓取和 Claude 标签结果。</span>
            </article>
            <article className="signal-card">
              <div className="icon-box green">
                <Rocket size={18} />
              </div>
              <p>创业赛道信号</p>
              <strong>{rankedTracks.slice(0, 3).map((track) => track.name).join(" / ")}</strong>
              <span>把赛道拆成真实要招的人，而不是只展示抽象风口词。</span>
            </article>
            <article className="signal-card">
              <div className="icon-box amber">
                <ClipboardList size={18} />
              </div>
              <p>共同基础能力</p>
              <strong>{employmentSignals.requirements.slice(0, 5).join(" / ")}</strong>
              <span>高考选专业不是一次性押宝，优先选能迁移到多个岗位的底层能力。</span>
            </article>
          </div>

          <section className="major-section">
            <div className="section-title">
              <div>
                <p className="eyebrow">Recommended Major Groups</p>
                <h2>专业群推荐</h2>
              </div>
              <GraduationCap size={24} />
            </div>
            <div className="major-grid">
              {rankedMajors.slice(0, 4).map((path) => (
                <article key={path.id} className="major-card">
                  <div className="score-ring">{path.score}%</div>
                  <div>
                    <h3>{path.group}</h3>
                    <p>{path.why}</p>
                  </div>
                  <div className="tag-line">
                    {path.majors.slice(0, 4).map((major) => (
                      <span key={major}>{major}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>

      <section className="bottom-grid gaokao-bottom">
        <section className="jobs-panel">
          <div className="section-title compact">
            <div>
              <p className="eyebrow">Startup Tracks</p>
              <h2>创业赛道拆解</h2>
            </div>
            <Rocket size={22} />
          </div>
          <div className="track-list">
            {rankedTracks.map((track) => (
              <article key={track.id} className="track-row">
                <div className="track-head">
                  <div>
                    <p className="job-meta">热度 {track.heat} · 匹配 {track.score}%</p>
                    <h3>{track.name}</h3>
                  </div>
                  <span>{track.relatedMajors.slice(0, 2).join(" / ")}</span>
                </div>
                <p>{track.opportunity}</p>
                <div className="tag-line">
                  {track.demandBreakdown.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="advice-panel">
          <div className="section-title compact">
            <div>
              <p className="eyebrow">Four-Year Roadmap</p>
              <h2>{topMajor.group}</h2>
            </div>
            <BookOpenCheck size={22} />
          </div>
          <div className="roadmap-list">
            {fourYearPlan.map((step) => (
              <article key={step.year} className="roadmap-item">
                <span>{step.year}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.items.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="risk-note">
            <ShieldAlert size={20} />
            <p>{topMajor.watchOut}</p>
          </div>
        </section>
      </section>

      <section className="source-section">
        <div className="section-title compact">
          <div>
            <p className="eyebrow">Policy And Catalogue Sources</p>
            <h2>专业与赛道依据</h2>
          </div>
          <ExternalLink size={22} />
        </div>
        <div className="source-grid">
          {gaokaoSourceNotes.map((source) => (
            <a key={source.url} className="source-card" href={source.url} target="_blank" rel="noreferrer">
              <p>{source.publisher}</p>
              <h3>{source.title}</h3>
              <span>{source.note}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
