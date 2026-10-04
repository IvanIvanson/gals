window.onload=function(){
init();
translateInit();
}


function init(){

const generateRang=(min,max)=>{
    min = Math.ceil(min);
    max = Math.floor(max);
    
    return Math.floor(Math.random()*(max-min+1))+min;
};

//------output--------

const btn = document.querySelector("#btn");
let out = document.querySelector("#out");


btn.addEventListener("click", function(){
let inpMin=+document.querySelector("#inpMin").value;
let inpMax=+document.querySelector("#inpMax").value;   out.innerText=generateRang(inpMin,inpMax);
});
}


function translateInit(){
const btnTranslate = document.querySelector("#translate");
function translate(){
    let p = document.querySelector("p");
    let outRandomText = document.querySelector("#random");
    
    if(btnTranslate.textContent == "Rus"){
     p.innerText = "Введите диапазон:";
    outRandomText.innerText = "Случайное число:"
    btnTranslate.innerText = "Eng"
    }else{
     p.innerText = "Enter range:";
    outRandomText.innerText = "Random number:";
    
      
    btnTranslate.innerText = "Rus";
    }
}

btnTranslate.addEventListener("click", translate);
}