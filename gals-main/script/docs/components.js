import { page, codeBlock, demo, table } from './page.js';

/**
 * Раздел «Components»: каждый компонент — реальные классы из gals.css
 * (и, для аккордеона и scrollspy, поведение из gals.js).
 */

/* ============================================================
 *  Runtime-хелперы
 * ============================================================ */

/**
 * Пара On/Off: нажатой остаётся одна кнопка, вторая сбрасывается.
 * <script> внутри innerHTML браузером не исполняется, поэтому
 * обработчик вызывается из inline-атрибута.
 */
const toggleMorphPair = (btn) => {
  const box = btn.closest('.demo-mp-box');
  if (!box) return;

  const pressed = !btn.classList.contains('is-pressed');

  box.querySelectorAll('.demo-mp-btn').forEach((other) => {
    const on = other === btn && pressed;
    other.classList.toggle('is-pressed', on);
    other.setAttribute('aria-pressed', String(on));
  });
};

/* ---------- Пагинация (иконки) ---------- */

/**
 * Перекрашивает страницы и подсвечивает текущую.
 * Индекс зажимается краями — за пределы списка выйти нельзя.
 */
const paintPagination = (root, index) => {
  const pages = [...root.querySelectorAll('.demo-pgi-num')];
  if (!pages.length) return;

  const current = Math.min(Math.max(index, 0), pages.length - 1);

  pages.forEach((page, i) => {
    const on = i === current;
    page.classList.toggle('is-active', on);
    if (on) page.setAttribute('aria-current', 'page');
    else page.removeAttribute('aria-current');
  });

  const status = root.querySelector('.demo-pgi-status');
  if (status) status.textContent = `Page ${current + 1} of ${pages.length}`;

  root.querySelectorAll('[data-pgi-step]').forEach((nav) => {
    const target = current + Number(nav.dataset.pgiStep);
    nav.disabled = target < 0 || target >= pages.length;
  });
};

const shiftPagination = (btn, step) => {
  const root = btn.closest('.demo-pgi');
  if (!root) return;

  const pages = [...root.querySelectorAll('.demo-pgi-num')];
  const current = pages.findIndex((page) => page.classList.contains('is-active'));
  paintPagination(root, (current < 0 ? 0 : current) + Number(step));
};

const selectPagination = (btn) => {
  const root = btn.closest('.demo-pgi');
  if (!root) return;

  const pages = [...root.querySelectorAll('.demo-pgi-num')];
  paintPagination(root, pages.indexOf(btn));
};

/* ---------- Post & Search ---------- */

const addPost = (root) => {
  const input = root.querySelector('.demo-ps-input');
  const list = root.querySelector('.demo-ps-list');
  if (!input || !list) return;

  const text = input.value.trim();
  if (!text) return;

  const post = document.createElement('div');
  post.className = 'demo-ps-post';
  post.textContent = text;
  list.prepend(post);

  input.value = '';
  // Пере-фильтруем: новый пост может не соответствовать активному поиску.
  searchPosts(root);
  input.focus();
};

const searchPosts = (root) => {
  const field = root.querySelector('input.demo-ps-search-input');
  const raw = field ? field.value.trim() : '';
  const needle = raw.toLowerCase();
  const posts = root.querySelectorAll('.demo-ps-post');
  let visible = 0;

  posts.forEach((post) => {
    const match = !needle || post.textContent.toLowerCase().includes(needle);
    post.classList.toggle('demo-ps-hidden', !match);
    if (match) visible += 1;
  });

  const status = root.querySelector('.demo-ps-status');
  if (!status) return;

  if (!needle) {
    status.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  } else {
    status.textContent =
      `${visible} of ${posts.length} ${posts.length === 1 ? 'post' : 'posts'} match “${raw}”`;
  }
};

/* ---------- Поле верификации ---------- */

const codeFields = (input) => {
  const root = input.closest('.demo-vf');
  return root ? [...root.querySelectorAll('.demo-vf-input')] : [];
};

/**
 * Подсветка заполненных полей пересчитывается целиком.
 * Точечный toggle leave разъезжается: вставка, автоподстановка кода из SMS
 * и Backspace меняют по несколько полей за раз.
 */
const paintCode = (input) => {
  const root = input.closest('.demo-vf');
  if (!root) return;

  root.querySelectorAll('.demo-vf-input').forEach((field) => {
    field.classList.toggle('is-filled', field.value !== '');
  });
};

const handleCodeInput = (input) => {
  const fields = codeFields(input);
  const index = fields.indexOf(input);
  if (index < 0) return;

  // maxlength="1" не спасает от автоподстановки кода из SMS — цифр может
  // прийти сразу несколько, раздаём их по следующим полям.
  const digits = input.value.replace(/\D/g, '');
  input.value = digits.slice(0, 1);

  let cursor = index;
  for (let i = 1; i < digits.length && cursor + 1 < fields.length; i += 1) {
    cursor += 1;
    fields[cursor].value = digits.charAt(i);
  }

  paintCode(input);

  if (input.value && cursor + 1 < fields.length) fields[cursor + 1].focus();
};

const handleCodeKeydown = (input, event) => {
  const fields = codeFields(input);
  const index = fields.indexOf(input);
  if (index < 0) return;

  const last = fields.length - 1;

  if (event.key === 'Backspace' && input.value === '' && index > 0) {
    fields[index - 1].focus();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    fields[index - 1].focus();
  } else if (event.key === 'ArrowRight' && index < last) {
    fields[index + 1].focus();
  }
};

const handleCodePaste = (input, event) => {
  const fields = codeFields(input);
  const index = fields.indexOf(input);
  if (index < 0) return;

  const digits = event.clipboardData.getData('text').replace(/\D/g, '');
  if (!digits) return;

  event.preventDefault();

  // Вставка идёт от активного поля, а не всегда с первого.
  fields.forEach((field, i) => {
    if (i < index) return;
    field.value = digits.charAt(i - index) || '';
  });

  paintCode(input);

  const empty = fields.slice(index).find((field) => field.value === '');
  (empty || fields[fields.length - 1]).focus();
};

const confirmCode = (form) => {
  const root = form.closest('.demo-vf');
  if (!root) return false;

  const fields = [...root.querySelectorAll('.demo-vf-input')];
  const status = root.querySelector('.demo-vf-status');
  const hidden = root.querySelector('.demo-vf-code');
  const code = fields.map((field) => field.value).join('');

  if (hidden) hidden.value = code;

  if (code.length !== fields.length) {
    status.className = 'demo-vf-status is-err';
    status.textContent = 'Enter all four digits.';
    const empty = fields.find((field) => field.value === '');
    if (empty) empty.focus();
    return false;
  }

  status.className = 'demo-vf-status is-ok';
  status.textContent = 'Code ' + code + ' confirmed.';
  return false;
};

