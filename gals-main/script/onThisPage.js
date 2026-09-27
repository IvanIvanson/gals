/**
 * Единый источник разметки блока «On this page».
 * Один и тот же HTML используется и в правой колонке, и внутри
 * контентной колонки (на узких экранах).
 *
 * @param {{id: string, label: string}[]} sections
 * @returns {string}
 */
const onThisPage = (sections) => {
  const items = sections
    .map(({ id, label }) => `\n        <li><a href="#${id}">${label}</a></li>`)
    .join('');

  // Миксин on-this-page-list стилизует ul > li; раньше li отдавались без
  // обёртки, поэтому ни list-style, ни типографика не применялись.
  // data-scrollspy включает подсветку активного раздела (gals.js).
  return `
<div class="inthisPage" data-scrollspy>
    <h4>On this page</h4>
    <hr>
    <ul>${items}
    </ul>
</div>`;
};

export default onThisPage;
