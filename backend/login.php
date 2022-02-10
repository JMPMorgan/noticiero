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
        /*
        Este boleano isEmail sirve para indentificar si es un email si no lo es busca por nick para ver si existe ese nick
        si no existe no regresa nada de informacion
        */
        if($isEmail==1){
            $sql="SELECT `user_uuid` FROM `users_info` WHERE `user_pass`='{$password}' AND `user_email`='{$fields['user']}';";
        }
        else{
            $sql="SELECT `user_uuid` FROM `users_info` WHERE `user_pass`='{$password}' AND `user_nick`='{$fields['user']}';";
        }
        $rows = selectQuery($sql);
        if(!empty($rows)){
            /*
            Se genera un uuid de session de se concatena con el uuid del usuario para saber
            que sesion es de que usuario 
            el uuid_session se hace una variable globlal y ademas  se la da el nombre a la session con 
            session_id()
            */
            $uuid_session=generateRandomToken();
            $user_uuid=$rows[0]['user_uuid'];
            $uuid_session.='-'.$user_uuid;
            session_id($uuid_session);
            $isSessionStart=session_start();
            if($isSessionStart==true){
                $_SESSION['uuid_session']=$uuid_session;
                $user_uuid=encode($user_uuid);
                array_push($result,$user_uuid);
                echo json_encode($result);
                exit;
            }
            else{
                $result['error'][]='Error al ingresar al sistema por favor recargue la pagina';
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result['error'][]='Error al ingresar al sistema por favor recargue la pagina';
            echo json_encode($result);
            exit;
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