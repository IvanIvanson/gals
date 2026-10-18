/**
 * Собирает llms-справочник: gals-classes.json и копию llms.txt для сайта.
 *
 * Источник истины — сам CSS, поэтому справочник не может разойтись со сборкой:
 * селекторы и медиа-условия вырезаются из файла, а не переписываются руками.
 *
 * Канон живут в корне репозитория (llms.txt, llms/gals-classes.json), а в
 * gals-main/ попадают копии — именно gals-main/* публикуется на GitHub Pages.
 *
 * Запуск:  node scripts/build-classes-json.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO = fileURLToPath(new URL('../..', import.meta.url));

/** Куда кладём сгенерированный JSON: канон в репозитории + копия для Pages. */
const JSON_TARGETS = [`${REPO}/llms/gals-classes.json`, `${ROOT}/llms/gals-classes.json`];

/** llms.txt: канон в корне, копия в папке сайта. */
const TXT_SOURCE = `${REPO}/llms.txt`;
const TXT_TARGET = `${ROOT}/llms.txt`;

const css = readFileSync(`${ROOT}/gals/gals.css`, 'utf8');

/**
 * Разворачивает CSS в плоский список правил, снимая комментарии.
 * Вложенности в файле нет — только @media, поэтому достаточно стека из { }}.
 */
const flatten = (source) => {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const media = [];
  let buffer = '';

  for (let i = 0; i < clean.length; i += 1) {
    const ch = clean[i];

    if (ch === '{') {
      const header = buffer.trim();
      if (header.startsWith('@media')) {
        media.push(header.replace(/^@media\s*/, ''));
      } else {
        const body = readBlock(clean, i + 1);
        rules.push({ selector: header, media: [...media], body: body.trim() });
        // +1 — шагнуть через закрывающую скобку правила, иначе её примет
        // обработчик ниже и преждевременно снимет активный @media.
        i += body.length + 1;
      }
      buffer = '';
    } else if (ch === '}') {
      if (media.length) media.pop();
      buffer = '';
    } else {
      buffer += ch;
    }
  }

  return rules;
};

/** Читает тело правила до парной закрывающей скобки. */
const readBlock = (source, from) => {
  let depth = 1;
  let i = from;

  while (i < source.length && depth > 0) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    i += 1;
  }

  return source.slice(from, i - 1);
};

const rules = flatten(css);

// ---------- 1. Токены ----------
const rootRule = rules.find((r) => r.selector === ':root');
const tokens = {};

for (const decl of rootRule.body.split(';')) {
  const [name, value] = decl.split(':').map((s) => s?.trim());
  if (name?.startsWith('--')) tokens[name] = value;
}

// ---------- 2. Селекторы ----------
const CLASS_RE = /\.([a-zA-Z][\w-]*)/g;

/** Имена классов, выбранные из селектора, и хвост-описание селектора. */
const classesOf = (selector) => {
  const names = new Set();
  for (const m of selector.matchAll(CLASS_RE)) names.add(m[1]);
  return names;
};

const breakpoints = {
  xl: '(min-width: 1440px)',
  l: '(max-width: 1439.98px)',
  m: '(max-width: 1025px)',
  s: '(max-width: 770px)',
  xs: '(max-width: 425px)',
  xxs: '(max-width: 375px)',
};

const mediaToBreakpoint = (media) => {
  if (!media.length) return null;
  const entry = Object.entries(breakpoints).find(([, q]) => q === media[0]);
  return entry ? entry[0] : media[0];
};

/** Собирает карту: имя класса -> варианты применения. */
const map = new Map();

const add = (name, patch) => {
  if (!map.has(name)) map.set(name, { name, usages: [] });
  map.get(name).usages.push(patch);
};

