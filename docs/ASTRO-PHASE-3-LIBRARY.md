# Astro Phase 3 — Library

## Scope

Phase 3 ports the public Library record to Astro. Its public route remains
`/library.html`; WordPress, DNS, hosting, production and the Google Sheet are
unchanged.

## Structure

- `src/pages/library.astro` emits the new static Library route.
- `src/components/LibraryExperience.astro` contains a complete initial public
  record, controls and a visible source state.
- `src/scripts/library.js` progressively loads the existing Library CSV,
  renders its rows safely and preserves filtering and sorting.
- `src/lib/public-data.mjs` owns the tested Library adapter beside the existing
  Home and Activities adapters.
- `src/data/library-fallback.mjs` provides a saved, publishable initial record
  so orientation, links and controls remain useful when Google is unavailable.
- `library.html` remains frozen source material. The build copies it to
  `dist/legacy/library.html` while Astro emits the live candidate at
  `dist/library.html`.

## Preserved behaviour

The record keeps the existing Library sheet and its public `title`, `status`,
`type`, `date`, `url` and `outlet` fields. It also carries through available
`language`, `project`, `quote` and `external_id` metadata. Only `status=publish`
rows render. Type filters are generated from the current record, while the
existing date, type and title sort modes remain available.

The initial document contains the saved public list. When the live request
succeeds, only that list is replaced. `?data=fallback` intentionally retains
the saved record; a failed live request behaves the same way. A valid empty
live record is shown explicitly as an empty state rather than being confused
with a failed request.

## Visual treatment

Library remains a Record surface for documents and circulation, not a copy of
Activities or an Artifact portal. It uses the established near-black space,
warm-paper serif titles, monospace metadata, fine archive rules and a compact
mobile record composition. Outlet, language and related project information
remain close to their entries without turning the record into generic cards.

## Local preview

```bash
pnpm dev
```

Open `/library.html` for live Google data and
`/library.html?data=fallback` for the deterministic saved record.
