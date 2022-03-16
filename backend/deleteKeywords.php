<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
$isSessionCorrect=isSessionCorrect();
if($isSessionCorrect==true){
    if(!empty($fields)){
        $fields['uuid']=removeCharForSpaces($fields['uuid']);
        if(strlen($fields['uuid'])>0){
            $sql="UPDATE `keywords` SET `status_keywords`=0  WHERE `uuid_keywords`='{$fields['uuid']}';";
            $isUpdated;
            try{
                $isUpdated=execQuery($sql);
            }
            catch(Exception $e){
                $result['success']=false;
                $result['error'][]=$e->getMessage();
                echo json_encode($result);
                exit;
            }
            if(is_numeric($isUpdated)){
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
}else{
    $result['success']=false;
    $result['error'][]='La sesion no es correcta por favor recargue la pagina e intente de nuevo';
    echo json_encode($result);
    exit;    
}
?>