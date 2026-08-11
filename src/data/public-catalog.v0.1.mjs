import { publicArchiveSources, publishedWorks } from "./works.mjs";

export const PUBLIC_CATALOG_VERSION = "0.1";

function editionProjection(edition) {
  return {
    id: edition.id,
    title: edition.title.value,
    description: edition.descriptor.value,
    facts: edition.facts.map((fact) => ({ label: fact.label, value: fact.detail.value })),
    credits: edition.credits.map((credit) => ({ role: credit.role, people: credit.people })),
    audience: edition.audience.map((notice) => notice.value),
    historicalDates: edition.historicalDates?.map((event) => ({
      venue: event.venue,
      date: event.date
    })) ?? []
  };
}

function entryProjection(work) {
  return {
    id: work.id,
    kind: "work_family",
    slug: work.slug,
    title: work.title.value,
    workType: work.workType.value,
    currentOrientation: work.currentOrientation.value,
    reviewHref: work.reviewHref,
    stableHref: work.stableHref,
    summary: work.summary.value,
    situation: work.situation.value,
    media: {
      src: work.hero.src,
      width: work.hero.width,
      height: work.hero.height,
      alt: work.hero.alt
    },
    editions: work.editions.map(editionProjection),
    reviews: work.reviews.map(({ publication, rating, title, url }) => ({
      publication,
      ...(rating ? { rating } : {}),
      title,
      url
    })),
    sources: publicArchiveSources(work).map(({ id, kind, label, url, accessedAt }) => ({
      id,
      kind,
      label,
      url,
      accessedAt
    }))
  };
}

export function createPublicCatalog() {
  return {
    schema: "jakoblacour.public-catalog",
    version: PUBLIC_CATALOG_VERSION,
    generatedFrom: "src/data/works.mjs",
    entries: publishedWorks().map(entryProjection)
  };
}

export function validatePublicCatalog(catalog = createPublicCatalog()) {
  if (catalog.schema !== "jakoblacour.public-catalog") throw new Error("Unexpected public catalog schema.");
  if (catalog.version !== PUBLIC_CATALOG_VERSION) throw new Error("Unexpected public catalog version.");
  if (!Array.isArray(catalog.entries) || catalog.entries.length === 0) {
    throw new Error("Public catalog has no publishable entries.");
  }

  const entryIds = new Set();
  for (const entry of catalog.entries) {
    if (entryIds.has(entry.id)) throw new Error(`Duplicate public catalog id: ${entry.id}`);
    if (!entry.id || !entry.slug || !entry.reviewHref || !entry.stableHref) {
      throw new Error("Public catalog entry is missing stable identity or route data.");
    }
    if (entry.reviewHref === entry.stableHref) {
      throw new Error(`${entry.id}: review and stable routes must remain distinct during review.`);
    }
    if (!entry.media.src.startsWith("/media/")) throw new Error(`${entry.id}: media must be local.`);
    if (entry.sources.length === 0 || !entry.sources.every((source) => source.url.startsWith("https://"))) {
      throw new Error(`${entry.id}: public sources are missing or invalid.`);
    }
    if (entry.editions.some((edition) => !edition.id || !edition.title)) {
      throw new Error(`${entry.id}: edition identity is incomplete.`);
    }
    entryIds.add(entry.id);
  }

  const serialized = JSON.stringify(catalog);
  for (const privateMarker of ["sourceIds", "reconciliationNotes", "requires_jakob", "MyContext/"]) {
    if (serialized.includes(privateMarker)) {
      throw new Error(`Public catalog exposes a private or unresolved marker: ${privateMarker}.`);
    }
  }

  return true;
}
