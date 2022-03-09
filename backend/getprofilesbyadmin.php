<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$result=array('info'=>array());
if($isSessionCorrect==true){
$fields['uuid']=decode($fields['uuid']);
var_dump($fields);
}
else{
$result['success']=false;
$result['error'][]='La sesion ha caducado';
echo json_encode($result);
exit;
}
?>