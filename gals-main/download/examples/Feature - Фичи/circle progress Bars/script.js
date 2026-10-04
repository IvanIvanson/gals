window.onload=function(){
    let numb = document.getElementById("numb");
    let counter = 0;
    
    /*setInterval(()=>{
        if(counter==56){
            clearInterval();
        }else{
            counter+=1;
            number.innerHTML = counter + "%";
        }
    },50);*/
    
    //----------svg------------
    
    let circle = document.querySelector("circle");
    
    
    
    
    
   document.querySelector("#rng_1").oninput = function()  { 
   circle.setAttribute("stroke-dashoffset", "472"); 
    circle.setAttribute("stroke", "url(#GradientColor)");
    circle.setAttribute("stroke-dasharray", 472-this.value);
    numb.innerHTML=Math.floor(+this.value*(-0.21).toFixed(2))+ "%";

    }
    
    
    //---------canvas-----------
    let panel2 = document.querySelector("#panel2");
   panel2.style.display="block"
   panel2.style.background="#444"
      function display()  {
      
      
   
   }
   
 document.querySelector("#rng").addEventListener("click", display)  
   
   
     let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    canvas.width = rect.width*scale;
    canvas.height = rect.height*scale;
    ctx.scale(scale,scale);
                   
  document.querySelector("#rng").oninput = function()  {
     display()
    ctx.clearRect(0,0,300,250);
    function getRadians(degree) {     
    return (Math.PI/180)*degree;
     }
     //---------
     
    
     
     //----------
     
    ctx.beginPath();
    ctx.strokeStyle= "orange";
        
    ctx.lineWidth="15";
    ctx.lineCap = 'round';
    ctx.arc(100, 100, 75, 0, getRadians(this.value), false); 
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    
    ctx.lineWidth="1";
    
    ctx.font = "24px serif";
    
        
     ctx.fillStyle="orange";
     
     ctx.fillText(this.value, 85,110);
     ctx.fill();
     
    
   }
    
   //-------------div js-------------
   
   const number = document.querySelector(".number");
     let count = 0; 
     
 
     
     setInterval(() => {
      if(count == 100 ){ 
     clearInterval(); 
     }else{ count+=1;
      number.textContent = count + "%"; 
      }
       }, 80);
    
   
   
   
}
    
    
