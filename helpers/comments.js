
import { getParameterByName } from '../helpers/auxiliar/auxiliarMethods.js';
$(async ()=>{
    const n=getParameterByName('id');
    let response=await $.ajax({
        method:'GET',
        datatype:'JSON',
        data:{
            id:0,
            comment:'0',
            n:n
        },
        url:'../backend/comments.php'
    });
    response=JSON.parse(response);
    console.log(response);
    if(response.success===true){
        loadComments(response.info);
    }
    response=await $.ajax({
        method:'POST',
        datatype:'JSON',
        data:{
            id:0,
            uuid:getParameterByName('id')
        },
        url:'../backend/view_news.php'
    });
    console.log(response);

    $('#comment').on('click',async()=>{
        const comment = $('#comment-text').val();
        const n=getParameterByName('id');
        if(comment.length>0){
            let response=await $.ajax({
                method:'POST',
                datatype:'JSON',
                data:{
                    id:1,
                    comment:comment,
                    n:n
                },
                url:'../backend/comments.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                window.location.reload();
                /*
                const data={}
                data.uuid=response.info.uuid;
                data.comment=comment;
                data.date=response.info.date;
                data.uuid_comment=response.info.uuid_comment;
                addNewComment(data);*/
            }
            else{

            }
            console.log(response);
        }else{
            Swal.fire(
                'Comentario Vacio',
                'El comentario no debe estar vacio',
                'warning'
            );
        }
    });
});


const loadComments=(data)=>{
    data.forEach(element=>{
        let child_html='';
        if(element.comments_child){
            element.comments_child.forEach(ele=>{
                child_html+=`<li class='comment border-top list-group-item' data='${ele.uuid_comment}'>
                <div class='row border-top border-bottom'>
                    <div class='col-1 container-pp-comments'>
                        <img class='rounded img-thumbnail pp-comments'
                        src="../assets/img/profile_pics/${ele.user_profilepic}"/>
                    </div>
                    <div class='col-11 d-flex justify-content-between'>
                        <p class='h3' data=''>${ele.user_nick}</p>
                        <p class='text-muted mt-1' style='margin:0;'>${ele.comments_creation}</p>
                    </div>
                    <div class='col-12'>
                        <p style="margin: 0;"  data='${ele.uuid_comment}'>
                        ${ele.comments_text}
                        </p>
                        <p style="margin: 0;" class='d-flex justify-content-end my-1'>
                        </p>
                    </div>
                </div>
                </li>`;
            });
        }
        const html = $(`<div class='comment border-top'  data='${element.uuid_comments}'>
                        <div class='row border-top border-bottom'>
                            <div class='col-1 container-pp-comments'>
                                <img class='rounded img-thumbnail pp-comments'
                                src="../assets/img/profile_pics/${element.user_profilepic}"/>
                            </div>
                        <div class='col-11 d-flex justify-content-between'>
                            <p class='h3' data=>${element.user_nick}</p>
                            <p class='text-muted mt-1' style='margin:0;'>${element.comments_creation}</p>
                        </div>
                        <div class='col-12'>
                            <p style="margin: 0;" id='comment-paragraph' data='${element.uuid_comment}'>
                                ${element.comments_text}
                            </p>
                            <p id='container-awnser-comment' style="margin: 0;" class='d-flex justify-content-end my-1'>
                            <span id='awnser-comment' class='stretched-link'>Responder</span>
                            </p>
                        <ul id='container-sub-comments' class='list-group'>
                            ${child_html}
                        </ul>
                        </div>
                        </div>
        </div>`);
        const awnser=$(html).find('#awnser-comment');
        $('#container-comments').append(html);
        $(awnser).on('click',()=>subComment(html));

    });
}
const addNewComment=(data)=>{
    const uuid_comment=data.uuid_comment;
    const image=$('#profile-pic').attr('src');
    const user=$('#user').text();
    const html=$(`<div class='comment border-top' >
                    <div class='row border-top border-bottom'>
                        <div class='col-1 container-pp-comments'>
                            <img class='rounded img-thumbnail pp-comments'
                            src="${image}"/>
                        </div>
                        <div class='col-11 d-flex justify-content-between'>
                            <p class='h3' data='${data.uuid}'>${user}</p>
                            <p class='text-muted mt-1' style='margin:0;'>${data.date}</p>
                        </div>
                        <div class='col-12'>
                            <p style="margin: 0;" id='comment-paragraph' data='${uuid_comment}'>
                            ${data.comment}
                            </p>
                            <p id='container-awnser-comment' style="margin: 0;" class='d-flex justify-content-end my-1'>
                            <span id='awnser-comment' class='stretched-link'>Responder</span>
                            </p>
                            <div id='container-sub-comments' ></div>
                        </div>
                    </div>
                </div>`);
    const awnser=$(html).find('#awnser-comment');
    console.log(awnser);
    $('#container-comments').append(html);
    $(awnser).on('click',()=>{
        $('#area-comments-child').remove();
        const uuid_comment=$('#comment-paragraph').attr('data');
        const comment=$(`<div id='area-comments-child'><textarea data='${uuid_comment}' class='form-control mt-1'></textarea>
                        <button id='comment' class='btn btn-primary d-flex justify-content-end ml-auto'>
                        </button><div>`);
        $('#container-sub-comments').before(comment);
        const button=$(comment).find('#comment');
        console.log(button);
        console.log(uuid_comment);
        $(button).on('click',()=>{addSubComment()});
    });

}

const subComment=(html)=>{
    console.log(html);
    $(html).find('#area-comments-child').remove();
    console.log($(html).find('#container-sub-comments'));
    //onsole.log($(html).find('#area-comments-child'),$(html).find('#container-sub-comments'));

    const uuid_comment=$('#comment-paragraph').attr('data');
    const comment=$(`<div id='area-comments-child'><textarea data='${uuid_comment}' class='form-control my-1'></textarea>
                            <button id='comment' class='btn btn-primary d-flex my-2 justify-content-end ml-auto'>
                            Comment
                    </button><div>`);
    $(html).find('#container-sub-comments').before(comment);
    const button=$(comment).find('#comment');
    console.log(button);
    console.log(uuid_comment);
    $(button).on('click',()=>{addSubComment(html)});
}

const addSubComment=async (html)=>{
    console.log(html);
    const uuid=$(html)[0];
    console.log($(uuid).attr('data'));
    const comentario=$(html).find('#area-comments-child').find('textarea').val();
    console.log($(uuid).attr('data'),comentario);
    const n=getParameterByName('id');
    if(comentario.length>0){
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                id:2,
                comment:comentario,
                uuid_comment:$(uuid).attr('data'),
                n:n
            },
            url:'../backend/comments.php'
        });
        console.log(response);
        response=JSON.parse(response);
        if(response.success===true){
            window.location.reload();
            /*
            const data={};
            const image=$('#profile-pic').attr('src');
            const user=$('#user').text();
            data.uuid=response.info.uuid;
            data.comment=comment;
            data.date=response.info.date;
            data.uuid_comment=response.info.uuid_comment;
            const html=$(`<div class='comment border-top' data='${data.uuid_comment}'>
            <div class='row border-top border-bottom'>
                <div class='col-1 container-pp-comments'>
                    <img class='rounded img-thumbnail pp-comments'
                    src="${image}"/>
                </div>
                <div class='col-11 d-flex justify-content-between'>
                    <p class='h3' data='${data.uuid}'>${user}</p>
                    <p class='text-muted mt-1' style='margin:0;'>${data.date}</p>
                </div>
                <div class='col-12'>
                    <p style="margin: 0;">
                    ${data.comment}
                    </p>
                    <p style="margin: 0;" class='d-flex justify-content-end my-1'>
                    </p>
                </div>
            </div>
        </div>`);
        $('#container-comments').append(html);*/
        }else{

        }
    }else{
        Swal.fire(
            'Comentario Vacio',
            'El comentario no debe estar vacio',
            'warning'
        );
    }
}