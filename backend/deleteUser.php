<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
    $session_id=session_id();
    $uuids=explode('-',$session_id);
    $sql="SELECT COUNT(*) FROM `users` WHERE `user_uuid`='{$uuids[1]}' AND `user_type`=0";
    $isAdmin=selectQuery($sql);
    $isAdmin=$isAdmin[0]['COUNT(*)'];
    if($isAdmin==0){
        $sql="UPDATE `users` SET `user_status`=1 WHERE `user_uuid`='{$uuids[1]}';";
        $isUpdated= execQuery($sql);
        if(is_numeric($isUpdated)){
            $result['success']=true;
            echo json_encode($result);
            exit;
        }
        else{
            $result['success']=false;
            $result['error'][]='No se pudo eliminar el usuario';
            echo json_encode($result);
            exit;
        }
    }
    else{
        $result['success']=false;
        $result['error'][]='No se pudo eliminar a un admin';
        echo json_encode($result);
        exit;
    }
}
?>