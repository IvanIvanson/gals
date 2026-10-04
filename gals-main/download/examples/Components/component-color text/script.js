window.onload=function(){
    let text = document.getElementById("text");
    let color = document.getElementById("clr");
  let label=document.querySelector("label");
        label.style.background=color.value;
    color.addEventListener("input", function (){
             
    label.style.background=color.value;
    text.style.color = color.value;
    });
    
       
}