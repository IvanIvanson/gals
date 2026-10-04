window.onload=function(){
const app = document.getElementById("app");
const btnClose = document.getElementById("btn-close");
    const arr = [
{
    id: 1,
    name: "Tommy",
    age:23,
    img: "https://www.w3schools.com/w3images/avatar4.png"
},
{
    id: 2,
    name: "John",
    age:26,
    img: "https://www.w3schools.com/w3images/avatar3.png"
},
{
    id: 3,
    name: "Richel",
    age:28,
    img: "https://www.w3schools.com/w3images/avatar2.png"
},
{
    
},
    
];

let card = function(id, name, age, img){
    return `
    
    <div class="card">
    <img src=${img}>
    <h3>${name}</h3>
    <div class="age"><span>age:</span><span>${age}</span></div>
    <div class="id"><span>ID: </span><span>${id}</span></div>
</div>
    `
}

arr.map((item,key) => {
    
   app.innerHTML+=card(item.id, item.name, item.age, item.img)
    
        
});

  
  //----------------
  let cards = document.querySelectorAll(".card");
  cards.forEach((item) => {
      item.addEventListener("click", () => {
          btnClose.classList.add("active-btn");
          
      })
  });
  btnClose.addEventListener("click", () => {
      btnClose.classList.remove("active-btn");
  })
  //-----------------
    
    let fade = document.querySelector(".fade");
    let modal = document.querySelector("#modal");
    let btn = document.querySelector("#btn");
    let close = document.querySelector(".close");
    modal.classList.add("modal-active");
    
    
    
    close.addEventListener("click", function(){
        fade.classList.remove("fade-active");
 modal.classList.remove("modal-active");       
    });

    

    
    
    
  //-----------------
    
}