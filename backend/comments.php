<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
        if(isset($fields['id']) && isset($fields['comment'])&& isset($fields['n'])){
            $fields['id']=removeCharForSpaces($fields['id']);
            $fields['comment']=removeEspecialChar($fields['comment']);
            $fields['n']=removeCharForSpaces($fields['n']);
            $fields['id']=intval($fields['id']);
            switch ($fields['id']) {
                case 0:{
                    if(isSessionCorrect()==true){
                        $uuids = session_id();
                        $uuids = explode('-', $uuids);
                        $uuid_user=$uuids[1];
                    }else{
                        $uuid_user='';
                    }
                    $sql="CALL comments_sp(0,NULL,NULL,'{$fields['n']}',NULL,NULL);";
                    $rows=selectQuery($sql);
                    $sql="CALL comments_sp(4,NULL,NULL,'{$fields['n']}',NULL,NULL);";
                    $rows2=selectQuery($sql);
                    $sql="CALL comments_sp(5,NULL,'{$uuid_user}','{$fields['n']}',NULL,NULL);";
                    $rows3=selectQuery($sql);
                    if(!empty($rows)){
                        $info=array();
                        if(!empty($rows2)){
                            $info=connectMainComments($rows,$rows2);
                        }else{
                            $info=$rows;
                        }
                        //$info['permission']=$rows3[0]['permission'];
                        //array_push($info,$rows,$rows2);
                        $result['info']=$info;
                        if(strcmp($uuid_user,'7df77187de42f964ea60872a478f6819')==0){
                            $result['permission']=1;
                        }
                        else{
                            $result['permission']=$rows3[0]['permission'];
                        }
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
                    if(isSessionCorrect()==true){
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
                    }else{
                        $result['success']=false;
                        $result['error'][]='No tiene una cuenta para poder comentar';
                        echo json_encode($result);
                        exit;
                    }

                }break;
                case 2:{
                    if(isSessionCorrect()==true){
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
                    else{
                        $result['success']=false;
                        $result['error'][]='No tiene una cuenta para poder comentar';
                        echo json_encode($result);
                        exit;
                    }
                }
                case 3:{
                    //$uuids = explode('-', $uuids);
                    $sql="CALL comments_sp(3,'{$fields['n']}',NULL,NULL,NULL,NULL);";
                    $isDelete=execQuery($sql);
                    if($isDelete>0){
                        $result['success']=true;
                        echo json_encode($result);
                        exit;
                    }else{
                        $result['success']=false;
                        $result['error'][]='No se pudo borrar el comentario';
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