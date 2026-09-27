// --header details ul li class add version
const versions = function () {
    const list = document.querySelector(".version");
    const summaryVersion = document.querySelector(".right summary span");

    if (!list) {
        return;
    }

    const items = list.querySelectorAll("li");

    // Один делегирующий слушатель вместо навешивания на каждый пункт.
    list.addEventListener("click", (event) => {
        const item = event.target.closest("li");

        if (!item || !list.contains(item)) {
            return;
        }

        // Поведение radio: активен ровно один пункт, повторный клик не сбрасывает выбор.
        items.forEach((other) => {
            other.classList.toggle("active", other === item);
            other.setAttribute("aria-checked", String(other === item));
        });

        const number = item.textContent.match(/\d+(?:\.\d+)?/);

        if (summaryVersion && number) {
            summaryVersion.textContent = number[0];
        }
    });
}
export default versions;