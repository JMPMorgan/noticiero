$(()=>{
    

    $('.col-6').each((i,element)=>{
        let list=$(element).children();
        //console.log($(element).find('h6'));
        let new_Title= $(list[0]);
    });

    $('.thumbnail').each((i,element)=>{
        $(element).on('click',()=>{window.location='viewnews.html'});
    });

})
