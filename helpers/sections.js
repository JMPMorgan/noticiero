$(()=>{

    $('#btn-addsections').on('click',()=>{
        let html='<div class="col-12">'+
                '<div class="card mx-auto" style="width:450px;">'+
                    '<div class="container ">'+
                    '<div class="form-group">'+
                         '<div class="row">'+
                             '<div class="col">'+
                                '<label for="">Name Section</label>'+
                                '<input id="section" class="form-control" type="text"/>'+
                            '</div>'+
                            '<div class="col">'+
                                 '<label for="">Color Section</label>'+
                                '<input id="color" class="form-control" type="color"/>'+
                            '</div>'+
                            '<div class="col">'+
                                '<label>Importance</label>'+
                                '<select id="importance" class="form-control">'+
                                    '<option value="" Selected>Chose...</option>'+
                                    '<option value="80">Media-Alta</option>'+
                                    '<option value="50">Media</option>'+
                                    '<option value="25">Poca</option>'+
                                    '<option value="10">Minima</option>'+
                              '</select>'+
                            '</div>'+
                         '</div>'+
                '<div class="d-flex mt-2 justify-content-end">'+
                    '<button id="btn-save" class=" btn btn-primary mt-2">Save Section</button>' +
                 '</div>'+
                 '</div>'+
            '</div>'+
            '</div>'+
    '</div>';

    html=$(html);
    html=html[0];
    $('#container-add').append(html);
    const btn_save=$(html).find('#btn-save')[0];
    $(btn_save).on('click',()=>{saveSection(html)});
       // window.location='sectionsadd.html';
    });    
    $('#btn-addkeywords').on('click',()=>{ 
        let html = " <div class='col-12'>" +
            "<div class='card mx-auto' style='width:450px'>" +
            "<div class='container'>" +
            "<div class='form-group'>" +
            "<label>Keyword</label>" +
            "<input id='keyword' class='form-control' type='text'/>" +
            "</div>" +
            "<div class='d-flex mt-2 justify-content-end'>" +
            "<button id='btn-save-keyword' class='btn btn-primary mt-2'>Save Keyword</button>" +
            "</div>" +
            "</div> " +
            "</div>" +
            "</div>";
        html=$(html);
        html=html[0];  
        $('#container-addkey').append(html);
        const btn_save=$(html).find('#btn-save-keyword')[0];
        $(btn_save).on('click',()=>{saveKeyword(html)});
    });

});

const saveSection=async(html)=>{ 
    const color = $(html).find('#color')[0];
    const section = $(html).find('#section')[0];
    const importance=$(html).find('#importance')[0];
    const errors=[];
    if($(color).val()===undefined||$(color).val().length<=0){
        errors.push('Debe rellenar un valor del color');
    }
    if($(section).val()===''||$(section).val().length<=0 || $(section).val()===undefined){
        errors.push('Debe rellenar con palabras el nombre de la seccion');
    }
    if($(importance).val()===''){
        errors.push('Debe Seleccionar un nivel de importancia');
    }
    if(errors.length>0){
        printErrors(errors);
    }
    else{
        const color_valor = $(color).val();
        const section_valor=$(section).val();
        const importance_valor=$(importance).val();
        console.log(importance_valor);
        let response = await $.ajax({
            method:'POST',
            data:{
                color_valor,
                section_valor,
                importance_valor
            },
            datatype:'JSON',
            url:'../backend/insertsections.php' 
        });
        response=JSON.parse(response);
        if(response.success){
            location.reload();
        }else{
            printErrors(response.error);
        }
    }
}

const saveKeyword=async(html)=>{
    const keyword=$(html).find('#keyword')[0];
    const errors=[];
    if($(keyword).val()==='' || $(keyword).val().length<=0|| $(keyword).val()===undefined){
        errors.push('Debe rellenar con palabras el nombre de la palabra clave');
    }
    if(errors.length>0){
        printErrors(errors);    
    }
    else{
        const keyword_valor= $(keyword).val();
        let response = await $.ajax({
            method:'POST',
            data:{
                keyword_valor
            },
            datatype:'JSON',
            url:'../backend/insertkeyword.php'
        })
        response=JSON.parse(response);
        console.log(response);
    }
    
}

