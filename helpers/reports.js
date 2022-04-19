/*window.onload=()=>{$('#end-date').dateDropper({
    roundtrip: 'myTrip'
})};*/



$(async ()=>{
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/sections.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
        const sections=response.info;
        sections.forEach(element=>{
            const html=$(`<option value='${element.uuid_sections}'>${element.section_name}</option>`);
            $('#sections-reports').append(html);
            $('#sections-reports').change(()=>{selectedSections($('#sections-reports').children('option:selected'))});
        });
    }else{

    }
    $('#btn-search-reports').on('click',async()=>{
        const sections_selected=$('#container-sections-selected').children();
        const value_sections=[];
        const name_sections=[];
        sections_selected.each((index,element)=>{
            value_sections.push($(element).attr('data'));
            name_sections.push($(Element).text());
        });
        const start_date=$('#start-date').val();
        const end_date=$('#end-date').val();
        const date1=new Date(start_date);
        const date2=new Date(end_date);
        let response;
        if(date1<=date2){
            if(value_sections.length>0){
                //Esto quiere decir que selecciono secciones para reportes
                 response=await $.ajax({
                    method:'GET',
                    datatype:'JSON',
                    data:{
                        id:1,
                        secciones:value_sections,
                        start_date:start_date,
                        end_date:end_date
                    },
                    url:'../backend/reports.php'
                });
            }else{
                response=await $.ajax({
                    method:'GET',
                    datatype:'JSON',
                    data:{
                        id:2,
                        start_date:start_date,
                        end_date:end_date
                    },
                    url:'../backend/reports.php'

                });
            }

            console.log(response);
            response=JSON.parse(response);
            console.log(response);
            if(response.success===true){
                const comun=response.info.reporte_comun;
                const detalle=response.info.reporte_detalles;
                const secciones=response.info.reporte_secciones;
                $('#comun').children().remove();
                $('#detalle').children().remove();
                $('#secciones').children().remove();
                if(comun.length>0){
                    comun.forEach(element=>{
                        const html=`<tr>
                                        <th scope='row'>${element.likes}</th>
                                        <td>${element.news_title}</td>
                                        <td>${element.news_publication}</td>
                                        <td>${element.comments}</td>
                                    </tr>`;
                        $('#comun').append(html);
                    });
                }
                if(detalle.length>0){
                    detalle.forEach(element=>{
                        const html=`<tr>
                        <th scope='row'>${element.likes}</th>
                        <td>${element.news_title}</td>
                        <td>${element.news_publication}</td>
                        <td>${element.comments}</td>
                    </tr>`;
                    $('#detalle').append(html);
                    });
                }
                if(secciones.length>0){
                    secciones.forEach(element=>{
                        const html=`<tr>
                        <th scope='row'>${element.likes}</th>
                        <td>${element.section_name}</td>
                        <td>${element.date}</td>
                        <td>${element.comments}</td>
                    </tr>`;
                    $('#secciones').append(html);
                    });

                }
            }
        }else{
            Swal.fire({
                icon: 'warning',
                text: 'La fecha final es menor a la fecha de inicio',
            });
        }
    });
});

const selectedSections=(html)=>{
    const value=$(html).val();
    const name=$(html).text();
    const sections_selected=$('#container-sections-selected').children();
    let isSelected=false;
    if(value!==''){
        sections_selected.each((index,element)=>{
            if($(element).attr('data')!=='1'){
                if($(element).attr('data')===value){
                    isSelected=true;

                    return false;
                }
            }
            else{
                isSelected=true;
                return false;
            } 
        });
        if(isSelected===false){
            const html=$(`<span class='btn btn-primary mx-1' data='${value}'>${name}
            <i class="fa-solid fa-circle-xmark"></i></span>`);
            $(html).on('click',()=>{
                $(html).remove();
            });
            $('#container-sections-selected').append(html);
        }
    }
    //Obtieve los hijos de ese div que solo estan las secciones seleccionadas
    /*if(value!==''){
        if(sections_selected.length===0){//Primer seccion

            $('#container-sections-selected').append(html);
        }else{//+1 de una seccion
            console.log(sections_selected);
        }
    }*/
}