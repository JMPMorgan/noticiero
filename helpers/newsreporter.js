let info;
$(async()=>{
    $('#btn-add').on('click',()=>{
        window.location='newsadd.html';
    });
    
    $('#search-news-button').on( 'click', async ()=>{
        const start_date=$('#start-date').val();
        const end_date=$('#end-date').val();
        const title=$('#news-title-search').val();
        const date1 =new Date(start_date);
        const date2=new Date(end_date);
        if(date1<= date2){
            const sections_selected=[]
            const sections=$('#container-sections-selected').children();
            sections.each((index,element)=>{
                sections_selected.push($(element).attr('data'));
            });
            let response;
            if(sections_selected.length>0){
                response= await $.ajax({
                    method:'POST',
                    datatype:'JSON',
                    data:{
                        id:2,
                        start_date:start_date,
                        end_date:end_date,
                        sections:sections_selected,
                        title:title
                    },
                    url:'../backend/searchnews.php'
                });
            }else{
                response= await $.ajax({
                    method:'POST',
                    datatype:'JSON',
                    data:{
                        id:2,
                        start_date:start_date,
                        end_date:end_date,
                        title:title
                    },
                    url:'../backend/searchnews.php'
                });
            }
            console.log(response);
            response=JSON.parse(response);
            console.log(response);
            if(response.success===true){
                $('tbody').children().remove();
                response.info.forEach(element=>{
                    let html;
                    if(element.news_status===0){
                        html=$(`<tr><th scope="row" class="bg-primary text-primary mx-auto th-row">
                        <i class='bx bx-edit-alt text-white status-success'></i></th>
                        <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                        <td>${element.news_publication}</td>
                        <td>
                            <button id='edit' class='btn btn-outline-primary'>
                            <i class='bx bx-edit-alt '></i>
                            </button>
                        </td><tr>`);
                    }
                    else if(element.news_status===1){
                        html=$(`<tr><th scope="row" class=" bg-secondary text-success mx-auto th-row">
                        <i class='bx bx-paper-plane text-white status-success' ></i></th>
                        <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                        <td>${element.news_publication}</td>
                        <td>
                        <span>No se puede cambiar <br> esperando la revision</span>
                        </td></tr>`);
                    }
                    else if(element.news_status===2){
                        html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                        <i class='bx bx-x-circle text-white status-success'></i></th>
                        <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                        <td>${element.news_publication}</td>
                        <td>
                        <span><b>NOTICIA REGRESADA<b><br><small>para acceder a ella ve a tus notificaciones</small></span>
                        </td></tr>`);
                    }else if(element.news_status===3){
                        if(element.news_active===1){
                            html=$(`<tr><th scope="row" class="bg-success text-success mx-auto th-row">
                            <i class='bx bx-check text-white status-success'></i></th>
                            <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                            <td>${element.news_publication}</td>
                            <td>
                            <span><b>NOTICIA PUBLICADA</b><span>
                            </td></tr>`);
                        }
                        else{
                            html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                            <i class='bx bx-x-circle text-white status-success'></i></th>
                            <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                            <td>${element.news_publication}</td>
                            <td>
                            <span><b>NOTICIA DESAHIBILITADA</b></span>
                            </td></tr>`);
                        }
                    }
                    if($(html).find('#edit').length>0){
                        console.log('edit');
                        const edit = $(html).find('#edit')[0];
                        console.log(edit);
                        $(edit).on('click',()=>{
                            const section=$(html).find('#title')[0];
                            const data=$(section).attr('data');
                            console.log(section,data);
                            window.location=`newsadd.html?id=${data}`;
                        });
                    }
                    if($(html).find('#active').length>0){
                        console.log('active');
                        const active = $(html).find('#active')[0];
                        const data=$(active).attr('data');
                        console.log(active,data);
                    }
                    if($(html).find('#disable').length>0){
                        console.log('disble');
                        const disable = $(html).find('#disable')[0];
                        const data=$(disable).attr('data');
                        console.log(disable,data );
                    }
                    $('tbody').append(html);
                });
            }
            else{
                if(response.logged){
                    window.location='index.html';
                }
                $('tbody').children().remove();
                const html=`<h1 class='d-flex justify-content-center'>No se encontro ninguna noticia con estos parametros<h1>`;
                $('tbody').append(html);
            }
        }else{
            Swal.fire(
                'Fechas Invalidas',
                'La fecha de inicio no puede ser mayor que la fecha final',
                'warning'
            );
        }
    });


    let response=await $.ajax({
        method:'GET',
        datatype:'JSON',
        data:{
            id:1,
            uuid:''
        },
        url:'../backend/view_news.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
        info=response.info;
        let ctx = document.getElementById('myChart').getContext('2d'); // 2d context/
        const days=[];
        const numbers=[];
        if(info!==false){
            info.forEach(element=>{
                days.push(element.days);
                numbers.push(element.total);
            });
        }
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '',
                    data: numbers,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }else{
        info=false;
    }
})

window.onload=()=>{

}

