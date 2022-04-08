$.ajax({
    type:'POST',
    url:'../backend/dataReporters.php',
    datatype:'JSON',
    success:(response)=>{
        response=JSON.parse(response);
        let html='';
        if(response.success===true && response.error.length===0){
            response.info.forEach(element => {
                html+="<div class='row list-group-item-action'>"+
                        "<div class='col-6'>"+
                            "<h3>"+element.user_name+" "+element.user_lastname+"</h3>"+
                        "</div>"+
                        "<div class='col-3'>"+
                            "<h3>"+element.user_nick+"</h3>"+
                        "</div>"+     
                        "<div class='col-3'>"+
                            "<h3>"+
                                "<i class='bx bx-edit-alt btn btn-outline-primary' id='btn-edit' onclick=editReporter('"+element.user_uuid+"')></i>"+
                                "<i class='bx bx-trash btn btn-outline-danger mx-2' id='btn-delete' onclick=deleteReporter('"+element.user_uuid+"')></i>"+
                                "<i class='bx bx-detail btn btn-outline-primary' id='btn-detail' onclick=detailReporter('"+element.user_uuid+"')></i>"+
                            "</h3>"+
                        "</div>"+
                      "</div>";
                
            });
            $('#container-reporters').append(html);
        }
        else{

        }
    }
});

const editReporter=(n)=>{
    window.location=`edprofileadmin.html?id=${n}&status=1`;
}

const deleteReporter=(n)=>{
    Swal.fire({
        title: 'Desea Eliminar a este reportero?',
        text: "Se enviara un mensaje de confirmacion hacia el reportero",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: '<i class="fa-solid fa-check"></i> Ok!'
      }).then(async (result) => {
        if (result.isConfirmed) {
            let response= await $.ajax({
                method:'GET',
                url:'../backend/messages.php',
                data:{
                    n,
                    id:'Y2pUeFBBLzgxWFloRm5Mam9FVVd2QT09'
                },
                datatype:'JSON'
            });
            console.log(response);
            Swal.fire({
            title:'Deleted!',
            text:'Your file has been deleted.',
            icon:'success',
            confirmButtonColor:'#28a745'
          });
        }
      })
}
const detailReporter=(n)=>{
    window.location=`edprofileadmin.html?id=${n}&status=2`;
}