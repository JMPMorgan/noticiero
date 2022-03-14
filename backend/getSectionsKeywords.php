<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('sections'=>array(),'keywords'=>array());

if($isSessionCorrect==true){
    $sql="SELECT `uuid_sections`,`section_name`,`sections_color`,`sections_active` FROM `sections`;";
    $rows=selectQuery($sql);
    $sections=array();
    array_push($result['sections'],$rows);
    $sql="SELECT `uuid_keywords`,`status_keywords`,`word_keywords` FROM `keywords`;";
    $rows=selectQuery($sql);
    $keywords=array();
    array_push($result['keywords'],$rows);
    echo json_encode($result);
    exit;   
}
?>