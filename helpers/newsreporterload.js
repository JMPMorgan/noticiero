const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

$(async()=>{
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/loadNews.php'
    });
    response=JSON.parse(response);
    console.log(response);
    if(response.success===true){
        response.info.forEach(element=>{
            let html;
            if(element.news_status===0){
                html=$(`<tr><th scope="row" class="bg-primary text-primary mx-auto th-row">
                <i class='bx bx-edit-alt text-white status-success'></i></th>
                <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                <td>${element.news_date}</td>
                <td>
                    <button id='edit' class='btn btn-outline-primary'>
                    <i class='bx bx-edit-alt '></i>
                    </button>
                </td><tr>`);
            }
            else if(element.news_status===1){
                html=$(`<tr><th scope="row" class=" bg-secondary text-success mx-auto th-row">
                <i class='bx bx-paper-plane text-white status-success' ></i></th>
                <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                <td>${element.news_date}</td>
                <td>
                <span>No se puede cambiar <br> esperando la revision</span>
                </td></tr>`);
            }
            else if(element.news_status===2){
                html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                <i class='bx bx-x-circle text-white status-success'></i></th>
                <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                <td>${element.news_date}</td>
                <td>
                <span><b>NOTICIA REGRESADA<b><br><small>para acceder a ella ve a tus notificaciones</small></span>
                </td></tr>`);
            }else if(element.news_status===3){
                if(element.news_active===1){
                    html=$(`<tr><th scope="row" class="bg-success text-success mx-auto th-row">
                    <i class='bx bx-check text-white status-success'></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <span><b>NOTICIA PUBLICADA</b><span>
                    </td></tr>`);
                }
                else{
                    html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                    <i class='bx bx-x-circle text-white status-success'></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <span><b>NOTICIA DESAHIBILITADA</b></span>
                    </td></tr>`);
                }
            }
            if($(html).find('#edit').length>0){
                console.log('edit');
                const edit = $(html).find('#edit')[0];
                console.log(edit);
                $(edit).on('click',()=>{
                    const section=$(html).find('#title')[0];
                    const data=$(section).attr('data');
                    console.log(section,data);
                    window.location=`newsadd.html?id=${data}`;
                });
            }
            if($(html).find('#active').length>0){
                console.log('active');
                const active = $(html).find('#active')[0];
                const data=$(active).attr('data');
                console.log(active,data);
            }
            if($(html).find('#disable').length>0){
                console.log('disble');
                const disable = $(html).find('#disable')[0];
                const data=$(disable).attr('data');
                console.log(disable,data );
            }
            $('tbody').append(html);
        });
    }else{
        printErrors(response.error);
    }

    response=await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/sections.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
        const sections=response.info;
        sections.forEach(element=>{
             const html=$(`<option value='${element.uuid_sections}'>${element.section_name}</option>`);
             $('#sections-search').append(html);
             //$(html).on('click',()=>{selectedSections(html)});
             $('#sections-search').change(()=>{selectedSections($('#sections-search').children('option:selected'))});
        });
    }else{
        printErrors(response.error);
    }




});


const selectedSections=(html)=>{
    const value=$(html).val();
    const name=$(html).text();
    const sections_selected=$('#container-sections-selected').children();
    let isSelected=false;
    if(value!==''){
        sections_selected.each((index,element)=>{
            if($(element).attr('data')===value){
                isSelected=true;
                return false;
            }
        });
        if(isSelected===false){
            const html=$(`<span class='btn btn-primary mx-1' data='${value}'>${name}
            <i class="fa-solid fa-circle-xmark"></i></span>`);
            $(html).on('click',()=>{
                $(html).remove();
            });
            $('#container-sections-selected').append(html);
        }
    }
    //Obtieve los hijos de ese div que solo estan las secciones seleccionadas
    /*if(value!==''){
        if(sections_selected.length===0){//Primer seccion

            $('#container-sections-selected').append(html);
        }else{//+1 de una seccion
            console.log(sections_selected);
        }
    }*/
}


const printErrors = (error) => {
    let html = 'Verificar información:';
    let li = '<li>';
    let li_last = '</li>';
    for (let i = 0; error.length > i; i++) {
      let text = li + error[i] + li_last;
      html = html + text;
    }
    Toast.fire({
      icon: 'warning',
      html: html
    });
  }
