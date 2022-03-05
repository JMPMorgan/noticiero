$(()=>{
    $('#btn-addsections').on('click',()=>{
        let html='<div class="col-12">'+
                '<div class="card mx-auto" style="width:450px;">'+
                    '<div class="container ">'+
                    '<div class="form-group">'+
                         '<div class="row">'+
                             '<div class="col">'+
                                '<label for="">Name Section</label>'+
                                '<input class="form-control" type="text"/>'+
                            '</div>'+
                            '<div class="col">'+
                                 '<label for="">Color Section</label>'+
                                '<input class="form-control" type="color"/>'+
                            '</div>'+
                         '</div>'+
                '<div class="d-flex mt-2 justify-content-end">'+
                    '<button class=" btn btn-primary mt-2">Save Section</button>' +
                 '</div>'+
                 '</div>'+
            '</div>'+
            '</div>'+
    '</div>';

    $('#container-add').append(html);
       // window.location='sectionsadd.html';
    })    
    $('#btn-addkeywords').on('click',()=>{ 
        let html = " <div class='col-12'>" +
            "<div class='card mx-auto' style='width:450px'>" +
            "<div class='container'>" +
            "<div class='form-group'>" +
            "<label>Keyword</label>" +
            "<input class='form-control' type='text'/>" +
            "</div>" +
            "<div class='d-flex mt-2 justify-content-end'>" +
            "<button class='btn btn-primary mt-2'>Save Keyword</button>" +
            "</div>" +
            "</div> " +
            "</div>" +
            "</div>";
        $('#container-addkey').append(html);
    })

})
