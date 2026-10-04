window.onload = function (){

const out = document.getElementById("out");    
const btnOut = document.getElementById("btn");
const btnReset = document.getElementById("btn2");
const btnAlertClose = document.getElementById("btn-close");

let alertModal = document.querySelector(".alert");


function fun(){
    
}

function* counter(a){
    let i = a;
    while(true){
        yield i++
    }
}

let myCounter = counter(1)


btnOut.addEventListener("click", () => {
   // console.log(myCounter.next().value)
    out.innerText = myCounter.next().value
});


btnReset.addEventListener("click", () => {
   
   if(out.innerText=="0"){
       
       alertModal.classList.add("d-flex");
         btnOut.disabled = true;
   } else {
       
       out.innerText = myCounter.value=0;
       myCounter = counter(1)
    
   }
   
    
});


       btnAlertClose.addEventListener("click", () => {

alertModal.classList.remove("d-flex");
btnOut.disabled = false;
})


}