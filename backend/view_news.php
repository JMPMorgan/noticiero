<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
try{
    if(isSessionCorrect()==true){
        $uuids = session_id();
        $uuids=explode('-',$uuids);
        $uuid_user=$uuids[1];
    }
    else{
        $uuid_user='';
    }   
    $fields['id']=removeCharForSpaces($fields['id']);
    $fields['uuid']=removeCharForSpaces($fields['uuid']);
    $fields['id']=intval($fields['id']);
    switch($fields['id']){
        case 0:{
            if(strcmp($uuid_user,'')==0){
                $sql="CALL views_news(0,'{$fields['uuid']}',NULL);";
            }else{
                $sql="CALL views_news(0,'{$fields['uuid']}','{$uuid_user}');";
            }
            $isInsert=execQuery($sql);
            $result['success']=true;
            echo json_encode($result);
            exit;
        }break;
        case 1:{
            $sql="CALL views_news(1,NULL,'{$uuid_user}');";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $result['info']=$rows;
                $result['success']=true;
                echo json_encode($result);
                exit;
            }
            else{
                $result['error'][]='No se encontro ninguna noticia';
                $result['success']=false;
                echo json_encode($result);
                exit;
            }
        }
        default:{
            $result['success']=false;
            $result['error'][]='No hay ningun caso especificado para las visitas';
            echo json_encode($result);
            exit;
        }break;
    }
}catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
}
?>