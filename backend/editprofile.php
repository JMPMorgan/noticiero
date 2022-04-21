<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
if(!empty($fields)){   
    if(!empty($_FILES['image'])){
        if(isset($_FILES['image'])){
            array_push($fields,$_FILES['image']);
            $hasAimage=true;
        }
        else{
            $hasAimage=false;
        }    
    }
    else{
        $hasAimage=false;
    }
    $fields['number']=removeEspecialChar( decode($fields['number']));
    //echo $fields['number'];
    
        /*
                usersSP(
                    1->opcion
                    2->uuid
                    3->name
                    4->lastname
                    5->password
                    6->gender
                    7->email
                    8->path_pp
                    9->nick
                    10->type_user
                )

        */  
    $sql="CALL usersSP(4,'{$fields['number']}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
    //$sql="SELECT COUNT(*) FROM `users` WHERE `user_uuid`='{$fields["number"]}';";
    $exitsUser=selectQuery($sql);
    $exitsUser=$exitsUser[0]['COUNT(*)'];
    $image_size=3000001;
    $image_type='error_type';
    if($exitsUser==1){
        if($hasAimage==true){
            $path=$_SERVER['DOCUMENT_ROOT'].'/noticiero/assets/img/profile_pics/';
            $image_type=getImageType($fields[0]['type']);
            $image_size=$fields[0]['size'];
        }
        if($image_type!='error_type' || $hasAimage== false){
            $fields['name']=removeEspecialChar($fields['name']);
            $fields['lastname']=removeEspecialChar($fields['lastname']);
            $fields['email']=removeEspecialChar($fields['email']);
            $fields['oldpassword']=removeCharForSpaces($fields['oldpassword']);
            $fields['password']=removeCharForSpaces($fields['password']);
            if($image_size<=3000000 && $hasAimage == true){
                $image_name=true;
            }
            else{
                $image_name=false;
            }
            if($hasAimage==true){
                $result = validations($fields['name'], $fields['lastname'], $fields['email'], $fields['password'], $fields['oldpassword'],$image_name);
            }
            else{
                $result = validations($fields['name'], $fields['lastname'], $fields['email'], $fields['password'], $fields['oldpassword']);
            }
            
            if ($result['success'] == true) {
                $password = encode($fields['password']);
                $sql_password="CALL usersSP(11,'{$fields['number']}',NULL,null,null,null,null,null,null,null);";
                //$sql_password="SELECT `user_pass`,`user_profilepic` FROM `users` WHERE `user_uuid`='{$fields['number']}';";
                $isSamePassword=selectQuery($sql_password);
                //var_dump($isSamePassword);
                $password=$isSamePassword[0]['user_pass'];
                $path_old_image=$isSamePassword[0]['user_profilepic'];
                $isSamePassword[0]['password']=$hasAimage;
                $isSamePassword[0]['uuid']=$fields["number"];
                $password=decode($password);

                if($fields['oldpassword']==$password && $hasAimage == false){
                    $fields['password']=encode($fields['password']);
                                        /*
                            usersSP(
                                1->opcion
                                2->uuid
                                3->name
                                4->lastname
                                5->password
                                6->gender
                                7->email
                                8->path_pp
                                9->nick
                                10->type_user
                            )

                    */  
                    $sql="CALL usersSP(5,'{$fields['number']}','{$fields['name']}','{$fields['lastname']}','{$fields['password']}',NULL,'{$fields['email']}',NULL,NULL,NULL);";
                    //$sql="UPDATE `users` SET `user_name`='{$fields['name']}', `user_email` ='{$fields['email']}',
                    //`user_pass`='{$fields['password']}' WHERE `user_uuid`='{$fields["number"]}';";
                    $isUpdated=execQuery($sql);
                }
                else if($fields['oldpassword']==$password && $hasAimage==true){
                    $image_name=$fields["number"].'_pp'.$image_type;
                    $isSamePassword[0]['image_name']=$image_name;
                    $fields['password']=encode($fields['password']);
                    $sql="CALL usersSP(6,'{$fields['number']}','{$fields['name']}','{$fields['lastname']}','{$fields['password']}',NULL,'{$fields['email']}','{$image_name}',NULL,NULL);";
                    /*$sql="UPDATE `users` SET `user_name`='{$fields['name']}', `user_email` ='{$fields['email']}',
                    `user_pass`='{$fields['password']}', `user_profilepic`='{$image_name}' WHERE `user_uuid`='{$fields["number"]}';";*/
                    $isUpdated=execQuery($sql);
                    $path_delete='../assets/img/profile_pics/';
                    if(unlink($path_delete.$path_old_image)==true){
                        $save=move_uploaded_file($fields[0]['tmp_name'], $path.$image_name);
                        if($isUpdated!=0 && $save !=0){
                            $result['success']=true;
                            echo json_encode($result);
                            exit;
                        }
                        else{
                            $result['success']=false;
                            $result['error'][]='Valor de Is updated'.$isUpdated;
                            $result['error'][]='Valor de Save'.$save;
                            $result['error'][]='Error al ingresar la informacion , por favor recargar la pagina';
                            echo json_encode($result);
                            exit;
                        }
                    }
                    else{
                        $result['success']=false;
                        $result['error'][]='Error al ingresar la informacion borrar imagen, por favor recargar la pagina';
                        echo json_encode($result);
                        exit;
                    }
                    /*
                    FALTA ELIMINAR LA IMAGEN QUE SE ENVIO PRIMERO PARA QUE OBTENGA LA IMAGEN UPDATEADA
                    */
                }
                else{
                    $result['success']=false;
                    $result['error']='La contraseña antigua no coincide';
                    echo json_encode($result);
                    exit;
                }
                if($isUpdated==1){
                    $result['success']=true;
                    echo json_encode($result);
                    exit;
                }
                else{
                    $result['success']=false;
                    $result['error']='No se pudo modificar el perfil, intentelo de nuevo o reporte el error';
                    echo json_encode($result);
                    exit;
                }
            } else {
                echo json_encode($result);
                exit;
            }
        }   
    }
    else{
        $result['success']=false;
        $result['error'][]='El usuario no existe o no fue encontrado';
        echo json_encode($result);
        exit;
    }

}


function validations($name,$lastname,$email,$password,$oldpassword,$pp='No hay imagen'){
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
    if(strlen($password)<8||is_numeric($password)){
        $result['error'][]='La contraseña del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(strlen($oldpassword)<8||is_numeric($oldpassword)){
        $result['error'][]='La contraseña que  del usuario no cumple con los requisitos,verificar la informacion';
    }
    if($pp!='No hay imagen' ){
        if($pp==false){
            $result['error'][]='La imagen de perfil es demasiado grande, por favor escoger otra (Minimo 3mb)';
        }
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
?>