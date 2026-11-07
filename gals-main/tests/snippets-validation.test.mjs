import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MODULES = [
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

// Классы, которые GALS НЕ имеет — те же, что в llms.test.mjs.
// Сниппеты документации не должны их использовать.
const FORBIDDEN = [
  /\.col-[a-z]*-?\d/,
  /\bmb-\d/,
  /\bmt-\d/,
  /\bpx-\d/,
  /\bpy-\d/,
];

function hasForbiddenClass(code) {
  const doc = new JSDOM(code).window.document;

  for (const el of doc.querySelectorAll('*')) {
    const classes = (el.getAttribute('class') || '').split(/\s+/);
    for (const cls of classes) {
      for (const re of FORBIDDEN) {
        if (re.test(cls)) return `${cls} (${re})`;
      }
    }
  }
  return null;
}

// HTML-пустые элементы не требуют закрывающего тега.
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/** Возвращает список проблем вложенности: незакрытые и перекрёстные теги. */
function tagProblems(code) {
  // Комментарии и содержимое <script>/<style> могут содержать символ «<».
  const source = code
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '<$1></$1>');

  const stack = [];
  const problems = [];

  for (const m of source.matchAll(/<(\/?)([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g)) {
    const [, closing, name, attrs, selfClosed] = m;
    const tag = name.toLowerCase();

    if (VOID.has(tag) || selfClosed) continue;

    if (closing) {
      const opened = stack.pop();
      if (opened !== tag) problems.push(`</${tag}> закрывает <${opened ?? ''}>`);
    } else {
      stack.push(tag);
    }
  }

  for (const tag of stack) problems.push(`<${tag}> не закрыт`);
  return problems;
}

// textContent декодирует и &lt;, и &#60;, поэтому по скобкам разметку не отличить.
// Надёжный признак: пример разметки начинается с тега, а промпт — с текста.
function isHtmlSnippet(code) {
  return /^<[/!a-z]/i.test(code.trim());
}

describe('Валидация HTML-сниппетов документации GALS', () => {
  test('сниппеты не содержат классов, которых нет в GALS', async () => {
    const { dom, document } = await boot();

    const center = document.querySelector('.container-center');
    const items = [...document.querySelectorAll('.menu-item')];
    let checked = 0;

    for (const item of items) {
      click(dom, item);
      await new Promise((r) => setTimeout(r, 0));

      const page = item.textContent.trim();

      for (const pre of center.querySelectorAll('.copy-block pre')) {
        const code = pre.textContent;
        assert.ok(code.trim().length > 0, `пустой сниппет на странице «${page}»`);

        const forbidden = hasForbiddenClass(code);
        assert.equal(forbidden, null, `«${page}»: выдуманный класс ${forbidden}`);
        checked += 1;
      }
    }

    assert.ok(checked > 20, `проверено слишком мало сниппетов: ${checked}`);
  });

  test('сниппеты содержат только сбалансированные теги', async () => {
    const { dom, document } = await boot();

    const center = document.querySelector('.container-center');
    const items = [...document.querySelectorAll('.menu-item')];
    let checked = 0;

    for (const item of items) {
      click(dom, item);
      await new Promise((r) => setTimeout(r, 0));

      const page = item.textContent.trim();

      for (const pre of center.querySelectorAll('.copy-block pre')) {
        const code = pre.textContent;
        if (!isHtmlSnippet(code)) continue; // текст/промпт — не HTML

        checked += 1;
        const problems = tagProblems(code);
        assert.deepEqual(problems, [], `«${page}»: ${problems.join('; ')}`);
      }
    }

    assert.ok(checked > 20, `проверено слишком мало фрагментов разметки: ${checked}`);
  });
});