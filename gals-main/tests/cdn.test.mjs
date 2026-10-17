/**
 * Тесты CDN-сборки: файлы существуют, синтаксис валиден,
 * документация ссылается на правильные jsDelivr URL.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn';

describe('CDN-файлы', () => {
  test('cdn/ существует и содержит оба файла', () => {
    for (const f of ['cdn/gals.min.css', 'cdn/gals.min.js']) {
      assert.ok(existsSync(`${ROOT}/${f}`), `нет файла ${f}`);
      const size = readFileSync(`${ROOT}/${f}`).length;
      assert.ok(size > 0, `${f} пустой`);
    }
  });

  test('gals.min.js — валидный JS и меньше исходника', () => {
    const min = readFileSync(`${ROOT}/cdn/gals.min.js`, 'utf8');
    const src = readFileSync(`${ROOT}/gals/gals.js`, 'utf8');

    // Парсится без ошибок.
    assert.doesNotThrow(() => new Function(min), 'gals.min.js не парсится');

    // Минифицирован: одна строка и короче исходника.
    assert.ok(min.length < src.length, 'min-версия не короче исходника');
    assert.equal(min.includes('\n'), false, 'в min.js остались переносы строк');
  });

  test('gals.min.css — валидный CSS и меньше исходника', () => {
    const min = readFileSync(`${ROOT}/cdn/gals.min.css`, 'utf8');
    const src = readFileSync(`${ROOT}/gals/gals.css`, 'utf8');

    // Скобки сбалансированы — CSS не обрезан.
    const opens = (min.match(/{/g) || []).length;
    const closes = (min.match(/}/g) || []).length;
    assert.equal(closes, opens, `несбалансированные скобки: ${opens} { vs ${closes} }`);

    assert.ok(min.length < src.length, 'min-версия не короче исходника');
    // Sass compressed выдаёт одну строку + один trailing newline.
    const nonEmptyLines = min.split('\n').filter((l) => l.trim().length > 0);
    assert.equal(nonEmptyLines.length, 1, `в min.css несколько непустых строк: ${nonEmptyLines.length}`);
  });

  test('gals.min.js не содержит console.log', () => {
    const min = readFileSync(`${ROOT}/cdn/gals.min.js`, 'utf8');
    assert.equal(min.includes('console.log'), false, 'console.log остался в min-сборке');
  });

  test('gals.min.css не содержит комментариев', () => {
    const min = readFileSync(`${ROOT}/cdn/gals.min.css`, 'utf8');
    assert.equal(min.includes('/*'), false, 'комментарии остались в min-сборке');
  });

  test('package.json содержит build:cdn и поля jsdelivr/style', () => {
    const pkg = JSON.parse(readFileSync(`${ROOT}/package.json`, 'utf8'));

    assert.ok(pkg.scripts['build:cdn'], 'нет скрипта build:cdn');
    assert.equal(pkg.jsdelivr, 'cdn/gals.min.js');
    assert.equal(pkg.style, 'cdn/gals.min.css');
    assert.ok(pkg.files.includes('cdn/'), 'cdn/ не в files[]');
  });
});

describe('jsDelivr CDN в документации', () => {
  const jsdelivrRe = /https:\/\/cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@main\/gals-main\/cdn\/gals\.min\.(css|js)/g;

  const pages = async () => {
    const intro = await import(pathToFileURL(`${ROOT}/script/introduction.js`).href);
    const dl = await import(pathToFileURL(`${ROOT}/script/download.js`).href);
    return { intro: intro.default.html, dl: dl.default.html };
  };

  test('Introduction содержит секцию CDN с обеими ссылками', async () => {
    const { intro } = await pages();
    assert.match(intro, /id="cdn"/, 'нет секции id="cdn"');
    assert.match(intro, /jsDelivr CDN/, 'нет заголовка «jsDelivr CDN»');

    const urls = [...intro.matchAll(jsdelivrRe)];
    const extensions = urls.map((m) => m[1]).sort();
    assert.deepEqual(extensions, ['css', 'js'], 'в Introduction нет обеих CDN-ссылок');
  });

  test('Download содержит секцию CDN с обеими ссылками', async () => {
    const { dl } = await pages();
    const urls = [...dl.matchAll(jsdelivrRe)];
    const extensions = urls.map((m) => m[1]).sort();
    assert.deepEqual(extensions, ['css', 'js'], 'в Download нет обеих CDN-ссылок');
  });

  test('URL на файлы ведут в cdn/, а не в gals/', async () => {
    const { intro, dl } = await pages();
    for (const html of [intro, dl]) {
      // Проверяем только URL на конкретные файлы (не ссылку на просмотр папки).
      for (const url of html.matchAll(/https:\/\/cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@main\/gals-main\/(cdn\/gals\.min\.[^"'<\s]+)/g)) {
        assert.match(url[1], /^cdn\/gals\.min\./, `URL ведёт не в cdn/: ${url[1]}`);
      }
    }
  });

  test('ссылка на просмотр CDN-файлов есть в Introduction', async () => {
    const { intro } = await pages();
    assert.match(intro, /cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@main\/gals-main\/cdn\//, 'нет ссылки на просмотр');
    assert.match(intro, /rel="noopener"/, 'внешняя ссылка без rel="noopener"');
    assert.match(intro, /target="_blank"/, 'внешняя ссылка без target="_blank"');
  });

  test('CDN-секция рендерится без ошибок в DOM', async () => {
    const { intro } = await pages();
    const dom = new JSDOM(`<div>${intro}</div>`);
    const doc = dom.window.document.querySelector('div');

    const cdnSection = doc.querySelector('#cdn');
    assert.ok(cdnSection, 'секция #cdn не найдена в DOM');
    assert.equal(cdnSection.tagName, 'H3', '#cdn — не h3');

    // Все ссылки с target="_blank" имеют rel="noopener".
    for (const a of doc.querySelectorAll('a[target="_blank"]')) {
      assert.ok(a.getAttribute('rel')?.includes('noopener'), `ссылка ${a.href} без rel="noopener"`);
    }

    // CDN-URL в <link> и <code> корректны.
    const codeText = [...doc.querySelectorAll('code pre')].map((el) => el.textContent).join('\n');
    assert.match(codeText, /cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@main\/gals-main\/cdn\/gals\.min\.css/, 'URL CSS не найден в <code>');
    assert.match(codeText, /cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@main\/gals-main\/cdn\/gals\.min\.js/, 'URL JS не найден в <code>');
  });

  test('в Introduction есть подсказка про production pinning', async () => {
    const { intro } = await pages();
    assert.match(intro, /pin.*tag|pin.*version/i, 'нет подсказки про пиннинг версии для production');
  });
});
