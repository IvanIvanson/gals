navigator.getBattery().then(function(battery){
    function updateAllBatteryInfo(){
        updateChargeInfo();
        updateLevelInfo();
       
    }
    
    updateAllBatteryInfo();
    
    
    battery.addEventListener('levelchange', updateLevelInfo);
    
     function updateLevelInfo(){
     document.getElementById("battery-digit").innerHTML =  Math.round(battery.level*100) + '%';
       if(battery.level <= 0.2){
           document.getElementById("battery-digit").style.color =  "red";
       }else{
           document.getElementById("battery-digit").style.color =  "#00fff9";
       }
          
    };
    
    
    
    /*-----------*/  
    battery.addEventListener('charginchange', function(){
        updateChargeInfo();
    });
    function updateChargeInfo(){
       // console.log(battery.charging);
        if(battery.charging == false){
        p = document.getElementById("result");
        p.innerHTML ="the battery is running out";
        document.querySelector(".container").remove("z");
        document.querySelector("#square").classList.remove("square-animate");
        
        }else{
         p = document.getElementById("result");
         p.innerHTML ="battery is charging";
              
         document.querySelector("z");   
         document.querySelector("#square").classList.add("square-animate");
           
        }
    }
/*-----------*/
    
    
    
});



  