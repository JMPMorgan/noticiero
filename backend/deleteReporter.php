<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
    $session_id=session_id();
    $uuids=explode('-',$session_id);
    $sql="CALL notificationsReporter(4,'{$uuids[1]}');";
    //$sql="UPDATE `users` SET `user_status`=1 WHERE `user_uuid`='{$uuids[1]}';";
    $isUpdated= execQuery($sql);
    if(is_numeric($isUpdated)){
        $session_id=session_id();
        unset($_SESSION['uuid_session']);
        unset($session_id);
        session_destroy();
        session_unset();
        $session_status= session_status();
        if($session_status==1){
            $result['success']=true;
            
        }
        else{
            $result['success']=false;
        }
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
?>