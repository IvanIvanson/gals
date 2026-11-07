/**
 * Проверка демо-страницы: каждый локальный ресурс из index.html должен
 * существовать на диске и отдаваться на GitHub Pages с кодом 200.
 *
 * Запуск:  node scripts/check-demo.mjs [--live]
 * Флаг --live дополнительно обивает GitHub Pages и jsDelivr.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PAGES = 'https://ivanivanson.github.io/gals';
const LIVE = process.argv.includes('--live');

/**
 * Собирает все URL ресурсов из разметки, разделяя локальные файлы и внешние
 * адреса: canonical и rel="alternate" указывают на публичный домен, их нельзя
 * искать на диске — их проверяет --live.
 */
const assetUrls = (html) => {
  const dom = new JSDOM(html);
  const local = new Set();
  const remote = new Set();

  for (const el of dom.window.document.querySelectorAll('link[href], script[src], img[src]')) {
    const url = el.getAttribute('href') || el.getAttribute('src');
    if (!url || url.startsWith('#') || url.startsWith('data:')) continue;

    (/^https?:\/\//.test(url) ? remote : local).add(url);
  }

  return { local, remote };
};

const problems = [];
const report = (ok, label, detail = '') => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) problems.push(label);
};

// ---------- 1. Локальные файлы ----------
console.log('\nЛокальные ресурсы index.html:');

const indexHtml = readFileSync(`${ROOT}/index.html`, 'utf8');

const { local, remote } = assetUrls(indexHtml);

for (const url of local) {
  const file = `${ROOT}/${url.replace(/^\.\//, '').split('#')[0]}`;
  const found = existsSync(file);
  report(found, url, found ? 'на месте' : 'НЕТ ФАЙЛА');
}

// ---------- 2. Скрипты документации ----------
console.log('\nМодули документации (import-цепочка от index.js):');

const entry = readFileSync(`${ROOT}/index.js`, 'utf8');
const imports = [...entry.matchAll(/from\s+["'](\.[^"']+)["']/g)].map((m) => m[1]);

for (const spec of imports) {
  report(existsSync(`${ROOT}/${spec.replace(/^\.\//, '')}`), spec);
}

// ---------- 3. CSS: классы из index.html объявлены? ----------
console.log('\nКлассы из index.html против CSS:');

const galsCss = readFileSync(`${ROOT}/gals/gals.css`, 'utf8');
const siteCss = readFileSync(`${ROOT}/style.css`, 'utf8');
const declared = new Set(
  [...`${galsCss}\n${siteCss}`.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]),
);

// Классы, которые галс-рантайм навешывает/ожидает из JS, а не из CSS.
// Классы, которые JS-рантайм использует как DOM-хуки, а не стилизует.
// Не добавлять сюда классы для оформления — только селекторы для делегирования кликов и DOM-манипуляций.
const runtimeOnly = new Set([
  "menu-show",        // JS навешивает/снимает на .menu при открытии
  "menu-ul",          // делегирование кликов в headerNav (renderCenterBlock)
  "version",          // переключатель версий (headerUlLiversion)
  "details-item",     // стилизация summary details (addStyleDetailsLeft)
  "list",             // делегирование кликов сайдбара (detailsLeftUlLi)
  "menu-item",        // делегирование кликов сайдбара (renderCenterBlock)
  "accordion-group",  // gals.js: открытие одного details закрывает остальные
  "copy-block1",      // селектор кнопки копирования в тестах (dom.test.mjs)
]);

const used = new Set();
const dom = new JSDOM(indexHtml);
for (const el of dom.window.document.querySelectorAll('[class]')) {
  for (const cls of el.getAttribute('class').split(/\s+/)) {
    if (cls) used.add(cls);
  }
}

const missing = [...used].filter((cls) => !declared.has(cls) && !runtimeOnly.has(cls));
report(missing.length === 0, `${used.size} классов использовано, ${missing.length} не объявлено`, missing.join(', '));

// ---------- 4. GitHub Pages + jsDelivr ----------
if (LIVE) {
  console.log('\nGitHub Pages:');

  for (const path of ['/', '/index.html', '/gals/gals.css', '/gals/gals.js', '/style.css', '/index.js', '/llms.txt', '/llms-full.txt', '/llms/gals-classes.json', '/docs/', '/docs/accordion.html', '/download/grid.zip.sha256']) {
    try {
      const res = await fetch(PAGES + path);
      report(res.ok, path, `${res.status} ${res.headers.get('content-type') || ''}`);
    } catch (error) {
      report(false, path, error.message);
    }
  }

  console.log('\njsDelivr CDN:');

  for (const f of ['gals.min.css', 'gals.min.js']) {
    const url = `https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn/${f}`;
    try {
      const res = await fetch(url);
      const body = res.ok ? await res.text() : '';
      report(res.ok && body.length > 0, f, `${res.status}, ${body.length} bytes`);
    } catch (error) {
      report(false, f, error.message);
    }
  }

  console.log('\nВнешние адреса из разметки (canonical, rel="alternate"):');

  for (const url of remote) {
    try {
      const res = await fetch(url);
      report(res.ok, url, `${res.status} ${res.headers.get('content-type') || ''}`);
    } catch (error) {
      report(false, url, error.message);
    }
  }
}

// ---------- Итог ----------
console.log(`\n${problems.length ? `ПРОБЛЕМЫ: ${problems.length}\n - ${problems.join('\n - ')}` : 'Проблем нет.'}`);
process.exit(problems.length ? 1 : 0);
