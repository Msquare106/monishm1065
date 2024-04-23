
// Getting Xlsx File from user
const xl_file = document.getElementById('excel_file');
var get_data_btn = document.getElementById('get_data_btn');
var state_opt = document.getElementById('state-options');
var phase_opt = document.getElementById('phase');
var amc_opt = document.getElementById('amc-st-date');
var ont_avl_opt = document.getElementById('ont-avl');

// document.querySelector('.filter-sec').style.display = 'none';
document.querySelector('.table-container').style.display = 'none';

var data = new Array;
var data_copy = new Array;
var tempdata = new Array;
var state_list = new Array;
var state_list_copy = new Array;
var fault_tt_list = new Array;
var phase_list = new Array;
var amc_frac_date = new Array;

var colindex = 0;
var indexofstate = 0;
var indexofphase = 0;
var indexofamc = 0;
var indexofont = 0;

var ld = document.getElementById("progress");
ld.style.display = 'none';

// Converting File into Arrays for better access on each cells
xl_file.addEventListener('input', (xlsxfile) => {
    document.querySelector('#split').innerHTML = '<hr>';

    // Displaying File Name
    document.getElementById('file_name').innerHTML = xl_file.files[0].name;

    // Empty filters from previous file before accessing new file.
    state_list = new Array;
    fault_tt_list = new Array;
    phase_list = new Array;
    amc_frac_date = new Array;
    
    var reader = new FileReader();
    var loaded = document.getElementById('loading');
    ld.style.display = 'flex';
    ld.querySelector('i').style.display = 'none';
    ld.className = "loading";
    reader.readAsArrayBuffer(xlsxfile.target.files[0]);
    loaded.innerHTML = "Please Wait...";
    loaded.appendChild(ld);
    reader.onloadend = ()=>{
        ld.className = "loaded";
        ld.querySelector('i').style.display = '';
        loaded.innerHTML = "File Loaded!";
        loaded.appendChild(ld);
    }
    reader.onload = () => {
        var shdata = new Uint8Array(reader.result);
        var work_book = XLSX.read(shdata, { type: 'array' });
        var sheet_name = work_book.SheetNames;
        data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });
        data_copy = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });
        
        document.querySelector('.filter-sec').style.display = '';
        get_data_btn.style.display = '';

        // Function to add phase filter options.
        function add_options_phase(id, col_list) {
            let sel = document.getElementById(id);
            sel.innerHTML = '<option value="all">All</option>';
            col_list.forEach((item) => {
                let opt = document.createElement('option');
                opt.innerHTML = item;
                sel.appendChild(opt);
            })
        }

        function add_options_amc(id, col_list) {
            let sel = document.getElementById(id);
            col_list.forEach((item) => {
                let opt = document.createElement('option');
                opt.innerHTML = xldate(item);
                opt.value = item;
                sel.appendChild(opt);
            })
        }

        // Function to add state filters in multiselect dropdown.
        function add_options_state(stlist){
            let c = 0;
            state_opt.innerHTML = '<label for="all-states-opt" class="all-states-opt"><input type="checkbox" id="all-states-opt"><i class="fa-solid fa-check" style="margin-right: 10px;"></i>Select All (Default)</label>';
            stlist.forEach((item)=>{
                var label = document.createElement('label');
                var inp = document.createElement('input');
                inp.type = "checkbox";
                inp.className = "st-opt";
                label.className = label.for = inp.id = "opt-"+ c;
                label.appendChild(inp);
                label.innerHTML += '<i class="fa-solid fa-check" style="margin-right: 10px;"></i>' + item;
                state_opt.appendChild(label);
                c++;
            })
        }

        var amc_st_date_list = [];

        // Adding Filter Options on the main screen && Fetching State and TT ID column list.
        data.forEach((row) => {
            row.forEach((cell) => {
                cell = String(cell);
                if ('state' === cell.toLowerCase()) {
                    colindex = data.indexOf(row);
                    data.forEach((item) => {
                        state_list.push(item[row.indexOf(cell)]);
                    })
                    indexofstate = row.indexOf(cell);
                    // Removing Duplicates from State List
                    state_list = state_list.filter((unique, loc) => state_list.indexOf(unique) === loc);
                }

                if ('tt id' === cell.toLowerCase().slice(0, 5)) {
                    fault_tt_list.push(cell);
                }

                if ('phase' === cell.toLowerCase()) {
                    data.forEach((item) => {
                        phase_list.push(item[row.indexOf(cell)]);
                    })

                    indexofphase = row.indexOf(cell);
                    // Removing Duplicates from Phase List
                    phase_list = phase_list.filter((unique, loc) => phase_list.indexOf(unique) === loc);
                    phase_list = phase_list.slice(1, phase_list.length);
                }

                if ('amc2 start date' === cell.toLowerCase()) {
                    data.forEach((item) => {
                        amc_frac_date.push(item[row.indexOf(cell)]);
                    })
                    indexofamc = row.indexOf(cell);

                    // Making a copy of data with exact dates without fraction dates
                    let ind = row.indexOf(cell);
                    for (let i = 0; i < data_copy.length; i++) {
                        if (isAlphanumeric(amc_frac_date[i])) {
                            data_copy[i][ind] = xldate(amc_frac_date[i]);
                        }
                        else {
                            data_copy[i][ind] = amc_frac_date[i];
                        }
                        if (data_copy[i][ind] === 'Invalid Date') {
                            data_copy[i][ind] = '';
                        }
                    }

                    // Removing Duplicates from AMC2 Start Dates List
                    amc_frac_date = amc_frac_date.filter((unique, loc) => amc_frac_date.indexOf(unique) === loc);
                    amc_frac_date = amc_frac_date.slice(3, amc_frac_date.length);
                    amc_frac_date.forEach((date) => {
                        amc_st_date_list.push(xldate(date));
                    })
                }

                if ('ont availability(%)' === cell.toLowerCase()) {
                    indexofont = row.indexOf(cell);
                }
            })
        })

        // Calling a function to add the phase list to the filter list.
        add_options_phase(phase_opt.id, phase_list);

        // Making a copy of States for temporary use.
        state_list = state_list.slice(1, state_list.length);
        state_list_copy = new Array;
        state_list.forEach((item)=>{
            state_list_copy.push(item);
        })

        // Calling a function to add the states to the filter list. 
        add_options_state(state_list);

        // Function to highlight selected states
        function state_highlight_func(){
            let all_state = document.getElementById('all-states-opt');
            let states = document.querySelectorAll('.st-opt');
            var temp = '';
            all_state.addEventListener('click', function(){
                temp = this;
                let t = document.querySelector('.'+temp.id);
                if(temp.checked){
                    states.forEach((el)=>{
                        let hl = document.querySelector('.'+el.id);
                        hl.style.background = "lightskyblue";
                        hl.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 1;
                            }
                        })
                        el.checked = true;
                    })
                    t.style.background = "lightskyblue";
                    t.childNodes.forEach((e)=>{
                        if(e.nodeName === 'I'){
                            e.style.opacity = 1;
                        }
                    })
                }
                else{
                    states.forEach((el)=>{
                        let hl = document.querySelector('.'+el.id);
                        t.style.background = "";
                        hl.style.background = "";
                        hl.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 0;
                            }
                        })
                        el.checked = false;
                        t.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 0;
                            }
                        })
                    })
                }
            })
            states.forEach((el)=>{
                el.addEventListener('click', function(){
                    let t = document.querySelector('.'+temp.id);
                    let hl = document.querySelector('.'+el.id);
                    if(temp.checked){
                        t.style.background = "";
                        t.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 0;
                            }
                        })
                        temp.checked = false;
                    }
                    if(el.checked){
                        hl.style.background = "lightskyblue";
                        hl.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 1;
                            }
                        })
                    }
                    else{
                        hl.style.background = "";
                        hl.childNodes.forEach((e)=>{
                            if(e.nodeName === 'I'){
                                e.style.opacity = 0;
                            }
                        })
                    }
                })
            })
        }

        // Calling State Highlighter function
        state_highlight_func();
    }
})

