# MyWebsite publication architecture

Status: approved direction, not yet implemented  
Approved: 2026-08-06  
Public production remains unchanged until a separate, tested cutover is approved.

## Purpose

MyWebsite is the long-term public portal for Jakob la Cour's practice. This repository already contains valuable structure, behaviour and visual decisions. Consolidation must extend the existing site rather than replace it with a new expression.

The governing separation is:

- GitHub stores stable form, code, routes, behaviour and version history.
- Google Sheets stores structured live public content.
- Google Docs may store longer editorial copy through one stable adapter.
- MyContext stores approved meaning, facts, boundaries and decisions.
- Artifact manifests store verified artifact records and media journeys.
- WordPress remains the current production site and rollback archive during consolidation.

Small content changes must not require an AI model, a code edit or a deployment.

## Existing surfaces to preserve

| Surface | Current role | Current live source |
| --- | --- | --- |
| Home | Living media field, Now and navigation | Video sheet and activities sheet |
| Journey / Seeds | Geographic and relational field | Map sheet with categories and threads |
| Activities | Filterable professional record | Activities sheet |
| Library | Filterable publications, press and documents | Library sheet |
| Works | Concentrated dossiers | Repository pages and media |
| Contact | Public access | Repository markup |
| Artifacts | Deep media and ritual portals | Artifact JSON manifests in the Artifact repository |

The current Google flows are working infrastructure. Do not replace them merely to make the stack more conventional.

## Public source map

Use the smallest appropriate source for each content type:

| Content type | Preferred source |
| --- | --- |
| Repeated structured records, dates, links, status and sorting | Google Sheets |
| Short Home, About and Contact fields | A public `Site Content` sheet tab with stable keys |
| Longer editorial text | Google Doc through a stable style-independent adapter |
| Rarely changed work dossiers and route composition | Git repository |
| Artifact identity, provenance and journey steps | Validated Artifact manifests |
| Approved facts and public boundaries | MyContext |

Every public data source must expose only deliberately publishable material. A `status` or equivalent publication gate must be respected. MyLog, MyMemory and private MyContext content never publish automatically.

## Visual authority

Do not redesign from scratch.

Use this source order:

1. The current Artifact implementation is the leading visual and technical reference.
2. The current MyWebsite implementation is authoritative for website structure and existing behaviour.
3. MyContext is authoritative for meaning, identity and public boundaries.
4. The live WordPress site is authoritative only for legacy content, URLs and archive history.

The shared public grammar includes:

- near-black spatial surfaces,
- full and sensorial media,
- restrained serif type with precise monospace metadata,
- fine rules, identifiers, coordinates and archive marks,
- spiral-based passage and navigation,
- map, time and relational traces,
- motion that supports orientation,
- dense information revealed progressively rather than shown as generic cards.

Different spaces keep distinct functions. Home is a field. Works are dossiers. Journey / Seeds shows relations. Activities and Library form the Record. Artifacts are deep portals. About and Contact provide clarity.

## Technical consolidation target

Astro is the preferred consolidation runtime because it is already used and validated in `karitet/jakob-la-cour-artifacts`.

The consolidation should:

- preserve existing routes and data flows,
- render a resilient static shell,
- fetch intentionally live Google data where immediacy matters,
- use ordinary optimized media files rather than embedded base64 assets,
- share the Artifact visual grammar without coupling the two repositories unnecessarily,
- keep JavaScript local to the surfaces that need it,
- work as a deliberate mobile composition,
- remain deployable as a static site.

Do not create a new CMS, dashboard or editing application.

## Minimal Site Content model

A dedicated public tab can expose stable page fields:

| key | title | body | link | status |
| --- | --- | --- | --- | --- |
| `home.statement` |  | Main public statement |  | publish |
| `about.intro` | About | Short public introduction |  | publish |
| `contact.email` | Email | Public email | `mailto:...` | publish |
| `contact.phone` | Phone | Public phone | `tel:...` | publish |

The website controls typography and composition. The sheet controls only content.

## Incremental implementation

1. Capture screenshots and behaviour of the current Home, Journey / Seeds, Activities, Library, Works and Artifact reference.
2. Inventory every live Google source and its expected column contract.
3. Define shared visual tokens from the current Artifact implementation.
4. Establish an Astro shell while preserving the current site as reference.
5. Port one representative surface and compare it visually and functionally.
6. Add the minimal `Site Content` source for short editable copy.
7. Port remaining surfaces one by one, preserving URLs and live sources.
8. Validate accessibility, mobile composition, resilience and performance.
9. Evaluate the completed candidate against the live WordPress site.
10. Change domain or retire WordPress only after backup, rollback testing and explicit approval.

## Non-goals for the first implementation

- no new visual identity,
- no automatic publishing from private systems,
- no WordPress migration,
- no domain or DNS change,
- no replacement of working Google sources,
- no monolithic CMS,
- no broad content rewrite,
- no new publishing cadence.

## Acceptance criteria

The consolidated candidate is ready for evaluation when:

- the landed visual expression is recognizably preserved and strengthened,
- Artifact grammar is visible without making every page an artifact,
- Home, Journey / Seeds, Activities and Library retain their core behaviour,
- Jakob can update common public content in Google tools without AI,
- public data remains deliberately curated,
- existing important URLs are preserved or explicitly redirected,
- a failed Google request does not destroy basic page orientation,
- mobile feels composed rather than stacked,
- the current WordPress site remains available as rollback.
