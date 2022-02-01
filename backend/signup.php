<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
//var_dump($fields);
if(!empty($fields)){
 $uuid=generateRandomToken();
 //echo 'prueba'. $uuid;
 $password=encode($fields['password']);
 echo $password;
 $password=decode($password);
 echo 'El valor des'.$password;
}
?>