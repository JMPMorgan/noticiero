<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
if(!empty($fields)){

    if (!empty($_FILES['image'])) {
        array_push($fields, $_FILES);
    } else {
        echo 'image';
        exit;
    }
    $fields['email'] = removeEspecialChar($fields['email']);
    $sql = "SELECT `user_name`,`user_email` from `users_info` where `user_email` = '{$fields['email']}';";
    $rows = selectQuery($sql);
    if (empty($rows)) {
        $uuid = generateRandomToken();
        $path=$_SERVER['DOCUMENT_ROOT'].'/noticiero/assets/img/profile_pics/';
        $image_type=getImageType($fields[0]['image']['type']);
        $image_size=$fields[0]['image']['size'];
        if($image_type!='error_type'){
            if ($fields['gender'] == 'male') {
                $fields['gender'] = 0;
            } else if ($fields['gender'] == 'female') {
                $fields['gender'] = 1;
            } else {
                $fields['gender'] = 'error';
            }
            if($image_size<=3000000){
                $image_name=true;
            }
            else{
                $image_name=false;
            }
            $fields['name'] = removeEspecialChar($fields['name']);
            $fields['lastname'] = removeEspecialChar($fields['lastname']);
            $fields['email'] = removeEspecialChar($fields['email']);
            $fields['password'] = removeCharForSpaces($fields['password']);
            $fields['gender'] = removeEspecialChar($fields['gender']);
            $fields['user'] = removeCharForSpaces($fields['user']);
            $result = validations($fields['name'], $fields['lastname'], $fields['email'], $fields['password'], $fields['gender'], $fields['user'],$image_name);
            if ($result['success'] == true) {
                $password = encode($fields['password']);
                $image_name=$uuid.'_pp'.$image_type;
                $sql = "INSERT into `users_info`(`user_name`,`user_email`,`user_pass`,`user_uuid`,`user_lastname`,`user_gender`,`user_nick`,`user_profilepic`) VALUES('{$fields['name']}','{$fields['email']}','{$password}','{$uuid}','{$fields['lastname']}','{$fields['gender']}','{$fields['user']}','{$image_name}');";
                execQuery($sql);
                if($sql!=0){
                    move_uploaded_file($fields[0]['image']['tmp_name'], $path.$image_name);
                    echo json_encode($result);
                    exit;
                }
                else {
                    echo 'Error al ingresar la informacion , por favor recargar la pagina';
                    exit;
                }

            } else {
                echo json_encode($result);
                exit;
            }
        }
        else{
            echo 'image_invalid';
            exit;
        }
    } else {
        echo 'email';
        exit;
    }
}
else{
    echo 'informacion';
    exit;
}

function validations($name,$lastname,$email,$password,$gender,$user,$pp){
    $result=array('error'=>array());
    if(strlen($name)<=0||is_numeric($name)){
        $result['error'][]='El nombre del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($lastname)<=0||is_numeric($lastname)){
        $result['error'][]='El apellido del usuario no cumple con los requisitos,verificar la informacion';

    }
    if(strlen($email)<=0||is_numeric($email)){
        $result['error'][]='El email del usuario no cumple con los requisitos,verificar la informacion';

    }
    if(strlen($user)<=0||is_numeric($user)){
        $result['error'][]='El user del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($password)<8||is_numeric($password)){
        $result['error'][]='La contraseña del usuario no cumple con los requisitos,verificar la informacion';

    }
    if(strlen($gender)<0||strcmp($gender,'error')==0){
        $result['error'][]='Por favor de recargar la pagina';
    }
    if($pp===false){
        $result['error'][]='La imagen de perfil es demasiado grande, por favor escoger otra (Minimo 3mb)';
    }
    if(count($result['error'])==0){
        $result['success']=true;
        return $result;
    }
    else{
        $result['success']=false;
        return $result;    
    }
}
