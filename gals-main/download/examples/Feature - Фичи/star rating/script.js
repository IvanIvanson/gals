window.onload=function(){
let w = document.querySelector(".bar").clientWidth;
let bar = document.querySelector(".bar-inner");

const stars = document.querySelectorAll('.star');
const step = w/stars.length;   
    
    
     stars.forEach(function(star) { 
     star.addEventListener('click', setRating);
      }); 
      function setRating(e) { 
      const rating = e.target.getAttribute('data-rating');
       stars.forEach(function(star) { 
    if (star.getAttribute('data-rating') <= rating) { 
       star.classList.add('rated');
       bar.style.width=step*rating + "px";
        } 
       else { star.classList.remove('rated');
       
        } });
        
         }
         
        // console.log(step)
}