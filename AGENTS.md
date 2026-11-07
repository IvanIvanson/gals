# GALS — instructions for coding agents

GALS is a small, dependency-free flexbox toolkit. Read `gals-main/llms.txt` and
`gals-main/llms/gals-classes.json` before generating markup; do not invent classes.

## Non-negotiables

1. Use only GALS classes for layout and shipped components. Custom CSS is allowed for spacing,
   typography and product-specific styles.
2. Grid structure: `.container > .container-block.pt-N`. `pt-N` is a width in twelfths, not
   padding. There is no `.row`, no `.col-*`, and no `mt-*`/`mb-*`/`px-*`/`py-*`.
3. Add a page reset: `*, *::before, *::after { box-sizing: border-box; }`. GALS also scopes
   `border-box` inside `.container`, but the rest of the page needs it.
4. Give flex columns `min-width: 0` when they contain long words, URLs or tables.
5. Responsive overrides: `pt-{bp}N` with `xl` (≥ 1440px), `l` (≥ 1026px), `m` (≥ 771px),
   `s` (≥ 426px), `xs` (≥ 376px), `xxs` (≤ 375px). Hide with `pt-{bp}-d_n`.
6. Do not use inline `onclick`. For modal, call `dialog.showModal()` from a small script; for
   dropdown, use `popovertarget` + `popover` + `.dropdown` and keep the ARIA/keyboard contract.
7. Use semantic HTML: one `h1`, ordered headings, `label` for controls, `alt` for images,
   `aria-current` for the active nav item.

## Components that need JS

- Modal: `<dialog class="modal">` + `showModal()`; close with `<form method="dialog">`.
- Dropdown: `<button popovertarget="id">` + `<div id="id" popover class="dropdown">`; `gals.js`
  positions it, manages `aria-haspopup`/`aria-expanded` and arrow keys.
- Menu: `.menu.menu-collapse` + `.icon-menu` with `aria-controls`/`aria-expanded`.
- Tabs: radios + labels + `.tab-panel` in order; maximum six panels.

## Before opening a PR

Run `npm ci`, `npm test`, `npm run build` and `npm run check:demo` in `gals-main`.
The build must produce no diff; CI enforces it.
