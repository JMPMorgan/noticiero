import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
$(async()=>{
    const id=getParameterByName('id');
    if(id.length>0){
        /*
        Esto quiere decir que se busca una seccion
        */
    }else{
        /*
        Va a cargar todas las noticas por secciones
        */
       let response= await $.ajax({
           method:'GET',
           datatype:'JSON',
           url:'../backend/loadindex.php'
       });
       response=JSON.parse(response);
       console.log(response);
       if(response.success===true){
           const sections=response.info;
           const sections_main=response.sections_main;
           console.log(sections_main);
           sections.forEach(element=>{
            const news=element.news;
            let news_html='';
            news.forEach(ele=>{
                news_html+=`<div class='col-3'>
                                <div class='thumbanil'>
                                    <a href='viewnews.html?id=${ele.uuid_news}'>
                                    <h5 class='news-title'>${ele.news_title}</h5>
                                    <img src='data:image/jpg;base64,${ele.archive}'
                                    class="news-photos news-half"/>
                                    <div class='caption'>
                                        <p class='news-content'${ele.news_description}></p>
                                    </div>
                                    </a>
                                </div>
                            </div>`;
                });
            const html=$(`<div class='row my-1'>
                            <div class='col-12 text-jutify d-flex card mx-auto'>
                                <p class='text-justify h1 mx-auto'>
                                    ${element.section_name}
                                </p>
                            </div>
                            ${news_html}
                          </div>`);
            $('#main-news').append(html);
           });
           sections_main.forEach(element=>{
            const html=$(`<li class='nav-item active mx-2' 
                            onmouseover='this.style.borderBottom="2px solid ${element.sections_color}"'
                            onmouseleave="this.style.borderBottom='none'">
                                <h6 class='mx-2' ><a class='main-a' href='${element.uuid_sections}'>${element.section_name}</a></h2>
                         </li>`);
            $('#sections-main').append(html);
           });

       }
    }

    $('.col-6').each((i,element)=>{
        let list=$(element).children();
        //console.log($(element).find('h6'));
        let new_Title= $(list[0]);
    });

    $('.thumbnail').each((i,element)=>{
        $(element).on('click',()=>{window.location='viewnews.html'});
    });

})
