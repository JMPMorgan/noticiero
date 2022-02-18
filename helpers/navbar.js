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
        document.location='signup.html';
    });
    $('#btn-login').on('click',()=>{
        document.location='login.html';
    });

    $('#logo').on('click',()=>{
        document.location='index.html';
    });
})


    $.ajax({
        type:'POST',
        datatype:'JSON',
        url:'../backend/data.php',
        success:(r)=>{
            if(r!==undefined||r!==null){
                /*
                Esto carga la informacion de inicio de session si no hay información que mostrar
                o sea un perfil muestra los botones de inicio de session 
                si no carga la el nombre, usuario y foto de perfil  del usuario
                con la variable html
                */
                let html;
                let response;
                response=JSON.parse(r);
                if(response.success===true){
                    $('#profile').css('display','none');
                    let name =response.info[0];
                    let pp= response.info[1];
                    if(pp===undefined||pp===null){
                        pp='assets/img/brandon.png';
                    }
                    let last=response.info[2];
                    let user=response.info[3];
                    let code=response.info[4];
                    if(code===undefined || code.length<=0){
                        code='';
                    }
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
                                "<details id='profile-menu'>"+
                                    "<summary>"+
                                        "<img src="+pp+" class='rounded img-thumbnail' "+
                                        "id='profile-pic'/>"+
                                        "<i class='bx bx-caret-down' id='dropdownmenu'></i>"+
                                    "</sumary>"+
                                    "<details id='dropdown-menu'>"+
                                        "<summary></summary>"+
                                        code+
                                        "<a class='dropdown-list rounded border btn btn-outline-primary' id='btn-profile'>Your profile</a>"+
                                        "<a class='dropdown-list rounded border btn btn-outline-primary' id='btn-signout'>Sign Out</a>"+
                                    "</details>"+    
                                "</details>"+    
                            "</li>"+
                        "</ul>";
                    html=$(html);
                    let profile_menu=$(html).find('#profile-menu');
                    profile_menu[0].open=false;
                    let dropdown_menu=$(html).find('#dropdown-menu');
                    let btn_signout=$(html).find('#btn-signout');
                    let btn_profile = $(html).find('#btn-profile');
                    $(btn_profile[0]).on('click',()=>{showInfoProfile()});
                    $(dropdown_menu[0]).css('border','none');
                    $(btn_signout[0]).on('click',()=>{signOutSession()});
                    $(profile_menu[0]).on('click',()=>{onClickProfileMenu(dropdown_menu)});
                    $("#info").append(html);
                }

            }
        }
    });


    $('#profile-pic').on('click',()=>{
        alert('hola');
    })

    const showInfoProfile=()=>{
        window.location='editprofile.html';
    }

    const signOutSession=()=>{
        $.ajax({
            type:'POST',
            datatype:'JSON',
            url:'../backend/navbar.php',
            success:(r)=>{
                console.log(r);
                let response = JSON.parse(r);
                if(response.success===true){
                    window.location='index.html';
                }
                else{
                    alert('hola_como');
                }
                
            }
        });
    }

    const onClickProfileMenu=(dropdown)=>{
        let profile_menu=$(dropdown).parents('#profile-menu');
        if(profile_menu[0].open===true){
            dropdown[0].open=true;
            $(dropdown[0]).css('padding','0');
        }
        else{
            dropdown[0].open=false;
            $(dropdown[0]).css('border','none');
        }
    }
