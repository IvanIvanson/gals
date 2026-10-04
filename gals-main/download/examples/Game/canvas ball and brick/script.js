window.onload = function(){

let ctx = document.querySelector("canvas").getContext("2d");
    const WIDTH = 300;
    const HEIGHT = 350;
    const DPI_WIDTH = WIDTH*4;
    const DPI_HEIGHT = HEIGHT*4;
    
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    
    
    var x = canvas.width/2; 
    var y = canvas.height-400;
    var dx = 4; 
    var dy = -4;
    var ballRadius = 40;
    var ballColor = "#0095DD";
    var ballColorCollision = "red";
    var lives = 3;
    /*--paddle--*/
    var paddleHeight = 40; 
    var paddleWidth = 250; 
    var paddleX = (canvas.width-paddleWidth) / 2;
    var score = 0;
    
    var rightPressed = false; 
    var leftPressed = false;
    /*----------*/
    /*--sound ---*/
 
 var sound = { 
"oldParams": true, 
"wave_type": 1, 
"p_env_attack": 0, 
"p_env_sustain": 0.35278502829007483, "p_env_punch": 0, 
"p_env_decay": 0.9718540993592685, "p_base_freq": 0.96126191208337196, "p_freq_limit": 0, 
"p_freq_ramp": 0.43787689856926615, "p_freq_dramp": 0, 
"p_vib_strength": 0, 
"p_vib_speed": 0, 
"p_arp_mod": 0, 
"p_arp_speed": 0, 
"p_duty": 1, 
"p_duty_ramp": 0, 
"p_repeat_speed": 0.7558565452384385, "p_pha_offset": 0, 
"p_pha_ramp": 0, 
"p_lpf_freq": 1, 
"p_lpf_ramp": 0,
 "p_lpf_resonance": 0, "p_hpf_freq": 0, "p_hpf_ramp": 0, "sound_vol": 0.25, "sample_rate": 44100, 
 "sample_size": 1
 };

 var s = new SoundEffect(sound).generate(); 
// returns a webaudio object if supported, or an Audio object 
//s.getAudio().play();

var s = new SoundEffect("5EoyNVSymuxD8s7HP1ixqdaCn5uVGEgwQ3kJBR7bSoApFQzm7E4zZPW2EcXm3jmNdTtTPeDuvwjY8z4exqaXz3NGBHRKBx3igYfBBMRBxDALhBSvzkF6VE2Pv").generate(); 

 /*----------*/
    
    
    
    /*----bricks------*/
    
    var brickRowCount = 3; 
    var brickColumnCount = 6; 
    var brickWidth = 150; 
    var brickHeight = 40; 
    var brickPadding = 20;
    var brickOffsetTop = 80; 
    var brickOffsetLeft = 90;
    
    
    var bricks = []; 
    for(var c=0; c<brickColumnCount; c++) { 
    bricks[c] = []; 
    for(var r=0; r<brickRowCount; r++) {
     bricks[c][r] = { 
     x: 0, 
     y: 0,
     status: 1
     };
      } 
      }
      
    /*----draw bricks-------*/  
    
    function drawBricks() {
     for(var c=0; c<brickColumnCount; c++) {
 for(var r=0; r < brickRowCount; r++) {
 
 if(bricks[c][r].status == 1) {
var brickX = (c*(brickWidth + brickPadding))+brickOffsetLeft;
var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        
         bricks[c][r].x = brickX; 
         bricks[c][r].y = brickY;
          ctx.beginPath(); 
         ctx.rect(brickX, brickY, brickWidth, brickHeight); 
         ctx.lineWidth = 4;
         ctx.fillStyle = "#0095DD";
         ctx.strokeStyle = "#000";
         ctx.stroke();
         ctx.fill();
         ctx.closePath(); 
             }
           } 
         }
       }
    
    
    /*-----collision ball and brick-----*/
    
    function collisionDetection() { 
    for(var c=0; c<brickColumnCount; c++) {
     for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r]; 
      if(b.status == 1) {
      if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
       dy = -dy; 
       b.status = 0;
       score++;
       ballColor = ballColorCollision;
       
       
        s.getAudio().play();
       
       if(score == brickRowCount*brickColumnCount) {
        //alert("YOU WIN, CONGRATULATIONS!");
         //document.location.reload();
         
         drawVictory();
          clearInterval(interval);
         // Needed for Chrome to end game 
        }
       
           } 
          } 
         }
        }
      }
    /*----------*/
    /*--счет--*/
    function drawScore(){
     ctx.font = "40px Georgia"; 
     ctx.fillStyle = "#0095DD"; ctx.fillText("score: " + score, 20, 40);
     }
    /*----*/
    
    function drawLuzer(){
     ctx.font = "100px Georgia"; 
     ctx.fillStyle = "tomato"; ctx.fillText("GAME OVER" , 300, 400);
     }
     function drawVictory(){
     ctx.font = "70px Georgia"; 
     ctx.fillStyle = "tomato"; ctx.fillText("YOU WIN, CONGRATULATIONS!" , 70, 400);
     }
     
    /*----счетчик жизни----*/
    function drawLives() {
     ctx.font = "40px Arial";
      ctx.fillStyle = "#0095DD";
       ctx.fillText("Lives: "+lives, canvas.width-165, 40);
        }
    
    /*---------*/
