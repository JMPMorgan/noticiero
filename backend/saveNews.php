<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields = (empty($_GET) ? $_POST : $_GET);
$isSessionCorrect = isSessionCorrect();
$result = array('info' => array());
try {
    if ($isSessionCorrect == true) {
        if (!empty($fields)) {
            $fields['title'] = removeEspecialChar($fields['title']);
            $fields['editor'] = removeEspecialChar($fields['editor']);
            $fields['sectiones'] = removeEspecialChar($fields['sectiones']);
            $fields['date']=removeEspecialChar($fields['date']);
            if (isset($fields['id'])) { //Pregunta si contiene el id que estoy significa que es un upfate
                //Pregunta si esta declarada la variable para poder agarrar el numero de archivos que quiero eliminar
                $num_archivos_delete = $fields['archivos_delete'] == '' ? 0 : count(explode(",",$fields['archivos_delete']));
                $fields['id'] = removeEspecialChar($fields['id']);
                $sql = "SELECT `getMultimediaFromID` ('{$fields['id']}') AS `numero`;";
                $rows = selectQuery($sql);
                $numero = intval($rows[0]['numero']); //Convertimos a int el count que obtuvimos del query
                $numeros_archivos_nuevo = intval($numero) - intval($num_archivos_delete);
            }
            if (!empty($_FILES)) {
                array_push($fields, $_FILES);
                $numero_archivos = intval(count($_FILES)); //Obtiene la cantidad de archivos que se quieren subir
            } else {
                if(!isset($fields['id'])){//Pregunta si no esta declarada para saber si se quiere hacen cambios en los archivos
                    $result['success'] = false;
                    $result['error'][] = 'No se obtuvo ningun archivo';
                    echo json_encode($result);
                    exit;
                }else{
                    $numero_archivos=0;
                }
            }
            if (isset($numeros_archivos_nuevo)) {
                if ($numeros_archivos_nuevo + $numero_archivos > 5) {
                    $result['success'] = false;
                    $result['error'][] = 'Los archivos que quiere ingresar sobre pasa los permitidos que son 5';
                    echo json_encode($result);                
                    exit;
                }
            }
            if(isset($fields['id'])){
                $result=validationsWithOutArchivos($fields['title'],$fields['editor']);
            }   
            else{
                $result = validations($fields['title'], $fields['editor'], $fields['sectiones'], $fields['keywords'],$fields[0]);    
            }
            if ($result['success'] == true) {
                $uuids = session_id();
                $uuids = explode('-', $uuids);
                $sql = beginTransction() == true ? 'Se hizo' : 'No se hizo';
                $uuid = generateRandomToken();

                /*
                PARA STATUS DE LA NOTICIA
                0-> Editada
                1->Enviada A revision
                2->Regresada por error
                3->Publicada


                `setNotiInfo_sp` (in `opc` int,
                  in `uuid` varchar(155),
                  in `uuid_2` varchar(155),
                  in `description` varchar(155),
				  in `text` mediumtext ,
                  in `status` int,
                  in `date` date,
                  in `publication_date` date,
                  in `title` varchar(155), 
                  in `archive` mediumblob)



                
                 `updateNotiInfo_sp` (in `opc` int,
                 in `uuid` varchar(155),
                 in `uuid_2` varchar(155),
                 in `description` varchar(155),
				in `text` mediumtext ,
                in `status` int,
                in `date` date,
                in `publication_date` date,
                in `title` varchar(155), 
                in `archive` mediumblob)

                */
                if (isset($fields['id'])) { //Que si es true significa update de lo contrario se inserta 
                    $sql = "CALL updateNotiInfo_sp(0,'{$fields['id']}',NULL,NULL,'{$fields['editor']}',NULL,'{$fields['date']}',NULL,'{$fields['title']}',NULL);";
                    
                    $isUpdated = execQuery($sql);
                    
                    if (is_numeric($isUpdated)) {
                        
                        if(strlen($fields['archivos_delete'])>0){
                            $archivos_delete=explode(",",$fields['archivos_delete']);
                            foreach($archivos_delete as $uuid_archivos){
                                $uuid_archivos=intval($uuid_archivos);
                                
                                $sql ="CALL updateNotiInfo_sp(3,'{$fields['id']}',NULL,NULL,NULL,{$uuid_archivos},NULL,NULL,NULL,NULL);" ;
                                $isDelete=execQuery($sql);
                                
                                if(!is_numeric($isDelete)){
                                    $result['error'][]='Error al eliminar un archivo';
                                    $result['success']=false;
                                    rollback();
                                    echo json_encode($result);
                                    exit;
                                }
                            }

                        }
                        if(strlen($fields['sections_delete'])>0){
                            $sections_delete=explode(",",$fields['sections_delete']);
                            foreach($sections_delete as $uuid_sections){
                                $sql="CALL updateNotiInfo_sp(1,'{$fields['id']}','{$uuid_sections}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                                $isDelete=execQuery($sql);
                               
                                if(!is_numeric($isDelete)){
                                    $result['error'][]='Error a eliminar una seccion de la noticia';
                                    $result['success']=false;
                                    rollback();
                                    echo json_encode($result);
                                    exit;
                                }
                            }
                        }

                        if(strlen($fields['keywords_delete'])>0){
                            $keywords_delete=explode(",",$fields['keywords_delete']);
                            foreach($keywords_delete as $uuid_keywords){
                                $sql="CALL updateNotiInfo_sp(2,'{$fields['id']}','{$uuid_keywords}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                                $isDelete=execQuery($sql);
                                if(!is_numeric($isDelete)){
                                    $result['error'][]='Error al eliminar una palabra clave de la noticia';
                                    $result['success']=false;
                                    rollback();
                                    echo json_encode($result);
                                    exit;
                                }
                            }
                        }
                        /*

                        AL MOMENTO DE ESCOGER CUAL SE ELIMINAN Y CUAL NO SE APOYA DEL BACKEND
                        AL MOMENTO DE MOSTRAR LAS SECCIONES SE CARGAN EN DOS LAS QUE SE CARGAN
                        DE LA BD Y LAS QUE ESCOGEN EL USUARIO Y ASI SE PUEDE DIFERENCIAR CUALES
                        SON NUEVAS Y CUALES NO. 

                        */ 
                        $sectiones = explode(",", $fields['sectiones']);
                        if(strlen($sectiones[0])>0){
                            foreach ($sectiones as $seccion) {
                                
                                $sql = "CALL setNotiInfo_sp(2,'{$fields['id']}','{$seccion}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                                $isInsert = execQuery($sql);
                                if ($isInsert == 0) {
                                    $result['error'][] = 'No se puede ingresar la seccion ' . $seccion . ' en la noticia';
                                    $result['success'] = false;
                                    echo json_encode($result);
                                    rollback();
                                    exit;
                                }
                            }
                        }
                        $keywords=explode(",",$fields['keywords']);
                        if(strlen($keywords[0]>0)){
                            foreach($keywords as $keyword){
                                $sql="CALL setNotiInfo_sp(1,'{$fields['id']}','{$keyword}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                                $isInsert=execQuery($sql);
                                //echo $isInsert;
                                if($isInsert==0){
                                    $result['error'][]='No se puede ingresar la palabra clave :'.$keyword.'en la noticia';
                                    $result['success']=false;
                                    echo json_encode($result);
                                    rollback();
                                    exit;
                                }
                            }
                        }
                        $archivos = isset($fields[0])==true?$fields[0]:0;
                        $numero_archivo = 1;
                        if($archivos!=0){
                            foreach ($archivos as $archivo) {
                                $archivo_objetivo = fopen($archivo['tmp_name'], 'r');
                                $contenido = fread($archivo_objetivo, $archivo['size']);
                                $contenido = addslashes($contenido);
                                fclose($archivo_objetivo);
                                $type = getImageType($archivo['type']);
                                if ($type != 'error_type') {
                                    $sql = "CALL setNotiInfo_sp(3,'{$fields['id']}',NULL,'{$type}',NULL,NULL,NULL,NULL,'{$archivo['name']}','{$contenido}');";
                                    $isInsertArchive = execQuery($sql);
                                    if ($isInsertArchive == 0) {
                                        $result['error'][] = 'No se pudo ingresar el archivo: ' . $archivo['name'];
                                        $result['success'] = false;
                                        echo json_encode($result);
                                        rollback();
                                        exit;
                                    }
                                }
                                $numero_archivo++;
                            }
                        }
                        if($result['success']==true){
                            commit();
                            echo json_encode($result);
                            exit;
                        }
                        else{
                            rollback();
                            echo json_encode($result);
                            exit;
                        }
                    }
                    else{
                        rollback();
                        $result['success']=false;
                        $result['error'][]='';
                        echo json_encode($result);
                        exit;
                    }
                } else {
                    $sql = "CALL setNotiInfo_sp (0,'{$uuid}','{$uuids[1]}',NULL,'{$fields['editor']}',0,'{$fields['date']}',NULL,'{$fields['title']}',NULL);";
                    $isInsert = execQuery($sql);
                    if ($isInsert > 0) {
                        $archivos = $fields[0];
                        $numero_archivo = 1;
                        foreach ($archivos as $archivo) {
                            $archivo_objetivo = fopen($archivo['tmp_name'], 'r');
                            $contenido = fread($archivo_objetivo, $archivo['size']);
                            $contenido = addslashes($contenido);
                            fclose($archivo_objetivo);
                            $type = getImageType($archivo['type']);
                            if ($type != 'error_type') {
                                $sql = "CALL setNotiInfo_sp(3,'{$uuid}',NULL,'{$type}',NULL,NULL,NULL,NULL,'{$archivo['name']}','{$contenido}');";
                                $isInsertArchive = execQuery($sql);
                                if ($isInsertArchive == 0) {
                                    $result['error'][] = 'No se pudo ingresar el archivo: ' . $archivo['name'];
                                    $result['success'] = false;
                                    rollback();
                                    exit;
                                }
                            }
                            $numero_archivo++;
                        }
                        $sectiones = explode(',', $fields['sectiones']);
                        foreach ($sectiones as $seccion) {
                            $sql = "CALL setNotiInfo_sp(2,'{$uuid}','{$seccion}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                            $isInsert = execQuery($sql);
                            if ($isInsert == 0) {
                                $result['error'][] = 'No se puede ingresar la seccion ' . $seccion . ' en la noticia';
                                $result['success'] = false;
                                echo json_encode($result);
                                rollback();
                                exit;
                            }
                        
                        }
                        $keywords=explode(",",$fields['keywords']);
                        foreach($keywords as $keyword){
                            $sql="CALL setNotiInfo_sp(1,'{$uuid}','{$keyword}',NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
                            $isInsert=execQuery($sql);
                            
                            if($isInsert==0){
                                $result['error'][]='No se puede ingresar la palabra clave: '.$keyword.' en la noticia';
                                $result['success']=false;
                                echo json_encode($result);
                                rollback();
                                exit;
                            }
                        }
                        if ($result['success'] == true) {
                            commit();

                            //ESTO SE VA QUITAR PARA DESPUES DEL SEGUNDO AVANCE
                            $uuid = encode($uuid);
                            $result['info'][] = $uuid;
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
                        echo json_encode($result);
                        rollback();
                        exit;
                    }
                }
            } else {
                echo json_encode($result);
                exit;
            }
        } else {
            $result['error'][] = 'No se obtuvo ningun archivo,recargue la pagina e intente de nuevo';
            $result['success'] = false;
            echo json_encode($result);
            exit;
        }
    } else {
        $result['logged'] = false;
        echo json_encode($result);
        exit;
    }
} catch (Exception $e) {
    $result['error'][] = $e->getMessage();
    $result['success'] = false;
    echo json_encode($result);
    rollback();
    exit;
}

function validations($title, $editor, $sectiones,$keywords, $archivos)
{
    $result = array('error' => array());
    if (strlen($title) <= 0) {
        $result['error'][] = 'Debe incluir un titulo';
    }
    if (strlen($editor) <= 0) {
        $result['error'][] = 'Debe Tener texto el editor';
    }
    if (strlen($sectiones) <= 0) {
        $result['error'][] = 'Debe tener seleccionada minimo una seccion';
    }
    if(strlen($keywords)<=0){
        $result['error'][]='Debe tener seleccionado minimo una palabra clave';
    }
    foreach ($archivos as $archivo) {
        $image_type = getImageType($archivo['type']);
        $image_size = $archivo['size'];
        if ($image_type == 'error_type') {
            $result['error'][] = 'El Archivo ' . $archivo['name'] . ' es de un formato incorrecto';
        } else {
            if ($image_size >= 16000000) {
                $result['error'][] = 'El archivo ' . $archivo['name'] . ' es demasiado grande maximo 16Mb';
            }
        }
        //$image_type=getImageType($archivo)
    }
    if (count($result['error']) == 0) {
        $result['success'] = true;
        return $result;
    } else {
        $result['success'] = false;
        return $result;
    }
}

function validationsWithOutArchivos($title, $editor){
    $result = array('error' => array());
    if (strlen($title) <= 0) {
        $result['error'][] = 'Debe incluir un titulo';
    }
    if (strlen($editor) <= 0) {
        $result['error'][] = 'Debe Tener texto el editor';
    }
    if (count($result['error']) == 0) {
        $result['success'] = true;
        return $result;
    } else {
        $result['success'] = false;
        return $result;
    }
}
