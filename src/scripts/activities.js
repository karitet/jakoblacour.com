import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../config/data-sources.mjs";
import {
  activityMatchesFilter,
  parseActivitiesCsv,
  sortActivities
} from "../lib/public-data.mjs";

const forcedFallback = new URLSearchParams(window.location.search).get("data") === "fallback";
const state = {
  filter: "selected",
  sort: "year-desc",
  items: []
};

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

function createCell(text, className) {
  const cell = document.createElement("span");
  cell.className = className;
  cell.textContent = text || "—";
  return cell;
}

function createRow(item) {
  const row = document.createElement("div");
  row.className = "activity-row";
  row.setAttribute("role", "row");

  const title = document.createElement(item.url ? "a" : "span");
  title.className = "activity-title";
  title.textContent = item.job;
  if (title instanceof HTMLAnchorElement) {
    title.href = item.url;
    title.target = "_blank";
    title.rel = "noopener";
  }

  row.append(
    createCell(item.category, "activity-category"),
    createCell(item.year, "activity-year"),
    title,
    createCell(item.production, "activity-production")
  );
  return row;
}

function renderSection(name, items) {
  const rows = document.querySelector(`[data-activity-rows="${name}"]`);
  const empty = document.querySelector(`[data-activity-empty="${name}"]`);
  if (!(rows instanceof HTMLElement) || !(empty instanceof HTMLElement)) return;

  rows.replaceChildren(...items.map(createRow));
  empty.hidden = items.length > 0;
  if (!items.length) empty.textContent = "No matching activities in this part of the record.";
}

function render() {
  const items = sortActivities(
    state.items.filter((item) => activityMatchesFilter(item, state.filter)),
    state.sort
  );
  renderSection("upcoming", items.filter((item) => item.active));
  renderSection("past", items.filter((item) => !item.active));
}

function updateControls(selector, value) {
  document.querySelectorAll(selector).forEach((button) => {
    button.setAttribute("aria-pressed", button.getAttribute("data-activity-filter") === value
      || button.getAttribute("data-activity-sort") === value
      ? "true"
      : "false");
  });
}

function setupControls() {
  document.querySelectorAll("[data-activity-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.getAttribute("data-activity-filter") || "all";
      updateControls("[data-activity-filter]", state.filter);
      render();
    });
  });

  document.querySelectorAll("[data-activity-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.getAttribute("data-activity-sort") || "year-desc";
      updateControls("[data-activity-sort]", state.sort);
      render();
    });
  });
}

function setUnavailable(message) {
  const source = document.querySelector("#activities-source");
  if (source instanceof HTMLElement) source.textContent = message;

  const activities = document.querySelector(".activities");
  if (activities instanceof HTMLElement) activities.dataset.sourceState = "fallback";

  for (const name of ["upcoming", "past"]) {
    const empty = document.querySelector(`[data-activity-empty="${name}"]`);
    if (empty instanceof HTMLElement) {
      empty.hidden = false;
      empty.textContent = "The live activity record is unavailable right now.";
    }
  }
}

async function loadActivities() {
  if (forcedFallback) {
    setUnavailable("Live source paused");
    return;
  }

  try {
    const csv = await fetchText(DATA_SOURCES.activities.url);
    const items = parseActivitiesCsv(csv);
    if (!items.length) throw new Error("No activities found");

    state.items = items;
    render();

    const source = document.querySelector("#activities-source");
    if (source instanceof HTMLElement) source.textContent = "Live public record";

    const activities = document.querySelector(".activities");
    if (activities instanceof HTMLElement) activities.dataset.sourceState = "live";
  } catch (error) {
    setUnavailable("Saved page frame");
    console.warn("Activities source unavailable; retaining the static page frame.", error);
  }
}

setupControls();
void loadActivities();
