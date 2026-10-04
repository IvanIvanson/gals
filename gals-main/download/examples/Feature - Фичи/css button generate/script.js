window.onload = function(){
   
   
   
   let btn = document.querySelector("#btn");
   
   inp1.onchange =()=>{
   
   let inp1 =  document.querySelector("#inp1").value;
   let outWidth = document.querySelector("#outWidth");
   btn.style.width=inp1 + 'px';
   outWidth.innerText = "width: " +  inp1 + "px;";
   btn.style.fontSize = inp1/5 + "px";
   }
   
   
   inp2.onchange =()=>{
   
   let inp2 =  document.querySelector("#inp2").value;
   let outHeight = document.querySelector("#outHeight");
   btn.style.height=inp2 + 'px';
   outHeight.innerText = "hight: " +  inp2 + "px;";
   }
   
   inp3.onchange =()=>{
   
   let inp3 =  document.querySelector("#inp3").value;
   let outHeight = document.querySelector("#outBorderRad");
   btn.style.borderRadius=inp3 + 'px';
   outBorderRad.innerText = "border-radius: " +  inp3 + "px;";
   }
   
   
   inp4.oninput =()=>{
   
   let inp4 =  document.querySelector("#inp4").value;
   
   btn.innerText=inp4;
   
   }
   
   inp5.oninput =()=>{
   let inp5 =  document.querySelector("#inp5").value;
   let outColor = document.querySelector("#outColor");
   btn.style.color =   inp5;
   outColor.innerText = "color: " + inp5 + ";";
   
   }
   
   inp6.oninput =()=>{
   let inp6 =  document.querySelector("#inp6").value;
   let bgColor = document.querySelector("#bgColor");
   btn.style.background = "#"+inp6;
   bgColor.innerText = "backgroundcolor: " + "#" + inp6 + ";";
   
   }
   
   
   inp7.oninput =()=>{
   let inp7 =  document.querySelector("#inp7").value;
   let brdWidth = document.querySelector("#brdWidth");
   btn.style.borderWidth = inp7 + "px";
   brdWidth.innerText = "border-width: " + inp7 + ";";
   
   }
   
   
}
