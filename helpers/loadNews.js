
import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
const KEYAPI='a08ab980938843789855fc7e05f161d3';
const APIGEO=`https://api.opencagedata.com/geocode/v1/json`;
const MAPBOXACCESSTOKEN = 'pk.eyJ1Ijoiam9uYXRoYW5tb3JnYW5wIiwiYSI6ImNreXVlMzBqZzFtbWkyb3BtM3VtdnJ1NmwifQ.FbfKr4KSPmE5gVCt815oqw';
let map='';
let layerGroup,lat_map,lng_map,country,city,place;
$(async () => {
    const id = getParameterByName('id');
    if (id.length > 0) {
        let response = await $.ajax({
            method: 'GET',
            datatype: 'JSON',
            data: { id: id },
            url: '../backend/loadNewsView.php'
        });
        response = JSON.parse(response);
        console.log(response);
        if (response.success === true) {
            const status = response.info.news_info.news_status;
            if (status === 0) {

            } else if (status === 1) {
                $('#container-all-comments').children().css('display', 'none');
                $('#container-all-news-suggested').css('display', 'none');
                $('#sections-popular').children().css('display', 'none');
                //$('#sections-popular').prev().css('display', 'none');
                $('#description').css('display','none');
                $('#likes-container').children().css('display','none');
                const news = response.info.news_info;
                const keywords = response.info.keywords_info;
                const sections = response.info.sections_info;
                const multimedia = response.info.multimedia_info;
                const user=response.info.user_info;
                let i = 1;
                if(multimedia.length>0){
                    multimedia.forEach(element => {
                        let html_image;
                        let html;
                        if(element.type_archive==='.mp4'){
                            html=$(`<div class='col-image d-flex justify-content-center s4'>
                                        <video class='demo opacity-image hover-opacity-off' style='width:45%;cursor:pointer'
                                        onclick='currentDiv(${i})'>
                                            <source src='data:video/mp4;base64,${element.archive}'/>
                                        </video>
                                    </div>`);
                        
                            html_image=$(`<video class='mySlides mx-auto' style='width:35%;${i===1? '':'display:none'}' controls>
                                            <source src='data:video/mp4;base64,${element.archive}'/>
                                         </video>`);
                        }else{
                            html = $(`<div class='col-image d-flex justify-content-center s4'>
                            <img class='demo opcacity-image hover-opacity-off' src='data:image/jpg;base64,${element.archive}'
                            style='width:25%;cursor:pointer' onclick='currentDiv(${i})'>
                             </div>`);
                            html_image = $(`<img class='mySlides mx-auto' src='data:image/jpg;base64,${element.archive}' style='width:25%;${i===1? '':'display:none'}'>`);
                        }
                        $('#container-imgs').append(html);
                        $('#container-imgs').before(html_image);
                        i++;
                    });
                }
                if(sections.length>0){
                    sections.forEach(element=>{
                        const html=$(`<a class='btn btn-sm btn-outline-primary my-1' href=index?id='${element.uuid_sections}'>${element.section_name}</a>`);
                        $('#sections-news').append(html);
                    });
                }
                if(keywords.length>0){
                    $('#sections-popular').prev().text('Keywords Selections');
                    keywords.forEach(element=>{
                        const html=`<a class='btn btn-sm btn-outline-primary my-1'>${element.word_keywords}</a>`;
                        $('#sections-popular').append(html);
                    });
                }
                $('#titulo-noticia').text(news.news_title);
                $('#nombre-reportero').text(`${user.user_name} ${user.user_lastname}`);
                $('#nombre-reportero').attr('data',news.uuid_user);
                $('#text-noticia').html(news.news_text);
                $('#news-date').text(news.news_date);
                editSection();

            } else if (status === 2) {

            } else if (status === 3) {
                const news = response.info.news_info;
                const keywords = response.info.keywords_info;
                const sections = response.info.sections_info;
                const multimedia = response.info.multimedia_info;
                const user=response.info.user_info;
                const location=response.info.location_info;
                let i = 1;
                if(multimedia.length>0){
                    multimedia.forEach(element => {
                        let html_image;
                        let html;
                        if(element.type_archive==='.mp4'){
                            html=$(`<div class='col-image d-flex justify-content-center s4'>
                                        <video class='demo opacity-image hover-opacity-off' style='width:45%;cursor:pointer'
                                        onclick='currentDiv(${i})'>
                                            <source src='data:video/mp4;base64,${element.archive}'/>
                                        </video>
                                    </div>`);
                        
                            html_image=$(`<video class='mySlides mx-auto' style='width:35%;${i===1? '':'display:none'}' controls>
                                            <source src='data:video/mp4;base64,${element.archive}'/>
                                         </video>`);
                        }else{
                            html = $(`<div class='col-image d-flex justify-content-center s4'>
                            <img class='demo opcacity-image hover-opacity-off' src='data:image/jpg;base64,${element.archive}'
                            style='width:25%;cursor:pointer' onclick='currentDiv(${i})'>
                             </div>`);
                            html_image = $(`<img class='mySlides mx-auto' src='data:image/jpg;base64,${element.archive}' style='width:25%;${i===1? '':'display:none'}'>`);
                        }
                        $('#container-imgs').append(html);
                        $('#container-imgs').before(html_image);
                        i++;
                    });
                }
                if(sections.length>0){
                    sections.forEach(element=>{
                        const html=$(`<a class='btn btn-sm btn-outline-primary my-1' href='index.html?id=${element.uuid_sections}'>${element.section_name}</a>`);
                        $('#sections-news').append(html);
                    });
                }
                map= L.map('map-mini',{center:[location.lat, location.lng],zoom: 20 });
                addToMapMain(map,location.lat,location.lng);
                $('#location-data').text(`${location.city}, ${location.country}`);
                $('#titulo-noticia').text(news.news_title);
                $('#nombre-reportero').text(`${user.user_name} ${user.user_lastname}`);
                $('#nombre-reportero').attr('data',news.uuid_user);
                $('#text-noticia').html(news.news_text);
                $('#news-date').text(news.news_date);
                $('#date-publication').text(news.news_publication);
                $('#description').text(news.news_description);
                //editSection();
            }
        }
    }
});

