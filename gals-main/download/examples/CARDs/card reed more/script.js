window.onload=function(){
    
    let btns = document.querySelectorAll(".btn");
    for(btn of btns){
        btn.addEventListener('click', function(){
            let card = this.closest('.card');
            let dots = card.querySelector('.dots');
            let more = card.querySelector('.more');
            
            
         if(dots.style.display == "none" && card.style.maxHeight){
             dots.style.display = "inline";
             more.style.display = "none";
             this.textContent = "Подробнее";
             card.style.maxHeight= null;
         } 
          else{
             dots.style.display = "none";
             more.style.display = "inline";
             this.textContent = "Скрыть";
             card.style.maxHeight = card.scrollHeight + 'px';
             
         } 
           
            
        });
        
        
    }
}