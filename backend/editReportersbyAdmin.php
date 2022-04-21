<?php   
    require_once('../backend/PDO/PDO.php');
    require_once('../backend/Auxiliar/auxiliarMethods.php');
    $isCorrect=isSessionCorrect();
    $fields=(empty($_GET)?$_POST:$_GET);
    $image_size=3000001;
    $image_type='error_type';
    if($isCorrect==1){
        if(!empty($fields)){
            if(!empty($_FILES['image'])){
                if(isset($_FILES['image'])){
                    array_push($fields,$_FILES['image']);
                    $hasAFile=true;
                }
                else{
                    $hasAFile=false;
                }
            }
            else{
                $hasAFile=false;
            }
        }
        $fields['number']=removeEspecialChar(decode($fields['number']));
        $sql="CALL usersSP(4,'{$fields['number']}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
        //$sql="SELECT COUNT(*) FROM `users` WHERE `user_uuid`='{$fields['number']}';";
        $exitsUser=selectQuery($sql);
        $exitsUser=$exitsUser[0]['COUNT(*)'];
        if($exitsUser==1){
            if($hasAFile==true){
                $path=$_SERVER['DOCUMENT_ROOT'].'/noticiero/assets/img/profile_pics/';
                $image_type=getImageType($fields[0]['type']);
                $image_size=$fields[0]['size'];
            }
            if($image_type!='error_type' || $hasAFile==false){
                $fields['name']=removeEspecialChar($fields['name']);
                $fields['lastname']=removeEspecialChar($fields['lastname']);
                $fields['email']=removeCharForSpaces($fields['email']);
                $fields['password']=removeCharForSpaces($fields['password']);
                if($image_size<=3000000 && $hasAFile==true){
                    $image_name=true;
                }
                else{
                    $image_name=false;
                }
                if($hasAFile==true){
                    $result=validations($fields['name'],$fields['lastname'],$fields['email'],$fields['password'],$image_name);
                }
                else{
                    $result=validations($fields['name'],$fields['lastname'],$fields['email'],$fields['password']);
                }
                if($result['success']==true && $hasAFile==false){
                    $fields['password']= encode($fields['password']);
                    $sql="UPDATE `users` SET `user_name`='{$fields['name']}',`user_email`='{$fields['email']}',
                    `user_pass`='{$fields['password']}',`user_lastname`='{$fields['lastname']}' WHERE `user_uuid`='{$fields['number']}';";
                    $isUpdated=execQuery($sql);
                    if($isUpdated!=0){
                        $result['success']=true;
                        echo json_encode($result);
                        exit;
                    }
                    else{
                        $result['success']=false;
                        echo json_encode($result);
                        exit;
                    }
                }
                else if($result['success']==true && $hasAFile==true){
                    $fields['password']= encode($fields['password']);
                    $image_name=$fields['number'].'_pp'.$image_type;
                      $sql="UPDATE `users` SET `user_name`='{$fields['name']}', `user_email` ='{$fields['email']}',
                    `user_pass`='{$fields['password']}', `user_profilepic`='{$image_name}' WHERE `user_uuid`='{$fields["number"]}';";
                    $isUpdated=execQuery($sql);
                    $path_delete='../assets/img/profile_pics/';
                    $image_path="SELECT `user_profilepic` FROM `users` WHERE `user_uuid`='{$fields['number']}';";
                    $rows_image=selectQuery($image_path);
                    if(unlink($path_delete.$rows_image[0]['user_profilepic'])==true){
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
                }
            }
        }    
    }

    function validations($name,$lastname,$email,$password,$pp='No hay imagen'){
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