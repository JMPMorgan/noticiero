<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try {
    if(isSessionCorrect()===true){
        if(isset($fields['id'])&& isset($fields['uuid'])){
            $fields['uuid']=removeEspecialChar($fields['uuid']);
            switch($fields['id']){
                case 0:{
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL likes_sp(0,'{$uuids[1]}','{$fields['uuid']}');";
                    $rows=selectQuery($sql);
                    $sql="CALL likes_sp(3,'{$uuids[1]}',NULL);";
                    $rows2=selectQuery($sql);
                    if(!empty($rows) && !empty($rows2)){
                        $info=array();
                        array_push($info,$rows[0],$rows2[0]);
                        $result['info']=$info;
                        $result['success']=true;
                        echo json_encode($result);
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo obtener la cantidad de likes';
                        echo json_encode($result);
                    }
                    exit;
                }break;
                case 1:{
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL likes_sp(1,'{$uuids[1]}','{$fields['uuid']}');";
                    $isInserted=execQuery($sql);
                    if($isInserted>0){
                        $result['success']=true;
                        echo json_encode($result);
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo insertar el like';
                        echo json_encode($result);
                    }
                    exit;
                }break;
                case 2:{
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL likes_sp(2,'{$uuids[1]}',NULL);";
                    $isDelete=execQuery($sql);
                    if($isDelete>0){
                        $result['success']=true;
                        echo json_encode($result);
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo borrar el like';
                        echo json_encode($result);
                    }
                    exit;
                }break;
                case 3:{
                    $uuids=session_id();
                    $uuids=explode('-',$uuids);
                    
                    
                }break;
                default:{
                    $result['success']=false;
                    $result['error'][]='No hay ningun caso especifico';
                    echo json_encode($result);
                    exit;
                }break;
            }
        }
    }else{

    }
}catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
}
?>