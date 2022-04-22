import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
$(async()=>{
    const id=getParameterByName('id');
    if(id.length>0){
        let response=await $.ajax({
            method:'GET',
            datatype:'JSON',
            data:{
                id:id
            },
            url:'../backend/loadindex.php'
        });
        response=JSON.parse(response);
        console.log(response);
        if(response.success===true){
            const news=response.info.news;
            const sections_main=response.sections_main;
            let news_html='';
            if(news.length>0){
                news.forEach(element=>{
                    news_html+=`<div class='col-3'>
                    <div class='thumbanil'>
                        <a href='viewnews.html?id=${element.uuid_news}'>
                        <h5 class='news-title'>${element.news_title}</h5>
                        <img src='data:image/jpg;base64,${element.archive}'
                        class="news-photos news-half"/>
                        <div class='caption'>
                            <p class='news-content'${element.news_description}></p>
                        </div>
                        </a>
                    </div>
                </div>`;
                });
            }else{
                news_html=`<h1 class='d-flex justify-content-center text-justify text-muted'>No existe ninguna noticia relacionada a esta secccion<h1>`
            }

            const html=$(`<div class='row my-1'>
            <div class='col-12 text-jutify d-flex card mx-auto'
            onmouseover='this.style.borderBottom="2px solid ${response.info.sections_color}"'
            onmouseleave='this.style.borderBottom="none"'>
                <p class='text-justify h1 mx-auto'>
                    ${response.info.section_name}
                </p>
                </div>
                ${news_html}
                </div>`);
            $('#main-news').append(html);
            sections_main.forEach(element=>{
                const html=$(`<li class='nav-item active mx-2' 
                                onmouseover='this.style.borderBottom="2px solid ${element.sections_color}"'
                                onmouseleave="this.style.borderBottom='none'">
                                    <h6 class='mx-2' ><a class='main-a' href='index.html?id=${element.uuid_sections}'>${element.section_name}</a></h2>
                             </li>`);
                $('#sections-main').append(html);
            });
        }else{

        }
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
           const breaking_news=response.breaking_news;
           const news_visited=response.news_visited;
           if(news_visited.length>0){
               const html=`<div class='my-2' style="text-align: center;"><h4 class='mx-auto'>Most visited news<h4></div>`;
               $('#news_visited').append(html);
               news_visited.forEach(element=>{
                const news_visited_html=`<div  class='news-suggested d-flex'>
                <a href='viewnews.html?id=${element.uuid_news}' style="margin-left: 20%;">
                <h6>${element.news_title}</h6>
                <img class="news-more-visited mx-auto" src="data:image/jpg;base64,${element.archive}">
                </a>
                 </div>`
                 $('#news_visited').append(news_visited_html);
               });

               
           }
           if(breaking_news.length>0){
               let brekings_html='';
               breaking_news.forEach(element=>{
                if(element.news_title.length>20){
                    element.news_title=element.news_title.slice(0,20);
                    element.news_title+='...';
                }
                brekings_html+=`<div class='col-3'>
                                <div class='thumbanil'>
                                    <a href='viewnews.html?id=${element.uuid_news}'>
                                    <h5 class='news-title'>${element.news_title}</h5>
                                    <img src='data:image/jpg;base64,${element.archive}'
                                    class="news-photos news-half"/>
                                    <div class='caption'>
                                        <p class='news-content'${element.news_description}></p>
                                    </div>
                                    </a>
                                </div>
                            </div>`;
               });
               const html=`<div class='row my-1'>
                            <div class='col-12 text-justify d-flex card mx-auto'>
                                <p class='text-justify h1 mx-auto'>
                                    Breaking News
                                </p>
                            </div>
                            ${brekings_html}
                          </div>`;
                $('#main-news').append(html);
           }
           console.log(sections_main);
           sections.forEach(element=>{
            const news=element.news;
            let news_html='';
            news.forEach(ele=>{
                if(ele.news_title.length>20){
                    ele.news_title=ele.news_title.slice(0,20);
                    ele.news_title+='...';
                }
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
                                <h6 class='mx-2' ><a class='main-a' href='index.html?id=${element.uuid_sections}'>${element.section_name}</a></h2>
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
