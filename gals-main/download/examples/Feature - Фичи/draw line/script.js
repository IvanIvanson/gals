window.onload = function () {

        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
  //-----draw grid---------
  
  let a = (9/10)*canvas.height;
    let b = (1/10)*canvas.height;
    ctx.translate(0.5, 0.5);
    
            
   
    
    function gorizontalLine(){
    
        for(let i=0; i < a; i+=b){
        
        
  ctx.lineWidth = (i/10 === 12)?3:1;
        
  ctx.strokeStyle = (i/10 % 2 === 0)?"red":"green";       
        
        ctx.beginPath();
        ctx.moveTo(b, b+i);
        ctx.lineTo(a, b+i);
        ctx.stroke();
        //console.log(i)
        }
        
    }
         
    function verticalLine(){
    
        for(let i=0; i < a; i+=b){
        
  ctx.lineWidth = (i/10 === 12)?3:1;
        
  ctx.strokeStyle = (i/10 % 2 === 0)?"red":"green"; 
        
            ctx.beginPath();
        ctx.moveTo(b+i, b);
        ctx.lineTo(b+i, a);
        ctx.stroke();
        
        }
        
    }
    
    gorizontalLine();
    verticalLine();
  
  
  //-----draw grid end--------     
       
        
        function drawAnimatedLine() {
            // Получаем коэффициенты из инпутов
            const k = parseFloat(document.getElementById('k').value);
            const b = parseFloat(document.getElementById('b').value) + 30; 
           
            // Очищаем canvas перед новой отрисовкой
         ctx.clearRect(0, 0, canvas.width, canvas.height);   
            gorizontalLine();
    verticalLine();
            // Настройки линии
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            
            // Начальные и конечные точки
            startX = (1/10)*canvas.height;//край X
           
            const endX = 250;
            const step = 2.5; // Шаг для плавности
            let currentX = startX;
            let stopY = (9/10)*canvas.height;
            // Начальная точка
            ctx.moveTo(startX, k * startX + b);
            
      // ctx.clearRect(0, 0, canvas.width, canvas.height);     
            
            function animate() {
           
             
                if (currentX >= endX) return; // Остановка анимации
                 
                currentX += step;
                const y = k * currentX + b;
                if (y >= stopY || y <= startX) return;
                ctx.lineTo(currentX, y);
                ctx.stroke();
                
                requestAnimationFrame(animate);
            }
            
            animate();
            
        }
        
        // Рисуем линию при загрузке (по умолчанию y = 2x + 3)
        drawAnimatedLine();
        
   const btn = document.getElementById('btn');   
   btn.addEventListener("click", function() {
    
   drawAnimatedLine();
   
   });
    

}