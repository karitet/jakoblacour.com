# Astro Phase 2 — Activities

## Scope

Phase 2 ports only the public Activities record to Astro. Its public route
remains `/activities.html`; WordPress, DNS, hosting, production and the Google
Sheet are unchanged.

## Structure

- `src/pages/activities.astro` emits the static Activities page frame.
- `src/components/ActivitiesExperience.astro` supplies the semantic Record
  structure, controls and clear source state.
- `src/scripts/activities.js` progressively reads the existing Activities CSV,
  renders its rows safely and preserves filters and sorting.
- `src/lib/public-data.mjs` is the shared adapter for both Home Now and
  Activities, so accepted source headers and activity recognition do not drift.
- `activities.html` remains frozen source material. The build copies it to
  `dist/legacy/activities.html` while Astro emits the live candidate at
  `dist/activities.html`.

## Preserved behaviour

The record keeps its `All`, `Selected`, `Artistical` and `Educational` filters,
its year/title sort controls, separate Upcoming and Past sections, external
activity links and the existing published Google CSV.

The initial document is a complete static orientation. If the Google request
fails or is paused with `?data=fallback`, it leaves the page usable and exposes
a concise source state rather than replacing the page with a failed request.

## Visual treatment

Activities remains a Record surface rather than becoming an Artifact portal.
It applies the established near-black surface, warm-paper typography, monospace
metadata, fine rules, explicit source state and mobile-safe composition used by
Home and the Artifact reference, without introducing a new visual system.

## Local preview

```bash
pnpm dev
```

Open `/activities.html` for the live record and
`/activities.html?data=fallback` for the static fallback frame.
