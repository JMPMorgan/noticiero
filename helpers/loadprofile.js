import {onlyLetters,onlyMinus,validateEmail,validatePassword} from '../helpers/auxiliar/auxiliarMethods.js';

$(()=>{
    $.ajax({
        type:'GET',
        datatype:'JSON',
        url:'../backend/editprofile.php',
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
            }
        }
    })

    $('#btn-update').on('click',()=>{
        let data = new FormData();

    })
})