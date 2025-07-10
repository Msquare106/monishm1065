function run_clock(){
    let time = new Date();
    let segments_containers = document.querySelectorAll(".main-container .clock-container .metric-box .number-box");
    let time_string = String(time.getHours()).padStart(2, "0") + String(time.getMinutes()).padStart(2, "0") + String(time.getSeconds()).padStart(2, "0");
    let pattern_array = ["ABCDEF", "BC", "ABGED", "ABGCD", "FGBC", "AFGCD", "AFEDCG", "ABC", "ABCDEFG", "AFGBCD"];
    for(let i=0; i<time_string.length; i++){
        segments_containers[i].querySelectorAll(".lines").forEach((segment)=>{
            segment.style.opacity = 0;
        })
        for(let alp of pattern_array[Number(time_string[i])]){
            segments_containers[i].querySelector(`[data-line="${alp}"]`).style.opacity = 1;
        }
    }
}

run_clock();
setInterval(run_clock, 1000);