window.onload=function(){
    let chooseButton = document.querySelector('#chooseCar');
    let favDialog = document.querySelector('#favDialog');
    let outputBox = document.querySelector('output');
    let selectEl = document.querySelector('select');
    let confirmBtn = document.querySelector('#confirmBtn');
    
    chooseButton.addEventListener('click', onOpen);
    
   function onOpen() {
       if(typeof (favDialog.showModal) === "function"){
           favDialog.showModal();
       }else{
           alert("тег <dialog> не поддерживается браузером")
       }
   }
   
   
   selectEl.addEventListener('change', 
   
   function onSelect(e){
       confirmBtn.value = selectEl.value;
   });
   
   favDialog.addEventListener('close', onClose);
   
   function onClose() {
       outputBox.value = favDialog.returnValue + " выбрано - " + (new Date().toString());
   }
   
}