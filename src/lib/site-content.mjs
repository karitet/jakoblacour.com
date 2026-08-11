import { normalizeHeader, parseCsv } from "./public-data.mjs";

export const SITE_CONTENT_SCHEMA = Object.freeze([
  "key",
  "area",
  "type",
  "language",
  "value",
  "status",
  "scope",
  "updated_at",
  "source_ref",
  "notes"
]);

const PUBLISHABLE_SCOPES = new Set(["website", "website_and_press"]);
const STABLE_KEY = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export class SiteContentValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SiteContentValidationError";
  }
}

function schemaIndexes(headers) {
  const normalized = headers.map(normalizeHeader);
  const indexes = Object.fromEntries(
    SITE_CONTENT_SCHEMA.map((column) => [column, normalized.indexOf(column)])
  );
  const missing = SITE_CONTENT_SCHEMA.filter((column) => indexes[column] < 0);

  if (missing.length) {
    throw new SiteContentValidationError(`Site Content schema is missing: ${missing.join(", ")}.`);
  }

  return indexes;
}

function valueAt(row, indexes, column) {
  return String(row[indexes[column]] ?? "");
}

function normalizedValue(row, indexes, column) {
  return valueAt(row, indexes, column).trim().toLowerCase();
}

/**
 * Resolves one public value per key for a website language. Only `en` and the
 * neutral `all` fallback participate in the English website's public output.
 */
export function parseSiteContentCsv(text, { language = "en" } = {}) {
  const rows = parseCsv(text);
  if (!rows.length) throw new SiteContentValidationError("Site Content CSV is empty.");

  const indexes = schemaIndexes(rows[0]);
  const requestedLanguage = String(language ?? "").trim().toLowerCase();
  if (!requestedLanguage) throw new SiteContentValidationError("A website language is required.");

  const candidates = new Map();

  rows.slice(1).forEach((row, offset) => {
    const rowNumber = offset + 2;
    const status = normalizedValue(row, indexes, "status");
    const scope = normalizedValue(row, indexes, "scope");
    if (status !== "publish" || !PUBLISHABLE_SCOPES.has(scope)) return;

    const key = valueAt(row, indexes, "key").trim();
    if (!key) throw new SiteContentValidationError(`Site Content row ${rowNumber} is publishable but has no key.`);
    if (!STABLE_KEY.test(key)) {
      throw new SiteContentValidationError(`Site Content row ${rowNumber} has an invalid key: ${key}.`);
    }

    const rowLanguage = normalizedValue(row, indexes, "language");
    if (rowLanguage !== requestedLanguage && rowLanguage !== "all") return;

    const value = valueAt(row, indexes, "value").trim();
    if (!value) return;

    const candidateKey = `${key}\u0000${rowLanguage}`;
    if (candidates.has(candidateKey)) {
      throw new SiteContentValidationError(
        `Duplicate active Site Content key for ${key} (${rowLanguage}) in rows ${candidates.get(candidateKey).rowNumber} and ${rowNumber}.`
      );
    }

    candidates.set(candidateKey, { key, language: rowLanguage, value, rowNumber });
  });

  const resolved = new Map();
  for (const candidate of candidates.values()) {
    const current = resolved.get(candidate.key) ?? {};
    current[candidate.language] = candidate.value;
    resolved.set(candidate.key, current);
  }

  return Object.freeze(Object.fromEntries(
    [...resolved.entries()].map(([key, values]) => [key, values[requestedLanguage] ?? values.all])
  ));
}

/**
 * Keeps the caller's static values intact whenever fetching or validation
 * fails. The returned `liveValues` are deliberately separate so a browser can
 * update only fields that were actually supplied by the Content tab.
 */
export async function loadSiteContent({ source, fetchText, fallback = {}, language = "en" }) {
  const staticValues = Object.freeze({ ...fallback });

  try {
    if (!source?.url) throw new SiteContentValidationError("Site Content source URL is missing.");
    if (typeof fetchText !== "function") throw new TypeError("A Site Content fetch function is required.");

    const csv = await fetchText(source.url);
    const liveValues = parseSiteContentCsv(csv, { language });
    return Object.freeze({
      sourceState: "live",
      values: Object.freeze({ ...staticValues, ...liveValues }),
      liveValues,
      error: null
    });
  } catch (error) {
    return Object.freeze({
      sourceState: "fallback",
      values: staticValues,
      liveValues: Object.freeze({}),
      error
    });
  }
}
