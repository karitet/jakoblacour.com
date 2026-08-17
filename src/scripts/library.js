import { LIBRARY_FALLBACK_ITEMS } from "../data/library-fallback.mjs";
import { DATA_SOURCES, FETCH_TIMEOUT_MS } from "../config/data-sources.mjs";
import {
  libraryMatchesFilter,
  libraryTypes,
  parseLibraryCsv,
  sortLibraryItems
} from "../lib/public-data.mjs";

const forcedFallback = new URLSearchParams(window.location.search).get("data") === "fallback";
const state = {
  filter: "all",
  sort: "date-desc",
  items: [...LIBRARY_FALLBACK_ITEMS]
};

async function fetchText(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const requestUrl = new URL(url);
  requestUrl.searchParams.set("_", String(Date.now()));

  try {
    const response = await fetch(requestUrl, {
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

function createTextCell(text, className) {
  const cell = document.createElement("div");
  cell.className = className;
  cell.setAttribute("role", "cell");
  cell.textContent = text || "-";
  return cell;
}

function createRow(item) {
  const row = document.createElement("article");
  row.className = "library-row";
  row.dataset.libraryRow = "";
  row.setAttribute("role", "row");

  const type = createTextCell(item.type, "library-type");
  if (item.language) {
    const language = document.createElement("small");
    language.textContent = item.language;
    type.append(language);
  }

  const date = document.createElement("time");
  date.className = "library-date";
  date.setAttribute("role", "cell");
  date.textContent = item.date || "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) date.dateTime = item.date;

  const title = document.createElement("div");
  title.className = "library-title";
  title.setAttribute("role", "cell");
  const titleElement = document.createElement(item.url ? "a" : "span");
  titleElement.textContent = item.title;
  if (titleElement instanceof HTMLAnchorElement) {
    titleElement.href = item.url;
    titleElement.target = "_blank";
    titleElement.rel = "noopener noreferrer";
  }
  title.append(titleElement);
  if (item.quote) {
    const quote = document.createElement("p");
    quote.textContent = item.quote;
    title.append(quote);
  }

  const outlet = createTextCell(item.outlet, "library-outlet");
  if (item.project) {
    const project = document.createElement("small");
    project.textContent = item.project;
    outlet.append(project);
  }

  row.append(type, date, title, outlet);
  return row;
}

function updateFilterButtons() {
  const group = document.querySelector("[data-library-filters]");
  if (!(group instanceof HTMLElement)) return;

  group.replaceChildren();
  for (const [value, label] of [["all", "All"], ...libraryTypes(state.items).map((type) => [type, type])]) {
    const button = document.createElement("button");
    button.className = "control-button";
    button.type = "button";
    button.dataset.libraryFilter = value;
    button.setAttribute("aria-pressed", String(state.filter === value));
    button.textContent = label;
    group.append(button);
  }

  if (!libraryTypes(state.items).includes(state.filter) && state.filter !== "all") {
    state.filter = "all";
    group.querySelector('[data-library-filter="all"]')?.setAttribute("aria-pressed", "true");
  }
}

function visibleItems() {
  return sortLibraryItems(
    state.items.filter((item) => libraryMatchesFilter(item, state.filter)),
    state.sort
  );
}

function render() {
  const rows = document.querySelector("[data-library-rows]");
  const empty = document.querySelector("[data-library-empty]");
  if (!(rows instanceof HTMLElement) || !(empty instanceof HTMLElement)) return;

  const items = visibleItems();
  rows.replaceChildren(...items.map(createRow));
  empty.hidden = items.length > 0;
  if (!items.length) {
    empty.textContent = state.items.length
      ? "No matching Library entries."
      : "No published Library entries are available.";
  }
}

function updateButtons(selector, activeValue) {
  document.querySelectorAll(selector).forEach((button) => {
    const value = button.getAttribute("data-library-filter") || button.getAttribute("data-library-sort");
    button.setAttribute("aria-pressed", String(value === activeValue));
  });
}

function setupControls() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("button") : null;
    if (!(target instanceof HTMLButtonElement)) return;

    if (target.dataset.libraryFilter !== undefined) {
      state.filter = target.dataset.libraryFilter || "all";
      updateButtons("[data-library-filter]", state.filter);
      render();
    }

    if (target.dataset.librarySort !== undefined) {
      state.sort = target.dataset.librarySort || "date-desc";
      updateButtons("[data-library-sort]", state.sort);
      render();
    }
  });
}

function setSourceState(sourceState, message) {
  const source = document.querySelector("#library-source");
  if (source instanceof HTMLElement) source.textContent = message;

  const library = document.querySelector(".library");
  if (library instanceof HTMLElement) library.dataset.sourceState = sourceState;
}

async function loadLibrary() {
  if (forcedFallback) {
    setSourceState("fallback", "Saved public record - live source paused");
    return;
  }

  try {
    const csv = await fetchText(DATA_SOURCES.library.url);
    state.items = parseLibraryCsv(csv);
    updateFilterButtons();
    render();
    setSourceState(state.items.length ? "live" : "empty", state.items.length
      ? "Live public record"
      : "Live record contains no published entries");
  } catch (error) {
    setSourceState("fallback", "Saved public record - live source unavailable");
    console.warn("Library source unavailable; retaining the saved public record.", error);
  }
}

setupControls();
updateFilterButtons();
render();
void loadLibrary();