for (const rule of rules) {
  if (rule.selector === ':root') continue;

  const bp = mediaToBreakpoint(rule.media);

  // Селектор вида `.container .pt-3` — класс-колонка живёт только внутри .container.
  const requiresContainer = /^\.container\s/.test(rule.selector);

  for (const part of rule.selector.split(',')) {
    const selector = part.trim();
    const names = [...classesOf(selector)];
    if (!names.length) continue;

    for (const name of names) {
      add(name, {
        selector,
        breakpoint: bp,
        requiresContainer: requiresContainer || /\.container\s+\.\w/.test(selector),
        styles: rule.body
          .split(';')
          .map((d) => d.trim())
          .filter(Boolean)
          .join('; '),
      });
    }
  }
}

// ---------- 3. Описания ----------
/**
 * Описания пишутся руками, но проверяются: ключ сверяется с реальным
 * списком классов, опечатка в имени уронит сборку.
 */
const DESCRIPTIONS = {
  // --- Токены и сетка ---
  container:
    'Flex-обёртка сетки: display:flex, flex-wrap:wrap, padding:5px. Обязательный родитель для классов pt-*.',
  'container-block':
    'Промежуточная ячейка внутри .container: добавляет padding:5px (gutter). Кладётся между .container и содержимым колонки.',
  'container-flex': 'Просто display:flex без переноса строк.',
  'container-fluid':
    'flex-grow:1 — растягивает элемент на всё свободное место. На <img class="container-fluid"> gals.js подгоняет картинку под размер родителя.',

  // --- Колонки ---
  'pt-1': 'Колонка шириной 1/12 (8.325%). Только внутри .container.',
  'pt-12': 'Колонка шириной 12/12, то есть вся строка. Только внутри .container.',

  // --- Flex-утилиты ---
  'space-between': 'justify-content:space-between (без display:flex!).',
  'space-around': 'justify-content:space-around.',
  'space-center': 'justify-content:center.',
  'content-between': 'display:flex + justify-content:space-between. Самостоятельный хелпер.',
  'content-center': 'display:flex + justify-content:center.',
  'content-around': 'display:flex + justify-content:space-around.',
  'align-center': 'align-items:center.',
  'align-flexEnd': 'align-items:flex-end.',
  'align-flexStart': 'align-items:flex-start.',
  'alignSelf-center': 'align-self:center — переопределяет выравнивание одного элемента.',
  'alignSelf-start': 'align-self:flex-start.',
  'alignSelf-end': 'align-self:flex-end.',
  'alignSelf-baseline': 'align-self:baseline.',
  'flex-grow1': 'flex-grow:1.',
  'flex-grow2': 'flex-grow:2.',
  'text-center': 'text-align:center.',
  'padding-lg':
    'Горизонтальные отступы clamp(12px, 6vw, 80px) — сжимаются на мобильном вместо жёстких 80px.',

  // --- Отладка ---
  border: 'outline solid #333 1px — контур не влияет на layout.',
  borderRed: 'outline solid red 3px — отладка.',
  borderGreen: 'outline solid green 2px — отладка.',
  borderBlue: 'outline solid blue 1px — отладка.',

  // --- Header ---
  header: 'flex, flex-wrap:wrap, align-items:center, gap:10px — шапка сайта.',
  'header-sticky': 'position:sticky, top:0, z-index:100, фон var(--paper).',
  'header-brand': 'Логотип/название: жирный, без подчёркивания.',
  'header-nav': 'Контейнер навигации; вложенный ul сбрасывается в flex-строку без буллетов.',
  'header-actions': 'Правый блок шапки: margin-left:auto прижимает его к краю.',

  // --- Table ---
  table: 'width:100%, border-collapse:collapse, нижние границы у ячеек.',
  'table-bordered': 'Полная обводка ячеек. Кладётся рядом с .table.',
  'table-striped': 'Чередование фона чётных строк tbody. Кладётся рядом с .table.',
  'table-responsive': 'overflow-x:auto — обёртка для широкой таблицы на телефоне.',

  // --- Buttons ---
  btn: 'Базовая кнопка: inline-flex, паддинги, рамка, border-radius:7px. Работает и на <a>.',
  'btn-primary': 'Заливка var(--accent). Кладётся рядом с .btn.',

  // --- Alert ---
  alert: 'Блок с боковой полосой 4px и серым фоном.',
  'alert-ok': 'Полоса var(--ok) — успех.',
  'alert-warn': 'Полоса var(--warn) — предупреждение.',
  'alert-error': 'Полоса var(--err) — ошибка.',
  'alert-info': 'Полоса var(--accent) — информация.',

  // --- Card ---
  card: 'flex-column, height:100%, рамка, border-radius:7px. Дочерние блоки — ниже.',
  'card-title': 'Заголовок карточки: margin:0, font-size:1.2em.',
  'card-body': 'flex:1 0 auto — тянется и прижимает футер вниз.',
  'card-footer': 'margin-top:auto + flex с gap:0.5em.',

  // --- Accordion ---
  accordion:
    'Стилизация родного <details>. summary получает стрелку ▸ через ::after, при [open] поворот на 90°.',
  'accordion-body': 'Внутренний паддинг раскрытой части.',

  // --- Carousel ---
  carousel: 'flex + overflow-x:auto + scroll-snap-type:x mandatory — лента без JS.',
  'carousel-slide': 'flex:0 0 80% + scroll-snap-align:center. Картинка внутри — cover на 100%.',

  // --- Dropdown ---
  dropdown:
    'Оформление вспывающего списка для Popover API (родной popovertarget). Кнопки внутри стилизованы.',

  // --- Modal ---
  modal:
    'Оформление родного <dialog>: width:min(90vw,32em), ::backdrop затемнение 50%. form/.modal-body — flex-column.',
  'modal-body':
    'Внутреннее тело <dialog.modal>: flex-column, gap:0.75em, padding:1.5em. Кладётся рядом с .modal.',

  // --- Menu ---
  menu: 'Стилизация ul/a: flex-строка без буллетов, hover — var(--accent).',
  'icon-menu':
    'Кнопка переключения меню. Скрыта на широких экранах, отображается до 767.98px; gals.js синхронизирует aria-expanded.',
  'menu-collapse':
    'Мобильное меню скрыто до открытия. Используйте вместе с .icon-menu и gals.js.',
  'menu-show':
    'Показывает открытое .menu-collapse на мобильном экране; класс переключает gals.js.',

  // --- Tabs ---
  tabs:
    'CSS-only вкладки на radio + :checked. До 6 вкладок. input скрыт, label — метка, .tab-panel — панель.',
  'tab-panel':
    'Панель вкладки. Порядок важен: N-я панель открывается N-м input, обе — прямые дети .tabs.',

  // --- Pagination ---
  pagination: 'flex + gap:0.25em. Дочерние элементы получают рамки; активная — [aria-current="page"].',

  // --- Popover ---
  popover:
    'CSS-only подсказка: текст берётся из data-popover, показ по :hover и :focus-visible. Ставится на любой элемент.',

  // --- Progress ---
  progress: 'Дорожка высотой 0.75em со скруглением.',
  'progress-bar': 'Заливка var(--accent), transition:width .3s — ширина задаётся из JS/inline.',

  // --- Loaders ---
  loader:
    'Инлайн-спиннер 1em на currentColor, анимация gals-spin .75s. Не занимает места в потоке текста.',
  skeleton:
    'Заглушка контента с shimmer. Под prefers-reduced-motion анимация гасится.',

  // --- Icons ---
  icon: 'fill:currentColor — SVG наследует цвет текста.',
  'icon-16': 'width/height 16px.',
  'icon-24': 'width/height 24px.',
  'icon-32': 'width/height 32px.',

  // --- Media ---
  media: 'display:block, width:100%, aspect-ratio:16/9, object-fit:cover.',
  'media-4-3': 'aspect-ratio:4/3.',
  'media-1-1': 'aspect-ratio:1/1.',
  audio: 'display:block, width:100%.',

  // --- Forms ---
  field: 'flex-column gap:0.35em — обёртка label + input.',
  'field-hint': 'Подпись-подсказка: 0.85em, серый.',
  'field-group': 'Сброс fieldset: margin/padding/border в 0.',
  input: 'width:100%, паддинги, рамка #767676, border-radius:4px. textarea.input — ресайз по вертикали.',
  select: 'Как .input + кастомная стрелка через data-URI SVG, appearance:none.',
  range: 'width:100% + accent-color:var(--accent).',

  // --- Checkbox / Radio / Switch ---
  checkbox:
    'Обёртка label: flex, gap. Родный input скрыт, визуал рисует .checkbox-box через ::after (галочка).',
  'checkbox-box': 'Квадратик 1.15em, border-radius:3px. Идёт СРАЗУ после input.',
  radio: 'Как .checkbox, но .radio-box круглый, ::after — точка.',
  'radio-box': 'Круг 1.15em, border-radius:50%.',
  switch: 'Как .checkbox, но .switch-box — пилюля 2.2em с бегунком.',
  'switch-box': 'Пилюля 2.2em x 1.15em, ::after — бегунок, при :checked сдвиг на 1.05em.',
};

