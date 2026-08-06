import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../src/config/data-sources.mjs";
import { currentActivities, parseActivitiesCsv, parseReelCsv } from "../src/lib/public-data.mjs";

async function fetchText(source) {
  const response = await fetch(source.url, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });

  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`);
  return response.text();
}

const [videoCsv, activitiesCsv] = await Promise.all([
  fetchText(DATA_SOURCES.homeVideo),
  fetchText(DATA_SOURCES.activities)
]);

const reel = parseReelCsv(videoCsv);
const now = currentActivities(parseActivitiesCsv(activitiesCsv));

if (reel.length === 0) throw new Error("Home video reel: no publishable rows found.");
if (now.length === 0) throw new Error("Activities and Now: no current rows found.");

console.log(`Home video reel: ${reel.length} publishable row(s).`);
console.log(`Activities and Now: ${now.length} current row(s) used by Home.`);
