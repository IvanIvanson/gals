window.onload = function (){
   let modal = document.getElementById("modal");
   let modalBtn = document.getElementById("modal-btn");
   let closeBtn = document.getElementById("close-btn");
   
   modalBtn.addEventListener("click", openModal);
   closeBtn.addEventListener("click", closeModal);
   window.addEventListener("click", clickOutside);
   
   function openModal(){
       modal.style.display = "block";
   }
    function closeModal(){
       modal.style.display = "none";
   }
   function clickOutside(e){
   if(e.target===modal){
       modal.style.display = "none";
       }
   }
   
}