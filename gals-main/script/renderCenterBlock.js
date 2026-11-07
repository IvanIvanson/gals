import introduction from './introduction.js';
import download from './download.js';
import contents from './contents.js';
import copyBlock from './copyBlock.js';
import onThisPage from './onThisPage.js';
import { docPages } from './docs/index.js';
import { slug } from './docs/page.js';

/**
 * Ключи вида show* совпадают со значениями data-action в блоке
 * «Getting started»; остальные страницы реестра находятся по slug
 * из текста пункта меню (см. docs/index.js).
 */
const pages = {
  showIntroduction: introduction,
  showDownload: download,
  showContents: contents,
  ...docPages,
};

const DEFAULT_PAGE = 'showIntroduction';

const renderCenterBlock = function () {
  const containerCenter = document.querySelector('.container-center');
  const containerRight = document.querySelector('.container-right');
  const sidebar = document.querySelector('.container-left');
  const headerMenu = document.querySelector('.menu-ul');

  if (!containerCenter || !containerRight || !sidebar) {
    return null;
  }

  const show = (page, { focus = false, updateTitle = false } = {}) => {
    containerCenter.innerHTML = page.html;
    containerRight.innerHTML = onThisPage(page.sections);
    copyBlock(containerCenter);

    // gals.js слушает это событие: после замены разметки нужно заново
    // измерить img.container-fluid, иначе примеры вроде Images остаются
    // нерастянутыми до следующего resize. Event берём из окна документа:
    // в jsdom/Node глобальный Event — другой конструктор.
    const EventCtor = document.defaultView?.Event || Event;
    document.dispatchEvent(new EventCtor('gals:refresh'));

    if (updateTitle) {
      const heading = containerCenter.querySelector('h1');
      document.title = heading
        ? `${heading.textContent.trim()} — GALS`
        : 'GALS documentation';

      // SPA-переход должен менять и заголовок, и точку фокуса: иначе
      // скринридер остаётся на пункте меню, а вкладка браузера — на старом title.
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }

      // window.scrollTo в jsdom не реализован; прямое присваивание работает
      // и в браузере, и в тестах.
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Пункт без страницы игнорируется, а не роняет обработчик.
  const open = (key, options = {}) => {
    const page = Object.prototype.hasOwnProperty.call(pages, key) ? pages[key] : null;

    if (page) {
      show(page, options);
    }
  };

  // Один делегирующий слушатель на весь сайдбар.
  sidebar.addEventListener('click', (event) => {
    const item = event.target.closest('.menu-item');

    if (!item) {
      return;
    }

    sidebar.querySelectorAll('.menu-item[aria-current]').forEach((other) => {
      other.removeAttribute('aria-current');
    });
    item.setAttribute('aria-current', 'page');

    open(item.dataset.action || slug(item.textContent), {
      focus: true,
      updateTitle: true,
    });
  });

  // Вкладки шапки переключают тот же центр, что и левый сайдбар.
  if (headerMenu) {
    headerMenu.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-action]');

      if (!link || !headerMenu.contains(link)) {
        return;
      }

      event.preventDefault();

      headerMenu.querySelectorAll('a').forEach((other) => {
        other.classList.toggle('active', other === link);
        other.removeAttribute('aria-current');
      });
      link.setAttribute('aria-current', 'page');

      open(link.dataset.action, { focus: true, updateTitle: true });

      // На телефоне навигация — выезжающий оверлей: после выбора
      // вкладки его надо закрыть, иначе он остаётся поверх контента.
      headerMenu.closest('.menu')?.classList.remove('menu-show');
      document.querySelector('.icon-menu')?.setAttribute('aria-expanded', 'false');
    });
  }

  show(pages[DEFAULT_PAGE]);

  // Начальное состояние: Introduction — текущая страница.
  const current = sidebar.querySelector('[data-action="showIntroduction"]');
  if (current) {
    current.setAttribute('aria-current', 'page');
    current.classList.add('active-list');
  }

  // Наружу отдаём реестр и открытие страницы — ими пользуется поиск.
  return { pages, open };
};

export default renderCenterBlock;