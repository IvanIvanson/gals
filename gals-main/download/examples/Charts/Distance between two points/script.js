window.onload = function(){

function distance(x1, y1, x2, y2) {
 var dx = x2 - x1;
var dy = y2 - y1;
 return Math.sqrt(dx*dx + dy*dy);
  }
  document.querySelector("#btn").onclick=function(){
  let d = distance;
  
  x1 = +document.querySelector("#inpX1").value;
  x2 = +document.querySelector("#inpX2").value; 
  y1 = +document.querySelector("#inpY1").value;
  y2 = +document.querySelector("#inpY2").value;
  
  let out = document.querySelector("#out");
  out.innerHTML = '  =' + d(x1,y1,x2,y2).toFixed(2);
  
  
if(x1.length==""||x2.length==""||y1.length==""||y2.length == ""){
alert("input value please");
}

/*-----line----*/
const shortLine = document.getElementById('line'); shortLine.setAttribute('x1', `${x1}`); shortLine.setAttribute('y1', `${y1}`); shortLine.setAttribute('x2', `${x2}`); shortLine.setAttribute('y2', `${y2}`);

/*--------*/

/*--points--*/

const point1 = document.getElementById('circle1'); point1.setAttribute('cx', `${x1}`); point1.setAttribute('cy', `${y1}`);

const point2 = document.getElementById('circle2'); point2.setAttribute('cx', `${x2}`); point2.setAttribute('cy', `${y2}`);

/*----*/
const textX1 = document.getElementById('textX1');
 textX1.setAttribute('x', `${x1}`);  
 textX1.setAttribute('y', `${-y1}`);
 textX1.innerHTML = 'A ('+ x1 + ',' + y1 + ')';




const textX2 = document.getElementById('textX2');
 textX2.setAttribute('x', `${x2}`);  
 textX2.setAttribute('y', `${-y2}`);
 textX2.innerHTML = 'B ('+ x2 + ',' + y2 + ')';
 
 
 /*-----------*/
 
 let tan = (y2-y1)/(x2-x1);
 deg = getTanRad(tan);
 
 function getTanRad(rad) { 
 var deg = rad/(Math.PI/141.41); 
 return deg.toFixed(1); 
 }
 
 const textD = document.getElementById('textD');
 textD.setAttribute('x', `${(x1+x2)/2}`);  
 textD.setAttribute('y', `${(-y2-y1+20)/2}`);
 textD.setAttribute("transform", "rotate("+`${deg}`+")"); 
 
 textD.innerHTML = "Dist = " + d(x1,y1,x2,y2).toFixed(2);
 
 
 
/*console.log(deg);*/
 
/*------------*/
}





}

