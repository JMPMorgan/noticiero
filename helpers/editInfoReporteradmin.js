import{onlyLetters,onlyMinus,getParameterByName,validateEmail,validateEntirePassword} from '../helpers/auxiliar/auxiliarMethods.js';

$(()=>{

    let data= new FormData();
    let image_upload=false;
    let file='';
    let fileName='';

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: false
      });

    $('#browse').on("click",()=>{
        file=$(this).parents().find('#file-image');
        if(file.length===0){
            file=$('input[type="file"]');
        }
        file[0].click();
    });

    $('input[type="file"]').change(function(e){
        fileName=e.target.files[0].name;
        $('#file').val(fileName);
        let reader=new FileReader();
        reader.onload=(e)=>{
            document.getElementById("preview").src=e.target.result;
        }
        image_upload=true;
        $('#preview').css('display','flex');
        $('#preview').addClass('d-flex mx-auto justify-content-center');
        reader.readAsDataURL(this.files[0]);
    });
    
    $('#btn-update').on('click',async ()=>{
        let errors=[];
        if($('#ed-name').val()==='' && onlyLetters($('#ed-name').val())===true){
        errors.push('Nombre Vacio o solo acepta Letras');
        }
        if($('#ed-lastname').val()==='' && onlyLetters($('#ed-lastname').val())===true){
            errors.push('Apellido Vacio o solo Acepta Letras');
        }
        const isCorrectPassword=validateEntirePassword($('#ed-password').val());
        if($('#ed-password').val()==='' && isCorrectPassword.error===true){
            errors.push(isCorrectPassword.text);
        }
        const isCorrectPasswordC=validateEntirePassword($('#ed-cpassword').val());
        if($('#ed-cpassword').val()==='' && isCorrectPasswordC.error===true){
            errors.push(isCorrectPasswordC.text);
        } 
        if($('#ed-password').val()!==$('#ed-cpassword').val()){
            errors.push('Las contraseñas no coinciden');
        }
        if($('#ed-email').val()==='' && validateEmail($('#ed-email').val())===true){
            errors.push('El valor ingresado no es un email');
        }
        if(errors.length===0){
            data.append('name',$('#ed-name').val());
            data.append('lastname',$('#ed-lastname').val());
            data.append('email',$('#ed-email').val());
            data.append('password',$('#ed-password').val());
            data.append('number',$('#pm-name').attr('data'));
            if(image_upload===true){
                data.append('image',$('#file-image')[0].files[0]);
                data.append('hasImage',true);
            }
            let response = await fetch('../backend/editReportersbyAdmin.php',{
                method:'POST',
                body:data
            }).then(r=>r.text());
            response=JSON.parse(response);
            console.log(response);
        }
        else{
            printErrors(errors);
        }
    })


})

const printErrors=(errors)=>{
    let html= 'Verificar informacion';
    const li='<li>';
    const li_last='</li>';
    for(let i=0;errors.length>i;i++){
        let text=li+errors[i]+li_last;
        html=html+text;
    }
    Toast.fire({
        icon: 'warning',
        html: html
      });
}