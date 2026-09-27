import { page, codeBlock, demo, cell, table, notice } from './page.js';

/**
 * Всё, что здесь описано, взято из gals/gals.css строка в строку:
 * шесть брейкпоинтов, двенадцать колонок и const 8.325%.
 */

const PREFIXES = [
  ['xl', 'min-width: 1440px', 'pt-xl1 … pt-xl12'],
  ['l', 'max-width: 1440px', 'pt-l1 … pt-l12'],
  ['m', 'max-width: 1025px', 'pt-m1 … pt-m12'],
  ['s', 'max-width: 770px', 'pt-s1 … pt-s12'],
  ['xs', 'max-width: 425px', 'pt-xs1 … pt-xs12'],
  ['xxs', 'max-width: 375px', 'pt-xxs1 … pt-xxs12'],
];

const breakpoints = page({
  title: 'Breakpoints',
  lead:
    'Six fixed breakpoints, one prefix each. The prefix sits between pt- and the column number, '
    + 'and it is the only place where GALS talks about screen size.',
  blocks: [
    {
      id: 'prefixes',
      label: 'Prefixes',
      html: table(
        ['Prefix', 'Media query', 'Classes'],
        PREFIXES.map(([prefix, query, classes]) => [
          `<code>${prefix}</code>`,
          `<code>${query}</code>`,
          `<code>${classes}</code>`,
        ]),
      ),
    },
    {
      id: 'stacking',
      label: 'How they stack',
      html: `
<p>Prefixes are independent, not mobile-first. Each one lives inside a single media query, so a
class does nothing outside its own range and never inherits from a smaller one. Declare every
range you care about:</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-6 pt-m12">half on desktop, full below 1025px</div>
</div>`,
)}
${notice(
  'Overlap at exactly 1440px',
  'Both <code>pt-xl*</code> (<code>min-width: 1440px</code>) and <code>pt-l*</code> '
  + '(<code>max-width: 1440px</code>) match a 1440px viewport. The <code>l</code> block is declared '
  + 'later in the file, so on that one pixel <code>l</code> wins.',
)}`,
    },
    {
      id: 'custom',
      label: 'Changing a breakpoint',
      html: `
<p>Breakpoints are written as literal media queries in <code>gals/gals.css</code>, one block per
prefix — there is no variable to override yet. Edit the six <code>@media</code> blocks and rebuild,
or keep the shipped file and write your own range around the same column widths.</p>`,
    },
  ],
});

const containers = page({
  title: 'Containers',
  lead:
    'A container is the flex wrapper that makes column widths meaningful. Everything else in the '
    + 'grid is a child of it.',
  blocks: [
    {
      id: 'container',
      label: '.container',
      html: `
<p>Sets <code>display: flex</code>, <code>flex-wrap: wrap</code>, <code>align-items: stretch</code>,
<code>gap: 0</code> and <code>padding: 5px</code>. Column classes only apply inside it, because they
are declared as <code>.container .pt-3</code>, not <code>.pt-3</code>.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-12">full width</div>
</div>`,
)}
${demo(
  `<div class="container">${cell('pt-12', 'pt-12')}</div>`,
  'One column across the row.',
)}`,
    },
    {
      id: 'fluid',
      label: '.container-fluid',
      html: `
<p>Adds <code>flex-grow: 1</code>, so the element eats whatever space its neighbours leave. It is
how the documentation page keeps its centre column wide while the side columns stay fixed.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-2">rail</div>
  <div class="container-block container-fluid">fills the rest</div>
  <div class="container-block pt-2">rail</div>
</div>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-2"><div class="demo-cell">pt-2</div></div>
    <div class="container-block container-fluid"><div class="demo-cell">container-fluid</div></div>
    <div class="container-block pt-2"><div class="demo-cell">pt-2</div></div>
</div>`,
  'The middle cell has no width class, only flex-grow.',
)}`,
    },
    {
      id: 'nested',
      label: 'Nesting',
      html: `
<p>Containers nest freely — put a <code>.container</code> inside a column to split it again. Keep the
wrapper chain intact: a column whose nearest flex ancestor is missing has no effect, since the width
rules are descendants of <code>.container</code>.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-8">
    <div class="container">
      <div class="container-block pt-6">nested half</div>
      <div class="container-block pt-6">nested half</div>
    </div>
  </div>
  <div class="container-block pt-4">side</div>
