<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result = array('info' => array());
try{
    if(isSessionCorrect()==true){
        if(!empty($fields)){
            $fields['data']=removeEspecialChar($fields['data']);
            $sql="CALL searchKeywords('{$fields['data']}');";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $result['info']=$rows;
                $result['success']=true;
                echo json_encode($result);
                exit;
            }
            else{
                $result['success']=false;
                echo json_encode($result);
                exit;
            }
        }else{
            $result['error'][]='No se pudo obtener la informacion de busqueda';
            $result['success']=false;
            echo json_encode($result);
        }
    }else{
        $result['logged']=false;
        echo json_encode($result);
    }
}catch(Exception $e){
    $result['error'][] = $e->getMessage();
    $result['success'] = false;
    echo json_encode($result);
}
?>