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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

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

  // Спецификация llms.txt: H1, затем blockquote-теглайн, затем H2 со ссылками.
  // \r? нужен из-за CRLF в файле: иначе «пустая строка» не находится.
  test('соблюдена каноническая структура: H1, blockquote-теглайн, H2 со ссылками', () => {
    const txt = read(`${REPO}/llms.txt`);
    const [head] = txt.split(/^## /m);

    assert.match(head, /^> .+/m, 'после H1 нет blockquote с теглайном');
    assert.match(
      txt,
      /^## [^\r\n]+\r?\n\r?\n- \[[^\]]+\]\(https:\/\/[^)]+\): .+/m,
      'H2-секция не начинается с аннотированной ссылки вида [имя](https://...): описание',
    );
  });

  // Пустой ```html ``` — главный риск для входной точки ИИ: модель получает
  // обещание примера без примера и додумывает синтаксис. Проверяем все блоки
  // во всех llms-артефактах, а не только в каноне.
  test('ни один fenced-блок не пустой', () => {
    const sources = {
      'llms.txt': read(`${REPO}/llms.txt`),
      'gals-main/llms.txt': read(`${ROOT}/llms.txt`),
      'AI_PROMPT_TEMPLATE.md': read(`${ROOT}/AI_PROMPT_TEMPLATE.md`),
    };

    let checked = 0;

    for (const [name, text] of Object.entries(sources)) {
      const blocks = [...text.matchAll(/```([a-zA-Z]*)\r?\n([\s\S]*?)```/g)];

      const empty = blocks.filter((m) => m[2].trim().length === 0);
      assert.deepEqual(empty, [], `${name}: пустые блоки кода: ${empty.map((m) => `\`\`\`${m[1]}\`\`\``).join(', ')}`);

      checked += blocks.length;
    }

    assert.ok(checked >= 4, `проверено слишком мало блоков: ${checked}`);
  });

  // Регрессия на прежнюю версию файла: она обещала API, которого в CSS нет.
  test('CDN-сниппет не пустой и запиннен на тег', () => {
    const txt = read(`${REPO}/llms.txt`);

    // Секция «Через CDN» должна содержать `<link` и `<script` — не пустой блок.
    assert.ok(
      txt.includes('Через CDN:') && txt.match(/cdn\.jsdelivr\.net.*gals\.min\.css/),
      'CDN-сниппет пуст или не содержит URL'
    );

    // Запиннен на тег, а не на @main.
    assert.equal(
      /gals@main[/'\s>]/.test(txt),
      false,
      'в CDN-сниппете остался @main вместо тега версии'
    );
    assert.match(txt, /gals@v\d+\.\d+/, 'CDN-ссылка не запиннена на @vN.N');
  });

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

  // Относительная ссылка живёт только рядом с файлом: в промпте или агрегаторе она никуда не ведёт.
  test('все markdown-ссылки абсолютные', () => {
    const txt = read(`${REPO}/llms.txt`);

    const relative = [...txt.matchAll(/\]\(([^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((url) => !url.startsWith('https://'));

    assert.deepEqual(relative, [], `в llms.txt относительные ссылки: ${relative.join(', ')}`);
  });

  // Ревьюер ИИ-агрегаторов видит пустые блоки: теги внутри строки промпта
  // теряются при HTML-стриппинге. Держим копируемые fenced-блоки.
  test('«Быстрый старт» содержит классы GALS внутри шаблона', () => {
    const txt = read(`${REPO}/llms.txt`);
    const start = txt.indexOf('## Быстрый старт');
    assert.ok(start >= 0);
    const section = txt.slice(start, txt.indexOf('## Сетка'));
    assert.match(section, /class="container"/, 'нет класса .container в блоке HTML');
    assert.match(section, /container-block pt-\d+/, 'нет колонок .container-block в блоке HTML');
  });

  // Ревьюер ИИ-агрегаторов видит пустые блоки: теги внутри строки промпта
  // теряются при HTML-стриппинге. Держим копируемые fenced-блоки.
  test('шаблон промпта содержит копируемые fenced-блоки с тегами подключения', () => {
    const tpl = read(`${ROOT}/AI_PROMPT_TEMPLATE.md`);
    const blocks = [...tpl.matchAll(/```html\r?\n([\s\S]*?)```/g)].map((m) => m[1]);

    assert.ok(blocks.length >= 1, `ожидалось минимум 1 html-блок, найдено ${blocks.length}`);
    assert.ok(blocks.some((b) => /<link\b[^>]*>/.test(b)), 'нет fenced-блока с <link>');
    assert.ok(blocks.some((b) => /<script\b[^>]*><\/script>/.test(b)), 'нет fenced-блока с <script>');
    assert.ok(blocks.some((b) => /class="container"/.test(b)), 'нет fenced-блока с .container');
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

  test('llms-full.txt есть, совпадает в корне и на сайте и содержит страницы', () => {
    assert.ok(existsSync(`${REPO}/llms-full.txt`), 'нет llms-full.txt в корне');
    assert.ok(existsSync(`${ROOT}/llms-full.txt`), 'нет llms-full.txt в gals-main');
    assert.equal(
      read(`${ROOT}/llms-full.txt`),
      read(`${REPO}/llms-full.txt`),
      'копии llms-full.txt разошлись — выполните npm run build:docs',
    );
    const full = read(`${ROOT}/llms-full.txt`);
    assert.ok(full.includes('## Accordion'), 'в llms-full.txt нет страницы Accordion');
    assert.ok(full.includes('https://ivanivanson.github.io/gals/docs/accordion.html'), 'в llms-full.txt нет ссылки на статическую страницу');
  });

  test('статические страницы документации и sitemap сгенерированы', () => {
    assert.ok(existsSync(`${ROOT}/docs/index.html`), 'нет docs/index.html');
    assert.ok(existsSync(`${ROOT}/docs/accordion.html`), 'нет docs/accordion.html');
    const sitemap = read(`${ROOT}/sitemap.xml`);
    assert.ok(sitemap.includes('/docs/accordion.html'), 'sitemap не содержит docs/accordion.html');
  });

  test('версия и лицензия совпадают с package.json', () => {
    const pkg = JSON.parse(read(`${ROOT}/package.json`));
    assert.equal(reference.version, pkg.version, 'version в gals-classes.json не совпадает с package.json');
    assert.equal(reference.license, pkg.license, 'license в gals-classes.json не совпадает с package.json');
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

/**
 * Шаблон промпта живёт в двух местах: русская версия в AI_PROMPT_TEMPLATE.md,
 * английская — в copy-block страницы Introduction. Правила обязан вести один
 * источник, иначе агенты получают противоречивые инструкции.
 */
describe('шаблон промпта для ИИ', async () => {
  const ru = read(`${ROOT}/AI_PROMPT_TEMPLATE.md`);

  const enHtml = await import(pathToFileURL(`${ROOT}/script/introduction.js`).href).then(
    (m) => m.default.html,
  );

  // В copy-block теги записаны HTML-сущностями — декодируем через DOM.
  const en = [...new JSDOM(`<div>${enHtml}</div>`).window.document.querySelectorAll('pre')]
    .map((pre) => pre.textContent)
    .join('\n');

  /** Список компонентов из строки «Components:» / «Компоненты:**». */
  const componentsOf = (text, marker) => {
    const at = text.indexOf(marker);
    assert.ok(at >= 0, `в тексте нет маркера ${marker}`);

    const rest = text.slice(at + marker.length).replace(/^[*\s]+/, '');
    return rest
      .slice(0, rest.search(/[^a-z, ]/))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  test('русская и английская версии называют одни и те же компоненты', () => {
    const ruList = componentsOf(ru, 'Компоненты:**');
    const enList = componentsOf(en, 'Components:');

    assert.ok(ruList.length > 15, `в русской версии подозрительно короткий список: ${ruList}`);
    assert.deepEqual(enList, ruList, 'списки компонентов в RU и EN версиях промпта разошлись');
  });

  test('промпт перечисляет ровно те токены, что объявлены в :root', () => {
    const rootBlock = /:root\s*\{([\s\S]*?)\}/.exec(read(`${ROOT}/gals/gals.css`))[1];
    const fromCss = [...new Set([...rootBlock.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))];

    for (const [name, text] of [['RU', ru], ['EN', en]]) {
      const fromPrompt = [...new Set([...text.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];

      assert.ok(fromPrompt.length > 0, `в ${name} версии промпта нет токенов`);
      assert.deepEqual(
        [...fromPrompt].sort(),
        [...fromCss].sort(),
        `${name} версия промпта ссылается не на те токены, что в gals.css`,
      );
    }
  });

  test('обе версии промпта дают корректные теги подключения', () => {
    for (const [name, text] of [['RU', ru], ['EN', en]]) {
      const link = /<link\b[^>]*>/.exec(text);
      assert.ok(link, `${name}: в промпте нет примера <link>`);
      assert.match(link[0], /\brel="stylesheet"/, `${name}: <link> без rel="stylesheet"`);

      assert.match(
        text,
        /<script\b[^>]*><\/script>/,
        `${name}: в промпте нет закрытого <script>`,
      );
    }
  });
});
