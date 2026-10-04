window.onload=function(){
let arrows =
document.querySelector("#arrows");
let item = document.querySelectorAll(".box");

  
 //---------
 let line = document.createElement("div");
 
 

 
 line.classList.add("line")
 //---------  
   
    
    function indicator(e){
        arrows.style.top = e.offsetTop + "px"
        arrows.style.width = e.offsetWidth + "px"
        arrows.textContent =  e.offsetWidth + "px"
          line.style.width = e.offsetWidth + "px"
          line.style.height = e.offsetHeight/2 + "px"
    }
    
    item.forEach((link) => {
    link.addEventListener("mousemove", (e)=>{
            indicator(e.target)
            link.appendChild(line)
        })
    })
}