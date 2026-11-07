# Changelog

## 1.2.0 — 2026-11-07

Documentation and packaging release; no breaking class renames.

### Added

- MIT license.
- `gals.css` now applies `box-sizing: border-box` inside `.container` and `min-width: 0` to direct children, so the grid works without a global reset.
- `gals.js`: dropdown positioning, `aria-haspopup`/`aria-expanded`, arrow/Home/End navigation for `[popovertarget] + .dropdown`.
- `gals:refresh` event to re-fit `img.container-fluid` after SPA content replacement.
- `download/grid.zip.sha256`, a reproducible `build:zip` script, and README/LICENSE inside the archive.
- CI workflow: tests, build reproducibility, demo and prerender checks.
- `doesNotExist` replacement hints in `gals-classes.json`.

### Changed

- Package version is `1.2.0` and `gals-classes.json` reads it from `package.json`.
- Browser support is documented honestly: Chrome/Edge 114+, Firefox 125+, Safari/iOS 17+.
- README now includes licensing, requirements, browser support and actual test/count/gzip figures.
- Fluid images preserve aspect ratio (`height: auto`) and subtract horizontal padding, not borders.
- Breakpoint documentation now matches the CSS (`l` ends at `1439.98px`).
- Removed the non-GALS `demo/trackmetro.html` from sitemap and `llms.txt`.

### Fixed

- Broken `../image/...` paths in the Images and Helpers demos.
- Dead `#cdn` link on the Download page.
- Dropdown opening at the top-left of the viewport instead of the trigger.
- Stale version claims (`V1.0`, `1.0 build`, `70 tests / 13 suites`, 12 KB gzip).
- The `blockquote`/`Optional` ordering in `llms.txt` remains as-is; the section will move to the end in a follow-up.

## 1.1.0

Initial public release series. See the repository history.
