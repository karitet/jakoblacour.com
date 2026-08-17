import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../src/config/data-sources.mjs";
import {
  currentActivities,
  parseActivitiesCsv,
  parseLibraryCsv,
  parseReelCsv
} from "../src/lib/public-data.mjs";
import { loadSiteContent } from "../src/lib/site-content.mjs";

async function fetchText(source) {
  const response = await fetch(source.url, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });

  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`);
  return response.text();
}

const [videoCsv, activitiesCsv, libraryCsv, siteContent] = await Promise.all([
  fetchText(DATA_SOURCES.homeVideo),
  fetchText(DATA_SOURCES.activities),
  fetchText(DATA_SOURCES.library),
  loadSiteContent({
    source: DATA_SOURCES.siteContent,
    fetchText: (url) => fetchText({ ...DATA_SOURCES.siteContent, url })
  })
]);

const reel = parseReelCsv(videoCsv);
const now = currentActivities(parseActivitiesCsv(activitiesCsv));
const library = parseLibraryCsv(libraryCsv);

if (reel.length === 0) throw new Error("Home video reel: no publishable rows found.");
if (now.length === 0) throw new Error("Featured Activities and Now: no current rows found.");
if (library.length === 0) throw new Error("Featured Library: no publishable rows found.");

console.log(`Home video reel: ${reel.length} publishable row(s).`);
console.log(`Featured Activities and Now: ${now.length} current row(s) used by Home.`);
console.log(`Featured Library: ${library.length} publishable row(s).`);

if (siteContent.sourceState === "live") {
  console.log(`Site Content: ${Object.keys(siteContent.liveValues).length} resolved public key(s).`);
} else {
  console.warn(`Site Content: unavailable (non-blocking); static fallback remains in use. ${siteContent.error.message}`);
}
