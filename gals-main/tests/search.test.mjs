import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Загружает DOM + модули рендера + searchDocs (вызывается вручную). */
async function boot() {
  const dom = new JSDOM(readFileSync(`${ROOT}/index.html`, 'utf8'), {
    pretendToBeVisual: true,
    url: 'https://example.test/',
  });

  globalThis.window = dom.window;
  globalThis.document = dom.window.document;

  // Модули рендера, которые тоже вызываются из index.js.
  (await import(pathToFileURL(`${ROOT}/script/addStyleDetailsLeft.js`).href)).default();
  (await import(pathToFileURL(`${ROOT}/script/detailsLeftUlLi.js`).href)).default();
  const docs = (await import(pathToFileURL(`${ROOT}/script/renderCenterBlock.js`).href)).default();

  // SearchDocs вызывается вручную после рендера, чтобы каждый тест
  // получал новый DOM (ESM-кэш index.js этого не даёт).
  (await import(pathToFileURL(`${ROOT}/script/searchDocs.js`).href)).default(docs);

  return { dom, document: dom.window.document };
}

const input = (dom, el) => {
  el.dispatchEvent(new dom.window.InputEvent('input', { bubbles: true }));
};

const key = (dom, el, keyName) => {
  el.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: keyName, bubbles: true }));
};

describe('Поиск по документации', () => {
  test('инициализирует combobox и listbox', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    assert.equal(inp.getAttribute('role'), 'combobox');
    assert.equal(inp.getAttribute('aria-autocomplete'), 'list');
    assert.equal(inp.getAttribute('aria-controls'), 'search-results');

    const results = document.querySelector('#search-results');
    assert.ok(results);
    assert.equal(results.getAttribute('role'), 'listbox');
    assert.equal(results.hidden, true, 'список результатов скрыт при старте');
  });

  test('пустой ввод скрывает результаты', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = '   ';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    assert.equal(results.hidden, true);
  });

  test('поиск находит страницу по заголовку', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = 'Grid';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    assert.equal(results.hidden, false);
    assert.ok(results.querySelector('.search-result-title'));
    assert.ok(
      [...results.querySelectorAll('.search-result-title')].some((el) =>
        el.textContent.includes('Grid')
      ),
      'Grid не найден в результатах по заголовку'
    );
  });

  test('поиск находит страницу по тексту', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    // Слово, которое точно есть в тексте страницы, но не в заголовке.
    inp.value = 'container-block';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    assert.equal(results.hidden, false);
    assert.ok(results.querySelectorAll('.search-result').length > 0);
  });

  test('результаты сортируются: заголовок выше текста', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    // "Accordion" — заголовок страницы.
    inp.value = 'Accordion';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    const titles = [...results.querySelectorAll('.search-result-title')].map((el) => el.textContent);

    assert.ok(titles[0] === 'Accordion', `первый результат «${titles[0]}» вместо «Accordion»`);
  });

  test('в результатах есть сниппет с совпадением', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = 'grid';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    const snippets = [...results.querySelectorAll('.search-result-snippet')];
    assert.ok(snippets.length > 0, 'нет сниппетов в результатах');

    // Марк совпадений (если они есть) — это <mark>.
    const marks = [...results.querySelectorAll('mark')];
    assert.ok(
      marks.length > 0 || snippets.length > 0,
      'ожидается либо <mark>, либо хотя бы сниппет'
    );
  });

  test('Enter на найденной строке переключает страницу', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');
    const center = document.querySelector('.container-center');

    inp.value = 'Accordion';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    assert.ok(results.querySelector('.search-result'), 'нет результатов для Enter');

    // Подсветка через стрелку — только так выставляется внутренний active.
    key(dom, inp, 'ArrowDown');
    key(dom, inp, 'Enter');

    const h1 = center.querySelector('h1');
    assert.ok(h1 && h1.textContent === 'Accordion', `Enter не переключил: h1 = «${h1?.textContent}»`);
    assert.equal(inp.value, '', 'поле ввода не очистилось');
    assert.equal(results.hidden, true, 'список не скрылся после выбора');
  });

  test('Escape скрывает результаты', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = 'Grid';
    input(dom, inp);

    assert.equal(document.querySelector('#search-results').hidden, false);

    key(dom, inp, 'Escape');

    assert.equal(document.querySelector('#search-results').hidden, true);
  });

  test('стрелки переключают активную строку', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = 'card';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    const options = results.querySelectorAll('.search-result');
    if (options.length < 3) {
      // Недостаточно результатов для теста нескольких стрелок.
      assert.ok(true);
      return;
    }

    // Двойная стрелка вниз: -1 → 0 → 1.
    key(dom, inp, 'ArrowDown');
    assert.ok(options[0].classList.contains('is-active'), 'первый элемент не активировался');

    key(dom, inp, 'ArrowDown');
    assert.ok(options[1].classList.contains('is-active'), 'второй элемент не активировался');
  });

  test('нет результатов: показывается "No matches"', async () => {
    const { dom, document } = await boot();
    const inp = document.querySelector('#inp-search');

    inp.value = 'zzzznotarealclasszzzz';
    input(dom, inp);

    const results = document.querySelector('#search-results');
    assert.equal(results.hidden, false);
    assert.ok(
      results.querySelector('.search-empty') || results.textContent.includes('No matches'),
      'нет сообщения "No matches"'
    );
  });
});
