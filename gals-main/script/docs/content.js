import { page, codeBlock, demo, cell, table, notice, planned } from './page.js';

/** Content: Header, Table и Icons описывают реальные классы, Charts — честная граница объёма. */

const header = page({
  title: 'Header',
  lead:
    'A page bar: brand, navigation and actions in one flex row that wraps on small screens instead of overflowing.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.header</code> is a flex row with a wrap and a gap. <code>.header-sticky</code> pins it to the
top of the viewport, and the three slots are optional: <code>.header-brand</code>,
<code>.header-nav</code> and <code>.header-actions</code>, which pushes to the right edge with
<code>margin-left: auto</code>.</p>
${codeBlock(
  `<header class="header header-sticky">
  <a class="header-brand" href="/">GALS</a>
  <nav class="header-nav" aria-label="Main">
    <ul>
      <li><a href="/docs" aria-current="page">Docs</a></li>
      <li><a href="/support">Support</a></li>
    </ul>
  </nav>
  <div class="header-actions">
    <a class="btn" href="/download">Download</a>
  </div>
</header>`,
)}
${demo(
  `<header class="header" style="border-bottom:1px solid #cecece">
    <a class="header-brand" href="#usage">GALS</a>
    <nav class="header-nav" aria-label="Demo">
      <ul>
        <li><a href="#usage" aria-current="page">Docs</a></li>
        <li><a href="#usage">Support</a></li>
      </ul>
    </nav>
    <div class="header-actions"><a class="btn" href="#usage">Download</a></div>
  </header>`,
  'Narrow the window: the row wraps instead of overflowing.',
)}`,
    },
    {
      id: 'a11y',
      label: 'Accessibility',
      html: `
<p>Mark the current page with <code>aria-current="page"</code> — the framework turns it into the
bold link, so the state is not colour-only. Two headers on one page need distinct
<code>aria-label</code>s on their <code>&lt;nav&gt;</code>, or the landmark list is useless.</p>
${notice(
  'Sticky is opt-in',
  'The bar at the top of this documentation page is the site’s own stylesheet, not the framework. '
  + '<code>.header-sticky</code> exists so your header does not have to repeat it.',
)}`,
    },
  ],
});

const tablePage = page({
  title: 'Table',
  lead:
    'Table styles that ship with the framework: borders, stripes, and a scroll wrapper for tables wider than their column.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.table</code> sets the box: full width, collapsed borders, readable cell padding. Add
<code>.table-striped</code>, <code>.table-bordered</code> or both; they are independent modifiers.</p>
${codeBlock(
  `<table class="table table-striped table-bordered">
  <thead><tr><th>Prefix</th><th>Media query</th></tr></thead>
  <tbody>
    <tr><td>pt-xl*</td><td>min-width: 1440px</td></tr>
    <tr><td>pt-l*</td><td>max-width: 1439.98px</td></tr>
  </tbody>
</table>`,
)}
${demo(
  `<div class="table-responsive">
    <table class="table table-striped table-bordered">
      <thead><tr><th>Prefix</th><th>Media query</th><th>Class</th></tr></thead>
      <tbody>
        <tr><td><code>pt-xl*</code></td><td><code>min-width: 1440px</code></td><td>extra large</td></tr>
        <tr><td><code>pt-l*</code></td><td><code>max-width: 1439.98px</code></td><td>large</td></tr>
        <tr><td><code>pt-m*</code></td><td><code>max-width: 1025px</code></td><td>medium</td></tr>
        <tr><td><code>pt-s*</code></td><td><code>max-width: 770px</code></td><td>small</td></tr>
      </tbody>
    </table>
  </div>`,
)}`,
    },
    {
      id: 'wide',
      label: 'Wide tables',
      html: `
<p>A table that does not fit its column should scroll, not stretch the grid. Wrap it in
<code>.table-responsive</code> — the wrapper scrolls, the grid does not move.</p>
${codeBlock(
  `<div class="container-block pt-6">
  <div class="table-responsive">
    <table class="table">…wide table…</table>
  </div>
</div>`,
)}`,
    },
  ],
});

