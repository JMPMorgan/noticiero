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
            //Obtenemos el status de la noticia dependiendo de eso varia el query que se 
            //solicita en la base de datos
            switch($status){
                case 0:{
                    break;
                }
                case 1:{
                    $sql="  SELECT `news`.*,
                    `users`.`user_name`,
                    `users`.`user_lastname`
                    FROM `news`
                    INNER JOIN `users` ON `users`.`user_uuid`=`news`.`uuid_userC` 
                    WHERE `news`.`news_status`=1 
                    AND `news`.`uuid_news`='{$fields['id']}';";
                    $rows=selectQuery($sql);
                    break;
                }
                
                default:{
                    $result['success']=false;
                    $result['error'][]='No existe ningun caso para esta peticion';
                    echo json_encode($result);
                    break;
                }
            }
            $data=array();
            $informacion=array();
            if(!empty($rows)){
                foreach($rows as $archivos){    
                    /*
                    Se obtiene las imagenes de cualquiera de los querys solicitidos
                    para despues encriptarlos en base 64 para enviarlos en formato JSON 
                    a donde se solicite
    
                    La logica del for es que se recorra a 5 
                    ese numero depende que cuantos archivos quieras tener en tu tabla si quieres 
                    recorrer mas solo aumenta ese numero
                    */
                    for ($i=1 ; $i <= 5 ; $i++ ) { 
                        if(strlen($archivos['news_archive'.$i]>0)){
                            $archivo=base64_encode($archivos['news_archive'.$i]);
                            array_push($data,$archivo);
                        }
                    }
                    $informacion['news_active']=$archivos['news_active'];
                    $informacion['news_description']=$archivos['news_description'];
                    $informacion['news_status']=$archivos['news_status'];
                    $informacion['uuid_news']=$archivos['uuid_news'];
                    $informacion['news_date']=$archivos['news_date'];
                    $informacion['news_publication']=$archivos['news_publication'];
                    $informacion['news_creation']=$archivos['news_creation'];
                    $informacion['news_text']=$archivos['news_text'];
                    $informacion['uuid_user']=$archivos['uuid_userC'];
                    $informacion['news_title']=$archivos['news_title'];
                    $informacion['user_name']=$archivos['user_name'].' '.$archivos['user_lastname'];
                }

                /*
                de la informacion que obtuve a la tabla de noticias
                obtengo sus secciones y su keywords para enviarlas todas directamente en el JSON 
                para que el programador desee hacer lo que quiera con la info 
                */
                $sql="SELECT `uuid_section`
                FROM `news_sections` 
                WHERE `uuid_news`='{$informacion['uuid_news']}';";
                $rows=selectQuery($sql);
                $informacion['sections']=array();
                foreach($rows as $sections_info){
                    $sql="SELECT `section_name` FROM `sections` WHERE `uuid_sections`='{$sections_info['uuid_section']}';";
                    $name_sections=selectQuery($sql);
                    $array_sections=array();
                    $array_sections['uuid']=$sections_info['uuid_section'];
                    $array_sections['name']=$name_sections[0]['section_name'];
                    array_push($informacion['sections'],$array_sections);   
                }
    
                $sql="SELECT `uuid_keywords`
                FROM `news_keywords`
                WHERE `uuid_news`='{$informacion['uuid_news']}';";
                $rows=selectQuery($sql);
                $informacion['keywords']=array();
                foreach($rows as $keywords_info){
                    $sql="SELECT `word_keywords` FROM `keywords` WHERE `uuid_keywords`='{$keywords_info['uuid_keywords']}';";
                    $name_keywords=selectQuery($sql);
                    $array_keywords=array();
                    $array_keywords['uuid']=$keywords_info['uuid_keywords'];
                    $array_keywords['name']=$keywords_info[0]['section_name'];
                }
                if(count($data)>0 && count($informacion)>0){//Se pregunta para ver si se obtuvo algun archivo
                    $result['success']=true;
                    $result['info']['archivos']=$data;
                    $result['info']['data']=$informacion;
                }
                else{
                    $result['success']=false;
                    $result['error'][]='No se pudo obtener la informacion adicional a la noticia';
                }
            }else{
                $result['success']=false;
                $result['error'][]='No se pudo obtener la noticia';
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
?>