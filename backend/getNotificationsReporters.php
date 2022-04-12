<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
if($isSessionCorrect==true){
        $result=array('info'=>array());
        $session_id=session_id();
        $uuids=explode("-",$session_id);
        /*
        0->noticias modificacion
        1->Enviada para revision
        2->Publicadas esta semana
        3->mensaje de eliminacion
        */
        $rows=array();
        for ($i=0; $i < 4; $i++) { 
            $sql="CALL notificationsReporter('{$i}','{$uuids[1]}');";
            $data=selectQuery($sql);
            array_push($rows,$data);
        }
        if(!empty($rows)){
            $info=array();
            $info=getInfoNotifications($rows);
            $result['info']=getInfoNotifications($rows);
        }else{
            $result['error'][]='No se pudo encontrar ninguna notificacion';
        }
        /*
        foreach($rows as $row){
            switch($row['communication_message']){
                case 'ELIMINACION':{
                    $result['info'][]='ELIMINACION';
                    break;
                }
                default:{
                    $result['error'][]='No se especifico el caso que solicita';
                    break;
                }
            }
        }*/
        if(!isset($result['error'])){
            $result['success']=true;
            echo json_encode($result);
            exit;
        }
        else {
            $result['success']=false;
            echo json_encode($result);
            exit;
        }
        
}


function getInfoNotifications($datas){
    $contador_main=0;
    $return=array();
    foreach($datas as $data){
        $return[$contador_main]=array();
        if($contador_main!=3){
            $contador=0;
            $return[$contador_main][$contador]=array();
            foreach($data as $info){
                
                 $return[$contador_main][$contador]['communication_message']=$info['communication_message'];
                 $return[$contador_main][$contador]['uuid_news']=$info['uuid_referencenews'];
                 $return[$contador_main][$contador]['type_archive']=$info['type_archive'];
                 $return[$contador_main][$contador]['name_archive']=$info['name_archive'];
                 $return[$contador_main][$contador]['archive']=base64_encode($info['archive']);
                 $return[$contador_main][$contador]['news_status']=$info['news_status'];
                 $return[$contador_main][$contador]['news_date']=$info['news_date'];
                 $return[$contador_main][$contador]['news_title']=$info['news_title'];
                 $return[$contador_main][$contador]['news_text']=$info['news_text'];
                 $return[$contador_main][$contador]['communication_date']=$info['communication_date'];
                 $contador++;
            }
        }else{
            $contador=0;
            $return[$contador_main][$contador]=array();
            foreach($data as $info){
                $return[$contador_main][$contador]['communication_message']=$info['communication_message'];
                $return[$contador_main][$contador]['communication_status']=$info['communication_status'];
                $return[$contador_main][$contador]['communication_date']=$info['communication_date'];
                $return[$contador_main][$contador]['uuid_news']=$info['uuid_referencenews'];
                $contador++;
            }
        }
        $contador_main++;
    }
    return $return;
}
?>