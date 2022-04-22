<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    $sql="CALL sections(8,NULL,NULL,NULL,NULL);";
    $rows=selectQuery($sql);
    if(!empty($rows)){
        $result['success']=true;
        $result['info']=$rows;
        echo json_encode($result);
        exit;
    }else{
        $result['success']=false;
        $result['error'][]='No se obtuvo las secciones';
        echo json_encode($result);
        exit;   
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>