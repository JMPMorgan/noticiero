<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if($fields['id']==0){
        if(strlen($fields['title'])>0){
            $fields['title']=removeEspecialChar($fields['title']);
            $sql="CALL searchNews(0,'{$fields['title']}',NULL,NULL,NULL,NULL,NULL);";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $array_row=count($rows);
                for($x=0;$x<$array_row;$x++){
                    $rows[$x]['archive']=base64_encode($rows[$x]['archive']);
                }
                $result['success']=true;
                $result['info']=$rows;
                echo json_encode($result);
                exit;
            }
            else{
                $result['success']=false;
                $result['error'][]='No se pudo encontar ninguna noticia';
                echo json_encode($result);
                exit;
            }
        }else{
            $result['succss']=false;
            $result['error'][]='No se encontro ningun titulo para buscar';
            echo json_encode($result);
            exit;
        }
    }elseif($fields['id']==1){
        //var_dump($fields);
        $fields['title']=removeEspecialChar($fields['title']);
        $fields['description']=removeEspecialChar($fields['description']);
        if(isset($fields['keywords'])){
            $array_keywords=count($fields['keywords']);
            for($i=0;$i<$array_keywords;$i++){
                /*
                Remueve caracteres peligrosos para la BD
                luego se añade al final de la cadena
                */
                $fields['keywords'][$i]=removeEspecialChar($fields['keywords'][$i]);
                $fields['keywords'][$i]=$fields['keywords'][$i].'|';
            }
            //Implode sirve para unir el array para enviarlo en un solo texto a mysql
            $sql="CALL searchNews(1,'{$fields['title']}','{$fields['description']}'
            ,'{$fields['start_date']}','{$fields['end_date']}',
            '".implode("','",$fields['keywords'])."',{$array_keywords});";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $array_rows=count($rows);
                for($i=0;$i<$array_rows;$i++){
                    $rows[$i]['archive']=base64_encode($rows[$i]['archive']);
                }
                $result['success']=true;
                $result['info']=$rows;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                echo json_encode($result);
                exit;   
            }
        }
        else{
            $sql="CALL searchNews(1,'{$fields['title']}','{$fields['description']}'
            ,'{$fields['start_date']}','{$fields['end_date']}',NULL,0);";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $array_rows=count($rows);
                for($i=0;$i<$array_rows;$i++){
                    $rows[$i]['archive']=base64_encode($rows[$i]['archive']);
                }
                $result['success']=true;
                $result['info']=$rows;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                echo json_encode($result);
                exit;   
            }
        }
    }elseif($fields['id']==2){
        $fields['title']=removeEspecialChar($fields['title']);
        if(isSessionCorrect()==true){
            $uuids = explode('-', session_id());
        }else{
            $result['success']=false;
            $result['logged']=true;
            echo json_encode($result);
            exit;
        }
        if(isset($fields['sections'])){
            $array_sections=count($fields['sections']);
            for($i=0;$i<$array_sections;$i++){
                $fields['sections'][$i]=removeEspecialChar($fields['sections'][$i]);
                $fields['sections'][$i]=$fields['sections'][$i].'|';
            }
            $sql="CALL searchNews(2,'{$fields['title']}','{$uuids[1]}','{$fields['start_date']}','{$fields['end_date']}'
                ,'".implode(",",$fields['sections'])."','{$array_sections}');";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $result['success']=true;
                $result['info']=$rows;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                echo json_encode($result);
                exit;
            }
        }else{
            $sql="CALL searchNews(2,'{$fields['title']}','{$uuids[1]}','{$fields['start_date']}','{$fields['end_date']}'
                ,NULL,0);";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $result['success']=true;
                $result['info']=$rows;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                echo json_encode($result);
                exit;
            }
        }
    }

}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>