window.onload=function(){
    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");
    let bar = document.querySelector(".bar");
   
    let n = -10;
    let k = 10;
   btnLeft.addEventListener("click", left);
   btnRight.addEventListener("click", right);  
    
    
    
    function left(){
        bar.style.transform="rotate("+n+"deg)"
    
        moveLeft();
        
    }
    function right(){
        bar.style.transform="rotate("+k+"deg)";
        moveDown();
    
    }
    
    function moveLeft(){
       
       bar.classList.add("bar-activeleft");
       bar.classList.remove("bar-activeright"); 
       
        
    }
    function moveDown(){
       
        bar.classList.add("bar-activeright");
        
    }
    
    
    
    
   
}