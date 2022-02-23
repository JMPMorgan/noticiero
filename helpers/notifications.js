$(()=>{
    $('#news-expired').on('click',()=>{
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
            '<span class="text-muted mr-4">NOMBRE DEL REPORTERO</span>'+
            '<span class="text-muted">FECHA DE CREACION:18/02/2022</span>'+
        '</div>'+
    '</div>';
        $('#news-expired').after(html);
    });
})  