// Function to retrieve state multiselect filter.
function state_multiselect_filter(){
    var st = document.querySelectorAll('.st-opt');
    var t = [];
    st.forEach((el)=>{
        if(el.checked){
            t.push(Number(el.id.slice(4, el.id.length)));
        }
    })
    if(t.length>0){
        state_list = new Array;
        t.forEach((index)=>{
            state_list.push(state_list_copy[index]);
        })
    }
    else if(t.length<=0){
        state_list = new Array;
        state_list_copy.forEach((item)=>{
            state_list.push(item);
        })
    }
}

let flag = false;
// Function to display/not-display state Dropdown menu.
function state_options_popup(){
    if(flag === false){
        state_opt.style.transform = 'scaleY(1)';
        flag = true;
    }
    else if(flag === true){
        state_opt.style.transform = 'scaleY(0)'
        flag = false;
    }
}

let hid = true;
function hidedropdown(){
    if(hid === true){
        state_opt.style.transform = 'scaleY(0)';
        flag = false;
    }
    else{
        hid = true;
    }
}

// Calling dropdown display when clicked on State Filter Dropdown Button
state_opt.style.transform = 'scaleY(0)';
document.getElementById('toggle').addEventListener('click', ()=>{
    state_options_popup();
    hid = false;
})

state_opt.addEventListener('click', ()=>{
    state_opt.style.transform = 'scaleY(1)';
    hid = false;
})

