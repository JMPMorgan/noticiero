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
        $fields['importance_valor']=removeCharForSpaces($fields['importance_valor']);
        $fields['importance_valor']=intval($fields['importance_valor']);
        $uuid=generateRandomToken();
        if(strlen($fields['color_valor'])>0 && strlen($fields['section_valor'])>0){
            $sql="CALL sections(1,'{$fields['section_valor']}',NULL,NULL,NULL);";
            $rows=selectQuery($sql);
            if($rows[0]['numero']==0){
                $sql="CALL sections(0,'{$fields['section_valor']}','{$fields['color_valor']}','{$fields['importance_valor']}','{$uuid}');";
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
            }else{
                $result['success']=false;
                $result['error'][]='Existe este nombre de seccion,ingrese uno nuevo diferente';
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