# Astro Phase 5 — Works reconciliation

Status: implemented review candidate, not deployed
Checked: 2026-08-11
Production: WordPress remains unchanged

## Outcome

Phase 5 does not merge WordPress and MyWebsite as systems. It establishes one
small, static, source-aware Works model in Git and proves it with a new Astro
candidate at `/works/hybrid-sensation.html`.

`/works/hybrid-sensation.html` is the Phase 5 review candidate. The stable
`/hybrid-sensation.html` remains byte-identical source and rollback material
until Jakob has approved the visual and editorial result. A later approved
completion may move the Astro dossier to the stable route and retain the former
page under `legacy/`; this checkpoint creates neither a redirect nor a route
replacement. No public WordPress URL, domain setting, DNS setting or WordPress
content was changed.

## Authority and reconciliation rule

The model records its sources rather than flattening them into an unqualified
truth. Its precedence is:

1. direct approved correction;
2. approved MyContext meaning and current project direction;
3. current MyWebsite implementation;
4. WordPress as historical public archive, media source and URL record.

MyContext is used editorially while building the committed record. It is not a
runtime source, and no MyContext file is fetched or exposed by the website.
Only `publicationStatus: publish` records participate in the generated route.

Every displayed factual field in `src/data/works.mjs` has a source id and a
status. Public WordPress archive sources can be rendered as links; internal
reconciliation sources are retained only in code for auditability. This is the
boundary a later curator can use: it can distinguish approved current meaning,
historical evidence and unresolved information instead of inventing a merged
record.

## WordPress inventory

Read-only inspection on 2026-08-11 found:

| Public URL | Finding | Phase 5 use |
| --- | --- | --- |
| `https://jakoblacour.com/work/` | 15 selected-work entries and filters; both Hybrid Sensation entries are present. | Historical collection membership and legacy URL inventory. |
| `https://jakoblacour.com/download-work/work/` | Retried once on 2026-08-11 with a 45-second bound. It resolved to the canonical Selected Work page (`/work/`). | Recorded as a duplicate entry point, not a separate work inventory. |
| `https://jakoblacour.com/lens_portfolio/hybrid-sensation/` | Original-work description, 2023 premiere, production details, credits, reviews and audience notice. | Primary historical source for the original edition. |
| `https://jakoblacour.com/lens_portfolio/hybrid-sensation-tour-edition/` | Tour Edition description, 2026 date list, format, credits, access and safety information. | Primary historical source for the Tour Edition. |
| `https://jakoblacour.com/work/hybrid-sensation-tour-edition/` | A second public Tour Edition URL. It differs slightly in credits and support listing. | Retained as a historical alias, not silently merged. |
| `https://jakoblacour.com/bio-statement/` | Historical biography, artist statement and connected public sources. | Inventory only; no current-bio migration in this phase. |
| `https://jakoblacour.com/studio/` | Prox Studio description, historical studio framing and contact link. | Inventory only; no studio migration in this phase. |
| `https://jakoblacour.com/contact/` | Historical contact and press/booking routes. | Inventory only; existing Site Content contact flow remains authoritative in Astro. |

The public WordPress sitemap was also checked. Its `lens_portfolio` sitemap has
15 entries, including both Hybrid Sensation records, matching the Selected Work
grid. The inventory is **partial**: it is complete for this Phase 5 Lens
Portfolio/identified-page scope, but it does not claim to catalogue every
WordPress post, gallery, attachment or historical revision.

The WordPress-selected work grid has value as historical archival evidence, but
it is not a future canonical Works dataset. It lacks a publication model, field
provenance and an explicit method for resolving a work family and its editions.

## Hybrid Sensation decisions

- `Hybrid Sensation` is the work family.
- The 2023 original work and the `Tour Edition` are separate documented
  editions in that family, matching MyContext's approved reconciliation.
- Current public orientation is `In circulation`, sourced to approved current
  project direction rather than WordPress tour dates.
- The five 2026 Tour Edition dates are explicitly displayed as historical
  dates, not future availability.
- The second Tour Edition URL is kept as a source link. Its one-sided credit
  and support differences are not imported as confirmed facts.
- One public WordPress image is copied locally for a stable Astro prototype.
  Its public credit is omitted. Page markup, attachment metadata searches and
  related credits did not verify the photographer for this particular image;
  EXIF, filename and the separate documentary credit were not promoted to a
  public claim.
- Booking, press-kit and media-download links are not copied into the candidate.
  They remain discoverable on the WordPress archive until each destination and
  contact policy is verified for the future catalog.

## Model contract

`src/data/works.mjs` is deliberately plain JavaScript so Astro and later static
catalog tooling can consume it without a database or CMS. A work record has:

- a stable `id`, `slug`, `familyId` and publication gate;
- source-aware `title`, `summary`, `workType`, `currentOrientation`, edition
  details and audience notices;
- edition-specific credits and historical dates;
- a local hero asset with explicit credit status;
- public source links separated from internal reconciliation references; and
- the preserved legacy route.

`validateWorksCatalog()` and `tests/works-data.test.mjs` verify unique identity,
publication gating and known source references. The model is intentionally
small: adding a further work requires verified data and an explicit editorial
decision, not a scrape of the WordPress grid.

## Reconciliation distribution

| Disposition | Count | Important records |
| --- | ---: | --- |
| `migrate` | 1 | Hybrid Sensation’s reconciled data is projected to the review candidate only. |
| `merge` | 2 | The original Hybrid Sensation and Tour Edition source records form one work family with separate editions. |
| `archive` | 0 | No route or WordPress record is archived in this checkpoint. |
| `redirect` | 0 | No redirect is created. |
| `retain_as_historical_source` | 8 | Selected Work, `/download-work/work/` (canonicalises to Selected Work), both Hybrid dossiers, the Tour alias, Bio + Statement, Studio and Contact. |
| `retire_after_review` | 1 | `/hybrid-sensation.html`, only after explicit visual/editorial approval and a tested move to `legacy/`. |
| `requires_jakob` | 2 | Stable-route promotion and verification/replacement of the local hero photograph. |

The counts are a checkpoint register, not a migration plan for the whole
WordPress installation. The underlying public sitemap shows 15 Lens Portfolio
items; the remaining 13 are retained as historical source material pending a
separate work-by-work editorial decision.

## Public Catalog v0.1

The work-record schema is `src/data/works.mjs`; its direct validation command
is `npm run verify:works`. Public Catalog v0.1 is a generated technical
projection in `src/data/public-catalog.v0.1.mjs`, written at build time to
`dist/catalog/works.v0.1.json`. It currently has **1** entry:
`work-hybrid-sensation`, with the stable edition ids
`hybrid-sensation-original-2023` and
`hybrid-sensation-tour-edition-2026`.

The catalog is generated, not hand-written. It includes only publish-gated work
data, local public media references and public archive sources. It omits
internal source ids, MyContext references, reconciliation notes and the
`hero_credit_status: requires_jakob` blocker. `npm run verify:catalog`, its
node tests and build-output verification enforce that boundary.

## Candidate scope

The Astro prototype uses the existing dark, sensorial public grammar: large
ordinary media, serif display text, monospace metadata, fine archive rules and
mobile-first layout. It is static and does not add a CMS, live AI, Ollama,
MacOps integration, a gateway or a Living Field.
