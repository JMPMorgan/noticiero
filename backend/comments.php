<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        if(isset($fields['id']) && isset($fields['comment'])&& isset($fields['n'])){
            $fields['id']=removeCharForSpaces($fields['id']);
            $fields['comment']=removeEspecialChar($fields['comment']);
            $fields['n']=removeCharForSpaces($fields['n']);
            $fields['id']=intval($fields['id']);
            switch ($fields['id']) {
                case 0:{
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL comments_sp(0,NULL,NULL,NULL,NULL,NULL);";
                    $rows=selectQuery($sql);
                    $sql="CALL comments_sp(4,NULL,NULL,NULL,NULL,NULL);";
                    $rows2=selectQuery($sql);
                    if(!empty($rows)){
                        $info=array();
                        if(!empty($rows2)){
                            $info=connectMainComments($rows,$rows2);
                        }else{
                            $info=$rows;
                        }
                        //array_push($info,$rows,$rows2);
                        $result['info']=$info;
                        //$result['info']['data']=$rows;
                        $result['success']=true;
                        echo json_encode($result);
                        exit;
                    }else{
                        //array_push($result['info'],$rows);
                        $result['success']=false;
                        echo json_encode($result);
                        exit;
                    }
                }break;
                case 1:{
                    $uuid=generateRandomToken();
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL comments_sp(1,'{$uuid}','{$uuids[1]}','{$fields['n']}',NULL,'{$fields['comment']}');";
                    $isInsert=execQuery($sql);
                    if($isInsert>0){
                        $result['success']=true;
                        $result['info']['uuid']=$uuids[1];
                        $date=getdate();
                        $date=date('d/m/Y');
                        $result['info']['uuid_comment']=$uuid;
                        $result['info']['date']=$date;
                        echo json_encode($result);
                        exit;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo insertar el comentario';
                        echo json_encode($result);
                        exit;
                    }
                }break;
                case 2:{
                    $uuid=generateRandomToken();
                    $uuids = session_id();
                    $uuids = explode('-', $uuids);
                    $sql="CALL comments_sp(2,'{$uuid}','{$uuids[1]}','{$fields['n']}','{$fields['uuid_comment']}','{$fields['comment']}');";
                    $isInsert=execQuery($sql);
                    if($isInsert>0){
                        $result['success']=true;
                        $result['info']['uuid']=$uuids[1];
                        $date=getdate();
                        $date=date('d/m/Y');
                        $result['info']['uuid_comment']=$uuid;
                        $result['info']['date']=$date;
                        echo json_encode($result);
                        exit;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo insertar el comentario';
                        echo json_encode($result);
                        exit;
                    }
                }
                case 3:{
                    $uuids = explode('-', $uuids);
                    $sql="CALL comments_sp(3,'{$fields['n']}',NULL,NULL,NULL,NULL);";
                    $isDelete=execQuery($sql);
                    if($isDelete>0){
                        $result['success']=true;
                        echo json_encode($result);
                        exit;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo insertar el comentario';
                        echo json_encode($result);
                        exit;
                    }
                }
                default:{
                    $result['success']=false;
                    $result['error'][]='No hay ningun caso especificado';
                    echo json_encode($result);
                    exit;
                }break;
            }
        }
    }else{
        $result['logged']=false;
        $result['success']=false;
        echo json_encode($result);
    }
}catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
}


function connectMainComments($main,$childs){
    $array_main=count($main);
    $array_child=count($childs);
    /*var_dump($main);
    var_dump($childs);*/
    for($y=0;$y< $array_main;$y++){
        //var_dump($data);
        for($i=0;$i< $array_child;$i++){
            if($main[$y]['uuid_comments']===$childs[$i]['uuid_main']){
                /*echo 'entro';
                echo '<br>'; 
                echo $data['uuid_comments'];
                echo '<br>'; 
                echo $childs[$i]['uuid_main'];*/
                if(!isset($main[$y]['comments_child'])){
                    $main[$y]['comments_child']=array();
                }
                array_push($main[$y]['comments_child'],$childs[$i]);
            }
        }           
    }
    return $main;

}



?>