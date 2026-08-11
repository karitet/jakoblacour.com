# jakoblacour.com — MyWebsite

The public site is being consolidated incrementally. Phase 1 added an Astro-built
Home, Activities and Library are Astro-built Record surfaces, while preserving
the existing self-contained HTML pages and the original static pages as rollback
references. It does not change WordPress, the production domain, DNS or hosting.

## Approved direction

MyWebsite is the long-term Git-versioned public portal. The existing expression,
pages and Google Sheets flows are assets to preserve. Consolidation should extend
this implementation with the Artifact system as the leading visual and technical
reference. Small public content changes should remain editable through Google
Sheets or Docs without requiring AI or deployment.

Read the approved [publication architecture](docs/PUBLICATION-ARCHITECTURE.md)
before changing framework, content sources, routes or visual direction.

## Pages
- **Astro `/`** — fixed single-screen front. Living video reel + "Now" + unfolding panels.
- **Astro `/activities.html`** — live, filterable Activities record with a static page frame if Google is unavailable.
- **Astro `/library.html`** — live, filterable publications, press and documents record with a saved public fallback.
- **legacy/index.html** — generated rollback copy of the original static Home.
- **legacy/activities.html** — generated rollback copy of the original Activities route.
- **legacy/library.html** — generated rollback copy of the original Library route.
- **robotic-bloom / morphic-realities / hybrid-sensation** — works (dossier model).
- **map.html — "Seeds"** — a living field of practice & process, Void-skinned (dark map).
  Quarter-size markers, practice categories, and threads between related points.
- **Library** — the Record's publications, press and documents surface with its existing Library sheet.

## Live data (Google Sheets — already wired)
- **Now (front)** + **activities / library** read your activities sheet (unchanged).
- **Video reel (front)** reads your prox video sheet (title, src, poster, link, start, end, weight, status, aspect).
- **Seeds (map)** reads the same map sheet. Two columns now drive it:
  - **category** — work · session · stream · workshop · talk · masterclass · field · seed
    (define them in the sheet's **Categories** tab: key, label, glyph, color).
  - **thread** — give related entries the same thread id and a dotted line connects them
    (e.g. a work and its field recordings). Optional.
  (The old `sphere` column still works as a fallback until you switch over.)

Home renders a complete static orientation first, then progressively replaces
the saved media still and Now items with Google data. If either request fails,
the saved orientation remains visible. Use `/?data=fallback` for a deterministic
fallback preview.

## Local development

Requires Node.js 22.12 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal. For the production build:

```bash
pnpm lint
pnpm test
pnpm run verify:data
pnpm build
pnpm preview
```

The static result is written to `dist/`. The build copies the four untouched
legacy routes to their existing `.html` URLs and saves the original Home,
Activities and Library source pages as `dist/legacy/index.html`,
`dist/legacy/activities.html` and `dist/legacy/library.html`.

See [Phase 1 notes](docs/ASTRO-PHASE-1.md), [Phase 2 notes](docs/ASTRO-PHASE-2-ACTIVITIES.md),
[Phase 3 notes](docs/ASTRO-PHASE-3-LIBRARY.md) and the complete [source map](docs/SOURCE-MAP.md).

## To finish
- **MR hero** (`morphic-realities`) uses a Void still as a stand-in — swap for a real production photo.
- Repopulate the map sheet with the new **category** values (and optional **thread** ids).
- Real **ISBN / edition** data drops into the Publication panels when ready.
- Optional: rename the front's "Journey" nav to "Seeds" for full consistency (say the word).

## Notes
- Front: nav panels slide from the right. Works: the dossier sits on the left, dismiss to reveal the image.
- Everything works on mobile portrait (simplified).
- The root-level HTML files are the frozen pre-Astro reference. Do not delete
  them until a later migration phase explicitly replaces each route.
