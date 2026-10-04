window.onload = function (){
    const btn = document.getElementById("btn-info");
    const container = document.querySelector(".container");
    const huey = document.getElementById("huey");
     const dewey = document.getElementById("dewey");
     const louie = document.getElementById("louie");
    
    btn.addEventListener("click", function(){
    if(huey.checked){
container.classList.remove("stretch-up");
        
container.classList.remove("stretch-out");          container.classList.toggle("stretch-in");
    

    }
    if(dewey.checked){
    
     //console.log("worck");
container.classList.remove("stretch-in");
        
container.classList.remove("stretch-out");         container.classList.toggle("stretch-up");
    }
    if(louie.checked){
    
      
container.classList.remove("stretch-in");
        
container.classList.remove("stretch-up");          container.classList.toggle("stretch-out");
    }
       
    });
    
 let rdbtn = document.querySelectorAll("input")   
 
    
 /*   rdbtn.forEach(item=>{
        
          item.addEventListener("input", function(){
       if(item.checked && container.style.top==="150px"){
           container.style.top="-250px";
       }else {
           container.style.top="150px"
       }
       
    })
        
        
    })*/
  
}