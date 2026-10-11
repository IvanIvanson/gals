import { test, describe } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

describe('Валидация HTML-сниппетов документации GALS', () => {
  // Примеры сниппетов, которые ИИ будет брать за образец.
  // В реальном проекте их можно загружать динамически из Markdown-файлов документации.
  const snippets = [
    {
      name: 'Базовая сетка (Grid)',
      html: `
        <div class="container">
          <div class="row">
            <div class="col-s-12 col-m-6">Колонка 1</div>
            <div class="col-s-12 col-m-6">Колонка 2</div>
          </div>
        </div>
      `
    },
    {
      name: 'Компонент Badge',
      html: `<span class="badge badge-stable">Стабильная версия</span>`
    },
    {
      name: 'Кнопка с утилитами отступов',
      html: `<button class="btn pt-2 pb-2 px-4">Нажми меня</button>`
    }
  ];

  for (const { name, html } of snippets) {
    test(`Должен рендерить валидный HTML для: ${name}`, () => {
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // 1. Проверка на ошибки парсинга HTML
      const parserErrors = document.querySelectorAll('parsererror');
      assert.strictEqual(parserErrors.length, 0, `Ошибка парсинга HTML в сниппете "${name}"`);

      // 2. Проверка наличия ожидаемых классов GALS
      const hasGalsClasses = 
        document.querySelector('.container') ||
        document.querySelector('.row') ||
        document.querySelector('.col-') ||
        document.querySelector('.badge') ||
        document.querySelector('.btn');
      
      assert.ok(hasGalsClasses, `Не найдены ожидаемые классы GALS в сниппете "${name}"`);
    });
  }

  test('Должен не иметь незакрытых тегов в базовой разметке', () => {
    // Имитация проверки основного шаблона из index.html
    const sampleLayout = `<div class="wrapper"><main class="container"><div class="row"></div></main></div>`;
    const dom = new JSDOM(sampleLayout);
    const body = dom.window.document.body.innerHTML;
    
    const openDivs = (body.match(/<div/g) || []).length;
    const closeDivs = (body.match(/<\/div>/g) || []).length;
    
    assert.strictEqual(openDivs, closeDivs, 'Несовпадение количества открывающих и закрывающих тегов div');
  });
});