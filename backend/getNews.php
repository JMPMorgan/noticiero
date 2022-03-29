<?php
/*
Este script sirve para cargar la noticia mediante su id
*/
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
try{
    if($isSessionCorrect==true){
        if(!empty($fields)){
            $fields['id']=removeEspecialChar($fields['id']);
            $sql="SELECT * from `news`  t  
            where `news`.`uuid_news`='{$fields['id']}';";
            $rows=selectQuery($sql);
            foreach($rows as $data){
                
                //var_dump($data);

                $info1=base64_encode($data['news_archive1']);
                $html1="<img src='data:image/jpg;base64,".$info1."'>";
                $info2=base64_encode($data['news_archive2']);
                $html2="<img src='data:image/jpg;base64,".$info2."'>";
                $info3=base64_encode($data['news_archive3']);
                $html3="<img src='data:image/jpg;base64,".$info3."'>";
                $info4=base64_encode($data['news_archive4']);
                $html4="<img src='data:image/jpg;base64,".$info4."'>";
                $info5=base64_encode($data['news_archive5']);
                $html5="<img src='data:image/jpg;base64,".$info5."'>";
                array_push($result['info'],$html2);
                array_push($result['info'],$html1);
                array_push($result['info'],$html3);
                array_push($result['info'],$html4);
                array_push($result['info'],$html5);
            }
            //var_dump($rows);
            //array_push($result['info']);
            //$result['info']=$rows;
            echo json_encode($result);

        }else{

        }
    }else{

    }
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
    exit;
}
?>