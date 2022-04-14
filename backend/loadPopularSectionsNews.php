<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    $sql="SELECT * FROM `popularnews`;";
    $rows=selectQuery($sql);
    if(!empty($rows)){    
        $rows=encodeImage($rows);
    }
    $sql="SELECT * FROM `popularsections`;";
    $rows2=selectQuery($sql);
    /*var_dump($rows);
    var_dump($rows2);*/

    $result['info']['sections']=$rows2;
    $result['info']['news']=$rows;
    echo json_encode($result);
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
}

function encodeImage($data){
    $contador=0;
    foreach($data as $info){
        $data[$contador]['archive']=base64_encode($info['archive']);
        //$info['archive']=base64_encode($info['archive']);
        $contador++;
    }
    return $data;
}
?>