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
            /*

            getNSK_sp`(IN `opc` int,IN `uuid_newsP` varchar(155))
            opc{
                0:Noticia
                1:Sections
                2:Keywords
                3:Multimedia
            }
            */
            $fields['id']=removeEspecialChar($fields['id']);
            $sql="call getNSK_sp(0,'{$fields['id']}');";
            $rows=selectQuery($sql);
            $sql="call getNSK_sp(1,'{$fields['id']}');";
            $rows2=selectQuery($sql);
            $sql="call getNSK_sp(3,'{$fields['id']}');";
            $rows3=selectQuery($sql);
            $sql="Call getNSK_sp(2,'{$fields['id']}');";
            $rows4=selectQuery($sql);
            foreach($rows as $data){
                $result['info']['news_active']=$data['news_active'];
                $result['info']['news_description']=$data['news_description'];
                $result['info']['news_text']=$data['news_text'];
                $result['info']['news_status']=$data['news_status'];
                $result['info']['uuid_news']=$data['uuid_news'];
                $result['info']['news_date']=$data['news_date'];
                $result['info']['news_publication']=$data['news_publication'];
                $result['info']['news_creation']=$data['news_creation'];
                $result['info']['uuid_userC']=$data['uuid_userC'];
                $result['info']['news_title']=$data['news_title'];
            }
            $sections=array();
            $contador=0;
            foreach($rows2 as $data_sections){

                $sections[$contador]=array();
                $sections[$contador]['section_name']=$data_sections['section_name'];
                $sections[$contador]['uuid_sections']=$data_sections['uuid_sections'];
                $contador++;
            }
            $result['info']['sections_info']=$sections;
            $keywords=array();
            $contador=0;
            foreach($rows4 as $data_keywords){
                $keywords[$contador]=array();
                $keywords[$contador]['uuid_keywords']=$data_keywords['uuid_keywords'];
                $keywords[$contador]['word_keywords']=$data_keywords['word_keywords'];
                $contador++;
            }
            $result['info']['keywords_info']=$keywords;
            $dataimages=array();
            $contador=0;
            foreach($rows3 as $data_archive){
                $dataimages[$contador]=array();
                $dataimages[$contador]['type_archive']=$data_archive['type_archive'];
                $dataimages[$contador]['uuid']=$data_archive['idmulti_news'];
                $dataimages[$contador]['name']=$data_archive['name_archive'];
                $dataimages[$contador]['archive']=base64_encode($data_archive['archive']);
                $contador++;
            }
            $result['info']['archive_info']=$dataimages;
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