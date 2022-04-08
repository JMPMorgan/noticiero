
$(async ()=>{
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getCountsForRevision.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
        const today=response.info.today.number;
        const prev=response.info.prev.number;
        const this_week=response.info.this_week.number;
        const weeks=response.info.weeks.number;
        /*response.info.forEach(element => {
            console.log(element);
            const html=$(`<div class='row noticia' data='${element.uuid_news}' >
            <div class='col-4'>
                <lablel class="input-grup-text" for='noticia'>
                    <img src'' class='input-group-text news_image'>
                </label>
            </div>
            <div class='col-8'>
                <h2>${element.news_title}</h2>
                <p class='text-justify'>${element.news_text}</p>
                <span id='user_news' data='${element.uuid_userC}' class='text-muted mr-4'>${element.user_name} ${element.user_lastname}</span>
                <span class="text-muted">FECHA DE CREACION: ${element.news_creation}</span>
            </div>
            <div>`);
           $(html).on('click',()=>{
            window.location=`viewnews.html?id=${element.uuid_news}`
           });
            $('#news-today').after(html);
        });*/
        $('#num_expired').text(prev);
        $('#num_today').text(today);
        $('#num_this').text(this_week);
        $('#num_weeks').text(weeks);
    }
    $('#news-expired').on('click',async()=>{
        deleteOtherNews();
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                id:3
            },
            url:'../backend/getNewsForRevision.php'
        });
        checkInformation(response,'#news-expired');
        /*let html='<div class="row noticia" >'+
        '<div class="col-4">'+
            '<label class="input-grup-text" for="noticia">'+
                '<img src="../assets/img/noticia.jpg" class="input-group-text news_image" alt="" srcset="">'+
            '</label>'+
        '</div>'+
        '<div class="col-8">'+
            '<h2>Titulo de la noticia</h2>'+
            '<p class="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tristique erat erat, malesuada dictum ligula tempus'+
                'porttitor. Aliquam volutpat, diam in tempor vestibulum, nulla augue venenatis justo, at fringilla arcu enim ac'+
                'lacus. Morbi a arcu id velit laoreet vehicula id vitae nisl. Nunc ac ornare velit.</p>'+
            '<span class="text-muted mr-4">NOMBRE DEL REPORTERO</span>'+
            '<span class="text-muted">FECHA DE CREACION:18/02/2022</span>'+
        '</div>'+
    '</div>';
        $('#news-expired').after(html);*/
    });

    $('#news-today').on('click',async()=>{
        deleteOtherNews();
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                id:0
            },
            url:'../backend/getNewsForRevision.php'
        });
        checkInformation(response,'#news-today');
    });

    $('#news-week').on('click',async()=>{
        deleteOtherNews();
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                id:1
            },
            url:'../backend/getNewsForRevision.php'
        });
        checkInformation(response,'#news-week');
    });

    $('#news-weeksmore').on('click',async()=>{
        deleteOtherNews();
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                id:2
            },
            url:'../backend/getNewsForRevision.php'
        });
        checkInformation(response,'#news-weeksmore');
    });
})  


const checkInformation=(r,id)=>{
    if(r.length>0){
        r=JSON.parse(r);
        console.log(r);
        if(r.success===true){
            const news=r.info;
            news.forEach(element=>{
                let image;
                if(element.type_archive==='.mp4'){
                    image=`<video class="input-group-text news_image" controls>
                    <source src="data:video/mp4;base64,${element.archive}" type="video/mp4"></video>`;
                }else{
                    image=`<img class='input-group-text news_image' src='data:image/jpg;base64,${element.archive}'>`;
                }
                
                const html=$(`<div data='${element.uuid_news}'class='row noticia'>
                                <div class='col-4 pl-0'>
                                    <label>
                                        ${image}
                                    </label>
                                </div>
                                <div class='col-8 pr-0'>
                                    <h2 >${element.news_title}</h2> 
                                    <span class='text-muted mr-4' data='${element.uuid_user}'>${element.user_name}</span>
                                    <br>
                                    <span class='text-muted'>FECHA DE NOTICIA: ${element.news_date} 
                                     FECHA DE CREACION: ${element.news_creation}</span>
                                </div>
                            </div>`);
                $(id).after(html);
                const uuid_news=element.uuid_news;
                $(html).on('click',()=>viewNews(uuid_news));
            });
        }else{

        }
    }
    else{
        const html= `<div class="row noticia" >
        <div class="col-4 pl-0">
            <label class="input-grup-text" for="noticia">'
                <img src="../assets/img/not_found.jpg" class="input-group-text news_image" alt="" srcset="">
            </label>
        </div>
        <div class="col-8 pr-0">
            <h2>NINGUNA NOTICIA FUE ENCONTRADA PARA ESTA SECCION</h2>
            <p class="text-justify">NINGUNA NOTICIA FUE ENCONTRADA PARA ESTA SECCION</p>
            <span class="text-muted mr-4">NOT FOUND</span>
            <span class="text-muted">FECHA DE CREACION:NOT FOUND</span>
        </div>
    </div>`;
     $(id).after(html);
    }
}

const deleteOtherNews=()=>{
    $('#container-news').children('div').remove();
}


const viewNews=(uuid_news)=>{
    window.location=`viewnews.html?id=${uuid_news}`
}
