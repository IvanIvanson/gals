// -- left side bar list ul li
const sideBarLeftUlLi = function () {
    const containerLeft = document.querySelector(".container-left");

    if (!containerLeft) {
        return;
    }

    // Пункты меню — <li>, а не <a>: без tabindex/role они недоступны
    // с клавиатуры. Роль button + Enter/Space дают тот же клик.
    containerLeft.querySelectorAll(".menu-item").forEach((item) => {
        if (!item.hasAttribute("tabindex")) {
            item.setAttribute("tabindex", "0");
        }
        if (!item.hasAttribute("role")) {
            item.setAttribute("role", "button");
        }
    });

    containerLeft.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const item = event.target.closest(".menu-item");

        if (!item || !containerLeft.contains(item)) {
            return;
        }

        event.preventDefault();
        item.click();
    });

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