/*window.onload = () => {
    let news = $('#news-writing').val();
    let bold;
    let isActiveBold = false,isActiveItalic=false,isActiveLink=false;
    let text_length = 0;
    let text_lengthF=0;
    $('#btn-bold').on('click', () => {
        let bold = $('#btn-bold').attr('active');
        isActiveBold = bold === 'false' ? true : false;
        if(isActiveBold===true){
            $('#btn-bold').attr('active','true');
            text_length = $('#news-writing').text().length;
            $('#btn-bold').removeClass('btn-secondary');
            $('#btn-bold').addClass('btn-pressed');
        }   
        else{
            transformBold(text_length,'#news-writing');
            $('#btn-bold').attr('active','false');
            $('#btn-bold').removeClass('btn-pressed');
            $('#btn-bold').addClass('btn-secondary');
        }


    })
    $('#news-writing').on('keyup', () => {
        let lengthFinal=$('#news-writing').text().length;
        if (isActiveBold === true) {
            transformBold(text_length,'#news-writing');
        }
        else if(isActiveItalic===true){

        }
        else if(isActiveLink===true){

        }
        else{
            transformNormal('#news-writing',lengthFinal);
        }
    })
}

const transformBold=(length,id)=>{
    let text = $(id).text();
    let lengthFinal= $(id).text().length;
    text_slice = text.slice(length, lengthFinal);
    let bold_text = '<b>' + text_slice + '</b>';
    let text_prev = text.substr(0, length);
    text_prev += bold_text;
    //text_prev = text_prev ;
   // text_prev = $(text_prev);
    $(id).text('');
    $(id).append(text_prev);
    let newsid = document.querySelector(id);
    newsid.focus();
    setEndOfContenteditable(newsid);
}

const transformNormal=(id,length)=>{
    let text = $(id).text();
    text_slice= text.slice(length)
    console.log(id);
    let lastChild = $(id);
   // lastChild.lastChild.after(()=>{return '<p>'++'</p>'})
    console.log(lastChild);
    lastChild=lastChild.children().length-1;
    console.log(lastChild);
}

const setEndOfContenteditable=(id) =>{
    let range, selection;
    if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+ 
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible) 
        range.selectNodeContents(id);//Select the entire contents of the element with the range 
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start 
        selection = window.getSelection();//get the selection object (allows you to change selection) 
        selection.removeAllRanges();//remove any selections already made 
        selection.addRange(range);//make the range you have just created the visible selection }    
    }
}*/