function drawBall() {
 ctx.beginPath(); 
 ctx.arc(x, y, ballRadius, 0, Math.PI*2);  
  ctx.fillStyle = ballColor;
  ctx.fill(); 
  ctx.closePath();
   } 
   /*-----рисуем ракетку----*/
   function drawPaddle() { 
   ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); 
    ctx.fillStyle = "#0095DD"; 
    ctx.fill();
    ctx.closePath(); 
    
    }
   /*-------------*/
   
   function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBricks();
    drawBall(); 
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    x += dx; 
    y += dy; 
    if(x + dx > (canvas.width-ballRadius) || x + dx < ballRadius) {
     dx = -dx;
     } 
     
    /*--столкновение мяча с ракеткой--*/
   if(y + dy < ballRadius) {
    dy = -dy; 
    } else if(y + dy > canvas.height-ballRadius) {
     if(x > paddleX && x < paddleX + paddleWidth) { 
     dy = dy+4;
     dx = dx+4;
     dy = -dy; 
     ballColor = "#0095DD";
     } 
     else { 
     
   lives--; 
    if(!lives) { 
   // alert("GAME OVER");
   drawLuzer();
    //document.location.reload();
     clearInterval(interval); 
    // Needed for Chrome to end game
     } 
     else {
      x = canvas.width/2;
      y = canvas.height-30; 
      dx = 3;
      dy = -3; 
   paddleX = (canvas.width-paddleWidth)/2; 
       }
     } 
     } 
    /*-----------*/
    
     
     /*------движение ракетки------*/
     if(rightPressed) { 
     paddleX += 20;
     if (paddleX + paddleWidth > canvas.width){ 
     paddleX = canvas.width - paddleWidth;
      }
     
      } 
     else if(leftPressed) { 
     paddleX -= 20; 
     
     if (paddleX < 0){ 
     paddleX = 0; 
     }
     
     }
     /*------------*/
     x += dx; 
     y += dy;
    //requestAnimationFrame(draw);
    
   // var interval = setInterval(draw, 10);
    }
    
    let up = document.querySelector("#up");
    let down = document.querySelector("#down");
   up.addEventListener("click", keyDownHandler, false);
   
    down.addEventListener("click", keyUpHandler, false); 
    
    function keyDownHandler() {
    rightPressed = true;
    leftPressed = false;
    }
    function keyUpHandler() {
    rightPressed = false;
    leftPressed = true;
    }
    
     ctx.font = "80px Georgia"; 
     ctx.fillStyle = "white";   ctx.fillText("Click Start", 400, 300);
    
   let btnStart = document.querySelector("#start");
    document.querySelector("#start").onclick=function(){
    
    
    if (btnStart.innerHTML === "Start"){
  interval =  setInterval(draw,20);
   btnStart.innerHTML = "Stop";
   
  }
  else if(btnStart.innerHTML === "Stop"){
 
      btnStart.innerHTML = "Start";
      
      clearInterval(interval);
      
  }
  }
  

}