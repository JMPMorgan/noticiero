$(()=>{
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: false
    })

    if($('#preview').attr('src')===null || $('#preview').attr('src')===''){
      //Esto busca si no se ha cargado ninguna imagen para no mostrar la etiqueta vacia
      $('#preview').css('display','none');
    }
    $('.browse').on("click", ()=> {
        //manda un trigger para presionar la seleccion de archivo ya que el cliente no podra por que esta oculto
        var file = $(this).parents().find(".file");
        file.trigger("click");
      });
      $('input[type="file"]').change(function(e) {
        /*
        Esto carga la imagen en el visualizador de imagen 
        */
        var fileName = e.target.files[0].name;
        $("#file").val(fileName);
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("preview").src = e.target.result;
        };
        $('#preview').css('display','flex');
        $('#preview').addClass('d-flex mx-auto justify-content-center');
        reader.readAsDataURL(this.files[0]);
      });

      $('#btn-back').on('click',()=>{
        //Regresa a el menu principal
        $(location).attr('href','../index.html');
      });

      $('#btn-register').on('click',async ()=>{
        /*
        Esto es para registrar un usuario, 
        obtienes los campos
        */
        let name = $('#txt-name').val();
        let lastname = $('#txt-lastname').val();
        let email=$('#txt-email').val();
        let user=$('#txt-user').val();
        let password= $('#txt-password').val();
        let cpassword=$('#txt-cpassword').val();
        let gender=$('input[name=gender]:checked').val();

        let name_error= false;
        let lastname_error=false;
        let email_error=false;
        let user_error=false;
        let password_error=false;
        let gender_error=false;
        if(name !== undefined || name.length >0){
          name_error=onlyLetters(name);
        }
        else{
          name_error=true;
        }
        if(lastname !== undefined || lastname.length>0){
          lastname_error=onlyLetters(lastname);
        }
        else{
          lastname_error=true;
        }
        if(email !== undefined || email.length>0){
          email_error=validateEmail(email);
        }
        else{
          email_error=true;
        }
        if(user!==undefined || user.length>0){
          user_error=onlyMinus(user);
        }
        else{
          user_error=false;
        }
        if(password!== undefined || password.length>0){
          if(password===cpassword){
            /*
            Primero pregunta si en la contraseña es igual a la confirmacion
            luego se declaran las variables para saber cuantos caracteres hay de cada tipo,
            despues se recorre por caracteres para mandarlo a la funcion para saber que tipo de 
            caracter es y se suman al final para que de igual la suma de las 3 variables con la 
            longitud de password
            */
            let letters=0;
            let char_especial=0;
            let number=0;
            for(let i = 0;i<password.length;i++){
              let last_char=  password.charAt(i);
              let value=validatePassword(last_char);
              if(value===true){
                password_error=true;
                break;
              }
              else if (value==='A'){
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
              password_error=true;
            }
            if(password.length!==length_char && password.length!== cpassword.length-1){
              password_error=true;
            }
          }
          else{
            password_error = true;
          }
        }
        else{
          password_error=true;
        }
        if(gender===undefined || gender.length<=0){
          gender_error=true;
        }

        //Se envia a esta funcion para saber cuales errores tiene la verificacion,
        //si no tiene ningun error se envia un success para ingresar el nuevo usuario a la BD.
        let validate=checkErrors(name_error,lastname_error,email_error,password_error,gender_error,user_error);
        if(validate==='success'){
          let response = await $.ajax({
            type:'POST',
            url:'../backend/signup.php',
            data:{
              name,
              lastname,
              email,
              user,
              password,
              gender
            },
            datatype:'JSON',
            success:(r)=>{
              //console.log(r);
            }
          });
          response=JSON.parse(response);
          if(response.success===true){
            
            Toast.fire({
              icon: 'success',
              title: 'Usuario Registrado con Exito'
            });
          }
          else if(response.error.length>0){
            printErrors(response.error);
          }
          console.log(response);
        }
        else{
          printErrors(validate);
        }

      });      
      const onlyLetters=(text)=>{
        //Pregunta si son letras de la a-z y A-Z y si cuenta con espacios
        //si cumple las condiciones regresa true, pero en esta funcion regresa el opuesto
        //por cuestion de funcionalidad
        let regex = /^[a-zA-Z ]+$/;
        return !regex.test(text);
      }

      const onlyMinus=(text)=>{
        let regex=/^[a-z\_]+$/;
        return !regex.test(text);
      }

      const  validateEmail=(email)=>{
        /*return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );*/
        /*
        validad el email para que haya texto despues un arroba y un punto
        */
        let regex = /\S+@\S+\.\S+/;
        return !regex.test(email);
      }

      const validatePassword=(password)=>{
        /*
        valida la contraseña pero lo valida por caracter para saber cuantos y cuales son los caracteres ingresados
        */
        let regex_especial=/^[\$\@\#\&]+$/;
        let regex_number=/^[0-9]+$/;
        let regex_char=/^[a-zA-Z]+$/;
        if(regex_char.test(password)){
          //retorna por que son letras
          return 'A';
        }
        else if(regex_number.test(password)){
          //retorna el 1 por que el caracter es un numero
          return 1;
        }
        else if(regex_especial){
          //retorna el @ por que es un caracter especial
          return '@';
        }
        else{
          return true;
        }
      }

      const checkErrors=(names,lastname,email,password,gender,user)=>{
        let errors=[];
        if(names===true){
          errors.push('name');
        }
        if(lastname===true){
          errors.push('lastname');
        }
        if(email===true){
          errors.push('email');
        }
        if(user===true){
          errors.push('user');
        }
        if(password===true){
          errors.push('password');
        }
        if(gender===true){
          errors.push('gender');
        }
        if(errors.length>0){
          return errors;
        }
        else{
          return 'success';
        }
      }

      const printErrors=(error)=>{
        let html='Verificar información:';
        let li='<li>';
        let li_last='</li>';
        for(let i=0;error.length>i;i++){
          let text=li+error[i]+li_last;
          html=html+text;
        }
        Toast.fire({
          icon:'warning',
          html:html
        }); 
      }

})