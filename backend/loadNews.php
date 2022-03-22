<?php
/*
ESTO CARGA LAS NOTICIAS EN news-reporters.html
*/
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
try{
    if ($isSessionCorrect == true) {

        $uuids = explode('-', session_id());
        //se obtiene un array de la session id que almacena el id de la sesion y el id al usuario que pertenece
        $sql = "SELECT `news_title`,DATE_FORMAT(`news_creation`,'%d/%c/%Y') as `news_creation`,`news_active`,`uuid_news`,`news_status`,`news_date` FROM `news` WHERE `uuid_userC`='{$uuids[1]}';";
        $rows = selectQuery($sql);
        if (!empty($rows)) {
            foreach($rows as $noticia){
                array_push($result['info'], $noticia);
            }
            $result['success'] = true;
        } else {
            $result['success'] = false;
            $result['error'][] = 'No se consiguio ninguna noticia para este usuario';
        }
    }else {
        $result['success'] = false;
        $result['error'][] = 'No se consiguio la session cargue la pagina e intente de nuevo';
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