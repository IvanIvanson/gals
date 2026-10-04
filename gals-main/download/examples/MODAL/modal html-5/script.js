window.onload=function(){
function Onclick(){
        let dialog = document.getElementById("Dialog");
       document.querySelector("#showDialog").onclick=function(){
            dialog.show();
        };
        document.querySelector("#closeDialog").onclick=function(){
            dialog.close();
        }
    }
    document.querySelector("#showDialog").addEventListener("click", Onclick);
}