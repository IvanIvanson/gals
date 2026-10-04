import { page, codeBlock, demo } from './page.js';

/**
 * Раздел «Features»: небольшие готовые рецепты, дополняющие компоненты.
 *
 * Каждая фича — живое демо плюс код. Где нужен JS сверх фреймворка,
 * он прикрепляется к window.__galsFeatures и вызывается из inline-атрибутов.
 * Это принципиально: <script> внутри innerHTML браузер не выполняет.
 */

/* ============================================================
 *  Runtime-хелперы
 * ============================================================ */

const drawLineChart = (canvasId, rawPoints) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const points = rawPoints.map(([x, y]) => [x * (W / 12), H - y * (H / 10)]);

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(133, 18, 209, .12)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += W / 12) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += H / 10) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.strokeStyle = '#8512d1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();

  ctx.fillStyle = '#8512d1';
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
};

const loadChartJs = () =>
  new Promise((resolve, reject) => {
    if (window.Chart) return resolve(window.Chart);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.onload = () => resolve(window.Chart);
    s.onerror = () => reject(new Error('Chart.js failed to load'));
    document.head.appendChild(s);
  });

const drawChartJs = async (canvasId, tableId) => {
  const Chart = await loadChartJs();
  const table = document.getElementById(tableId);
  if (!table) return;

  const labels = [];
  const line1 = [];
  const line2 = [];
  const bars = [];

  table.querySelectorAll('tbody tr').forEach((row) => {
    labels.push(row.cells[0].textContent.trim());
    line1.push(Number(row.cells[1].textContent) || 0);
    line2.push(Number(row.cells[2].textContent) || 0);
    bars.push(Number(row.cells[3].textContent) || 0);
  });

  const canvas = document.getElementById(canvasId);
  if (canvas._chart) canvas._chart.destroy();

  canvas._chart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Series A', type: 'line', data: line1, borderColor: '#8512d1', fill: false },
        { label: 'Series B', type: 'line', data: line2, borderColor: '#2a9d4a', fill: false },
        { label: 'Bars', data: bars, backgroundColor: 'rgba(133,18,209,.15)' },
      ],
    },
    options: { scales: { y: { beginAtZero: true } } },
  });
};

const showToast = (message, duration = 3000) => {
  const toast = document.createElement('div');
  toast.className = 'gals-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('gals-toast-show'));
  setTimeout(() => {
    toast.classList.remove('gals-toast-show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
};

const drawQuadratic = (canvasId, a, b, c) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const scaleX = W / 20;
  const scaleY = H / 20;
  const xAxis = W / 2;
  const yAxis = H / 2;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += scaleX) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += scaleY) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.strokeStyle = '#d1495b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xAxis, 0); ctx.lineTo(xAxis, H);
  ctx.moveTo(0, yAxis); ctx.lineTo(W, yAxis);
  ctx.stroke();

  ctx.strokeStyle = '#8512d1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= W; px += 1) {
    const x = (px - xAxis) / scaleX;
    const y = a * x * x + b * x + c;
    const py = yAxis - y * scaleY;
    if (!started) { ctx.moveTo(px, py); started = true; }
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const disc = b * b - 4 * a * c;
  const out = document.getElementById(canvasId + '-out');
  if (!out) return;
  if (disc < 0 || a === 0) {
    out.textContent = a === 0 ? 'a ≠ 0 — иначе это не парабола' : 'действительных корней нет';
  } else {
    const x1 = (-b + Math.sqrt(disc)) / (2 * a);
    const x2 = (-b - Math.sqrt(disc)) / (2 * a);
    out.textContent = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
  }
};

const calcDistance = (canvasId, x1, y1, x2, y2) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const scale = 12;
  const cx = W / 2;
  const cy = H / 2;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
  ctx.moveTo(0, cy); ctx.lineTo(W, cy);
  ctx.stroke();

  const px1 = cx + x1 * scale, py1 = cy - y1 * scale;
  const px2 = cx + x2 * scale, py2 = cy - y2 * scale;

  ctx.strokeStyle = '#8512d1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px1, py1);
  ctx.lineTo(px2, py2);
  ctx.stroke();

  ctx.fillStyle = '#d1495b';
  [[px1, py1], [px2, py2]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#222';
  ctx.font = '13px sans-serif';
  ctx.fillText(`A(${x1}, ${y1})`, px1 + 8, py1 - 8);
  ctx.fillText(`B(${x2}, ${y2})`, px2 + 8, py2 - 8);

  const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const out = document.getElementById(canvasId + '-out');
  if (out) out.textContent = `D = ${d.toFixed(2)}`;
};

/* ---------- Basket counter ---------- */
let basketCount = 0;

const basketInc = () => {
  basketCount += 1;
  const el = document.getElementById('bk-out');
  if (el) el.textContent = basketCount;
};

const basketReset = () => {
  const modal = document.getElementById('bk-modal');
  if (basketCount === 0) {
    if (modal) modal.showModal();
    return;
  }
  basketCount = 0;
  const el = document.getElementById('bk-out');
  if (el) el.textContent = '0';
};

/* ---------- Cards from array ---------- */
const renderCardsFromArray = () => {
  const app = document.getElementById('cards-from-array-demo');
  if (!app) return;

  const people = [
    { id: 1, name: 'Tommy',  age: 23, color: '#8512d1' },
    { id: 2, name: 'John',   age: 26, color: '#2a9d4a' },
    { id: 3, name: 'Rachel', age: 28, color: '#d1495b' },
    { id: 4, name: 'Alice',  age: 31, color: '#b57d0a' },
  ];

  const avatar = (color, letter) =>
    'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">' +
      '<circle cx="30" cy="30" r="30" fill="' + color + '"/>' +
      '<text x="30" y="38" text-anchor="middle" fill="#fff" ' +
      'font-size="24" font-family="sans-serif">' + letter + '</text>' +
      '</svg>'
    );

  app.innerHTML = people.map((p) =>
    '<div class="card-item">' +
      '<img src="' + avatar(p.color, p.name[0]) + '" alt="">' +
      '<h3>' + p.name + '</h3>' +
      '<p>ID: ' + p.id + ' · age: ' + p.age + '</p>' +
    '</div>'
  ).join('');
};

/* ---------- Card read more ---------- */
const toggleReadMore = (btn) => {
  const card = btn.closest('.rc-card');
  if (!card) return;
  const dots = card.querySelector('.rc-dots');
  const more = card.querySelector('.rc-more');
  const expanded = card.classList.toggle('expanded');
  if (dots) dots.style.display = expanded ? 'none' : 'inline';
  if (more) more.style.display = expanded ? 'inline' : 'none';
  btn.textContent = expanded ? 'Show less' : 'Read more';
};

/* ---------- Interactive canvas ---------- */
let icPoints = [];

const drawIcCanvas = () => {
  const canvas = document.getElementById('ic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#d1495b';
  ctx.beginPath();
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
  ctx.stroke();

  if (icPoints.length) {
    ctx.strokeStyle = '#8512d1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    icPoints.forEach(([x, y], i) => {
      const px = W / 2 + x * 20;
      const py = H / 2 - y * 20;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    });
    ctx.stroke();

    icPoints.forEach(([x, y]) => {
      const px = W / 2 + x * 20;
      const py = H / 2 - y * 20;
      ctx.fillStyle = '#8512d1';
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.font = '12px sans-serif';
      ctx.fillText('(' + x + ',' + y + ')', px + 8, py - 6);
    });
  }

  const legendEl = document.getElementById('ic-legend');
  ctx.fillStyle = 'orange';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(legendEl ? legendEl.value : '', 20, 28);
};

const addIcPoint = () => {
  const xEl = document.getElementById('ic-x');
  const yEl = document.getElementById('ic-y');
  if (!xEl || !yEl) return;
  const x = Number(xEl.value) || 0;
  const y = Number(yEl.value) || 0;
  icPoints.push([x, y]);
  drawIcCanvas();
};

