# MyContext backflow — MyWebsite Phase 5

Status: implementation proposal; not written to MyContext
Prepared: 2026-08-11
Destination: MyContext website/project and publication-architecture context

## Proposed backflow

- **Hybrid Sensation work family and editions:** implemented proposal. The
  public review candidate groups the 2023 original work and Tour Edition as one
  family with distinct edition records. This is not final public approval until
  Jakob has reviewed the candidate.
- **Candidate route:** `/works/hybrid-sensation.html` is a temporary Phase 5
  review decision. `/hybrid-sensation.html` remains unchanged. A later explicit
  approval may promote the Astro route and retain the former route under
  `legacy/`; no redirect or replacement has been made.
- **Work-record schema:** `src/data/works.mjs` is an implemented proposal for
  stable work identity, family/edition relation, publication gate, local media
  and field-level source status.
- **Public Catalog:** `src/data/public-catalog.v0.1.mjs` is an implemented
  technical projection. It is generated to
  `dist/catalog/works.v0.1.json` and currently contains one public work-family
  entry. It is not a new CMS or automatic publishing path.
- **WordPress reconciliation:** verified working method. WordPress is used
  read-only as historical public content, media and URL evidence; current
  meaning remains governed editorially by approved MyContext direction. Public
  facts are reconciled explicitly rather than scraped into a canonical record.

## Open questions for Jakob

- Verify the photographer for the local Hybrid Sensation hero or approve a
  replacement. The candidate deliberately shows no public photographer credit.
- Approve, correct or defer the candidate’s visual and editorial composition
  before any stable-route promotion.
- Resolve any later credit/support discrepancy between the two public Tour
  Edition URLs from a primary production source before it is added to the
  work record.

MyContext: Tilbageføring vedlagt, men endnu ikke skrevet