window.__galsComponents = {
  toggleMorphPair,
  shiftPagination,
  selectPagination,
  addPost,
  searchPosts,
  handleCodeInput,
  handleCodeKeydown,
  handleCodePaste,
  confirmCode,
};
const DEF = [
  {
    slug: 'accordion',
    title: 'Accordion',
    lead:
      'Stacked sections that expand in place. Built on details/summary: open state, keyboard and screen reader support come from the browser.',
    markup: `<div class="accordion-group">
  <details class="accordion">
    <summary>What is the default gutter?</summary>
    <div class="accordion-body">5px on the container, 5px on each block.</div>
  </details>
  <details class="accordion">
    <summary>Can I change it?</summary>
    <div class="accordion-body">Yes — padding on .container and .container-block is yours.</div>
  </details>
</div>`,
    demo: `<div class="accordion-group">
  <details class="accordion">
    <summary>What is the default gutter?</summary>
    <div class="accordion-body">5px on the container, 5px on each block.</div>
  </details>
  <details class="accordion">
    <summary>Can I change it?</summary>
    <div class="accordion-body">Yes — the padding on <code>.container</code> and <code>.container-block</code> is yours to override.</div>
  </details>
  <details class="accordion">
    <summary>Why details and not divs?</summary>
    <div class="accordion-body">Open state, keyboard support and the screen reader announcement are free. Rebuilding them is the classic source of bugs.</div>
  </details>
</div>`,
    caption: 'Inside .accordion-group, opening one closes the others (gals.js, one delegated listener).',
    notes: [
      'Content inside a closed <code>&lt;details&gt;</code> is not searchable in the browser find bar — never hide a fact there.',
      'Without <code>.accordion-group</code> every section opens independently — the wrapper is opt-in.',
    ],
  },
  {
    slug: 'alert',
    title: 'Alert',
    lead: 'A message in the flow of the page, in four semantic colours from the tokens.',
    markup: `<p class="alert alert-ok" role="status">Saved.</p>
<p class="alert alert-warn" role="status">The draft is unsaved.</p>
<p class="alert alert-error" role="alert">
  Could not save — check your connection and retry.
</p>`,
    demo: `<p class="alert alert-info">Heads up: this is <code>alert-info</code>, the accent colour.</p>
<p class="alert alert-ok" role="status">Saved.</p>
<p class="alert alert-warn" role="status">The draft is unsaved.</p>
<p class="alert alert-error" role="alert">Could not save — check your connection and retry.</p>`,
    notes: [
      '<code>role="alert"</code> interrupts the screen reader. Four of those on one page is noise, and the one that matters gets lost.',
      'Ordinary, user-initiated feedback takes <code>role="status"</code>, which waits for a pause.',
      'The colour comes from the <code>--ok</code>, <code>--warn</code>, <code>--err</code> and <code>--accent</code> tokens.',
    ],
  },
  {
    slug: 'buttons',
    title: 'Buttons',
    lead: 'Two weights and one rule about which element to use.',
    markup: `<button class="btn" type="button">Cancel</button>
<button class="btn btn-primary" type="button">Save draft</button>
<a class="btn" href="/docs">Read the docs</a>
<button class="btn" type="button" disabled>Unavailable</button>`,
    demo: `<button class="btn" type="button">Cancel</button>
&nbsp;<button class="btn btn-primary" type="button">Save draft</button>
&nbsp;<a class="btn" href="#usage">Read the docs</a>
&nbsp;<button class="btn" type="button" disabled>Unavailable</button>`,
    notes: [
      'Label the action, never the mechanic: “Save draft”, not “Click here”.',
      'Keep 44px of hit height on touch — widen with padding, not by scaling the label.',
      'A disabled button must be genuinely unreachable, not greyed out and silent.',
    ],
  },
  {
    slug: 'card',
    title: 'Card',
    lead: 'Media, body and actions for one item of content, in a box that stretches with its column.',
    markup: `<div class="container">
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Title</h3>
      <p class="card-body">Supporting copy.</p>
      <div class="card-footer"><a class="btn" href="#">Open</a></div>
    </article>
  </div>
</div>`,
    demo: `<div class="container">
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Grid</h3>
      <p class="card-body">Twelve columns, six breakpoints, one constant.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Runtime</h3>
      <p class="card-body">One file, no exports, no dependencies.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
  <div class="container-block pt-4 pt-m6 pt-xs12">
    <article class="card">
      <h3 class="card-title">Docs</h3>
      <p class="card-body">Every page carries a status badge, and the badge is honest.</p>
      <div class="card-footer"><a class="btn" href="#usage">Open</a></div>
    </article>
  </div>
</div>`,
    caption: '.card-footer sits at the bottom of every card, whatever the body length.',
    notes: [
      'Do not wrap the whole card in a link if it contains links — nested targets are ambiguous to a keyboard.',
      'The title is a heading in document order whatever the design says about its size.',
      'Equal heights are the grid, not the card: the container stretches its blocks.',
    ],
  },
  {
    slug: 'carousel',
    title: 'Carousel',
    lead: 'A slide ring with native touch physics and no JavaScript: scroll snap does the whole job.',
    markup: `<div class="carousel">
  <div class="carousel-slide"><img src="1.svg" alt=""></div>
  <div class="carousel-slide"><img src="2.svg" alt=""></div>
  <div class="carousel-slide"><img src="3.svg" alt=""></div>
</div>`,
    demo: `<div class="carousel">
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 1</div></div>
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 2</div></div>
  <div class="carousel-slide"><div class="demo-cell" style="height:120px">Slide 3</div></div>
</div>`,
    caption: 'Drag, swipe or scroll — the track snaps each slide to the centre.',
    notes: [
      'If the content matters it does not belong here — slide two and beyond are almost never seen.',
      'Slides are 80% of the track; override flex-basis for wider or full-bleed slides.',
      'Autoplay, if you must add it yourself, must pause on hover, on focus and under prefers-reduced-motion.',
    ],
  },
  {
    slug: 'dropdowns',
    title: 'Dropdowns',
    lead: 'A command menu on a button. Not a form control — that job is a select.',
    markup: `<button popovertarget="dd">Options</button>
<div id="dd" popover class="dropdown">
  <button type="button">Rename</button>
  <button type="button">Duplicate</button>
  <button type="button">Delete</button>
</div>`,
    demo: `<button class="btn" popovertarget="demo-dd">Options</button>
<div id="demo-dd" popover class="dropdown">
  <button type="button">Rename</button>
  <button type="button">Duplicate</button>
  <button type="button">Delete</button>
</div>`,
    caption: 'The Popover API: top layer, light dismiss and Escape, with zero script.',
    notes: [
      'The trigger keeps <code>aria-haspopup="menu"</code> and a live <code>aria-expanded</code>.',
      'Arrow keys move through items; <kbd>Tab</kbd> leaves the menu.',
      'Closing returns focus to the trigger — the browser does this for popover, hand-rolled menus usually do not.',
    ],
  },
  {
    slug: 'modal',
    title: 'Modal',
    lead: 'A dialog that takes focus, holds it, and gives it back.',
    markup: `<button onclick="demoModal.showModal()">Open</button>
<dialog id="demoModal" class="modal">
  <form method="dialog">
    <h2>Delete the draft?</h2>
    <p>This cannot be undone.</p>
    <div class="card-footer">
      <button value="cancel">Cancel</button>
      <button value="confirm" class="btn btn-primary">Delete</button>
    </div>
  </form>
</dialog>`,
    demo: `<button class="btn" onclick="demoModalLive.showModal()">Delete a draft</button>
<dialog id="demoModalLive" class="modal">
  <form method="dialog">
    <h2 style="margin:0">Delete the draft?</h2>
    <p style="margin:0">This cannot be undone.</p>
    <div class="card-footer">
      <button class="btn" value="cancel">Cancel</button>
      <button class="btn btn-primary" value="confirm">Delete</button>
    </div>
  </form>
</dialog>`,
    caption: 'showModal() gives the trap, the inert page, Escape and ::backdrop for free.',
    notes: [
      'A modal inside an ancestor with a <code>transform</code> is trapped in that stacking context — dialog’s top layer avoids this.',
      'Lock scroll with <code>scrollbar-gutter: stable</code> so the page does not jump sideways.',
      'Two stacked modals usually mean the flow wants to be a page, not a dialog.',
    ],
  },
  {
    slug: 'menu',
    title: 'Menu',
    lead: 'Site navigation: a list of links in a nav, plus the mobile panel the bundled script toggles.',
    markup: `<nav class="menu menu-collapse" id="main-menu" aria-label="Main">
  <ul>
    <li><a href="/docs" aria-current="page">Docs</a></li>
    <li><a href="/support">Support</a></li>
  </ul>
</nav>
<button class="icon-menu" type="button" aria-label="Toggle menu"
        aria-controls="main-menu" aria-expanded="false">&#8801;</button>`,
    demo: `<nav class="menu" aria-label="Demo">
  <ul>
    <li><a href="#usage" aria-current="page">Docs</a></li>
    <li><a href="#usage">Support</a></li>
    <li><a href="#usage">About</a></li>
  </ul>
</nav>`,
    caption: 'aria-current="page" becomes the bold link; the mobile toggle is gals.js.',
    notes: [
      'Mark the current page with <code>aria-current="page"</code>, not only with a colour.',
      'The header of this very site is the framework menu plus the site’s own paint.',
      'Two navs on one page need distinct <code>aria-label</code>s or the landmark list is useless.',
    ],
  },
  {
    slug: 'post-search',
    title: 'Post & Search',
    lead:
      'Мини-лента: ввод текста, кнопка Post, поиск по созданным постам. <code>textContent</code> вместо <code>innerHTML</code> — XSS-безопасно по умолчанию.',
    markup: `<div class="post-search" id="feed">
  <form onsubmit="addPost(document.getElementById('feed')); return false;">
    <label for="post-input">Write a post</label>
    <textarea id="post-input" class="post-input"
              placeholder="Write a post..." rows="3" required></textarea>
    <button type="submit" class="btn btn-primary">Post</button>
  </form>

  <div class="search-box">
    <label for="search-input" class="visually-hidden">Search posts</label>
    <input type="search" id="search-input" class="search-input"
           placeholder="Search posts..."
           oninput="searchPosts(document.getElementById('feed'))">
  </div>

  <div class="post-list" aria-live="polite"></div>
  <p class="post-status" role="status">0 posts</p>
</div>

<style>
.post-search { max-width: 600px; }
.post-search form { margin-bottom: 16px; }
.post-input {
  width: 100%; padding: 10px; font: inherit;
  border: 1px solid #ccc; border-radius: 6px; resize: vertical;
}
.post-search .btn { margin-top: 8px; }
.search-box { margin-bottom: 16px; }
.search-input {
  width: 100%; padding: 10px; font: inherit;
  border: 1px solid #ccc; border-radius: 6px;
}
.post-list { display: flex; flex-direction: column; gap: 12px; }
.post-item {
  background: #f9f9f9; border-left: 4px solid #007acc;
  padding: 10px 14px; border-radius: 0 6px 6px 0;
  word-break: break-word;
}
.post-hidden { display: none; }
.post-status { font-size: 14px; color: #777; margin-top: 8px; }
</style>

<script>
function addPost(root) {
  const input = root.querySelector('.post-input');
  const list = root.querySelector('.post-list');
  const text = input.value.trim();
  if (!text) return;

  const post = document.createElement('div');
  post.className = 'post-item';
  post.textContent = text;          // не innerHTML: текст пользователя не разбирается как HTML
  list.prepend(post);

  input.value = '';
  searchPosts(root);                // новый пост может не подходить под активный фильтр
  input.focus();
}

function searchPosts(root) {
  const raw = root.querySelector('.search-input').value.trim();
  const needle = raw.toLowerCase();
  const posts = root.querySelectorAll('.post-item');
  let visible = 0;

  posts.forEach((post) => {
    const match = !needle || post.textContent.toLowerCase().includes(needle);
    post.classList.toggle('post-hidden', !match);   // класс, а не style.display
    if (match) visible += 1;
  });

  const status = root.querySelector('.post-status');
  const one = posts.length === 1 ? ' post' : ' posts';
  status.textContent = needle
    ? visible + ' of ' + posts.length + one + ' match "' + raw + '"'
    : posts.length + one;
}
</script>`,
    demo: `<style>
  .demo-ps {
    max-width: 600px; background: #fff; border-radius: 10px;
    padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,.1);
  }
  .demo-ps h2 { text-align: center; margin: 0 0 16px; font-size: 20px; }
  .demo-ps-input {
    width: 100%; padding: 10px; font: inherit;
    border: 1px solid #ccc; border-radius: 6px; resize: vertical;
  }
  .demo-ps .btn { margin-top: 8px; }
  .demo-ps-search { margin: 16px 0; }
  .demo-ps-search input {
    width: 100%; padding: 10px; font: inherit;
    border: 1px solid #ccc; border-radius: 6px;
  }
  .demo-ps-list { display: flex; flex-direction: column; gap: 12px; }
  .demo-ps-post {
    background: #f9f9f9; border-left: 4px solid #007acc;
    padding: 10px 14px; border-radius: 0 6px 6px 0;
    word-break: break-word;
  }
  .demo-ps-hidden { display: none; }
  .demo-ps-status { font-size: 14px; color: #777; margin-top: 8px; }
</style>
<div class="demo-ps" id="demo-ps-root">
  <h2>Post & Search</h2>
  <form onsubmit="window.__galsComponents.addPost(document.getElementById('demo-ps-root')); return false;">
    <label for="demo-ps-text" class="visually-hidden">Write a post</label>
    <textarea id="demo-ps-text" class="demo-ps-input"
              placeholder="Write a post..." rows="3" required></textarea>
    <button class="btn btn-primary" type="submit">Post</button>
  </form>

  <div class="demo-ps-search">
    <label for="demo-ps-query" class="visually-hidden">Search posts</label>
    <input type="search" id="demo-ps-query" class="demo-ps-search-input"
           placeholder="Search posts..."
           oninput="window.__galsComponents.searchPosts(document.getElementById('demo-ps-root'))">
  </div>

  <div class="demo-ps-list" aria-live="polite" aria-atomic="false"></div>
  <p class="demo-ps-status" role="status">0 posts</p>
</div>`,
    caption: 'Наберите текст, нажмите Post или Enter. Поиск фильтрует посты мгновенно, без перезагрузки.',
    notes: [
      '<code>onkeyup</code> в исходном коде не срабатывал на вставку через контекстное меню и программное изменение значения. Заменено на <code>oninput</code> — стреляет на любое изменение.',
      '<code>style.display = "none"</code> заменён на <code>classList.toggle(\'demo-ps-hidden\', !match)</code> — класс, а не inline-стиль. Легче переопределить и отладить.',
      'Класс <code>.hidden</code> определён в CSS, но в JS нигде не использовался — мёртвый код. Теперь класс <code>.demo-ps-hidden</code> реально переключается.',
      'В исходном коде <code>querySelectorAll(\'.post\')</code> выбирал <em>все</em> элементы с классом <code>.post</code> на странице. Заменено на <code>root.querySelectorAll(\'.demo-ps-post\')</code> — скоупнуто к корню компонента.',
      'Глобальные селекторы <code>body</code>, <code>.container</code>, <code>button</code>, <code>textarea</code> и <code>.post</code> утекали в документацию. Все скоуплены к <code>.demo-ps-*</code>.',
      'Добавлен <code>aria-live="polite"</code> на список постов — скринридер объявляет новый пост. Счётчик <code>role="status"</code> объявляет результат поиска.',
      '<code>&lt;label&gt;</code> скрыт через <code>visually-hidden</code>, но доступен скринридеру. Placeholder — не подпись: он исчезает при вводе.',
      'Поле поиска — <code>type="search"</code> вместо <code>type="text"</code>: мобильные показывают крестик очистки, скринридер объявляет «search field».',
      'Форма с <code>onsubmit</code> вместо кнопки с <code>onclick</code>: Enter в textarea отправляет форму, кнопка получает <code>type="submit"</code> бесплатно.',
      '<code>textContent</code> вместо <code>innerHTML</code> — экранирует HTML автоматически. В исходном коде это было верно, оставлено как есть.',
      'В исходном коде новый пост, добавленный при активном поиске, появлялся видимым, игнорируя фильтр. Исправлено: <code>addPost</code> вызывает <code>searchPosts</code> после добавления, чтобы скрыть несовпадающие посты.',
      'Поле ввода очищается после добавления поста и получает фокус — удобнее вводить следующую запись, не кликая мышью.',
    ],
  },
  {
    slug: 'verification-form',
    title: 'Verification form',
    lead:
      'Код подтверждения из четырёх ячеек: цифры распределяются по полям, Backspace и стрелки переносят фокус, вставка разкладывается по всем ячейкам сразу.',
    markup: `<div class="verify-code">
  <h2 id="vc-title">Validation code</h2>
  <p>We have sent a verification code to your email.</p>

  <form onsubmit="return confirmCode(this)">
    <div class="code-fields" role="group" aria-labelledby="vc-title">
      <input class="code-input" type="text" inputmode="numeric"
             autocomplete="one-time-code" pattern="[0-9]" maxlength="1" required
             aria-label="Digit 1 of 4"
             oninput="codeInput(this)"
             onkeydown="codeKeydown(this, event)"
             onpaste="codePaste(this, event)">
      <input class="code-input" type="text" inputmode="numeric"
             autocomplete="off" pattern="[0-9]" maxlength="1" required
             aria-label="Digit 2 of 4"
             oninput="codeInput(this)"
             onkeydown="codeKeydown(this, event)"
             onpaste="codePaste(this, event)">
      <!-- …ещё две ячейки -->
    </div>

    <!-- Собранный код уходит на сервер одним полем -->
    <input type="hidden" name="code">
    <button class="btn btn-primary" type="submit">Confirm</button>
    <p class="code-status" role="status" aria-live="polite"></p>
  </form>
</div>

<style>
.verify-code { width: 100%; max-width: 323px; }
.code-fields {
  display: flex; flex-wrap: nowrap; align-items: flex-start;
  gap: 10px; margin: 0 0 20px;
}
.code-input {
  flex: 1 1 0; min-width: 0; width: auto; height: auto;
  min-height: 44px; aspect-ratio: 1; padding: 0;
  font-size: 20px; text-align: center;
  border: 2px solid #ddd; border-radius: 15px;
}
.code-input.is-filled { border-color: #bd5518; }
.code-input:focus-visible {
  outline: 3px solid #6b2705; outline-offset: 2px;
  border-color: #a8410c;
}
.code-status { min-height: 20px; margin: 12px 0 0; font-size: 14px; }
.code-status.is-ok  { color: #16692c; }
.code-status.is-err { color: #b3261e; }
</style>

<script>
function codeInput(input) {
  var fields = Array.prototype.slice.call(
    input.closest('.verify-code').querySelectorAll('.code-input'));
  var index = fields.indexOf(input);

  // maxlength="1" не спасает от автоподстановки кода из SMS: цифр может
  // прийти несколько — раздаём их по следующим полям.
  var digits = input.value.replace(/\D/g, '');
  input.value = digits.slice(0, 1);

  var cursor = index;
  for (var i = 1; i < digits.length && cursor + 1 < fields.length; i++) {
    fields[++cursor].value = digits.charAt(i);
  }

  fields.forEach(function (f) {
    f.classList.toggle('is-filled', f.value !== '');
  });
  if (input.value && cursor + 1 < fields.length) fields[cursor + 1].focus();
}

function codeKeydown(input, event) {
  var fields = Array.prototype.slice.call(
    input.closest('.verify-code').querySelectorAll('.code-input'));
  var index = fields.indexOf(input);
  var last = fields.length - 1;

  if (event.key === 'Backspace' && input.value === '' && index > 0) {
    fields[index - 1].focus();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    fields[index - 1].focus();
  } else if (event.key === 'ArrowRight' && index < last) {
    fields[index + 1].focus();
  }
}

function codePaste(input, event) {
  var fields = Array.prototype.slice.call(
    input.closest('.verify-code').querySelectorAll('.code-input'));
  var index = fields.indexOf(input);
  var digits = event.clipboardData.getData('text').replace(/\D/g, '');
  if (!digits) return;

  event.preventDefault();
  // Вставка идёт от активного поля, а не всегда с первого.
  fields.forEach(function (f, i) {
    if (i >= index) f.value = digits.charAt(i - index) || '';
  });
  fields.forEach(function (f) {
    f.classList.toggle('is-filled', f.value !== '');
  });

  var empty = fields.slice(index).filter(function (f) { return f.value === ''; })[0];
  (empty || fields[fields.length - 1]).focus();
}

function confirmCode(form) {
  var fields = Array.prototype.slice.call(
    form.querySelectorAll('.code-input'));
  var code = fields.map(function (f) { return f.value; }).join('');
  var status = form.querySelector('.code-status');
  form.querySelector('[name="code"]').value = code;

  if (code.length !== fields.length) {
    status.className = 'code-status is-err';
    status.textContent = 'Enter all four digits.';
    fields.filter(function (f) { return f.value === ''; })[0].focus();
    return false;
  }

  status.className = 'code-status is-ok';
  status.textContent = 'Code ' + code + ' confirmed.';
  return false;
}
</script>`,
    demo: `<style>
  .demo-vf-stage {
    display: flex; justify-content: center; padding: 28px 12px;
    background: #fbceb1; border-radius: 7px;
  }
  .demo-vf {
    width: 100%; max-width: 323px; background: #fff;
    border-radius: 30px; padding: 34px clamp(18px, 7vw, 38px);
  }
  .demo-vf h2 { margin: 0 0 12px; font-size: 22px; }
  .demo-vf-lead {
    max-width: 220px; margin: 0 0 22px;
    font-size: 16px; font-weight: 500; color: #6b6b6b;
  }
  /*
   * nowrap + flex: 1 1 0 вместо четырёх фиксированных 60px: ряд всегда делит
   * ширину карточки на четыре части. Перенос строки физически невозможен —
   * при flex-wrap: wrap четыре поля по 60px (270px) не влезали в контент
   * карточки 323 - 38*2 = 247px, и четвёртое перескакивало на вторую строку.
   */
  .demo-vf-fields {
    display: flex; flex-wrap: nowrap; align-items: flex-start;
    gap: 10px; margin: 0 0 22px;
  }
  .demo-vf-input {
    flex: 1 1 0; min-width: 0; width: auto; height: auto;
    min-height: 44px; aspect-ratio: 1; padding: 0;
    font-size: 20px; text-align: center;
    color: #1c1c1c; background: #fff;
    border: 2px solid #ddd; border-radius: 15px;
    transition: border-color .2s;
  }
  .demo-vf-input.is-filled { border-color: #bd5518; }
  .demo-vf-input:focus-visible {
    outline: 3px solid #6b2705; outline-offset: 2px;
    border-color: #a8410c;
  }
  .demo-vf-btn {
    width: 100%; border: 0; border-radius: 40px; cursor: pointer;
    padding: 18px 45px; font: inherit; font-weight: 700; font-size: 18px;
    color: #fff; box-shadow: 0 9px 14px 0 rgba(168,65,12,.25);
    background: linear-gradient(180deg, #bd5518 0%, #a8410c 100%);
  }
  .demo-vf-btn:hover { background: linear-gradient(180deg, #a8410c 0%, #8f360a 100%); }
  .demo-vf-btn:focus-visible {
    outline: 3px solid #6b2705; outline-offset: 3px;
  }
  .demo-vf-status { min-height: 20px; margin: 12px 0 0; font-size: 14px; color: #6b6b6b; }
  .demo-vf-status.is-ok  { color: #16692c; }
  .demo-vf-status.is-err { color: #b3261e; }
</style>
<div class="demo-vf-stage">
  <div class="demo-vf">
    <h2 id="demo-vf-title">Validation code</h2>
    <p class="demo-vf-lead">We have sent a verification code to your email.</p>

    <form onsubmit="return window.__galsComponents.confirmCode(this)">
      <div class="demo-vf-fields" role="group" aria-labelledby="demo-vf-title">
        <input class="demo-vf-input" type="text" inputmode="numeric"
               autocomplete="one-time-code" pattern="[0-9]" maxlength="1" required
               aria-label="Digit 1 of 4"
               oninput="window.__galsComponents.handleCodeInput(this)"
               onkeydown="window.__galsComponents.handleCodeKeydown(this, event)"
               onpaste="window.__galsComponents.handleCodePaste(this, event)">
        <input class="demo-vf-input" type="text" inputmode="numeric"
               autocomplete="off" pattern="[0-9]" maxlength="1" required
               aria-label="Digit 2 of 4"
               oninput="window.__galsComponents.handleCodeInput(this)"
               onkeydown="window.__galsComponents.handleCodeKeydown(this, event)"
               onpaste="window.__galsComponents.handleCodePaste(this, event)">
        <input class="demo-vf-input" type="text" inputmode="numeric"
               autocomplete="off" pattern="[0-9]" maxlength="1" required
               aria-label="Digit 3 of 4"
               oninput="window.__galsComponents.handleCodeInput(this)"
               onkeydown="window.__galsComponents.handleCodeKeydown(this, event)"
               onpaste="window.__galsComponents.handleCodePaste(this, event)">
        <input class="demo-vf-input" type="text" inputmode="numeric"
               autocomplete="off" pattern="[0-9]" maxlength="1" required
               aria-label="Digit 4 of 4"
               oninput="window.__galsComponents.handleCodeInput(this)"
               onkeydown="window.__galsComponents.handleCodeKeydown(this, event)"
               onpaste="window.__galsComponents.handleCodePaste(this, event)">
      </div>

      <input type="hidden" class="demo-vf-code" name="code">
      <button class="demo-vf-btn" type="submit">Confirm</button>
      <p class="demo-vf-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</div>`,
    caption:
      'Печатайте — фокус сам переходит вперёд. Backspace на пустой ячейке возвращается назад, вставьте весь код сразу.',
    notes: [
      '<strong>Главный баг исходника:</strong> <code>index &lt; index.length - 1</code>. У числа нет свойства <code>length</code>, сравнение <code>0 &lt; undefined</code> всегда <code>false</code> — стрелка <kbd>→</kbd> не работала никогда. Исправлено на <code>index &lt; fields.length - 1</code>.',
      '<code>document.querySelectorAll(\'input\')</code> выбирал <em>все</em> input страницы — включая поиск в сайдбаре. Заменено на <code>root.querySelectorAll(\'.demo-vf-input\')</code>.',
      '<code>window.onload</code> в документации не сработал бы: HTML вставляется через <code>innerHTML</code>, и скрипты внутри не исполняются. Обработчики вынесены в <code>window.__galsComponents</code> и вызываются из inline-атрибутов.',
      '<strong>Вставка игнорировала активное поле:</strong> код всегда ложился в <code>inputs[0..]</code>, поэтому вставка из третьей ячейки перезаписывала первые. Теперь вставка идёт от активного поля.',
      '<strong>Автоподстановка кода из SMS ломалась:</strong> <code>maxlength="1"</code> плюс <code>.charAt(0)</code> выбрасывали лишние цифры, которые присылает браузер. Теперь пришедшие цифры раздаются по следующим полям. Первому полю добавлен <code>autocomplete="one-time-code"</code> — именно он включает системную подсказку кода на iOS, Android и в Chrome.',
      'Класс <code>.active</code> разъезжался: paste вешал его на все поля, Backspace снимал только с одного, а правка первой ячейки оставляла подсветку на остальных. Теперь состояние всех ячеек пересчитывается целиком (<code>paintCode</code>).',
      '<code>outline: none</code> без замены лишал поле видимого фокуса — клавиатурная навигация по коду становилась вслепую. Добавлено кольцо <code>:focus-visible</code>.',
      'Четыре голых input скринридер объявляет как «edit text» без объяснения. Добавлены <code>aria-label="Digit N of 4"</code> и <code>role="group"</code> с <code>aria-labelledby</code> на контейнер.',
      'Отправлялся <code>maxlength="1"</code> без <code>name</code> — на сервер не уходило ничего. Добавлено скрытое поле <code>name="code"</code>, куда хелпер складывает собранный код.',
      'Форма вела на <code>action="#"</code> и ничего не сообщала о результате. Добавлен <code>&lt;p role="status" aria-live="polite"&gt;</code> — он объявляет и ошибку, и успех. Здесь он подтверждает любой код: настоящая проверка живёт на сервере, клиент не может ей доверять.',
      'Глобальные <code>* { margin:0; padding:0 }</code>, <code>body</code>, <code>h2</code>, <code>p</code>, <code>input</code>, <code>button</code> и <code>form &gt; div</code> обнулили бы отступы и перекрасили формы всей документации. Все селекторы скоуплены к <code>.demo-vf-*</code>.',
      'Фиксированная <code>height: 350px</code> блоки растягивал текст, масштаб или перевод. Заменена на автовысоту; <code>padding: 90px 38px 38px</code> — на обычный отступ.',
      'Подпись <code>#b6b6b6</code> на белом — контраст ~2:1, код не читается. Тёмно-оранжевая кнопка с белым текстом (<code>#ff8d4d</code>) давала ~2.3:1. Оба цвета затемнены до ~5:1 и ~4.7:1.',
      'Мелочи: <code>padding:4</code> без единиц CSS игнорирует (исправлено на <code>0</code>), <code>&lt;button&gt;</code> без <code>type</code> внутри формы отправлял бы её молча — теперь <code>type="submit"</code> явно, а <code>onsubmit</code> возвращает <code>false</code>.',
    ],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    lead: 'Switching views of one subject without leaving the page — radios and :checked, no JavaScript.',
    markup: `<div class="tabs">
  <input type="radio" name="t" id="t1" checked>
  <label for="t1">Design</label>
  <input type="radio" name="t" id="t2">
  <label for="t2">Markup</label>

  <div class="tab-panel">Panel 1</div>
  <div class="tab-panel">Panel 2</div>
</div>`,
    demo: `<div class="tabs">
  <input type="radio" name="demo-tabs" id="demo-t1" checked>
  <label for="demo-t1">Design</label>
  <input type="radio" name="demo-tabs" id="demo-t2">
  <label for="demo-t2">Markup</label>
  <input type="radio" name="demo-tabs" id="demo-t3">
  <label for="demo-t3">Notes</label>

  <div class="tab-panel">The labels form the tab bar; the radios are visually hidden but stay keyboard-reachable.</div>
  <div class="tab-panel">Panel <em>N</em> is shown by radio <em>N</em>: <code>input:nth-of-type(N):checked ~ .tab-panel:nth-of-type(N)</code>.</div>
  <div class="tab-panel">Arrow keys switch tabs, because they switch radios. Up to six panels per group.</div>
</div>`,
    caption: 'Arrow keys move between tabs — they move the radio. Tab moves into the panel.',
    notes: [
      'The order matters: each input must sit right before its label, panels after all pairs.',
      'Printable and script-free; the cost is radio semantics instead of full tab semantics.',
      'If each tab could be its own URL, it is navigation and belongs in a menu.',
    ],
  },
  {
    slug: 'pagination',
    title: 'Pagination',
    lead: 'Numbered links for a list that spans requests.',
    markup: `<nav class="pagination" aria-label="Results">
  <a href="?p=4" aria-label="Previous">&#8249;</a>
  <a href="?p=4">4</a>
  <span aria-current="page">5</span>
  <a href="?p=6">6</a>
  <span aria-hidden="true">&#8230;</span>
  <a href="?p=20">20</a>
</nav>`,
    demo: `<nav class="pagination" aria-label="Demo results">
  <a href="#usage" aria-label="Previous">&#8249;</a>
  <a href="#usage">4</a>
  <span aria-current="page">5</span>
  <a href="#usage">6</a>
  <a href="#usage">7</a>
  <span aria-hidden="true">&#8230;</span>
  <a href="#usage">20</a>
</nav>`,
    notes: [
      'Ellipses are <code>aria-hidden</code>; the current page carries <code>aria-current="page"</code>.',
      'Infinite scroll destroys the footer and the sense of position. Use it where scrolling is the activity, not where results are.',
    ],
    gallery: [
      {
        title: 'Icon pill pagination',
        lead:
          'Пилюля с круглыми кнопочками-иконками: активная страница подсвечивается кольцом. Стрелки листают, иконки выбирают страницу напрямую.',
        markup: `<nav class="icon-pagination" aria-label="Results">
  <ul>
    <li><button class="pgi-nav" type="button" data-step="-1"
                onclick="shiftPagination(this, -1)">&#8249; Prev</button></li>
    <li><button class="pgi-num is-active" type="button" aria-current="page"
                aria-label="Home" onclick="selectPagination(this)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M3 11.5 12 4l9 7.5V21h-6v-6h-6v6H3z"/>
          </svg>
        </button></li>
    <!-- …ещё страницы -->
    <li><button class="pgi-nav" type="button" data-step="1"
                onclick="shiftPagination(this, 1)">Next &#8250;</button></li>
  </ul>
  <p class="pgi-status" role="status">Page 1 of 5</p>
</nav>

<style>
.icon-pagination ul {
  display: flex; align-items: center; list-style: none; margin: 0;
  padding: 10px 20px; background: #fff; border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0,0,0,.2);
}
.icon-pagination li { margin: 0 5px; }
.icon-pagination li:first-child { margin-right: 30px; }
.icon-pagination li:last-child  { margin-left: 30px; }
.pgi-nav { border: 0; background: none; cursor: pointer;
  font: inherit; font-weight: 700; font-size: 20px; color: #4a4a4a; }
.pgi-nav[disabled] { opacity: .35; cursor: default; }
.pgi-num {
  display: flex; align-items: center; justify-content: center;
  width: 50px; height: 50px; padding: 0; border: 0; border-radius: 50%;
  background: none; color: #4a4a4a; cursor: pointer; transition: .3s;
}
.pgi-num:hover,
.pgi-num.is-active {
  background: #86ff3d; color: #123a05;
  box-shadow: 0 0 0 4px #fff, 0 0 0 6px #86ff3d;
}
</style>`,
        demo: `<style>
  .demo-pgi {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    background: #cdecb0; padding: 28px 16px; border-radius: 7px;
  }
  .demo-pgi-list {
    display: flex; align-items: center; list-style: none; margin: 0;
    padding: 10px 20px; background: #fff; border-radius: 50px;
    box-shadow: 0 5px 15px rgba(0,0,0,.2);
  }
  .demo-pgi-list li { margin: 0 5px; }
  .demo-pgi-list li:first-child { margin-right: 30px; }
  .demo-pgi-list li:last-child  { margin-left: 30px; }
  .demo-pgi-nav {
    border: 0; background: none; cursor: pointer; padding: 0;
    font: inherit; font-weight: 700; font-size: 18px; color: #4a4a4a;
  }
  .demo-pgi-nav[disabled] { opacity: .35; cursor: default; }
  .demo-pgi-num {
    display: flex; align-items: center; justify-content: center;
    width: 50px; height: 50px; padding: 0; border: 0; border-radius: 50%;
    background: none; color: #4a4a4a; cursor: pointer; transition: .3s;
  }
  .demo-pgi-num:hover,
  .demo-pgi-num.is-active {
    background: #86ff3d; color: #123a05;
    box-shadow: 0 0 0 4px #fff, 0 0 0 6px #86ff3d;
  }
  .demo-pgi-nav:focus-visible,
  .demo-pgi-num:focus-visible {
    outline: 3px solid #2f7d1a; outline-offset: 2px;
  }
  .demo-pgi-status { margin: 0; font-size: 14px; color: #2c4a17; }
</style>
<nav class="demo-pgi" aria-label="Demo pages">
  <ul class="demo-pgi-list">
    <li>
      <button class="demo-pgi-nav" type="button" data-pgi-step="-1" disabled
              aria-label="Previous page"
              onclick="window.__galsComponents.shiftPagination(this, -1)">&#8249; Prev</button>
    </li>
    <li>
      <button class="demo-pgi-num is-active" type="button" aria-current="page" aria-label="Home"
              onclick="window.__galsComponents.selectPagination(this)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5V21h-6v-6h-6v6H3z"/>
        </svg>
      </button>
    </li>
    <li>
      <button class="demo-pgi-num" type="button" aria-label="Users"
              onclick="window.__galsComponents.selectPagination(this)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0z"/>
          <circle cx="17" cy="9" r="2.6"/><path d="M16.4 14.4a5.4 5.4 0 0 1 5.1 5.6h-5.2z"/>
        </svg>
      </button>
    </li>
    <li>
      <button class="demo-pgi-num" type="button" aria-label="Docs"
              onclick="window.__galsComponents.selectPagination(this)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/>
          <path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>
        </svg>
      </button>
    </li>
    <li>
      <button class="demo-pgi-num" type="button" aria-label="Files"
              onclick="window.__galsComponents.selectPagination(this)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4" fill="#fff" opacity=".35"/>
        </svg>
      </button>
    </li>
    <li>
      <button class="demo-pgi-num" type="button" aria-label="Contacts"
              onclick="window.__galsComponents.selectPagination(this)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .6 3.6 1 1 0 0 1-.25 1z"/>
        </svg>
      </button>
    </li>
    <li>
      <button class="demo-pgi-nav" type="button" data-pgi-step="1"
              aria-label="Next page"
              onclick="window.__galsComponents.shiftPagination(this, 1)">Next &#8250;</button>
    </li>
  </ul>
  <p class="demo-pgi-status" role="status">Page 1 of 5</p>
</nav>`,
        caption:
          'Стрелки листают по краям и отключаются, иконки выбирают страницу. Скринридер читает «Page N of 5».',
        notes: [
          'В исходном jQuery <code>.find(\'.pageNumber.active\')</code> вызывался <em>после</em> <code>.addClass(\'active\')</code> — выбирались обе страницы, а на краю списка класс <code>active</code> попадал на стрелку Next, и пагинация навсегда застревала. Здесь индекс считается числом и зажимается краями.',
          'jQuery (35 КБ gzip) убран целиком: переключение класса — это <code>classList.toggle</code>, а не повод тянуть библиотеку.',
          'Класс <code>.pagination</code> в исходнике совпадал с GALS-классом и ломал бы обычную пагинацию на той же странице. Демо использует <code>.demo-pgi-*</code>.',
          'Глобальные <code>* { margin:0; padding:0 }</code>, <code>body { display:flex }</code> и <code>ul { … }</code> внутри страницы документации обнулили бы отступы и списки всего сайта. Все селекторы скоуплены.',
          'Ссылки <code>&lt;a href="#"&gt;</code> заменены на <code>&lt;button type="button"&gt;</code>: страница не меняется — это действие, а не переход. Плюс пропало битое <code>href="#"; return false;</code> в разметке.',
          'Font Awesome 4.7 (CDN) заменён на инлайновые SVG: нет внешнего запроса, иконки наследуют <code>currentColor</code> и не ломаются, если CDN недоступен.',
          'Белый текст на <code>#86ff3d</code> даёт контраст ~1.6:1 — не читается. Активная страница залита тем же салатовым, но текст тёмный <code>#123a05</code>.',
          'Иконка без текста непонятна скринридеру: у каждой кнопки <code>aria-label</code>, у текущей — <code>aria-current="page"</code>, у счётчика — <code>role="status"</code>.',
          '<code>-webkit-box-reflect</code> — вендорная фича WebKit, в Firefox и Edge её нет. Убран; при желании верните как чистую decoration-надстройку.',
        ],
      },
    ],
  },
  {
    slug: 'popovers',
    title: 'Popovers',
    lead: 'A short label on hover or focus — never the only home of a fact.',
    markup: `<span class="popover" tabindex="0"
      data-popover="Extra context, also shown on focus">Hover me</span>`,
    demo: `<p>
  <span class="popover" tabindex="0" data-popover="Extra context, also shown on focus">Hover me</span>
  &mdash; or tab to me: the tip opens on focus too.
</p>`,
    notes: [
      'The text comes from <code>attr(data-popover)</code> — no element, no script.',
      '<code>tabindex="0"</code> is what makes the tip reachable by keyboard; do not drop it.',
      'Anything interactive inside is a dropdown, not a popover.',
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    lead: 'Determinate and indeterminate feedback, with a text equivalent.',
    markup: `<progress value="65" max="100">65%</progress>

<div class="progress" role="progressbar"
     aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"
     aria-label="Upload">
  <div class="progress-bar" style="width: 65%"></div>
</div>`,
    demo: `<p>Native, coloured by accent-color:</p>
<progress value="65" max="100">65%</progress>
<p style="margin-top:1em">Div-based, for when the bar is not the whole story:</p>
<div class="progress" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload">
  <div class="progress-bar" style="width: 65%"></div>
</div>`,
    notes: [
      'The native element already announces itself; the div needs the ARIA roles you see above.',
      'Animate width with a transform where you can, so the main thread stays free.',
      'Show a loader after roughly 150ms; a flash of spinner is worse than none.',
    ],
  },
  {
    slug: 'scrollspy',
    title: 'Scrollspy',
    lead: 'Highlights the section you are reading inside a table of contents. Ships in gals.js behind one attribute.',
    markup: `<div class="inthisPage" data-scrollspy>
  <ul>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#notes">Notes</a></li>
  </ul>
</div>

<!-- gals.js does the rest: observes h1-h4[id], marks the
     link in view with aria-current="true" -->`,
    demo: `<div class="container">
  <div class="container-block pt-3 pt-xs12">
    <div class="inthisPage" data-scrollspy style="display:block">
      <h4>On this demo</h4>
      <ul>
        <li><a href="#spy-one">First</a></li>
        <li><a href="#spy-two">Second</a></li>
        <li><a href="#spy-three">Third</a></li>
      </ul>
    </div>
  </div>
  <div class="container-block pt-9 pt-xs12">
    <div style="max-height:160px;overflow:auto;border:1px solid #cecece;border-radius:7px;padding:0 1em">
      <h4 id="spy-one">First</h4>
      <p>Scroll this box. The heading in the middle band of the viewport lights its link.</p>
      <h4 id="spy-two">Second</h4>
      <p>The observer watches a band across the middle of the window, not the whole viewport, so the highlight does not flicker between neighbouring sections.</p>
      <h4 id="spy-three">Third</h4>
      <p>The active link carries <code>aria-current="true"</code>, so the state is not colour-only. This page’s own “On this page” block runs the same code.</p>
    </div>
  </div>
</div>`,
    caption: 'Scroll the box on the right: the link on the left follows the heading in view.',
    notes: [
      'Observe headings, not sections — section boxes overlap and the highlight flickers.',
      'Set <code>scroll-padding-top</code> to the sticky header height, or anchors land underneath it.',
      'The band is <code>rootMargin: -40% 0px -55% 0px</code>; tune it to your page rhythm.',
    ],
  },
  {
    slug: 'loaders',
    title: 'Loaders',
    lead: 'Feedback for work in progress: spinner, skeleton, and the words that go with them.',
    markup: `<button class="btn" type="button" aria-busy="true" disabled>
  <span class="loader" aria-hidden="true"></span> Saving…
</button>

<div class="skeleton" style="height: 1.2em"></div>
<div class="skeleton" style="height: 6em"></div>`,
    demo: `<button class="btn" type="button" aria-busy="true" disabled>
  <span class="loader" aria-hidden="true"></span> Saving…
</button>
<div style="margin-top:1em;max-width:32em">
  <div class="skeleton" style="height: 1.2em; margin-bottom:.6em"></div>
  <div class="skeleton" style="height: 1.2em; margin-bottom:.6em; width: 80%"></div>
  <div class="skeleton" style="height: 6em"></div>
</div>`,
    notes: [
      'A skeleton holds the shape of what is coming, so nothing jumps when it lands — prefer it whenever the layout is predictable.',
      'Announce completion, not just the wait: <code>role="status"</code> with the final count.',
      'The spinner keeps spinning under <code>prefers-reduced-motion</code> — it is information; the skeleton shimmer stops.',
    ],
    gallery: [
      {
        title: 'Sweep ring',
        lead: 'A rotating half-gradient sweep with a glowing dot, masked by a dark inner disc. Pure CSS.',
        markup: `<div class="loader-sweep">
  <span></span>
</div>

<style>
.loader-sweep {
  position: relative;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: #0d2323;
  animation: sweep-spin 2s linear infinite;
}
@keyframes sweep-spin { to { transform: rotate(360deg); } }
.loader-sweep::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 50%; height: 100%;
  background: linear-gradient(to top, transparent, rgba(0, 255, 249, .4));
  background-size: 100px 180px;
  background-repeat: no-repeat;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
}
.loader-sweep::after {
  content: '';
  position: absolute; top: 0; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 20px;
  background: #00fff9;
  border-radius: 50%;
  box-shadow: 0 0 20px #00fff9, 0 0 40px #00fff9, 0 0 60px #00fff9;
}
.loader-sweep span {
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  background: #102626;
}
</style>`,
        demo: `<style>
  .demo-sweep-stage { display: flex; justify-content: center; padding: 2em 0; background: #102626; border-radius: 7px; }
  .demo-sweep {
    position: relative; width: 200px; height: 200px;
    border-radius: 50%; background: #0d2323;
    animation: demo-sweep-spin 2s linear infinite;
  }
  @keyframes demo-sweep-spin { to { transform: rotate(360deg); } }
  .demo-sweep::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 50%; height: 100%;
    background: linear-gradient(to top, transparent, rgba(0, 255, 249, .4));
    background-size: 100px 180px; background-repeat: no-repeat;
    border-top-left-radius: 100px; border-bottom-left-radius: 100px;
  }
  .demo-sweep::after {
    content: ''; position: absolute; top: 0; left: 50%;
    transform: translateX(-50%);
    width: 20px; height: 20px;
    background: #00fff9; border-radius: 50%;
    box-shadow: 0 0 20px #00fff9, 0 0 40px #00fff9, 0 0 60px #00fff9;
  }
  .demo-sweep span {
    position: absolute; inset: 20px;
    border-radius: 50%; background: #102626;
  }
</style>
<div class="demo-sweep-stage">
  <div class="demo-sweep" role="status" aria-label="Loading"><span></span></div>
</div>`,
      },
      {
        title: 'Spinning square',
        lead: 'One pseudo-element rotating in steps — the lightest possible loader: no extra markup at all.',
        markup: `<div class="loader-square"></div>

<style>
.loader-square {
  box-sizing: border-box;
  width: 200px; height: 200px;
  position: relative;
}
.loader-square::before {
  content: '';
  width: 30px; height: 30px;
  background-color: lightblue;
  position: absolute; top: 50%; left: 50%;
  animation: square-rotating 1500ms alternate infinite both;
}
@keyframes square-rotating {
  0%, 30%   { transform: translate(-50%, -50%) rotate(0); }
  70%, 100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>`,
        demo: `<style>
  .demo-square {
    box-sizing: border-box;
    width: 200px; height: 200px;
    position: relative; margin: 0 auto;
  }
  .demo-square::before {
    content: '';
    width: 30px; height: 30px;
    background-color: lightblue;
    position: absolute; top: 50%; left: 50%;
    animation: demo-square-rotating 1500ms alternate infinite both;
  }
  @keyframes demo-square-rotating {
    0%, 30%   { transform: translate(-50%, -50%) rotate(0); }
    70%, 100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
</style>
<div class="demo-square" role="status" aria-label="Loading"></div>`,
      },
      {
        title: 'Ripple rings',
        lead: 'Twelve nested rings pulsing along the Z axis under a tilted perspective — a 3D wave made of borders.',
        markup: `<div class="loader-ripple">
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
</div>

<style>
.loader-ripple {
  position: relative;
  width: 250px; height: 250px;
  transform-style: preserve-3d;
  transform: perspective(500px) rotateX(60deg);
}
.loader-ripple span {
  position: absolute;
  display: block;
  border: 5px solid #fff;
  box-shadow: 0 5px 0 #ccc, inset 0 5px 0 #ccc;
  box-sizing: border-box;
  border-radius: 50%;
  animation: ripple 3s ease-in-out infinite;
}
@keyframes ripple {
  0%, 100% { transform: translateZ(-100px); opacity: .1; }
  50%      { transform: translateZ(100px);  opacity: 1; }
}
/* each ring is inset by 10px more and starts .2s later */
.loader-ripple span:nth-child(1)  { inset: 0;                   animation-delay: 2.4s; }
.loader-ripple span:nth-child(2)  { inset: 10px;                 animation-delay: 2.2s; }
/* …and so on up to span:nth-child(12) { inset: 110px; animation-delay: .2s; } */
</style>`,
        demo: `<style>
  .demo-ripple-stage { display: flex; justify-content: center; padding: 1em 0 2em; background: #c0c0f0; border-radius: 7px; }
  .demo-ripple {
    position: relative; width: 250px; height: 250px;
    transform-style: preserve-3d;
    transform: perspective(500px) rotateX(60deg);
  }
  .demo-ripple span {
    position: absolute; display: block;
    border: 5px solid #fff;
    box-shadow: 0 5px 0 #ccc, inset 0 5px 0 #ccc;
    box-sizing: border-box; border-radius: 50%;
    animation: demo-ripple-wave 3s ease-in-out infinite;
  }
  @keyframes demo-ripple-wave {
    0%, 100% { transform: translateZ(-100px); opacity: .1; }
    50%      { transform: translateZ(100px);  opacity: 1; }
  }
  .demo-ripple span:nth-child(1)  { inset: 0;     animation-delay: 2.4s; }
  .demo-ripple span:nth-child(2)  { inset: 10px;  animation-delay: 2.2s; }
  .demo-ripple span:nth-child(3)  { inset: 20px;  animation-delay: 2s; }
  .demo-ripple span:nth-child(4)  { inset: 30px;  animation-delay: 1.8s; }
  .demo-ripple span:nth-child(5)  { inset: 40px;  animation-delay: 1.6s; }
  .demo-ripple span:nth-child(6)  { inset: 50px;  animation-delay: 1.4s; }
  .demo-ripple span:nth-child(7)  { inset: 60px;  animation-delay: 1.2s; }
  .demo-ripple span:nth-child(8)  { inset: 70px;  animation-delay: 1s; }
  .demo-ripple span:nth-child(9)  { inset: 80px;  animation-delay: .8s; }
  .demo-ripple span:nth-child(10) { inset: 90px;  animation-delay: .6s; }
  .demo-ripple span:nth-child(11) { inset: 100px; animation-delay: .4s; }
  .demo-ripple span:nth-child(12) { inset: 110px; animation-delay: .2s; }
</style>
<div class="demo-ripple-stage">
  <div class="demo-ripple" role="status" aria-label="Loading">
    <span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span>
  </div>
</div>`,
      },
      {
        title: 'Wireframe cube (canvas)',
        lead: 'A rotating 3D cube projected onto 2D canvas — for dashboards that want a heavier, sci-fi loading state.',
        markup: `<canvas id="cube" width="400" height="400"></canvas>

<script>
const ctx = document.getElementById('cube').getContext('2d');
const vertices = [
  {x:-1,y:-1,z:-1}, {x:1,y:-1,z:-1}, {x:1,y:1,z:-1}, {x:-1,y:1,z:-1},
  {x:-1,y:-1,z:1},  {x:1,y:-1,z:1},  {x:1,y:1,z:1},  {x:-1,y:1,z:1},
];
const edges = [
  [0,1],[1,2],[2,3],[3,0], [4,5],[5,6],[6,7],[7,4], [0,4],[1,5],[2,6],[3,7],
];
let angleX = 0, angleY = 0, angleZ = 0;

function project(p) {
  const fov = 300;
  const scale = fov / (fov + p.z);
  return { x: p.x * scale * 50 + 200, y: p.y * scale * 50 + 200 };
}
function rotate(p) {
  let { x, y, z } = p;
  [y, z] = [y * Math.cos(angleX) - z * Math.sin(angleX),
            y * Math.sin(angleX) + z * Math.cos(angleX)];
  [x, z] = [x * Math.cos(angleY) + z * Math.sin(angleY),
           -x * Math.sin(angleY) + z * Math.cos(angleY)];
  [x, y] = [x * Math.cos(angleZ) - y * Math.sin(angleZ),
            x * Math.sin(angleZ) + y * Math.cos(angleZ)];
  return { x, y, z };
}
function draw() {
  ctx.clearRect(0, 0, 400, 400);
  angleX += .02; angleY += .03; angleZ += .01;
  edges.forEach(([a, b]) => {
    const p1 = project(rotate(vertices[a]));
    const p2 = project(rotate(vertices[b]));
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
  });
  requestAnimationFrame(draw);
}
draw();
</\u0073cript>`,
        demo: `<div style="display:flex;justify-content:center">
  <canvas id="demo-cube-loader" width="400" height="400"
          style="width:100%;max-width:320px;height:auto;border:1px solid var(--line);border-radius:7px"
          role="status" aria-label="Loading"></canvas>
</div>`,
        run: 'startCubeLoader',
      },
    ],
  },

  /* ---------- Нейроморфные контролы ---------- */

  {
    slug: 'morphing-range',
    title: 'Morphing range',
    lead:
      'Нейроморфный ползунок: «утопленный» жёлоб и «выпуклый» брусок на одних box-shadow. Значение выводится в <code>&lt;output&gt;</code>.',
    markup: `<label class="morph-range">
  Volume
  <input type="range" min="0" max="100" value="50"
         oninput="document.getElementById('vol-out').textContent = this.value">
  <output id="vol-out" for="vol">50</output>
</label>

<style>
.morph-range input {
  -webkit-appearance: none;
  appearance: none;
  width: 200px; height: 8px; border-radius: 40px;
  background: #ececec;
  box-shadow: -7px -7px 15px rgba(255,255,255,.65),
 7px  7px 15px rgba(70,70,70,.12);
}
.morph-range input::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 30px; height: 30px; border-radius: 50%;
  background: #ececec;
  box-shadow:  7px  7px 15px rgba(255,255,255,.65),
              -7px -7px 15px rgba(70,70,70,.12),
       inset  7px  7px 15px rgba(255,255,255,.65),
       inset -7px -7px 15px rgba(70,70,70,.12);
}
.morph-range input::-moz-range-thumb {
  width: 30px; height: 30px; border: none; border-radius: 50%;
  background: #ececec;
  box-shadow:  7px  7px 15px rgba(255,255,255,.65),
              -7px -7px 15px rgba(70,70,70,.12);
}
.morph-range input:focus-visible {
  box-shadow: -7px -7px 15px rgba(255,255,255,.65), 7px 7px 15px rgba(70,70,70,.12), 0 0 0 3px rgba(133,18,209,.5);
  outline: none;
}
</style>`,
    demo: `<style>
  .demo-mr {
    background: #ececec; padding: 24px; border-radius: 7px;
    display: flex; flex-direction: column; gap: 24px;
    font-family: system-ui, sans-serif; color: #3a3a3a;
  }
  .demo-mr-row {
    display: flex; align-items: center; gap: 16px;
  }
  .demo-mr-slider {
    -webkit-appearance: none; appearance: none;
    width: 200px; height: 8px; border-radius: 40px;
    background: #ececec;
    box-shadow: -7px -7px 15px rgba(255,255,255,.65), 7px 7px 15px rgba(70,70,70,.12);
    outline: none; cursor: pointer;
  }
  .demo-mr-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 30px; height: 30px; border-radius: 50%;
    background: #ececec; border: 1px solid #ececec;
    box-shadow:  7px  7px 15px rgba(255,255,255,.65),
                -7px -7px 15px rgba(70,70,70,.12),
         inset  7px  7px 15px rgba(255,255,255,.65),
         inset -7px -7px 15px rgba(70,70,70,.12);
    cursor: pointer;
  }
  .demo-mr-slider::-moz-range-thumb {
    width: 30px; height: 30px; border: 1px solid #ececec; border-radius: 50%;
    background: #ececec;
    box-shadow:  7px  7px 15px rgba(255,255,255,.65),
                -7px -7px 15px rgba(70,70,70,.12);
  }
  .demo-mr-slider:focus-visible {
    box-shadow: 0 0 0 3px rgba(133,18,209,.5);
    outline: none;
  }
  .demo-mr-out {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 50%;
    color: #d1495b; font-weight: 300;
    box-shadow: -7px -7px 15px rgba(255,255,255,.65), 7px 7px 15px rgba(70,70,70,.12),
     inset -7px -7px 15px rgba(255,255,255,.65), inset 7px 7px 15px rgba(70,70,70,.12);
  }
</style>
<div class="demo-mr">
  <div class="demo-mr-row">
    <label for="demo-mr-a">Range 0–10</label>
    <input class="demo-mr-slider" id="demo-mr-a" type="range" min="0" max="10" list="demo-mr-ticks" value="5"
           oninput="document.getElementById('demo-mr-a-out').textContent = this.value">
    <span class="demo-mr-out" id="demo-mr-a-out">5</span>
  </div>
  <datalist id="demo-mr-ticks">
    <option value="0" label="0"></option>
    <option value="5" label="5"></option>
    <option value="10" label="10"></option>
  </datalist>
  <div class="demo-mr-row">
    <label for="demo-mr-b">Range 0–100</label>
    <input class="demo-mr-slider" id="demo-mr-b" type="range" min="0" max="100" value="50"
           oninput="document.getElementById('demo-mr-b-out').textContent = this.value">
    <span class="demo-mr-out" id="demo-mr-b-out">50</span>
  </div>
</div>`,
    caption: 'Двигайте ползунок — значение обновляется мгновенно.',
    notes: [
      'В исходнике ползунок имел высоту жёлоба 0.5px — при appearance:none он практически невидим и неинтерактивен в Firefox. Исправлено до 8px.',
      'Firefox не поддерживает ::-webkit-slider-thumb — добавлен ::-moz-range-thumb.',
      'Метка <code>label for="..."</code> обязательна: без неё ползунок недоступен с клавиатуры и скринридера.',
      'Метки из <code>&lt;option label&gt;</code> рисует только Chromium; в Firefox/WebKit ползунок гладкий.',
      'В оригинале первый слайдер обновлялся по <code>onchange</code> (только при отпускании) — заменено на <code>oninput</code> для мгновенной обратной связи.',
      '<code>innerHTML</code> заменён на <code>textContent</code>: значение — число, HTML-тегов нет.',
    ],
  },
  {
    slug: 'morphing-buttons',
    title: 'Morphing buttons (On / Off)',
    lead:
      'Нейроморфные кнопки-переключатели: «выпуклые» в покое, «утопленные» в нажатом состоянии. Пара On / Off работает как radio — активна только одна.',
    markup: `<div class="morph-pair">
  <button class="morph-btn on" type="button" aria-pressed="false"
          onclick="window.__galsComponents.toggleMorphPair(this)">On</button>
  <button class="morph-btn off" type="button" aria-pressed="false"
          onclick="window.__galsComponents.toggleMorphPair(this)">Off</button>
</div>

<style>
.morph-pair {
  display: flex; justify-content: center; align-items: center;
  gap: 20px; padding: 24px; background: #ececec;
  border-radius: 7px;
}
.morph-btn {
  height: 80px; width: 80px; border: 5px solid #ececec; border-radius: 20px;
  background: #ececec;
  box-shadow: -8px -8px 15px rgba(255,255,255,.65), 8px 8px 15px rgba(70,70,70,.12),
       inset -8px -8px 15px rgba(255,255,255,.65), inset 7px 7px 15px rgba(70,70,70,.12);
  font-family: inherit; font-weight: 100; font-size: 25px; color: #555;
  cursor: pointer; outline: none; transition: box-shadow .3s, color .3s, text-shadow .3s;
}
.morph-btn.on:hover { color: #1d4ed8; }
.morph-btn.off:hover { color: #c0392b; }
.morph-btn.on.is-pressed {
  background: rgba(0,0,250,.15); color: #1d4ed8;
  box-shadow: inset -8px -8px 15px rgba(255,255,255,.65),
       inset 8px 8px 15px rgba(70,70,70,.12);
}
.morph-btn.off.is-pressed {
  background: rgba(250,0,0,.15); color: #c0392b;
  box-shadow: inset -8px -8px 15px rgba(255,255,255,.65),
       inset 8px 8px 15px rgba(70,70,70,.12);
}
.morph-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(133,18,209,.5);
  outline: none;
}
</style>`,
    demo: `<style>
  .demo-mp-box {
    display: flex; justify-content: center; align-items: center;
    gap: 20px; height: 120px; width: 250px; max-width: 100%;
    background: #ececec; border-radius: 5px;
    box-shadow: -8px -8px 18px rgba(255,255,255,.7), 8px 8px 18px rgba(70,70,70,.15);
  }
  .demo-mp-btn {
    height: 80px; width: 80px; border: 5px solid #ececec; border-radius: 20px;
    background: #ececec;
    box-shadow: -8px -8px 15px rgba(255,255,255,.65), 8px 8px 15px rgba(70,70,70,.12),
     inset -8px -8px 15px rgba(255,255,255,.65), inset 7px 7px 15px rgba(70,70,70,.12);
    font-family: inherit; font-weight: 100; font-size: 25px; color: #555;
    cursor: pointer; outline: none; transition: box-shadow .3s, color .3s;
  }
  .demo-mp-btn.on:hover { color: #1d4ed8; }
  .demo-mp-btn.off:hover { color: #c0392b; }
  .demo-mp-btn.on.is-pressed {
    background: rgba(0,0,250,.15); color: #1d4ed8;
    box-shadow: inset -8px -8px 15px rgba(255,255,255,.65), inset 8px 8px 15px rgba(70,70,70,.12);
  }
  .demo-mp-btn.off.is-pressed {
    background: rgba(250,0,0,.15); color: #c0392b;
    box-shadow: inset -8px -8px 15px rgba(255,255,255,.65), inset 8px 8px 15px rgba(70,70,70,.12);
  }
  .demo-mp-btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(133,18,209,.5);
    outline: none;
  }
</style>
<div style="display:flex;justify-content:center">
  <div class="demo-mp-box" id="demo-mp-box">
    <button class="demo-mp-btn on" type="button" aria-pressed="false"
            onclick="window.__galsComponents.toggleMorphPair(this)">On</button>
    <button class="demo-mp-btn off" type="button" aria-pressed="false"
            onclick="window.__galsComponents.toggleMorphPair(this)">Off</button>
  </div>
</div>`,
    caption: 'Нажмите On или Off — активна только одна кнопка.',
    notes: [
      'В исходнике оба кнопки независимы — можно «вдавить» обе одновременно. Здесь пара работает как radio: нажатие одной сбрасывает другую.',
      'Каждая кнопка имеет <code>aria-pressed</code> для скринридеров. Пару переключает runtime-хелпер <code>toggleMorphPair</code>.',
      'Исходный код был частью лендинга-демо; в компоненте выделена только пара кнопок — полный лендинг см. в Features «Morphing style landing».',
      'Цвета blue/red на #ececec проходят AA для крупного текста (25px) — мелкий текст таких цветов требует темнее.',
    ],
  },
  {
    slug: 'morphing-checked-button',
    title: 'Morphing checked button',
    lead:
      'Нейроморфная кнопка-переключатель с индикатором: <code>:has()</code> без JavaScript — состояние «включено» меняет тень и свечение индикатора.',
    markup: `<div class="neu-toggle">
  <span class="indicator" aria-hidden="true"></span>
  <label class="toggle">
    <input type="checkbox" role="switch">
    <span class="label">On</span>
  </label>
</div>

<style>
.neu-toggle {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.indicator {
  width: 16px; height: 16px; border-radius: 50%;
  background: #8a8a8a;
  box-shadow: inset 0 1px 3px rgba(0,0,0,.25);
  transition: background .3s, box-shadow .3s, transform .25s;
}
.neu-toggle:has(input:checked) .indicator {
  background: #55f696;
  box-shadow: 0 0 12px rgba(85,246,150,.85);
  transform: scale(1.15);
}
.toggle {
  width: 140px; height: 140px; background: #ececec;
  border-radius: 22px;
  box-shadow: -8px -8px 16px rgba(255,255,255,.7), 8px 8px 16px rgba(70,70,70,.15);
  cursor: pointer; transition: box-shadow .35s, transform .2s;
}
.toggle:hover { transform: translateY(-2px); }
.toggle:has(input:checked) {
  box-shadow: inset -6px -6px 12px rgba(255,255,255,.7),
       inset 6px 6px 12px rgba(70,70,70,.15);
  transform: translateY(0);
}
.toggle input { position: absolute; inset: 0; opacity: 0; cursor: pointer; margin: 0; }
.toggle .label {
  position: relative; z-index: 1; font-size: 28px; font-weight: 300;
  letter-spacing: 1px; color: #555; pointer-events: none;
  text-shadow: -1px -1px 2px rgba(255,255,255,.95), 2px 2px 3px rgba(70,70,70,.35);
  transition: color .3s, text-shadow .3s;
}
.toggle:has(input:checked) .label {
  color: #2ecc71;
  text-shadow: -1px -1px 1px rgba(255,255,255,.6), 1px 1px 2px rgba(46,204,113,.4),
   0 0 14px rgba(85,246,150,.7);
}
.toggle:has(input:focus-visible) {
  box-shadow: -8px -8px 16px rgba(255,255,255,.7), 8px 8px 16px rgba(70,70,70,.15), 0 0 0 3px rgba(133,18,209,.5);
  outline: none;
}
</style>`,
    demo: `<style>
  .demo-mcb {
    display: flex; flex-wrap: wrap; gap: 36px; justify-content: center;
    background: #ececec; padding: 32px; border-radius: 7px;
  }
  .demo-mcb-group {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .demo-mcb-ind {
    width: 16px; height: 16px; border-radius: 50%;
    background: #8a8a8a;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.25);
    transition: background .3s, box-shadow .3s, transform .25s;
  }
  .demo-mcb-group:has(input:checked) .demo-mcb-ind {
    background: #55f696; box-shadow: 0 0 12px rgba(85,246,150,.85); transform: scale(1.15);
  }
  .demo-mcb-btn {
    width: 140px; height: 140px; background: #ececec; border-radius: 22px;
    box-shadow: -8px -8px 16px rgba(255,255,255,.7), 8px 8px 16px rgba(70,70,70,.15);
    cursor: pointer; transition: box-shadow .35s, transform .2s;
    display: flex; align-items: center; justify-content: center;
  }
  .demo-mcb-btn:hover { transform: translateY(-2px); }
  .demo-mcb-btn:has(input:checked) {
    box-shadow: inset -6px -6px 12px rgba(255,255,255,.7), inset 6px 6px 12px rgba(70,70,70,.15);
    transform: translateY(0);
  }
  .demo-mcb-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; margin: 0; }
  .demo-mcb-btn .label {
    position: relative; z-index: 1; font-size: 28px; font-weight: 300;
    letter-spacing: 1px; color: #555; pointer-events: none;
    text-shadow: -1px -1px 2px rgba(255,255,255,.95), 2px 2px 3px rgba(70,70,70,.35);
    transition: color .3s, text-shadow .3s;
  }
  .demo-mcb-btn:has(input:checked) .label {
    color: #2ecc71;
    text-shadow: -1px -1px 1px rgba(255,255,255,.6), 1px 1px 2px rgba(46,204,113,.4), 0 0 14px rgba(85,246,150,.7);
  }
  .demo-mcb-btn:has(input:focus-visible) {
    box-shadow: -8px -8px 16px rgba(255,255,255,.7), 8px 8px 16px rgba(70,70,70,.15), 0 0 0 3px rgba(133,18,209,.5);
    outline: none;
  }
</style>
<div class="demo-mcb">
  <div class="demo-mcb-group">
    <span class="demo-mcb-ind" aria-hidden="true"></span>
    <label class="demo-mcb-btn">
      <input type="checkbox" role="switch">
      <span class="label">On</span>
    </label>
  </div>
  <div class="demo-mcb-group">
    <span class="demo-mcb-ind" aria-hidden="true"></span>
    <label class="demo-mcb-btn">
      <input type="checkbox" role="switch">
      <span class="label">Off</span>
    </label>
  </div>
</div>`,
    caption: 'Нажмите — кнопка «вдавливается», индикатор светится.',
    notes: [
      'В исходнике состояние переключалось через <code>classList</code> на JS-обработчике — здесь чистый CSS <code>:has()</code> (Chrome 105+, Safari 15.4+, Firefox 121+). В более старом Firefox индикатор не светится, но переключение работает.',
      '<code>role="switch"</code> сообщает скринридеру, что это переключатель, а не чекбокс с двойным кликом.',
      'Фокус-кольцо <code>:focus-visible</code> обязательно — инпут скрыт через <code>opacity: 0</code>, без него клавиатурная навигация «слепая».',
      'Индикатор для Off по умолчанию красный — это стилистический приём, но с точки зрения доступности красный ассоциируется с ошибкой. Для продакшена используйте серый по умолчанию.',
    ],
  },
];

const makePage = (d, extraBlocks = []) =>
  page({
    title: d.title,
    lead: d.lead,
    blocks: [
      { id: 'usage', label: 'Usage', html: codeBlock(d.markup) },
      { id: 'demo', label: 'Live demo', html: demo(d.demo, d.caption || '') },
      {
        id: 'notes',
        label: 'Notes',
        html: d.notes.map((n) => `<p>${n}</p>`).join('\n'),
      },
      ...(d.gallery || []).map((item, i) => ({
        id: `example-${i + 1}`,
        label: item.title,
        html:
          `<p>${item.lead}</p>\n` +
          codeBlock(item.markup) +
          demo(item.demo, item.caption || '') +
          (item.run
            ? `<p><button class="btn btn-primary" type="button"
                onclick="window.__galsFeatures.${item.run}()">Run animation</button></p>`
            : '') +
          (item.notes
            ? item.notes.map((n) => `<p>${n}</p>`).join('\n')
            : ''),
      })),
      ...extraBlocks,
    ],
  });

const pages = Object.fromEntries(DEF.map((d) => [d.slug, makePage(d)]));

/** Один общий раздел внизу страницы кнопок, чтобы список был обозрим. */
pages.buttons = makePage(
  DEF.find((d) => d.slug === 'buttons'),
  [
    {
      id: 'native',
      label: 'Native escape hatches',
      html: table(
        ['Component', 'Native escape hatch'],
        [
          ['Accordion', '<code>&lt;details&gt;</code>'],
          ['Dropdown', '<code>popover</code> attribute'],
          ['Modal', '<code>&lt;dialog&gt;</code>'],
          ['Progress', '<code>&lt;progress&gt;</code>'],
          ['Tabs', 'radios + <code>:checked</code>'],
        ],
      ),
    },
  ]
);

export default pages;
