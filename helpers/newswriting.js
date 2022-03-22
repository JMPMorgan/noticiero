const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

window.onload=()=>{
    let editor;
    ClassicEditor.create(document.querySelector('#writer-news'),{
            toolbar:['bold', 'italic', 'link','blockQuote','numberedList',  'bulletedList','|', 'undo', 'redo']
        })
        .then(newEditor=>{editor=newEditor;})
        .catch(error => {
            console.log(error);
        });

    
    $('#btn-save').on('click',async ()=>{

        const valor = editor.getData();
        const title=$('#title').val().length>0?$('#title').val():'';
        const sectiones=$('#container-sections').children();
        const sectiones_selected=[];
        $(sectiones).each((index,element)=>{
            sectiones_selected.push($(element).attr('data'));
        });
        if(valor.length>0&&sectiones.length>0 && title.length>0){
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
            let response= await fetch('../backend/saveNews.php',{
                method:'POST',
                body:data
            }).then(r=>r.text());
            response=JSON.parse(response);
            if(response.success==true){
                window.location='news-reporter.html';
            }
            else{
                printErrors(response.error);
            }
        } 
        else{

        }
    })
    
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