</div>`,
)}
${demo(
  `<div class="container">
    <div class="container-block pt-8"><div class="container">
        ${cell('pt-6', 'pt-6')}
        ${cell('pt-6', 'pt-6')}
    </div></div>
    ${cell('pt-4', 'pt-4')}
</div>`,
)}`,
    },
  ],
});

const grid = page({
  title: 'Grid',
  lead:
    'Twelve columns of 8.325% each, built from one custom property and a set of flex helpers. '
    + 'No CSS grid, no subpixel math, no build step.',
  blocks: [
    {
      id: 'model',
      label: 'The model',
      html: `
<p>Every column resolves to <code>calc(var(--gridmultiplyConst) * n)</code>, where the constant is
<code>8.325%</code>. Twelve of them make <code>99.9%</code> — the spare tenth of a percent is what
keeps a full row from wrapping when the browser rounds.</p>
${codeBlock(
  `:root { --gridmultiplyConst: 8.325%; }

.container .pt-4 { width: calc(var(--gridmultiplyConst) * 4); }`,
)}`,
    },
    {
      id: 'rows',
      label: 'Rows',
      html: `
<p>There is no row element. <code>flex-wrap: wrap</code> on the container starts a new line as soon
as the widths exceed the container, so a row is whatever fits before the wrap.</p>
${codeBlock(
  `<div class="container">
  <div class="container-block pt-4">4</div>
  <div class="container-block pt-4">4</div>
  <div class="container-block pt-4">4</div>
  <div class="container-block pt-6">6 — wraps to the next line</div>
  <div class="container-block pt-6">6</div>
</div>`,
)}
${demo(
  `<div class="container">
    ${cell('pt-4', 'pt-4')}
    ${cell('pt-4', 'pt-4')}
    ${cell('pt-4', 'pt-4')}
    ${cell('pt-6', 'pt-6')}
    ${cell('pt-6', 'pt-6')}
</div>`,
)}`,
    },
    {
      id: 'aligning',
      label: 'Aligning a row',
      html: `
<p>Three helpers set <code>justify-content</code> on the container, three more set
<code>align-items</code>. They are plain classes, not breakpoint-scoped.</p>
${codeBlock(
  `<div class="container space-center">
  <div class="container-block pt-3">3</div>
  <div class="container-block pt-3">3</div>
</div>`,
)}
${demo(
  `<div class="container space-center">
    ${cell('pt-3', 'pt-3')}
    ${cell('pt-3', 'pt-3')}
</div>`,
  'space-center — space-between and space-around are the other two.',
)}`,
    },
  ],
});

const columns = page({
  title: 'Columns',
  lead:
    'pt-1 through pt-12, repeated for every breakpoint prefix. A column is just a width — nothing '
    + 'else is set on it.',
  blocks: [
    {
      id: 'classes',
      label: 'Class list',
      html: `
<p>Unprefixed classes always apply. Prefixed ones apply only inside their own media query, and they
override the unprefixed width because the selector is equally specific but declared later.</p>
${codeBlock(
  `<div class="container-block pt-8 pt-m6 pt-xs12">wide, medium, stacked</div>`,
)}
${demo(
  `<div class="container">${cell('pt-8 pt-m6 pt-xs12', 'pt-8 pt-m6 pt-xs12')}</div>`,
  'Resize the window to watch the three widths trade places.',
)}`,
    },
    {
      id: 'scope',
      label: 'Scope',
      html: `
<p>The rules are <code>.container .pt-3</code>. A <code>pt-3</code> element outside a container, or
the container itself, gets no width at all — that is the single most common reason a row refuses to
line up.</p>
${notice(
  'Width only',
  'Columns carry no padding of their own. The gutter comes from <code>.container-block</code> or '
  + 'from your own class, see <a href="#gutters">Gutters</a>.',
)}`,
    },
    {
      id: 'self',
      label: 'Per-column alignment',
      html: `
<p><code>alignSelf-center</code>, <code>alignSelf-start</code>, <code>alignSelf-baseline</code> and
<code>alignSelf-end</code> override the stretched height for one column.</p>
${codeBlock(
  `<div class="container align-center">
  <div class="container-block pt-4">stretched</div>
  <div class="container-block pt-4 alignSelf-end">pinned to the end</div>
</div>`,
)}
${demo(
  `<div class="container align-center" style="min-height: 90px">
    <div class="container-block pt-4"><div class="demo-cell">pt-4</div></div>
    <div class="container-block pt-4 alignSelf-end"><div class="demo-cell">alignSelf-end</div></div>
</div>`,
)}`,
    },
  ],
});

