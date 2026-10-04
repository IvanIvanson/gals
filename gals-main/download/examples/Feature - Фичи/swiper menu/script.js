window.onload=function(){
    alert("swipe right for open menu")
const swipeMenu = document.querySelector('#swipeMenu').classList;
const activeClassMenu = 'swipe-menu--show';
const btnMenu = document.getElementById("btn-menu");
const btnClose = document.getElementById("btn-close");


btnMenu.addEventListener("click", function(){
    swipeMenu.add(activeClassMenu);
    
});
btnClose.addEventListener("click", function(){
    swipeMenu.remove(activeClassMenu);
    
});


//-------touch---

document.addEventListener('touchstart', handleTouchStart, false); document.addEventListener('touchmove', handleTouchMove, false); 
    var xDown = null; 
    var yDown = null; function handleTouchStart(evt) {
     xDown = evt.touches[0].clientX; 
     yDown = evt.touches[0].clientY; 
     }; 
     function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) { 
      return; 
      } 
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY; 
      var xDiff = xDown - xUp; 
      var yDiff = yDown - yUp; 
      
  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
    /*most significant*/ 
    if ( xDiff > 0 ) { 
   // alert('You touch left!'); 
    swipeMenu.remove(activeClassMenu);
    } 
    else { 
   // alert('You touch right!'); 
    swipeMenu.add(activeClassMenu);
 }
  }
}



//----------



}