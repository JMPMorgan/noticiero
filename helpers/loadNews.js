import {getParameterByName} from '../helpers/auxiliar/auxiliarMethods.js';
$(async()=>{
    const id=getParameterByName('id');
    console.log(id);
    if(id.length>0){
        let response=await $.ajax({
            method:'GET',
            datatype:'JSON',
            data:{id:id},
            url:'../backend/loadNewsView.php'
        });
        response=JSON.parse(response);
        console.log(response);
        if(response.success===true){
            if(response.info.archivos.length>0){
                let i=0;
                response.info.archivos.forEach(element => {
                    const html=$(`<div class='col-image d-flex justify-content-center s4'>
                                    <img class='demo opcacity-image hover-opacity-off' src='data:image/jpg;base64,${element}'
                                    style='width:25%;cursor:pointer' onclick='currentDiv(4)'>
                                </div>`);
                    const html_image=$(`<img class='mySlides mx-auto' src='data:image/jpg;base64,${element}' style='width:25%;display:none'>`);
                    $('#container-imgs').append(html);
                    $('#container-imgs').before(html_image);
                    i++;
                });
            }
            const sections= response.info.data.sections;
            sections.forEach(element=>{
                const html=$(`<a class='btn btn-sm btn-outline-primary my-1' onclick=${element.uuid}>${element.name}</a>`);
                $('#sections-news');
                $('#sections-news').append(html);
            });
            const name_reporter=response.info.data.user_name;
            $('#nombre-reportero').text(name_reporter);
            $('#nombre-reportero').attr('data',response.info.data.user_uuid);
            $('#titulo-noticia').text(response.info.data.news_title);
            $('#text-noticia').html(response.info.data.news_text);
            

        }
    }
})