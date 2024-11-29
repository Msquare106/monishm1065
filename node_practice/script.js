let time = document.querySelector(".container");
let dt = new Date();

setInterval(()=>{
    time.innerHTML = dt.toLocaleTimeString();
}, 1000);