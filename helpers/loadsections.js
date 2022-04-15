$(async ()=>{
    /*
    ESTO LO QUE SE HACE  ES AL MOMENTO DE CARGAR LA PAGINA OBTIENE TODA LA INFORMACION
    Y LO PONE EN EL CODIGO DE HTML DEBAJO ESTO LO HACE CON LAS SECCIONES Y LAS PALABRAS
    CLAVE
    */
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getSectionsKeywords.php'
    });
    response=JSON.parse(response);
    const keywords=response.keywords[0];
    const sections=response.sections[0];
    keywords.forEach(element => {
        const html=$(`<div class="col-12 my-1">
                        <div class='row'>
                            <div class='col-6'>
                                <span id='name' class='h6' data="${element.uuid_keywords}">${element.word_keywords}</span>
                            </div>
                            <div class='col-3'>
                                <button id="edit" class="btn btn-sm btn-outline-primary"><i class='bx bxs-edit-alt'></i></button>
                                <button id="disable" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                    </div>`);
        const edit = $(html).find('#edit')[0];
        const disable = $(html).find('#disable')[0];
        console.log(edit,disable);
        $(edit).on('click',()=>{
            Swal.fire({
                title: 'Ingrese el nuevo Nombre de la Seccion',
                text: "You won't be able to revert this!",
                input: 'text',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then(async(result) => {
                console.log(result);
                const uuid = $(html).find('#name').attr('data');
                if(result.value!=='' && result.value.length>0){
                    let response=await $.ajax({
                        method:'POST',
                        data:{valor:result.value,uuid},
                        url:'../backend/editKeywords.php'
                    })
                    response=JSON.parse(response);
                    if(response.success===true){
                        location.reload();
                    }
                    else{
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                          );
                          location.reload();
                    }
                }
              })
        });
        $(disable).on('click',()=>{
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then (async(result) => {
                if (result.isConfirmed) {
                    const uuid = $(html).find('#name').attr('data');
                    let response= await $.ajax({
                        method:'POST',
                        data:{uuid:uuid},
                        url:'../backend/deleteKeywords.php'
                    });
                    response=JSON.parse(response);
                    if(response.success===true){
                        Swal.fire(
                            'Exito!',
                            'Se logro eliminar la seccion',
                            'success'
                          )
                        location.reload();
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            'No se logro eliminar la seccion',
                            'error'
                          )
                        location.reload();
                    }
                  
                }
              });
        });
        $('#table_allKeywords').append(html);
    });
    sections.forEach(element=>{
        const status=element.sections_status===100?'success':'danger';
        
        const icon=element.sections_status===100?"<i class='bx bx-check text-white status-success'></i>":"<i class='bx bx-x-circle text-white status-success'></i>";
        const html=$(`<tr>
                        <th scope="row" class="bg-${status} 
                        text-${status} mx-auto th-row">
                        ${icon}
                        </th>
                        <td id='name' data="${element.uuid_sections}">${element.section_name}</td>
                        <td>
                        <button id="active" class="btn btn-outline-success"><i class='bx bx-check'></i></button>
                        <button id="disable" class="btn btn btn-outline-danger"><i class='bx bx-x-circle'></i></button>
                        </td>
                    </tr>`);
        const table_html=$(`<div class="col-12 my-1">
                                <div class='row'>
                                    <div class='col-6'>
                                        <span id='name' class='h6' data="${element.uuid_sections}">${element.section_name}</span>
                                    </div>
                                    <div class='col-3'>
                                        <button id="edit" class="btn btn-sm btn-outline-primary"><i class='bx bxs-edit-alt'></i></button>
                                        <button id="disable" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </div>
                            </div>`);
        /*
        ESTAS FUNCIONES DEBAJO CAMBIAN EL STATUS PARA QUE SE MUESTRE 
        EN EL NAVBAR DE EL MENU PRINCIPAL
        */
        const active_max_status=$(html).find('#active')[0];
        const disable_max_status=$(html).find('#disable')[0];
        $(active_max_status).on('click',async()=>{
            const status=100;
            const uuid=$(html).find('#name').attr('data');
            console.log(uuid);
            let response=await $.ajax({
                method:'POST',
                data:{
                    status,
                    uuid
                },
                url:'../backend/changeStatusSections.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                loadSections(html);
            }

        });
        $(disable_max_status).on('click',async()=>{
            const status=0;
            const uuid=$(html).find('#name').attr('data');
            let response=await $.ajax({
                method:'POST',
                data:{
                    status,
                    uuid
                },
                url:'../backend/changeStatusSections.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                loadSections(html);
            }
        });
        const edit_section=$(table_html).find('#edit')[0];
        const delete_section=$(table_html).find('#disable')[0];
        $(edit_section).on('click',()=>{
            Swal.fire({
                title: 'Ingrese el nuevo Nombre de la Seccion',
                html: `<div class='row'>
                            <div class='col-12'>
                                <label>Name Section</label>
                                <input id='section-edit' class='form-control' type="text"/>
                            </div>
                            <div class='col-12'>
                                <label>Color Section</label>
                                <input id='color-edit' class='form-control' type='color'/>
                            </div>
                            <div class='col-12'>
                                <label>Importance</label>
                                <select id='importance-edit' class='form-control'>
                                    <option value='' selected>Chose...</option>
                                    <option value='80'>Media-Alta</option>
                                    <option value='50'>Media</option>
                                    <option value='25'>Poca</option>
                                    <option value='10'>Minima</option>
                                </select>
                            </div>
                       </div>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Editar',
                preConfirm:()=>{
                    const section=Swal.getPopup().querySelector('#section-edit').value;
                    const color=Swal.getPopup().querySelector('#color-edit').value;
                    const importance=Swal.getPopup().querySelector('#importance-edit').value;
                    return{section:section,color:color,importance:importance}
                }
              }).then(async(result) => {
                console.log(result);
                const uuid = $(table_html).find('#name').attr('data');
                if(result.value.section.length>0 && result.value.importance>0){
                    let response=await $.ajax({
                        method:'POST',
                        data:{section:result.value.section,
                              color:result.value.color,
                              importance:result.value.importance,
                             uuid},
                        url:'../backend/editSections.php'
                    })
                    response=JSON.parse(response);
                    if(response.success===true){
                        location.reload();
                    }
                    else{
                        printErrors(response.error);
                    }
                }else{
                    Swal.fire(
                        'Verificar',
                        'El campo section y el nivel de importancia no debe de estar vacio',
                        'warning'
                    );
                }
              });
        });
        $(delete_section).on('click',()=>{
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then (async(result) => {
                if (result.isConfirmed) {
                    const uuid = $(table_html).find('#name').attr('data');
                    let response= await $.ajax({
                        method:'POST',
                        data:{uuid:uuid},
                        url:'../backend/deleteSection.php'
                    });
                    response=JSON.parse(response);
                    if(response.success===true){
                        Swal.fire(
                            'Exito!',
                            'Se logro eliminar la seccion',
                            'success'
                          )
                        location.reload();
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            'No se logro eliminar la seccion',
                            'error'
                          )
                        location.reload();
                    }
                  
                }
              });
        });
        $('#table_allSections').append(table_html);
        $('#table_sections_active').append(html);
    })
});

const loadSections=async(html)=>{
    /*
    ESTA PARTE DEL CODIGO SE HACE PARA BORRAR EL CODIGO VIEJO Y PONER EL NUEVO
    QUE SE CONSIGUE DE LA BD, ESTO ES PARECIDO AL MOMENTO DE CARGAR LA INFORMACION 
    PERO SOLO CON LA TABLA DE SECTIONS QUE SE MUESTRA EN LA PAGINA AL MOMENTO DE QUERER RECAMBIARLO
    SE HACE LA FUNCION RECURSIVA
    */
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getSectionsKeywords.php'
    });
    response=JSON.parse(response);
    const sections=response.sections[0];
    //$('#table_sections_active').remove('tr');
    $(html).siblings('tr').remove()
    $(html).remove();
    sections.forEach(element=>{
        const status=element.sections_status===100?'success':'danger';
        
        const icon=element.sections_status===100?"<i class='bx bx-check text-white status-success'></i>":"<i class='bx bx-x-circle text-white status-success'></i>";
        const html=$(`<tr>
                        <th scope="row" class="bg-${status} 
                        text-${status} mx-auto th-row">
                        ${icon}
                        </th>
                        <td id="name" data="${element.uuid_sections}">${element.section_name}</td>
                        <td>
                        <button id="active" class="btn btn-outline-success"><i class='bx bx-check'></i></button>
                        <button id="disable" class="btn btn btn-outline-danger"><i class='bx bx-x-circle'></i></button>
                        </td>
                    </tr>`);
        const active_max_status=$(html).find('#active')[0];
        const disable_max_status=$(html).find('#disable')[0];
        $(active_max_status).on('click',async()=>{
            const status=100;
            const uuid=$(html).find('#name').attr('data');
            let response=await $.ajax({
                method:'POST',
                data:{
                    status,
                    uuid
                },
                url:'../backend/changeStatusSections.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                loadSections(html);
            }

        });
        $(disable_max_status).on('click',async()=>{
            const status=0;
            console.log(html);
            const uuid=$(html).find('#name').attr('data');
            console.log(uuid);
            let response=await $.ajax({
                method:'POST',
                data:{
                    status,
                    uuid
                },
                url:'../backend/changeStatusSections.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                loadSections(html);
            }
        });
        $('#table_sections_active').append(html);
    })
} 

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

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
