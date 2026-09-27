const copyBlock = function (copyblock, code, text, copyBtn) {
    let container = document.querySelector(copyblock);
    
    let codeContent = document.querySelector(code).textContent;
    
  let copyText = document.getElementById(text);
  copyText.value = codeContent;
  function myCopy() {
    copyText.select();
    document.execCommand("copy");
    let alert = document.createElement("div");
    alert.textContent = "Copied!";
    alert.classList.add("alert");
    container.appendChild(alert);
    //alert("Copied the text: " + copyText.value);
  }

  const btn = document.querySelector(copyBtn);

  btn.addEventListener("click", myCopy);
};

export default copyBlock;