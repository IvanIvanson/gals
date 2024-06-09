// --header details ul li class add version
const versions = function () {
    let listVersions = document.querySelectorAll(".version li");
    listVersions.forEach((item) => {
        item.addEventListener("click", function () {
            item.classList.toggle("active");
        });
    });
}
export default versions;