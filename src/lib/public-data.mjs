const REEL_COLUMNS = Object.freeze({
  title: ["title", "name"],
  src: ["src", "source", "video", "url"],
  poster: ["poster", "image"],
  link: ["link", "href"],
  start: ["start", "in"],
  end: ["end", "out"],
  weight: ["weight", "prio", "priority"],
  status: ["status", "publish"],
  aspect: ["aspect", "ratio", "ar"]
});

const ACTIVITY_COLUMNS = Object.freeze({
  job: ["job title", "job titel", "title", "titel", "work", "værk", "vaerk"],
  year: ["year", "aar", "år", "date", "dato"],
  production: [
    "production company",
    "company",
    "producer",
    "producent",
    "produktion",
    "produktionsselskab",
    "produktion selskab"
  ],
  url: ["url", "link", "href"],
  category: [
    "category",
    "kategori",
    "artistical/educational",
    "artistic/educational",
    "type"
  ],
  selected: ["selected", "udvalgt", "yes/no", "selected?", "is selected"],
  status: ["status", "state", "aktiv", "active/past"]
});

const LIBRARY_COLUMNS = Object.freeze({
  title: ["title", "name", "document", "publication"],
  type: ["type", "category", "format"],
  date: ["date", "publish date", "publication date", "year"],
  url: ["url", "link", "href"],
  outlet: ["outlet", "publisher", "source", "publication outlet"],
  language: ["language", "lang"],
  project: ["project", "work"],
  quote: ["quote", "excerpt", "description"],
  externalId: ["external_id", "external id", "id"],
  status: ["status", "state", "publish"]
});

export function normalizeHeader(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseCsv(text) {
  const rows = [];
  let field = "";
  let quoted = false;
  let row = [];

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (field.length || row.length) {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) =>
    cells.length > 0 && cells.some((cell) => String(cell).trim() !== "")
  );
}

function indexColumns(headers, aliases) {
  const normalized = headers.map(normalizeHeader);
  return Object.fromEntries(
    Object.entries(aliases).map(([key, options]) => [
      key,
      options.map(normalizeHeader).map((name) => normalized.indexOf(name)).find((value) => value >= 0) ?? -1
    ])
  );
}

function pick(row, indexes, key) {
  const index = indexes[key];
  return index >= 0 ? String(row[index] ?? "").trim() : "";
}

function findHeaderRow(rows, aliases) {
  const known = Object.values(aliases).flat().map(normalizeHeader);
  const index = rows.findIndex((row) => row.map(normalizeHeader).some((cell) => known.includes(cell)));
  return index >= 0 ? index : 0;
}

export function parseReelCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headerRow = findHeaderRow(rows, REEL_COLUMNS);
  const indexes = indexColumns(rows[headerRow], REEL_COLUMNS);

  return rows
    .slice(headerRow + 1)
    .map((row) => {
      const title = pick(row, indexes, "title");
      const src = safeMediaUrl(pick(row, indexes, "src"));
      if (!title || !src) return null;

      const start = Number.parseFloat(pick(row, indexes, "start"));
      const end = Number.parseFloat(pick(row, indexes, "end"));
      const weight = Number.parseFloat(pick(row, indexes, "weight"));
      const aspect = Number.parseFloat(pick(row, indexes, "aspect"));
      const status = (pick(row, indexes, "status") || "publish").toLowerCase();

      if (status !== "publish") return null;

      return {
        title,
        src,
        poster: safeMediaUrl(pick(row, indexes, "poster")),
        link: safePublicUrl(pick(row, indexes, "link")),
        start: Number.isFinite(start) && start >= 0 ? start : 0,
        end: Number.isFinite(end) && end > start ? end : null,
        weight: Number.isFinite(weight) && weight > 0 ? weight : 1,
        aspect: Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9
      };
    })
    .filter(Boolean);
}

