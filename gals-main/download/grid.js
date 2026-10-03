function initMenu() {
  const menu = document.querySelector(".menu");
  const btnIconMenu = document.querySelector(".icon-menu");
  if (menu && btnIconMenu && !btnIconMenu.dataset.bound) {
    btnIconMenu.dataset.bound = "true";
    btnIconMenu.addEventListener("click", function () {
      menu.classList.toggle("menu-show");
    });
  }
}

function initImages() {
  const img = document.querySelectorAll("img");
  img.forEach((item) => {
    if (item.classList.contains("container-fluid")) {
      const containerBlock = item.parentNode;
      const containerBlockWidth = containerBlock.offsetWidth;
      const containerBlockHeight = containerBlock.offsetHeight;
      const foolBorderWidth = containerBlock.clientLeft * 2;
      item.width = containerBlockWidth - foolBorderWidth;
      item.height = containerBlockHeight - foolBorderWidth;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initImages();
});

window.addEventListener("resize", () => {
  initImages();
});