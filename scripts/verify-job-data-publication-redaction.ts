import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { jobs as generatedJobs } from "../src/data/jobs";

type PublicJob = {
  id: string;
  description: string;
};

type PublicPayload = {
  note?: string;
  jobs?: PublicJob[];
};

const maxPublicDescriptionLength = 280;

function readPayload(path: string): PublicPayload {
  return JSON.parse(readFileSync(path, "utf8")) as PublicPayload;
}

function assertRedactedJobs(label: string, jobs: PublicJob[]) {
  assert.ok(jobs.length > 0, `${label} should contain jobs`);

  const longDescriptions = jobs
    .filter((job) => job.description.length > maxPublicDescriptionLength)
    .map((job) => `${job.id}:${job.description.length}`)
    .slice(0, 8);

  assert.deepEqual(
    longDescriptions,
    [],
    `${label} must not publish full job descriptions; offending descriptions: ${longDescriptions.join(", ")}`,
  );

  for (const job of jobs.slice(0, 25)) {
    assert.ok(job.description.startsWith("岗位摘要："), `${label} ${job.id} should expose a generated summary, not copied body text`);
  }
}

for (const path of ["data/jobs.normalized.json", "data/jobs.seed.json"]) {
  const payload = readPayload(path);
  assert.ok(
    payload.note?.includes("Full official descriptions are not republished"),
    `${path} should document that full official descriptions are not republished`,
  );
  assertRedactedJobs(path, payload.jobs ?? []);
}

assertRedactedJobs("src/data/jobs.generated.ts", generatedJobs);
