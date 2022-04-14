<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isset($fields['id'])){

    }else{
        $sql="CALL loadNewsAndSections(0,NULL);";
        $rows=selectQuery($sql);
        $sql="CALL loadNewsAndSections(1,NULL);";
        $rows2=selectQuery($sql);
        $array_rows2=count($rows2);
        for($i=0;$i<$array_rows2;$i++){
            $sql="CALL loadNewsAndSections(2,'{$rows2[$i]['uuid_sections']}');";
            $data=selectQuery($sql);
            $data_count =count($data);
            for($y=0;$y<$data_count;$y++){
                $data[$y]['archive']=base64_encode($data[$y]['archive']);
            }
            /*
            foreach($data as $news){
                $news['archive']=base64_encode($news['archive']);
            }*/
            $rows2[$i]['news']=array();
            $rows2[$i]['news']=$data;
        }
        if(!empty($rows) && !empty($rows2)){
            $result['success']=true;
            $result['sections_main']=$rows;
            $result['info']=$rows2;
            echo json_encode($result);
        }
        else{
            $result['success']=false;
            $result['error'][]='No se encontro la informacion';
            echo json_encode($result);
        }
        /*
        foreach($rows2 as $data){
            $sql="CALL loadNewsAndSections(2,'{$data['uuid_sections']}');";

        }*/
        //$sql="CALL "
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
}
?>