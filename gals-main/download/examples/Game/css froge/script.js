window.onload=function(){
let tongue=document.querySelector(".tongue");
let eyesIntroLeft = document.querySelector(".introLeft");
let eyesIntroRight = document.querySelector(".introRight");
let head = document.querySelector(".head");
let outAtempts = document.querySelector("#outAtempts")
let score = document.querySelector("#outScore")
let modal = document.querySelector(".modal");
let modalText = document.querySelector("h2");
let closeModalBtn = document.querySelector("#btnCloseModal");


let mosquitoes1 = document.querySelector("#mosquitoes1");
let mosquitoes2 = document.querySelector("#mosquitoes2");
let mosquitoes3 = document.querySelector("#mosquitoes3");
let arrMosquitoes = [mosquitoes1, mosquitoes2, mosquitoes3];

let n = -1;

closeModalBtn.addEventListener("click", init)



function init(){
 


modal.classList.add("modalHidden")    

function delArrElement(index){

 let myIndex = arrMosquitoes.indexOf(index);
 if (myIndex !== -1) {
  arrMosquitoes.splice(myIndex, 1); 
  }if(arrMosquitoes==0){
     
      modal.classList.remove("modalHidden");
modalText.textContent = `You won! Your attempts: ${n+1}, for continue reload window, please`

closeModalBtn.removeEventListener("click", init)

setTimeout(function(){

	outAtempts.textContent = "0";  
 modal.classList.add("modalHidden");
}, 4000);

  }

outScore.textContent = 3 - arrMosquitoes.length
}

function showCoords(evt){ 

if(evt.clientX > innerWidth/2){
    eyesIntroLeft.style.marginLeft = 7 + "px";
    eyesIntroRight.style.marginLeft = 7 + "px";
    eyesIntroLeft.style.transition= 0.5 + "s";
    
    head.style.transform = "rotate(" + 10 + "deg)";
    head.style.transition = .5 + "s";
    
}else if(evt.clientX < innerWidth/2){
    eyesIntroLeft.style.marginLeft = -7 + "px";
    eyesIntroRight.style.marginLeft = -7 + "px";
    eyesIntroLeft.style.transition= 0.5 + "s";
    head.style.transform = "rotate(" + -10 + "deg)"
    
}else if(evt.clientX == innerWidth/2){
    head.style.transform = "rotate(" + 0 + "deg)";
    
}

}

//---------------------
//let n = -1;

function target(a){

    if(a.target.id == "mosquitoes1"){
    mosquitoes1.style.display = "none";
    delArrElement(mosquitoes1);
}
 if(a.target.id == "mosquitoes2"){
    mosquitoes2.style.display = "none";
    delArrElement(mosquitoes2);
}
 if(a.target.id == "mosquitoes3"){
    mosquitoes3.style.display = "none";
    delArrElement(mosquitoes3);
}
//console.log(arrMosquitoes.length)
}
//---------------    
           function rotate(event){
           
           let x = event.clientX;
           let y = event.clientY;
           let xX = x - window.innerWidth/2;
           let yY = y - window.innerHeight/2.2;
            
tongue.style.width=Math.sqrt((xX)*(xX) + (yY)*(yY)) + "px";
tongue.style.hight = 4+"px";
if(event.clientX>=100){
    tongue.classList.toggle("hidden")
    
    target(event);

    
}

n=n+1;

outAtempts.textContent = n;

if(window.innerWidth < 450){
    tongue.style.transform = `rotateZ(${(-xX*0.1/Math.PI) + ((yY*1.2)/Math.PI)}deg)`;
   }else if(window.innerWidth < 850){
       tongue.style.transform = `rotateZ(${(xX*1.8/Math.PI) + ((yY*0.8)/Math.PI)}deg)`;
   } else{
       tongue.style.transform = `rotateZ(${(xX*2.8/Math.PI) + ((yY*1.4)/Math.PI)}deg)`;
         }
    
    
    setTimeout(function(){tongue.style.width=10+"px"}, 300)
        }
        
        
            
        document.addEventListener("click", rotate);
        
        document.addEventListener("click", showCoords)
        

//---------------------

}

}