const images = page({
  title: 'Images',
  lead:
    'One real behaviour: an image marked container-fluid is measured against its parent by gals.js '
    + 'and resized in pixels, on load and on every settled resize.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p>The script looks for <code>img.container-fluid</code>, reads the parent block and writes the
result into the inline style. The parent needs a size of its own — a column class is enough.</p>
${codeBlock(
  `<div class="container">
  <figure class="container-block pt-6">
    <img class="container-fluid" src="cover.svg" alt="Cover art">
  </figure>
</div>`,
)}`,
    },
    {
      id: 'measure',
      label: 'What is measured',
      html: `
<p>Parent <code>offsetWidth</code> and <code>offsetHeight</code>, minus twice the parent's
<code>clientLeft</code> to drop its borders. The result lands in <code>style.width</code> and
<code>style.height</code>, because inline styles beat the <code>width</code> and <code>height</code>
attributes — writing attributes left the image untouched.</p>
${table(
  ['Runs on', 'When'],
  [
    ['<code>DOMContentLoaded</code>', 'first paint, or immediately if the DOM is already parsed'],
    ['<code>resize</code>', '150ms after the last resize event'],
  ],
)}`,
    },
    {
      id: 'caveats',
      label: 'Caveats',
      html: `
<p>A parent with zero width is skipped rather than collapsing the image to nothing, so an image inside
a hidden tab keeps its natural size until it becomes visible. Nothing re-runs when the content
changes without a resize — call your own measure after injecting markup.</p>
${demo(
  `<div class="container">
    <div class="container-block pt-6">
      <div class="demo-cell">
        <img class="container-fluid" alt="GALS grid sample" src="../image/gridlsicon.png">
      </div>
    </div>
    ${cell('pt-6', 'pt-6')}
</div>`,
  'The image above is fitted to its column by the shipped script.',
)}`,
    },
  ],
});

const charts = planned({
  title: 'Charts',
  lead:
    'Charting is out of scope for a grid toolkit, and GALS does not pretend otherwise. What it can do '
    + 'is give charts a stable box to live in.',
  missing:
    'No chart primitives, no canvas helpers, no colour scales. The demo in <code>demo/</code> draws an '
    + 'SVG by hand and is not part of the framework.',
  workaround: `
<p>Give the chart a column, let the library read the container, and let the grid handle the rest:</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-8">
    <svg viewBox="0 0 380 120" preserveAspectRatio="none">…</svg>
  </div>
  <div class="container-block pt-4">legend</div>
</div>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-8"><div class="demo-cell">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:60px">
        <polyline points="0,38 20,20 40,26 60,8 80,16 100,2" fill="none" stroke="rgb(133,18,209)" stroke-width="2"/>
      </svg>
    </div></div>
    ${cell('pt-4', 'legend')}
</div>`,
)}`,
  proposal:
    '<p>Nothing is proposed. A chart layer would mean a JavaScript API, and the framework has exactly '
    + 'one job: laying boxes out.</p>',
});

const icons = page({
  title: 'Icons',
  lead:
    'Size classes for inline SVG. The icon inherits colour from the text around it — '
    + 'fill: currentColor is the whole trick, and there is no icon font to load.',
  blocks: [
    {
      id: 'usage',
      label: 'Usage',
      html: `
<p><code>.icon</code> sets <code>fill: currentColor</code>; <code>.icon-16</code>,
<code>.icon-24</code> and <code>.icon-32</code> set the box. The SVG stays inline in the markup or
points at a sprite with <code>&lt;use&gt;</code> — both work the same.</p>
${codeBlock(
  `<svg class="icon icon-16" aria-hidden="true" focusable="false">
  <use href="/icons.svg#clipboard"></use>
</svg>

<button class="btn" type="button">
  <svg class="icon icon-16" aria-hidden="true" focusable="false">…</svg> Copy
</button>`,
)}
${demo(
  `<p>
    16px
    <svg class="icon icon-16" aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" fill="currentColor"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" fill="currentColor"/></svg>
    &nbsp;24px
    <svg class="icon icon-24" aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" fill="currentColor"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" fill="currentColor"/></svg>
    &nbsp;32px
    <svg class="icon icon-32" aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" fill="currentColor"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" fill="currentColor"/></svg>
  </p>
  <p style="color:#8512d1">The same three on a coloured line — no colour is set anywhere:
    <svg class="icon icon-16" aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M8 0l2 5h5l-4 3.5L12 14 8 11l-4 3 1-5.5L1 5h5z" fill="currentColor"/></svg>
    the icon follows the text.
  </p>`,
  'currentColor: the star took no colour of its own.',
)}`,
    },
    {
      id: 'a11y',
      label: 'Decorative icons',
      html: `
${notice(
  'Decorative icons',
  'Keep <code>aria-hidden="true"</code> and <code>focusable="false"</code> on the SVG, and put the '
  + 'accessible name on the button around it. An icon that carries meaning needs a text equivalent '
  + 'next to it, not inside the <code>alt</code> of nothing.',
)}`,
    },
  ],
});

export default {
  header,
  table: tablePage,
  images,
  charts,
  icons,
};
