// --add style details
const styleDetailsLeft = function () {
    const containerLeft = document.querySelector(".container-left");

    if (!containerLeft) {
        return;
    }

    containerLeft.addEventListener("click", (event) => {
        // closest(), а не проверка класса у event.target: внутри summary
        // может оказаться вложенный элемент, и тогда клик терялся.
        const target = event.target.closest(".details-item");

        if (!target || !containerLeft.contains(target)) {
            return;
        }

        containerLeft.querySelector(".details-active")?.classList.remove("details-active");
        target.classList.add("details-active");
    });
}
export default styleDetailsLeft;