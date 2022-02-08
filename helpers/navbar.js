$(()=>{
    $('#btn-signin').on('click',()=>{
        window.parent.document.location='signup.html';
    })
    $('#btn-login').on('click',()=>{
        window.parent.document.location='login.html';
    })
})