<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
 if(isSessionCorrect()==true){
    $fields['data']=removeEspecialChar($fields['data']);
    $sql="CALL getNSK_sp(6,'{$fields['data']}');";
    $isUpdated=execQuery($sql);
    if($isUpdated>0){
        $result['success']=true;
    }else{
        $result['success']=false;
        $result['error'][]='No se pudo eliminar la noticia';
    }
 }else{
     $result['success']=false;
     $result['error'][]='No se pudo encontrar la sesion';
 }
 echo json_encode($result);
 exit;
}catch(Exception $e){  
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}

?>