/**
 * Хуки gals.js: классы и атрибуты, которые скрипт читает из разметки.
 * Описание CSS-поведения классов также собрано из gals.css.
 * Поле `marker` — литерал, который обязано содержать gals.js (проверяется тестом).
 */
const RUNTIME_HOOKS = [
  {
    name: 'icon-menu',
    kind: 'class',
    marker: 'icon-menu',
    description:
      'Кнопка-гамбургер. gals.js вешает на неё клик и обновляет aria-expanded. Нужна вместе с .menu.',
  },
  {
    name: 'menu-show',
    kind: 'class',
    marker: 'menu-show',
    description:
      'Навешивается на .menu при открытии и снимается при закрытии; .menu-collapse раскрывается через CSS фреймворка.',
  },
  {
    name: 'accordion-group',
    kind: 'class',
    marker: 'accordion-group',
    description:
      'Родитель для группы details.accordion: открытие одного элемента закрывает остальные.',
  },
  {
    name: 'img.container-fluid',
    kind: 'class + tag',
    marker: 'container-fluid',
    description:
      'Когда <img class="container-fluid"> лежит внутри .container-block, gals.js пересчитывает width/height по родителю.',
  },
  {
    name: 'data-scrollspy',
    kind: 'attribute',
    marker: 'data-scrollspy',
    description:
      'Ставится на <nav>. Ссылка a[href="#id"] заголовка в середине окна получает aria-current="true".',
  },
];

