window.onload = function(){
    
    function popupToggle(){
        const popup = document.getElementById("popup");
        popup.classList.toggle('active');
    }
    document.querySelector(".btn").addEventListener("click", popupToggle);
   
document.querySelector(".close").addEventListener("click", popupToggle);   
    
  
              /* sign Up*/

document.querySelector(".btnUp").addEventListener("click", checkAttr);

function checkAttr() {   
         let inp = document.querySelector("#inp").value;  
         let btn = document.querySelector(".btn");
         const a = document.querySelector(".signUp"),
      // select the <a> element in the document
          attr = "href"; 
          // initialize the variable with a string value
          if ( a.hasAttribute(attr) ) {
           // check if the element has an attribute with the value contained in the attr variable
            
           // get the value of this attribute
             
             const newAttrVal = "mailto: " + inp; 
                 
             a.innerHTML = newAttrVal; 
             // add new content to the <a> element
             a.setAttribute(attr, newAttrVal); 
             // setting a new value for the attribute
              }    
            }         
              
     }         
             