document.addEventListener('click', ()=>{
    hidedropdown();
})

// Function to change fraction dates to Actual Date String
function xldate(frac) {
    var days = Math.floor(frac - 25569);
    var value = days * 86400;
    var date_info = new Date(value * 1000);

    var fractional_day = frac - Math.floor(frac) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    var date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    return date.toLocaleDateString();
}

// Function for checking if given data is AlphaNumberic
function isAlphanumeric(str) {
    if(str === null || str === undefined){
        return false;
    }
    else{
        return /^[a-zA-Z0-9]+$/.test(str);
    }
}

// Function to display table data with count hyperlinks
function table_column(list) {
    if (list[0] === state_list[0]) {
        let st_id_num = 0;
        list.forEach((item) => {
            let c = 0;
            data.forEach((row) => {
                if (row[0] === item) {
                    c++;
                }
            })
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var anc = document.createElement('a');
            var hr = document.createElement('hr');
            anc.href = '#';
            anc.id = 'st-detail-' + st_id_num;
            st_id_num++;
            if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
            td.innerHTML = item;
            td.appendChild(hr);
            td.appendChild(anc);
            tr.appendChild(td);
            state_col.appendChild(tr);
        })
    }
    if (list[0] === fault_tt_list[0]) {
        let st_id_num = 0;
        state_list.forEach((state) => {
            let tt_id_num = 0;
            var tr = document.createElement('tr');
            list.forEach((item) => {
                let c = 0;
                data.forEach((row) => {
                    if (row[0] === state && isAlphanumeric(row[data[0].indexOf(item)])) {
                        c++;
                    }
                })
                var td = document.createElement('td');
                var anc = document.createElement('a');
                var hr = document.createElement('hr');
                anc.href = '#';
                anc.className = 'st-' + st_id_num;
                anc.id = 'tt-detail-' + tt_id_num;
                tt_id_num++;

                // Inserting State Data Count into Anchor Tag
                if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                td.innerHTML = item;
                td.appendChild(hr);
                td.appendChild(anc);
                tr.appendChild(td);
            })
            table_data.appendChild(tr);
            st_id_num++;
        })
    }
}

// Function to check if the filters are applied on the select options.
function get_filter_values() {
    if (phase_opt.value === 'all' && amc_opt.value === 'all' && ont_avl_opt.value === 'all') {
        return phase_opt.value;
    }
    else {
        return [phase_opt.value, amc_opt.value, ont_avl_opt.value];
    }
}

var table_data = document.getElementById('min-info-tb');
var state_col = document.getElementById('state_col');

function fault_data(fault_id){
    let tp = fault_id;
    let del = [];
    tempdata = [];
    data_copy[colindex].forEach((col)=>{
        if(col !== tp && col.toLowerCase().slice(0, 5) === 'tt id'){
            del.push(data_copy[0].indexOf(col));
        }
    })
    del = del.reverse();
    data_copy.forEach((row)=>{
        let t = [];
        row.forEach((cell)=>{
            t.push(cell);
        })
        del.forEach((index)=>{
            t.splice(index, 1);
        })
        tempdata.push(t);
    })
}

