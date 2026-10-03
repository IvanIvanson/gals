/**
 * Поиск по страницам документации.
 *
 * Индекс строится из того же реестра страниц, что рендерит центр
 * (см. renderCenterBlock.js), поэтому список результатов не разъедется
 * с левым меню. Результаты показываются выпадающим списком под полем
 * поиска; выбор строки открывает страницу.
 */
const MAX_RESULTS = 8;
const SNIPPET_PAD = 40;

const normalize = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const collapse = (value) => value.replace(/\s+/g, ' ').trim();

/** Заголовок и текст страницы: h1 для подписи, остальное — для совпадений. */
const buildIndex = (pages) =>
  Object.entries(pages)
    .filter(([, page]) => page && page.html)
    .map(([key, page]) => {
      const holder = document.createElement('div');
      holder.innerHTML = page.html;

      const title = collapse(holder.querySelector('h1')?.textContent || key);
      const text = collapse(holder.textContent);

      return { key, title, text, search: normalize(`${title} ${text}`) };
    });

/** Сначала совпадения в заголовке, потом в тексте; внутри группы — по алфавиту. */
const find = (index, query) =>
  index
    .map((page) => {
      const titleHit = normalize(page.title).includes(query);

      if (!titleHit && !page.search.includes(query)) {
        return null;
      }

      return { ...page, titleHit };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.titleHit) - Number(a.titleHit) || a.title.localeCompare(b.title))
    .slice(0, MAX_RESULTS);

/** Кусок текста вокруг совпадения, разбитый на до/совпадение/после. */
const makeSnippet = (text, query) => {
  const at = text.toLowerCase().indexOf(query);

  if (at < 0) {
    return { before: text.slice(0, 120) + (text.length > 120 ? '…' : ''), match: '', after: '' };
  }

  const start = Math.max(0, at - SNIPPET_PAD);
  const end = Math.min(text.length, at + query.length + SNIPPET_PAD);

  return {
    before: (start > 0 ? '…' : '') + text.slice(start, at),
    match: text.slice(at, at + query.length),
    after: text.slice(at + query.length, end) + (end < text.length ? '…' : ''),
  };
};

const searchDocs = function ({ pages, open } = {}) {
  const input = document.querySelector('#inp-search');
  const left = input?.closest('.left');

  if (!input || !left || typeof open !== 'function' || !pages) {
    return;
  }

  const index = buildIndex(pages);

  const results = document.createElement('div');
  results.className = 'search-results';
  results.id = 'search-results';
  results.setAttribute('role', 'listbox');
  results.hidden = true;
  left.appendChild(results);

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', results.id);
  input.setAttribute('aria-autocomplete', 'list');

  // Текущие опции: нужны для подсветки и клавиатуры.
  let options = [];
  let active = -1;

  const close = () => {
    results.hidden = true;
    results.replaceChildren();
    options = [];
    active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  };

  const activate = (next) => {
    if (!options.length) {
      return;
    }

    active = (next + options.length) % options.length;

    options.forEach((option, i) => {
      option.el.classList.toggle('is-active', i === active);
    });

    input.setAttribute('aria-activedescendant', options[active].el.id);

    // В браузере метод есть; гард нужен средам без layout (jsdom, тесты).
    options[active].el.scrollIntoView?.({ block: 'nearest' });
  };

  const choose = (option) => {
    open(option.key);
    input.value = '';
    close();
    input.blur();
    window.scrollTo(0, 0);
  };

  const render = (query) => {
    results.replaceChildren();
    options = [];
    active = -1;

    const matches = find(index, query);

    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'No matches';
      results.appendChild(empty);
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      return;
    }

    matches.forEach((page, i) => {
      const option = document.createElement('div');
      option.className = 'search-result';
      option.id = `search-result-${i}`;
      option.setAttribute('role', 'option');

      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = page.title;

      const snippet = document.createElement('span');
      snippet.className = 'search-result-snippet';

      const part = makeSnippet(page.text, query);
      snippet.append(part.before);

      if (part.match) {
        const mark = document.createElement('mark');
        mark.textContent = part.match;
        snippet.append(mark);
      }

      snippet.append(part.after);
      option.append(title, snippet);

      option.addEventListener('click', () => choose({ key: page.key }));

      results.appendChild(option);
      options.push({ el: option, key: page.key });
    });

    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('input', () => {
    const query = normalize(input.value);

    if (!query) {
      close();
      return;
    }

    render(query);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      return;
    }

    if (results.hidden) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activate(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activate(active - 1);
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      choose(options[active]);
    }
  });

  // mousedown с preventDefault не даёт полю потерять фокус раньше клика,
  // иначе список успевает спрятаться и выбор не срабатывает.
  results.addEventListener('mousedown', (event) => event.preventDefault());

  document.addEventListener('click', (event) => {
    if (!left.contains(event.target)) {
      close();
    }
  });
};

export default searchDocs;