// Диапазоны pt-* и input-*.
for (let n = 1; n <= 12; n += 1) {
  DESCRIPTIONS[`pt-${n}`] = `Колонка сетки шириной ${n}/12 (${(8.325 * n).toFixed(3)}%). Только внутри .container.`;
  DESCRIPTIONS[`input-${n}`] = `Поле формы шириной ${n}/12 — та же шкала, что у колонок.`;
}

const prefixes = { xl: 'min-width 1440px', l: 'max-width 1439.98px', m: 'max-width 1025px', s: 'max-width 770px', xs: 'max-width 425px', xxs: 'max-width 375px' };

for (const [bp, cond] of Object.entries(prefixes)) {
  for (let n = 1; n <= 12; n += 1) {
    DESCRIPTIONS[`pt-${bp}${n}`] = `Колонка ${n}/12, применяется при ${cond}. Перекрывает базовую pt-* на этом экране.`;
  }
  DESCRIPTIONS[`pt-${bp}-d_n`] = `display:none при ${cond} — скрыть колонку на этом экране.`;
}

// ---------- 4. Сборка и проверка ----------

/**
 * Формат записи намеренно плоский: у большинства классов одно применение,
 * поэтому селектор (он же .name) и служебные флаги не дублируются.
 * Варианты появляются только у адаптивных колонок pt-*.
 */
