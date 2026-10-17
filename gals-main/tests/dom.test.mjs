import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MODULES = [
  'script/headerUlLiversion.js',
  'script/addStyleDetailsLeft.js',
  'script/detailsLeftUlLi.js',
  'script/renderCenterBlock.js',
];

/** Чистый DOM + модули проекта; возвращает окно, документ и счётчики слушателей. */
async function boot() {
  const dom = new JSDOM(readFileSync(`${ROOT}/index.html`, 'utf8'), {
    pretendToBeVisual: true,
    url: 'https://example.test/',
  });

  const counts = new Map();
  const native = dom.window.HTMLElement.prototype.addEventListener;
  dom.window.HTMLElement.prototype.addEventListener = function (type, fn, opts) {
    counts.set(type, (counts.get(type) || 0) + 1);
    return native.call(this, type, fn, opts);
  };

  globalThis.window = dom.window;
  globalThis.document = dom.window.document;

  for (const path of MODULES) {
    const mod = await import(pathToFileURL(`${ROOT}/${path}`).href);
    mod.default();
  }

  return { dom, document: dom.window.document, counts };
}

const click = (dom, el) =>
  el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));

describe('левое меню', () => {
  test('клик по каждому пункту не бросает исключение', async () => {
    const { dom, document } = await boot();

    for (const item of document.querySelectorAll('#introduction .menu-item')) {
      assert.doesNotThrow(() => click(dom, item), `action=${item.dataset.action}`);
    }
  });

  test('каждый пункт рендерит свой контент', async () => {
    const { dom, document } = await boot();
    const center = document.querySelector('.container-center');
    const seen = new Set();

    for (const item of document.querySelectorAll('#introduction .menu-item')) {
      click(dom, item);
      assert.ok(center.querySelector('h1'), `пусто после ${item.dataset.action}`);
      seen.add(center.innerHTML);
    }

    assert.equal(seen.size, 3, 'страницы не различаются между собой');
  });

  test('подсвечен ровно один пункт после кликов в разных списках', async () => {
    const { dom, document } = await boot();
    const lists = [...document.querySelectorAll('.list')];

    click(dom, lists[0].querySelector('.menu-item'));
    click(dom, lists[1].querySelector('.menu-item'));
    click(dom, lists[2].querySelector('.menu-item'));

    assert.equal(document.querySelectorAll('.active-list').length, 1);
  });

  test('делегирование: не больше одного слушателя на контейнер', async () => {
    const { counts } = await boot();
    // 3 клика на сайдбар/версии + 5 кнопок копирования (4 в Introduction + 1 в CDN)
    assert.ok(counts.get('click') <= 10, `слишком много слушателей: ${counts.get('click')}`);
  });
});

describe('реестр страниц документации', () => {
  const loadRegistry = async () => {
    const [{ docPages }, { slug }] = await Promise.all([
      import(pathToFileURL(`${ROOT}/script/docs/index.js`).href),
      import(pathToFileURL(`${ROOT}/script/docs/page.js`).href),
    ]);

    return { docPages, slug };
  };

  test('каждый пункт сайдбара имеет страницу в реестре', async () => {
    const { docPages, slug } = await loadRegistry();
    const document = new JSDOM(readFileSync(`${ROOT}/index.html`, 'utf8')).window.document;
    const items = [...document.querySelectorAll('.container-left .menu-item')];

    assert.equal(items.length, 86, `ожидалось 86 пунктов, найдено ${items.length}`);

    for (const item of items) {
      const key = item.dataset.action || slug(item.textContent);
      const covered = key.startsWith('show') || Object.hasOwn(docPages, key);

      assert.ok(covered, `нет страницы для «${item.textContent.trim()}» (key=${key})`);
    }
  });

  test('ключи реестра уникальны и не пересекаются с data-action', async () => {
    const { docPages } = await loadRegistry();

    // 86 пунктов меню минус 3 страницы Getting started с data-action
    assert.equal(Object.keys(docPages).length, 83, 'часть страниц потерялась при слиянии');

    for (const reserved of ['showIntroduction', 'showDownload', 'showContents']) {
      assert.equal(Object.hasOwn(docPages, reserved), false, `${reserved} занят в docPages`);
    }
  });

  test('клик по любому пункту сайдбара рендерит страницу без исключений', async () => {
    const { dom, document } = await boot();
    const center = document.querySelector('.container-center');
    const items = [...document.querySelectorAll('.container-left .menu-item')];

    for (const item of items) {
      assert.doesNotThrow(() => click(dom, item), `action=${item.dataset.action || item.textContent}`);
      assert.ok(center.querySelector('h1'), `пусто после «${item.textContent.trim()}»`);
      assert.ok(center.querySelector('.quick-start'), `нет секций после «${item.textContent.trim()}»`);
    }
  });
});

describe('переключатель версий', () => {
  test('активна только одна версия, summary обновляется', async () => {
    const { dom, document } = await boot();
    const items = [...document.querySelectorAll('.version li')];

    click(dom, items[1]);
    assert.equal(document.querySelectorAll('.version li.active').length, 1);
    assert.equal(items[1].classList.contains('active'), true);
    assert.equal(document.querySelector('.right summary span').textContent, '1.0');

    click(dom, items[1]);
    assert.equal(items[1].classList.contains('active'), true, 'повторный клик сбросил выбор');
  });
});

