/**
 * Проверка GitHub Pages: каждый ресурс отдаётся 200.
 * Запуск: node scripts/check-pages.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PAGES = 'https://ivanivanson.github.io/gals';

const html = readFileSync(`${ROOT}/index.html`, 'utf8');

// Собираем все локальные src/href.
const urls = new Set();
for (const m of html.matchAll(/(?:href|src)="(\.[^"]+)"/g)) urls.add(m[1]);

const problems = [];

for (const rel of urls) {
  const path = rel.replace(/^\.\//, '');
  const url = `${PAGES}/${path}`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const size = body.length;
      problems.push(`${url} → ${res.status} (${size} bytes)`);
      console.log(`  FAIL ${url}  → ${res.status}`);
    } else {
      const ct = res.headers.get('content-type') || '';
      console.log(`  ok   ${url}  → ${res.status} ${ct}`);
    }
  } catch (error) {
    problems.push(`${url}  → ${error.message}`);
    console.log(`  FAIL ${url}  → ${error.message}`);
  }
}

// demo/trackmetro.html
try {
  const res = await fetch(`${PAGES}/demo/trackmetro.html`);
  console.log(res.ok ? `  ok   ${PAGES}/demo/trackmetro.html` : `  FAIL ${PAGES}/demo/trackmetro.html`);
  if (!res.ok) problems.push(`${PAGES}/demo/trackmetro.html → ${res.status}`);
} catch (e) {
  problems.push(`${PAGES}/demo/trackmetro.html → ${e.message}`);
  console.log(`  FAIL ${PAGES}/demo/trackmetro.html → ${e.message}`);
}

// CDN
for (const f of ['gals.min.css', 'gals.min.js']) {
  const url = `https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn/${f}`;
  try {
    const res = await fetch(url);
    const body = res.ok ? await res.text() : '';
    console.log(res.ok && body.length > 0 ? `  ok   ${url}  → ${body.length}B` : `  FAIL ${url}`);
    if (!res.ok || body.length === 0) problems.push(url);
  } catch (e) {
    problems.push(`${url} → ${e.message}`);
    console.log(`  FAIL ${url} → ${e.message}`);
  }
}

console.log(`\n${problems.length ? `ПРОБЛЕМЫ: ${problems.length}` : 'Проблем нет.'}`);
process.exit(problems.length ? 1 : 0);
