<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
if(!empty($fields)){
    $fields['user'] = removeCharForSpaces($fields['user']);
    $fields['pass'] = removeCharForSpaces($fields['pass']);
    $result= validations($fields['user'],$fields['pass']);
    if($result['success']==true){
        $isEmail= isEmail($fields['user']);
        $password=encode($fields['pass']);
        if($isEmail==1){
            $sql="SELECT * FROM `users_info` WHERE `user_pass`='{$password}' AND `user_email`='{$fields['user']}';";
        }
        else{
            $sql="SELECT * FROM `users_info` WHERE `user_pass`='{$password}' AND `user_nick`='{$fields['user']}';";
        }
        $rows = selectQuery($sql);
        if(!empty($rows)){
            
        }
        else{

        }
    }
    else{
        echo json_encode($result);
        exit;
    }

}

function validations($user,$password){
    $result = array('error'=>array());
    if(strlen($user)<=0||is_numeric($user)){
        $result['error'][]='El user del usaurio no cumple con los requisitos,verifique la informaicion';
    }
    if(strlen($password)<8||is_numeric($password)){
        $result['error'][]='La contraseña del usuario no cumple con los requisitos,verificar la informacion';
    }
    if(count($result['error'])==0){
        $result['success']=true;
    }
    else{
        $result['success']=false;
    }
    return $result;

}

?>