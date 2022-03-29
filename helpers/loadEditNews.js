/*
Esto sirve para saber si en newsadd se manda llamar a una noticia editada
*/
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
    let html=response.info[1];
    $('#writer-news').after(html);
    html=response.info[6];
    $('#writer-news').after(html);
    html=response.info[11];
    $('#writer-news').after(html);
 }
})