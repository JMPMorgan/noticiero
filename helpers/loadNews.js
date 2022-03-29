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
    }
})