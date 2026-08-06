# Astro Phase 1

## Scope

Phase 1 is a technical proof of the approved publication architecture. It ports
only Home to Astro. No domain, DNS, hosting, WordPress, Google Sheet or Google
Doc is changed.

## Structure

- `src/pages/index.astro` emits the new static Home.
- `src/components/HomeExperience.astro` contains the semantic Home shell and
  saved fallback content.
- `src/scripts/home.js` progressively loads the video reel and Now data and
  controls the existing panels.
- `src/lib/public-data.mjs` holds the tested CSV adapters and publication gate.
- `src/config/data-sources.mjs` is the single source of Google endpoints.
- `scripts/copy-legacy-pages.mjs` preserves the existing non-Home routes in the
  build and copies the old Home to `/legacy/index.html`.
- `index.html` and the six other root HTML files remain the frozen pre-Astro
  implementation.

## Resilience

The initial HTML always contains:

- the local Home still,
- the identity statement,
- saved Now orientation,
- Works, Journey, Record and Contact navigation,
- direct links to every preserved route.

Google data progressively replaces only the relevant saved region. Either
request can fail independently without blanking the page. Add
`?data=fallback` to the Home URL to skip both requests and inspect the fallback.

## Artifact principles used

The implementation keeps MyWebsite's existing identity. From Artifacts it uses
only concrete shared grammar:

- ordinary local media instead of large base64 payloads in the Astro Home,
- a near-black and warm-paper token system,
- a small shared spiral mark in Journey navigation,
- visible focus, reduced-motion handling and mobile safe-area spacing,
- a static-first document with JavaScript limited to live enhancement.

## Local preview

```bash
pnpm install
pnpm dev
```

Production-equivalent preview:

```bash
pnpm check
pnpm run verify:data
pnpm preview
```

Use `/` for live Google data and `/?data=fallback` for the deterministic saved
state.

## Known differences from the original Home

- The Astro Home references extracted ordinary image files instead of embedding
  the same images as base64.
- Google failures are now visible and retain useful content instead of failing
  silently.
- Panel controls expose expanded/hidden state and restore keyboard focus.
- The preserved route links use explicit `.html` URLs so the static build works
  without host-specific rewrites.
- A small Artifact spiral appears only inside the Journey panel.

The statement, visual hierarchy, media field, Now placement, navigation names,
panel content, palette, typography and contact details are otherwise retained.