const resetIcPoints = () => {
  icPoints = [];
  drawIcCanvas();
};

window.__galsFeatures = {
  drawLineChart,
  drawChartJs,
  showToast,
  drawQuadratic,
  calcDistance,
  basketInc,
  basketReset,
  renderCardsFromArray,
  toggleReadMore,
  addIcPoint,
  resetIcPoints,
};

/* ============================================================
 *  Определения фич
 * ============================================================ */

const DEF = [
  /* ---------- Уведомления ---------- */

  {
    slug: 'toast',
    title: 'Toast notification',
    lead: 'Всплывающее уведомление поверх страницы. Создаётся одной функцией, исчезает по таймеру.',
    markup: `function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'gals-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('gals-toast-show'));
  setTimeout(() => {
    toast.classList.remove('gals-toast-show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}`,
    demo: `<style>
  .gals-toast {
    position: fixed; left: 50%; bottom: 30px; transform: translateX(-50%) translateY(30px);
    background: #222; color: #fff; padding: 12px 22px; border-radius: 8px;
    font: 14px/1.4 system-ui, sans-serif; opacity: 0; transition: opacity .25s, transform .25s;
    z-index: 9999; box-shadow: 0 6px 24px rgba(0,0,0,.25); max-width: 90vw;
  }
  .gals-toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
<button class="btn btn-primary" type="button"
        onclick="window.__galsFeatures.showToast('Changes saved.')">
  Show toast
</button>`,
    caption: 'Кликните: уведомление появится внизу экрана и исчезнет через 3 секунды.',
    notes: [
      '<code>role="status"</code> — вежливое объявление. Для критичного используйте <code>role="alert"</code>.',
      'Один toast за раз: очередь из пяти — это уже спам.',
      'Автозакрытие отменяется, если поднести курсор — иначе пользователь не успеет прочитать.',
    ],
  },
  {
    slug: 'dismissible-alert',
    title: 'Dismissible alert',
    lead: 'Alert из gals.css плюс кнопка закрытия. Никакого Bootstrap — те же токены, те же классы.',
    markup: `<div class="alert alert-info" id="save-alert" role="status">
  <span>Please click on the Basket button for result.</span>
  <button class="btn" type="button"
          onclick="document.getElementById('save-alert').remove()"
          aria-label="Dismiss">&times;</button>
</div>`,
    demo: `<div class="alert alert-info" id="demo-alert-1" role="status"
           style="display:flex;justify-content:space-between;align-items:center;gap:1em">
  <span>Please click on the Basket button for result.</span>
  <button class="btn" type="button"
          onclick="document.getElementById('demo-alert-1').remove()"
          aria-label="Dismiss">&times;</button>
</div>`,
    caption: 'Кнопка закрытия — обычный .btn; логика удаления — одна строка JS.',
    notes: [
      '<code>role="status"</code> вежлив для скринридера. Для важного — <code>role="alert"</code>.',
      'Кнопка закрытия несёт <code>aria-label</code>: значок «×» без подписи читается как «times».',
      'Если алерт можно закрыть, он не должен быть единственным носителем важного.',
    ],
  },

  /* ---------- Меню ---------- */

  {
    slug: 'dropdown-menu',
    title: 'Dropdown menu',
    lead: 'Выпадающее меню профиля: карточка раскрывается по клику на стрелку, список пунктов появляется плавно.',
    markup: `<div class="profile-card" id="profile">
  <div class="profile-head">
    <div class="profile-avatar">
      <img src="avatar.jpg" alt="">
    </div>
    <h2>Jane Doe<br><span>Website Designer</span></h2>
    <button class="profile-toggle" type="button" aria-expanded="false">&rsaquo;</button>
  </div>
  <ul class="profile-nav">
    <li><a href="#">Edit Profile</a></li>
    <li><a href="#">Inbox</a></li>
    <li><a href="#">Settings</a></li>
    <li><a href="#">Logout</a></li>
  </ul>
</div>`,
    demo: `<style>
  .pf-demo { display:flex; justify-content:center; padding: 1em 0; }
  .pf-card {
    position: relative; width: 300px; background:#fff; border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,.12);
    padding: 16px 20px; overflow: hidden;
    transition: max-height .4s ease;
    max-height: 100px;
    font-family: system-ui, sans-serif;
  }
  .pf-card.is-open { max-height: 420px; }
  .pf-head { display: flex; align-items: center; gap: 14px; }
  .pf-avatar {
    width: 56px; height: 56px; border-radius: 50%; overflow: hidden; flex: none;
    background: #eee;
  }
  .pf-avatar img { width:100%; height:100%; object-fit: cover; display: block; }
  .pf-head h2 { font-size: 15px; margin: 0; line-height: 1.2; color:#111; font-weight: 600; }
  .pf-head h2 span { font-size: 12px; color:#999; font-weight: 400; }
  .pf-toggle {
    margin-left: auto; width: 32px; height: 32px; border-radius: 50%;
    background:#f5f5f5; border: none; cursor: pointer; font-size: 20px; line-height: 1;
    color:#555; transition: transform .3s;
  }
  .pf-card.is-open .pf-toggle { transform: rotate(-90deg); }
  .pf-nav { list-style:none; padding: 12px 0 0; margin: 0; border-top: 1px solid #eee; margin-top: 14px; }
  .pf-nav li { margin: 6px 0; }
  .pf-nav a {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 4px; color:#555; text-decoration: none; font-size: 14px;
    border-radius: 6px; transition: color .2s, background .2s;
  }
  .pf-nav a:hover { color: #8512d1; background: #f7f0ff; }
</style>
<div class="pf-demo">
  <div class="pf-card" id="pf-demo-card">
    <div class="pf-head">
      <div class="pf-avatar">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%238512d1'/><circle cx='50' cy='38' r='18' fill='%23fff'/><ellipse cx='50' cy='85' rx='30' ry='22' fill='%23fff'/></svg>" alt="">
      </div>
      <h2>Jane Doe<br><span>Website Designer</span></h2>
      <button class="pf-toggle" type="button" aria-expanded="false"
              onclick="
                const c = document.getElementById('pf-demo-card');
                const open = c.classList.toggle('is-open');
                this.setAttribute('aria-expanded', String(open));
              ">&rsaquo;</button>
    </div>
    <ul class="pf-nav">
      <li><a href="#">Edit Profile</a></li>
      <li><a href="#">Inbox</a></li>
      <li><a href="#">Settings</a></li>
      <li><a href="#">Support</a></li>
      <li><a href="#">Logout</a></li>
    </ul>
  </div>
</div>`,
    caption: 'Кликните стрелку: карточка раскрывается, список пунктов появляется.',
    notes: [
      'Раскрытие через <code>max-height</code> — просто и предсказуемо. Для тяжёлых меню лучше <code>grid-template-rows: 0fr / 1fr</code>.',
      'Кнопка несёт <code>aria-expanded</code>, состояние которого меняется синхронно с классом.',
      'Иконки соцсетей заменены на SVG в data-URL — никакого Ionicons с CDN.',
    ],
  },
  {
    slug: 'hamburger',
    title: 'Animated hamburger',
    lead: 'SVG-гамбургер, превращающийся в крестик. Только SVG и <code>&lt;animate&gt;</code> — ни строчки JavaScript.',
    markup: `<svg viewBox="0 0 100 100" class="hamburger-demo">
  <path fill="none" stroke="#8512d1" stroke-width="10"
        d="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20">
    <animate attributeName="d"
             values="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20;
                     M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20"
             dur=".5s" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d"
             values="M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20;
                     M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20"
             dur=".5s" begin="backToMenu.click" fill="freeze"/>
  </path>
  <path id="backToMenu" d="M 0 0 h0v0h0z" fill="rgba(0,0,0,0)"/>
  <path id="menuBtn"     d="M 0 0 h100v100h-100z" fill="rgba(0,0,0,0)"/>
</svg>`,
    demo: `<svg viewBox="0 0 100 100" width="100" height="100" class="hamburger-demo">
  <path fill="none" stroke="#8512d1" stroke-width="10"
        d="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20">
    <animate attributeName="d"
             values="M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20;
                     M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20"
             dur=".5s" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d"
             values="M 20 20 C 37 37 37 37 50 50 C 63 37 63 37 80 20;
                     M 20 20 C 24 20 36 20 50 20 C 64 20 76 20 80 20"
             dur=".5s" begin="backToMenu.click" fill="freeze"/>
  </path>
  <path fill="none" stroke="#8512d1" stroke-width="10" d="M 20 50 h 60">
    <animate attributeName="d" values="M 20 50 h 60; M 50 50 h 0"
             dur=".5s" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d" values="M 50 50 h 0; M 20 50 h 60"
             dur=".5s" begin="backToMenu.click" fill="freeze"/>
  </path>
  <path fill="none" stroke="#8512d1" stroke-width="10"
        d="M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80">
    <animate attributeName="d"
             values="M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80;
                     M 20 80 C 37 63 37 63 50 50 C 63 63 63 63 80 80"
             dur=".5s" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d"
             values="M 20 80 C 37 63 37 63 50 50 C 63 63 63 63 80 80;
                     M 20 80 C 24 80 36 80 50 80 C 64 80 76 80 80 80"
             dur=".5s" begin="backToMenu.click" fill="freeze"/>
  </path>
  <path id="backToMenu" d="M 0 0 h0v0h0z" fill="rgba(0,0,0,0)">
    <animate attributeName="d" values="M 0 0 h0v0h0z; M 0 0 h100v100h-100z"
             dur="1ms" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d" values="M 0 0 h100v100h-100z; M 0 0 h0v0h0z"
             dur="1ms" begin="backToMenu.click" fill="freeze"/>
  </path>
  <path id="menuBtn" d="M 0 0 h100v100h-100z" fill="rgba(0,0,0,0)">
    <animate attributeName="d" values="M 0 0 h100v100h-100z; M 0 0 h0v0h0z"
             dur="1ms" begin="menuBtn.click" fill="freeze"/>
    <animate attributeName="d" values="M 0 0 h0v0h0z; M 0 0 h100v100h-100z"
             dur="1ms" begin="backToMenu.click" fill="freeze"/>
  </path>
</svg>`,
    caption: 'Кликните по квадрату: две прозрачные области переключают фазу анимации.',
    notes: [
      'Анимация декларативна: <code>begin="menuBtn.click"</code> привязывает её к клику по невидимой фигуре.',
      'SVG лучше пометить <code>aria-hidden="true"</code> — это декорация.',
      'Для реального меню рядом ставится <code>&lt;button&gt;</code> с <code>aria-expanded</code>.',
    ],
  },

  /* ---------- Всплывашки ---------- */

  {
    slug: 'tooltip',
    title: 'Tooltip',
    lead: 'Подсказка на hover и focus. Всё на CSS через <code>attr()</code> и <code>::after</code> — ни JS, ни библиотек.',
    markup: `<span class="tip" data-tip="Copies the code" tabindex="0">Copy</span>`,
    demo: `<style>
  .tip { position: relative; cursor: help; border-bottom: 1px dashed #8512d1; color:#8512d1; }
  .tip::after {
    content: attr(data-tip);
    position: absolute; bottom: calc(100% + 8px); left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #222; color: #fff; padding: 5px 10px; border-radius: 6px;
    font: 12px/1.3 system-ui, sans-serif; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity .15s, transform .15s;
  }
  .tip::before {
    content: ''; position: absolute; bottom: calc(100% + 3px); left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent; border-top-color: #222;
    opacity: 0; transition: opacity .15s;
  }
  .tip:hover::after, .tip:focus-visible::after,
  .tip:hover::before, .tip:focus-visible::before {
    opacity: 1; transform: translateX(-50%) translateY(0);
  }
</style>
<p>Hover <span class="tip" data-tip="Tooltip text" tabindex="0">this word</span> or focus it with Tab.</p>`,
    notes: [
      'Текст подсказки идёт через <code>attr(data-tip)</code> — HTML остаётся чистым.',
      '<code>tabindex="0"</code> нужен, чтобы подсказка открывалась на клавиатуре.',
      'Tooltip не должен нести важную информацию: скринридер может её проигнорировать.',
    ],
  },
  {
    slug: 'popover',
    title: 'Popover',
    lead: 'Нативная всплывашка через атрибут <code>popover</code>. Браузер сам даёт top-layer, Escape и light dismiss.',
    markup: `<button popovertarget="pop">Show popover</button>
<div id="pop" popover>
  Any content, floats above the page.
</div>`,
    demo: `<button class="btn btn-primary" type="button" popovertarget="demo-pop">
  Show popover
</button>
<div id="demo-pop" popover
     style="padding:20px;border-radius:12px;border:1px solid #cecece;max-width:320px;
            box-shadow:0 20px 40px rgba(0,0,0,.15);font:14px system-ui">
  <h3 style="margin:0 0 8px">Popover</h3>
  <p style="margin:0;color:#555">Закрывается по Escape, клику вне и повторному клику по кнопке.</p>
</div>`,
    notes: [
      'Атрибут <code>popover</code> даёт <code>top layer</code>, <code>light dismiss</code> и Escape — всё бесплатно.',
      '<code>popovertarget</code> связывает кнопку и popover без JS.',
      'Для подсказок на hover используйте tooltip; popover — это интерактивный контент.',
    ],
  },

  /* ---------- Тема ---------- */

  {
    slug: 'theme-switcher',
    title: 'Theme switcher',
    lead: 'Переключение светлой и тёмной темы через CSS-переменные и <code>data-</code>-атрибут на <code>&lt;html&gt;</code>.',
    markup: `html[data-gals-theme="dark"] {
  --paper: #1a1a1a;
  --ink: #f0f0f0;
  --line: #333;
  --accent: #b17ce0;
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.galsTheme === 'dark' ? 'light' : 'dark';
  root.dataset.galsTheme = next;
}`,
    demo: `<style>
  .theme-demo {
    padding: 20px; border-radius: 10px;
    background: var(--paper, #fff); color: var(--ink, #222);
    border: 1px solid var(--line, #cecece);
    transition: background .25s, color .25s, border-color .25s;
  }
  .theme-demo button { margin-right: 8px; }
</style>
<div class="theme-demo" id="theme-demo">
  <p style="margin-top:0">Этот блок читает переменные <code>--paper</code>, <code>--ink</code>, <code>--line</code>.</p>
  <button class="btn" type="button"
          onclick="
            const demo = document.getElementById('theme-demo');
            const isDark = demo.dataset.dark === 'true';
            demo.dataset.dark = String(!isDark);
            if (!isDark) {
              demo.style.setProperty('--paper', '#1a1a1a');
              demo.style.setProperty('--ink', '#f0f0f0');
              demo.style.setProperty('--line', '#333');
            } else {
              demo.style.removeProperty('--paper');
              demo.style.removeProperty('--ink');
              demo.style.removeProperty('--line');
            }
          ">
    Toggle theme
  </button>
</div>`,
    caption: 'В реальном проекте тема переключается на <code>&lt;html&gt;</code>, а не на блоке. Здесь — для наглядности.',
    notes: [
      'Один атрибут и один набор переменных — вся тема. Никаких <code>.dark .btn .something</code>.',
      'Сохраняйте выбор в <code>localStorage</code>, чтобы тема пережила перезагрузку.',
      'Уважайте <code>prefers-color-scheme</code> как значение по умолчанию.',
    ],
  },
  {
    slug: 'appearance-animation',
    title: 'Appearance animation',
    lead: 'Элементы появляются при попадании в вьюпорт через <code>IntersectionObserver</code>.',
    markup: `const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('appeared');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.appear').forEach((el) => io.observe(el));`,
    demo: `<style>
  .appear {
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s ease, transform .5s ease;
    padding: 16px; margin: 8px 0; background: #f0ecf7; border-radius: 8px;
    font: 14px system-ui; color:#333;
  }
  .appear.appeared { opacity: 1; transform: translateY(0); }
  .appear-demo { max-height: 200px; overflow-y: auto; }
</style>
<div class="appear-demo" id="appear-demo">
  <div class="appear">Блок 1</div>
  <div class="appear">Блок 2</div>
  <div class="appear">Блок 3</div>
  <div class="appear">Блок 4</div>
  <div class="appear">Блок 5</div>
  <div class="appear">Блок 6</div>
</div>
<button class="btn" type="button"
        onclick="
          document.querySelectorAll('#appear-demo .appear').forEach((el) => {
            el.classList.remove('appeared');
            void el.offsetWidth;
          });
          const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) { e.target.classList.add('appeared'); io.unobserve(e.target); }
            });
          }, { threshold: 0.15, root: document.getElementById('appear-demo') });
          document.querySelectorAll('#appear-demo .appear').forEach((el) => io.observe(el));
        ">
  Replay
</button>`,
    caption: 'Прокрутите демо-блок или нажмите Replay.',
    notes: [
      '<code>unobserve</code> после первого появления — экономит ресурсы.',
      '<code>root</code> можно указать, чтобы считать «вьюпорт» не окна, а контейнера.',
      'Для <code>prefers-reduced-motion</code> отключайте анимацию — это несложно и важно.',
    ],
  },

  /* ---------- Виджеты ---------- */

  {
    slug: 'basket-counter',
    title: 'Basket counter',
    lead: 'Счётчик на кнопке корзины: числовой <code>badge</code>, кнопка сброса и модальное подтверждение при попытке сбросить пустую корзину.',
    markup: `<button class="btn btn-primary" id="basket" type="button">
  Basket <span class="badge">0</span>
</button>
<button class="btn" id="reset" type="button">Reset</button>

<dialog id="confirm" class="modal">
  <form method="dialog">
    <p>Basket is already empty.</p>
    <button class="btn" value="ok">OK</button>
  </form>
</dialog>`,
    demo: `<style>
  .bk-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 22px; height: 22px; padding: 0 6px;
    background: #d1495b; color: #fff; border-radius: 999px;
    font: 700 12px/1 system-ui; margin-left: 8px;
  }
</style>
<div style="display:flex;gap:1em;align-items:center">
  <button class="btn btn-primary" type="button"
          onclick="window.__galsFeatures.basketInc()">
    Basket <span class="bk-badge" id="bk-out">0</span>
  </button>
  <button class="btn" type="button"
          onclick="window.__galsFeatures.basketReset()">Reset</button>
</div>

<dialog id="bk-modal" style="border:none;border-radius:10px;padding:20px;max-width:320px;box-shadow:0 20px 40px rgba(0,0,0,.2)">
  <form method="dialog">
    <p style="margin-top:0">Basket is empty — нечего сбрасывать.</p>
    <div style="text-align:right">
      <button class="btn btn-primary" value="ok">OK</button>
    </div>
  </form>
</dialog>`,
    caption: 'Кнопка Basket наращивает счётчик. Reset при нуле показывает модалку.',
    notes: [
      'Bootstrap-классы <code>badge</code>, <code>bg-danger</code>, <code>position-absolute</code> заменены на свои — 8 строк CSS.',
      'Модалка — нативный <code>&lt;dialog&gt;</code>, без библиотек.',
      'Счётчик в <code>aria-live="polite"</code>, если число обновляется без прямого действия пользователя.',
    ],
  },
  {
    slug: 'clipboard',
    title: 'Copy to clipboard',
    lead: 'Одна строка на современном API, с запасным путём через <code>textarea</code> для старых браузеров и <code>file://</code>.',
    markup: `<p id="copy-source">Lorem ipsum dolor sit amet</p>
<button class="btn" type="button"
        onclick="navigator.clipboard.writeText(
          document.getElementById('copy-source').textContent)">
  Copy
</button>`,
    demo: `<p id="demo-copy-source">Lorem ipsum dolor sit amet consectetur adipisicing</p>
<button class="btn" type="button"
        onclick="navigator.clipboard.writeText(document.getElementById('demo-copy-source').textContent)
                 .then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500); })
                 .catch(() => this.textContent = 'Failed')">
  Copy
</button>`,
    caption: 'navigator.clipboard доступен только в защищённом контексте (https или localhost).',
    notes: [
      'На <code>file://</code> и в старых браузерах <code>navigator.clipboard</code> нет — фолбэк через <code>document.execCommand("copy")</code>.',
      'Подтверждение словом, а не всплывашкой: «Copied!» рядом с кнопкой читается мгновенно.',
      'Скопированный текст нельзя проверить — не обещайте пользователю больше, чем скопировали.',
    ],
  },
  {
    slug: 'toggle',
    title: 'Neumorphic toggle',
    lead: 'Мягкий переключатель на чистом CSS: <code>:checked</code> и <code>box-shadow</code>.',
    markup: `<label class="neu-switch">
  <input type="checkbox" role="switch">
  <span class="neu-track"></span>
  <span class="neu-label">Autoplay</span>
</label>`,
    demo: `<style>
  .neu-demo { background:#ececec; padding:24px; display:flex; justify-content:center; }
  .neu-switch { display:inline-flex; align-items:center; gap:1em; cursor:pointer; }
  .neu-switch input { position:absolute; opacity:0; pointer-events:none; }
  .neu-track {
    width: 64px; height: 34px; border-radius: 20px;
    background: #ececec; position: relative;
    box-shadow: inset 4px 4px 8px rgba(70,70,70,.15), inset -4px -4px 8px rgba(255,255,255,.9);
    transition: box-shadow .2s;
  }
  .neu-track::after {
    content:""; position:absolute; top:4px; left:4px;
    width:26px; height:26px; border-radius:50%; background:#ececec;
    box-shadow: 3px 3px 6px rgba(70,70,70,.25), -3px -3px 6px rgba(255,255,255,.9);
    transition: transform .2s, box-shadow .2s;
  }
  .neu-switch input:checked + .neu-track::after { transform: translateX(30px); box-shadow: 0 0 8px rgba(133,18,209,.35); }
  .neu-switch input:focus-visible + .neu-track { outline: 2px solid #8512d1; outline-offset: 3px; }
  .neu-label { font: 500 15px/1 "Montserrat", sans-serif; color:#555; }
</style>
<div class="neu-demo">
  <label class="neu-switch">
    <input type="checkbox" role="switch">
    <span class="neu-track" aria-hidden="true"></span>
    <span class="neu-label">Autoplay</span>
  </label>
</div>`,
    notes: [
      '<code>role="switch"</code> отличает переключатель от чекбокса: он применяется мгновенно.',
      'Фокус-кольцо обязательно — без него навигация вслепую.',
      'Неоновый стиль — надстройка; базовое поведение и доступность от него не зависят.',
    ],
  },
  {
    slug: 'styled-range',
    title: 'Styled range',
    lead: 'Ползунок в неоновом стиле на <code>accent-color</code> и тенях — без вендорных префиксов.',
    markup: `<label for="gap">Gutter <output id="gap-out">5</output> px</label>
<input class="range" id="gap" type="range" min="0" max="40" value="5"
       oninput="gap-out.value = this.value">`,
    demo: `<div class="field" style="max-width:26em">
  <label for="demo-gap">Gutter <output id="demo-gap-out">5</output> px</label>
  <input class="range" id="demo-gap" type="range" min="0" max="40" value="5"
         style="accent-color:#8512d1"
         oninput="document.getElementById('demo-gap-out').value = this.value">
</div>`,
    notes: [
      '<code>step</code> задавайте явно — клавиатурный пользователь должен знать, куда попадает.',
      '<code>output</code> связан с полем по <code>for</code> — значение дублируется текстом.',
      '<code>input</code> стреляет десятки раз в секунду — тяжёлые вычисления дебаунсите.',
    ],
  },

  /* ---------- Анимации ---------- */

  {
    slug: 'bounce',
    title: 'Bounce animation',
    lead: 'Отскок элемента при наведении. Раньше был jQuery — теперь чистый CSS и <code>classList</code>.',
    markup: `<h1 class="bounce-title" onmouseover="this.classList.add('bounce')">Bounce animation</h1>
<div class="bounce-box" onmouseover="this.classList.add('bounce')"></div>`,
    demo: `<style>
  @keyframes bounce-y {
    20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    70% { transform: translateY(-15px); }
    90% { transform: translateY(-4px); }
  }
  .bounce { animation: bounce-y 1s linear; }
  .bounce-demo-box {
    width: 200px; height: 120px; background: yellowgreen; margin: 30px auto 0;
    cursor: pointer; border-radius: 6px;
  }
  .bounce-demo-title {
    text-align: center; cursor: pointer; padding: 10px;
    user-select: none; margin: 0 0 10px;
  }
</style>
<h1 class="bounce-demo-title" onmouseover="this.classList.add('bounce')">Bounce animation</h1>
<div class="bounce-demo-box" onmouseover="this.classList.add('bounce')"></div>`,
    caption: 'Наведите курсор на заголовок и на блок.',
    notes: [
      'jQuery больше не нужен: <code>classList.add</code> делает то же самое.',
      'Класс снимается через <code>animationend</code>, если нужно повторять эффект.',
      'Под <code>prefers-reduced-motion</code> анимацию лучше отключить.',
    ],
  },
  {
    slug: 'bounce-cube',
    title: 'Bounce cube',
    lead: 'Куб прыгает и приседает, меняя форму в точке удара. Только <code>@keyframes</code>, без JS.',
    markup: `<div class="stage">
  <div class="cube"></div>
</div>

@keyframes bounce-cube {
  0%   { transform: scale(1, 1)     translateY(0); }
  10%  { transform: scale(1.1, .9)  translateY(0); }
  30%  { transform: scale(.9, 1.1)  translateY(-100px); }
  50%  { transform: scale(1, 1)     translateY(0); }
  100% { transform: scale(1, 1)     translateY(0); }
}`,
    demo: `<style>
  @keyframes bounce-cube {
    0%   { transform: scale(1, 1)     translateY(0); }
    10%  { transform: scale(1.1, .9)  translateY(0); }
    30%  { transform: scale(.9, 1.1)  translateY(-100px); }
    50%  { transform: scale(1, 1)     translateY(0); }
    100% { transform: scale(1, 1)     translateY(0); }
  }
  .cube-stage {
    height: 220px; display: flex; align-items: flex-end;
    border-bottom: 3px solid #444; padding-bottom: 0; margin: 0 auto; max-width: 360px;
  }
  .cube {
    width: 100px; height: 100px; background: #F44336; margin: 0 auto;
    transform-origin: bottom;
    animation: bounce-cube 2s ease infinite;
  }
</style>
<div class="cube-stage">
  <div class="cube"></div>
</div>`,
    notes: [
      '<code>transform-origin: bottom</code> — точка сжатия внизу, поэтому куб не смещается по горизонтали.',
      'Один <code>transform</code> на кадр: scale и translateY вместе, без <code>left/top</code>.',
      'Бесконечная анимация на странице — только одна. Это правило здоровья вёрстки.',
    ],
  },

  /* ---------- Карточки ---------- */

  {
    slug: 'card-3d',
    title: 'Card 3D',
    lead: 'Три карточки, сложенные в стопку под углом, разворачиваются в ряд при наведении на контейнер.',
    markup: `<div class="deck">
  <div class="deck-card" style="--i:-1">
    <svg><!-- brush icon --></svg>
    Design
  </div>
  <div class="deck-card" style="--i:0">
    <svg><!-- code icon --></svg>
    Code
  </div>
  <div class="deck-card" style="--i:1">
    <svg><!-- rocket icon --></svg>
    Launch
  </div>
</div>`,
    demo: `<style>
  .deck {
    position: relative; width: 100%; max-width: 640px; height: 240px;
    margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;
  }
  .deck-card {
    position: absolute; top: calc(50% - 90px); left: 50%;
    width: 170px; height: 170px; background: #333; color: #fff;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px;
    transform: translateX(-50%) translateY(calc(24px * var(--i))) rotate(35deg) skew(-15deg, -8deg) scale(.7);
    box-shadow: 20px 20px 60px rgba(0,0,0,.2);
    z-index: calc(-1 * var(--i));
    transition: transform .5s ease, opacity .5s ease;
    border-radius: 10px;
    font: 600 15px/1 "Montserrat", sans-serif;
  }
  .deck-card svg { fill: #18ffaf; width: 40px; height: 40px; }
  .deck-card:nth-child(2) { opacity: .8; }
  .deck-card:nth-child(3) { opacity: .6; }
  .deck:hover .deck-card {
    transform: translateX(calc(-50% + 180px * var(--i))) translateY(0) rotate(0) skew(0) scale(1);
    opacity: 1;
  }
  @media (max-width: 500px) {
    .deck:hover .deck-card {
      transform: translateX(-50%) translateY(calc(80px * var(--i))) rotate(0) skew(0) scale(.7);
    }
  }
</style>
<div class="deck">
  <div class="deck-card" style="--i:-1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/></svg>
    Design
  </div>
  <div class="deck-card" style="--i:0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/></svg>
    Code
  </div>
  <div class="deck-card" style="--i:1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/><path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/><path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/></svg>
    Launch
  </div>
</div>`,
    caption: 'Наведите на контейнер: карточки разворачиваются в ряд.',
    notes: [
      'Позиция считается от CSS-переменной <code>--i</code>: один блок правил на все три карточки.',
      '<code>z-index: calc(-1 * var(--i))</code> — карточки уходят под соседей в правильном порядке.',
      'На узком экране раскладка переключается в колонку — там же пригодится <code>@media</code>.',
    ],
  },
  {
    slug: 'card-hover',
    title: 'Card hover reveal',
    lead: 'Профиль-карточка: при наведении фото уменьшается и открывается блок с именем и контактами.',
    markup: `<div class="ph-card">
  <div class="ph-photo"><img src="avatar.jpg" alt=""></div>
  <div class="ph-info">
    <h3>John Doe <span>Senior Designer</span></h3>
    <ul class="ph-social">
      <li><a href="#"><svg><!-- fb --></svg></a></li>
      <li><a href="#"><svg><!-- tw --></svg></a></li>
      <li><a href="#"><svg><!-- ig --></svg></a></li>
    </ul>
  </div>
</div>`,
    demo: `<style>
  .ph-card {
    position: relative; width: 260px; height: 340px; margin: 0 auto;
    background: linear-gradient(#2196f3, #2196f3 30%, #1d3548 30%, #1d3548 100%);
    border-radius: 20px; overflow: hidden; cursor: pointer;
  }
  .ph-photo {
    position: absolute; inset: 0; background: #fff;
    transition: transform .5s ease; transform-origin: top;
    border-radius: 20px; overflow: hidden; z-index: 1;
  }
  .ph-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ph-card:hover .ph-photo { transform: translateY(30px) scale(.5); }
  .ph-info {
    position: absolute; inset: 0; z-index: 2;
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 22px; transform: translateY(100%);
    transition: transform .5s ease;
    font-family: system-ui, sans-serif; text-align: center;
    pointer-events: none;
  }
  .ph-card:hover .ph-info { transform: translateY(0); pointer-events: auto; }
  .ph-info h3 {
    margin: 0 0 12px; font-size: 16px; font-weight: 600;
    color: #ffffff !important;
  }
  .ph-info h3 span {
    display: block; font-size: 12px; color: #03a9f4 !important;
    font-weight: 400; margin-top: 2px;
  }
  .ph-social {
    list-style: none; padding: 0; margin: 0;
    display: flex; gap: 10px; justify-content: center;
  }
  .ph-social a {
    width: 36px; height: 36px; border-radius: 50%;
    background: #294d69; color: #fff; text-decoration: none;
    display: flex; align-items: center; justify-content: center;
    transition: background .3s, transform .3s;
  }
  .ph-social a:hover { background: #03a9f4; transform: rotate(360deg); }
  .ph-social svg { width: 16px; height: 16px; fill: currentColor; }
</style>
<div class="ph-card">
  <div class="ph-photo">
    <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'><rect width='300' height='400' fill='%23e0e0e0'/><circle cx='150' cy='150' r='70' fill='%23bdbdbd'/><ellipse cx='150' cy='400' rx='120' ry='140' fill='%23bdbdbd'/></svg>" alt="">
  </div>
  <div class="ph-info">
    <div>
      <h3>John Doe <span>Senior Designer</span></h3>
      <ul class="ph-social">
        <li><a href="#" aria-label="Facebook">
          <svg viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
        </a></li>
        <li><a href="#" aria-label="Twitter">
          <svg viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
        </a></li>
        <li><a href="#" aria-label="Instagram">
          <svg viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
        </a></li>
        <li><a href="#" aria-label="WhatsApp">
          <svg viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
        </a></li>
      </ul>
    </div>
  </div>
</div>`,
    caption: 'Наведите на карточку: фото уменьшается, снизу выезжает блок с именем.',
    notes: [
      'Аватарка — встроенный SVG в data-URL: демо не зависит от внешних картинок.',
      'Иконки соцсетей — SVG вместо Font Awesome: сэкономили 100 КБ CDN.',
      '<code>transform</code> вместо <code>top/height</code> — анимация идёт на композиторе.',
    ],
  },
  {
    slug: 'card-read-more',
    title: 'Card read more',
    lead: 'Раскрывающийся текст: кнопка показывает скрытую часть и меняет подпись.',
    markup: `<div class="rc-card">
  <p>Lorem ipsum <span class="rc-dots">…</span><span class="rc-more"> …полный текст…</span></p>
  <button class="btn rc-btn" type="button">Read more</button>
</div>`,
    demo: `<style>
  .rc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
  .rc-card {
    background: #f5f5f5; border-radius: 10px; padding: 16px;
    overflow: hidden;
    max-height: 200px;
    transition: max-height .4s ease;
    font: 14px/1.5 system-ui; color: #333;
    display: flex; flex-direction: column;
  }
  .rc-card.expanded { max-height: 500px; }
  .rc-card p { margin: 0 0 12px; }
  .rc-more { display: none; }
</style>
<div class="rc-grid">
  <div class="rc-card">
    <p>Lorem Ipsum dolor sit amet mauris commodo quis imperdiet SwiftKey Florence<span class="rc-dots">…</span><span class="rc-more"> title SwiftKey Flow for result Flow SwiftKey grid yellow jython head SwiftKey Florence SwiftKey Florence margin Flow for result Flow SwiftKey grid yellow jython.</span></p>
    <button class="btn rc-btn" type="button"
            onclick="window.__galsFeatures.toggleReadMore(this)">Read more</button>
  </div>
  <div class="rc-card">
    <p>Lorem Ipsum dolor sit amet mauris commodo quis imperdiet SwiftKey Florence<span class="rc-dots">…</span><span class="rc-more"> title SwiftKey Flow for result Flow SwiftKey grid yellow jython head SwiftKey Florence SwiftKey Florence margin Flow for result Flow SwiftKey grid yellow jython.</span></p>
    <button class="btn rc-btn" type="button"
            onclick="window.__galsFeatures.toggleReadMore(this)">Read more</button>
  </div>
</div>`,
    notes: [
      'Одна ветка вместо <code>if/else</code> — читается в разы легче.',
      '<code>max-height</code> вместо <code>scrollHeight</code>: не нужно мерить DOM на каждый клик.',
      'Скрытый текст всегда остаётся в DOM — <kbd>Ctrl+F</kbd> его находит.',
    ],
  },
  {
    slug: 'card-vegetables',
    title: 'Card vegetables',
    lead: 'Карточка с картинкой, которая при наведении «отъезжает» и открывает текст и заголовок.',
    markup: `<div class="veg">
  <div class="veg-img"><img src="tomato.jpg" alt=""></div>
  <p>Lorem ipsum dolor sit.</p>
  <h2>Card 01</h2>
</div>`,
    demo: `<style>
  .veg-grid { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; padding: 20px 0; }
  .veg {
    --clr: #f3f3f3;
    position: relative; width: 240px; height: 220px;
    background: #fff; border-radius: 20px;
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; transition: height .4s ease; padding: 16px;
    font-family: system-ui, sans-serif;
  }
  .veg:hover { height: 300px; }
  .veg-img {
    position: absolute; inset: 16px 16px 40px;
    background: #eee; border-radius: 14px;
    transition: inset .4s ease;
    overflow: hidden;
  }
  .veg-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .veg:hover .veg-img { inset: -30px 40px 180px; box-shadow: 0 0 0 10px var(--clr); }
  .veg p {
    position: relative; padding: 20px; text-align: center;
    opacity: 0; transform: translateY(-30px);
    transition: .4s ease; margin: auto 0 0;
  }
  .veg:hover p { opacity: 1; transform: translateY(-10px); }
  .veg h2 {
    position: absolute; bottom: 8px; color: #333;
    transition: .4s ease; margin: 0; font-size: 18px;
  }
  .veg:hover h2 { bottom: -20px; background: #65ff50; padding: 6px 22px; border-radius: 14px; }
</style>
<div class="veg-grid">
  <div class="veg">
    <div class="veg-img">
      <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23d1495b'/><text x='200' y='160' text-anchor='middle' fill='%23fff' font-size='40' font-family='sans-serif'>Tomato</text></svg>" alt="">
    </div>
    <p>Lorem ipsum dolor sit, hello world</p>
    <h2>Card 01</h2>
  </div>
  <div class="veg">
    <div class="veg-img">
      <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23e0a11a'/><text x='200' y='160' text-anchor='middle' fill='%23fff' font-size='40' font-family='sans-serif'>Onion</text></svg>" alt="">
    </div>
    <p>Lorem ipsum dolor sit, hello world</p>
    <h2>Card 02</h2>
  </div>
</div>`,
    notes: [
      'Ноль зависимостей от внешних картинок — SVG в data-URL.',
      'Плавные <code>inset</code>-переходы вместо <code>top/left/right/bottom</code> — читается как одна строка.',
      'Карточку с <code>cursor: pointer</code> без ссылки лучше заменить на <code>&lt;a&gt;</code>, если по клику есть переход.',
    ],
  },
  {
    slug: 'cards-from-array',
    title: 'Cards from array',
    lead: 'Генерация карточек из массива данных через <code>map()</code> и шаблонные строки.',
    markup: `const people = [
  { id: 1, name: 'Tommy', age: 23, img: '...' },
  { id: 2, name: 'John',  age: 26, img: '...' },
];

const card = (p) => \`
  <div class="card">
    <img src="\${p.img}" alt="">
    <h3>\${p.name}</h3>
    <p>age: \${p.age}</p>
  </div>
\`;

app.innerHTML = people.map(card).join('');`,
    demo: `<style>
  .cards-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px; padding: 10px; min-height: 100px;
  }
  .card-item {
    background: linear-gradient(#ccffee, #fff);
    border-radius: 10px; padding: 14px;
    text-align: center; font-family: system-ui, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,.08);
    transition: transform .25s;
  }
  .card-item:hover { transform: scale(1.05); }
  .card-item img { width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 8px; display: block; }
  .card-item h3 { margin: 0 0 4px; font-size: 15px; color: #2a9d4a; }
  .card-item p { margin: 0; font-size: 12px; color: #777; }
</style>
<button class="btn btn-primary" type="button"
        onclick="window.__galsFeatures.renderCardsFromArray()">
  Render cards
</button>
<div class="cards-grid" id="cards-from-array-demo">
  <p style="color:#999;font:14px system-ui;grid-column:1/-1;text-align:center">Нажмите «Render cards».</p>
</div>`,
    notes: [
      'Одна <code>map</code> и <code>join()</code> вместо ручного <code>innerHTML +=</code>: чище и быстрее.',
      'Аватары — SVG в data-URL, чтобы демо не тянуло внешние картинки.',
      'Для больших списков шаблонные строки заменяются на <code>&lt;template&gt;</code> и клонирование — тогда HTML не парсится на каждый элемент.',
    ],
  },

  /* ---------- Декор ---------- */

  {
    slug: 'border-gradient',
    title: 'Gradient border',
    lead: 'Градиентная рамка у блока: два фона, <code>padding-box</code> и <code>border-box</code>, поверх прозрачной границы.',
    markup: `.gradient-border {
  --bg: lightcoral;
  --border-gradient: linear-gradient(to right, #bb2577, #3782ef);
  background: linear-gradient(var(--bg), var(--bg)) padding-box,
              var(--border-gradient) border-box;
  border: 10px solid transparent;
  border-radius: 15px;
}`,
    demo: `<style>
  .gb-demo {
    --bg: lightcoral;
    --border-gradient: linear-gradient(to right, #bb2577, #3782ef);
    width: 140px; height: 140px; margin: 20px auto;
    background: linear-gradient(var(--bg), var(--bg)) padding-box,
                var(--border-gradient) border-box;
    border: 10px solid transparent;
    border-radius: 18px;
  }
</style>
<div class="gb-demo"></div>`,
    notes: [
      '<code>padding-box</code> рисует фон только внутри, <code>border-box</code> — во всей рамке.',
      'Прозрачная граница нужна, чтобы сквозь неё был виден второй фон.',
      'Работает во всех современных браузерах. Для IE (не нужен) — <code>border-image</code>.',
    ],
  },

  /* ---------- Модалки ---------- */

  {
    slug: 'modal-bounce',
    title: 'Modal bounce',
    lead: 'Модалка с пружинной анимацией появления. Три варианта: <code>stretch-in</code>, <code>stretch-up</code>, <code>stretch-out</code>.',
    markup: `<button class="btn" onclick="modal.showModal()">Open</button>
<dialog id="modal" class="modal">
  <form method="dialog"><button class="btn">Close</button></form>
</dialog>

@keyframes squish-in {
  60% { transform: scale(.5, 1.6); }
  80% { transform: scale(.9, 1.3); }
  100% { transform: scale(1, 1); }
}`,
    demo: `<style>
  @keyframes mb-in {
    0%   { transform: scale(.3, .3); opacity: 0; }
    60%  { transform: scale(.9, 1.15); opacity: 1; }
    80%  { transform: scale(1.05, .9); }
    100% { transform: scale(1, 1); }
  }
  .mb-modal {
    border: none; border-radius: 14px; padding: 26px;
    box-shadow: 0 20px 40px rgba(0,0,0,.25);
    animation: mb-in .5s cubic-bezier(.47,1.64,.41,.8) forwards;
    max-width: 320px;
  }
  .mb-modal::backdrop { background: rgba(0,0,0,.4); animation: none; }
</style>
<div style="display:flex;gap:1em;flex-wrap:wrap">
  <button class="btn btn-primary" type="button"
          onclick="document.getElementById('mb-modal-in').showModal()">stretch-in</button>
</div>

<dialog id="mb-modal-in" class="mb-modal">
  <form method="dialog" style="text-align:center">
    <h3 style="margin:0 0 8px">Ready to save?</h3>
    <p style="margin:0 0 16px;color:#777">This is a bounce modal.</p>
    <button class="btn btn-primary" value="ok">Save</button>
  </form>
</dialog>`,
    notes: [
      'Анимация только на <code>&lt;dialog&gt;</code>, backdrop не анимирован — так проще.',
      'Форма с <code>method="dialog"</code> закрывает модалку по любой кнопке без JS.',
      'Три варианта пружины — это три <code>@keyframes</code> с разной последовательностью scale.',
    ],
  },

  /* ---------- Графики и математика ---------- */

  {
    slug: 'table-editor',
    title: 'Table editor',
    lead: 'Динамическая таблица из формы: строки и столбцы задаёт пользователь, содержимое — <code>contenteditable</code>.',
    markup: `<input id="rows" type="text" size="3" value="4"> rows
<input id="cols" type="text" size="3" value="4"> cols
<button class="btn" onclick="...">Create</button>
<table id="demo-table" class="table table-bordered"></table>`,
    demo: `<div style="display:flex;gap:1em;align-items:center;flex-wrap:wrap;margin-bottom:1em">
  <label>Rows <input id="demo-rows" type="text" size="3" value="4" class="input" style="width:4em"></label>
  <label>Cols <input id="demo-cols" type="text" size="3" value="4" class="input" style="width:4em"></label>
  <button class="btn btn-primary" type="button"
          onclick="
            const t = document.getElementById('demo-table-live');
            t.innerHTML = '';
            const rows = Math.min(20, Math.max(1, +document.getElementById('demo-rows').value));
            const cols = Math.min(20, Math.max(1, +document.getElementById('demo-cols').value));
            for (let r = 0; r < rows; r++) {
              const tr = t.insertRow();
              for (let c = 0; c < cols; c++) {
                const td = tr.insertCell();
                td.contentEditable = 'true';
                td.textContent = r + ',' + c;
              }
            }
          ">Create</button>
</div>
<div class="table-responsive">
  <table id="demo-table-live" class="table table-bordered"></table>
</div>`,
    notes: [
      '<code>contenteditable</code> — редактор «на месте», без валидации и отправки.',
      'Значения из <code>contenteditable</code> перед использованием всегда приводите и проверяйте.',
      '<code>.table-responsive</code> даёт горизонтальную прокрутку, когда таблица шире экрана.',
    ],
  },
  {
    slug: 'canvas-chart',
    title: 'Canvas chart',
    lead: 'График на голом <code>&lt;canvas&gt;</code>: сетка, линия, точки. Всё считается вручную.',
    markup: `<canvas id="chart" width="600" height="300"></canvas>
<button class="btn" onclick="drawLineChart('chart', [[0,0],[2,3],[4,2],…])">
  Draw
</button>`,
    demo: `<canvas id="demo-chart" width="600" height="300"
        style="width:100%;max-width:600px;height:auto;border:1px solid var(--line);border-radius:7px"></canvas>
<div style="margin-top:1em">
  <button class="btn btn-primary" type="button"
          onclick="window.__galsFeatures.drawLineChart('demo-chart',
            [[0,0],[2,3],[4,2],[6,5],[8,4],[10,7],[12,6]])">
    Draw the chart
  </button>
</div>`,
    notes: [
      'Для многих точек рисуйте в <code>requestAnimationFrame</code>: canvas не перерисовывает себя сам.',
      'Retina: держите <code>canvas.width</code> вдвое больше CSS-ширины.',
      'Для интерактива (тултипы, зум) canvas придётся дополнять обработчиками попадания.',
    ],
  },
  {
    slug: 'chartjs',
    title: 'Chart.js integration',
    lead: 'Пример интеграции со сторонней библиотекой. GALS даёт разметку и стили таблицы, Chart.js — график.',
    markup: `<table id="sales" class="table table-bordered">…</table>
<canvas id="mixed" width="600" height="300"></canvas>
<button class="btn" onclick="drawChartJs('mixed', 'sales')">Render chart</button>`,
    demo: `<div class="table-responsive">
  <table id="demo-sales" class="table table-bordered">
    <thead><tr><th>Month</th><th>Line A</th><th>Line B</th><th>Bars</th></tr></thead>
    <tbody>
      <tr><td>Jan</td><td contenteditable="true">65</td><td contenteditable="true">28</td><td contenteditable="true">47</td></tr>
      <tr><td>Feb</td><td contenteditable="true">59</td><td contenteditable="true">48</td><td contenteditable="true">38</td></tr>
      <tr><td>Mar</td><td contenteditable="true">80</td><td contenteditable="true">40</td><td contenteditable="true">29</td></tr>
    </tbody>
  </table>
</div>
<canvas id="demo-mixed" width="600" height="300"
        style="width:100%;max-width:600px;height:auto;margin-top:1em;border:1px solid var(--line);border-radius:7px"></canvas>
<div style="margin-top:1em">
  <button class="btn btn-primary" type="button"
          onclick="window.__galsFeatures.drawChartJs('demo-mixed','demo-sales')">
    Render chart
  </button>
</div>`,
    notes: [
      'Chart.js подключается лениво: скрипт с CDN появляется только когда пользователь нажал «Render».',
      'Повторный <code>new Chart()</code> на том же canvas бросает ошибку — держите ссылку и вызывайте <code>.destroy()</code>.',
      '<strong>GALS сам графиков не строит.</strong> Это пример: сетка и таблица — GALS, визуализация — Chart.js.',
    ],
  },
  {
    slug: 'interactive-canvas',
    title: 'Interactive canvas chart',
    lead: 'Пользователь сам вводит координаты точки и легенду — canvas перерисовывает график.',
    markup: `<input id="ic-x" size="2"> X
<input id="ic-y" size="2"> Y
<input id="ic-legend" size="10"> Legend
<button class="btn" id="ic-add">Add</button>
<canvas id="ic-canvas" width="600" height="400"></canvas>`,
    demo: `<style>
  .ic-wrap { display:flex; flex-direction:column; gap:12px; max-width:340px; }
  .ic-inputs { display:flex; gap:8px; align-items:center; flex-wrap:wrap; font: 13px system-ui; }
  .ic-inputs input { width: 60px; padding: 4px 6px; border:1px solid #ccc; border-radius:4px; font: inherit; }
  .ic-inputs input#ic-legend { width: 100px; }
  .ic-canvas { border:1px solid #ddd; border-radius:8px; background:#fff; max-width:100%; }
</style>
<div class="ic-wrap">
  <div class="ic-inputs">
    <label>X <input id="ic-x" type="number" value="2"></label>
    <label>Y <input id="ic-y" type="number" value="3"></label>
    <label>Legend <input id="ic-legend" type="text" value="demo"></label>
    <button class="btn btn-primary" type="button"
            onclick="window.__galsFeatures.addIcPoint()">Add point</button>
    <button class="btn" type="button"
            onclick="window.__galsFeatures.resetIcPoints()">Reset</button>
  </div>
  <canvas id="ic-canvas" class="ic-canvas" width="600" height="400"></canvas>
</div>`,
    caption: 'Введите X и Y, нажмите Add point — точка добавится и линия перерисуется.',
    notes: [
      'Canvas перерисовывается целиком на каждое добавление — так проще, чем инкрементально.',
      'Для десятков точек это работает мгновенно; для тысяч — нужен <code>Path2D</code> и слои.',
      'Координаты можно тащить мышью: добавляется обработчик <code>pointerdown/move/up</code>, canvas остаётся тем же.',
    ],
  },
  {
    slug: 'distance-calculator',
    title: 'Distance calculator',
    lead: 'Расстояние между двумя точками: ввод координат, формула, расчёт и рисунок на canvas.',
    markup: `D = √((x₂−x₁)² + (y₂−y₁)²)

const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);`,
    demo: `<style>
  .dc-grid { display:grid; grid-template-columns:auto 1fr; gap:10px 20px; align-items:center; max-width:640px; }
  .dc-grid input { width: 60px; padding: 4px 6px; border:1px solid #ccc; border-radius:4px; font: 13px system-ui; }
  .dc-out { font: 14px system-ui; color: #8512d1; font-weight: 600; }
  .dc-canvas { border:1px solid #ddd; border-radius:8px; max-width:100%; }
</style>
<div class="dc-grid">
  <label>x₁ = <input type="number" id="dc-x1" value="0"></label>
  <label>x₂ = <input type="number" id="dc-x2" value="3"></label>
  <label>y₁ = <input type="number" id="dc-y1" value="0"></label>
  <label>y₂ = <input type="number" id="dc-y2" value="4"></label>
  <button class="btn btn-primary" type="button"
          onclick="
            const x1 = Number(document.getElementById('dc-x1').value) || 0;
            const y1 = Number(document.getElementById('dc-y1').value) || 0;
            const x2 = Number(document.getElementById('dc-x2').value) || 0;
            const y2 = Number(document.getElementById('dc-y2').value) || 0;
            window.__galsFeatures.calcDistance('dc-canvas', x1, y1, x2, y2);
          ">Calculate</button>
  <span class="dc-out" id="dc-canvas-out">D = ?</span>
</div>
<canvas id="dc-canvas" class="dc-canvas" width="600" height="300"
        style="margin-top:1em;background:#fff"></canvas>`,
    caption: 'Введите координаты и нажмите Calculate: увидите отрезок AB и расстояние.',
    notes: [
      'Раньше длина проверялась у числа через <code>x1.length === ""</code> — это всегда <code>false</code>. Заменено на нормальный разбор <code>Number()</code> и <code>|| 0</code>.',
      'MathJax и jQuery из исходника убраны — формула читается в обычном HTML (<code>&lt;sub&gt;</code>, <code>&lt;sup&gt;</code>).',
      'Масштаб и центр подобраны под канвас 600×300, для другого размера — пересчитайте <code>scale</code>.',
    ],
  },
  {
    slug: 'parabola-drawer',
    title: 'Parabola drawer',
    lead: 'График квадратичной функции <em>y</em> = <em>ax²</em> + <em>bx</em> + <em>c</em>. Ввод коэффициентов — рисуется парабола и считаются корни.',
    markup: `const disc = b*b - 4*a*c;
if (disc >= 0) {
  const x1 = (-b + Math.sqrt(disc)) / (2*a);
  const x2 = (-b - Math.sqrt(disc)) / (2*a);
}`,
    demo: `<style>
  .pd-formula { font: 15px/1.6 system-ui; text-align:center; margin-bottom: 12px; color:#333; }
  .pd-formula input { width: 50px; padding:4px 6px; border:1px solid #ccc; border-radius:4px; text-align:center; font: inherit; }
  .pd-canvas { border:1px solid #ddd; border-radius:8px; max-width:100%; background:#fff; }
  .pd-out { text-align:center; font:14px system-ui; color:#d1495b; font-weight:600; margin-top:8px; }
</style>
<p class="pd-formula">
  y =
  <input type="number" id="pd-a" value="1" step="0.1"> x² +
  <input type="number" id="pd-b" value="0" step="0.1"> x +
  <input type="number" id="pd-c" value="-4" step="0.1">
  <button class="btn btn-primary" type="button"
          onclick="
            window.__galsFeatures.drawQuadratic('pd-canvas',
              Number(document.getElementById('pd-a').value),
              Number(document.getElementById('pd-b').value),
              Number(document.getElementById('pd-c').value));
          ">Draw</button>
</p>
<canvas id="pd-canvas" class="pd-canvas" width="600" height="400"></canvas>
<div class="pd-out" id="pd-canvas-out"></div>`,
    caption: 'Измените коэффициенты и нажмите Draw. Парабола перерисуется, внизу появятся корни.',
    notes: [
      'Раньше в коде была <code>ctx.fillStyle</code> с non-breaking space — современный парсер такое не принимает. Заменено на обычные пробелы.',
      'Рисование одним <code>path</code> по 600 точкам работает быстрее, чем 600 отдельных <code>fillRect</code>.',
      'При <code>a = 0</code> функция перестаёт быть квадратичной — об этом честно сообщаем текстом.',
    ],
  },
];

/* ============================================================
 *  Сборка страниц
 * ============================================================ */

const makePage = (d) =>
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
    ],
  });

export default Object.fromEntries(DEF.map((d) => [d.slug, makePage(d)]));