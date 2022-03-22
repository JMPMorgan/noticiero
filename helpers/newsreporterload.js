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
    if(response.success===true){
        response.info.forEach(element=>{
            let html;
            if(element.news_date=='0000-00-00'){
                html=$(`<tr><th scope="row" class="bg-primary text-primary mx-auto th-row">
                <i class='bx bx-edit-alt text-white status-success'></i></th>
                <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                <td>${element.news_creation}</td>
                <td>
                    <button class='btn btn-outline-primary'>
                    <i class='bx bx-edit-alt '></i>
                    </button>
                </td><tr>`);
            }else{
                if(element.news_active===1){
                    html=$(`<tr><th scope="row" class="bg-success text-success mx-auto th-row">
                    <i class='bx bx-check text-white status-success'></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <button class="btn btn-outline-success"><i class='bx bx-check'></i></button>
                    <button class="btn btn btn-outline-danger"><i class='bx bx-x-circle'></i></button>
                    </td></tr>`);
                }
                else{
                    html=$(`<tr><th scope="row" class="bg-danger text-danger mx-auto th-row">
                    <i class='bx bx-x-circle text-white status-success'></i></th>
                    <td id='title' data=${element.uuid_news}>${element.news_title}</td>
                    <td>${element.news_date}</td>
                    <td>
                    <button class="btn btn-outline-success"><i class='bx bx-check'></i></button>
                    <button class="btn btn btn-outline-danger"><i class='bx bx-x-circle'></i></button>
                    </td></tr>`);
                }
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
