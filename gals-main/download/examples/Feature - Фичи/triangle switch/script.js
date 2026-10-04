window.onload=function(){
    let li = document.querySelectorAll("li");
    let triangle = document.querySelector(".triangle-top");
    let out = document.querySelector("#out");
    
    let html = "HTML5 (English HyperText Markup Language, version 5) is a language for structuring and presenting the content of the World Wide Web.  This is the fifth version of HTML.  Although the standard was finalized (recommended version for use) only in 2014";
    let css = "CSS (/siːɛsɛs/ English Cascading Style Sheets) is a formal language for describing the appearance of a document (web page) written using a markup language (most often HTML or XHTML).  It can also be applied to any XML document, such as SVG or XUL.";
    let js = "JavaScript (/ˈdʒɑːvɑːˌskrɪpt/; abbr. JS /ˈdʒeɪ.ɛs./) is a multi-paradigm programming language.  Supports object-oriented, imperative and functional styles.  It is an implementation of the ECMAScript specification (ECMA-262[8] standard)."
    
    //----add text-----
    
    function addText(){
            if(event.clientX>40 && event.clientX<120){
   out.textContent = html;  
   out.classList.add("outPage1")
   out.classList.remove("outPage2")
    out.classList.remove("outPage3")
   } else if(event.clientX>140 && event.clientX<200){
   out.textContent = css;  
   out.classList.add("outPage2")
   out.classList.remove("outPage1")
    out.classList.remove("outPage3")
    
   }
    else if(event.clientX>240 && event.clientX<300){
   out.innerText = js;  
   out.classList.add("outPage3")
   out.classList.remove("outPage1")
    out.classList.remove("outPage2")
    
   }else{
       out.classList.remove("opacity")
   }
   
   
   
   };
   
    
    //-------handleClick----------
    
    function handleClick(x){
        li.forEach((item) => {
    
        item.addEventListener("click", function(event){
 
    triangle.style.marginLeft=(event.clientX-x)+"px";
 triangle.style.transition=0.9+"s ease-in-out";
            
   addText();
   
        });
        
                     
    });
    
    }
    
        
    //--------innerWidth----------------
    
    function width(w,x){
    
    if(innerWidth <= w){
        
    handleClick(x);
    }
    }
    
    
    width(400,0);
    width(900,0);
    width(1200,340);
    
    
     
}