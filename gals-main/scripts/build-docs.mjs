/**
 * Генерирует статические страницы документации для поисковиков и AI.
 *
 * SPA-страницы не имеют собственных URL: всё живёт на /gals/ и зависит от JS.
 * Этот скрипт берёт тот же реестр, что и сайт, и пишет docs/<slug>.html с
 * уникальными title/description/canonical/JSON-LD, а также sitemap.xml,
 * docs/index.html и llms-full.txt. Страницы читаемые без JS; интерактивные
 * демо доступны на основной странице.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));
const SITE = 'https://ivanivanson.github.io/gals';
const DATE = '2026-11-07';
const DOCS = `${ROOT}/docs`;

// Модули документации при импорте обращаются к window.__gals*.
globalThis.window = {};

const { docPages } = await import(pathToFileURL(`${ROOT}/script/docs/index.js`).href);
const { default: downloadPage } = await import(pathToFileURL(`${ROOT}/script/download.js`).href);
const { default: contentsPage } = await import(pathToFileURL(`${ROOT}/script/contents.js`).href);
const { slug } = await import(pathToFileURL(`${ROOT}/script/docs/page.js`).href);

const pages = {
  ...docPages,
  download: downloadPage,
  contents: contentsPage,
};

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);

// Шаблоны страниц содержат отступы; убираем хвостовые пробелы, чтобы
// git diff/am не ругались на сгенерированный HTML.
const writeHtml = (file, html) => {
  writeFileSync(file, `${html.replace(/[ \t]+$/gm, '').trimEnd()}\n`, 'utf8');
};

const collapse = (value) => value.replace(/\s+/g, ' ').trim();

const textOf = (html) => {
  const dom = new JSDOM(`<div>${html}</div>`);
  return collapse(dom.window.document.body.textContent || '');
};

const infoOf = (page, key) => {
  const dom = new JSDOM(`<div>${page.html}</div>`);
  const doc = dom.window.document;
  const h1 = collapse(doc.querySelector('h1')?.textContent || key);
  const firstP = [...doc.querySelectorAll('p')]
    .map((el) => collapse(el.textContent || ''))
    .find((text) => text.length > 20) || '';
  const description = firstP.length > 160
    ? `${firstP.slice(0, 157).replace(/[.,;:!?\s]+$/, '')}…`
    : firstP;

  return { title: h1, description: description || `${h1} — GALS documentation.` };
};

const articleOf = (page) => {
  const dom = new JSDOM(`<div>${page.html}</div>`);
  const root = dom.window.document.querySelector('div');

  root.querySelectorAll('script, .inthisPage').forEach((el) => el.remove());
  root.querySelectorAll('*').forEach((el) => {
    ['onclick', 'oninput', 'onsubmit', 'onchange', 'onkeydown', 'onload'].forEach((attr) => {
      el.removeAttribute(attr);
    });
  });
  root.querySelectorAll('img').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });

  // Статические страницы лежат в /docs/, поэтому корневые относительные
  // пути контента (./image, ./download, ./llms...) нужно поднять на уровень.
  const rebase = (el, attr) => {
    const value = el.getAttribute(attr);
    if (value && value.startsWith('./')) {
      el.setAttribute(attr, `../${value.slice(2)}`);
    }
  };
  root.querySelectorAll('img[src], source[src], video[poster]').forEach((el) => {
    rebase(el, el.hasAttribute('poster') ? 'poster' : 'src');
  });
  root.querySelectorAll('a[href^="./"]').forEach((el) => rebase(el, 'href'));

  return root.innerHTML;
};

const tocOf = (sections = []) => {
  if (!sections.length) return '';

  return `<nav class="docs-toc" aria-label="On this page">
  <p class="docs-toc-title">On this page</p>
  <ul>${sections.map(({ id, label }) => `<li><a href="#${escape(id)}">${escape(label)}</a></li>`).join('')}</ul>
</nav>`;
};

// Группы бокового меню берём из index.html, чтобы названия не разъезжались.
const shell = new JSDOM(readFileSync(`${ROOT}/index.html`, 'utf8')).window.document;
const groups = [...shell.querySelectorAll('.container-left details')]
  .map((details) => {
    const title = collapse(details.querySelector('summary')?.textContent || '');
    const items = [...details.querySelectorAll('.menu-item')]
      .map((item) => {
        const label = collapse(item.textContent || '');
        const action = item.getAttribute('data-action');
        let key = action || slug(label);

        if (action === 'showIntroduction') key = 'introduction';
        if (action === 'showDownload') key = 'download';
        if (action === 'showContents') key = 'contents';

        return { label, key };
      })
      .filter(({ key }) => key === 'introduction' || pages[key]);

    return { title, items };
  })
  .filter(({ items }) => items.length);

const hrefFor = (key, fromDocs = true) =>
  key === 'introduction' ? '../index.html' : `${key}.html`;

const navOf = (activeKey = '') => `
<nav class="docs-nav" aria-label="Documentation">
  <p class="docs-nav-title"><a href="../index.html">GALS</a> / <a href="index.html">Docs</a></p>
  ${groups.map(({ title, items }) => `
  <details class="docs-nav-group" open>
    <summary>${escape(title)}</summary>
    <ul>${items.map(({ label, key }) => `<li><a href="${hrefFor(key)}"${
      key === activeKey ? ' aria-current="page"' : ''
    }>${escape(label)}</a></li>`).join('')}</ul>
  </details>`).join('')}
</nav>`;

const header = (isDocsIndex = false) => `
<header class="header header-sticky docs-header">
  <a class="header-brand" href="../index.html">GALS</a>
  <nav class="header-nav" aria-label="Primary">
    <ul>
      <li><a href="../index.html">Home</a></li>
      <li><a href="index.html"${isDocsIndex ? ' aria-current="page"' : ''}>Docs</a></li>
      <li><a href="../llms.txt">llms.txt</a></li>
    </ul>
  </nav>
  <div class="header-actions">
    <a class="btn" href="../download/grid.zip" download>Download</a>
  </div>
</header>`;

const footer = `
<footer class="docs-footer">
  GALS v1.2 · <a href="../llms.txt">llms.txt</a> ·
  <a href="../llms-full.txt">llms-full.txt</a> ·
  <a href="../AI_PROMPT_TEMPLATE.md">AI prompt</a> ·
  <a href="../LICENSE">MIT</a>
</footer>`;

const documentOf = ({ title, description, canonical, content, activeKey = '', isDocsIndex = false, jsonLd }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#8512d1">
  <title>${escape(title)} — GALS</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${escape(canonical)}">
  <link rel="alternate" type="text/plain" href="../llms.txt" title="GALS for LLMs">
  <link rel="alternate" type="text/plain" href="../llms-full.txt" title="GALS full documentation for LLMs">

  <meta property="og:type" content="${isDocsIndex ? 'website' : 'article'}">
  <meta property="og:site_name" content="GALS">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${escape(canonical)}">
  <meta property="og:title" content="${escape(title)} — GALS">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${SITE}/image/logoGals.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)} — GALS">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${SITE}/image/logoGals.png">

  <link rel="stylesheet" href="../cdn/gals.min.css">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(isDocsIndex)}
<div class="wrapper">
  <div class="content">
    <main id="main" class="docs-main">
      <div class="container">
        <div class="container-block pt-3 pt-s12">${navOf(activeKey)}</div>
        <div class="container-block pt-9 pt-s12 docs-body">${content}</div>
      </div>
    </main>
  </div>
</div>
${footer}
<script src="../cdn/gals.min.js" defer></script>
<script type="module" src="../script/staticDocs.js"></script>
</body>
</html>
`;

const articleJsonLd = (title, description, canonical) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      dateModified: DATE,
      author: { '@type': 'Organization', name: 'GALS' },
      publisher: { '@type': 'Organization', name: 'GALS', url: `${SITE}/` },
      isPartOf: { '@type': 'WebSite', name: 'GALS documentation', url: `${SITE}/` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'GALS', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Docs', item: `${SITE}/docs/` },
        { '@type': 'ListItem', position: 3, name: title, item: canonical },
      ],
    },
  ],
});

mkdirSync(DOCS, { recursive: true });

// Удаляем только сгенерированные страницы, чтобы не оставлять удалённые.
for (const name of readdirSync(DOCS)) {
  if (name.endsWith('.html')) {
    rmSync(`${DOCS}/${name}`);
  }
}

for (const [key, page] of Object.entries(pages)) {
  const { title, description } = infoOf(page, key);
  const canonical = `${SITE}/docs/${key}.html`;
  const content = `
    <nav class="docs-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">GALS</a> / <a href="index.html">Docs</a> / <span>${escape(title)}</span>
    </nav>
    <div class="docs-static-note">
      Static reading version. Interactive demos and search are on the
      <a href="../index.html">main documentation page</a>.
    </div>
    ${tocOf(page.sections)}
    <article class="docs-article container-center">
      ${articleOf(page)}
    </article>`;

  writeHtml(
    `${DOCS}/${key}.html`,
    documentOf({
      title,
      description,
      canonical,
      content,
      activeKey: key,
      jsonLd: articleJsonLd(title, description, canonical),
    }),
  );
}

const indexCanonical = `${SITE}/docs/`;
const indexContent = `
  <nav class="docs-breadcrumb" aria-label="Breadcrumb">
    <a href="../index.html">GALS</a> / <span>Docs</span>
  </nav>
  <article class="docs-article container-center">
    <h1>Documentation index</h1>
    <p>All GALS documentation pages, readable without JavaScript. Each page also exists in the interactive documentation at <a href="../index.html">/gals/</a>.</p>
    ${groups.map(({ title, items }) => `
    <h2>${escape(title)}</h2>
    <ul>${items.map(({ label, key }) => `<li><a href="${hrefFor(key)}">${escape(label)}</a></li>`).join('')}</ul>`).join('')}
  </article>`;

writeHtml(
  `${DOCS}/index.html`,
  documentOf({
    title: 'Documentation index',
    description: 'All GALS documentation pages: grid, breakpoints, components, forms, helpers and AI reference.',
    canonical: indexCanonical,
    content: indexContent,
    isDocsIndex: true,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: 'GALS documentation index',
          url: indexCanonical,
          dateModified: DATE,
          isPartOf: { '@type': 'WebSite', name: 'GALS documentation', url: `${SITE}/` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'GALS', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Docs', item: indexCanonical },
          ],
        },
      ],
    },
  }),
);

// ---------- sitemap ----------
const sitemapUrls = [
  { loc: `${SITE}/`, lastmod: DATE },
  { loc: `${SITE}/docs/`, lastmod: DATE },
  ...Object.keys(pages).map((key) => ({
    loc: `${SITE}/docs/${key}.html`,
    lastmod: DATE,
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(({ loc, lastmod }) => `  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(`${ROOT}/sitemap.xml`, sitemap, 'utf8');

// ---------- llms-full.txt ----------
const full = [
  '# GALS — full documentation',
  '',
  `> Generated from the same page registry as ${SITE}/docs/. Canonical documentation: ${SITE}/`,
  `> Last updated: ${DATE}`,
  '',
  '## Pages',
  '',
  ...Object.keys(pages).sort().map((key) => `- [${infoOf(pages[key], key).title}](${SITE}/docs/${key}.html)`),
  '',
  ...Object.entries(pages).sort(([a], [b]) => a.localeCompare(b)).map(([key, page]) => {
    const { title } = infoOf(page, key);
    return `## ${title}\n\nURL: ${SITE}/docs/${key}.html\n\n${textOf(articleOf(page))}\n`;
  }),
].join('\n');

writeFileSync(`${REPO}/llms-full.txt`, full, 'utf8');
writeFileSync(`${ROOT}/llms-full.txt`, full, 'utf8');

console.log(`docs: ${Object.keys(pages).length + 1} pages, sitemap ${sitemapUrls.length} URLs, llms-full ${full.length} chars`);
