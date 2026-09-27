// -- left side bar list ul li
const sideBarLeftUlLi = function () {
    let containerLeftUl = document.querySelectorAll(".list");
    containerLeftUl.forEach((item) => {
        let li = item.querySelectorAll(".menu-item");
        for (let k = 0; k < containerLeftUl.length; k++) {
            containerLeftUl[k].addEventListener("click", (event) => {
                let target = event.target;

                if (target.classList.contains("menu-item")) {
                    for (let i = 0; i < li.length; i++) {
                        li[i].classList.remove("active-list");
                    }
                    target.classList.add("active-list");
                }
            });
        }
    });
}
export default sideBarLeftUlLi;