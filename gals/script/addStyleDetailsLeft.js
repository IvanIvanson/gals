// --add style details
const styleDetailsLeft = function () {
    let containerLeft = document.querySelector(".container-left");
    let details = containerLeft.querySelectorAll(".details-item");

    containerLeft.addEventListener("click", (event) => {
        let target = event.target;

        if (target.classList.contains("details-item")) {
            for (let i = 0; i < details.length; i++) {
                details[i].classList.remove("details-active");
            }
            target.classList.add("details-active");
        }
    });
}
export default styleDetailsLeft;