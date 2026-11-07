# 🤖 Спроси ИИ правильно (Шаблон промпта для GALS)

Скопируйте этот шаблон, вставьте его в ChatGPT, Claude, GitHub Copilot или Cursor, и замените текст в `[КВАДРАТНЫХ СКОБКАХ]` на вашу задачу.

---

**Промпт:**

Действуй как опытный frontend-разработчик, специализирующийся на фреймворке **GALS**.

**Задача:**
Создай [КОМПОНЕНТ / СТРАНИЦУ / МАКЕТ], который делает следующее: [ОПИШИТЕ ФУНКЦИОНАЛ, например: "адаптивную карточку товара с изображением, заголовком, ценой и кнопкой 'Купить'"].

**Жесткие ограничения и правила:**
1. **Фреймворк:** Используй ТОЛЬКО классы GALS. Не используй Bootstrap, Tailwind или другие библиотеки.
2. **Сетка:** Структура `.container` → `.container-block` с классом `pt-N`. В GALS нет `.row` и `.col`. Класс `pt-N` (1–12) задаёт ширину колонки в долях от 12, а не отступ.
3. **Box model:** GALS применяет `border-box` внутри `.container`. Дополнительно добавь глобальный reset: `*, *::before, *::after { box-sizing: border-box; }`. Для flex-колонок с длинным содержимым ставь `min-width: 0`.
4. **Адаптивность:** Брейкпоинты GALS: `xl` (≥1440px), `l` (≤1439.98px), `m` (≤1025px), `s` (≤770px), `xs` (≤425px), `xxs` (≤375px). Пример: `class="pt-6 pt-s12"` — 50% на десктопе, 100% на планшете. Скрыть элемент: `pt-{bp}-d_n`.
5. **Отступы:** В GALS нет утилит отступов, кроме `.padding-lg`. `pt-3` — это колонка шириной 3/12, а не padding-top. Классов `mb-*`, `mt-*`, `px-*` не существует.
6. **Стили:** Если нужны кастомные стили, используй CSS-переменные GALS: `var(--accent)`, `var(--ink)`, `var(--paper)`, `var(--ok)`, `var(--warn)`, `var(--err)`, `var(--line)`, `var(--gridmultiplyConst)`.
7. **Компоненты:** header, table, btn, alert, card, accordion, carousel, dropdown, modal, menu, tabs, pagination, popover, progress, loader, skeleton, icon, media, input, select, range, checkbox, radio, switch. Если класса нет в этом списке — не выдумывай его, напиши plain CSS. Для работоспособности: dropdown — `popovertarget` + `popover` + доступное позиционирование и стрелки; modal — `dialog.showModal()`; tabs — порядок input/label/panel; menu — `.icon-menu` + `.menu.menu-collapse` с `aria-controls`/`aria-expanded`.
8. **Вывод:** Предоставь ТОЛЬКО валидный HTML-код. Включи `<link rel="stylesheet" href="gals/gals.css">` в `<head>` и `<script src="gals/gals.js" defer></script>` перед `</body>`. Убедись, что все теги закрыты и использованы атрибуты доступности (ARIA).

**Контекст:**
[НЕОБЯЗАТЕЛЬНО: Добавьте сюда специфические требования, например: "Используй .alert-ok для сообщения об успехе и .btn-primary для основной кнопки"].
