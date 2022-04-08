
import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
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
                $('#container-all-comments').css('display', 'none');
                $('#container-all-news-suggested').css('display', 'none');
                $('#sections-popular').css('display', 'none');
                $('#sections-popular').prev().css('display', 'none');
                const news = response.info.news_info;
                const keywords = response.info.keywords_info;
                const sections = response.info.sections_info;
                const multimedia = response.info.multimedia_info;
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
                        const html=$(`<a class='btn btn-sm btn-outline-primary my-1' href='${element.uuid_sections}'>${element.section_name}</a>`);
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
                $('#nombre-reportero').text(news.uuid_user);
                $('#text-noticia').html(news.news_text);

            } else if (status === 2) {

            } else if (status === 3) {

            }
        }
    }
})