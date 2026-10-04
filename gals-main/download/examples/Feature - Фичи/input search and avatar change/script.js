window.onload=function(){
    let box =document.querySelector(".input-box");
    let inpBtn = document.getElementById("icon-search");
    let inp = document.getElementById("inp");
    let out = document.getElementById("out");
    let avatar = document.querySelector(".icon-avatar");
    let header = document.querySelector(".header");
    let talkbubble = document.querySelector("#talkbubble");
    let talkbubble2 = document.querySelector("#talkbubble2");
    let wrapper = document.querySelector(".wrapper");
    
    
    inpBtn.addEventListener("click", function (){
        if(inp.value!=''){
            out.innerText = inp.value + ' - not found';
        }
         if(inp.value=='Sarah'){
            out1();
        }
        if(inp.value=='Alex'){
            out2();
        }
         if(inp.value=='Natasha'){
            out3();
        }
        box.classList.add("active");
        inp.style.display="block";
         setInterval(tooltype2,500);
    });
    
    inpBtn.addEventListener("dblclick", function (){
        
        box.classList.remove("active");
        inp.style.display="none";
        inp.value="";
    });
    
    inp.addEventListener("click", function(){
        if(inp.value=''){
            out.innerText = '';
        }else{
            out.innerText = inp.value;
        }
    })
    
    const iconAvatar = document.querySelector(".icon-avatar");
    let head = document.createElement("div");
    head.classList.add("head");
    iconAvatar.appendChild(head)
    let body = document.createElement("div");
    body.classList.add("body");
    iconAvatar.appendChild(body)

    
    /*---modal---*/
    
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

    //let img = document.querySelector(".sl-p-details__avatar-image").getAttribute('src');
    
    
    
    /*-------*/
    
    
    let avatars = document.querySelectorAll(".avatar");
    avatars.forEach( item => {
       
       item.addEventListener("click", function(){
    let imgAvatar = document.createElement("img"); 
         imgAvatar.src=item.getAttribute("src"); 
         //console.log(item.getAttribute("src"));
         avatar.style.display = "none";
         btn.innerHTML = '';
         btn.append(imgAvatar);
       })
       
    });
    
    function tooltype(){
        talkbubble.classList.add("activebubble")
        
    }
    
   setInterval(tooltype,1000);
   
   function tooltype2(){
        talkbubble2.classList.add("activebubble2")
        
    }
    
 /*----burger------*/
 

    const btnMenu = document.querySelector(".burger");
    const menu = document.querySelector(".menu");
    
    btnMenu.addEventListener("click", function(){
        menu.classList.toggle("active-menu");
        btnMenu.classList.toggle("burgerActive");
       wrapper.classList.toggle("main-active");
header.classList.toggle("main-active");       
    });
 
 
 /*----------*/ 
 function out1(){
     out.innerHTML =  `
     <img src=" https://www.w3schools.com/w3images/avatar4.png" class="avatar">
      <h4 class="rank1">Sarah Brown</h4>
        <p>Digital Artist</p>
          <p class="discription">Computer art, as well as digital art, digital art is a direction in media art based on the use of information technology, the result is works of art in digital form</p>
        `;
 }
 function out2(){
     out.innerHTML =  `
     <img src=" https://www.w3schools.com/w3images/avatar2.png" class="avatar">
      <h4 class="rank2">Alex Jason</h4>
        <p>Musician</p>
        
        `;
 }
 function out3(){
     out.innerHTML =  `
     <img src=" https://www.w3schools.com/w3images/avatar5.png" class="avatar">
      <h4 class="rank3">Natasha Wood</h4>
        <p>Film Maker</p>
        
        `;
 }
   let ranks = document.querySelectorAll(".list-item");
   
   ranks.forEach(item => {
   item.addEventListener("click", function(event){
      
       if(event.target.classList.contains("rank1")){
           out1();
       }
if(event.target.classList.contains("rank2")){
           out2()
       }    
if(event.target.classList.contains("rank3")){
           out3()
       }          
   })
})
    
}