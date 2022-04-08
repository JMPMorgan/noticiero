<?php
/*
                PARA STATUS DE LA NOTICIA
                0-> Editada
                1->Enviada A revision
                2->Regresada por error
                3->Publicada
*/
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isSessionCorrect()==true){
        $fields['id']=intval($fields['id']);
        switch($fields['id']){
            case 0:{
                $sql="CALL notificationsAdmin(0);";
                $rows=selectQuery($sql);
                break;
            }
            case 1:{
                $sql="CALL notificationsAdmin(1);";
                $rows=selectQuery($sql);
                break;
            }
            case 2:{
                $sql="CALL notificationsAdmin(2);";
                $rows=selectQuery($sql);
                
                break;
            }
            case 3:{
                $sql="CALL notificationsAdmin(3);";
                $rows=selectQuery($sql);
                break;
            }
            default:{
                $result['success']=false;
                $result['error'][]='No hay ningun opcion para esta opcion';
                echo json_encode($result);
                break;
                
            }
        }
        if(!empty($rows)){
            $contador=0;
            foreach($rows as $data){
                
                $result['info'][$contador]['news_text']=$data['news_text'];
                $result['info'][$contador]['news_title']=$data['news_title'];
                $result['info'][$contador]['news_date']=$data['news_date'];
                $result['info'][$contador]['uuid_news']=$data['uuid_news'];
                $result['info'][$contador]['uuid_user']=$data['uuid_userC'];
                $result['info'][$contador]['user_name']=$data['user_name'].' '.$rows[0]['user_lastname'];
                //$result['info']['user_lastname']=$rows[0]['user_lastname'];
                $result['info'][$contador]['news_creation']=$data['news_creation'];
                $result['info'][$contador]['archive']=base64_encode($data['archive']);
                $result['info'][$contador]['type_archive']=$data['type_archive'];
                $result['info'][$contador]['name_archive']=$data['name_archive'];
                $contador++;
                
            }
            $result['success']=true;
            echo json_encode($result);
            exit;
        }
        
    }else{
        $result['success']=false;
        $result['logged']=false;
        echo json_encode($result);
    }
    exit;
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;
}
?>