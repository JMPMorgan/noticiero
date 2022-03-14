$(async ()=>{
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getSectionsKeywords.php'
    });
    response=JSON.parse(response);
    console.log(response);
});