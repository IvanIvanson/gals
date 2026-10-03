import introdaction from './introdaction.js';
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
  showIntrodaction: introdaction,
  showDownload: download,
  showContents: contents,
  ...docPages,
};

const DEFAULT_PAGE = 'showIntrodaction';

const renderCenterBlock = function () {
  const containerCenter = document.querySelector('.container-center');
  const containerRight = document.querySelector('.container-right');
  const sidebar = document.querySelector('.container-left');
  const headerMenu = document.querySelector('.menu-ul');

  if (!containerCenter || !containerRight || !sidebar) {
    return null;
  }

  const show = (page) => {
    containerCenter.innerHTML = page.html;
    containerRight.innerHTML = onThisPage(page.sections);
    copyBlock(containerCenter);
  };

  // Пункт без страницы игнорируется, а не роняет обработчик.
  const open = (key) => {
    const page = Object.prototype.hasOwnProperty.call(pages, key) ? pages[key] : null;

    if (page) {
      show(page);
    }
  };

  // Один делегирующий слушатель на весь сайдбар.
  sidebar.addEventListener('click', (event) => {
    const item = event.target.closest('.menu-item');

    if (!item) {
      return;
    }

    open(item.dataset.action || slug(item.textContent));
  });

  // Вкладки шапки переключают тот же центр, что и левый сайдбар.
  if (headerMenu) {
    headerMenu.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-action]');

      if (!link || !headerMenu.contains(link)) {
        return;
      }

      event.preventDefault();

      headerMenu
        .querySelectorAll('a')
        .forEach((other) => other.classList.toggle('active', other === link));

      open(link.dataset.action);
      window.scrollTo(0, 0);

      // На телефоне навигация — выезжающий оверлей: после выбора
      // вкладки его надо закрыть, иначе он остаётся поверх контента.
      headerMenu.closest('.menu')?.classList.remove('menu-show');
      document.querySelector('.icon-menu')?.setAttribute('aria-expanded', 'false');
    });
  }

  show(pages[DEFAULT_PAGE]);

  // Наружу отдаём реестр и открытие страницы — ими пользуется поиск.
  return { pages, open };
};

export default renderCenterBlock;