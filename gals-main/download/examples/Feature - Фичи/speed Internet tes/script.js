setInterval(
window.onload=function(){
    
    let bar = document.querySelector(".bar");
    
    
    
    
    
    let out = document.querySelector("#out");
let iconStatus = document.querySelector("#icon");
function checkOnlineState(){ 
if (navigator.onLine){ 
//window.location = "https://example.com/"; 
out.innerHTML = "<div class='wrapper'<span class='onl'>Онлайн </span><div class='circle'></div></div>";
iconStatus.innerHTML = "<i class='bi bi-reception-4'></i>"
} 
else { 
iconStatus.innerHTML = '<i class="bi bi-wifi-off"></i>';
out.innerText="нет подключения к интернету"
 } }
  window.addEventListener('online', checkOnlineState); 
  checkOnlineState();
    
    




    let startTime, endTime;
    let imageSize = "";
    let image = new Image();
    
    /*let bitOutput = document.getElementById("bits");
    let kboutput = document.getElementById("kbs");*/
    let mboutput = document.getElementById("mbs");
   // let bar = document.getElementById("bar");
    
    let imageLink = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crooioop&w=880&q=80";
    
    
    image.onload = async function(){
        endTime = new Date().getTime();
        
     await fetch(imageLink).then((response) => {
            imageSize = response.headers.get("content-length");
            calculateSpeed();
        });
        
    };
    
    
    function calculateSpeed(){
        let timeDuration = (endTime - startTime) / 1000;
        
        let loadBits = imageSize * 86;
        
        let speedInBps = (loadBits / timeDuration).toFixed(2);
        let speedInKbps = (speedInBps / 1024).toFixed(2);
        let speedInMbps = (speedInKbps / 1024).toFixed(2);
        
     /*   bitOutput.innerHTML += `${speedInBps}`;
        kboutput.innerHTML += `${speedInKbps}`;*/
        mboutput.innerHTML = `${speedInMbps} <b>Mbs</b>`
        
       // bar.style.transform = `${speedInMbps*10}`+"px";
        
        
       bar.style.transform = "rotate(" + `${speedInMbps*2-90}` + "deg)" 
        
   /*    if(speedInMbps <= 4){
        bar.style.backgroundColor="tomato"
    } if(speedInMbps > 4 && speedInMbps < 6){
        bar.style.backgroundColor="orange"
    } if(speedInMbps >= 6){
        bar.style.backgroundColor="lightgreen"
    } 
    */
    
        
        
    };
    
    
    
    const init = async () => {
        startTime = new Date().getTime();
        image.src = imageLink
    }
    
    init()
},1000)

