import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const accessStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const accessEnd = mainSource.indexOf("function UnknownSchoolPublicAccessMap", accessStart);
const accessSource = mainSource.slice(accessStart, accessEnd);
const componentStart = mainSource.indexOf("function UnknownSchoolPublicAccessMap");
const componentEnd = mainSource.indexOf("function UnknownSchoolTypeStrategyCard", componentStart);
const componentSource = mainSource.slice(componentStart, componentEnd);

assert.ok(accessStart > -1 && componentStart > -1, "school access panel and public access map should exist");

for (const token of [
  "packetText={unknownPacketText}",
  "copyState={unknownCopyState}",
  "showPacketText={showUnknownPacketText}",
  "onCopyPacket={copyUnknownPacket}",
]) {
  assert.ok(accessSource.includes(token), `top public access map should receive ${token}`);
}

for (const token of [
  "packetText: string;",
  'copyState: "idle" | "copied" | "failed";',
  "showPacketText: boolean;",
  "onCopyPacket: () => void;",
  'className="unknown-school-public-access-map-head-actions"',
  "onClick={onCopyPacket}",
  'className="unknown-school-public-access-copybox"',
  "value={packetText}",
  "showPacketText &&",
]) {
  assert.ok(componentSource.includes(token), `public access map should expose first-screen packet copying via ${token}`);
}

assert.ok(
  componentSource.indexOf('className="unknown-school-public-access-map-head-actions"') <
    componentSource.indexOf('className="unknown-school-public-access-map-grid"'),
  "copy entry packet action should sit above the card grid",
);

for (const className of [
  ".unknown-school-public-access-map-head-actions",
  ".unknown-school-public-access-copybox",
]) {
  assert.ok(styleSource.includes(className), `styles should include ${className}`);
}
