
function openNav() {
    document.getElementById("sideMenu")
        .style.width = "300px";
    document.getElementById("contentArea")
        .style.marginLeft = "300px";
}
 
function closeNav() {
    document.getElementById("sideMenu")
        .style.width = "0";
    document.getElementById("contentArea")
        .style.marginLeft = "0";
}
 
function showContent(content) {
    document.getElementById("contentTitle")
        .textContent = content + " page";
         
    closeNav();
}

// Call addDummyData when the button is clicked
document.getElementById('init-dummy-data').addEventListener('click', addDummyData);
