window.onload=function(){
    let star = document.querySelectorAll(".far");
    
   for(let i=0; i < star.length; i++){  
  
    star.forEach((item) => {
    
    
        item.addEventListener("click", function(){
           if(item.className==="far fa-star"){
           
            star[i].className="fas fa-star"
            
            }else {
                item.className="far fa-star"
            }
        })
        
    })
    }
    
}