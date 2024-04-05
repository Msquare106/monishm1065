// Getting Xlsx File from user
const xl_file = document.getElementById('excel_file');
var get_data_btn = document.getElementById('get_data_btn');
get_data_btn.style.display = 'none';
document.querySelector('.table-container').style.display = 'none';
var data = [];
var state_list = [];
var fault_tt_list = [];

// Converting File into Arrays for better access on each cells
xl_file.addEventListener('change', (xlsxfile)=>{
    document.getElementById('split').innerHTML = "<hr>";
    document.getElementById('loading').innerHTML = "Please Wait ...";

    // Displaying File Name
    document.getElementById('file_name').innerHTML = xl_file.files[0].name;

    var reader = new FileReader();
    reader.readAsArrayBuffer(xlsxfile.target.files[0]);
    reader.onload = ()=>{
        var shdata = new Uint8Array(reader.result);
        var work_book = XLSX.read(shdata, {type: 'array'});
        var sheet_name = work_book.SheetNames;
        data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});

        document.getElementById('loading').innerHTML = "File Loaded - ";
        get_data_btn.style.display = '';

        // Removing Duplicates from State List
        data.forEach((row)=>{
            state_list.push(row[0]);
        })
        state_list = state_list.filter((unique, loc)=> state_list.indexOf(unique) === loc);
        state_list = state_list.slice(1, state_list.length);

        data[0].forEach((cell)=>{
            if('TT ID' === cell.slice(0,5)){
                fault_tt_list.push(cell);
            }
        })
    }
})

// Function for checking if given data is AlphaNumberic
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

// Function to get statewise count
function state_data_count(state){
    let c = 0;
    data.forEach((row)=>{
        if(row[0]===state){
            c++;
        }
    })
    return c;
}

// Function to get statewise fault count
function state_tt_count(state,ttname){
    let c=0;
    data.forEach((row)=>{
        if(row[0]===state && isAlphanumeric(row[data[0].indexOf(ttname)])){
            c++;
        }
    })
    return c;
}

// Function to display table data with count hyperlinks
function table_column(list){
    if(list[0]===state_list[0]){
        let st_id_num = 0;
        // state_col.innerHTML = "<tr><th>State</th><th>State_Count</th></tr>";
        list.forEach((item)=>{
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var anc = document.createElement('a');
            var hr = document.createElement('hr');
            var c = state_data_count(item);
            anc.href = '#';
            anc.id = 'st-detail-'+ st_id_num;
            st_id_num++;
            anc.innerHTML = "View all "+ c +" Records.";  // Inserting State Data Count into Anchor Tag
            td.innerHTML = item;
            td.appendChild(hr);
            td.appendChild(anc);
            tr.appendChild(td);
            state_col.appendChild(tr);
        })
    }
    if(list[0]===fault_tt_list[0]){
        let tt_id_num = 0;
        state_list.forEach((state)=>{
            var tr = document.createElement('tr');
            list.forEach((item)=>{
                var td = document.createElement('td');
                var anc = document.createElement('a');
                var hr = document.createElement('hr');
                var c = state_tt_count(state,item);
                anc.href = '#';
                anc.id = 'tt-detail-'+ tt_id_num;
                tt_id_num++;
                
                // Inserting State Data Count into Anchor Tag
                if(c===0){
                    anc.innerHTML = "0 - No Records";
                }
                else if(c>0 && c<2){
                    anc.innerHTML = "View "+ c +" Record.";
                }
                else if(c>1 && c<3){
                    anc.innerHTML = "View "+ c +" Records.";
                }
                else{
                    anc.innerHTML = "View all "+ c +" Records.";
                }
                td.innerHTML = item;
                td.appendChild(hr);
                td.appendChild(anc);
                tr.appendChild(td);
            })
            table_data.appendChild(tr);
        })
    }
}

var table_data = document.getElementById('min-info-tb');
var state_col = document.getElementById('state_col');
get_data_btn.addEventListener('click', ()=>{
    document.querySelector('.table-container').style.display = '';
    state_col.innerHTML = "";
    table_data.innerHTML = "";
    table_column(state_list);
    table_column(fault_tt_list);
})
