$(async()=>{
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getSectionsKeywords.php'
    });
    response=JSON.parse(response);
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
        const html=$(`<span data='${section_value}' class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>${section_name} <i class="fa-solid fa-circle-xmark"></i><span>`);
        $(html).on('click',()=>{$(html).remove();})
                $('#container-sections').append(html);
    }

}