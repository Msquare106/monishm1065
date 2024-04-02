const data_file = document.getElementById('excel_file');

data_file.addEventListener('change', (event)=>{
    document.getElementById('filename').innerHTML = data_file.files[0].name;
    document.getElementById('splitter').innerHTML = '';
    document.getElementById('loaded').innerHTML = '';
    console.log(data_file.files[0].name);

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

        filter_opt_list('netpro', col_data(0));
        document.getElementById('splitter').innerHTML = '<hr>';
        document.getElementById('loaded').innerHTML = "File Loaded! - Ready to Retrieve data";

        // select filter list elements
        let net_pro_list = document.getElementById('netpro');
        let zone_list = document.getElementById('zone');
        let state_list = document.getElementById('state');
        let dist_list = document.getElementById('district');
        let block_list = document.getElementById('block');
        let vendor_list = document.getElementById('vendor');
        let tecname_list = document.getElementById('tecname');

        // modify zone list based on network provider selection
        net_pro_list.addEventListener('change', ()=>{
            let mod_zone_list = [];
            data.forEach((item)=>{
                if(net_pro_list.value === item[0]){
                    mod_zone_list.push(item[1]);
                }
            })
            mod_zone_list = mod_zone_list.filter((unique, loc)=> mod_zone_list.indexOf(unique) === loc);
            filter_opt_list('zone',mod_zone_list);
            state_list.innerHTML = '<option value="">--Select--</option>';
            dist_list.innerHTML = '<option value="">--Select--</option>';
            block_list.innerHTML = '<option value="">--Select--</option>';
            vendor_list.innerHTML = '<option value="">--Select--</option>';
            tecname_list.innerHTML = '<option value="">--Select--</option>';
        })

        // modify state list based on zone selection
        zone_list.addEventListener('change', ()=>{
            let mod_state_list = [];
            data.forEach((item)=>{
                if(zone_list.value === item[1] && net_pro_list.value === item[0]){
                    mod_state_list.push(item[2]);
                }
            })
            mod_state_list = mod_state_list.filter((unique, loc)=> mod_state_list.indexOf(unique) === loc);
            filter_opt_list('state',mod_state_list);
            dist_list.innerHTML = '<option value="">--Select--</option>';
            block_list.innerHTML = '<option value="">--Select--</option>';
            vendor_list.innerHTML = '<option value="">--Select--</option>';
            tecname_list.innerHTML = '<option value="">--Select--</option>';
        })

        // modify district list based on state selection
        state_list.addEventListener('change', ()=>{
            let mod_district_list = [];
            data.forEach((item)=>{
                if(state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    mod_district_list.push(item[3]);
                }
            })
            mod_district_list = mod_district_list.filter((unique, loc)=> mod_district_list.indexOf(unique) === loc);
            filter_opt_list('district',mod_district_list);
            block_list.innerHTML = '<option value="">--Select--</option>';
            vendor_list.innerHTML = '<option value="">--Select--</option>';
            tecname_list.innerHTML = '<option value="">--Select--</option>';
        })

        // modify block list based on district selection
        dist_list.addEventListener('change', ()=>{
            let mod_block_list = [];
            data.forEach((item)=>{
                if(dist_list.value === item[3] && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    mod_block_list.push(item[4]);
                }
            })
            mod_block_list = mod_block_list.filter((unique, loc)=> mod_block_list.indexOf(unique) === loc);
            filter_opt_list('block',mod_block_list);
            vendor_list.innerHTML = '<option value="">--Select--</option>';
            tecname_list.innerHTML = '<option value="">--Select--</option>';
        })

        // modify vendor list based on block selection
        block_list.addEventListener('change', ()=>{
            let mod_vendor_list = [];
            data.forEach((item)=>{
                if(block_list.value === item[4] && dist_list.value === item[3] 
                && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    mod_vendor_list.push(item[11]);
                }
            })
            mod_vendor_list = mod_vendor_list.filter((unique, loc)=> mod_vendor_list.indexOf(unique) === loc);
            filter_opt_list('vendor',mod_vendor_list);
            tecname_list.innerHTML = '<option value="">--Select--</option>';
        })

        // modify tecname list based on vendor selection
        vendor_list.addEventListener('change', ()=>{
            let mod_tecname_list = [];
            data.forEach((item)=>{
                if(vendor_list.value === item[11] && block_list.value === item[4] && dist_list.value === item[3] 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    mod_tecname_list.push(item[12]);
                }
            })
            mod_tecname_list = mod_tecname_list.filter((unique, loc)=> mod_tecname_list.indexOf(unique) === loc);
            filter_opt_list('tecname',mod_tecname_list);
        })

        // get filtered data function
        let btn = document.getElementById('btn');
        btn.addEventListener('click', ()=>{
            let tb = document.getElementById('tb');
            tb.innerHTML = '';

            for(let i=0;i<data.length;i++){
                var tr = document.createElement('tr');
                for(let j=0;j<data[i].length;j++){
                    if(i === 0){
                        var th = document.createElement('th');
                        th.innerHTML = data[i][j];
                        tr.appendChild(th);
                    }
                    else if(i===3){
                        var th = document.createElement('th');
                        th.innerHTML = data[i][j];
                        tr.appendChild(th);
                    }
                    else{
                        var td = document.createElement('td');
                        td.innerHTML = data[i][j];
                        tr.appendChild(td);
                    }
                }
                tb.appendChild(tr);
                if(i===3){break}
            }

            data.forEach((item)=>{
                var tr = document.createElement('tr');
                if(tecname_list.value === '' && vendor_list.value === '' && block_list.value === '' && dist_list.value === '' 
                    && state_list.value === '' && zone_list.value === '' && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === '' && vendor_list.value === '' && block_list.value === '' && dist_list.value === '' 
                    && state_list.value === '' && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === '' && vendor_list.value === '' && block_list.value === '' && dist_list.value === '' 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === '' && vendor_list.value === '' && block_list.value === '' && dist_list.value === item[3] 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === '' && vendor_list.value === '' && block_list.value === item[4] && dist_list.value === item[3] 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === '' && vendor_list.value === item[11] && block_list.value === item[4] && dist_list.value === item[3] 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                if(tecname_list.value === item[12] && vendor_list.value === item[11] && block_list.value === item[4] && dist_list.value === item[3] 
                    && state_list.value === item[2] && zone_list.value === item[1] && net_pro_list.value === item[0]){
                    for (let i=0;i<item.length;i++){
                        var td = document.createElement('td');
                        td.innerHTML = item[i];
                        tr.appendChild(td);
                    }
                }
                tb.appendChild(tr);
            })
        })
    }
})
