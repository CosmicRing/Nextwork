import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  Factory,
  Filter,
  Medal,
  Sparkles,
  Target,
} from "lucide-react";
import { jobs } from "./data/jobs";
import { initialProfile, selectableSkills } from "./data/profile";
import { getBadges, getLearningAdvice, getMarketInsights, getRecommendedJobs } from "./lib/analysis";
import type { JobCategory, Skill } from "./types";
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
      exists
        ? current.filter((skill) => skill.name !== skillName)
        : [...current, { id: skillName.toLowerCase(), name: skillName, level: "foundation" }],
    );
  };

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Nextwork Talent Radar</p>
          <h1>大厂岗位偏好分析与个人技能勋章墙</h1>
        </div>
        <div className="pipeline">
          <span><BriefcaseBusiness size={16} /> 官网岗位</span>
          <span><Sparkles size={16} /> Claude 标签</span>
          <span><Award size={16} /> 技能勋章</span>
        </div>
      </section>

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
                <div className="icon-box"><BarChart3 size={18} /></div>
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
                <article key={badge.id} className={`badge-card ${badge.status}`} style={{ "--badge-gradient": badge.gradient } as React.CSSProperties}>
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
              <button key={category} className={selectedCategory === category ? "tab active" : "tab"} onClick={() => setSelectedCategory(category)}>
                {categoryLabels[category]}
              </button>
            ))}
          </div>
          <div className="job-list">
            {filteredJobs.map(({ job, badge }) => (
              <article key={job.id} className="job-row">
                <div>
                  <p className="job-meta">{job.companyName} · {job.department} · {job.location}</p>
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
                  {job.tags.map((tag) => <span key={tag}>{tag}</span>)}
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
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
