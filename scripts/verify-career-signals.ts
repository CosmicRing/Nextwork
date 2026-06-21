import assert from "node:assert/strict";

import { jobs } from "../src/data/jobs";
import { majorSalaryProfiles } from "../src/data/majorMarket";
import { officialCompanySources } from "../src/data/officialSources";
import { schoolOutcomeProfiles } from "../src/data/schoolOutcomes";
import { buildCareerSignals, summarizeCareerSignals } from "../src/lib/careerSignals";

const signals = buildCareerSignals({
  jobs,
  majorSalaryProfiles,
  officialCompanySources,
  schoolOutcomeProfiles,
});

assert.ok(signals.length >= 20, "career signal layer should expose a useful launch set");
assert.ok(signals.some((signal) => signal.signalType === "job"), "job adapter output should become career signals");
assert.ok(signals.some((signal) => signal.signalType === "salary"), "major salary market profiles should become salary signals");
assert.ok(signals.some((signal) => signal.signalType === "school"), "school evidence should become school signals");
assert.ok(signals.some((signal) => signal.signalType === "official-source"), "official company entrances should become source signals");

const ids = new Set(signals.map((signal) => signal.id));
assert.equal(ids.size, signals.length, "career signal ids should be unique");

for (const signal of signals) {
  assert.ok(signal.title.trim(), `${signal.id} should have a title`);
  assert.ok(signal.summary.trim(), `${signal.id} should have a summary`);
  assert.ok(signal.sourceName.trim(), `${signal.id} should expose a source name`);
  assert.ok(signal.sourceUrl.startsWith("http"), `${signal.id} should expose a browser-safe source URL`);
  assert.ok(signal.reason.trim(), `${signal.id} should explain why it matters`);
  assert.ok(signal.risk.trim(), `${signal.id} should disclose risk or caveat`);
  assert.ok(signal.relatedMajors.length > 0 || signal.relatedAbilities.length > 0, `${signal.id} should map to majors or abilities`);
  assert.ok(signal.confidence >= 0 && signal.confidence <= 1, `${signal.id} confidence should be normalized`);
  assert.ok(signal.score >= 0 && signal.score <= 100, `${signal.id} score should stay in a 0-100 range`);
}

const selectedSignals = signals.filter((signal) => signal.selected);
assert.ok(selectedSignals.length >= 8, "signal layer should mark selected launch signals");
assert.ok(
  selectedSignals.every((signal, index, list) => index === 0 || list[index - 1].score >= signal.score),
  "selected signals should be sorted by score descending",
);

const summary = summarizeCareerSignals(signals);
assert.equal(summary.total, signals.length);
assert.ok(summary.selected >= 8, "summary should count selected signals");
assert.ok(summary.byType.job > 0, "summary should count job signals");
assert.ok(summary.sourceCoverage.liveAdapterSources > 0, "summary should report live adapter coverage");
assert.ok(summary.sourceCoverage.officialLinkSources > 0, "summary should report official-link coverage");
