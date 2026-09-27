import { page, codeBlock, demo, table } from './page.js';

/**
 * Раздел «Components»: каждый компонент — реальные классы из gals.css
 * (и, для аккордеона и scrollspy, поведение из gals.js).
 */

const DEF = [
  {
    slug: 'accordion',
    title: 'Accordion',
    lead:
      'Stacked sections that expand in place. Built on details/summary: open state, keyboard and screen reader support come from the browser.',
    markup: `<div class="accordion-group">
  <details class="accordion">
    <summary>What is the default gutter?</summary>
    <div class="accordion-body">5px on the container, 5px on each block.</div>
  </details>
  <details class="accordion">
    <summary>Can I change it?</summary>
    <div class="accordion-body">Yes — padding on .container and .container-block is yours.</div>
  </details>
</div>`,
    demo: `<div class="accordion-group">
  <details class="accordion">
    <summary>What is the default gutter?</summary>
    <div class="accordion-body">5px on the container, 5px on each block.</div>
  </details>
  <details class="accordion">
    <summary>Can I change it?</summary>
    <div class="accordion-body">Yes — the padding on <code>.container</code> and <code>.container-block</code> is yours to override.</div>
  </details>
  <details class="accordion">
    <summary>Why details and not divs?</summary>
    <div class="accordion-body">Open state, keyboard support and the screen reader announcement are free. Rebuilding them is the classic source of bugs.</div>
  </details>
</div>`,
    caption: 'Inside .accordion-group, opening one closes the others (gals.js, one delegated listener).',
    notes: [
      'Content inside a closed <code>&lt;details&gt;</code> is not searchable in the browser find bar — never hide a fact there.',
      'Without <code>.accordion-group</code> every section opens independently — the wrapper is opt-in.',
    ],
  },
  {
    slug: 'alert',
    title: 'Alert',
    lead: 'A message in the flow of the page, in four semantic colours from the tokens.',
    markup: `<p class="alert alert-ok" role="status">Saved.</p>
<p class="alert alert-warn" role="status">The draft is unsaved.</p>
<p class="alert alert-error" role="alert">
  Could not save — check your connection and retry.
</p>`,
    demo: `<p class="alert alert-info">Heads up: this is <code>alert-info</code>, the accent colour.</p>
<p class="alert alert-ok" role="status">Saved.</p>
<p class="alert alert-warn" role="status">The draft is unsaved.</p>
<p class="alert alert-error" role="alert">Could not save — check your connection and retry.</p>`,
    notes: [
      '<code>role="alert"</code> interrupts the screen reader. Four of those on one page is noise, and the one that matters gets lost.',
      'Ordinary, user-initiated feedback takes <code>role="status"</code>, which waits for a pause.',
      'The colour comes from the <code>--ok</code>, <code>--warn</code>, <code>--err</code> and <code>--accent</code> tokens.',
    ],
  },
  {
    slug: 'buttons',
    title: 'Buttons',
    lead: 'Two weights and one rule about which element to use.',
    markup: `<button class="btn" type="button">Cancel</button>
<button class="btn btn-primary" type="button">Save draft</button>
<a class="btn" href="/docs">Read the docs</a>
<button class="btn" type="button" disabled>Unavailable</button>`,
    demo: `<button class="btn" type="button">Cancel</button>
&nbsp;<button class="btn btn-primary" type="button">Save draft</button>
&nbsp;<a class="btn" href="#usage">Read the docs</a>
&nbsp;<button class="btn" type="button" disabled>Unavailable</button>`,
    notes: [
      'Label the action, never the mechanic: “Save draft”, not “Click here”.',
      'Keep 44px of hit height on touch — widen with padding, not by scaling the label.',
      'A disabled button must be genuinely unreachable, not greyed out and silent.',
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    lead: 'Media, body and actions for one item of content, in a box that stretches with its column.',
    markup: `<div class="container">
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Title</h3>
      <p class="card-body">Supporting copy.</p>
      <div class="card-footer"><a class="btn" href="#">Open</a></div>
    </article>
  </div>
</div>`,
    demo: `<div class="container">
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Grid</h3>
      <p class="card-body">Twelve columns, six breakpoints, one constant.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Runtime</h3>
      <p class="card-body">One file, no exports, no dependencies.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Docs</h3>
      <p class="card-body">Every page carries a status badge, and the badge is honest.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
</div>`,
    caption: '.card-footer sits at the bottom of every card, whatever the body length.',
    notes: [
      'Do not wrap the whole card in a link if it contains links — nested targets are ambiguous to a keyboard.',
      'The title is a heading in document order whatever the design says about its size.',
      'Equal heights are the grid, not the card: the container stretches its blocks.',
    ],
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    lead: 'A slide ring with native touch physics and no JavaScript: scroll snap does the whole job.',
    markup: `<div class="carousel">
  <div class="carousel-slide"><img src="1.svg" alt=""></div>
  <div class="carousel-slide"><img src="2.svg" alt=""></div>
  <div class="carousel-slide"><img src="3.svg" alt=""></div>
</div>`,
    demo: `<div class="carousel">
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 1</div></div>
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 2</div></div>
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 3</div></div>
</div>`,
    caption: 'Drag, swipe or scroll — the track snaps each slide to the centre.',
    notes: [
      'If the content matters it does not belong here — slide two and beyond are almost never seen.',
      'Slides are 80% of the track; override flex-basis for wider or full-bleed slides.',
      'Autoplay, if you must add it yourself, must pause on hover, on focus and under prefers-reduced-motion.',
    ],
  },
  {
    slug: 'dropdowns',
    title: 'Dropdowns',
    lead: 'A command menu on a button. Not a form control — that job is a select.',
    markup: `<button popovertarget="dd">Options</button>
<div id="dd" popover class="dropdown">
  <button type="button">Rename</button>
  <button type="button">Duplicate</button>
  <button type="button">Delete</button>
</div>`,
    demo: `<button class="btn" popovertarget="demo-dd">Options</button>
<div id="demo-dd" popover class="dropdown">
  <button type="button">Rename</button>
  <button type="button">Duplicate</button>
  <button type="button">Delete</button>
</div>`,
    caption: 'The Popover API: top layer, light dismiss and Escape, with zero script.',
    notes: [
      'The trigger keeps <code>aria-haspopup="menu"</code> and a live <code>aria-expanded</code>.',
      'Arrow keys move through items; <kbd>Tab</kbd> leaves the menu.',
      'Closing returns focus to the trigger — the browser does this for popover, hand-rolled menus usually do not.',
    ],
  },
  {
    slug: 'modal',
    title: 'Modal',
    lead: 'A dialog that takes focus, holds it, and gives it back.',
    markup: `<button onclick="demoModal.showModal()">Open</button>
<dialog id="demoModal" class="modal">
  <form method="dialog">
    <h2>Delete the draft?</h2>
    <p>This cannot be undone.</p>
    <div class="card-footer">
      <button value="cancel">Cancel</button>
      <button value="confirm" class="btn btn-primary">Delete</button>
    </div>
  </form>
</dialog>`,
    demo: `<button class="btn" onclick="demoModalLive.showModal()">Delete a draft</button>
<dialog id="demoModalLive" class="modal">
  <form method="dialog">
    <h2 style="margin:0">Delete the draft?</h2>
    <p style="margin:0">This cannot be undone.</p>
    <div class="card-footer">
      <button class="btn" value="cancel">Cancel</button>
      <button class="btn btn-primary" value="confirm">Delete</button>
    </div>
  </form>
</dialog>`,
    caption: 'showModal() gives the trap, the inert page, Escape and ::backdrop for free.',
    notes: [
      'A modal inside an ancestor with a <code>transform</code> is trapped in that stacking context — dialog’s top layer avoids this.',
      'Lock scroll with <code>scrollbar-gutter: stable</code> so the page does not jump sideways.',
      'Two stacked modals usually mean the flow wants to be a page, not a dialog.',
    ],
  },
  {
    slug: 'menu',
    title: 'Menu',
    lead: 'Site navigation: a list of links in a nav, plus the mobile panel the bundled script toggles.',
    markup: `<nav class="menu menu-collapse" id="main-menu" aria-label="Main">
  <ul>
    <li><a href="/docs" aria-current="page">Docs</a></li>
    <li><a href="/support">Support</a></li>
  </ul>
</nav>
<button class="icon-menu" type="button" aria-label="Toggle menu"
        aria-controls="main-menu" aria-expanded="false">&#8801;</button>`,
    demo: `<nav class="menu" aria-label="Demo">
  <ul>
    <li><a href="#usage" aria-current="page">Docs</a></li>
    <li><a href="#usage">Support</a></li>
    <li><a href="#usage">About</a></li>
  </ul>
</nav>`,
    caption: 'aria-current="page" becomes the bold link; the mobile toggle is gals.js.',
    notes: [
      'Mark the current page with <code>aria-current="page"</code>, not only with a colour.',
      'The header of this very site is the framework menu plus the site’s own paint.',
      'Two navs on one page need distinct <code>aria-label</code>s or the landmark list is useless.',
    ],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    lead: 'Switching views of one subject without leaving the page — radios and :checked, no JavaScript.',
    markup: `<div class="tabs">
  <input type="radio" name="t" id="t1" checked>
  <label for="t1">Design</label>
  <input type="radio" name="t" id="t2">
  <label for="t2">Markup</label>

  <div class="tab-panel">Panel 1</div>
  <div class="tab-panel">Panel 2</div>
</div>`,
    demo: `<div class="tabs">
  <input type="radio" name="demo-tabs" id="demo-t1" checked>
  <label for="demo-t1">Design</label>
  <input type="radio" name="demo-tabs" id="demo-t2">
  <label for="demo-t2">Markup</label>
  <input type="radio" name="demo-tabs" id="demo-t3">
  <label for="demo-t3">Notes</label>

  <div class="tab-panel">The labels form the tab bar; the radios are visually hidden but stay keyboard-reachable.</div>
  <div class="tab-panel">Panel <em>N</em> is shown by radio <em>N</em>: <code>input:nth-of-type(N):checked ~ .tab-panel:nth-of-type(N)</code>.</div>
  <div class="tab-panel">Arrow keys switch tabs, because they switch radios. Up to six panels per group.</div>
</div>`,
    caption: 'Arrow keys move between tabs — they move the radio. Tab moves into the panel.',
    notes: [
      'The order matters: each input must sit right before its label, panels after all pairs.',
      'Printable and script-free; the cost is radio semantics instead of full tab semantics.',
      'If each tab could be its own URL, it is navigation and belongs in a menu.',
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    lead: 'Numbered links for a list that spans requests.',
    markup: `<nav class="pagination" aria-label="Results">
  <a href="?p=4" aria-label="Previous">&#8249;</a>
  <a href="?p=4">4</a>
  <span aria-current="page">5</span>
  <a href="?p=6">6</a>
  <span aria-hidden="true">&#8230;</span>
  <a href="?p=20">20</a>
</nav>`,
    demo: `<nav class="pagination" aria-label="Demo results">
  <a href="#usage" aria-label="Previous">&#8249;</a>
  <a href="#usage">4</a>
  <span aria-current="page">5</span>
  <a href="#usage">6</a>
  <a href="#usage">7</a>
  <span aria-hidden="true">&#8230;</span>
  <a href="#usage">20</a>
</nav>`,
    notes: [
      'Ellipses are <code>aria-hidden</code>; the current page carries <code>aria-current="page"</code>.',
      'Infinite scroll destroys the footer and the sense of position. Use it where scrolling is the activity, not where results are.',
    ],
  },
  {
    slug: 'popovers',
    title: 'Popovers',
    lead: 'A short label on hover or focus — never the only home of a fact.',
    markup: `<span class="popover" tabindex="0"
      data-popover="Extra context, also shown on focus">Hover me</span>`,
    demo: `<p>
  <span class="popover" tabindex="0" data-popover="Extra context, also shown on focus">Hover me</span>
  &mdash; or tab to me: the tip opens on focus too.
</p>`,
    notes: [
      'The text comes from <code>attr(data-popover)</code> — no element, no script.',
      '<code>tabindex="0"</code> is what makes the tip reachable by keyboard; do not drop it.',
      'Anything interactive inside is a dropdown, not a popover.',
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    lead: 'Determinate and indeterminate feedback, with a text equivalent.',
    markup: `<progress value="65" max="100">65%</progress>

<div class="progress" role="progressbar"
     aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"
     aria-label="Upload">
  <div class="progress-bar" style="width: 65%"></div>
</div>`,
    demo: `<p>Native, coloured by accent-color:</p>
<progress value="65" max="100">65%</progress>
<p style="margin-top:1em">Div-based, for when the bar is not the whole story:</p>
<div class="progress" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload">
  <div class="progress-bar" style="width: 65%"></div>
</div>`,
    notes: [
      'The native element already announces itself; the div needs the ARIA roles you see above.',
      'Animate width with a transform where you can, so the main thread stays free.',
      'Show a loader after roughly 150ms; a flash of spinner is worse than none.',
    ],
  },
  {
    slug: 'scrollspy',
    title: 'Scrollspy',
    lead: 'Highlights the section you are reading inside a table of contents. Ships in gals.js behind one attribute.',
    markup: `<div class="inthisPage" data-scrollspy>
  <ul>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#notes">Notes</a></li>
  </ul>
</div>

<!-- gals.js does the rest: observes h1-h4[id], marks the
     link in view with aria-current="true" -->`,
    demo: `<div class="container">
  <div class="container-block pt-3 pt-xs12">
    <div class="inthisPage" data-scrollspy style="display:block">
      <h4>On this demo</h4>
      <ul>
        <li><a href="#spy-one">First</a></li>
        <li><a href="#spy-two">Second</a></li>
        <li><a href="#spy-three">Third</a></li>
      </ul>
    </div>
  </div>
  <div class="container-block pt-9 pt-xs12">
    <div style="max-height:160px;overflow:auto;border:1px solid #cecece;border-radius:7px;padding:0 1em">
      <h4 id="spy-one">First</h4>
      <p>Scroll this box. The heading in the middle band of the viewport lights its link.</p>
      <h4 id="spy-two">Second</h4>
      <p>The observer watches a band across the middle of the window, not the whole viewport, so the highlight does not flicker between neighbouring sections.</p>
      <h4 id="spy-three">Third</h4>
      <p>The active link carries <code>aria-current="true"</code>, so the state is not colour-only. This page’s own “On this page” block runs the same code.</p>
    </div>
  </div>
</div>`,
    caption: 'Scroll the box on the right: the link on the left follows the heading in view.',
    notes: [
      'Observe headings, not sections — section boxes overlap and the highlight flickers.',
      'Set <code>scroll-padding-top</code> to the sticky header height, or anchors land underneath it.',
      'The band is <code>rootMargin: -40% 0px -55% 0px</code>; tune it to your page rhythm.',
    ],
  },
  {
    slug: 'loaders',
    title: 'Loaders',
    lead: 'Feedback for work in progress: spinner, skeleton, and the words that go with them.',
    markup: `<button class="btn" type="button" aria-busy="true" disabled>
  <span class="loader" aria-hidden="true"></span> Saving…
</button>

<div class="skeleton" style="height: 1.2em"></div>
<div class="skeleton" style="height: 6em"></div>`,
    demo: `<button class="btn" type="button" aria-busy="true" disabled>
  <span class="loader" aria-hidden="true"></span> Saving…
</button>
<div style="margin-top:1em;max-width:32em">
  <div class="skeleton" style="height: 1.2em; margin-bottom:.6em"></div>
  <div class="skeleton" style="height: 1.2em; margin-bottom:.6em; width: 80%"></div>
  <div class="skeleton" style="height: 6em"></div>
</div>`,
    notes: [
      'A skeleton holds the shape of what is coming, so nothing jumps when it lands — prefer it whenever the layout is predictable.',
      'Announce completion, not just the wait: <code>role="status"</code> with the final count.',
      'The spinner keeps spinning under <code>prefers-reduced-motion</code> — it is information; the skeleton shimmer stops.',
    ],
  },
];

const makePage = (d, extraBlocks = []) =>
  page({
    title: d.title,
    lead: d.lead,
    blocks: [
      { id: 'usage', label: 'Usage', html: codeBlock(d.markup) },
      { id: 'demo', label: 'Live demo', html: demo(d.demo, d.caption || '') },
      {
        id: 'notes',
        label: 'Notes',
        html: d.notes.map((n) => `<p>${n}</p>`).join('\n'),
      },
      ...extraBlocks,
    ],
  });

const pages = Object.fromEntries(DEF.map((d) => [d.slug, makePage(d)]));

/** Один общий раздел внизу страницы кнопок, чтобы список был обозрим. */
pages.buttons = makePage(
  DEF.find((d) => d.slug === 'buttons'),
  [
    {
      id: 'native',
      label: 'Native escape hatches',
      html: table(
        ['Component', 'Native escape hatch'],
        [
          ['Accordion', '<code>&lt;details&gt;</code>'],
          ['Dropdown', '<code>popover</code> attribute'],
          ['Modal', '<code>&lt;dialog&gt;</code>'],
          ['Progress', '<code>&lt;progress&gt;</code>'],
          ['Tabs', 'radios + <code>:checked</code>'],
        ],
      ),
    },
  ]
);

export default pages;
