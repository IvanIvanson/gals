import versions from "./script/headerUlLiversion.js";
import styleDetailsLeft from "./script/addStyleDetailsLeft.js";
import sideBarLeftUlLi from "./script/detailsLeftUlLi.js";
import renderCenterBlock from "./script/renderCenterBlock.js";
import moveVersionIntoMenu from "./script/moveVersionIntoMenu.js";
import searchDocs from "./script/searchDocs.js";

// Модуль грузится с defer (см. index.html), DOM к этому моменту готов.
// -- header details ul li class add version
versions();
// -- add style details
styleDetailsLeft();
// -- left side bar list ul li
sideBarLeftUlLi();
// -- show introduction + right column
const docs = renderCenterBlock();
// -- search across documentation pages
searchDocs(docs);
// -- version block moves into the hamburger menu on phones
moveVersionIntoMenu();
