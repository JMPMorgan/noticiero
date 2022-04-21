<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('sections'=>array(),'keywords'=>array());

if($isSessionCorrect==true){
    $sql="CALL sections(5,NULL,NULL,NULL,NULL);";
    //$sql="SELECT `uuid_sections`,`section_name`,`sections_color`,`sections_status` FROM `sections` WHERE `sections_active`=1;";
    $rows=selectQuery($sql);
    $sections=array();
    array_push($result['sections'],$rows);
    $sql="CALL keywords(1,NULL,NULL);";
    //$sql="SELECT `uuid_keywords`,`word_keywords` FROM `keywords` WHERE `status_keywords`=1;";
    $rows=selectQuery($sql);
    $keywords=array();
    array_push($result['keywords'],$rows);
    echo json_encode($result);
    exit;   
}
?>