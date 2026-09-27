// -- left side bar list ul li
const sideBarLeftUlLi = function () {
    const containerLeft = document.querySelector(".container-left");

    if (!containerLeft) {
        return;
    }

    // Один делегирующий слушатель на весь сайдбар вместо восьми:
    // вложенный цикл навешивал 8x8 = 64 обработчика на один клик.
    containerLeft.addEventListener("click", (event) => {
        const item = event.target.closest(".menu-item");

        if (!item) {
            return;
        }

        // Подсветка одна на всё меню, а не внутри каждого списка.
        containerLeft.querySelector(".active-list")?.classList.remove("active-list");
        item.classList.add("active-list");
    });
}
export default sideBarLeftUlLi;