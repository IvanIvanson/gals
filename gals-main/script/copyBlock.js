const ALERT_TTL = 1200;

/**
 * Срезает общие отступы слева и пустые строки по краям,
 * иначе в буфер попадает разметка шаблона вместе с переносами.
 */
const dedent = (text) => {
  // Первый блок тоже чистим: между <code> и <pre> всегда оказывается
  // перенос строки с отступом, который `^\n+` бы пропустил.
  const lines = text.replace(/^\s+|\s+$/g, '').split('\n');
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(min)).join('\n');
};

/** Запасной путь для небезопасного контекста (file://) и старых браузеров. */
const copyByTextarea = (text) => {
  const area = document.createElement('textarea');
  area.className = 'textarea';
  area.setAttribute('readonly', '');
  area.value = text;
  document.body.appendChild(area);
  area.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (error) {
    ok = false;
  }

  area.remove();
  return ok;
};

const copy = async (text) => {
  // navigator.clipboard браузер показывает только в защищённом контексте,
  // поэтому отдельная проверка isSecureContext не нужна.
  if (window.navigator.clipboard) {
    try {
      // Голый navigator указывает на другой объект вне браузера (в Node есть
      // глобальный navigator без clipboard), поэтому обращаться нужно к окну.
      await window.navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      /* падаем в запасной путь */
    }
  }

  return document.execCommand ? copyByTextarea(text) : false;
};

const notify = (block, button, ok) => {
  block.querySelector('.copy-alert')?.remove();

  const alertBox = document.createElement('div');
  // copy-alert, а не alert: .alert теперь компонент фреймворка
  // со своей рамкой и отступами, попапу копирования они не нужны.
  alertBox.className = 'copy-alert';
  alertBox.setAttribute('role', 'status');
  alertBox.textContent = ok ? 'Copied!' : 'Copy failed';
  block.appendChild(alertBox);

  setTimeout(() => alertBox.remove(), ALERT_TTL);
  button.setAttribute('aria-label', ok ? 'Copied' : 'Copy failed');
};

/**
 * Навешивает копирование на все блоки `.copy-block` внутри `scope`.
 * Кнопка берётся из самого блока, поэтому больше не нужны id вида
 * `#code1` / `#copyBtn1` и ручная регистрация каждого блока.
 */
const copyBlock = (scope = document) => {
  scope.querySelectorAll('.copy-block').forEach((block) => {
    const code = block.querySelector('code');
    const button = block.querySelector('.copy');

    if (!code || !button) {
      return;
    }

    button.addEventListener('click', async () => {
      notify(block, button, await copy(dedent(code.textContent)));
    });
  });
};

export default copyBlock;