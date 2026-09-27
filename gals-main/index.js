import versions from "./script/headerUlLiversion.js";
import styleDetailsLeft from "./script/addStyleDetailsLeft.js";
import sideBarLeftUlLi from "./script/detailsLeftUlLi.js";
import renderCenterBlock from "./script/renderCenterBlock.js";

// Модуль грузится с defer (см. index.html), DOM к этому моменту готов.
// -- header details ul li class add version
versions();
// -- add style details
styleDetailsLeft();
// -- left side bar list ul li
sideBarLeftUlLi();
// -- show introduction + right column
renderCenterBlock();
