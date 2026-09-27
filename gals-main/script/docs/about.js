import { page, codeBlock, table, notice } from './page.js';

/** Раздел «About» — про проект, а не про сетку. */

const history = page({
  title: 'History',
  lead:
    'How a course landing page turned into a grid file, and why the framework stayed this small.',
  status: 'partial',
  blocks: [
    {
      id: 'timeline',
      label: 'Timeline',
      html: `
<ul>
  <li>Begins as a single landing page with a hand-written flex row.</li>
  <li>The row becomes <code>.container</code> and twelve <code>pt-*</code> classes.</li>
  <li>Six breakpoints are added by copying the block six times — the reason the prefixes are
      independent rather than mobile-first.</li>
  <li>The mobile menu and fluid images move into <code>gals.js</code>, no dependencies.</li>
  <li>Colour tokens, focus, forms and fourteen components land in one release — every one of them
      leaning on a native browser feature instead of a script.</li>
  <li>The documentation site grows around it, and the status badges stop saying “planned”.</li>
</ul>`,
    },
    {
      id: 'decisions',
      label: 'Decisions that still hold',
      html: `
${table(
  ['Decision', 'Consequence'],
  [
    ['Percent widths from one constant', 'a full row is 99.9%, so rounding never wraps it'],
    ['Gutters as padding, <code>gap: 0</code>', 'requires <code>border-box</code>, see Gutters'],
    ['No build step in the shipped files', 'the framework is readable and editable in place'],
    ['Nothing exported from <code>gals.js</code>', 'the file is meant to be copied, not imported'],
  ],
)}</p>`,
    },
    {
      id: 'compat',
      label: 'Compatibility rules',
      html: `
<p>Class names are public API: renaming one is a breaking change. Markup patterns may gain attributes '
— every hook is additive — but never lose one that already works.</p>
${notice(
  'Versioning',
  'The header lists V1.0 ultra-light, light and optimus. Only <strong>ultra-light</strong> is the '
  + 'file in this repository; the other two are labels for work that has not landed.',
)}</p>`,
    },
  ],
});

const team = page({
  title: 'Team',
  lead: 'The roles a project of this size actually needs, whatever the headcount.',
  status: 'partial',
  blocks: [
    {
      id: 'roles',
      label: 'Roles',
      html: table(
        ['Role', 'Owns'],
        [
          ['Design', 'type scale, spacing rhythm, the contrast of the token palette'],
          ['Front end', 'grid, helpers, forms, components, the runtime'],
          ['QA', 'the six breakpoints and every keyboard path'],
          ['Docs', 'this site, the examples, the migration notes'],
        ],
      ),
    },
    {
      id: 'review',
      label: 'Review checklist',
      html: `
<ul>
  <li>Does it work with JavaScript switched off, where the browser can express it?</li>
  <li>Is every interactive element reachable and operable by keyboard?</li>
  <li>Does it survive <code>prefers-reduced-motion</code>?</li>
  <li>Does the change rename anything that already ships?</li>
  <li>Is the documentation page for it truthful about what exists?</li>
</ul>
${notice(
  'The last rule is the one that breaks sites',
  'A menu item that promises a component nobody wrote teaches users that this documentation cannot be '
  + 'trusted. Every page here carries a status badge for that reason.',
)}</p>`,
    },
  ],
});

const brand = page({
  title: 'Brand',
  lead: 'The name, the mark, and where the colours of this site stop being the framework.',
  status: 'partial',
  blocks: [
    {
      id: 'name',
      label: 'Name',
      html:
        '<p>GALS is set in the display face on the wordmark and spelled uppercase everywhere. The '
        + 'repository, the folder and the download keep the lowercase <code>gals</code> spelling.</p>',
    },
    {
      id: 'colours',
      label: 'Colours',
      html: `
<p>The framework ships seven colour tokens — <code>--accent</code>, <code>--ink</code>,
<code>--paper</code>, <code>--ok</code>, <code>--warn</code>, <code>--err</code> and
<code>--line</code> — and every component reads them. The yellow, black and white below are this
page’s own stylesheet, layered on top of the same tokens rather than replacing them.</p>
${codeBlock(
  `/* gals.css — the framework tokens */
--accent: #8512d1;   /* brand, primary, focus */
--ink:    #222222;   /* text */
--paper:  #ffffff;   /* ground */

/* style.css — documentation site only */
--primary:   #e3e027;
--main:      #000;
--secondary: #fff;
--tertiary:  #827F03;`,
)}`,
    },
    {
      id: 'usage',
      label: 'Using the mark',
      html: `
<ul>
  <li>Clear space equal to the height of the mark on every side.</li>
  <li>The wordmark alone below 24px of height; the mark carries nothing legible at that size.</li>
  <li>Black on light ground, white on dark. No other pairing.</li>
</ul>`,
    },
  ],
});

const translations = page({
  title: 'Translations',
  lead: 'This documentation is written in English. Everything else is a translation of it.',
  status: 'draft',
  blocks: [
    {
      id: 'policy',
      label: 'Policy',
      html: `
<p>A translated page is a copy of the English one with the prose replaced. Class names, code samples '
and token names stay untouched — translating an identifier breaks the page it describes.</p>
${notice(
  'Set the language',
  'Put <code>lang</code> on <code>&lt;html&gt;</code> to the language you ship. Screen readers pick '
  + 'their pronunciation from it, and so does hyphenation.',
)}</p>`,
    },
    {
      id: 'status',
      label: 'Status',
      html: table(
        ['Language', 'State'],
        [
          ['English', 'source of truth'],
          ['Russian', 'not started — the site chrome is already partly Russian'],
          ['other', 'welcome, as a copy of the English page'],
        ],
      ),
    },
  ],
});

export default { history, team, brand, translations };
