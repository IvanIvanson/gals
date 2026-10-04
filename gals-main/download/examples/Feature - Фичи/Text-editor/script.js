 window.onload=function(){
textField.document.designMode = "On";
let out = document.querySelector(".textField")
const buttons = document.querySelectorAll("button");
const doc = document.getElementById('doc');
let container = document.querySelector(".container");   
let containerDraw = document.querySelector(".container-draw");  
let count = 250;
    for(let i=0; i<buttons.length; i++){
        buttons[i].addEventListener("click", () => {
            let cmd = buttons[i].getAttribute("data-cmd");
            
            if(buttons[i].name === "active"){
                buttons[i].classList.toggle("active");
            }
            if(cmd === "insertImage" || cmd === "createLink"){
                let url = prompt("Inter link hear: ", "");
                textField.document.execCommand(cmd,false,url);
                if(cmd === "insertImage"){
                    const imgs = textField.document.querySelectorAll("img");
                    imgs.forEach(item=>{
                        item.style.maxWidth = "300px";
    
    item.addEventListener("dblclick", function(){
  let rullBlockImg = document.querySelector(".rull-blockImg");
 let btnCloserullBlockImg = document.querySelector("#rull-imgClose");  
    rullBlockImg.classList.add("rull-blockImgActive");
  btnCloserullBlockImg.addEventListener("click", function(){
    rullBlockImg.classList.remove("rull-blockImgActive");
   
  });
  let inputs = document.querySelectorAll(".inp-img");
  inputs.forEach(inp => {
  inp.addEventListener("input", function(e){
      if(e.target.dataset.name == "width"){
          item.style.width = e.target.value + "px";
      }if(e.target.dataset.name == "height"){
          item.style.height = e.target.value + "px";
      }if(e.target.dataset.name == "brdr"){
          item.style.borderRadius = e.target.value + "px";
      }
  })
})
      //  item.style.width = count + "px";
      //  count-=10;
    })
                    });
                    
                }else{
                    const links = textField.document.querySelectorAll("a");
                    
                    links.forEach(item=>{
                       item.target = "_blank";
                        item.addEventListener("mouseover", ()=>{
            textField.document.designMode = "Off";                
                        })
                    })
                }
       
       
       
       
       
       
            }else{
                textField.document.execCommand(cmd,false, null)
            }
        })
    }
var d = new Date();
let e="<h2>404</h2>"
//--------nav-toggle----------
document.querySelector('.nav-toggle').addEventListener('click', function(){ 
    document.querySelector('#menu').classList.toggle('active'); 
    });
    

//--------nav-toggle2----------
document.querySelector('.nav-toggle2').addEventListener('click', function(){ 
    document.querySelector('#menu2').classList.toggle('active2'); 
    });
    
//---------color text---------


 let color = document.getElementById("clr");
  let label=document.querySelector("#letter");
        label.style.background=color.value;
    color.addEventListener("input", function (){
 canvas.classList.remove("canvas-active");            
label.style.background=color.value;    
out.contentWindow.document.body.style.color=color.value;   
    
    });

//------------------
let en = new Date(72000000 * 24 * 977);
let color2 = document.getElementById("clr2");

let brush=document.querySelector("#brush");
        brush.style.background=color.value;
    color2.addEventListener("input", function (){
             
brush.style.background=color2.value;   
     
    });

//-------search-----------
  let btn = document.querySelector("#btn");
    btn.addEventListener("click", search);
    
    function search(){
    let textToSearch = document.querySelector("#text-to-search").value;
    let paragraph = document.querySelector(".textField");
    
    textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    
    
    let pattern = new RegExp(`${textToSearch}`, "gi");
     paragraph.contentWindow.document.body.innerHTML = paragraph.contentWindow.document.body.textContent.replace(pattern, match => `<mark>${match}</mark>`)
    
    
}

//-------canvas----------
const closeCanvas = document.querySelector(".btn-close");

closeCanvas.addEventListener("click", function(){
    
    canvas.classList.remove("canvas-active");
   containerDraw.classList.remove("container-drawactive");
});    
    


  let colorBransh = document.getElementById("clr2");
  
 /* let label = document.querySelector("label");
  let clearBtn = document.getElementById("clear");
  let fillBtn = document.getElementById("fill");
 */   
//    const brush = document.getElementById('brush');
        // let containerDraw = document.querySelector('.container-draw')
       colorBransh.addEventListener('click', function(){
containerDraw.classList.add('container-drawactive');
 canvas.classList.add("canvas-active");
        })
      // Initial references
      let colorsRef = document.getElementsByClassName("colors");
      let canvas = document.getElementById("canvas");
      let backgroundButton = document.getElementById("color-background");
      let colorButton = document.getElementById("clr2");
      let clearButton = document.getElementById("button-clear");
      let eraseButton = document.getElementById("button-erase");
      let fillButton = document.getElementById("button-fill");
      let penButton = document.getElementById("button-pen");
      let penSize = document.getElementById("pen-slider");
      let toolType = document.getElementById("tool-type");

      //eraser=false and drawing=false initially as user hasn't started using both
      let erase_bool = false;
      let draw_bool = false;
      let fill_bool = false;
      //context for canvas
      let context = canvas.getContext("2d");
      //initially mouse X and Y positions are 0
      let mouseX = 0;
      let mouseY = 0;
      //get left and top of canvas
      let rectLeft = canvas.getBoundingClientRect().left+0;
      let rectTop = canvas.getBoundingClientRect().top;
       window.addEventListener('resize', function(){
           rectLeft = canvas.getBoundingClientRect().left + 40;
           return rectLeft;
       });
      // Initial Features
      
      const init = () => {
        context.strokeStyle = "black";
        context.lineWidth = 1;
        // Set Canvas height to parent div height
        canvas.style.width = "100%";
        canvas.style.height = "85%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

//    canvas.width = (innerWidth*4.8)/5;
//    canvas.height = (innerWidth*4.8)/5;

        // set range title to Pen Size
        toolType.innerHTML = "Size:";
        //set background and color inputs initially
      //  canvas.style.backgroundColor = "#FFFFFF";
       backgroundButton.value = "#FFFFFF";
        penButton.value = context.strokeStyle;
      };
      //Detect touch device
     
      const is_touch_device = () => {
        try {
          //We try to create TouchEvent (it would fail for desktops and throw error)
          document.createEvent("TouchEvent");
          return true;
        } catch (e) {
          return false;
        }
      };
      //exact x and y position of mouse/touch
      const getXY = (e) => {
        mouseX =
          (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft+40;
        mouseY =
          (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
      };
      //user has started drawing(pressed mouse)
      const startDrawing = (e) => {
        //drawing=true
        draw_bool = true;
        getXY(e);
        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
              
 
      };

      //draw function
      const drawOnCanvas = (e) => {
        if (!is_touch_device()) {
          e.preventDefault();
        }
        getXY(e);
        //if user is drawing(mouse pressed and moving)
        if (draw_bool) {
          //create a line to x position and y position of cursor
          
          context.lineTo(mouseX, mouseY);
          context.stroke();
         
                 
          if (erase_bool) {
            // destination-out draws new shapes behind the existing canvas content. (for eraser)
            context.globalCompositeOperation = "destination-out";
          } else {
            /*
      source-over draws new shapes on top of exisitng content */
            context.globalCompositeOperation = "source-over";
          }
          
        }
        //  -----------------

          
         
         if (draw_bool && fill_bool) {
          //create a line to x position and y position of cursor
           context.fillStyle= colorButton.value;
          context.lineTo(mouseX, mouseY);
          context.stroke();
          context.fill();
        
         
          if (erase_bool) {
            // destination-out draws new shapes behind the existing canvas content. (for eraser)
            context.globalCompositeOperation = "destination-out";
          } else {
            /*
      source-over draws new shapes on top of exisitng content */
            context.globalCompositeOperation = "source-over";
          }
          
        }


        // -------------
      };
      const stopDrawing = () => {
        context.beginPath();
      
        draw_bool = false;
        fill_bool = false;
      };

      //Mouse down/touch start inside canvas
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("touchstart", startDrawing);

      // start drawing when mouse/touch moves
      canvas.addEventListener("mousemove", drawOnCanvas);
      canvas.addEventListener("touchmove", drawOnCanvas);

      //when mouse click stops/touch stops stop drawing and begin a new path
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("touchend", stopDrawing);

      //When mouse leaves the canvas
      canvas.addEventListener("mouseleave", stopDrawing);

      // Button for Pen Mode
      penButton.addEventListener("click", () => {
        // set range title to Pen Size
        toolType.innerHTML = "Pen";
        erase_bool = false;
        flag = 0;
      });

      // Button for Eraser Mode
      eraseButton.addEventListener("click", () => {
        erase_bool = true;
        // set range title to Eraser Size
        toolType.innerHTML = "Eraser";
      });

      // Adjust Pen Size
      penSize.addEventListener("input", () => {
        //set width to range value
        context.lineWidth = penSize.value;
      });

      // Change Color
      colorButton.addEventListener("change", () => {
        //set stroke color
        context.strokeStyle = colorButton.value;
         context.fllStyle = colorButton.value;
      });

      // Change Background
      backgroundButton.addEventListener("change", () => {
        canvas.style.backgroundColor = backgroundButton.value;
        let clrBar = document.getElementById("clr-bar");
        clrBar.style.background = backgroundButton.value;
        //  imgConverted.style.background =  backgroundButton.value;
      });

      //Clear
      
      clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundColor = "#FFF";
        backgroundButton.value = "#FFF";
      });
 fillButton.addEventListener("click", function() {
  
           fill_bool = true;
         
      
       
      });
   
      //initial settings
      window.onload = init();

    //   -------------------------
const btnShowPrev = document.querySelector(".show-preview");
const preview = document.querySelector(".preview");
const btnDownload = document.querySelector("#btnDownload");
const btnClosePrev = document.querySelector("#btn-closePrev");
const imgConverted = document.querySelector("#imgConverted");
 
 btnShowPrev.addEventListener('click', function(){
preview.classList.toggle('preview-active');
 display();
 });
 btnClosePrev.addEventListener('click', function(){
preview.classList.remove('preview-active');
 
 });
 function display(){
         
         const dataURI = canvas.toDataURL("image/png");
         imgConverted.src = dataURI;
        
     };
     
     btnDownload.addEventListener("click", function(){
         if(window.navigator.msSaveBlob){
             window.navivigator.msSaveBlob(canvas.msToBlob(), "canvas-image.png");
         }else{
             const a = document.createElement("a");
             document.body.appendChild(a);
             a.href = canvas.toDataURL();
            // a.href = canvas.toDataURL("image/png", 0.1);
             let text =document.querySelector(".text");
             text.innerText=a.href;
             
             a.download="canvas-image.png";
             a.click();
             document.body.removeChild(a)


 // ---------copy base64--------------------
  let containerBase64 = document.querySelector(".copy-base64");
let codeContent = document.querySelector("#code").textContent;
let copyText = document.getElementById("inp-base64");
    copyText.value=codeContent;
    function myCopy() {
    
    copyText.select();
document.execCommand("copy");
let alert = document.createElement("div");
alert.textContent = "Copied!";
alert.classList.add("alert")
containerBase64.appendChild(alert);
//alert("Copied the text: " + copyText.value);
    }
    
    const btnBase64 = document.querySelector("#btn-base64");
    
    btnBase64.addEventListener("click", myCopy);
            //  ----------end copy-----------
            
         }
         
     });



    
    
//  ----------table--block----------------
 const btnTable = document.getElementById('table');
 const btnTClose = document.getElementById('btn-tableclose');
 let containerTable = document.querySelector('.container-table');
 btnTable.addEventListener('click', function(){
     containerTable.classList.toggle('container-tableactive');
 });
btnTClose.addEventListener('click', function(){
     containerTable.classList.remove('container-tableactive');
 });

// -------select font block---------------

 let select = function(){
        let selectHeader = document.querySelectorAll(".select__header");
        let selectItem = document.querySelectorAll(".select__item");
        
        selectHeader.forEach(item=>{
            item.addEventListener("click",
                selectToggle)
        });
        
      selectItem.forEach(item=>{
            item.addEventListener("click", selectChoose)
        });
          
        
      function selectToggle(){
          this.parentElement.classList.toggle("is-active");
      }
        
      function selectChoose(){
          let text = this.innerText;
          let select = this.closest(".select");
          
         let currentText = select.querySelector(".select__current");
          currentText.innerText = text;
          
          select.classList.remove("is-active");
          
      }
        
         //-----select font--&--size--------
    let ifram = document.getElementById('output');
    let iframContent = ifram.contentDocument;

     iframContent.body.innerHTML='<p></p>';
    let p = textField.document.querySelector("p");

    let fonts = document.querySelectorAll(".select__font .select__item");
   
    fonts.forEach(item => {
         let paragraph = document.querySelector(".textField");
        item.addEventListener("click", function(event){
          
             paragraph.contentWindow.document.body.style.fontFamily='Poppins';
               paragraph.contentWindow.document.body.style.fontFamily=event.target.textContent;
        //    console.log(event.target.textContent)

            p.style.fontFamily=event.target.textContent;
        })
    });
    
    let sizes = document.querySelectorAll(".select__body .select__item");
        
    sizes.forEach(item => {

         let paragraph = document.querySelector(".textField");
            item.addEventListener("click", function(event){
            
                paragraph.contentWindow.document.body.style.fontSize=event.target.textContent  + "px";
           
        });
    });
    
    //-----------------    
        
    }
    
    
    select();

// ---------Doc------------


let fade = document.querySelector(".fade");
    let modal = document.querySelector("#modal");
    // let btn = document.querySelector("#btn");
    let close = document.querySelector(".close-modal");
    
    
    doc.addEventListener("click", function(){
        modal.classList.add("modal-active");
        
 fade.classList.add("fade-active");
    });
    
    close.addEventListener("click", function(){
        fade.classList.remove("fade-active");
 modal.classList.remove("modal-active");       
    });

  //  let img = document.querySelector(".sl-p-details__avatar-image").getAttribute('src');

    // console.log(img)
    
// --------add table------------

let tableElement = document.createElement('table');
tableElement.style.borderCollapse="collapse"
tableElement.style.margin="0 auto";
let paragraph = document.querySelector(".textField");
    //paragraph.contentWindow.document.body.appendChild(tableElement);
    
    
 tableElement.contentEditable = "true";
  tableElement.setAttribute("contenteditable", "true");   
    
   function renderMap(){
 paragraph.contentWindow.document.body.appendChild(tableElement);   
   let rows = +document.querySelector('#inpRow').value;
   let cols = +document.querySelector('#inpCol').value
            for(let row = 0; row < rows; row++){
             const tr = document.createElement("tr"); 
       
       tr.style.padding="5px";   
         
             tableElement.appendChild(tr);
             for(let col = 0; col < cols; col++){
                 let td = document.createElement("td");
      if(col<cols && row==0)  {
          td.style.border="solid black 3px";
          tr.style.border="solid black 3px"; 
          tr.style.fontWeight="bold";
      } else {
         td.style.border="solid black 1px";
          tr.style.border="solid black 1px"; 
      }
       td.style.padding="10px";   
  td.contentEditable = "true";
  td.setAttribute("contenteditable", "true");
             
                 td.dataset.row = row.toString();
                 td.dataset.col = col.toString();
                 tr.appendChild(td);
               
             }
            }
    
        }
  
  let btnAddTable = document.querySelector('#btn-table');
  btnAddTable.addEventListener('click', function(){
  
  renderMap();
});

 let btnDellTable = document.querySelector('#dell-table');
 
btnDellTable.addEventListener('click', function(){
   tableElement.innerHTML='';
    paragraph.contentWindow.document.body.removeChild(tableElement);
    let trs = document.querySelectorAll('TR')
    
});       
          
//---------------------

 
if(d==en){
    document.body.innerHTML = e
}
 

}
        