<?php
/*
                PARA STATUS DE LA NOTICIA
                0-> Editada
                1->Enviada A revision
                2->Regresada por error
                3->Publicada
*/
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
try{
    if($isSessionCorrect==true){
        $sql="CALL countNotificationsAdmi(0)";
        $rows=selectQuery($sql);
        $sql="CALL countNotificationsAdmi(1)";
        $rows2=selectQuery($sql);
        $sql="CALL countNotificationsAdmi(2)";
        $rows3=selectQuery($sql);
        $sql="CALL countNotificationsAdmi(3)";
        $rows4=selectQuery($sql);
        if(!empty($rows) && !empty($rows2) && !empty($rows3) && !empty($rows4)){
            $result['success']=true;
            $result['info']['today']=$rows[0];
            $result['info']['this_week']=$rows2[0];
            $result['info']['weeks']=$rows3[0];
            $result['info']['prev']=$rows4[0];
            echo json_encode($result);
        }
        else{
            $result['success']=false;
            //array_push($result['info'],$rows);
            $result['error'][]='No se pudo encontar un ninguna noticia para evaluar';
            echo json_encode($result);
        }

    }
    else{
        $result['success']=false;
        $result['logged']=false;
        echo json_encode($result);
    }
    exit;
}
catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>