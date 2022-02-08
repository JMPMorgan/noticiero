function onlyLetters(text){
    //Pregunta si son letras de la a-z y A-Z y si cuenta con espacios
    //si cumple las condiciones regresa true, pero en esta funcion regresa el opuesto
    //por cuestion de funcionalidad
    let regex = /^[a-zA-Z ]+$/;
    return !regex.test(text);
}

function onlyMinus(text){
    let regex = /^[a-z\_\.]+$/;
    return !regex.test(text);
}

function validateEmail(email){
        /*return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );*/
    /*
    /*
    validad el email para que haya texto despues un arroba y un punto
    */
    let regex = /\S+@\S+\.\S+/;
    return !regex.test(email);
}

function validatePassword(password){
    /*
    valida la contraseña pero lo valida por caracter para saber cuantos y cuales son los caracteres ingresados
    */
    let regex_especial = /^[\$\@\#\&]+$/;
    let regex_number = /^[0-9]+$/;
    let regex_char = /^[a-zA-Z]+$/;
    if (regex_char.test(password)) {
      //retorna por que son letras
      return 'A';
    }
    else if (regex_number.test(password)) {
      //retorna el 1 por que el caracter es un numero
      return 1;
    }
    else if (regex_especial) {
      //retorna el @ por que es un caracter especial
      return '@';
    }
    else {
      return true;
    }
}

export {onlyLetters,onlyMinus,validateEmail,validatePassword};
