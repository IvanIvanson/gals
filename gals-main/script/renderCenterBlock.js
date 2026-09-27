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

  if (!containerCenter || !containerRight || !sidebar) {
    return;
  }

  const show = (page) => {
    containerCenter.innerHTML = page.html;
    containerRight.innerHTML = onThisPage(page.sections);
    copyBlock(containerCenter);
  };

  // Один делегирующий слушатель на весь сайдбар: пункт без страницы
  // игнорируется, а не роняет обработчик.
  sidebar.addEventListener('click', (event) => {
    const item = event.target.closest('.menu-item');

    if (!item) {
      return;
    }

    const key = item.dataset.action || slug(item.textContent);
    const page = Object.prototype.hasOwnProperty.call(pages, key) ? pages[key] : null;

    if (page) {
      show(page);
    }
  });

  show(pages[DEFAULT_PAGE]);
};

export default renderCenterBlock;