$(async()=>{
     let initial_response=await $.ajax({
         method:'GET',
         url:'../backend/getNotificationsReporters.php',
         datatype:'JSON'
     });
     initial_response=JSON.parse(initial_response);
     console.log(initial_response);
     if(initial_response.success===true){
        const modification_news=initial_response.info[0];
        const review_news=initial_response.info[1];
        const accept_news=initial_response.info[2];
        const delete_user=initial_response.info[3];
        if(delete_user[0].communication_message===undefined){
            modification_news[0].communication_message!==undefined?$('#nums-modifications').text(modification_news.length):$('#nums-modifications').text('0');
            review_news[0].communication_message!==undefined?$('#nums-submitted').text(review_news.length):$('#nums-submitted').text('0');
            accept_news[0].communication_message!==undefined?$('#nums-accepted').text(accept_news.length):$('#nums-accepted').text('0');
            $('#news-modification').on('click',()=>showModifications(modification_news));
            $('#news-submitted').on('click',()=>showSubmitted(review_news));
            $('#news-accepted').on('click',()=>showAccepted(accept_news));
        }else{
            delete_user.forEach(element => {
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
            });
        }

        
     }

     /*
     initial_response.info .forEach(element => {
        if(element==='ELIMINACION'){
           
        }
     });
     */
     /*
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
    });*/
})

const deleteUser=async ()=>{
    let response = await $.ajax({
        method:'POST',
        url:'../backend/deleteReporter.php',
        datatype:'JSON'
    })
    response=JSON.parse(response);
    if(response.success===true){
        window.location='index.html';
    }
}

const noDeleteUser= async()=>{

}

const showModifications=(info)=>{
    console.log($('#noticia'));
    $('.noticias').remove();
    info.forEach(element=>{
        if(element.communication_message){
            let image;
            if(element.type_archive!=='.mp4'){
                image=`<img class='input-group-text news_image' src='data:image/jpg;base64,${element.archive}'/>`;
            }else{
                image=`<video class='input-group-text news_image' >
                            <source src='data:video/mp4;base,${element.archive}'></source>
                       </video>`;
            }
            const text=element.news_text.slice(element.news_text.indexOf('<p>'),element.news_text.indexOf('</p>'));
            console.log(text);
            const html=$(`<div class="row noticias" id="noticia">
                        <div class="col-4">
                            <label class="input-grup-text" id='noti' for="noticia" data='${element.uuid_news}'>
                            ${image}
                            </label>
                        </div>
                        <div class="col-8">
                            <h2>Titulo de la noticia</h2>
                            <p class="text-justify">${text}</p>
                        </div>
                        <div class="col-4">
                            <h5 class="text-muted"><b>Mensaje del Administrador</b></h5>
                        </div>
                        <div class="col-8">
                            <p id='message' data='${element.communication_date}' clas="text-muted">${element.communication_message}</p>
                        </div>
                    </div>`);
            $('#news-modification').after(html);
            $(html).on('click',async ()=>{
                const date=$(html).find('#message').attr('data');
                const uuid=$(html).find('#noti').attr('data');
                console.log(date,uuid);
                let response=await $.ajax({
                    method:'POST',
                    datatype:'JSON',
                    data:{
                        id:'YUlJV2dNcjFRTTZHNTRHZHhtUUNWZz09',
                        date:date,
                        n:uuid
                    },
                    url:'../backend/messages.php'

                });
                response=JSON.parse(response);
                if(response.success===true){
                    window.location=`newsadd.html?id=${element.uuid_news}`;
                }else{
                    Swal.fire(
                        'Error',
                        'No se pudo acceder a la foto intente de nuevo',
                        'error'
                    );
                }
                
            });
        }else{
            console.log('Hey');
        }
    });
}

const showSubmitted=(info)=>{
    console.log($('#noticia'));
    $('.noticias').remove();
 info.forEach(element=>{
     if(element.communication_message){
        let image;
        if(element.type_archive!=='.mp4'){
            image=`<img class='input-group-text news_image' src='data:image/jpg;base64,${element.archive}'/>`;
        }else{
            image=`<video class='input-group-text news_image' >
                        <source src='data:video/mp4;base,${element.archive}'></source>
                   </video>`;
        }
        const text=element.news_text.slice(element.news_text.indexOf('<p>'),element.news_text.indexOf('</p>'));
            console.log(text);
        const html=`<div class="row noticias" id="noticia">
                    <div class="col-4">
                        <label class="input-grup-text" for="noticia" data='${element.uuid_news}'>
                        ${image}
                        </label>
                    </div>
                    <div class="col-8">
                        <h2>Titulo de la noticia</h2>
                        <p class="text-justify">${text}</p>
                    </div>
                    <div class="col-4">
                        <h5 class="text-muted"><b>Mensaje del Administrador</b></h5>
                    </div>
                    <div class="col-8">
                        <p clas="text-muted">${element.communication_message}</p>
                    </div>
                </div>`;
        $('#news-submitted').after(html);
     }else{
        console.log('Hey');
     }
});
}
const showAccepted=(info)=>{
    console.log($('#noticia'));
    $('.noticias').remove();
    info.forEach(element=>{
        if(element.communication_message){
            let image;
            if(element.type_archive!=='.mp4'){
                image=`<img class='input-group-text news_image' src='data:image/jpg;base64,${element.archive}'/>`;
            }else{
                image=`<video class='input-group-text news_image' >
                            <source src='data:video/mp4;base,${element.archive}'></source>
                       </video>`;
            }
            const text=element.news_text.slice(element.news_text.indexOf('<p>'),element.news_text.indexOf('</p>'));
            console.log(text);
            const html=$(`<div class="row noticias" id="noticia" data='${element.uuid_news}'>
                    <div class="col-4">
                        <label class="input-grup-text" for="noticia">
                        ${image}
                        </label>
                    </div>
                    <div class="col-8">
                        <h2>${element.news_title}</h2>
                        <p class="text-justify">${text}</p>
                    </div>
                    <div class="col-4">
                        <h5 class="text-muted"><b>Mensaje del Administrador</b></h5>
                    </div>
                    <div class="col-8">
                        <p clas="text-muted">${element.communication_message}</p>
                    </div>
                </div>`);
            $('#news-accepted').after(html);
            $(html).on('click',()=>window.location=`viewnews.html?id=${element.uuid_news}`);
        }else{
            
        }
    });
}