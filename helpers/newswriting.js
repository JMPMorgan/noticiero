const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });



  import {getParameterByName} from '../helpers/auxiliar/auxiliarMethods.js';

  let editor;
  let data_d=[],data_s=[];
    
$(async ()=>{
 const data=getParameterByName('id');
 if(data.length>0){
    let response=await $.ajax({
        method:'GET',
        url:'../backend/getNews.php',
        datatype:'JSON',
        data:{
            id:data
        }
    });
    response=JSON.parse(response);
    console.log(response);
    $('#title').val(response.info.news_title);
    const data_archivos=response.info.archive_info;
    const sections=response.info.sections_info;
    sections.forEach(element=>{ 
        const html=$(`<span id='sections-load' data='${element.uuid_sections}'
        class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>
        ${element.section_name} <i class="fa-solid fa-circle-xmark"></span>`);
        $('#container-sections').append(html);
        $(html).on('click',()=>{eliminarSecciones(html)});
        
    });
    let id_archive=1;
    data_archivos.forEach(element=>{
       
        if(element.type_archive==='.mp4'){//Es un video
            const button_cancel=$(`<span class='d-flex justify-content-center btn btn-outline-danger'>Eliminar Archivo <i class='bx bx-x '></i></span>`);
            $(`#archive-${id_archive}`).children().css('display','none');
            const html=$(`<video class='archives-edit' src='data:video/mp4;base64,${element.archive}' type='video/mp4' data=${element.uuid} controls>${element.name}</video>`);
            $(`#archive-${id_archive}`).append(html);
            $(`#archive-${id_archive}`).append(button_cancel);
            const id_archivo=id_archive;
            $(button_cancel).on('click',()=>{eliminarArchivo(html,button_cancel,id_archivo)});
            
        }
        else{
            const button_cancel=$(`<span class='d-flex justify-content-center btn btn-outline-danger'>Eliminar Archivo <i class='bx bx-x '></i></span>`);
            $(`#archive-${id_archive}`).children().css('display','none');
            const html=$(`<img class='archives-edit' src='data:image/jpg;base64,${element.archive}' data=${element.uuid}>`);
            $(`#archive-${id_archive}`).append(html);
            $(`#archive-${id_archive}`).append(button_cancel);
            const id_archivo=id_archive;
            $(button_cancel).on('click',()=>{eliminarArchivo(html,button_cancel,id_archivo)});
        }
        
        id_archive++;
    });
    $('#news-hidden').text(response.info.news_text);
    $('#news-hidden').attr('data',true);
    editor.setData(response.info.news_text);
 }
});


window.onload=()=>{

    //ESTO SE QUITA PARA DESPUES DEL SEGUNDO AVANCE
    let uuid='';
    //ESTO SE QUITA PARA DESPUES DEL SEGUNDO AVANCE
    ClassicEditor.create(document.querySelector('#writer-news'),{
            toolbar:['bold', 'italic', 'link','blockQuote','numberedList',  'bulletedList','|', 'undo', 'redo']
        })
        .then(newEditor=>{editor=newEditor;})
        .catch(error => {
            console.log(error);
        });

    $('#news-hidden').change(()=>{
        console.log('GOla');
    });
    $('#btn-save').on('click',async ()=>{
        /*
        Aqui se dirije si es insert o update
        */
        
        const valor = editor.getData();
        const title=$('#title').val().length>0?$('#title').val():'';
        const sectiones=$('#container-sections').children('#sections-unload');
        const sectiones_selected=[];
        let existSections=false;
        $(sectiones).each((index,element)=>{
            sectiones_selected.push($(element).attr('data'));
            existSections=true;
        });
        const sectiones_novalue=$('#container-sections').children('#sections-load');
        if(sectiones_novalue.length>0){
            existSections=true;
        }
        if(valor.length>0&&existSections===true && title.length>0){
            const data=new FormData();
            data.append('archive',[]);
            if($('#file1')[0].files.length>0){
                data.append('archive1',$('#file1')[0].files[0]);
            }
            if($('#file2')[0].files.length>0){
                data.append('archive2',$('#file2')[0].files[0]);
            }
            if($('#file3')[0].files.length>0){
                data.append('archive3',$('#file3')[0].files[0]);
            }
            if($('#file4')[0].files.length>0){
                data.append('archive4',$('#file4')[0].files[0]);
            }
            if($('#file5')[0].files.length>0){
                data.append('archive5',$('#file5')[0].files[0]);
            }
            data.append('title',title);
            data.append('sectiones',sectiones_selected);
            data.append('editor',valor);
            const id=getParameterByName('id');
            if(id.length>0){
                data.append('id',id);
                data.append('archivos_delete',data_d);
                data.append('sections_delete',data_s);
            }
            let response= await fetch('../backend/saveNews.php',{
                method:'POST',
                body:data
            }).then(r=>r.text());
            response=JSON.parse(response);
            if(response.success==true){
                //window.location='news-reporter.html';
                
               
            }
            else{
                printErrors(response.error);
            }
        } 
        else{
            const error=['El titulo, el texto y las secciones no deben estar vacias'];
            printErrors(error);
        }
    });
    $('#btn-send').on('click',async ()=>{
        const id='QS9OUG9GRXNGNHhyMWhScnFIbHNKdz09';
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                n:uuid,
                id
            },
            url:'../backend/messages.php'
        });
        console.log(response);
    });
    
}
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

const eliminarArchivo=(archive,button_cancel,id)=>{
    /*
    eliminar los archivos guardados al momento de editar una noticia ya creada
    */
    data_d.push(Number($(archive).attr('data')));
    console.log(id);
    $(button_cancel).remove();
    $(archive).remove();
    $(`#archive-${id}`).children().css('display','flex');
}

const eliminarSecciones=(html)=>{
    /*
    elimina las secciones guardadas al momento de editar la noticia ya creada
    */
   console.log(html);
   data_s.push($(html).attr('data'));
   $(html).remove();
   console.log(data_s);
}