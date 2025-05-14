let check_rel_btn = document.getElementById("check_rel_btn");
let reset_flames = document.getElementById("reset_flames");
reset_flames.addEventListener('click', ()=>{
    location.reload();
})
check_rel_btn.addEventListener('click', ()=>{
    let name_1 = document.getElementById("name_1").value;
    let name_2 = document.getElementById("name_2").value;
    let flame_container = document.querySelector('.flame-container');
    let definition = document.querySelector('.flame-container .definition');
    let def = ['FRIENDS', 'LOVE', 'AFFECTIONATE', 'MARRIAGE', 'ENEMIES', 'SIBLINGS'];
    if(name_1 !== "" && name_2 !== ""){
        let flame_letters = document.querySelectorAll('.flame-container .flame');
        let rel = get_relation(remove_common_get_count(name_1, name_2) + remove_common_get_count(name_2, name_1));
        for(let i = 0; i < def.length; i++){
            if(rel === def[i][0]){
                definition.innerHTML = def[i];
                definition.style.transform = "scaleY(1)";
                document.getElementById(`id_of_${rel}`).style.transform = `translateX(calc((-100% * ${i}) - (10px * ${i})))`;
            }else{
                flame_letters[i].style.transform = `scaleY(0)`;
            }
        }
        flame_container.classList.add("animated");
    }
})

function remove_common_get_count(name_1, name_2){
    name_1 = (name_1.replace(/\s+/g, "")).toUpperCase();
    name_2 = (name_2.replace(/\s+/g, "")).toUpperCase();
    for(let i = 0; i < name_1.length; i++){
        if(name_2.includes(name_1[i])){
            name_2 = name_2.replace(name_1[i], "");
        }
    }
    return name_2.length;
}

function get_relation(total){
    let flame = "FLAMES";
    while(flame.length > 1){
        let index = (total - 1) % flame.length;
        flame = flame.slice(index + 1) + flame.slice(0, index);
    }
    return flame;
}