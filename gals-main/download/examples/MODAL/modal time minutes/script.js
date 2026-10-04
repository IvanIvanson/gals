 window.onload=function(){
       

    document.addEventListener("click", function(e){
      let id = e.target.dataset.toggleId;
      if(!id) return
      let elem = document.getElementById(id);
      elem.hidden = !elem.hidden;
      document.body.classList.toggle("bg");
     
     
    });
    
   //------таймер--------- 
   
     // конечная время в секундах, например 10мин = 600сек
      const deadline = 600; 
      let n = 0;
      // id таймера 
      let timerId = null; 
      // склонение числительных 
      function declensionNum(num, words) { 
      return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]]; } 
      // вычисляем разницу времени и устанавливаем оставшееся времени в качестве содержимого элементов 
      function countdownTimer() { 
      const diff = deadline - n; 
      n++;
      if (diff <= 0) { 
      clearInterval(timerId);
       }
    
   
     
      const minutes = diff > 0 ? Math.floor(diff / 60) % 60 : 0; 
    const seconds = diff > 0 ? Math.floor(diff % 60) : 0;
   
     $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
     $seconds.textContent = seconds < 10 ? '0' + seconds : seconds; 
   
      $minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']); 
      $seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']); 
      }
      
      // получаем элементы, содержащие компоненты времени
    
    const $minutes = document.querySelector('.timer__minutes');
     const $seconds = document.querySelector('.timer__seconds'); 
      // вызываем функцию countdownTimer
 countdownTimer(); 
 // вызываем функцию countdownTimer каждую секунду
 timerId = setInterval(countdownTimer, 1000); 
 
 
 };
      
      
      
   //--------------- 

  
   