<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isset($fields['id'])){
        $sql="CALL loadNewsAndSections(0,NULL);";
        $rows=selectQuery($sql);
        $fields['id']=removeEspecialChar($fields['id']);
        $sql="CALL loadNewsAndSections(3,'{$fields['id']}');";
        $rows2=selectQuery($sql);
        $array_rows2=count($rows2);
        if(!empty($rows2)){
        $sql="CALL loadNewsAndSections(4,'{$rows2[0]['uuid_sections']}');";
        $data=selectQuery($sql);
        $data_count=count($data);
        for($i=0;$i<$data_count;$i++){
            $data[$i]['archive']=base64_encode($data[$i]['archive']);
        }
        $rows2[0]['news']=array();
        $rows2[0]['news']=$data;
        if(!empty($rows) && !empty($rows2)){
            $result['success']=true;
            $result['sections_main']=$rows;
            $result['info']=$rows2[0];
            echo json_encode($result);
            exit;
        }
        else{
            $result['success']=false;
            $result['error'][]='No se encontro la informacion';
            echo json_encode($result);
            exit;
        }
        }
        else{
            $result['success']=false;
            echo json_encode($result);
            exit;
        }
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
            $sql="CALL loadNewsAndSections(5,NULL);";
            $rows3=selectQuery($sql);
            //var_dump($rows3);
            $array_rows3=count($rows3);
            for($x=0;$x< $array_rows3;$x++){
                $rows3[$x]['archive']=base64_encode($rows3[$x]['archive']);
            }
            $sql="CALL loadNewsAndSections(6,NULL);";
            $news_visited=selectQuery($sql);
            $count_news=count($news_visited);
            for($x=0;$x<$count_news;$x++){
                $news_visited[$x]['archive']=base64_encode($news_visited[$x]['archive']);
            }
            $result['news_visited']=$news_visited;
            $result['breaking_news']=$rows3;
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