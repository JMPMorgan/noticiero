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
        $sql=" SELECT `news`.`news_text`,`news`.`news_title`,
        `news`.`uuid_news`,`news`.`uuid_userC`,`users`.`user_name`
        ,`users`.`user_lastname`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`
        FROM `news` 
        INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC`
        WHERE `news`.`news_status`=1;";
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $result['success']=true;
            $result['info']=$rows;
            echo json_encode($result);
        }
        else{
            $result['success']=false;
            //array_push($result['info'],$rows);
            $result['error'][]='No se pudo encontar un ninguna noticia para evaluar';
            echo json_encode($result);
        }

    }
}
catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>