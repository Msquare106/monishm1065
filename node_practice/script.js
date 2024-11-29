let time = document.querySelector(".container");
let dt = new Date();
let i = 0;
function updatetime(){
    time.innerHTML = i++;
}
setInterval(updatetime, 2000);