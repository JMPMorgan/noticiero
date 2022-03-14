<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
    if(!empty($fields)){
        $fields['keyword_valor']=removeEspecialChar($fields['keyword_valor']);
        $uuid=generateRandomToken();
        if(strlen($fields['keyword_valor'])>0){
            $sql="INSERT INTO `keywords` (`word_keywords`,`creation_keywords`,`uuid_keywords`,`status_keywords`) 
            VALUES('{$fields['keyword_valor']}',NOW(),'{$uuid}',1)";
            $isInsert=execQuery($sql);
            if($isInsert>=0){
                $result['success']=true;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                $result['error'][]='No se pudo agregar la informacion a la base de datos recargue la pagina e intente de nuevo';
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result['success']=false;
            $result['error'][]='Ha enviado informacion vacia en alguno de los parametros por favor de rellenar ';
            echo json_encode($result);
            exit;
        }
    }
    else{
        $result['success']=false;
        $result['error'][]='No se recibio la informacion recargue la pagina e intente de nuevo';
        echo json_encode($result);
        exit;
    }
}
else{
    $result['success']=false;
    $result['error'][]='ERROR_SIGNUP';
    echo json_encode($result);
    exit;
}
?>