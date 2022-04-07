$(async()=>{
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getSectionsKeywords.php'
    });
    response=JSON.parse(response);
    console.log(response);
    const sections=response.sections[0];
    
    sections.forEach(element => {
        const html=$(`<option value=${element.uuid_sections}>${element.section_name}</option>`);
        
        $('#inputGroupSelect01').append(html);
        $(html).on('click',()=>{
            selectedSections($(html).text(),$(html).val());
        });
    });

    $('#inputGroupSelect01').change(()=>{
        if($('#inputGroupSelect1').val()!=0){
            selectedSections($('#inputGroupSelect01').children('option:selected').text(),$('#inputGroupSelect01').val());
        }
    });

    $('#keyword-search').keyup(async ()=>{
        const data= $('#keyword-search').val();
        let response=await $.ajax({
            method:'GET',
            datatype:'JSON',
            data:{
                data:data
            },
            url:'../backend/getKeywordsForNews.php'
        });
        response=JSON.parse(response);
        if(response.success===true){
            $('#container-searchkeyword').children().remove();
            response.info.forEach(element=>{
                const html=$(`<li class='form-control btn btn-outline-primary d-flex flex-column' data='${element.uuid_keywords}'>${element.word_keywords}</li>`);
                $('#container-searchkeyword').append(html);
                $(html).on('click',()=>{putOnContainerKeywords(html)});
            });
        }
        if($('#keyword-search').val().length===0){
            $('#container-searchkeyword').children().remove();
        }
    });
    
});


const selectedSections=(section_name,section_value )=>{ 
    /*
    OBTIENE EL VALOR Y EL TEXTO DE LOS SELECT SELECCIONADOS PARA DESPUES PONERLOS EN 
    LA PAGINA DEBAJO PARA QUE SEA MAS FACIL DE VER
    */
    
    const sections_selected=$('#container-sections').children();    
    let  isSelected=false;

        sections_selected.each((index,element)=>{
            if($(element).attr('data')===section_value){
                isSelected=true;
                return false;
            }
        });
    if(isSelected===false){
        const html=$(`<span id='sections-unload' data='${section_value}' class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>${section_name} <i class="fa-solid fa-circle-xmark"></i><span>`);
        $(html).on('click',()=>{$(html).remove();})
                $('#container-sections').append(html);
    }

}

const putOnContainerKeywords=(html)=>{
    const uuid=$(html).attr('data');
    const text= $(html).text();
    const html_new=$(`<span data='${uuid}'class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>${text} <i class="fa-solid fa-circle-xmark"></i><span>`);
    const array_keywords=$('#container-keywords-selected').children();
    console.log(array_keywords);
    let  isSelected=false;
    array_keywords.each((index,element)=>{
        if($(element).attr('data')===uuid){
            isSelected=true;
            return false;
        }
    });
    if(isSelected===false){
        $(html_new).on('click',()=>$(html_new).remove());
        $('#container-keywords-selected').append(html_new);
    }
    
}