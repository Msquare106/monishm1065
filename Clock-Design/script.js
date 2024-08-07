let sec = document.querySelector(".clock-circle .seconds");
let min = document.querySelector(".clock-circle .mins");
let hour = document.querySelector(".clock-circle .hours");
let animate_button = document.getElementById("reload");
let i = new Date();
sec.style.transform = "rotate("+String(i.getSeconds() * 6)+"deg)";
min.style.transform = "rotate("+String((i.getMinutes() * 6)+(i.getSeconds() * 0.1))+"deg)";
hour.style.transform = "rotate("+String((i.getHours() * 30) + (i.getMinutes() * 0.5))+"deg)";
setInterval(()=>{
    let j = new Date();
    document.querySelector(".date-time").innerHTML = "<i>"+j.toDateString()+"</i><i>"+ j.toLocaleTimeString('en-US', { hour12: true, hour24: false }).padStart(11, '0')+"</i>";
    sec.style.transform = "rotate("+String(j.getSeconds() * 6)+"deg)";
    min.style.transform = "rotate("+String((j.getMinutes() * 6)+(j.getSeconds() * 0.1))+"deg)";
    hour.style.transform = "rotate("+String((j.getHours() * 30) + (j.getMinutes() * 0.5))+"deg)";
    }, 1000)

animate_button.addEventListener('click', ()=>{
    location.reload();
})