window.onload = function () {
    let left = document.getElementById("range-left");
    let right = document.getElementById("range-right");
    let container = document.getElementById("range");
    let bar = document.querySelector(".range-bar");
    let innerB = document.querySelector(".bar-inner");     
     let outLeft = document.querySelector("#outleft"); 
     let outRight = document.querySelector("#outright"); 
    let close = document.querySelector(".close");
    let block = document.querySelector(".container");
   
 
    
   
    function reset(){
        let w = parseInt(innerB.clientWidth);  
       left.style.left = w/w + "px";
      innerB.style.marginLeft = w/w + "px";
       innerB.style.width =299 + "px";
                   
       
    }
    
      //Detect touch device
      function is_touch_device() {
        try {
          //We try to create TouchEvent (it would fail for desktops and throw error)
          document.createEvent("TouchEvent");
          return true;
        } catch (e) {
          return false;
        }
      }
            
      
      const move1 = (e) => {
        
        try {
         
          var x1 = !is_touch_device() ? e.pageX : e.touches[0].pageX;
         
         
        } catch (e) {}
        
        left.style.left = x1-50 + "px";
       // right.style.right = x2-x1 + "px";
        let n = x1-30;
                                   
        outLeft.innerText = (x1/10).toFixed(1);
       
        
      if(x1<=30){
          left.style.left = 2 + "px";
                     
      }
      
    close.addEventListener("click", function(){
       close.style.display="none";
       reset();
       outLeft.innerText=1.5;
   });
        
      };
      
   
   const move2 = (e) => {
        
        try {
         
          var x2 = !is_touch_device() ? e.pageX : e.touches[0].pageX;
         
        } catch (e) {}
        
       right.style.right =bar.clientWidth- x2 + "px";
        
        let w=innerB.clientWidth;
        w = parseInt(w);
                
        outRight.innerText = ((x2)/10).toFixed(1);
        
      if(x2>=300){
          right.style.right = 1 + "px";
          
           
      }
      
    close.addEventListener("click", function(){
       
       let w = innerB.clientWidth;
       right.style.right = 1 + "px";
   
       innerB.style.width =299 + "px";
       outRight.innerText=30;
       close.style.display="none";
   });
   
        
      };
      
   
      
   outLeft.innerText=1.5;
   outRight.innerText=30;
   
   
   
      //for mouse
     left.addEventListener("mousemove", (e) => {
        move1(e);
      });
      //for touch
      left.addEventListener("touchmove", (e) => {
        move1(e);
        close.style.display="block";
        let l = parseInt(outLeft.innerText);
       
        let r = parseInt(outRight.innerText)
        
        innerB.style.marginLeft =l*10-20 + "px";
        
        innerB.style.width = (r-l)*10 + "px";
       
      });
      
      
    right.addEventListener("mousemove", (e) => {
        move2(e);
      });
      //for touch
      right.addEventListener("touchmove", (e) => {
        move2(e);
        let l = parseInt(outLeft.innerText);
                                       
        let r = parseInt(outRight.innerText)
        
        innerB.style.width = (r-l)*10 + "px";
        close.style.display="block";
                      
      });
      
                    
}