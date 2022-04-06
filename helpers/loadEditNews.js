/*
Esto sirve para saber si en newsadd se manda llamar a una noticia editada
*/

/*
import {getParameterByName} from '../helpers/auxiliar/auxiliarMethods.js';

$(async ()=>{
 const data=getParameterByName('id');
 if(data.length>0){
    let response=await $.ajax({
        method:'GET',
        url:'../backend/getNews.php',
        datatype:'JSON',
        data:{
            id:data
        }
    });
    response=JSON.parse(response);
    console.log(response);
    $('#title').val(response.info.news_title);
    const sections=response.info.sections_info;
    sections.forEach(element=>{
        const html=$(`<span data='${element.uuid_sections}'
        class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>
        ${element.section_name} <i class="fa-solid fa-circle-xmark"></span>`);
        $(html).on('click',()=>$(html).remove());
        $('#container-sections').append(html);
        
    });
    $('#news-hidden').text(response.info.news_text)
    
 }
});*/