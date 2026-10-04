 //делаем задержку перехода по ссылке
 window.onload = function() { 
 var body = document.querySelector('body');
  var links = document.querySelectorAll('a'); links.forEach(function (link) { 
  link.addEventListener('click', onLinkClicked); 
  function onLinkClicked(event) { 
  event.preventDefault();
   //body.classList.remove('animated-show-active')
    setTimeout(onAnimationComplete, 2000); }
    function onAnimationComplete() { 
    window.location = link.href; 
    } 
    });
    
     }