import {validatePassword,onlyMinus,validateEmail} from '../helpers/auxiliar/auxiliarMethods.js';
$(()=>{

    $('#btn-submit').on('click',async ()=>{
        let user=$('#txt-user').val();
        let pass=$('#txt-pass').val();

        let password_error=false;
        let user_email_error=false;
        let user_error=false;

        if(user!== undefined||user.length>0){
            if(validateEmail(user)===true){
              user_error=onlyMinus(user);
            }
        }
        else{
            user_error=true;
        }
        if (pass!== undefined || pass.length>0){
            let letters= 0;
            let char_especial=0;
            let number=0;
            for(let i=0;i<pass.length;i++){
                let last_char=pass.charAt(i);
                let value=validatePassword(last_char);
            
            if (value === true) {
                password_error = true;
                break;
              }
              else if (value === 'A') {
                letters++;
              }
              else if (value === '@') {
                char_especial++;
              }
              else if (value === 1) {
                number++;
              }
            }
            let length_char = letters + char_especial + number;
            if (letters === 0 || char_especial === 0 || number === 0) {
              password_error = true;
            }
        }
        else{
            password_error=true;
        }
        let validate  = checkErrors(user_error,password_error);
        if(validate==='success'){
            let response = await $.ajax({
                type:'POST',
                url:'../backend/login.php',
                data:{
                    user,
                    pass
                },
                datatype:'JSON'
            });
            response=JSON.parse(response);
            if(response.success===true){
              window.location='index.html';
            }
            else{

            }
        }

    });

    const checkErrors=(user,pass)=>{
        let errors=[];
        if(user===true){
            errors.push('user');
        }
        if(pass===true){
            errors.push('password');
        }
        if (errors.length > 0) {
            return errors;
          }
          else {
            return 'success';
          }
    }
})