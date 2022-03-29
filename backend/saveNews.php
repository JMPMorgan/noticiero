<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
try {
    if ($isSessionCorrect == true) {
        if (!empty($fields)) {
            if (!empty($_FILES)) {
                array_push($fields, $_FILES);
            } else {
                $result['success']=false;
                $result['error'][]='No se obtuvo ningun archivo';
                exit;
            }
            $fields['title'] = removeEspecialChar($fields['title']);
            $fields['editor'] = removeEspecialChar($fields['editor']);
            $fields['sectiones'] = removeEspecialChar($fields['sectiones']);
            $result = validations($fields['title'], $fields['editor'], $fields['sectiones'], $fields[0]);

            if ($result['success'] == true) {
                $uuid = generateRandomToken();
                $uuids = session_id();
                $uuids = explode('-', $uuids);
                $sql=beginTransction()==true?'Se hizo':'No se hizo';

                /*
                PARA STATUS DE LA NOTICIA
                0-> Editada
                1->Enviada A revision
                2->Regresada por error
                3->Publicada
                */
                $sql = "INSERT INTO `news`(`news_text`,`news_title`,`uuid_news`,`uuid_userC`,`news_creation`,`news_active`) 
                VALUES('{$fields['editor']}','{$fields['title']}','{$uuid}','{$uuids[1]}',NOW(),1);";
                $isInsert = execQuery($sql);
                if ($isInsert > 0) {
                   $archivos=$fields[0];
                   $numero_archivo = 1;
                    foreach ($archivos as $archivo) { 
                        $archivo_objetivo = fopen($archivo['tmp_name'], 'r');
                        $contenido = fread($archivo_objetivo, $archivo['size']);
                        $contenido=addslashes($contenido);
                        fclose($archivo_objetivo);
                        $sql = "UPDATE `news` SET `news_archive".$numero_archivo."`='{$contenido}' WHERE `uuid_news`='{$uuid}';";
                        $isInsertArchive = execQuery($sql);
                        if ($isInsertArchive == 0) {
                            $result['error'][] = 'No se pudo ingresar el archivo: ' . $archivo['name'];
                            $result['success'] = false;
                            rollback();
                            exit;
                        }
                        $numero_archivo++;
                    }
                    $sectiones = explode(',', $fields['sectiones']);
                    foreach ($sectiones as $seccion) {
                        $sql = "INSERT INTO `news_sections`(`uuid_news`,`uuid_section`,`news_sections_date`)
                        VALUES ('{$uuid}','{$seccion}',NOW());";
                        $isInsert = execQuery($sql);
                        if ($isInsert == 0) {
                            $result['error'][] = 'No se puede ingresar la seccion ' . $seccion . ' en la noticia';
                            $result['success'] = false;
                            rollback();
                        }
                    }
                    if ($result['success'] == true) {
                        commit();
                        
                        //ESTO SE VA QUITAR PARA DESPUES DEL SEGUNDO AVANCE
                        $uuid=encode($uuid);
                        $result['info'][]=$uuid;
                        //ESTO SE VA QUITAR PARA DESPUES DEL SEGUNDO AVANCE
                        echo json_encode($result);
                        exit;
                    } else {
                        rollback();
                        echo json_encode($result);
                        exit;
                    }
                    echo json_encode($result);
                    exit;
                } else {
                    $result['error'][] = 'No se pudo ingresar la noticia';
                    $result['success'] = false;
                    rollback();
                    exit;
                }
            }
            else{
                echo json_encode($result);
                exit;
            }
        } else {
            $result['error'][] = 'No se obtuvo ningun archivo,recargue la pagina e intente de nuevo';
            $result['success'] = false;
            exit;
        }
    }
}
catch(Exception $e){
    $result['error'][]=$e->getMessage();
    $result['success']=false;
    echo json_encode($result);
    rollback();
    exit;
}

function validations($title,$editor,$sectiones,$archivos){
    $result=array('error'=>array());
    if(strlen($title)<=0){
        $result['error'][]='Debe incluir un titulo';
    }
    if(strlen($editor)<=0){
        $result['error'][]='Debe Tener texto el editor';
    }
    if(strlen($sectiones)<=0){
        $result['error'][]='Debe tener seleccionada minimo una seccion';
    }
    foreach($archivos as $archivo){
         $image_type=getImageType( $archivo['type']);
         $image_size=$archivo['size'];
         if($image_type=='error_type'){
            $result['error'][]='El Archivo '.$archivo['name'].' es de un formato incorrecto';

         }
         else{
             if($image_size >= 16000000){
                 $result['error'][]='El archivo '.$archivo['name'].' es demasiado grande maximo 16Mb';
             }
         }
        //$image_type=getImageType($archivo)
    }
    if(count($result['error'])==0){
        $result['success']=true;
        return $result;
    }else{
        $result['success']=false;
        return;
    }
}
?>