<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
if($isSessionCorrect==true){
        $result=array('info'=>array());
        $session_id=session_id();
        $uuids=explode("-",$session_id);
        $sql="SELECT `communication_message`,`communication_status`,`uuid_referencenews` FROM `communication` WHERE `uuid_for`='{$uuids[1]}' AND `communication_status`=0;";
        $rows=selectQuery($sql);
        foreach($rows as $row){
            switch($row['communication_message']){
                case 'ELIMINACION':{
                    $result['info'][]='ELIMINACION';
                    break;
                }
                default:{
                    $result['error'][]='No se especifico el caso que solicita';
                    break;
                }
            }
        }
        if(!isset($result['error'])){
            $result['success']=true;
            echo json_encode($result);
            exit;
        }
        else {
            $result['success']=false;
            echo json_encode($result);
            exit;
        }
        
}
?>