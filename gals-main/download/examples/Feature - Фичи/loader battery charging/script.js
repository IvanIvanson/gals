navigator.getBattery().then(function(battery){
    function updateAllBatteryInfo(){
        
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
     
    
});