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