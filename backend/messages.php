<?php
/*
en el switch es 
1 para eliminacion de usuario
2 para enviar noticia al admin para 
*/
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
if($isSessionCorrect==true){
    if(!empty($fields)){
        if(isset($fields['n']) && isset($fields['id'])){
            $result=array('info'=>array());
            $fields['id']=intval(decode($fields['id']));
            $session_id=session_id();
            $uuids=explode("-",$session_id);
            switch($fields['id']){
                case 1:{
                    $sql="CALL `insertMessageCommunication`(0,'{$uuids[1]}','{$fields['n']}',NULL);";
                    /*$sql="INSERT INTO `communication` (`uuid_from`,`uuid_for`,`communication_message`,`communication_date`,
                    `communication_status`,communication_lastM) VALUES ('{$uuids[1]}','{$fields['n']}','ELIMINACION',now(),0,now());";*/
                    $isCreate=execQuery($sql);
                    if(is_numeric($isCreate)){
                        $result['success']=true;
                        echo json_encode($result);
                    }
                    else{
                        $result['success']=false;
                        $result['error'][]='No se pudo eliminar el usuario por favor recargue la pagina e intente de nuevo';
                        echo json_encode($result);
                    }
                    
                }
                break;
                case 2:{
                    
                    $sql="CALL `insertMessageCommunication`(1,'{$uuids[1]}','7df77187de42f964ea60872a478f6819','{$fields['n']}');";
                    /*$sql="INSERT INTO `communication`(`uuid_from`,`uuid_for`,`communication_message`,`communication_date`,
                    `communication_status`,`communication_lastM`,`uuid_referencenews`) VALUES('{$uuids[1]}','7df77187de42f964ea60872a478f6819','Noticia Enviada Para revision',
                    NOW(),0,now(),'{$fields['n']}');";*/
                    $isCreate=execQuery($sql);
                    if(is_numeric($isCreate)){
                        $result['success']=true;
                        echo json_encode($result);
                    }
                    else{
                        $result['success']=false;
                        $result['error'][]='No se pudo enviar la noticia para revision guarde la noticia e intente de nuevo';
                        echo json_encode($result);
                    }
                   
                }
                break;
                default:{
                    $result['success']=false;
                    $result['error'][]='No existe ningun caso para esta peticion';
                    echo json_encode($result);
                    break;
                }
            }
        }
        else{

        }
    }
}
?>