const editSection=()=>{
    const comments=$(`<textarea id='comments-editor' placeholder='Cambios a realizar en la noticia...' class='form-control my-2' rows=5></textarea>`);
    $('#map').css('display','block');
    map= L.map('map').setView([25.6802019, -100.315258], 13);
    addToMap(map);
    const html=$(`<div class='row'>
                    <div class='col-6'>
                        <label><b>Pais donde ocurrio la noticia</b></label>
                        <input type='text' id='country-map' class='form-control'/>
                    </div>
                    <div class='col-6'>
                        <label><b>Ciudad donde ocurrio la noticia</b></label>
                        <input type='text' id='city-map' class='form-control'/>
                    </div>
                    <div class='col-12 d-flex justify-content-end'>
                        <button class='btn btn-outline-primary my-2 ' id='btn-search-map'>Buscar</button>
                    </div>
                </div>`);
    const btn_search_btn=$(html).find('#btn-search-map');
    btn_search_btn.on('click',()=>searchDirection());
    $('#container-map').append(html);
    const approve =$(`<button class='btn btn-outline-success'>Aprobar</button>`);
    $(approve).on('click',async()=>{
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: '',
            inputPlaceholder: 'Ingrese la descripcion de la noticia...',
            inputAttributes: {
              'aria-label': 'Ingrese la descripcion de la noticia'
            },
            showCancelButton: true
          });
          if (text && lat_map!=undefined && lng_map!= undefined && city != undefined && country != undefined) {
            const n = getParameterByName('id');
            const uuid=$('#nombre-reportero').attr('data');
            let response= await $.ajax({
                method:'POST',
                datatype:'JSON',
                data:{
                    lat_map,
                    lng_map,
                    city,
                    country,
                    messages:text,
                    uuid:uuid,
                    n:n,
                    id:'cnNmUmFVaVhlMDZiVnUrbzRVMXRlQT09'
                },
                url:'../backend/messages.php'
            });
            console.log(response);
          }
    });
    const reject=$(`<button class='btn btn-outline-danger mr-2'>Rechazar</button>`);

    $(reject).on('click',async ()=>{
        const comment=$('#comments-editor').val();
        if(comment.length>0){
            const n = getParameterByName('id');
            const uuid=$('#nombre-reportero').attr('data');
            let response=await $.ajax({
                method:'POST',
                datatype:'JSON',
                data:{
                    messages:comment,
                    uuid:uuid,
                    n:n,
                    id:'Y2xPQ256QzQ4K3crcENmUXFGR3Jxdz09'
                },
                url:'../backend/messages.php'
            });
            console.log(response);
        }else{
            Swal.fire({
                icon: 'warning',
                text: 'Debe escribir un comentario en el area de comentarios',
            });
        }
    });
    $('#container-all-comments').append('<h4>Cambios a realizar de la noticia</h4>');
    $('#container-all-comments').append(comments);
    $('#likes-container').append(reject);
    $('#likes-container').append(approve);
}

const addToMap=(map)=>{

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
    {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAPBOXACCESSTOKEN
    }).addTo(map);
   layerGroup=L.layerGroup().addTo(map);
    map.on('click',(event)=>{
        layerGroup.clearLayers();
        map.closePopup();
        lat_map = event.latlng.lat;
        lng_map= event.latlng.lng;
        const marker = L.marker([lat_map,lng_map]).addTo(map);
        marker.addTo(layerGroup);
    });
}

const addToMapMain=(map,lat,lng)=>{
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
    {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAPBOXACCESSTOKEN
    }).addTo(map);
    layerGroup=L.layerGroup().addTo(map);
    const marker = L.marker([lat,lng]).addTo(map);
    marker.addTo(layerGroup);
}


const searchDirection=async()=>{
     country =$('#country-map').val();
    city=$('#city-map').val();
    place=`${country}, ${city}`;
    
    const response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        data:{
            'key':KEYAPI,
            'no_annotations':1,
            'language':'es',
            'query':place   

        },
        url:APIGEO
    });
    console.log(response);
    if(response.results.length>0){
        Swal.fire(
            'Mapa',
            'Para mayor precision por favor presione en el mapa la localizacion exacta',
            'info'
        );
        const result=response.results[0];
        map.remove();
        map= L.map('map').setView([result.geometry.lat,result.geometry.lng], 13);
        addToMap(map);
    }
    //return response;
}