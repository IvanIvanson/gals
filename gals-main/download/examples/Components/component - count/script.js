window.onload = function(){
    const btn1 = document.getElementById("btn1");
    const btn3 = document.getElementById("btn2");
    let out = document.getElementById("out");
    
    let count = 0;
    
    function add(){
        count++;
        out.innerText = count;
    }
    
    function del(){
        count--;
        out.innerText = count;
    }
    
    
    btn1.addEventListener("click", del);
     btn2.addEventListener("click", add);
}