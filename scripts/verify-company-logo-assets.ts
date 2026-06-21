import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { officialCompanySources } from "../src/data/officialSources";
import {
  companyLogoAssets,
  getCompanyLogoSources,
  getCompanyLogoText,
} from "../src/lib/companyLogos";

const missingAssetIds = officialCompanySources
  .map((source) => source.id)
  .filter((id) => !companyLogoAssets[id]);

assert.deepEqual(missingAssetIds, [], "every official company source should have a local logo asset");

for (const source of officialCompanySources) {
  const localAsset = companyLogoAssets[source.id];
  assert.ok(localAsset.startsWith("/company-logos/"), `${source.id} should use the local company-logo path`);
  assert.ok(
    existsSync(join(process.cwd(), "public", localAsset.replace(/^\//, ""))),
    `${source.id} local logo asset should exist on disk`,
  );

  const logoSources = getCompanyLogoSources(source.id, source.domain);
  assert.equal(logoSources[0], localAsset, `${source.id} should try the local logo before favicon fallbacks`);
  assert.ok(logoSources.length >= 3, `${source.id} should keep official favicon fallbacks`);
  assert.ok(getCompanyLogoText(source.id, source.name).trim(), `${source.id} should have fallback logo text`);
}
