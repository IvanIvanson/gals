import onThisPage from './onThisPage.js';

export const sections = [
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'forms', label: 'Forms' },
  { id: 'components', label: 'Components' },
  { id: 'helpers', label: 'Helpers' },
];

const group = (title, items) => `
    <div class="contents-group">
        <h3>${title}</h3>
        <ul>${items.map((item) => `\n            <li>${item}</li>`).join('')}
        </ul>
    </div>`;

const contentsHTML = `
<div class="content-between align-center">
    <h1>Contents</h1>
</div>

<div><p>Everything the toolkit ships with, grouped the same way as the navigation on the left.</p>
</div>
${onThisPage(sections)}
<div class="quick-start">
    <h2 id="layout">Layout</h2>
    <p>The grid is a twelve column flex container. Each column takes
    <code>calc(var(--gridmultiplyConst) * n)</code>, and every prefix maps to one breakpoint:
    <code>xl</code> 1440px and up, <code>l</code> up to 1439.98px, <code>m</code> 1025px, <code>s</code> 770px,
    <code>xs</code> 425px, <code>xxs</code> 375px.</p>
${group('Breakpoints and grid', [
  'Breakpoints',
  'Containers',
  'Grid',
  'Columns',
  'Gutters',
  'Z-index',
])}
    <h2 id="content">Content</h2>
${group('Headings, tables and media', ['Header', 'Table', 'Images', 'Charts', 'Icons'])}
    <h2 id="forms">Forms</h2>
${group('Controls', ['Form controls', 'Select', 'Checkbox & Radio', 'Range'])}
    <h2 id="components">Components</h2>
${group('Interactive pieces', [
  'Accordion',
  'Alert',
  'Buttons',
  'Card',
  'Carousel',
  'Dropdowns',
  'Modal',
  'Menu',
  'Tabs',
  'Pagination',
  'Popovers',
  'Progress',
  'Scrollspy',
  'Loaders',
])}
    <h2 id="helpers">Helpers</h2>
${group('Utilities', [
  'Colors collection',
  'Classes',
  'Controls Audio',
  'Controls Video',
  'Controls visible',
  'Canvas for your projects',
])}
</div>
`;

export default { sections, html: contentsHTML };
