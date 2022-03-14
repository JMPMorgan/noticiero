<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
    if(!empty($fields)){
        $fields['color_valor']=removeCharForSpaces($fields['color_valor']);
        $fields['section_valor']=removeEspecialChar($fields['section_valor']);
        $uuid=generateRandomToken();
        if(strlen($fields['color_valor'])>0 && strlen($fields['section_valor'])>0){
            $sql="INSERT INTO `sections` (`section_name`,`sections_color`,`sections_active`,`sections_status`,
            `sections_creation`,`sections_lastM`,`uuid_sections`) 
            VALUES('{$fields['section_valor']}','{$fields['color_valor']}',1,0,NOW(),NOW(),'{$uuid}')";
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