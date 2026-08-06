# jakoblacour.com — Void build

Drop-in replacement for the GitHub Pages repo. All pages are self-contained HTML
(no build step). Commit the files at the repo root and push.

## Approved direction

MyWebsite is the long-term Git-versioned public portal. The existing expression,
pages and Google Sheets flows are assets to preserve. Consolidation should extend
this implementation with the Artifact system as the leading visual and technical
reference. Small public content changes should remain editable through Google
Sheets or Docs without requiring AI or deployment.

Read the approved [publication architecture](docs/PUBLICATION-ARCHITECTURE.md)
before changing framework, content sources, routes or visual direction.

## Pages
- **index.html** — fixed single-screen front. Living video reel + "Now" + unfolding panels.
- **robotic-bloom / morphic-realities / hybrid-sensation** — works (dossier model).
- **map.html — "Seeds"** — a living field of practice & process, Void-skinned (dark map).
  Quarter-size markers, practice categories, and threads between related points.
- **activities / library** — the Record, reskinned to Void.

## Live data (Google Sheets — already wired)
- **Now (front)** + **activities / library** read your activities sheet (unchanged).
- **Video reel (front)** reads your prox video sheet (title, src, poster, link, start, end, weight, status, aspect).
- **Seeds (map)** reads the same map sheet. Two columns now drive it:
  - **category** — work · session · stream · workshop · talk · masterclass · field · seed
    (define them in the sheet's **Categories** tab: key, label, glyph, color).
  - **thread** — give related entries the same thread id and a dotted line connects them
    (e.g. a work and its field recordings). Optional.
  (The old `sphere` column still works as a fallback until you switch over.)

## To finish
- **MR hero** (`morphic-realities`) uses a Void still as a stand-in — swap for a real production photo.
- Repopulate the map sheet with the new **category** values (and optional **thread** ids).
- Real **ISBN / edition** data drops into the Publication panels when ready.
- Optional: rename the front's "Journey" nav to "Seeds" for full consistency (say the word).

## Notes
- Front: nav panels slide from the right. Works: the dossier sits on the left, dismiss to reveal the image.
- Everything works on mobile portrait (simplified).
