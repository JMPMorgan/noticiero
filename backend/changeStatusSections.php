<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
$isSessionCorrect=isSessionCorrect();
if($isSessionCorrect==true){
    if(!empty($fields)){
        $fields['status']=removeEspecialChar($fields['status']);
        $fields['uuid']=removeCharForSpaces($fields['uuid']);
        if(is_numeric($fields['status'])&& strlen($fields['uuid']>0)){
            if($fields['status']==100){
                $sql="CALL sections(6,NULL,NULL,NULL,NULL);";
                $howManyStatusMax=selectQuery($sql);
                $howManyStatusMax=$howManyStatusMax[0]['numero'];
            }else{
                $howManyStatusMax=0;
            }
            if($howManyStatusMax<5){
                $sql="CALL sections(4,NULL,NULL,'{$fields['status']}','{$fields['uuid']}');";
                //$sql="UPDATE `sections` SET `sections_status`={$fields['status']} WHERE `uuid_sections`='{$fields['uuid']}' ;";
                $isUpdated=execQuery($sql);
                if(is_numeric( $isUpdated)){
                    $result['success']=true;
                    echo json_encode($result);
                    exit;
                }
                else{
                    $result['success']=false;
                    $result['error'][]='No se pudo cambiar el status por favor recargue la pagina e intente de nuevo';
                    echo json_encode($result);
                    exit;
                }
            }else{
                $result['success']=false;
                $result['error'][]='Solo se puede tener como principales 5 secciones';
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result['success']=false;
            $result['error'][]=$fields['status'];
            $result['error'][]='El dato enviado no es un el adecuado, recargue la pagina e intente de nuevo';
            echo json_encode($result);
            exit; 
        }
    }
    else{
        $result['success']=false;
        $result['error'][]='No se obtuvo ninguna informacion por favor recargue la pagina e intente de nuevo';
        echo json_encode($result);
        exit;
    }
}
else{
    $result['success']=false;
    $result['error'][]='La sesion no es correcta por favor recargue la pagina e intente de nuevo';
    echo json_encode($result);
    exit;
}
?>
