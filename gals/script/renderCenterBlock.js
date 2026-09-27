import introdactionHTML from './introdaction.js';
import introdactionThisPage from './inthisPageIntrodaction.js';
import copyBlock from "./copyBlock.js";

const renderCenterBlock = function () {
  const containerCenter = document.querySelector(".container-center");
  const containerRight = document.querySelector(".container-right");
  const introdaction = document.querySelector("#introdaction");
    class Menu {
      constructor(elem) {
        this.elem = elem;
        elem.onclick = this.onClick.bind(this);
      }
      showIntrodaction() {
        containerCenter.innerHTML = introdactionHTML;
        containerRight.innerHTML = introdactionThisPage;
        // -- copy block
        copyBlock(".copy-block1", "#code1", "text1", "#copyBtn1");
        copyBlock(".copy-block2", "#code2", "text2", "#copyBtn2");
        copyBlock(".copy-block3", "#code3", "text3", "#copyBtn3");

      }
      onClick(event) {
        let action = event.target.dataset.action;
        if (action) {
          this[action]();
        }
      }
    }
    new Menu(introdaction);
}

export default renderCenterBlock;