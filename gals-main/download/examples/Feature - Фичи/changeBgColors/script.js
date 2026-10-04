window.onload = function() {
var bl_1 = document.querySelector("#bl_1");
var bl_2 = document.querySelector("#bl_2");
var bl_3 = document.querySelector("#bl_3");
var bl_4 = document.querySelector("#bl_4");

bl_1.onclick = function() {
    document.body.style.background = "red";
}

bl_2.onclick = function() {
    document.body.style.background = "blue";
}

bl_3.onclick = function() {
    document.body.style.background = "green";
}

bl_4.onclick = function() {
    document.body.style.background = "transparent";
}

var btn = document.querySelector("#btn");
var cnt = document.querySelector(".container");
  

  btn.addEventListener('click',function() {
     
      if  (cnt.style.left == 0 + 'px'){
          
         cnt.style.left = -300 + 'px';
           
          btn.innerHTML="&#128193";
         console.log( 'в лево');
      }else{
      
    cnt.style.left = 0 + 'px';
    
    btn.innerHTML= "&#127912" + "&#128194";
    
     console.log('в право');
          
          
      }
        
    
         
   
});


}