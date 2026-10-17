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

/** Собирает все URL ресурсов из разметки. */
const assetUrls = (html) => {
  const dom = new JSDOM(html);
  const urls = new Set();

  for (const el of dom.window.document.querySelectorAll('link[href], script[src], img[src]')) {
    const url = el.getAttribute('href') || el.getAttribute('src');
    if (url && !/^(https?:)?#/.test(url) && !url.startsWith('data:')) {
      urls.add(url);
    }
  }

  return urls;
};

const problems = [];
const report = (ok, label, detail = '') => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) problems.push(label);
};

// ---------- 1. Локальные файлы ----------
console.log('\nЛокальные ресурсы index.html:');

const indexHtml = readFileSync(`${ROOT}/index.html`, 'utf8');

for (const url of assetUrls(indexHtml)) {
  // download/grid.zip собирается отдельно, его в дереве может не быть.
  const file = `${ROOT}/${url.replace(/^\.\//, '').split('#')[0]}`;
  const optional = url.endsWith('.zip');
  const found = existsSync(file);
  report(found || optional, url, found ? 'на месте' : optional ? 'нет (опционально)' : 'НЕТ ФАЙЛА');
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
const runtimeOnly = new Set(['menu-show']);

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

  for (const path of ['/', '/index.html', '/gals/gals.css', '/gals/gals.js', '/style.css', '/index.js', '/demo/trackmetro.html']) {
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
}

// ---------- Итог ----------
console.log(`\n${problems.length ? `ПРОБЛЕМЫ: ${problems.length}\n - ${problems.join('\n - ')}` : 'Проблем нет.'}`);
process.exit(problems.length ? 1 : 0);
