// window.onload = function () {
// window.onresize = function () {
//     let iconsSvg1 = document.querySelector(".icons-svg1");
//     let ul = document.querySelector(".menu-ul");
//     let ulBlock = iconsSvg1.parentNode;
//     let ulBlockWidth = ulBlock.offsetWidth;

//     let foolBorderWidth = ulBlock.clientLeft * 2;

//     ul.width = ulBlockWidth - foolBorderWidth;
//     iconsSvg1.style.paddingLeft = (ul.width - 300) + 'px';
// }
// }

// window.onresize = function () {
//     window.onload();
// }
import versions from "./script/headerUlLiversion.js";
import styleDetailsLeft from "./script/addStyleDetailsLeft.js";
import sideBarLeftUlLi from "./script/detailsLeftUlLi.js";
import renderCenterBlock from "./script/renderCenterBlock.js";
// --header details ul li class add version
versions();
// -- add style details
styleDetailsLeft();
// -- left side bar list ul li
sideBarLeftUlLi();
// -- show introdaction
renderCenterBlock();


// class Menu {
//     constructor(elem) {
//         this.elem = elem;
//         elem.onclick = this.onClick.bind(this)
//     }
//     showIntrodaction() {
//         alert(`render `);
//     }
//     onClick(event) {
//         let action = event.target.dataset.action;
//         if (action) {
//             this[action]()
//         }
//     }
// }
// new Menu(list);
