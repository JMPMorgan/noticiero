$(()=>{
    $('#news-modification').on('click',()=>{
        let html='<div class="row" id="noticia">'+
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
        '</div>'+
        '<div class="col-4">'+
            '<h5 class="text-muted"><b>Mensaje del Administrador</b></h5>'+
        '</div>'+
        '<div class="col-8">'+
            '<p clas="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tristique erat erat, malesuada dictum ligula tempus'+
            'porttitor. Aliquam volutpat, diam in tempor vestibulum, nulla augue venenatis justo, at fringilla arcu enim ac'+
            'lacus. Morbi a arcu id velit laoreet vehicula id vitae nisl. Nunc ac ornare velit</p>'+
        '</div>'+
    '</div>';
        $('#news-modification').after(html);
    })
})