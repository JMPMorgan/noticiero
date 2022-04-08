const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

$(async()=>{
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/loadNews.php'
    });
    response=JSON.parse(response);
    console.log(response);
    if(response.success===true){
        response.info.forEach(element=>{
            let html;
            if(element.news_status===0){
                html=$(`<tr><th scope="row" class="bg-primary text-primary mx-auto th-row">
                <i class='bx bx-edit-alt text-white status-success'></i></th>
                <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                <td>${element.news_date}</td>
                <td>
                    <button id='edit' class='btn btn-outline-primary'>
                    <i class='bx bx-edit-alt '></i>
                    </button>
                </td><tr>`);
            }else{
                if(element.news_active===1){
                    html=$(`<tr><th scope="row" class=" bg-secondary text-success mx-auto th-row">
                    <i class='bx bx-paper-plane text-white status-success' ></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <span>No se puede cambiar,esperando la revision</span>
                    </td></tr>`);
                }
                else{
                    html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                    <i class='bx bx-x-circle text-white status-success'></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <button id='active' class="btn btn-outline-success"><i class='bx bx-check'></i></button>
                    <button id='disable' class="btn btn btn-outline-danger"><i class='bx bx-x-circle'></i></button>
                    <button id='edit' class='btn btn-outline-primary'>
                    <i class='bx bx-edit-alt '></i>
                    </button>
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
            $('tbody').append(html)
        });
    }else{
        printErrors(response.error);
    }


})
const printErrors = (error) => {
    let html = 'Verificar información:';
    let li = '<li>';
    let li_last = '</li>';
    for (let i = 0; error.length > i; i++) {
      let text = li + error[i] + li_last;
      html = html + text;
    }
    Toast.fire({
      icon: 'warning',
      html: html
    });
  }
