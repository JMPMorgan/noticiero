import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
$(async()=>{
    const title=getParameterByName('title');
    if(title.length>0){
        let response= await $.ajax({
            method:'GET',
            datatype:'JSON',
            data:{
                title:title,
                id:0
            },
            url:'../backend/searchnews.php'
        });
        response=JSON.parse(response);
        console.log(response);
        if(response.success===true){
            //const news=response.info;
            showNews(response.info);
        }else{
            $('#container-noticias').children().remove();
            const html=`<h2 class='text-justify'>No se encontro ninguna noticia con estos resultados<h2>`;
            $('#container-noticias').append(html);
        }
    }
    $('#btn-advanced').on('click',async()=>{
        const title=$('#title').val();
        const start_date=$('#start-date').val();
        const end_date=$('#end-date').val();
        const description=$('#description').val();
        const keywords=[];
        $('#container-keywords-selected').children('#keywords-unload').each((index,element)=>{
            keywords.push($(element).text());

        });
        console.log(Date(start_date));
        console.log(Date(end_date))
        const date_end=new Date(end_date);
        const date_start=new Date(start_date); 
        console.log(date_end,date_start);
        if(date_start<=date_end){
        let response=await $.ajax({
            method:'GET',
            datatype:'JSON',
            data:{
                title,
                start_date,
                end_date,
                description,
                keywords,
                id:1
            },  
                url:'../backend/searchnews.php'
            });
            response=JSON.parse(response);
            console.log(response);
            if(response.success===true){
                showNews(response.info);
            }else{
                $('#container-noticias').children().remove();
                const html=`<h2 class='text-justify'>No se encontro ninguna noticia con estos resultados<h2>`;
                $('#container-noticias').append(html);
            }
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

const putOnContainerKeywords=(html)=>{
    const uuid=$(html).attr('data');
    const text= $(html).text();
    const html_new=$(`<span id='keywords-unload' data='${uuid}'class='sections-selected text-white bg-primary mr-2 my-5 p-2 rounded'>${text} <i class="fa-solid fa-circle-xmark"></i><span>`);
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

const showNews=(data)=>{
    const news=data;
    $('#container-noticias').children().remove();
    news.forEach(element=>{
        const html=$(`<divc class='noticias'  id='noticia'>
                        <a class='row a-row' href='viewnews.html?id=${element.uuid_news}'>
                        <div class='col-4'>
                            <label class='input-grup-text' for='noticia'>
                                <img src='data:image/jpg;base64,${element.archive}' class="input-group-text news_image"/>
                            </label>
                        </div>
                        <div class='col-8'>
                            <h2>${element.news_title}</h2>
                            <p class='text-justify'>
                                ${element.news_description}
                            </p>
                        </div>
                        </a>
                     </div>`);
        $('#container-noticias').append(html);
    });
}