export function parseActivitiesCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headerRow = findHeaderRow(rows, ACTIVITY_COLUMNS);
  const indexes = indexColumns(rows[headerRow], ACTIVITY_COLUMNS);

  return rows
    .slice(headerRow + 1)
    .map((row) => {
      const job = pick(row, indexes, "job");
      if (!job) return null;

      const year = pick(row, indexes, "year");
      const status = pick(row, indexes, "status").toLowerCase();
      const active = /(active|current|ongoing|present|now|aktuel|upcoming|kommende)/.test(status)
        || /^\s*\d{4}\s*[–-]\s*$/.test(year);

      return {
        job,
        year,
        production: pick(row, indexes, "production"),
        url: safePublicUrl(pick(row, indexes, "url")),
        category: activityCategory(pick(row, indexes, "category")),
        selected: /^(y(es)?|ja|true|1)$/i.test(pick(row, indexes, "selected")),
        status,
        active
      };
    })
    .filter(Boolean);
}

export function libraryDateKey(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const match = raw.match(/^(\d{4})(?:[-/.](\d{1,2})(?:[-/.](\d{1,2}))?)?$/);
  if (!match) return "";

  const [, year, month = "01", day = "01"] = match;
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > 31) return "";

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function parseLibraryCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const headerRow = findHeaderRow(rows, LIBRARY_COLUMNS);
  const indexes = indexColumns(rows[headerRow], LIBRARY_COLUMNS);

  return rows
    .slice(headerRow + 1)
    .map((row) => {
      const title = pick(row, indexes, "title");
      const status = pick(row, indexes, "status").toLowerCase();
      if (!title || status !== "publish") return null;

      const rawDate = pick(row, indexes, "date");
      return {
        title,
        type: pick(row, indexes, "type"),
        date: libraryDateKey(rawDate) || rawDate,
        url: safePublicUrl(pick(row, indexes, "url")),
        outlet: pick(row, indexes, "outlet"),
        language: pick(row, indexes, "language"),
        project: pick(row, indexes, "project"),
        quote: pick(row, indexes, "quote"),
        externalId: pick(row, indexes, "externalId"),
        status
      };
    })
    .filter(Boolean);
}

export function currentActivities(items, limit = 4) {
  return items
    .filter((item) => item.active)
    .sort((a, b) => activityYearKey(b.year).localeCompare(activityYearKey(a.year)))
    .slice(0, limit);
}

export function activityCategory(value) {
  const category = String(value ?? "").trim();
  if (/educ/i.test(category)) return "Educational";
  if (/art/i.test(category)) return "Artistical";
  return category;
}

export function activityMatchesFilter(item, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "selected") return item.selected;
  return item.category === filter;
}

export function activityYearKey(value) {
  return String(value ?? "").match(/\d{4}/)?.[0] ?? "";
}

export function sortActivities(items, sort = "year-desc") {
  const [key, direction] = sort.split("-");
  const multiplier = direction === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const aValue = key === "title" ? a.job : activityYearKey(a.year);
    const bValue = key === "title" ? b.job : activityYearKey(b.year);

    if (key === "year" && (!aValue || !bValue)) {
      if (!aValue && !bValue) return 0;
      return !aValue ? 1 : -1;
    }

    return multiplier * String(aValue).localeCompare(String(bValue), undefined, {
      sensitivity: "base"
    });
  });
}

export function libraryTypes(items) {
  return [...new Set(items.map((item) => item.type).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function libraryMatchesFilter(item, filter) {
  return !filter || filter === "all" || item.type === filter;
}

export function sortLibraryItems(items, sort = "date-desc") {
  const [key, direction] = sort.split("-");
  const multiplier = direction === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    if (key === "date") {
      const aValue = libraryDateKey(a.date);
      const bValue = libraryDateKey(b.date);
      if (!aValue || !bValue) {
        if (!aValue && !bValue) return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
        return !aValue ? 1 : -1;
      }
      const compared = multiplier * aValue.localeCompare(bValue);
      return compared || a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    }

    const aValue = key === "title" ? a.title : a.type;
    const bValue = key === "title" ? b.title : b.type;
    const compared = multiplier * aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
    return compared || a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}

export function safePublicUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw, "https://jakoblacour.com/");
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? raw : "";
  } catch {
    return "";
  }
}

export function safeMediaUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw, "https://jakoblacour.com/");
    return ["http:", "https:"].includes(url.protocol) ? raw : "";
  } catch {
    return "";
  }
}

export function weightedShuffle(items, random = Math.random) {
  const bag = [];
  for (const item of items) {
    const repetitions = Math.max(1, Math.round(item.weight || 1));
    for (let index = 0; index < repetitions; index += 1) bag.push(item);
  }

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
  }

  return bag;
}
