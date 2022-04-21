import {validateEntirePassword,onlyLetters,onlyMinus,validateEmail,validatePassword} from '../helpers/auxiliar/auxiliarMethods.js';

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

$(()=>{
    $.ajax({
        type:'GET',
        datatype:'JSON',
        url:'../backend/getprofile.php',
        success:(r)=>{
            r=JSON.parse(r);
            if(r.success===true){
                $('#pm-img').attr('src',r.info[3]);
                $('#pm-name').text(`${r.info[0]} ${r.info[1]}`);
                $('#pm-name').attr('data',r.info[5]);
                $('#pm-user').text(r.info[4]);
                $('#pm-email').text(r.info[2]);
                $('#ed-name').val(r.info[0]);
                $('#ed-lastname').val(r.info[1]);
                $('#ed-email').val(r.info[2]);
                if(r.info[6]!==0 && r.info[6]!==1){
                    const html =$(`<button class='btn btn-danger'>
                    Delete User
                    </button>`);
                    $('#container-buttons').append(html);
                    $(html).on('click',()=>{
                        deleteUser();
                    })
                }
            }
        }
    });



    let image_upload=false;
    let file='';
    let fileName='';

    if($('#preview').attr('src')===null || $('#preview').attr('src')===''){
        $('#preview').css('display','none');
    };

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
    })

    $('#btn-update').on('click',async ()=>{
        let data = new FormData();
        if($('#ed-name').val()==='' && $('#ed-lastname').val()==='' && $('#ed-email').val()===''){
            errors.push('Debe Rellenar Nombre, Apellido  y Email');
        }
        else{
            let errors=[];
            let name= $('#ed-name').val();
            let last_name=$('#ed-lastname').val();
            let oldpassword=$('#ed-oldpassword').val();
            let password= $('#ed-password').val();
            let cpassword= $('#ed-cpassword').val();
            let ed_mail=$('#ed-email').val();
            if(onlyLetters(name)===true){
                errors.push('Nombre');
            }
            if(onlyLetters(last_name)===true){
                errors.push('Apellido');
            }
            if(validateEmail(ed_mail)===true){
                errors.push('Email');
            }
            let letters=0;
            let char_especial=0;
            let number=0;
            for(let i =0;i<oldpassword.length;i++){
                let last_char=oldpassword.charAt(i);
                let value= validatePassword(last_char);
                if (value===true){
                    errors.push('Contraseña Antigua');
                    break;
                }
                else if(value==='A'){
                    letters++;
                }
                else if(value==='@'){
                    char_especial++;
                }
                else if(value===1){
                    number++;
                }
            }
            let length_char=letters+char_especial+number;
            if(letters===0||char_especial===0||number===0){
                errors.push('La contraseña antigua no contiene letras,algun caracter especial o un numero');
            }
            if(password===cpassword){
                const{error,text=''}=validateEntirePassword(password);
                if(error===true){
                    errors.push(text);
                }
            }  
            else{
                errors.push('Las contraseñas no coinciden');
            }
            if(errors.length>0){
                printErrors(errors);
                return;
            }
            else{
                data.append('name',name);
                data.append('lastname',last_name);
                data.append('email',ed_mail);
                data.append('oldpassword',oldpassword);
                data.append('password',password);
                data.append('number',$('#pm-name').attr('data'));
                if(image_upload===true){
                    data.append('image',$('#file-image')[0].files[0]);
                    data.append('hasImage',true);
                }
                let resp=await fetch('../backend/editprofile.php',{
                    method:'POST',
                    body:data
                }).then( r => r.text());
                resp=JSON.parse(resp);
                console.log(resp);
                if(resp.success===true){
                    location.reload();
                }
                
            }
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

const deleteUser=async ()=>{
     let response= await $.ajax({
         method:'POST',
         datatype:'JSON',
         url:'../backend/deleteUser.php'
     });
     response=JSON.parse(response);
     console.log(response);
     if(response.success===true){
         window.location='index.html';
     }
}