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
                    $sql="CALL comments_sp(0,NULL,NULL,NULL,NULL,NULL);";
                    $rows=selectQuery($sql);
                    if(!empty($rows)){
                        $result['info']['child_delete']=connectMainComments($rows);
                        $result['info']['data']=$rows;
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


function connectMainComments($data){
    $hijos_eliminados=array();
    /*foreach($data as $comments){
        var_dump($comments);
        array_map('checkDates',$data,$comments);
    }*/
    $array_num = count($data);

    for($padre=0;$padre< $array_num;$padre++){
        $data[$padre]['comments_child']=array();
        for ($hijo=0; $hijo < $array_num; $hijo++) { 
            if(strcmp($data[$padre]['uuid_comments'],$data[$hijo]['uuid_main'])==0){
                //echo $comments['uuid_comments'];
                //echo $data[$i]['uuid_main'];  
                //array_push($data[$padre]['comments_child'],$data[$hijo]);
                array_push($hijos_eliminados,$data[$hijo]['uuid_comments']);
            }
        }
    }
    //var_dump(array("Lucas","Marcelo"));
   /* var_dump($hijos_eliminados);
    var_dump($data);
   $new_data=array_diff($data,$hijos_eliminados);*/
   /*$eliminados_count=count($hijos_eliminados);
   $contador=0;
    for($y=0;$y <$array_num;$y++){
        for ($i=0; $i < $eliminados_count; $i++) { 
            if($y != $hijos_eliminados[$i]){
                array_push($new_data,$info);
            }
        }
    } */
    

        /*foreach($data as $child_comment){
            $comments['comments_child']=array();
            if(strcmp($comments['uuid_comments'],$child_comment['uuid_main'])==0){
                //var_dump($child_comment);
                array_push($comments['comments_child'],$child_comment);
                
            }
            //var_dump($comments);
        }*/
        //var_dump($comments);
    //var_dump($data);
    return $hijos_eliminados;
}


/*function checkDates($data,$element){
    if($element['uuid_comments']==$)
}*/

?>