describe('копирование', () => {
  test('использует clipboard API и пишет код без разметки шаблона', async () => {
    const { dom, document } = await boot();
    const copied = [];

    Object.defineProperty(dom.window.navigator, 'clipboard', {
      value: { writeText: (text) => copied.push(text) },
      configurable: true,
    });

    click(dom, document.querySelector('.copy-block1 .copy'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(copied.length, 1);
    assert.ok(copied[0].includes('<!doctype html'), 'не тот текст');
    assert.ok(!copied[0].startsWith('\n'), 'в буфер ушли пустые строки шаблона');
    assert.ok(!/^\s{4,}\S/m.test(copied[0]), 'не срезаны отступы шаблона');
  });

  test('не накапливает блоки оповещения при повторных кликах', async () => {
    const { dom, document } = await boot();

    Object.defineProperty(dom.window.navigator, 'clipboard', {
      value: { writeText: () => {} },
      configurable: true,
    });

    const button = document.querySelector('.copy-block1 .copy');
    click(dom, button);
    click(dom, button);
    click(dom, button);
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.equal(document.querySelectorAll('.copy-block1 .copy-alert').length, 1);
  });
});

describe('разметка', () => {
  let document;

  beforeEach(() => {
    document = new JSDOM(readFileSync(`${ROOT}/index.html`, 'utf8')).window.document;
  });

  test('внутри ul нет br и hr', () => {
    for (const ul of document.querySelectorAll('ul')) {
      for (const child of ul.children) {
        assert.equal(
          ['BR', 'HR'].includes(child.tagName),
          false,
          `<${child.tagName.toLowerCase()}> внутри <ul>`
        );
      }
    }
  });

  test('id уникальны', () => {
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    assert.equal(new Set(ids).size, ids.length, 'есть дубликаты id');
  });

  test('якоря ссылаются на существующие элементы', () => {
    for (const a of document.querySelectorAll('a[href^="#"]')) {
      const target = a.getAttribute('href').slice(1);
      if (target) {
        assert.ok(document.getElementById(target), `битая ссылка #${target}`);
      }
    }
  });

  test('кнопка меню доступна с клавиатуры', () => {
    const button = document.querySelector('.icon-menu');
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    assert.ok(document.getElementById(button.getAttribute('aria-controls')));
  });

  test('у поиска есть подпись', () => {
    const input = document.querySelector('#inp-search');
    assert.equal(document.querySelector(`label[for="${input.id}"]`).textContent.trim().length > 0, true);
  });

  test('отладочная обводка borderBlue не используется на сайте', () => {
    assert.equal(document.querySelector('.borderBlue'), null);
  });
});

describe('Verification form: ряд ячеек', () => {
  /** CSS живого примера со страницы verification-form. */
  const demoCss = async () => {
    const { default: pages } = await import(pathToFileURL(`${ROOT}/script/docs/components.js`).href);
    const html = pages['verification-form'].html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    return [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)]
      .map((m) => m[1])
      .join('\n');
  };

  // Тело правила ищется литералом: в шаблонной строке `\s` свернулся бы в «s».
  const FIELDS_RULE = /\.demo-vf-fields\s*\{([^}]*)\}/;
  const INPUT_RULE = /\.demo-vf-input\s*\{([^}]*)\}/;
  const CARD_RULE = /\.demo-vf\s*\{([^}]*)\}/;
  const STAGE_RULE = /\.demo-vf-stage\s*\{([^}]*)\}/;

  const body = (css, rule, name) => {
    const match = rule.exec(css);
    assert.ok(match, `нет правила ${name}`);
    return match[1];
  };

  test('ячейки не переносятся: nowrap и резиновая ширина вместо 60px', async () => {
    const css = await demoCss();
    const fields = body(css, FIELDS_RULE, '.demo-vf-fields');
    const input = body(css, INPUT_RULE, '.demo-vf-input');

    assert.match(fields, /display:\s*flex/, 'ряд ячеек не flex');
    assert.match(fields, /flex-wrap:\s*nowrap/, 'flex-wrap: wrap — ячейки переносятся на вторую строку');

    assert.match(input, /flex:\s*1\s+1\s+0/, 'ячейки должны делить ширину карточки, а не иметь фиксированную');
    assert.match(input, /min-width:\s*0/, 'без min-width: 0 flex-элемент не сожмётся ниже содержимого');
    assert.equal(/(?:^|[;\s])width:\s*\d+px/.test(input), false, 'фиксированная ширина ячейки ломает адаптив');
    assert.equal(/(?:^|[;\s])height:\s*\d+px/.test(input), false, 'фиксированная высота ячейки ломает адаптив');
  });

  test('четыре ячейки помещаются в карточку на любой ширине', async () => {
    const css = await demoCss();
    const fields = body(css, FIELDS_RULE, '.demo-vf-fields');
    const card = body(css, CARD_RULE, '.demo-vf');
    const stage = body(css, STAGE_RULE, '.demo-vf-stage');

    const gap = Number(/gap:\s*(\d+)px/.exec(fields)[1]);
    const cardMax = Number(/max-width:\s*(\d+)px/.exec(card)[1]);
    const stagePad = Number(/padding:\s*[\d.]+px\s+([\d.]+)px/.exec(stage)[1]);
    const [padMin, , padMax] = /padding:[^;]*clamp\(([^)]*)\)/
      .exec(card)[1]
      .split(',')
      .map((value) => parseFloat(value));

    for (const viewport of [280, 320, 375, 480, 600, 1200]) {
      const cardWidth = Math.min(viewport - stagePad * 2, cardMax);
      const pad = Math.min(Math.max(viewport * 0.07, padMin), padMax);
      const content = cardWidth - pad * 2;
      const cell = (content - gap * 3) / 4;

      assert.ok(cell >= 40, `на ${viewport}px ячейка сжалась до ${cell.toFixed(1)}px`);
    }

    // Историческая причина бага: 4*60 + 3*10 = 270px против 323 - 38*2 = 247px контента.
    assert.ok(270 > 323 - 38 * 2, 'исходные фиксированные размеры не влезают в карточку — перенос неизбежен');
  });
});
