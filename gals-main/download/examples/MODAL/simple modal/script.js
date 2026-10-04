window.onload=function(){
    let modal=document.querySelector(".modal");
    let modalContent = document.querySelector(".modal-content");
    openModal = function (){
        modal.classList.add("active");
        modalContent.classList.add("content-active");
    }
    closeModal = function (){
        modal.classList.remove("active");
        modalContent.classList.remove("content-active");
    }
}