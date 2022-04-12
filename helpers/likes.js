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
        console.log(response);    
    }
    $('#like-btn').on('click',async()=>{
        const uuid=getParameterByName('id');
        let response=await $.ajax({
            method:'POST',
            data:{
                id:1,
                uuid:uuid
            },
            datatype:'JSON',
            url:"../backend/likes.php"
        });
        console.log(response);
        response=JSON.parse(response);
        if(response.success===true){
            
        }else{

        }
    });
});