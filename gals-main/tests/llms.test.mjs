/**
 * Тесты llms-справочника.
 *
 * Цель — не дать справочнику разойтись со сборкой и не дать в него попасть
 * классам, которых в GALS нет. Именно выдуманные классы (.row, .col-*, mb-*)
 * были причиной галлюцинаций в прежней версии llms.txt.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));

const read = (p) => readFileSync(p, 'utf8');

/**
 * Классы, реально объявленные в gals/gals.css.
 * Тела правил вырезаются: иначе домен из data:URL (`.w3.org`) считается классом.
 */
const cssClasses = () => {
  const selectorsOnly = read(`${ROOT}/gals/gals.css`)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{[^{}]*\}/g, '');

  const names = new Set();
  for (const m of selectorsOnly.matchAll(/\.([a-zA-Z][\w-]*)/g)) names.add(m[1]);
  return names;
};

const reference = JSON.parse(read(`${ROOT}/llms/gals-classes.json`));

describe('llms.txt', () => {
  test('есть в корне репозитория и в папке сайта', () => {
    assert.ok(existsSync(`${REPO}/llms.txt`), 'нет llms.txt в корне репозитория');
    assert.ok(existsSync(`${ROOT}/llms.txt`), 'нет llms.txt в gals-main (его публикует Pages)');
  });

  test('копия для сайта совпадает с канонической', () => {
    assert.equal(
      read(`${ROOT}/llms.txt`),
      read(`${REPO}/llms.txt`),
      'gals-main/llms.txt отличается от корневого — выполните npm run build:llms',
    );
  });

  test('описан формат llms.txt: заголовок и разделы', () => {
    const txt = read(`${REPO}/llms.txt`);
    assert.match(txt, /^# GALS Framework/, 'файл должен начинаться с H1');
    for (const section of ['Сетка', 'Брейкпоинты', 'Компоненты', 'Формы', 'Хелперы', 'Runtime']) {
      assert.ok(txt.includes(section), `нет раздела «${section}»`);
    }
  });

  // Регрессия на прежнюю версию файла: она обещала API, которого в CSS нет.
  test('не обещает классов, которых нет в GALS', () => {
    const txt = read(`${REPO}/llms.txt`);

    // Упоминаются только в конструкциях «их нет» — проверяем, что нет инструкций их использовать.
    const forbidden = [
      /\.col-[a-z]*-?\d/,
      /\bmb-\d/,
      /\bmt-\d/,
      /\bpx-\d/,
      /\bpy-\d/,
    ];

    for (const re of forbidden) {
      assert.equal(re.test(txt), false, `в llms.txt встретился выдуманный класс: ${re}`);
    }
  });

  test('классы, упомянутые как реальные, объявлены в gals.css', () => {
    const txt = read(`${REPO}/llms.txt`);
    const declared = cssClasses();
    // style.css сайта документации объявляет свои — они не часть фреймворка.
    const siteOnly = new Set(['visually-hidden']);
    // Хуки gals.js, не объявленные в CSS.
    const runtimeHooks = new Set(['icon-menu', 'menu-show', 'accordion-group', 'row', 'col']);

    // Собираем `.foo` из колонок таблиц и inline-кода, игнорируя строки-опровержения.
    const mentioned = new Set();
    for (const line of txt.split('\n')) {
      if (/нет|не\b|does not|нет в GALS/i.test(line)) continue;
      for (const m of line.matchAll(/`\.([a-z][\w-]*)`/g)) mentioned.add(m[1]);
    }

    const unknown = [...mentioned].filter((c) => !declared.has(c) && !siteOnly.has(c) && !runtimeHooks.has(c));
    assert.deepEqual(unknown, [], `в llms.txt описаны классы, которых нет в gals.css: ${unknown.join(', ')}`);
  });

  test('ссылка на gals-classes.json ведёт на существующий файл', () => {
    const txt = read(`${REPO}/llms.txt`);
    assert.match(txt, /llms\/gals-classes\.json/, 'нет ссылки на JSON');
    assert.ok(existsSync(`${REPO}/llms/gals-classes.json`), 'по указанной ссылке файла нет');
  });
});

describe('gals-classes.json', () => {
  test('копия для сайта совпадает с канонической', () => {
    assert.equal(
      read(`${ROOT}/llms/gals-classes.json`),
      read(`${REPO}/llms/gals-classes.json`),
      'копии JSON разошлись — выполните npm run build:llms',
    );
  });

  test('свежий: пересборка ничего не меняет', () => {
    const before = read(`${ROOT}/llms/gals-classes.json`);
    execFileSync(process.execPath, ['scripts/build-classes-json.mjs'], { cwd: ROOT });
    assert.equal(read(`${ROOT}/llms/gals-classes.json`), before, 'JSON устарел — выполните npm run build:llms');
  });

  test('содержит каждый класс из gals.css и ничего лишнего', () => {
    const declared = cssClasses();
    const documented = new Set(reference.classes.map((c) => c.name));

    const missing = [...declared].filter((c) => !documented.has(c));
    const extra = [...documented].filter((c) => !declared.has(c));

    assert.deepEqual(missing, [], `нет описаний для классов: ${missing.join(', ')}`);
    assert.deepEqual(extra, [], 'JSON описывает классы, которых нет в CSS: ' + extra.join(', '));
  });

  test('у каждой записи есть описание и CSS', () => {
    for (const entry of reference.classes) {
      assert.ok(entry.name, 'запись без имени');
      assert.ok(entry.description?.length > 10, `у .${entry.name} пустое описание`);
      assert.ok(entry.css || entry.variants, `у .${entry.name} нет css и нет variants`);
    }
  });

  test('адаптивные колонки описаны вариантами с брейкпоинтом', () => {
    const pt3 = reference.classes.find((c) => c.name === 'pt-3');
    assert.ok(pt3.needs === '.container', 'pt-3 должен требовать .container');

    const ptM6 = reference.classes.find((c) => c.name === 'pt-m6');
    assert.ok(ptM6.variants, 'pt-m6 должен быть через variants');
    assert.equal(ptM6.variants[0].at, 'm', 'у варианта pt-m6 не указан брейкпоинт');
  });

  test('токены совпадают с :root в CSS', () => {
    const css = read(`${ROOT}/gals/gals.css`);
    const rootBlock = /:root\s*\{([\s\S]*?)\}/.exec(css)[1];
    const fromCss = new Set([...rootBlock.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

    assert.deepEqual(Object.keys(reference.tokens).sort(), [...fromCss].sort());
  });

  test('JSON умещается в разумный контекст', () => {
    const size = read(`${ROOT}/llms/gals-classes.json`).length;
    // ~85 КБ ≈ 25k токенов: целиком не каждый агент переварит, но расти дальше нельзя.
    assert.ok(size < 120_000, `JSON разросся до ${size} байт`);
  });

  test('раздел doesNotExist перечисляет известные ложные представления', () => {
    assert.ok(Array.isArray(reference.grid.doesNotExist), 'нет grid.doesNotExist');
    const joined = reference.grid.doesNotExist.join(' ');
    assert.match(joined, /\.row/);
    assert.match(joined, /\.col/);
    assert.match(joined, /mb-\*/);
  });

  test('runtime-хуки соответствуют gals.js', () => {
    const js = read(`${ROOT}/gals/gals.js`);

    for (const hook of reference.runtime.hooks) {
      assert.ok(js.includes(hook.marker), `gals.js не упоминает хук ${hook.name}`);
    }
  });
});
