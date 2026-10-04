window.onload = function(){

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
    const WIDTH = 300;
    const HEIGHT = 200;
    const DPI_WIDTH = WIDTH*4;
    const DPI_HEIGHT = HEIGHT*4;
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

/*---grid chart---*/

ctx.beginPath();
         
          for (let y = 0; y < 800; y += 50)
           {
           ctx.moveTo(0, y); 
           ctx.lineTo(1200, y);
          
           ctx.lineWidth = .5;
           
           
           } 
           for (let x = 0; x < 1200; x += 50)
           {
           
           ctx.moveTo(x, 0); 
           ctx.lineTo(x, 800);
           } 
           ctx.lineWidth = .5;
           ctx.strokeStyle = "blue";
           ctx.stroke();
           
ctx.closePath();

/*---End grid chart---*/
// Create object

let options = {
    legend: '',
    x: [],
    y: []
}
 

/*---Label text chart---*/
function optionsChart(){
options.legend = document.querySelector("#legend").value;
ctx.font = "bold 80px sans-serif";
ctx.fillStyle = "orange";
ctx.lineWidth = 2;
ctx.fillText(options.legend, 350, 70);
ctx.strokeText(options.legend, 350, 70);
ctx.stroke();
}
ctx.font = "60px sans-serif";
ctx.fillStyle = "red";
ctx.fillText("y", 10, 40);
ctx.fillText("x", 1160, 790);
/*---End label text chart---*/

/*---Draw chart---*/

ctx.strokeStyle = "#000";


/*
ctx.beginPath();

ctx.moveTo(0, 0 + DPI_HEIGHT);

for(let i = 0; i < x.length; i++){
    ctx.lineTo(x[i], y[i]);  
    
}
ctx.stroke();
*/
/*---End draw chart---*/

function add(){
let x = options.x;
let y = options.y;
    let inpX = +document.querySelector("#inpX").value;
    let inpY = +document.querySelector("#inpY").value;
    x.push(inpX);
    y.push(DPI_HEIGHT - inpY);
    ctx.beginPath();
ctx.lineWidth = 4;
ctx.moveTo(0, 0 + DPI_HEIGHT);

for(let i = 0; i < x.length; i++){
    ctx.lineTo(x[i], y[i]);  
    /*--circle points--*/
    ctx.arc(x[i], y[i],5,0,Math.PI*2,true);
    /*---*/
   
    
    /*---*/
    if(x[i] < 100){
    ctx.font = "500 25px sans-serif";
ctx.fillStyle = "black";
     ctx.fillText('Point' + (i+1) +'(' + x[i] +','+ (DPI_HEIGHT - y[i]) + ')', x[i]+ x[i], y[i]+40);
    }else{
        ctx.font = "500 25px sans-serif";
ctx.fillStyle = "black";
ctx.fillText('Point' + (i+1) +'(' + x[i] +','+ (DPI_HEIGHT - y[i]) + ')', x[i]-190, y[i]-10);
    }
}

ctx.stroke();
optionsChart()
};


let addBtn = document.querySelector("#btn");
addBtn.addEventListener("click", add);

}