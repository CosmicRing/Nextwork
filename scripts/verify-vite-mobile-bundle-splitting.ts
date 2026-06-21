import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const configSource = readFileSync("vite.config.ts", "utf8");

assert.ok(configSource.includes("rolldownOptions"), "Vite build should use rolldownOptions for Vite 8 chunk splitting");
assert.ok(configSource.includes("manualChunks"), "Vite build should define manualChunks to split mobile-friendly vendor bundles");

for (const vendorChunk of ["react-vendor", "ui-vendor", "data-vendor", "jobs-data"]) {
  assert.ok(configSource.includes(vendorChunk), `Vite build should isolate ${vendorChunk}`);
}

assert.ok(
  configSource.includes("jobs.generated") || configSource.includes("src/data/jobs"),
  "Vite build should keep the generated official-job snapshot out of the main app chunk",
);

assert.ok(
  configSource.includes("chunkSizeWarningLimit") && configSource.includes("1600"),
  "Vite build should warn if the isolated generated-job snapshot grows beyond the measured 1.6MB mobile budget",
);

console.log("Vite mobile bundle splitting verified.");
