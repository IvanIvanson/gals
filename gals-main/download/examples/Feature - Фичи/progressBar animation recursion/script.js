window.onload=function(){
    let position = 0;
    let out = document.querySelector("#out");
    function moveAnimation(){
        position = position + 2;
        if(position==300){
            btn.innerHTML = "reverse"
        }
        if (position >= 302) return;
        document.querySelector("#box").style.width = position + "px";
        out.innerHTML = position;
        animation();
    }
    
    
    
    let setMyFunction;
    
   function animation(){
      setMyFunction  = setTimeout(moveAnimation,50);
      
    }
   
  
    function clearAnimation(){
        clearTimeout(setMyFunction);
    }
   
   function reverse(){
      position = 0; document.querySelector("#box").style.width = position + "px";
      out.innerHTML = position;
      
   }
    
        document.querySelector("#btn").onclick=function(){
    
    if(btn.innerHTML=="Start"){
    animation()
    btn.innerHTML = "Stop"
    btn.style.color="red";
    } else if(btn.innerHTML=="Stop"){
        btn.innerHTML="Start";
        btn.style.color="blue";
        clearAnimation();
    }else if(btn.innerHTML=="reverse"){
        reverse();
        btn.innerHTML="Start";
        
    }
    
    }
     
    
}