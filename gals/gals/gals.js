window.onload = function () {
  // menu-------
  const menu = document.querySelector(".menu");
  const btnIconMenu = document.querySelector(".icon-menu");

  btnIconMenu.addEventListener("click", function () {
    menu.classList.toggle("menu-show");
   
  });
  // image-fluid---
  
  let img = document.querySelectorAll("img");
   img.forEach((item) => {
  if (item.classList.contains("container-fluid")) {
    let containerBlock = item.parentNode;
    let containerBlockWidth = containerBlock.offsetWidth;
    let containerBlockHeight = containerBlock.offsetHeight;
    let foolBorderWidth = containerBlock.clientLeft * 2;
   
      item.width = containerBlockWidth - foolBorderWidth;
      item.height = containerBlockHeight - foolBorderWidth;
    
    
  } 
  });
 
 

};
 window.onresize = function () {
   window.onload();
}; 
 