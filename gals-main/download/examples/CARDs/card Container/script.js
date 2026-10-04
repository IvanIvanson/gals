window.onload = function(){
var hdr = document.querySelector(".hdr");

function changeWidth(){

if(window.innerWidth > 415){
hdr.style.width = 100 + "vw";
}

}
changeWidth();
hdr.onclick=function(){
    hdr.style.width = 100 + "vw";
}
}
