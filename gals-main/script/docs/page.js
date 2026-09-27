import onThisPage from '../onThisPage.js';

/**
 * Каркас страниц документации.
 *
 * Разделов в меню сорок, поэтому страницы собираются из маленьких кусков:
 * так разметка «On this page», заголовки секций и кнопки копирования
 * не разъезжаются между файлами.
 */

const COPY_BUTTON = `
    <button class="copy" type="button" data-tooltip="Copy to clipboard" aria-label="Copy to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg></button>`;

const STATUSES = {
  stable: 'Stable',
  partial: 'Partial',
  planned: 'Planned',
  draft: 'Draft',
};

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Ключ страницы выводится из текста пункта меню, поэтому в index.html не нужно
 * держать сорок атрибутов data-action, которые рано или поздно разъедутся.
 */
export const slug = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Блок кода с кнопкой копирования. Отступы внутри срезаются dedent'ом. */
export const codeBlock = (source) => `
<div class="copy-block">
    <code><pre>${escape(source.trim())}</pre></code>${COPY_BUTTON}
</div>`;

/** Живой пример: то, что описано в коде, показывается тут же. */
export const demo = (markup, caption = '') => `
<div class="demo">
    <div class="demo-body">${markup}</div>${
      caption ? `\n    <p class="demo-caption">${caption}</p>` : ''
    }
</div>`;

/** Ячейка сетки для живого примера: колонка снаружи, окраска внутри. */
export const cell = (column, label) =>
  `<div class="container-block ${column}"><div class="demo-cell">${label}</div></div>`;

export const table = (head, rows) => `
<table class="doc-table">
    <thead><tr>${head.map((title) => `<th>${title}</th>`).join('')}</tr></thead>
    <tbody>${rows
      .map((row) => `\n    <tr>${row.map((value) => `<td>${value}</td>`).join('')}</tr>`)
      .join('')}
    </tr></tbody>
</table>`;

export const notice = (title, text) => `
<div class="notice">
    <strong>${title}</strong>
    <p>${text}</p>
</div>`;

/**
 * @param {{title: string, lead: string, status?: string, blocks: {id: string, label: string, html: string}[]}} config
 * @returns {{sections: {id: string, label: string}[], html: string}}
 */
export const page = ({ title, lead, status = 'stable', blocks }) => {
  const sections = blocks.map(({ id, label }) => ({ id, label }));

  const body = blocks
    .map((block) => `\n    <h3 id="${block.id}">${block.label}</h3>\n    ${block.html}`)
    .join('');

  const html = `
<div class="content-between align-center">
    <h1>${title}</h1>
    <span class="badge badge-${status}">${STATUSES[status]}</span>
</div>

<div><p>${lead}</p></div>
${onThisPage(sections)}
<div class="quick-start">${body}
</div>
`;

  return { sections, html };
};

/**
 * Страница того, чего в сборке ещё нет. Пишется честно: статус, чем закрыть
 * задачу сегодня и какой API предлагается.
 */
export const planned = ({ title, lead, missing, workaround, proposal }) =>
  page({
    title,
    lead,
    status: 'planned',
    blocks: [
      { id: 'status', label: 'Status', html: notice('Not in the 1.0 build', missing) },
      { id: 'workaround', label: 'Workaround today', html: workaround },
      { id: 'proposal', label: 'Proposed API', html: proposal },
    ],
  });
