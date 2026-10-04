 window.onload=function(){


   let gameTableElement = document.createElement('table');
    document.body.appendChild(gameTableElement);
 gameTableElement.contentEditable = "true";
  gameTableElement.setAttribute("contenteditable", "true");   
    
   function renderMap(){
   let rows = +document.querySelector('#inpRow').value;
   let cols = +document.querySelector('#inpCol').value
            for(let row = 0; row < rows; row++){
             const tr = document.createElement("tr"); 
             gameTableElement.appendChild(tr);
             for(let col = 0; col < cols; col++){
                 let td = document.createElement("td");
                 td.dataset.row = row.toString();
                 td.dataset.col = col.toString();
                 tr.appendChild(td);
             }
            }
        }
  
  let btn = document.querySelector('#btn');
  btn.addEventListener('click', renderMap);
    
} 
    