// Function for Final Count Data Retrieval after Filter Selection and Final Click
get_data_btn.addEventListener('click', ()=> {
    document.querySelector('.table-container').style.display = '';

    // Getting Values of Filter Selection and storing in variables.
    let all = '';
    let ph_v = '';
    let amc_v = '';
    let ont_v = '';
    let f_values = get_filter_values();
    if (Array.isArray(f_values)) {
        ph_v = f_values[0];
        amc_v = f_values[1];
        ont_v = f_values[2];
    }
    else {
        all = f_values;
    }

    // Clear Screen before display
    state_col.innerHTML = "";
    table_data.innerHTML = "";

    // Function for filtered data count retrieval
    function filtered_table_column(list) {
        if (list[0] === state_list[0]) {
            let st_id_num = 0;
            state_list.forEach((state) => {
                if (ph_v !== 'all' && amc_v === 'all' && ont_v === 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && row[indexofphase] === phase_opt.value) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v !== 'all' && ont_v === 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v !== 'all' && ont_v !== 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                            if (row[indexofont] >= Number(ont_avl_opt.value)) {
                                c++;
                            }
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v !== 'all' && ont_v === 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v === 'all' && ont_v !== 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && row[indexofont] >= Number(ont_avl_opt.value)) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v !== 'all' && ont_v !== 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && amc_v === String(isAlphanumeric(row[indexofamc])) && row[indexofont] >= Number(ont_avl_opt.value)) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v === 'all' && ont_v !== 'all') {
                    let c = 0;
                    data.forEach((row) => {
                        if (row[indexofstate] === state && row[indexofphase]===phase_opt.value && row[indexofont] >= Number(ont_avl_opt.value)) {
                            c++;
                        }
                    })
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var anc = document.createElement('a');
                    var hr = document.createElement('hr');
                    anc.href = '#';
                    anc.id = 'st-detail-' + st_id_num;
                    st_id_num++;
                    if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }  // Inserting State Data Count into Anchor Tag
                    td.innerHTML = state;
                    td.appendChild(hr);
                    td.appendChild(anc);
                    tr.appendChild(td);
                    state_col.appendChild(tr);
                }
            })
        }
        if (list[0] === fault_tt_list[0]) {
            let st_id_num = 0;
            state_list.forEach((state) => {
                let tt_id_num = 0;
                if (ph_v !== 'all' && amc_v === 'all' && ont_v === 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v !== 'all' && ont_v === 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v !== 'all' && ont_v !== 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                                if (row[indexofont] >= Number(ont_avl_opt.value)) {
                                    if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                        c++;
                                    }
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v !== 'all' && ont_v === 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && amc_v === String(isAlphanumeric(row[indexofamc]))) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v === 'all' && ont_v !== 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && row[indexofont] >= Number(ont_avl_opt.value)) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v === 'all' && amc_v !== 'all' && ont_v !== 'all') {
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && amc_v === String(isAlphanumeric(row[indexofamc])) && row[indexofont] >= Number(ont_avl_opt.value)) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                if (ph_v !== 'all' && amc_v === 'all' && ont_v !== 'all'){
                    var tr = document.createElement('tr');
                    list.forEach((item) => {
                        let c = 0;
                        data.forEach((row) => {
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && row[indexofont] >= Number(ont_avl_opt.value)) {
                                if (isAlphanumeric(row[data[0].indexOf(item)])) {
                                    c++;
                                }
                            }
                        })
                        var td = document.createElement('td');
                        var anc = document.createElement('a');
                        var hr = document.createElement('hr');
                        anc.href = '#';
                        anc.className = 'st-' + st_id_num;
                        anc.id = 'tt-detail-' + tt_id_num;
                        tt_id_num++;

                        // Inserting State Data Count into Anchor Tag
                        if (c > 1 || c === 0) { anc.innerHTML = c + " Records."; } else { anc.innerHTML = c + " Record."; }
                        td.innerHTML = item;
                        td.appendChild(hr);
                        td.appendChild(anc);
                        tr.appendChild(td);
                    })
                    table_data.appendChild(tr);
                }
                st_id_num++;
            })
        }
    }

    state_multiselect_filter();
    if (all === 'all') {
        table_column(state_list);
        table_column(fault_tt_list);
    }
    else {
        filtered_table_column(state_list);
        filtered_table_column(fault_tt_list);
    }

    // Function for Final Data Retreival in new tab. 
    function new_tab_view(id_value, class_value) {
        let html = '';
        if (id_value.slice(0, 10) === 'st-detail-') {

            // Printing Column names based on statewise filter.
            html += "<tr>";
            data[colindex].forEach((head)=>{
                html += "<th>" + head + "</th>";
            })
            html += "</tr>";

            let ind = Number(id_value.slice(10, id_value.length));
            if (all === 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind]) {
                        html += '<tr>';
                        row.forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v !== 'all' && amc_v === 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind] && row[indexofphase] === phase_opt.value) {
                        html += '<tr>';
                        row.forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v !== 'all' && amc_v !== 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind] && row[indexofphase] === phase_opt.value) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            row.forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v !== 'all' && amc_v !== 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind] && row[indexofphase] === phase_opt.value && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            row.forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v === 'all' && amc_v !== 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind]) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            row.forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v === 'all' && amc_v === 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (row[indexofstate] === state_list[ind] && row[indexofont] >= Number(ont_avl_opt.value)) {
                        html += '<tr>';
                        row.forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v === 'all' && amc_v !== 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (state_list[ind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            row.forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v !== 'all' && amc_v === 'all' && ont_v !== 'all'){
                data_copy.forEach((row) => {
                    if (state_list[ind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value) && row[indexofphase] === phase_opt.value) {
                        html += '<tr>';
                        row.forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
        }
        else if (id_value.slice(0, 10) === 'tt-detail-') {
            let cind = Number(class_value.slice(3, class_value.length));
            let ind = Number(id_value.slice(10, id_value.length));
            let n = data[0].indexOf(fault_tt_list[ind]);
            fault_data(fault_tt_list[ind]);

            // Printing columns based on fault ID filters.
            html += "<tr>";
            tempdata[colindex].forEach((head)=>{
                html += "<th>" + head + "</th>";
            })
            html += "</tr>";
            if (all === 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate]) {
                        html += '<tr>';
                        tempdata[data_copy.indexOf(row)].forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v !== 'all' && amc_v === 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value) {
                        html += '<tr>';
                        tempdata[data_copy.indexOf(row)].forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v !== 'all' && amc_v !== 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            tempdata[data_copy.indexOf(row)].forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v !== 'all' && amc_v !== 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            tempdata[data_copy.indexOf(row)].forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v === 'all' && amc_v !== 'all' && ont_v === 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate]) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            tempdata[data_copy.indexOf(row)].forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v === 'all' && amc_v === 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value)) {
                        html += '<tr>';
                        tempdata[data_copy.indexOf(row)].forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
            if (ph_v === 'all' && amc_v !== 'all' && ont_v !== 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (amc_v === String(isAlphanumeric(data[data_copy.indexOf(row)][indexofamc]))) {
                            html += '<tr>';
                            tempdata[data_copy.indexOf(row)].forEach((cell) => {
                                html += '<td>' + cell + '</td>';
                            })
                            html += '</tr>';
                        }
                    }
                })
            }
            if (ph_v !== 'all' && amc_v === 'all' && ont_v !== 'all'){
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value) && row[indexofphase] === phase_opt.value) {
                        html += '<tr>';
                        tempdata[data_copy.indexOf(row)].forEach((cell) => {
                            html += '<td>' + cell + '</td>';
                        })
                        html += '</tr>';
                    }
                })
            }
        }
        return html;
    }

    document.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            if(Number(a.innerHTML[0]) === 0){
                alert("Sorry! The selected option has NO DATA. \nPlease select an option other than 0 Records.");
            }
            else{
                let tab = window.open('data-view.html').document;
                tab.write("<html>");
                tab.write("<head><title>Data View</title><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'>");
                tab.write("<link rel='stylesheet' href='style.css'></head>");
                tab.write("<body>");
                tab.write("<div class='filtered-table'><table class='table'>");
                tab.write(new_tab_view(a.id, a.className));
                tab.write("</table></div></body>");
                tab.write("</html>");
                tab.close();
            }
        })
    })
})