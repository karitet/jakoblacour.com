# jakoblacour.com — Void build

Drop-in replacement for the GitHub Pages repo. All pages are self-contained HTML
(no build step). Just commit the files at the repo root and push.

## Pages
- **index.html** — fixed single-screen front. Living video reel + "Now" + unfolding panels.
- **robotic-bloom.html / morphic-realities.html / hybrid-sensation.html** — works (dossier model).
- **map.html** — the Morphic Archive (unchanged; light theme — pending its own Void pass).
- **activities.html / library.html** — the Record, reskinned to Void.

## Live data (Google Sheets — already wired)
- **Now (front)** + **activities/library** read your activities sheet (the same one as before).
- **Video reel (front)** reads your prox video sheet (title, src, poster, link, start, end, weight, status, aspect).
  Rows with a YouTube/Vimeo/MP4 `src` crossfade full-screen. No rows → the still poster stays.

## To finish
- **MR hero** (`morphic-realities`) uses a Void still as a stand-in — swap for a real production photo.
- **HS hero** hotlinks a real 2025 tour photo from jakoblacour.com.
- **Hero video (front):** optional — the reel covers it; a local `media/hero-loop.mp4` is not required.
- **map.html** still uses the old light theme — give it the Void pass next.
- Real **ISBN / edition** data drops into the Publication panels when ready.

## Notes
- Front: nav panels slide from the right. Works: the dossier sits on the left, dismiss to reveal the image.
- Everything works on mobile portrait (simplified).