const toEntry = (name, description, usages) => {
  const needsContainer = usages.every((usage) => usage.requiresContainer);
  const plain = usages.length === 1 && usages[0].selector === `.${name}`;

  if (plain) {
    const [usage] = usages;
    const entry = { name, description, css: usage.styles };
    if (usage.requiresContainer) entry.needs = '.container';
    return entry;
  }

  const entry = { name, description };
  if (needsContainer) entry.needs = '.container';
  entry.variants = [];

  for (const usage of usages) {
    const variant = { css: usage.styles };
    if (usage.breakpoint) variant.at = usage.breakpoint;
    // Флаг дублировать незачем, когда он общий для всех вариантов.
    if (usage.requiresContainer && !needsContainer) variant.needs = '.container';
    if (usage.selector !== `.${name}`) variant.selector = usage.selector;
    entry.variants.push(variant);
  }

  return entry;
};

const classes = [...map.values()]
  .map((entry) => {
    const description = DESCRIPTIONS[entry.name];

    if (!description) {
      throw new Error(`Нет описания для класса .${entry.name}`);
    }

    return toEntry(entry.name, description, entry.usages);
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Проверка в другую сторону: опечатка в ключе DESCRIPTIONS тоже ошибка.
const known = new Set(map.keys());
const invented = Object.keys(DESCRIPTIONS).filter((k) => !known.has(k));

if (invented.length) {
  throw new Error(`Описания для несуществующих классов: ${invented.join(', ')}`);
}

const document_ = {
  name: 'gals',
  version: '1.0.0',
  description:
    'GALS (Grid Application Layout Systems) — лёгкий flexbox-тулкит. Machine-readable справочник классов: сгенерирован из gals/gals.css, поэтому не расходится со сборкой.',
  generatedFrom: { css: 'gals/gals.css', js: 'gals/gals.js' },
  docs: 'https://ivanivanson.github.io/gals/',
  repository: 'https://github.com/IvanIvanson/gals',
  cdn: {
    css: 'https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn/gals.min.css',
    js: 'https://cdn.jsdelivr.net/gh/IvanIvanson/gals@main/gals-main/cdn/gals.min.js',
  },
  grid: {
    model: 'flex',
    container: '.container',
    columnUnit: 'var(--gridmultiplyConst) = 8.325% (1/12)',
    rule: 'Классы pt-* действуют ТОЛЬКО внутри .container: селектор в CSS — ".container .pt-3".',
    gutter: '.container padding 5px + .container-block padding 5px',
    columns: 12,
    doesNotExist: [
      '.row',
      '.col',
      '.col-{breakpoint}-{n}',
      'mt-*/mb-*/px-*/py-* (в GALS нет утилит отступов кроме .padding-lg)',
    ],
  },
  breakpoints: Object.entries(prefixes).map(([name, condition]) => ({
    name,
    prefix: `pt-${name}*`,
    condition,
  })),
  tokens,
  runtime: {
    file: 'gals/gals.js',
    note: 'Каждая фича опциональна: нет хука в разметке — код молчит.',
    hooks: RUNTIME_HOOKS,
  },
  counts: { classes: classes.length, tokens: Object.keys(tokens).length },
  classes,
};

const json = `${JSON.stringify(document_, null, 2)}\n`;

for (const target of JSON_TARGETS) {
  mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  writeFileSync(target, json, 'utf8');
}

// Копия llms.txt в папку сайта: публикуется на Pages как /gals/llms.txt.
const txt = readFileSync(TXT_SOURCE, 'utf8');

if (!existsSync(TXT_TARGET) || readFileSync(TXT_TARGET, 'utf8') !== txt) {
  writeFileSync(TXT_TARGET, txt, 'utf8');
}

console.log(
  `${JSON_TARGETS.join('\n')}\nклассов ${document_.counts.classes}, токенов ${document_.counts.tokens}, копий llms.txt: 1`,
);
