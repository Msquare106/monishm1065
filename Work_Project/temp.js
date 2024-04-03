const data_file = document.getElementById('excel_file');

data_file.addEventListener('input', (event)=>{
    document.getElementById('filename').innerHTML = data_file.files[0].name;
    document.getElementById('splitter').innerHTML = '<hr>';
    document.getElementById('loaded').innerHTML = 'Please Wait...';

    // reading excel file
    // readXlsxFile(data_file.files[0]).then((data)=>{
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function(){
        var shdata = new Uint8Array(reader.result);
        var work_book = XLSX.read(shdata, {type:'array'});
        var sheet_name = work_book.SheetNames;
        var data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});

        // column retriever function
        function col_data(index){
            let col_list = [];
            data.forEach((item)=>{
                col_list.push(item[index]);
            })
            col_list = col_list.slice(4, col_list.length);
            col_list.pop();
            col_list = col_list.filter((unique, loc)=> col_list.indexOf(unique) === loc);
            return col_list
        }

        // filter options listing function
        function filter_opt_list(id, list){
            let select = document.getElementById(id);
            select.innerHTML = '<option value="">--Select--</option>';
            list.forEach((item)=>{
                let opt = document.createElement('option');
                opt.innerHTML = item;
                select.appendChild(opt);
            })
        }

        function mini_table(opt,count, row){
            let tb = document.getElementById('tb');
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let hr = document.createElement('hr');
            let hr2 = document.createElement('hr');
            let a = document.createElement('a');
            let sel = document.createElement('select');
            a.id = 'detailed-'+row;
            a.href = '#';
            a.innerHTML = 'View details';
            sel.id = "vendor-"+row;
            sel.className = "ven-sel";
            sel.innerHTML = '<option value="">--Select--</option>';
            let vlist = [];
            data.forEach((item)=>{
                if(item[2]===opt){
                    vlist.push(item[11]);
                }
            })
            vlist = vlist.filter((unique, loc)=> vlist.indexOf(unique)===loc);
            for(let j=0;j<vlist.length;j++){
                let op = document.createElement('option');
                op.innerHTML = vlist[j];
                sel.appendChild(op);
            }
            td1.innerHTML = opt;
            td2.innerHTML = count;
            td3.innerHTML = "View Details by Vendor"
            td3.appendChild(hr2);
            td3.appendChild(sel);
            td2.appendChild(hr);
            td2.appendChild(a);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tb.appendChild(tr);
        }

        function unique_count(st_list, index){
            st_list.forEach((opt)=>{
                var count = 0;
                data.forEach((item)=>{
                    if(opt === item[index]){
                        count++;
                    }
                })
                mini_table(opt, count, st_list.indexOf(opt));  
            })
        }

        filter_opt_list('zone', col_data(1));
        document.getElementById('splitter').innerHTML = '<hr>';
        document.getElementById('loaded').innerHTML = "File Loaded! - Ready to Retrieve data";

        // select filter list elements
        let zone_list = document.getElementById('zone');
        let vendor_list = document.getElementById('vendor');

        // modify vendor list based on zone selection
        zone_list.addEventListener('change', ()=>{
            let mod_vendor_list = [];
            data.forEach((item)=>{
                if(zone_list.value === item[1]){
                    mod_vendor_list.push(item[11]);
                }
            })
            mod_vendor_list = mod_vendor_list.filter((unique, loc)=> mod_vendor_list.indexOf(unique) === loc);
            // filter_opt_list('vendor',mod_vendor_list);
        })

        function header_row(){
            var tb2 = document.getElementById('tb2');
            let k = 0;
            data.forEach((item)=>{
                if(k === 3){
                    var tr = document.createElement('tr');
                    for(let j=0;j<item.length; j++){
                        var th = document.createElement('th');
                        th.innerHTML = item[j];
                        tr.appendChild(th);
                    }
                    tb2.appendChild(tr);
                }
                k++;
            })
        }

        // get filtered data function
        let btn = document.getElementById('btn');
        btn.addEventListener('click', ()=>{
            let tb = document.getElementById('tb');
            tb.innerHTML = '';

            let state_list = [];
            data.forEach((item)=>{
                if(zone_list.value === item[1]){
                    state_list.push(item[2]);
                }
            })
            state_list = state_list.filter((unique, loc)=> state_list.indexOf(unique) === loc);
            unique_count(state_list, 2);

            let linky = document.querySelectorAll('a');
            let linksel = document.querySelectorAll('.ven-sel');
            linky.forEach((l)=>{
                l.addEventListener("click",()=>{
                    var tb2 = document.getElementById('tb2');
                    tb2.innerHTML = '';
                    linksel.forEach((li)=>{
                        li.value = '';
                    })
                    header_row();
                    data.forEach((item)=>{
                        var tr = document.createElement('tr');
                        if(state_list[l.id[l.id.length-1]]===item[2]){
                            for(let i=0;i<item.length;i++){
                                var td = document.createElement('td');
                                td.innerHTML = item[i];
                                tr.appendChild(td);
                            }
                        }
                        tb2.appendChild(tr);
                    })
                })
            })
            linksel.forEach((li)=>{
                li.addEventListener('change', ()=>{
                    let temp = li.value;
                    var tb2 = document.getElementById('tb2');
                    tb2.innerHTML = '';
                    header_row();
                    data.forEach((item)=>{
                        var tr = document.createElement('tr');
                        if(state_list[li.id[li.id.length-1]]===item[2] && li.value === item[11]){
                            for(let i=0;i<item.length;i++){
                                var td = document.createElement('td');
                                td.innerHTML = item[i];
                                tr.appendChild(td);
                            }
                        }
                        tb2.appendChild(tr);
                    })
                    linksel.forEach((all)=>{
                        all.value = '';
                    })
                    li.value = temp;
                })
            })
        })
    }
})
