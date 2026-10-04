navigator.getBattery().then(function(battery){
    function updateAllBatteryInfo(){
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }
    
    updateAllBatteryInfo();
    
    battery.addEventListener('charginchange', function(){
        updateChargeInfo();
    });
    function updateChargeInfo(){
        console.log(battery.charging);
        if(battery.charging == false){
        p = document.getElementById("result");
        p.innerHTML ="the battery is running out";
        document.querySelector("#battery-level").classList.remove("battery-animation");
        }else{
         p = document.getElementById("result");
              p.innerHTML ="battery is charging";
              document.querySelector("#battery-level").classList.add("battery-animation");
        }
    }
    
    battery.addEventListener('levelchange', updateLevelInfo);
    
     function updateLevelInfo(){
    
    console.log(battery.level);
       
  document.getElementById("battery-digit").innerHTML =  (battery.level.toFixed(2))*100 + '%';
       if(battery.level <= 0.2){
           document.getElementById("battery-digit").style.color =  "red";
       }else{
           document.getElementById("battery-digit").style.color =  "blue";
       }
     

       
        
document.getElementById("battery-level").style.width = battery.level*100+ '%';     
       
       
    };
    
    battery.addEventListener('chargintimechange', updateChargingInfo);
    
    function updateChargingInfo(){
    
       console.log(battery.chargingTime);
       
       if(battery.chargingTime == Infinity){
        document.getElementById("chargingTime").innerHTML = 'charging time: ' + battery.chargingTime + ' second';
        }else{
            document.getElementById("chargingTime").innerHTML ='charging time: ' + battery.chargingTime + ' second';
        }
    };
    
    battery.addEventListener('dischargintimechange', updateDischargingInfo);
   
    function updateDischargingInfo(){
        document.getElementById("dischargingTime").innerHTML = 'discharge time: ' + battery.dischargingTime + ' second';
    }
    
    
    
    
});