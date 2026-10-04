window.onload=function(){
let fade = document.querySelector(".fade");
    let modal = document.querySelector("#modal");
    let btn = document.querySelector("#btn");
    let close = document.querySelector(".close");
    
    
    btn.addEventListener("click", function(){
        modal.classList.add("modal-active");
        
 fade.classList.add("fade-active");
    });
    
    close.addEventListener("click", function(){
        fade.classList.remove("fade-active");
 modal.classList.remove("modal-active");       
    });

    let img = document.querySelector(".sl-p-details__avatar-image").getAttribute('src');

    console.log(img)
}
