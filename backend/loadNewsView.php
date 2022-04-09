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
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
try{
    if($isSessionCorrect==true){
        $fields['id']=removeEspecialChar($fields['id']);
        $sql="SELECT `getStatusNews`('{$fields['id']}') as `status`;";
        /*
        CREATE FUNCTION `getStatusNews` (uuid varchar(155))
            RETURNS INTEGER
                BEGIN
                declare status int;
                SELECT `news`.`news_status` into status FROM `news` WHERE `news`.`uuid_news`=uuid;
            RETURN status;
        END$$
        */
        $rows=selectQuery($sql);
        if(!empty($rows)){
            $status=intval($rows[0]['status']);
            $informacion=array();
            //Obtenemos el status de la noticia dependiendo de eso varia el query que se 
            //solicita en la base de datos
            switch($status){
                case 0:{
                    break;
                }
                case 1:{//CASO ENVIADO PARA REVISION POR ADMIN
                    $sql="CALL getNSK_sp(0,'{$fields['id']}'); ";
                    $rows=selectQuery($sql);
                    $sql="CALL getNSK_sp(3,'{$fields['id']}');";
                    $data_multimedia=selectQuery($sql);
                    $sql="CALL getNSK_sp(1,'{$fields['id']}');";
                    $data_sections=selectQuery($sql);
                    $sql="CALL getNSK_sp(2,'{$fields['id']}')";
                    $data_keywords=selectQuery($sql);
                    $sql="CALL getNSK_sp(4,'{$fields['id']}');";
                    $data_user=selectQuery($sql);
                    if(!empty($rows)){
                        $informacion['news_info']=getInformationNews($rows[0]);
                        $informacion['news_info']['news_date']=date("d/m/Y",strtotime($informacion['news_info']['news_date']));
                        $informacion['news_info']['news_publication']=date("d/m/Y",strtotime($informacion['news_info']['news_publication']));
                        
                    }
                    else{
                        $informacion['news_info']='';
                    }
                    if(!empty($data_multimedia)){
                        $informacion['multimedia_info']=getMultimediaNews($data_multimedia);
                        
                    }
                    else{
                        $informacion['multimedia_info']='';
                    }
                    if(!empty($data_sections)){
                        $informacion['sections_info']=getSectionsNews($data_sections);
                        
                    }else{
                        $informacion['sections_info']='';
                    }
                    if(!empty($data_keywords)){
                        $informacion['keywords_info']=getKeywordsNews($data_keywords);
                    }else{
                        $informacion['keywords_info']='';
                    }
                    if(!empty($data_user)){
                        $informacion['user_info']=getUserNews($data_user[0]);

                    }else{
                        $informacion['user_info']='';
                    }

                    if(count($informacion)>0){
                        $result['info']=$informacion;
                    }
                    break;
                }
                default:{
                    $result['success']=false;
                    $result['error'][]='No existe ningun caso para esta peticion';
                    echo json_encode($result);
                    exit;
                    break;
                }
            }
            if(count($result['info'])>0){
                $result['success']=true;
                echo json_encode($result);
                exit;
            }else{
                $result['success']=false;
                $result['error'][]='No se obtuvo ninguna informacion de la api';
                echo json_encode($result);
                exit;
            }
        }else{
            $result['success']=false;
            $result['error'][]='No se pudo obtener el status de la noticia';
        }
    }else{
        $result['success']=false;
        $result['error'][]='La seccion es incorrecta';
    }
    echo json_encode($result);
    exit;
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
    exit;
}



function getInformationNews($info_news){
    $return=array();
    $return['news_active']=$info_news['news_active'];
    $return['news_description']=$info_news['news_description'];
    $return['news_status']=$info_news['news_status'];
    $return['uuid_news']=$info_news['uuid_news'];
    $return['news_date']=$info_news['news_date'];
    $return['news_publication']=$info_news['news_publication'];
    $return['news_creation']=$info_news['news_creation'];
    $return['news_text']=$info_news['news_text'];
    $return['uuid_user']=$info_news['uuid_userC'];
    $return['news_title']=$info_news['news_title'];
    return $return;
}

function getMultimediaNews($multimedia){
    $return=array();
    $contador=0;
    foreach($multimedia  as $data){
        $return[$contador]['idmulti_news']=$data['idmulti_news'];
        $return[$contador]['type_archive']=$data['type_archive'];
        $return[$contador]['name_archive']=$data['name_archive'];
        $return[$contador]['archive']=base64_encode($data['archive']);
        $return[$contador]['cretion_time']=$data['creation_time'];
        $return[$contador]['lastM_multinews']=$data['lastM_multinews'];
        $contador++;
    }
    return $return;

}


function getSectionsNews($sections){
    $return=array();
    $contador=0;
    foreach($sections as $data){
        $return[$contador]['section_name']=$data['section_name'];
        $return[$contador]['uuid_sections']=$data['uuid_sections'];
        $return[$contador]['sections_active']=$data['sections_active'];
        $return[$contador]['sections_color']=$data['sections_color'];
        $return[$contador]['sections_lastM']=$data['sections_lastM'];
        $return[$contador]['sections_creation']=$data['sections_creation'];
        $return[$contador]['sections_status']=$data['sections_status'];
        $contador++;
    }
    return $return;
}

function getKeywordsNews($keywords){
    $return=array();
    $contador=0;
    foreach($keywords as $data){
        $return[$contador]['uuid_keywords']=$data['uuid_keywords'];
        $return[$contador]['word_keywords']=$data['word_keywords'];
        $return[$contador]['status_keywords']=$data['status_keywords'];
        $return[$contador]['lastM_keywords']=$data['lastM_keywords'];
        $return[$contador]['creation_keywords']=$data['creation_keywords'];
        $contador++;
    }
    return $return;
}


function getUserNews($user){
    $return=array();
    $return['user_status']=$user['user_status'];
    $return['user_name']=$user['user_name'];
    $return['user_email']=$user['user_email'];
    $return['user_lastname']=$user['user_lastname'];
    $return['user_nick']=$user['user_nick'];
    return $return;
}
?>
