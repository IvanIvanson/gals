window.onload=function(){
    let myDiv = document.getElementById("label");
    let inner = document.getElementById("inner");
    let container = document.getElementById("container");
    let man = document.getElementById("man");
    let help = document.getElementById("help");      
            
        
    
   // console.log(margTop, margLeft);
    
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
      const move = (e) => {
        //Try, catch to avoid any errors for touch screens(Error thrown when user doesn't move his finger)
        try {
          /*
                PageX and PageY return the position of client's cursor from top left of screen
                */
         // var x = !is_touch_device() ? e.pageX : e.touches[0].pageX;
          var y = !is_touch_device() ? e.pageY : e.touches[0].pageY;
        } catch (e) {}
        //set left and top of div based on mouse position
       // myDiv.style.left = x-52 + "px";
       man.classList.add("man-active");
       help.classList.add("help-active");
       myDiv.style.top = y + "px";
    
       myDiv.innerText = 195 - Math.floor(y) + "ml"; 
       inner.style.height= 195 - Math.floor(y) + "px"; 
       help.innerText = "help";
       if(Math.floor(y) > 195){
           y=195
           
           myDiv.style.top = "190px";
           myDiv.innerText = "0 ml";
           help.innerText = "thanks";
           man.classList.remove("man-active");
       }if(Math.floor(y) < 46){
           y=46
            help.innerText = "help";
           myDiv.style.top = "46px";
           myDiv.innerText = "150 ml";
           
       }
       
      };
      
      
      //for mouse
     myDiv.addEventListener('touchstart', (event) => {
     // console.log('Вы приложили палец к элементу')
       container.addEventListener("mousemove", (e) => {
        move(e);
      });
      //for touch
      container.addEventListener("touchmove", (e) => {
        move(e);
      });
      
       })
}