import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../config/data-sources.mjs";
import { loadSiteContent } from "../lib/site-content.mjs";

const forcedFallback = new URLSearchParams(window.location.search).get("data") === "fallback";

async function fetchText(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

async function loadSiteTitle() {
  if (forcedFallback) {
    console.info("Site Content source paused by ?data=fallback; retaining the static site title.");
    return;
  }

  const result = await loadSiteContent({
    source: DATA_SOURCES.siteContent,
    fetchText
  });

  if (result.sourceState === "fallback") {
    console.warn("Site Content source unavailable; retaining the static site title.", result.error);
    return;
  }

  const value = result.liveValues["site.title"];
  const title = document.querySelector('[data-site-content="site.title"]');
  if (!value || !(title instanceof HTMLTitleElement)) return;

  document.title = `${title.dataset.siteTitlePrefix ?? ""}${value}`;
  console.info("Site Content loaded; applied site.title.");
}

void loadSiteTitle();
