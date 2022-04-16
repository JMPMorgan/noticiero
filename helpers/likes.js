import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
$(async()=>{
    const uuid=getParameterByName('id');
    let response=await $.ajax({
        method:'GET',
        data:{
            id:0,
            uuid:uuid
        },
        datatype:'JSON',
        url:"../backend/likes.php"
    });
    response=JSON.parse(response);
    if(response.success===true){
        const isLiked=response.info[1].id_likes>0?true:false;
        const likes=response.info[0].likes;
        if(likes>0){
            $('#num-likes').text(likes);
        }else{
            $('#num-likes').text('0');
        }
        if(isLiked===true ){
            $('#like-btn').removeClass('isLikent');
            $('#like-btn').addClass('isLike');
            $('#like-btn').attr('data',true);
        }  
    }

    response=await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/loadPopularSectionsNews.php'
    });
    if(response.length>0){
        response=JSON.parse(response);
        console.log(response);
        const popular_news=response.info.news;
        const popular_sections=response.info.sections;
        if(popular_news.length>0){
            popular_news.forEach(element=>{
                const html=$(`<div  class='my-2 news-suggested'>
                            <a href='viewnews.html?id=${element.uuid_news}'>
                            <h6>${element.news_title}</h6>
                            <img class="news-sections" src="data:image/jpg;base64,${element.archive}">
                            </a>
                        </div>`);
                console.log(html);
                $('#container-all-news-suggested').append(html);
            });
        }
        const test=$('#sections-popular').prev().text();
        if(test!=='Keywords Selections') {
            if(popular_sections.length>0){
                popular_sections.forEach(element=>{
                    const html=$(`<a href="index.html?id=${element.uuid_sections}" class='btn my-1 btn-sm btn-outline-primary'>${element.section_name}</a>`);
                    $('#sections-popular').append(html);
                });
            }
        }

    }
    $('#like-btn').on('click',async()=>{
        const uuid=getParameterByName('id');
        const isLiked=$('#like-btn').attr('data');
        let id;
        isLiked==='true'?id=2:id=1;
        console.log(id);
        let response=await $.ajax({
                method:'POST',
                data:{
                    id:id,
                    uuid:uuid,
                },
                datatype:'JSON',
                url:"../backend/likes.php"
            });
        
        
        console.log(response);
        response=JSON.parse(response);
        if(response.success===true){
            location.reload();
        }else{

        }
    });
});