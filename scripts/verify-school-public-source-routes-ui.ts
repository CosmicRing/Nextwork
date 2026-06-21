import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");
const accessPanelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessPanelEnd = mainSource.indexOf("function UnknownSchoolEvidenceWorkbench", accessPanelStart);
const accessPanelSource = mainSource.slice(accessPanelStart, accessPanelEnd);
const routeStyleStart = styleSource.indexOf(".school-public-source-route-grid");
const routeStyleEnd = styleSource.indexOf(".school-public-major-access-panel", routeStyleStart);
const routeStyleSource = styleSource.slice(routeStyleStart, routeStyleEnd);

assert.ok(
  mainSource.includes("buildSchoolPublicSourceRoutes"),
  "main UI should import the public-source route helper",
);
assert.ok(
  accessPanelSource.includes("const publicSourceRoutes = buildSchoolPublicSourceRoutes"),
  "school panel should derive public source routes from school, major, and job",
);
assert.ok(
  mainSource.includes("function SchoolPublicSourceRoutePanel"),
  "school UI should render a dedicated public source route panel",
);
assert.ok(
  mainSource.includes("const primaryRouteIds") &&
    mainSource.includes('"school-employment-report"') &&
    mainSource.includes('className="school-public-source-route-more"'),
  "source route panel should keep the first view compact and collapse secondary routes",
);
assert.ok(
  accessPanelSource.includes("<SchoolPublicSourceRoutePanel routes={publicSourceRoutes} />"),
  "public source route panel should appear in the school access panel",
);
assert.ok(
  mainSource.includes("title={route.openHint}"),
  "public source route cards should keep long hints as hover titles instead of visible walls of text",
);
assert.ok(
  !mainSource.includes("<small>{route.openHint}</small>"),
  "public source route cards should not render every long hint directly in the grid",
);
assert.ok(
  accessPanelSource.indexOf("<SchoolPublicSourceRoutePanel") < accessPanelSource.indexOf("<SchoolPublicMajorAccessPanel"),
  "source route map should appear before the dense major-access grid",
);
assert.ok(
  !accessPanelSource.includes("scrollIntoView"),
  "school access panel should not use scrollIntoView inside the embedded app browser",
);

for (const className of [
  ".school-public-source-route-panel",
  ".school-public-source-route-grid",
  ".school-public-source-route-more:not([open]) .school-public-source-route-secondary-grid",
  ".source-route-authority",
  ".source-route-official",
  ".source-route-proxy",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}

assert.ok(
  routeStyleSource.includes("-webkit-line-clamp: 2"),
  "source route descriptions should be clamped so mobile cards stay compact",
);
assert.ok(
  routeStyleSource.includes("white-space: nowrap"),
  "source route save-field lines should not wrap into tall cards",
);
assert.ok(
  styleSource.includes(".school-public-source-route-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));"),
  "source route primary cards should remain a compact two-column grid on mobile",
);
