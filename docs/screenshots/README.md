# Phase 1 visual verification

Captured on 2026-08-06 with Chromium at 1440×900 and 390×844.

## Static reference before Astro

- `before-home-desktop.png`
- `before-home-mobile.png`

Source: the unchanged GitHub Pages build at
`https://karitet.github.io/jakoblacour.com/`.

## Astro Home with live Google data

- `astro-home-desktop-live.png`
- `astro-home-mobile-live.png`

Source: local production build preview at `/` after both Google contracts were
validated.

## Astro Home with deterministic fallback

- `astro-home-desktop-fallback.png`
- `astro-home-mobile-fallback.png`

Source: local production build preview at `/?data=fallback`. No reel element is
created and the saved Now rows remain in the document.
