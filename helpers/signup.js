$(()=>{
    if($('#preview').attr('src')===null || $('#preview').attr('src')===''){
        $('#preview').css('display','none');
    }
    $('.browse').on("click", ()=> {
        var file = $(this).parents().find(".file");
        file.trigger("click");
      });
      $('input[type="file"]').change(function(e) {
        var fileName = e.target.files[0].name;
        $("#file").val(fileName);
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("preview").src = e.target.result;
        };
        $('#preview').css('display','flex');
        $('#preview').addClass('d-flex mx-auto justify-content-center');
        reader.readAsDataURL(this.files[0]);
      });
      $('#btn-back').on('click',()=>{
        $(location).attr('href','../index.html');
      });
})