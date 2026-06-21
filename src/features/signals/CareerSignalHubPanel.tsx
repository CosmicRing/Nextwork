import type { CareerSignalSummary } from "../../lib/careerSignals";
import type { CareerSignal } from "../../types";
import "./CareerSignalHubPanel.css";

export function CareerSignalHubPanel({
  signals,
  careerSignalSummary,
}: {
  signals: CareerSignal[];
  careerSignalSummary: CareerSignalSummary;
}) {
  const selectedSignals = signals.filter((signal) => signal.selected).slice(0, 10);
  const latestSignal = signals
    .map((signal) => new Date(signal.publishedAt).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((left, right) => right - left)[0];
  const typeCards: Array<{ id: CareerSignal["signalType"]; label: string; value: number; detail: string }> = [
    { id: "job", label: "官网岗位", value: careerSignalSummary.byType.job, detail: "来自 live adapter 的公司岗位样本" },
    { id: "salary", label: "薪资代理", value: careerSignalSummary.byType.salary, detail: "专业群到薪资区间的市场代理" },
    { id: "school", label: "学校证据", value: careerSignalSummary.byType.school, detail: "就业质量报告与公开招聘活动" },
    { id: "official-source", label: "官方入口", value: careerSignalSummary.byType["official-source"], detail: "企业招聘官网与待接 adapter" },
  ];

  return (
    <section className="career-signal-hub" aria-label="职业信号中枢">
      <div className="career-signal-hero">
        <div>
          <p className="salary-kicker">Career Signal Hub</p>
          <h1>把岗位、薪资、学校证据和官方入口归并成同一种信号。</h1>
          <p>
            这里不是资讯流，也不是永久事实库。它把当前 adapter 快照、学校公开证据和专业薪资代理合并成可解释信号，
            再告诉用户为什么重要、适合哪些专业和下一步要核验什么。
          </p>
        </div>
        <section>
          <span>精选信号</span>
          <strong>{careerSignalSummary.selected}</strong>
          <em>{latestSignal ? `${formatSignalDate(new Date(latestSignal).toISOString())} 刷新` : "刷新时间待解析"}</em>
        </section>
      </div>

      <div className="career-signal-metrics">
        {typeCards.map((card) => (
          <article key={card.id}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <em>{card.detail}</em>
          </article>
        ))}
      </div>

      <div className="career-signal-layout">
        <div className="career-signal-list">
          {selectedSignals.map((signal) => (
            <a key={signal.id} className={`career-signal-card ${getCareerSignalTypeTone(signal.signalType)}`} href={signal.sourceUrl} target="_blank" rel="noreferrer">
              <div>
                <span>{getCareerSignalTypeLabel(signal.signalType)}</span>
                <b>{signal.score}</b>
              </div>
              <strong>{signal.title}</strong>
              <p>{signal.summary}</p>
              <small>{signal.reason}</small>
              <footer>
                {signal.relatedMajors.slice(0, 3).map((major) => (
                  <em key={`${signal.id}-${major}`}>{major}</em>
                ))}
                {signal.relatedAbilities.slice(0, 3).map((ability) => (
                  <em key={`${signal.id}-${ability}`}>{ability}</em>
                ))}
              </footer>
            </a>
          ))}
        </div>

        <aside className="career-signal-taxonomy" aria-label="职业信号分类摘要">
          <section>
            <span>高频专业</span>
            {careerSignalSummary.topMajors.slice(0, 7).map(([major, count]) => (
              <p key={major}>
                <strong>{major}</strong>
                <em>{count}</em>
              </p>
            ))}
          </section>
          <section>
            <span>高频能力</span>
            {careerSignalSummary.topAbilities.slice(0, 7).map(([ability, count]) => (
              <p key={ability}>
                <strong>{ability}</strong>
                <em>{count}</em>
              </p>
            ))}
          </section>
          <section className="career-signal-risk-note">
            <span>口径边界</span>
            <p>官方岗位会随招聘周期变化，薪资代理不能替代企业承诺，学校证据必须回到公开报告或就业中心入口核验。</p>
            <b>{careerSignalSummary.sourceCoverage.liveAdapterSources} 个 live adapter / {careerSignalSummary.sourceCoverage.officialLinkSources} 个官方入口</b>
          </section>
        </aside>
      </div>
    </section>
  );
}

function getCareerSignalTypeLabel(type: CareerSignal["signalType"]) {
  if (type === "job") return "岗位";
  if (type === "salary") return "薪资";
  if (type === "school") return "学校";
  return "入口";
}

function getCareerSignalTypeTone(type: CareerSignal["signalType"]) {
  if (type === "job") return "job";
  if (type === "salary") return "salary";
  if (type === "school") return "school";
  return "source";
}

function formatSignalDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" });
}
