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

    for (const item of document.querySelectorAll('#introdaction .menu-item')) {
      assert.doesNotThrow(() => click(dom, item), `action=${item.dataset.action}`);
    }
  });

  test('каждый пункт рендерит свой контент', async () => {
    const { dom, document } = await boot();
    const center = document.querySelector('.container-center');
    const seen = new Set();

    for (const item of document.querySelectorAll('#introdaction .menu-item')) {
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
    // 3 клика на сайдбар/версии + 3 кнопки копирования на страницу по умолчанию
    assert.ok(counts.get('click') <= 8, `слишком много слушателей: ${counts.get('click')}`);
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

    assert.equal(items.length, 45, `ожидалось 45 пунктов, найдено ${items.length}`);

    for (const item of items) {
      const key = item.dataset.action || slug(item.textContent);
      const covered = key.startsWith('show') || Object.hasOwn(docPages, key);

      assert.ok(covered, `нет страницы для «${item.textContent.trim()}» (key=${key})`);
    }
  });

  test('ключи реестра уникальны и не пересекаются с data-action', async () => {
    const { docPages } = await loadRegistry();

    // 45 пунктов меню минус 3 страницы Getting started с data-action
    assert.equal(Object.keys(docPages).length, 42, 'часть страниц потерялась при слиянии');

    for (const reserved of ['showIntrodaction', 'showDownload', 'showContents']) {
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
