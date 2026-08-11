# Astro Phase 4 — Site Content

## Scope

Phase 4 adds one reusable, browser-side Site Content adapter for short public
copy and settings. It does not modify Google Sheets, WordPress, DreamHost, DNS,
production, Activities, Library, Now, the reel or map sources. The initial
document is always complete static HTML; Site Content is a progressive
enhancement only.

## Source and schema v0.1

- Spreadsheet: `Jakob la Cour Studio - MyWebsite Content`
- Spreadsheet ID: `1PO7j9MFvdXzNM3vyK6u4LMRgFUkQ40RsqbqutZVC1PE`
- Runtime tab: `Content` only
- Runtime CSV/GViz endpoint:
  `https://docs.google.com/spreadsheets/d/1PO7j9MFvdXzNM3vyK6u4LMRgFUkQ40RsqbqutZVC1PE/gviz/tq?tqx=out:csv&sheet=Content`

The tab header is fixed:

| key | area | type | language | value | status | scope | updated_at | source_ref | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

The parser requires all ten headers. It uses routing by `key`, never row
position. It reads neither `Guide` nor `Lists`; those tabs are documentation,
not runtime sources.

## Runtime contract

`src/lib/site-content.mjs` is the reusable adapter. It accepts only a row that:

- has `status=publish`;
- has `scope=website` or `scope=website_and_press`;
- has a stable, non-empty lowercase key such as `home.intro`;
- has a non-empty `value`;
- has `language=en` for this site or `language=all` as its neutral fallback.

For each key, `en` wins over `all`. Duplicate active values for the same key and
language are a validation error, so the browser leaves every static fallback in
place. `draft`, `archive`, `not_published`, other statuses and other scopes are
ignored. Quoted commas, quotes, Unicode and multiline CSV values are parsed as
plain text. The adapter exposes only resolved key/value pairs: `source_ref` and
`notes` are never rendered.

The adapter does not read or write any Google API, use credentials, or include
server-side secrets. Values are inserted with `textContent`, never HTML.

## Current field mapping

Only existing meaningful surfaces are connected:

| Key | Surface |
| --- | --- |
| `site.title` | Astro document title on Home, Activities and Library; Activities/Library retain their route prefix |
| `home.intro` | Existing Home identity heading |
| `home.now_label` | Existing Home Now heading only |
| `contact.title` | Existing Studio panel heading |
| `contact.summary` | Existing Studio panel introduction |
| `contact.email` | Existing clickable `mailto:` link |
| `contact.phone` | Existing clickable `tel:` link |

`home.now_label` does not alter the Now records themselves; those continue to
come solely from the Activities source. There is no current About route or
other About surface, so `about.title` and `about.summary` are intentionally not
connected. `contact.location` is likewise unbound because the current Contact
panel has no location field. This avoids inventing visible UI merely to consume
a key.

For live email and phone values, enter a bare valid address (`hello@example.com`)
or phone number (`+45 42 59 99 11`). An invalid value retains the static,
clickable contact detail and emits a console warning.

## Editing and publishing a value

1. Add or update the row in the `Content` tab only. Keep the key stable.
2. Set `language` to `en`, or `all` when the same text is language-neutral.
3. Put the public plain-text value in `value`.
4. Set `scope` to `website` or `website_and_press`.
5. Change `status` to `publish` after review. `draft` remains invisible.
6. Save the Sheet. Browsers receive the new value on their next page load; no
   code change, AI run or deployment is required.

Every cell in this workbook must be safe for public exposure. The workbook
sharing model can make even unrendered columns or tabs accessible to people who
have the link; `notes` and `source_ref` are withheld by the website but are not
a private storage area.

## Adding a new key without hidden behaviour

Adding a Sheet row alone does not create UI. First add a meaningful existing or
approved surface with a static fallback. Then add one explicit binding in the
relevant Astro client script, preserving text-only rendering and any semantic
validation required by the field. Add fixture coverage and document the key in
this file and `SOURCE-MAP.md`. New pages, panels or material visual decisions
remain a separate approval decision.

## Fallback, diagnostics and verification

The static HTML values render before JavaScript. A failed request, timeout,
invalid CSV schema, duplicate active key, empty value or unavailable Sheet leaves
those values untouched. `/?data=fallback` disables Site Content together with
the existing Home Now and reel sources. Successful, paused and failed Site
Content loads report concise console status only; no technical failure copy is
shown in the public design.

`pnpm run verify:data` checks Site Content when the endpoint is available, but
reports its absence as non-blocking so a temporarily private new Sheet cannot
break the existing website build. Unit tests cover schema parsing, publication
and scope gates, English versus `all`, blank values, duplicate keys, multiline
CSV, tab targeting and fetch fallback.

## Public access status — 2026-08-11

Verified after the spreadsheet’s General access was set to **Anyone with the
link · Viewer**. A cookie- and credential-free HTTP client receives HTTP `200`,
`text/csv; charset=utf-8` and the exact v0.1 header from the endpoint above.
The live adapter resolves its published English values successfully; no further
sharing or publishing action is required.

Viewer access prevents edits, but everyone who has the link can read the
workbook. Confirm that every cell remains deliberate public material; `notes`
and `source_ref` are withheld by the website but are not private storage.
