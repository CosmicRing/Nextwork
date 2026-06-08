import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Factory,
  Filter,
  GraduationCap,
  Layers3,
  Medal,
  Rocket,
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

function App() {
  const [mode, setMode] = useState<AppMode>("gaokao");

  return (
    <main className="app-shell">
      <header className="app-nav">
        <div>
          <p className="nav-kicker">Nextwork</p>
          <strong>{mode === "gaokao" ? "高考专业导航" : "技能勋章墙"}</strong>
        </div>
        <div className="mode-switch" aria-label="功能切换">
          <button className={mode === "gaokao" ? "active" : ""} onClick={() => setMode("gaokao")}>
            <GraduationCap size={16} />
            高考
          </button>
          <button className={mode === "talent" ? "active" : ""} onClick={() => setMode("talent")}>
            <Medal size={16} />
            求职
          </button>
        </div>
      </header>

      {mode === "gaokao" ? <GaokaoView /> : <TalentView />}
    </main>
  );
}

function GaokaoView() {
  const [profile, setProfile] = useState<GaokaoProfile>(initialGaokaoProfile);
  const employmentSignals = useMemo(() => getEmploymentSignals(jobs), []);
  const rankedTracks = useMemo(() => scoreStartupTracks(startupTracks, profile), [profile]);
  const rankedMajors = useMemo(() => scoreMajorPaths(majorPaths, profile, startupTracks), [profile]);
  const topMajor = rankedMajors[0];
  const secondMajor = rankedMajors[1];
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
      <section className="gaokao-hero">
        <div className="hero-copy">
          <p className="eyebrow">从终局倒推志愿</p>
          <h1>先看未来要成为什么人，再决定现在报什么专业。</h1>
          <p className="hero-lead">
            把大厂招聘、创业赛道和政策专业目录拆成能力地图，给高考生一个可解释的专业选择建议。
          </p>
          <div className="hero-actions">
            <a href="#major-recommendations">看推荐专业 <ChevronRight size={16} /></a>
            <a href="#profile" className="secondary">调整学生画像</a>
          </div>
        </div>

        <article className="recommend-card">
          <div className="recommend-score">
            <span>{topMajor.score}%</span>
            <p>当前匹配</p>
          </div>
          <div>
            <p className="eyebrow">首选专业群</p>
            <h2>{topMajor.group}</h2>
            <p>{topMajor.why}</p>
          </div>
          <div className="mini-tags">
            {topMajor.majors.slice(0, 4).map((major) => (
              <span key={major}>{major}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="profile-strip" id="profile">
        <div className="strip-heading">
          <div>
            <p className="eyebrow">学生画像</p>
            <h2>点选优势和偏好，推荐会即时变化</h2>
          </div>
          <span>{profile.traits.length} 项已选</span>
        </div>
        <div className="trait-grid">
          {gaokaoTraits.map((trait) => {
            const active = profile.traits.includes(trait.id);
            return (
              <button key={trait.id} className={active ? "trait-chip active" : "trait-chip"} onClick={() => toggleTrait(trait.id)}>
                {active && <Check size={14} />}
                <span>{trait.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="signal-band">
        <article>
          <BriefcaseBusiness size={20} />
          <p>岗位终局</p>
          <strong>{employmentSignals.directions.slice(0, 3).join(" / ")}</strong>
        </article>
        <article>
          <Rocket size={20} />
          <p>创业热点</p>
          <strong>{rankedTracks.slice(0, 2).map((track) => track.name).join(" / ")}</strong>
        </article>
        <article>
          <ClipboardList size={20} />
          <p>基础能力</p>
          <strong>{employmentSignals.requirements.slice(0, 4).join(" / ")}</strong>
        </article>
      </section>

      <section className="content-section" id="major-recommendations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Major Recommendations</p>
            <h2>专业推荐</h2>
          </div>
          <p>不是给一个孤立专业名，而是给一组可替换、可保底、可延展的专业群。</p>
        </div>
        <div className="major-list">
          {rankedMajors.slice(0, 4).map((path, index) => (
            <article key={path.id} className={index === 0 ? "major-item featured" : "major-item"}>
              <div className="rank-badge">{index + 1}</div>
              <div className="major-body">
                <div className="major-title-row">
                  <div>
                    <p>{path.score}% 匹配</p>
                    <h3>{path.group}</h3>
                  </div>
                  {index === 0 && <span>首推</span>}
                </div>
                <p>{path.why}</p>
                <div className="mini-tags">
                  {path.majors.slice(0, 4).map((major) => (
                    <span key={major}>{major}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div className="content-section compact-section">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">Startup Tracks</p>
              <h2>赛道拆解</h2>
            </div>
          </div>
          <div className="track-list">
            {rankedTracks.slice(0, 4).map((track) => (
              <article key={track.id} className="track-item">
                <div>
                  <p>热度 {track.heat} · 匹配 {track.score}%</p>
                  <h3>{track.name}</h3>
                </div>
                <p>{track.opportunity}</p>
                <div className="mini-tags">
                  {track.demandBreakdown.slice(0, 4).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="content-section compact-section">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">4-Year Roadmap</p>
              <h2>大学四年怎么走</h2>
            </div>
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
            <ShieldAlert size={18} />
            <p>{topMajor.watchOut}</p>
          </div>
        </div>
      </section>

      <section className="comparison-strip">
        <div>
          <p className="eyebrow">备选策略</p>
          <h2>如果不想押太重，可以把 {secondMajor.group} 作为第二梯队。</h2>
        </div>
        <p>{secondMajor.why}</p>
      </section>

      <section className="source-section">
        <div className="section-heading tight">
          <div>
            <p className="eyebrow">Sources</p>
            <h2>依据来源</h2>
          </div>
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
      <section className="talent-hero">
        <div>
          <p className="eyebrow">Talent Radar</p>
          <h1>把岗位能力变成可解释的技能勋章。</h1>
          <p>学生勾选已有技能后，系统会计算大厂岗位匹配度、缺口和学习建议。</p>
        </div>
        <div className="skill-picker">
          {selectableSkills.map((skill) => {
            const active = profileSkills.some((item) => item.name === skill);
            return (
              <button key={skill} className={active ? "trait-chip active" : "trait-chip"} onClick={() => toggleSkill(skill)}>
                {active && <Check size={14} />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="signal-band">
        {insights.slice(0, 3).map((insight) => (
          <article key={insight.title}>
            <BarChart3 size={20} />
            <p>{insight.title}</p>
            <strong>{insight.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Badge Wall</p>
            <h2>个人勋章墙</h2>
          </div>
        </div>
        <div className="badge-wall">
          {badges.map((badge) => (
            <article
              key={badge.id}
              className={`badge-card ${badge.status}`}
              style={{ "--badge-gradient": badge.gradient } as React.CSSProperties}
            >
              <div className="badge-emblem">
                <Factory size={28} />
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

      <section className="split-section">
        <div className="content-section compact-section">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">Official Jobs Dataset</p>
              <h2>岗位推荐</h2>
            </div>
            <Filter size={20} />
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
            {filteredJobs.slice(0, 6).map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div>
                  <p>{job.companyName} · {job.department}</p>
                  <h3>{job.title}</h3>
                  <span>{job.direction}</span>
                </div>
                <strong>{badge.matchScore}%</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="content-section compact-section">
          <div className="section-heading tight">
            <div>
              <p className="eyebrow">Learning Adjustment</p>
              <h2>学习建议</h2>
            </div>
            <BookOpenCheck size={20} />
          </div>
          <div className="roadmap-list">
            {advice.map((item, index) => (
              <article key={item.skill} className="roadmap-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.skill}</h3>
                  <p>{item.reason}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="risk-note">
            <Sparkles size={18} />
            <p>真实接入时，ClaudeCode 会把官网岗位抽成分类、技能、方向、基础能力和学习建议。</p>
          </div>
        </div>
      </section>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
