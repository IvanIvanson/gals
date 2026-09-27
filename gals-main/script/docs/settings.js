import { page, codeBlock, demo, cell, table, notice } from './page.js';

/** Настройки сборки: один рантайм-токен и один IIFE-скрипт. */

const cssVariables = page({
  title: 'CSS variables',
  lead:
    'The framework exposes eight custom properties: the one grid constant and seven colour tokens. '
    + 'Everything else is written as a literal value, so there is nothing to configure at build time.',
  blocks: [
    {
      id: 'token',
      label: 'The tokens',
      html: table(
        ['Property', 'Default', 'Used by'],
        [
          [
            '<code>--gridmultiplyConst</code>',
            '<code>8.325%</code>',
            'every <code>.container .pt-*</code> width',
          ],
          [
            '<code>--accent</code>',
            '<code>#8512d1</code>',
            'brand, primary button, focus ring',
          ],
          [
            '<code>--ink</code> / <code>--paper</code>',
            '<code>#222</code> / <code>#fff</code>',
            'text and ground pair',
          ],
          [
            '<code>--ok</code> / <code>--warn</code> / <code>--err</code>',
            'green / amber / red',
            'alerts, validation',
          ],
          ['<code>--line</code>', '<code>#cecece</code>', 'hairlines and borders'],
        ],
      ),
    },
    {
      id: 'override',
      label: 'Overriding them',
      html: `
<p>Custom properties inherit, and the column reads the value from itself — so setting it on a
container retunes only the columns and components inside that container.</p>
${codeBlock(
  `.container-dense { --gridmultiplyConst: 8.3333%; }  /* exact 1/12 */
.container-half  { --gridmultiplyConst: 12.5%; }     /* 8 column grid */

/* recolour the whole page */
:root { --accent: #e3e027; --ink: #000; }`,
)}
${demo(
  `<div class="container" style="--gridmultiplyConst: 12.5%">
    ${cell('pt-4', 'pt-4 = 1/2')}
    ${cell('pt-4', 'pt-4 = 1/2')}
</div>`,
  'The same pt-4 class, a different constant: 12.5% instead of 33.3%.',
)}`,
    },
    {
      id: 'site',
      label: 'Not part of the framework',
      html: `
<p>The documentation site has its own tokens for typography, declared on
<code>main</code> and re-declared in the media queries —<!-- --> <code>--fs-h1</code>,
<code>--lh-body</code>, <code>--fs-btn</code> and friends. They live in <code>style.css</code>, are
not shipped in <code>gals/gals.css</code>, and are safe to ignore when you drop the framework into a
project.</p>
${notice(
  'Why so few variables',
  'A toolkit this small is meant to be read, edited and deleted. Variables that hide a single '
  + 'literal make the stylesheet harder to grep, not easier to theme.',
)}`,
    },
  ],
});

const jsModules = page({
  title: 'JS modules',
  lead:
    'gals.js is one immediately invoked function of under two hundred lines. It has no exports, no '
    + 'dependencies and nothing to import — it finds its own hooks in the DOM.',
  blocks: [
    {
      id: 'contents',
      label: 'What is inside',
      html: table(
        ['Piece', 'Trigger', 'What it does'],
        [
          [
            '<code>initMenu()</code>',
            'click on <code>.icon-menu</code>',
            'toggles <code>.menu-show</code> on <code>.menu</code> and syncs <code>aria-expanded</code>',
          ],
          [
            '<code>fitFluidImages()</code>',
            'ready, then resize',
            'writes the parent box size into <code>img.container-fluid</code>',
          ],
          [
            '<code>initAccordions()</code>',
            'toggle on <code>details</code>',
            'inside <code>.accordion-group</code>, opening one accordion closes the others',
          ],
          [
            '<code>initScrollspy()</code>',
            'scroll',
            'inside <code>[data-scrollspy]</code>, marks the link to the heading in view with <code>aria-current</code>',
          ],
          [
            '<code>debounce()</code>',
            'internal',
            'collapses resize events to one call per 150ms',
          ],
        ],
      ),
    },
    {
      id: 'menu',
      label: 'Menu',
      html: `
<p>Both elements must exist or the feature stays off — the script returns early rather than throwing,
so pages without a mobile menu are unaffected.</p>
${codeBlock(
  `<div class="menu menu-collapse" id="main-menu">…</div>

<button class="icon-menu" type="button" aria-label="Toggle menu"
        aria-controls="main-menu" aria-expanded="false">≡</button>`,
)}`,
    },
    {
      id: 'optin',
      label: 'Accordion groups and scrollspy',
      html: `
<p>Both new features are opt-in: wrap accordions in <code>.accordion-group</code> to make siblings
close on open, and put <code>data-scrollspy</code> on any nav whose links point at headings —
this page’s “On this page” block does exactly that.</p>
${codeBlock(
  `<div class="accordion-group">…</div>

<div class="inthisPage" data-scrollspy>…</div>`,
)}`,
    },
    {
      id: 'fluid',
      label: 'Fluid images',
      html: `
<p>For every <code>img.container-fluid</code>, the script measures the parent block, subtracts its
borders and writes <code>width</code> and <code>height</code> into the inline style. Inline style is
deliberate: attributes would be overridden by the stylesheet and did nothing.</p>
${codeBlock(
  `<figure class="container-block">
  <img class="container-fluid" src="cover.svg" alt="">
</figure>`,
)}`,
    },
    {
      id: 'reusing',
      label: 'Reusing the code',
      html: `
<p>Nothing is exported on purpose — the file is meant to be read and copied. If you need the debounced
resize on your own feature, take the three helpers rather than importing the bundle, and register the
listener with <code>addEventListener</code> so you do not stomp on the framework's own
handler.</p>
${codeBlock(
  `const debounce = (fn, wait) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};

window.addEventListener('resize', debounce(recalculate, 150));`,
)}`,
    },
  ],
});

const componentsSetting = page({
  title: 'Components',
  lead:
    'How components are meant to work in GALS, and what the current build ships. Short answer: '
    + 'grid, helpers, forms and a component set that leans on native browser features.',
  blocks: [
    {
      id: 'approach',
      label: 'The approach',
      html: `
<p>A component in GALS is a class in <code>gals.css</code> that leans on a native browser feature
wherever one exists — <code>details</code>, <code>popover</code>, <code>dialog</code>,
<code>:checked</code> — so there is no JavaScript API, no registration and no instantiation. The
only two behaviours the runtime adds are opt-in: accordion groups and scrollspy.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-4">
    <article class="card">…</article>
  </div>
</div>`,
)}`,
    },
    {
      id: 'shipped',
      label: 'What the current build ships',
      html: table(
        ['Layer', 'Status'],
        [
          ['Grid, columns, breakpoints', '<span class="badge badge-stable">Stable</span>'],
          ['Flex and alignment helpers', '<span class="badge badge-stable">Stable</span>'],
          ['Colour tokens and focus ring', '<span class="badge badge-stable">Stable</span>'],
          ['Forms', '<span class="badge badge-stable">Stable</span>'],
          ['Components (14)', '<span class="badge badge-stable">Stable</span>'],
          ['Accordion groups, scrollspy', '<span class="badge badge-stable">Stable</span>'],
          ['Charts', '<span class="badge badge-planned">Out of scope</span>'],
        ],
      ),
    },
    {
      id: 'rules',
      label: 'Rules the build follows',
      html: `
<p>Every component must work without JavaScript when the browser can express it
(<code>details</code>, <code>popover</code>, <code>:checked</code>, <code>&lt;dialog&gt;</code>),
must not add a build step, and must not rename anything that already exists.</p>`,
    },
  ],
});

export default {
  'css-variables': cssVariables,
  'js-modules': jsModules,
  components: componentsSetting,
};
