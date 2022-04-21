<?php
    require_once('../backend/PDO/PDO.php');
    require_once('../backend/Auxiliar/auxiliarMethods.php');
    $isCorrect=isSessionCorrect();
    if($isCorrect==1){
        $result = array('error'=>array());
        $sql="CALL usersSP(10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
        //$sql="SELECT `user_name`,`user_lastname`,`user_nick`,`user_uuid` FROM `users` WHERE `user_type`=1;";
        $rows=selectQuery($sql);
        $i=0;
        if(!empty($rows)){
            foreach($rows as $info){
                $info['user_uuid']=encode($info['user_uuid']);
                $result['info'][$i]=$info;
                $i++;
            }
            $result['success']=true;
            echo json_encode($result);
        }
        else{
            $result['success']=false;
            $result['error'][]='No se pudo encontrar a ningun reportero registrado,si hay algun error por favor contactar a un tecnico';
            echo json_encode($result);
            exit;
        }
    }
    else{
        $result['success']=false;
        $result['error'][]=1;
        echo json_encode($result);
        exit;
    }
?>