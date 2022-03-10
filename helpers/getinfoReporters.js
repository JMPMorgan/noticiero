import{getParameterByName} from '../helpers/auxiliar/auxiliarMethods.js';
$(async ()=>{
    /*
    Aqui se obtendrian los parametros desde el url,para despues saber que se debe hacer si mostrar el usaurio o editarlo
    */
   const id= getParameterByName('id');
   const status= Number(getParameterByName('status'));
   let response=await $.ajax({
       type:'GET',
       url:'../backend/getprofilesbyadmin.php',
       datatype:'JSON',
       data:{
        id,
        status
       }
       ,success:r=>r
   });
   response=JSON.parse(response);
   if(response.success===true){
    $('#pm-img').attr('src',response.info[3]);
    $('#pm-name').text(`${response.info[0]} ${response.info[5]}`);
    $('#pm-name').attr('data',response.info[2]);
    $('#pm-user').text(response.info[4]);
    $('#pm-email').text(response.info[1]);
    $('#ed-name').val(response.info[0]);
    $('#ed-lastname').val(response.info[5]);
    $('#ed-email').val(response.info[1]);
   }

   if ($('#preview').attr('src') === null || $('#preview').attr('src') === '') {
    //Esto busca si no se ha cargado ninguna imagen para no mostrar la etiqueta vacia
    $('#preview').css('display', 'none');
  }

  if(status===2){
    $('#ed-name').attr('disabled','true');
    $('#ed-lastname').attr('disabled','true');
    $('#ed-email').attr('disabled','true');
    $('#ed-oldpassword').css('display','none');
    $('#ed-password').css('display','none');
    $('#ed-cpassword').css('display','none');
    $('#image-form').css('display','none');
    $('#ed-oldpassword').next().css('display','none');
    $('#ed-password').next().css('display','none');
    $('#ed-cpassword').next().css('display','none');
    $('#msg').prev().css('display','none');
    $('#title-status').text('Profile Reporter');
    $('#btn-update').css('display','none');
  }
})