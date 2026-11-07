/**
 * Пререндерит страницу Introduction в index.html.
 *
 * .container-center заполняет JavaScript, поэтому краулер без JS видел ~18 %
 * текста и ни одного <h1>. Пререндер кладёт тот же HTML в файл; рантайм
 * (renderCenterBlock) подменяет его идентичной разметкой, поэтому поведение
 * страницы, поиск по документации и тесты DOM не меняются.
 *
 * Источник разметки — сам introduction.js: сборка импортирует модуль, а не
 * хранит копию строки, поэтому пререндер не может разойтись с реальным
 * контентом. Проверка: npm run check:prerender
 *
 * Запуск:  node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INDEX = join(ROOT, 'index.html');
const START = '<!-- prerender:start';
const END = '<!-- prerender:end -->';

/**
 * Границы блока между маркерами. Срез по индексам, а не regex: внутри
 * introduction.js встречаются HTML-комментарии и «-->», которые ломали бы
 * шаблон regex, а экранирование в строковом RegExp теряет бэкслэши.
 */
const region = (html) => {
  const from = html.indexOf(START);
  if (from < 0) return null;

  const openEnd = html.indexOf('-->', from);
  if (openEnd < 0) return null;

  const close = html.indexOf(END, openEnd);
  if (close < 0) return null;

  return { start: openEnd + 3, end: close, text: html.slice(openEnd + 3, close) };
};

const build = async () => {
  const page = (await import(pathToFileURL(join(ROOT, 'script', 'introduction.js')).href)).default;
  return page.html.trim();
};

const main = async () => {
  const raw = readFileSync(INDEX, 'utf8');

  // BOM срезаем и переписываем файл даже при свежем контенте: .gitattributes
  // требует чистый LF без BOM, а редакторы на Windows его добавляют.
  const hadBom = raw.startsWith('\uFEFF');
  const html = hadBom ? raw.slice(1) : raw;
  const found = region(html);

  if (!found) {
    console.error(`В index.html не найдена пара маркеров ${START} / ${END}`);
    process.exit(1);
  }

  const rendered = await build();
  const stale = found.text.trim() !== rendered;

  if (process.argv.includes('--check')) {
    if (!stale && !hadBom) {
      console.log(`prerender свежий: ${rendered.length} символов`);
      return;
    }

    console.error(hadBom ? 'в index.html есть BOM — выполните npm run build:prerender' : 'prerender устарел — выполните npm run build:prerender');
    process.exit(1);
  }

  if (!stale && !hadBom) {
    console.log(`prerender без изменений: ${rendered.length} символов`);
    return;
  }

  writeFileSync(INDEX, `${html.slice(0, found.start)}\n${rendered}\n${html.slice(found.end)}`, 'utf8');
  console.log(`index.html: пререндер обновлён, ${rendered.length} символов`);
};

await main();
