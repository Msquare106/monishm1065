let time = document.querySelector(".container");
let dt = new Date();

function updatetime(){
    time.innerHTML = dt.toLocaleTimeString();
}
setInterval(updatetime(), 1000);