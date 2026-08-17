# MyWebsite surface and source map

Status: Phase 4 inventory

Last checked: 2026-08-06

This map describes the existing public surfaces and their current authority. It
does not authorize publishing from MyContext, MyLog or MyMemory.

## Surface relationships

| Surface | Public function | Current implementation | Runtime source | Phase 1 treatment |
| --- | --- | --- | --- | --- |
| Home | Living field, current orientation and primary navigation | `src/pages/index.astro` | Video sheet, Activities sheet and mapped Site Content keys | Ported to Astro with saved fallback |
| Works | Concentrated dossiers | `morphic-realities.html`, `robotic-bloom.html`, `hybrid-sensation.html` | Repository markup and embedded media | Preserved unchanged |
| Journey / Seeds | Geographic, temporal and relational field | `map.html` | `Arkiv` and `Categories` sheet tabs | Preserved unchanged |
| Activities | Filterable professional record | `src/pages/activities.astro` | Activities sheet | Astro candidate at `/activities.html`; original route retained at `/legacy/activities.html` as rollback |
| Library | Publications, press and documents | `src/pages/library.astro` | Library sheet | Astro candidate at `/library.html`; original route retained at `/legacy/library.html` as rollback |
| Artifacts | Deep media and ritual portals | Separate `karitet/jakob-la-cour-artifacts` repository | Validated artifact manifests and local media | Linked architectural reference; not copied into this site |
| About | Clear public orientation | No dedicated current route | Not yet defined | `about.title` and `about.summary` are intentionally not bound until an existing surface exists |
| Contact | Festival, venue and co-production access | Home Contact panel | Static markup, progressively enhanced by mapped Site Content keys | Preserved on Astro Home; `contact.location` remains unbound because there is no current location surface |

Home connects visitors to Works, Journey, Activities, Library and Contact. The
three Works routes remain dossiers. Journey / Seeds connects practices in place
and time. Activities and Library form the Record. Artifacts remain independent
permanent portals rather than a generic website section.

## Home video reel

Source: published Google CSV, `gid=0`

Configured in: `src/config/data-sources.mjs`

| Normalized field | Accepted sheet headers | Use |
| --- | --- | --- |
| `title` | `title`, `name` | Visible caption and iframe title |
| `src` | `src`, `source`, `video`, `url` | MP4, Vimeo or YouTube media source |
| `poster` | `poster`, `image` | Optional video poster |
| `link` | `link`, `href` | Optional caption destination |
| `start` | `start`, `in` | Segment start in seconds |
| `end` | `end`, `out` | Segment end in seconds |
| `weight` | `weight`, `prio`, `priority` | Relative repetition in the shuffled reel |
| `status` | `status`, `publish` | Only `publish` is rendered |
| `aspect` | `aspect`, `ratio`, `ar` | Source aspect ratio; defaults to 16:9 |

Failure behavior: the ordinary local Home poster remains visible and the
caption states that the saved still is being shown. Navigation and Now are not
dependent on this request.

## Activities and Home Now

Source: published Google CSV, `gid=0`

Used by: Astro Home and Astro `/activities.html`

| Normalized field | Accepted sheet headers | Use |
| --- | --- | --- |
| `job` | `job title`, `job titel`, `title`, `titel`, `work`, `værk`, `vaerk` | Public activity title |
| `year` | `year`, `aar`, `år`, `date`, `dato` | Display and sorting |
| `production` | `production company`, `company`, `producer`, `producent`, `produktion`, `produktionsselskab`, `produktion selskab` | Activity credit |
| `url` | `url`, `link`, `href` | Optional public destination |
| `category` | `category`, `kategori`, `artistical/educational`, `artistic/educational`, `type` | Filter and grouping |
| `selected` | `selected`, `udvalgt`, `yes/no`, `selected?`, `is selected` | Activities selection filter |
| `status` | `status`, `state`, `aktiv`, `active/past` | Current/upcoming recognition |

Home shows up to four current or upcoming rows. On mobile, the composition
intentionally shows the first two. Failure behavior: the saved Hyperspectral and
Morphic Realities orientation remains visible with a concise source note.

Activities keeps the existing `All`, `Selected`, `Artistical` and `Educational`
filters, and its year/title sorting. It initially renders the page structure and
then reads this same public CSV. If the source fails, it keeps the frame and
reports that the live record is unavailable rather than presenting a blank page.

## Journey / Seeds

Source document ID: `1o34qaVfp4uuK4zchhYRdWjlXc96Q2tyZQRo5Hsraikw`

`Categories` fields:

- `key`
- `label`
- `glyph`
- `color`

`Arkiv` fields consumed by the current implementation:

- `type`
- `category` with legacy fallback `sphere`
- `name`
- `location`
- `lat` / `latitude`
- `lng` / `lon` / `longitude`
- `date_start`
- `date_end`
- `date_added`
- `description`
- `link`
- `thread` with fallbacks `group` / `connects`
- `visible` with legacy fallback `visibel`
- `video_url`
- `image_url`

The map already falls back to local categories and sample seed records if
Google is unavailable.

## Library

Source: published Google CSV, `gid=912394319`

Required public fields are `title`, `status` and `selected`; only rows where
`status=publish` and `selected` is checked are shown. The current UI also
consumes `type`, `date`, `url` and `outlet`. `Codex valg` is editorial guidance
in the sheet only and never changes the public Library.

## Site Content

Source spreadsheet ID: `1PO7j9MFvdXzNM3vyK6u4LMRgFUkQ40RsqbqutZVC1PE`
Runtime tab: `Content` only
Runtime endpoint: `https://docs.google.com/spreadsheets/d/1PO7j9MFvdXzNM3vyK6u4LMRgFUkQ40RsqbqutZVC1PE/gviz/tq?tqx=out:csv&sheet=Content`

The runtime never reads `Guide` or `Lists`. The v0.1 tab schema is:

| key | area | type | language | value | status | scope | updated_at | source_ref | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Published website rows require a stable non-empty key, non-empty value,
`status=publish`, and `scope=website` or `website_and_press`. English (`en`)
wins over a neutral `all` value; duplicate active `key` + language rows reject
the whole live response and keep static copy visible. `source_ref` and `notes`
are never exposed to the public DOM.

| Site Content key | Existing surface actually bound in Phase 4 |
| --- | --- |
| `site.title` | Astro document title on Home, Activities and Library; Activities/Library preserve their route prefix |
| `home.intro` | Home identity heading |
| `home.now_label` | Home Now heading only; current items still use Activities |
| `contact.title` | Home Studio panel heading |
| `contact.summary` | Home Studio panel’s festival/venue line |
| `contact.email` | Existing semantic email link (valid bare email required) |
| `contact.phone` | Existing semantic telephone link (valid bare phone required) |
| `about.title`, `about.summary`, `contact.location` | Not bound: no existing matching public surface |

The website owns typography, composition and link semantics. Only deliberately
public rows cross the manual curation boundary. See
[Phase 4 Site Content](ASTRO-PHASE-4-SITE-CONTENT.md) for editing and access
instructions.
