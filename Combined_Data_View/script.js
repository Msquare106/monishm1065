// Getting Xlsx File from user
const xl_file = document.getElementById('excel_file');
var get_data_btn = document.getElementById('get_data_btn');
var phase_opt = document.getElementById('phase');
var amc_opt = document.getElementById('amc-st-date');
var ont_avl_opt = document.getElementById('ont-avl');

document.querySelector('.filter-sec').style.display = 'none';
document.querySelector('.table-container').style.display = 'none';

var data = [];
var data_copy = [];
var state_list = [];
var fault_tt_list = [];
var phase_list = [];
var amc_frac_date = [];

var indexofstate = 0;
var indexofphase = 0;
var indexofamc = 0;
var indexofont = 0;

// Converting File into Arrays for better access on each cells
xl_file.addEventListener('change', (xlsxfile) => {
    document.querySelector('#split').innerHTML = '<hr>';
    document.getElementById('loading').innerHTML = "Please Wait ...";

    // Displaying File Name
    document.getElementById('file_name').innerHTML = xl_file.files[0].name;

    var reader = new FileReader();
    reader.readAsArrayBuffer(xlsxfile.target.files[0]);
    reader.onload = () => {
        var shdata = new Uint8Array(reader.result);
        var work_book = XLSX.read(shdata, { type: 'array' });
        var sheet_name = work_book.SheetNames;
        data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });
        data_copy = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });

        document.getElementById('loading').innerHTML = "File Loaded!";
        document.querySelector('.filter-sec').style.display = '';
        get_data_btn.style.display = '';

        // Function to add filter options.
        function add_options_phase(id, col_list) {
            let sel = document.getElementById(id);
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

        var amc_st_date_list = [];

        // Adding Filter Options on the main screen && Fetching State and TT ID column list.
        data.forEach((row) => {
            row.forEach((cell) => {
                cell = String(cell);
                if ('state' === cell.toLowerCase()) {
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

        add_options_phase(phase_opt.id, phase_list);
        add_options_amc(amc_opt.id, amc_frac_date);

        state_list = state_list.slice(1, state_list.length);
    }
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
    return /^[a-zA-Z0-9]+$/.test(str);
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

// Function for Final Count Data Retrieval after Filter Selection and Final Click
get_data_btn.addEventListener('click', () => {
    document.querySelector('.table-container').style.display = '';

    // Clear Screen before display
    state_col.innerHTML = "";
    table_data.innerHTML = "";

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
                        if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && row[indexofamc] === Number(amc_opt.value)) {
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
                        if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && row[indexofamc] === Number(amc_opt.value)) {
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
                        if (row[indexofstate] === state && row[indexofamc] === Number(amc_opt.value)) {
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
                        if (row[indexofstate] === state && row[indexofamc] === Number(amc_opt.value) && row[indexofont] >= Number(ont_avl_opt.value)) {
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
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && row[indexofamc] === Number(amc_opt.value)) {
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
                            if (row[indexofstate] === state && row[indexofphase] === phase_opt.value && row[indexofamc] === Number(amc_opt.value)) {
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
                            if (row[indexofstate] === state && row[indexofamc] === Number(amc_opt.value)) {
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
                            if (row[indexofstate] === state && row[indexofamc] === Number(amc_opt.value) && row[indexofont] >= Number(ont_avl_opt.value)) {
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
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
            if (all === 'all') {
                data_copy.forEach((row) => {
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate]) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value) {
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofphase] === phase_opt.value && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate]) {
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value)) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value)) {
                        if (data[data_copy.indexOf(row)][indexofamc] === Number(amc_opt.value)) {
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
                    if (isAlphanumeric(row[n]) && state_list[cind] === row[indexofstate] && row[indexofont] >= Number(ont_avl_opt.value) && row[indexofphase] === phase_opt.value) {
                        html += '<tr>';
                        row.forEach((cell) => {
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
                tab.write("<body><div class='filtered-table'><table class='table'>");
                tab.write("<tr>");
                data[0].forEach((head) => {
                    tab.write("<th>" + head + "</th>");
                })
                tab.write("</tr>");
                tab.write(new_tab_view(a.id, a.className));
                tab.write("</table></div></body></html>");
            }
        })
    })
})