const gutters = page({
  title: 'Gutters',
  lead:
    'Gutters are padding, not gap. The grid ships with 5px on the container and 5px on each block, '
    + 'which is why the whole thing depends on border-box.',
  blocks: [
    {
      id: 'source',
      label: 'Where the space comes from',
      html: `
${table(
  ['Selector', 'Rule', 'Effect'],
  [
    ['<code>.container</code>', '<code>padding: 5px</code>', 'Outer inset of the row'],
    ['<code>.container</code>', '<code>gap: 0</code>', 'Flex gap stays off on purpose'],
    [
      '<code>.container .container-block</code>',
      '<code>padding: 5px</code>',
      'Space between neighbouring columns',
    ],
  ],
)}
<p>Because <code>gap</code> is zero, two neighbouring blocks produce <code>5px + 5px</code> between
their contents.</p>`,
    },
    {
      id: 'borderbox',
      label: 'border-box is required',
      html: `
<p>Column widths are percentages. If the box model is <code>content-box</code>, the 5px of padding is
added on top of the percentage, the row exceeds 100% and wraps early. GALS does not set
<code>box-sizing</code> for you, so reset it in your project:</p>
${codeBlock(
  `*,
*::before,
*::after { box-sizing: border-box; }`,
)}
${notice(
  'Load order',
  'The reset must come after <code>gals.css</code> only if you want to override its values. For '
  + '<code>box-sizing</code> the order does not matter, since gals.css never touches it.',
)}`,
    },
    {
      id: 'override',
      label: 'Widening the gutter',
      html: `
${codeBlock(
  `.container-wide,
.container-wide .container-block { padding: 12px; }`,
)}
${demo(
  `<div class="container" style="padding: 12px">
    <div class="container-block pt-6" style="padding: 12px">${cell('pt-12', 'pt-12')}</div>
    <div class="container-block pt-6" style="padding: 12px">${cell('pt-12', 'pt-12')}</div>
</div>`,
  'Inline styles here stand in for the override class.',
)}`,
    },
  ],
});

const zIndex = page({
  title: 'Z-index',
  lead:
    'GALS 1.0 ships no stacking utilities. Stacking order is left to the page, and the only rule the '
    + 'framework sets is a negative one on the documentation layout itself.',
  status: 'planned',
  blocks: [
    {
      id: 'status',
      label: 'Status',
      html:
        '<p>There is no <code>.z-1</code> family and no stacking scale. The stylesheet has a single '
        + 'stacking declaration, <code>.copy-block</code> and its children, which are positioned '
        + 'locally and do not leak into your page.</p>',
    },
    {
      id: 'today',
      label: 'What to do today',
      html: `
<p>Set <code>position</code> and <code>z-index</code> in your own layer. Keep the numbers small and
scoped: a component that owns its stacking context cannot fight a neighbour that does the same.</p>
${codeBlock(
  `.site-header { position: sticky; top: 0; z-index: 10; }
.modal     { position: fixed; inset: 0; z-index: 20; }`,
)}`,
    },
    {
      id: 'proposal',
      label: 'Proposed API',
      html: `
<p>A flat scale that mirrors the column syntax, so nothing has to be remembered separately:</p>
${codeBlock(
  `<div class="z-10">header</div>
<div class="z-20">dropdown</div>
<div class="z-30">modal</div>`,
)}
<p>Each step would be a <code>position: relative</code> plus a fixed <code>z-index</code>, with no
variables involved.</p>`,
    },
  ],
});

export default {
  breakpoints,
  containers,
  grid,
  columns,
  gutters,
  'z-index': zIndex,
};
