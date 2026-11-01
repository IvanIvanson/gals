# GALS — Grid Application Layout Systems

Lightweight flexbox toolkit for rapid prototyping and production.

## Quick start

```html
<link rel="stylesheet" href="cdn/gals.min.css">
<script src="cdn/gals.min.js" defer></script>
```

Or via jsDelivr (pinned to tag — immutable cache):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.css">
<script src="https://cdn.jsdelivr.net/gh/IvanIvanson/gals@v1.2/gals-main/cdn/gals.min.js" defer></script>
```

## Development

```bash
npm install
npm test          # 70 tests, 13 suites
npm run check:demo  # asset existence + class declaration check
npm run build       # CSS + CDN min + classes JSON
npm run build:llms  # regenerate gals-classes.json
```

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
- [`llms/gals-classes.json`](https://ivanivanson.github.io/gals/llms/gals-classes.json) — 186 classes + 8 tokens as structured data
- [`AI_PROMPT_TEMPLATE.md`](https://ivanivanson.github.io/gals/AI_PROMPT_TEMPLATE.md) — the prompt template

The JSON is generated from `gals.css` itself and the test suite fails if the two drift apart.
