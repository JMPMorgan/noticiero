/*$(document).ready(async()=>{
    let response= await $.ajax({
        type:'POST',
        datatype:'JSON',
        url:'../backend/data.php',
        success:(r)=>{
            console.log(r);
        }
    })
    console.log(response);
})*/
$(()=>{
    $('#btn-signin').on('click',()=>{
        window.parent.document.location='signup.html';
    });
    $('#btn-login').on('click',()=>{
        window.parent.document.location='login.html';
    });
})
    $.ajax({
        type:'POST',
        datatype:'JSON',
        url:'../backend/data.php',
        success:(r)=>{
            if(r!==undefined||r!==null){
                let html;
                let response;
                //$('#profile').css('display','none');
                response=JSON.parse(r);
                let name =response.info[0];
                let pp= response.info[1];
                if(pp!==undefined||pp!==null){
                    pp='../assets/img/brandon.png';
                }
                let last=response.info[2];
                let user=response.info[3];
                name +=' '+last;
                html="<ul class='navbar-nav justify-content-end'>"+
                        "<li class='nav-item justify-content-end'>"+
                            "<div class='row'>"+
                                "<div class='col-sm-12 m-0'>"+
                                    "<p class='my-0 mr-3 ml-0 text-right'>"+name+"</p>"+
                                "</div>"+
                                "<div class='col-sm-12 m-0'>"+
                                    "<p class='my-0 mr-3 ml-0 text-right' id='user'>"+user+"</p>"+
                                 "</div>"+
                            "</div>"+
                        "</li>"+
                        "<li class='nav-item justify-content-end'>"+
                            "<img src="+pp+" class='rounded img-thumbnail' id='profile-pic'>"+
                        "</li>"+
                    "</ul>";
                html=$(html);
                $(html[0].lastChild.firstChild).on('click',()=>{showProfileInfo()});
                $("#info").append(html);
            }
        }
    });


    $('#profile-pic').on('click',()=>{
        alert('hola');
    })

    const showProfileInfo=()=>{
        $.ajax({
            type:'POST',
            datatype:'JSON',
            url:'../backend/navbar.php',
            success:(r)=>{
                console.log(r);
                let response = JSON.parse(r);
                if(response.success===true){
                    window.parent.document.location.reload();
                }
                else{
                    alert('hola_como');
                }
                
            }
        });
    }



/*const info= async ()=>{
    let res;
    let response= await $.ajax({
        type:'POST',
        datatype:'JSON',
        url:'../backend/data.php',
        success:(r)=>{
            res=JSON.parse(r);
            return new Promise(resolve => {
                return res;
              });
        }
    });
}*/