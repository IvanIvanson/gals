/**
 * Тесты CDN-сборки: файлы существуют, синтаксис валиден,
 * документация ссылается на правильные jsDelivr URL.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

  test('gals.css содержит scoped border-box и min-width для сетки', () => {
    const css = readFileSync(`${ROOT}/gals/gals.css`, 'utf8');
    assert.match(css, /box-sizing:\s*border-box/, 'нет border-box: сетка сломается в content-box');
    assert.match(css, /min-width:\s*0/, 'нет min-width: 0 для flex-колонок');
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

  test('min-файлы не содержат CRLF (защита от core.autocrlf)', () => {
    for (const f of ['cdn/gals.min.css', 'cdn/gals.min.js']) {
      const bytes = readFileSync(`${ROOT}/${f}`);
      const cr = bytes.reduce((sum, b) => sum + (b === 13 ? 1 : 0), 0);
      assert.equal(cr, 0, `${f} содержит ${cr} байт 0x0D (CRLF) — git autocrlf мог испортить`);
    }
  });

  test('.gitattributes существует с правилами eol=lf и -text', () => {
    const attrsPath = `${ROOT}/../.gitattributes`;
    assert.ok(existsSync(attrsPath), 'нет .gitattributes в корне репозитория');
    const content = readFileSync(attrsPath, 'utf8');
    assert.match(content, /eol=lf/, 'нет правила eol=lf');
    assert.match(content, /-text/, 'нет правила -text для CDN-файлов');
  });

  // Архив отдаётся кнопкой Download, поэтому обязан совпадать с gals/.
  test('download/grid.zip собран из актуальных файлов gals/', () => {
    const archive = `${ROOT}/download/grid.zip`;
    assert.ok(existsSync(archive), 'нет download/grid.zip — выполните npm run build:zip');

    const bytes = readFileSync(archive);

    // Мини-парсер central directory ZIP: имя файла -> размер в архиве.
    const entries = new Map();
    for (let i = 0; i + 4 <= bytes.length; i++) {
      if (bytes.readUInt32LE(i) !== 0x02014b50) continue;

      const nameLength = bytes.readUInt16LE(i + 28);
      const extraLength = bytes.readUInt16LE(i + 30);
      const commentLength = bytes.readUInt16LE(i + 32);
      const uncompressed = bytes.readUInt32LE(i + 24);
      const name = bytes
        .subarray(i + 46, i + 46 + nameLength)
        .toString('utf8')
        .split(String.fromCharCode(92))
        .join('/');

      entries.set(name, uncompressed);
      i += 46 + nameLength + extraLength + commentLength - 1;
    }

    const expected = new Map([
      ['README.txt', `${ROOT}/download/info.txt`],
      ['LICENSE', `${ROOT}/../LICENSE`],
      ['gals/gals.css', `${ROOT}/gals/gals.css`],
      ['gals/gals.js', `${ROOT}/gals/gals.js`],
    ]);

    for (const [name, file] of expected) {
      assert.ok(entries.has(name), `в архиве нет ${name}: ${[...entries.keys()]}`);
      assert.equal(
        entries.get(name),
        readFileSync(file).length,
        `${name} в архиве устарел: ${entries.get(name)} байт вместо ${readFileSync(file).length}`,
      );
    }

    const checksumFile = `${archive}.sha256`;
    assert.ok(existsSync(checksumFile), 'нет download/grid.zip.sha256');
    const checksum = createHash('sha256').update(bytes).digest('hex');
    assert.match(readFileSync(checksumFile, 'utf8'), new RegExp(`^${checksum}  grid\\.zip`));
  });
});

describe('jsDelivr CDN в документации', () => {
  const jsdelivrRe = /https:\/\/cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@[^/]+\/gals-main\/cdn\/gals\.min\.(css|js)/g;

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
      for (const url of html.matchAll(/https:\/\/cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@[^/]+\/gals-main\/(cdn\/gals\.min\.[^"'<\s]+)/g)) {
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

  test('сниппеты Quick start и CDN подключают CSS как stylesheet', async () => {
    const { intro, dl } = await pages();
    for (const html of [intro, dl]) {
      const doc = new JSDOM(`<div>${html}</div>`).window.document;
      const stylesheetSnippets = [...doc.querySelectorAll('pre')]
        .map((pre) => pre.textContent)
        .filter((text) => /<link\b/.test(text) && /(?:gals\.css|gals\.min\.css)/.test(text));

      assert.ok(stylesheetSnippets.length > 0, 'не найден пример подключения CSS');
      for (const snippet of stylesheetSnippets) {
        for (const [, attributes] of snippet.matchAll(/<link\b([^>]*)>/g)) {
          assert.match(attributes, /\brel="stylesheet"/, `link без rel="stylesheet": ${attributes}`);
        }
      }
    }
  });

  // Копипаста `<script src=...>` без `</script>` глушит остаток документа:
  // каждый сниппет обязан быть самодостаточным.
  test('каждый <script> в сниппетах закрыт', async () => {
    const { intro, dl } = await pages();

    for (const [name, html] of [['Introduction', intro], ['Download', dl]]) {
      const doc = new JSDOM(`<div>${html}</div>`).window.document;

      for (const pre of doc.querySelectorAll('pre')) {
        const text = pre.textContent;
        if (!text.includes('<script')) continue;

        const unclosed = text
          .split('<script')
          .slice(1)
          .filter((part) => !part.includes('</script>'));

        assert.deepEqual(
          unclosed,
          [],
          `${name}: <script> без закрывающего </script>: ${text.trim().slice(0, 80)}`,
        );
      }
    }
  });

  test('CDN-секция рендерится без ошибок в DOM', async () => {
    const { intro } = await pages();
    const dom = new JSDOM(`<div>${intro}</div>`);
    const doc = dom.window.document.querySelector('div');

    const cdnSection = doc.querySelector('#cdn');
    assert.ok(cdnSection, 'секция #cdn не найдена в DOM');
    assert.equal(cdnSection.tagName, 'H2', '#cdn — не h2');

    // Все ссылки с target="_blank" имеют rel="noopener".
    for (const a of doc.querySelectorAll('a[target="_blank"]')) {
      assert.ok(a.getAttribute('rel')?.includes('noopener'), `ссылка ${a.href} без rel="noopener"`);
    }

    // CDN-URL в <link> и <code> корректны и запиннены на тег, а не на @main.
    const codeText = [...doc.querySelectorAll('code pre')].map((el) => el.textContent).join('\n');
    assert.match(codeText, /cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@v\d+\.\d+\/gals-main\/cdn\/gals\.min\.css/, 'URL CSS не запиннен на тег');
    assert.match(codeText, /cdn\.jsdelivr\.net\/gh\/IvanIvanson\/gals@v\d+\.\d+\/gals-main\/cdn\/gals\.min\.js/, 'URL JS не запиннен на тег');
    assert.equal(/gals@main[/'"]/.test(codeText), false, 'в копируемом сниппете остались ссылки на @main');
  });

  test('в Introduction есть подсказка про production pinning', async () => {
    const { intro } = await pages();
    assert.match(intro, /pin.*tag|pin.*version/i, 'нет подсказки про пиннинг версии для production');
  });
});
