window.onload = function(){

    let flame = document.querySelector(".flame");
    let safetyMatch = document.querySelector(".safetyMatch");
    let safetyMatchFlame = document.querySelector(".safetyMatchFlame");
    
    safetyMatch.onclick = () => {
        flame.style.display = "block";
        
        safetyMatchFlame.style.display = "block";
        
        
  safetyMatch.classList.add("safetyMatchFlame");
        
    
    }
    
   
    
    /*-------  TouchMoved -------*/   
  
        safetyMatch.addEventListener('touchstart', function(event) {
        
        
if (event.targetTouches.length == 1) {
let touch=event.targetTouches[0];
touchOffsetX = touch.pageX - touch.target.offsetLeft;
touchOffsetY = touch.pageY - touch.target.offsetTop;
}
}, false);
/*Передвигаем объект*/
safetyMatch.addEventListener('touchmove', function(event) {
if (event.targetTouches.length == 1) {
let touch = event.targetTouches[0];
safetyMatch.style.left = touch.pageX-touchOffsetX + 'px';
safetyMatch.style.top = touch.pageY-touchOffsetY + 'px';
}
}, false); 
      
        
        
        
    
        
    
    
}