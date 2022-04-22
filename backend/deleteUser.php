<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
    $session_id=session_id();
    $uuids=explode('-',$session_id);
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
    $sql="CALL usersSP(7,'{$uuids[1]}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
    //$sql="SELECT COUNT(*) FROM `users` WHERE `user_uuid`='{$uuids[1]}' AND `user_type`=0";
    $isAdmin=selectQuery($sql);
    $isAdmin=$isAdmin[0]['COUNT(*)'];
    if($isAdmin==0){
        $sql="CALL usersSP(8,'{$uuids[1]}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
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
    else{
        $result['success']=false;
        $result['error'][]='No se pudo eliminar a un admin';
        echo json_encode($result);
        exit;
    }
}
?>