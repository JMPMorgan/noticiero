$(async()=>{
     let initial_response=await $.ajax({
         method:'GET',
         url:'../backend/getNotificationsReporters.php',
         datatype:'JSON'
     })
     initial_response=JSON.parse(initial_response);
     initial_response.info .forEach(element => {
        if(element==='ELIMINACION'){
            const html=$(`<div class='rounded border border-secondary container pb-2 my-4'>
            <h2 class='text-center'>El administrador desea eliminar tu usuario</h2>
            <div class='d-flex justify-content-center'>
            <button id='btn-aceptar' class='btn btn-success mr-2'>Aceptar</button>
            <button id='btn-cancelar' class='btn btn-danger'>Cancelar</button>
            </div>
            </div>`);
            $(html).find('#btn-aceptar').on('click',()=>{
                deleteUser();
            });
            $(html).find('#btn-cancelar').on('click',()=>{
                console.log('Entre a btn cancelar');
            });

            $('#group-notifications-news').append(html);
        }
     });

    $('#news-modification').on('click',()=>{
        let html='<div class="row" id="noticia">'+
        '<div class="col-4">'+
            '<label class="input-grup-text" for="noticia">'+
                '<img src="../assets/img/noticia.jpg" class="input-group-text news_image" alt="" srcset="">'+
            '</label>'+
        '</div>'+
        '<div class="col-8">'+
            '<h2>Titulo de la noticia</h2>'+
            '<p class="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tristique erat erat, malesuada dictum ligula tempus'+
                'porttitor. Aliquam volutpat, diam in tempor vestibulum, nulla augue venenatis justo, at fringilla arcu enim ac'+
                'lacus. Morbi a arcu id velit laoreet vehicula id vitae nisl. Nunc ac ornare velit.</p>'+
        '</div>'+
        '<div class="col-4">'+
            '<h5 class="text-muted"><b>Mensaje del Administrador</b></h5>'+
        '</div>'+
        '<div class="col-8">'+
            '<p clas="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tristique erat erat, malesuada dictum ligula tempus'+
            'porttitor. Aliquam volutpat, diam in tempor vestibulum, nulla augue venenatis justo, at fringilla arcu enim ac'+
            'lacus. Morbi a arcu id velit laoreet vehicula id vitae nisl. Nunc ac ornare velit</p>'+
        '</div>'+
    '</div>';
        $('#news-modification').after(html);
    })
})

const deleteUser=async ()=>{
    let response = await $.ajax({
        method:'POST',
        url:'../backend/deleteReporter.php',
        datatype:'JSON'
    })
    response=JSON.parse(response);
    console.log(response);
    if(response.success===true){
        window.location='index.html';
    }
}

const noDeleteUser= async()=>{

}