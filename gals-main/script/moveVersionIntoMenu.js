// -- move version block into the mobile hamburger menu
const MOBILE_QUERY = '(max-width: 767.98px)';

/**
 * На телефоне блок версий «GALS V1.0» уезжает в меню-оверлей, на десктопе
 * возвращается в строку поиска. Иначе на узком экране он растягивался на всю
 * ширину и накрывал поле поиска.
 */
const moveVersionIntoMenu = function () {
    const right = document.querySelector('.container .right');
    const menu = document.querySelector('.menu');

    if (!right || !menu || typeof window.matchMedia !== 'function') {
        return;
    }

    // Метка в исходном месте: по ней блок возвращается на десктопе.
    const slot = document.createComment('version-slot');
    right.parentNode.insertBefore(slot, right);

    const place = (isMobile) => {
        if (isMobile) {
            menu.appendChild(right);
            return;
        }

        if (slot.parentNode) {
            slot.parentNode.insertBefore(right, slot);
        }
    };

    const mql = window.matchMedia(MOBILE_QUERY);
    place(mql.matches);

    const onChange = (event) => place(event.matches);

    if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
        // Safari < 14
        mql.addListener(onChange);
    }
};

export default moveVersionIntoMenu;
