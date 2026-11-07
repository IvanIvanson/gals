# GALS — Grid Application Layout Systems

Lightweight flexbox toolkit for rapid prototyping and production.

- 12-column flex grid, 6 breakpoints, 186 class selectors (90 `pt-*` columns, 12 `input-*` widths, 84 component/utility classes).
- 22.7 KB source CSS → 16.0 KB minified → **3.4 KB gzip**; 10.4 KB JS → 4.2 KB → **1.5 KB gzip**.
- Zero runtime dependencies, no build step for users, no framework lock-in.

## Quick start

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GALS demo</title>
  <style>*,*::before,*::after{box-sizing:border-box}</style>
  <link rel="stylesheet" href="gals/gals.css">
</head>
<body>
  <div class="container">
    <div class="container-block pt-12 pt-m6">Full width, then half</div>
  </div>
  <script src="gals/gals.js" defer></script>
</body>
</html>
```

`gals.css` applies `box-sizing: border-box` to `.container` and its descendants, so no global reset is required for the grid. If you want `border-box` everywhere (recommended for app shells), add your own reset before `gals.css`:

```css
*, *::before, *::after { box-sizing: border-box; }
```

Columns must live inside `.container`: the selector is `.container .pt-*`. Use `.container-block` when you want the 5px gutter; a column without it still gets its width, but no padding.

Or via jsDelivr (pinned to tag — immutable cache):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.css">
<script src="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.js" defer></script>
```

## Browser support

GALS uses `:focus-visible`, `aspect-ratio`, flex `gap`, `<dialog>` and the Popover API. Practical minimum: **Chrome/Edge 114+, Firefox 125+, Safari 17+, iOS Safari 17+**. Older browsers get the layout but lose some component behaviour; add your own fallbacks if you need them.

## Development

```bash
npm ci
npm test            # 105 tests, 18 suites
npm run build       # site CSS + CDN min + classes JSON + prerender + static docs + zip
npm run check:demo  # asset existence + class declaration check
npm run check:prerender
```

`npm run build` must produce no diff; CI enforces it.

## Cache headers (GitHub Pages)

GitHub Pages does **not** support custom `Cache-Control` headers — all files are served with `max-age=600` and revalidated via ETag.

For immutable caching use the jsDelivr tag URLs (`@v1.2`). jsDelivr serves those with `Cache-Control: public, max-age=31536000, immutable`.

## HTTPS / mixed content

All external resources (jsDelivr) use HTTPS. All local resources are referenced by relative paths. No mixed content.

## CDN vs self-host

The documentation site loads the minified files from `cdn/` (self-hosted).
The CDN links in documentation snippets and `gals-classes.json` are pinned to the `v1.2` tag — immutable, never change.
The `@main` tag also works and always serves the latest commit, but it can change between deploys.

## AI-ready

GALS ships machine-readable reference files:

- [`llms.txt`](https://ivanivanson.github.io/gals/llms.txt) — the whole framework as plain text
- [`llms-full.txt`](https://ivanivanson.github.io/gals/llms-full.txt) — every documentation page as one text file
- [`llms/gals-classes.json`](https://ivanivanson.github.io/gals/llms/gals-classes.json) — 186 classes + 8 tokens as structured data, including `doesNotExist` and replacement hints
- [`docs/`](https://ivanivanson.github.io/gals/docs/) — static, crawlable documentation pages with per-page metadata
- [`AI_PROMPT_TEMPLATE.md`](https://ivanivanson.github.io/gals/AI_PROMPT_TEMPLATE.md) — the prompt template
- [`AGENTS.md`](AGENTS.md) — rules for coding agents working in this repository

The JSON is generated from `gals.css` itself and the test suite fails if the two drift apart.

## License

[MIT](LICENSE) © 2024-2026 Ivan Ivanson.
