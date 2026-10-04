window.onload = function(){
    const inpName = document.getElementById("name");
    const btn = document.getElementById("btn");
    const out = document.getElementById("out");
    const wind = document.getElementById('window');
    const modal = document.getElementById('myModal');
    const closeButton = document.getElementById('closeModalBtn');
    
    function addName(){
    let name = inpName.value;
    
       if(name){
           out.innerText = "Welcom "+name;
       }else{
           showModal();
       }
    
    }
    
    // Функция отображения модального окна
function showModal() {
    modal.style.display = 'block';
    wind.classList.add("active");
    btn.classList.add("disable");
    inpName.classList.add("disable");
}

// Функция скрытия модального окна
function hideModal() {
    modal.style.display = 'none';
    wind.classList.remove("active");
    btn.classList.remove("disable");
    inpName.classList.remove("disable");
}
closeButton.addEventListener('click', hideModal); // Закрытие окна по крестику

// Закрываем модальное окно при нажатии вне его области
window.onclick = function(event) {
    if (event.target === modal) {
        hideModal();
    }
};
    
    btn.addEventListener("click", addName);
    
}
