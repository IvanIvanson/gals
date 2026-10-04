window.onload=function() {
    
    let secondsDown = 90;
    let secondsUp = 30;
    let seconds = 0;
    let waterDrop = document.querySelector(".loaderDo");
    let container = document.querySelector(".container");
    let waterUp = document.querySelector(".waterUp");
    let waterDown = document.querySelector(".waterDown");
    
    let btn = document.querySelector("#btn");
    
    btn.addEventListener("click", start);
    btn.addEventListener("click", lavel, false);   
   
   
  
    
    
    function start(){
                
      waterDrop.classList.toggle("loaderAfter");
   
        if(btn.innerText == 'Start'){
       
        btn.innerText = 'Stop';
        
        }else if(btn.innerText == 'Stop'){
        
            btn.innerText = 'Start'
        }
        
    }
    
   
    
    
    /*---------*/
    
    function changeLavel() {
    
     
  /*  let waterUp = document.querySelector(".waterUp");*/
    waterUp.style.marginTop = secondsUp + "px";
      
    
    waterDown.style.marginTop = secondsDown + "px";
    
    
    
   let loaderDo = document.querySelector(".loaderDo");
    loaderDo.style.marginTop = secondsUp + "px";
        loaderDo.style.width = 10/secondsUp + "px";
        loaderDo.style.height =  -secondsUp + "px";
                
      
    
    
    
       
     if(secondsDown !== secondsUp - 50 ){       
    secondsDown--;
    secondsUp++;  
    
    
 } else if(secondsDown >= secondsUp - 50 ){
     
  
 waterDrop.classList.remove("loaderAfter");
/* container.classList.add("rotate");*/
waterDown.classList.add("waterDownAfter");

        secondsDown = 20, secondsUp = 100;
        
    }  
    
    
    
}

 function lavel(){
   lavel = setInterval(changeLavel, 500);
}

    

    
    /*---------*/
    
  
}