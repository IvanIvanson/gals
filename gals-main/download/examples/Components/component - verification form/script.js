window.onload = function(){
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach((input, index)=>{
        
        input. addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g,"").charAt(0);
            e.target.value = value;
            
      if(value) {
          input.classList.add("active");
      
      if(inputs[index+1]) {
          inputs[index+1].focus();
      }
      }else{
          input.classList.remove("active");
      }
      
    });
    
            
      input. addEventListener("keydown", (e) => {
      
      
    if(e.key === "Backspace" && input.value === "" && index > 0) {
        
        inputs[index-1].focus();
    } 
    if(e.key === "ArrowLeft" && index > 0) {
        
        inputs[index-1].focus();
    } 
      
     if(e.key === "ArrowRight" && index < index.length - 1) {
        //console.log(e.key)
        inputs[index+1].focus();
    }  
      
      
      });      
            
       input. addEventListener("paste", (e) => {
       e.preventDefault();
       let paste = e.clipboardData.getData('text').replace(/\D/g,"").slice(0,inputs.length);
       
      paste.split('').forEach((char,i)=>{
          inputs[i].value = char;
          inputs[i].classList.add("active");
      });
       
     const next = Array.from(inputs).find(input=>
         input.value === '');
         if(next) next.focus();
    
    });     
            
            
        
  });
        
        
    
    
}