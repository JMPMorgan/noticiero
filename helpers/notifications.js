
$(async ()=>{
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getNewsForRevision.php'
    });
    response=JSON.parse(response);
    console.log(response);
    if(response.success===true){
        response.info.forEach(element => {
            console.log(element);
            const html=$(`<div class='row noticia' data='${element.uuid_news}' >
            <div class='col-4'>
                <lablel class="input-grup-text" for='noticia'>
                    <img src'' class='input-group-text news_image'>
                </label>
            </div>
            <div class='col-8'>
                <h2>${element.news_title}</h2>
                <p class='text-justify'>${element.news_text}</p>
                <span id='user_news' data='${element.uuid_userC}' class='text-muted mr-4'>${element.user_name} ${element.user_lastname}</span>
                <span class="text-muted">FECHA DE CREACION: ${element.news_creation}</span>
            </div>
            <div>`);

            /*

            ESTO TENDRIA QUE LLEVAR MAS LOGICA PUES SE NECESITA SABER PARA CUANDO SE QUIERE 
            PUBLICAR PERO PARA LA SEGUNDO ENTREGABLE ESTA BIEN
            */
           $(html).on('click',()=>{
            window.location=`viewnews.html?id=${element.uuid_news}`
           });
            $('#news-today').after(html);
        });
    }
    $('#news-expired').on('click',()=>{
        let html='<div class="row noticia" >'+
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
            '<span class="text-muted mr-4">NOMBRE DEL REPORTERO</span>'+
            '<span class="text-muted">FECHA DE CREACION:18/02/2022</span>'+
        '</div>'+
    '</div>';
        $('#news-expired').after(html);
    });
})  

