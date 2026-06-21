import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mainSource = readFileSync("src/main.tsx", "utf8");
const styleSource = readFileSync("src/styles.css", "utf8");

const panelStart = mainSource.indexOf("function SchoolPublicAccessPanel");
const panelEnd = mainSource.indexOf("function SchoolOfficialEntryStrip", panelStart);
const panelSource = mainSource.slice(panelStart, panelEnd);

assert.ok(panelStart > -1 && panelEnd > panelStart, "SchoolPublicAccessPanel should exist");
assert.ok(
  panelSource.includes('const [showInfoPacketText, setShowInfoPacketText] = useState(false)'),
  "school info packet copy flow should track whether the manual copy text is visible",
);
assert.ok(
  panelSource.includes("setShowInfoPacketText(false)") && panelSource.includes("setShowInfoPacketText(true)"),
  "school info packet copy flow should hide text after success and show it after failure",
);
assert.ok(
  panelSource.includes('className="school-info-packet-copybox"') &&
    panelSource.includes("value={infoPacketText}") &&
    panelSource.includes("readOnly"),
  "school info packet should expose a read-only fallback text area containing the full packet",
);
assert.ok(
  styleSource.includes(".school-info-packet-copybox"),
  "school info packet fallback text area should have dedicated styles",
);
