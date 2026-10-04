window.onload=function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    
    const WIDTH = 200;
    const HEIGHT = 200;
    const PADDING = 40;
    const DPI_WIDTH = WIDTH*2;
    const DPI_HEIGHT = HEIGHT*2;
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;
    
const scaleX = 50;
const scaleY = 50;
const shiftNumberNames = 5;
const shiftAxisNames = 20; 
const xAxis = Math.round(canvas.width / scaleX / 2) * scaleX;
const yAxis = Math.round(canvas.height / scaleY / 2) * scaleY; 
ctx.font = `${Math.round(scaleX / 2)}px Arial`;
 
    
    // Рисуем сетку (draw grid)
    
    function greedAndAxios(){
     ctx.beginPath();
 ctx.strokeStyle = '#f5f0e8'; 
 
 
 for (let i = 0; i <= canvas.width; i = i + scaleX) { 
 ctx.moveTo(i, 0); 
 ctx.lineTo(i, canvas.height);
 ctx.fillStyle = "#fff";
  ctx.fillText((i - xAxis) / scaleX, i + shiftNumberNames, yAxis + shiftNumberNames+20);} 
 
 
 for (let i = 0; i <= canvas.height; i = i + scaleY) { 
 ctx.moveTo(0, i); 
 ctx.lineTo(canvas.width, i); ctx.fillText((yAxis - i) / scaleY, xAxis + shiftNumberNames, i + shiftNumberNames+21);
 
 } 
  ctx.stroke();
  ctx.closePath();
 
  // Рисуем главные оси (draw main axios)
   
  ctx.beginPath();
  ctx.strokeStyle = '#f00000';
  ctx.fillStyle = "tomato";
  ctx.moveTo(xAxis, 0);
  ctx.lineTo(xAxis, canvas.height);
  
  ctx.fillText('y', xAxis - shiftAxisNames, 20); 
  ctx.moveTo(0, yAxis);
  ctx.lineTo(canvas.width, yAxis);
  
  ctx.fillText('x', canvas.width - shiftAxisNames, yAxis - shiftAxisNames+15);  
   ctx.stroke();
   
   ctx.closePath(); 
  }
    greedAndAxios();
    
    function fun(){
     ctx.clearRect(0,0,canvas.width,canvas.height);  
    
 ctx.beginPath();
 ctx.strokeStyle = '#f5f0e8'; 
 
 //draw grid and axios
 
 greedAndAxios();
  
  //draw chart 
  
    var timer;
    var i = 0;
    
    
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.stroke();
    ctx.closePath(); 
    
     function drawChart(){
     
       const x = (i - xAxis) / scaleX;  
       
        var a = +document.getElementById("a").value;
        var b = +document.getElementById("b").value;
        var c = +document.getElementById("c").value;
        
        
        var d = Math.pow(b,2)-4*a*c;
        const D = Math.sqrt(d);
        
        var x1 = (-b + D)/(2*a);
        var x2 = (-b - D)/(2*a);
       
  const y = a*Math.pow(x,2)+b*x+c; 
  ctx.fillRect(x * scaleX + xAxis, yAxis - scaleY * y, 2, 3);
        i =i + 0.4;
        timer = setTimeout(drawChart, 1);    
        
       
        if(Math.floor(y)==0 && x.toFixed(0) >= 0 && d >= 0){
           let out = document.querySelector("#out");
           out.innerHTML='корень уравнения  x<sub>1</sub> = '+ x1.toFixed(2);
            }
            
        else if(Math.round(y)==0 && x.toFixed(0) <= 0 && d >= 0 ){
           let out2 = document.querySelector("#out2");
           out2.innerHTML='корень уравнения    x<sub>2</sub> = '+ x2.toFixed(2);
            
            }
            
            else if(Math.ceil(x)>0 && d < 0){         out.innerHTML='нет действительных кореней уравнения';
                clearTimeout(timer)
            }
                 
            
    }
    drawChart();
  } document.querySelector("#draw").onclick=function(){
    fun();
    }
}