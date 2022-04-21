<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$isSessionCorrect=isSessionCorrect();
$path_image='../assets/img/profile_pics/';
$result=array('info'=>array());
if($isSessionCorrect==true){
$fields['id']=removeEspecialChar(decode($fields['id']));
$sql="CALL usersSP(9,'{$fields['id']}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);";
//$sql="SELECT * FROM `users` WHERE `user_uuid`='{$fields['id']}'; ";
$rows=selectQuery($sql);
if(!empty($rows)){
    $result['info'][]=$rows[0]['user_name'];
    $result['info'][]=$rows[0]['user_email'];
    $result['info'][]=encode($rows[0]['user_uuid']);
    $result['info'][]=$path_image.$rows[0]['user_profilepic'];
    $result['info'][]=$rows[0]['user_nick'];
    $result['info'][]=$rows[0]['user_lastname'];
    $result['success']=true;
    echo json_encode($result);
    exit;
}
else{
    $result['success']=false;
    $result['error'][]='No se pudo encontrar el usuario solicitado';
    echo json_encode($result);
    exit;
}
}
else{
$result['success']=false;
$result['error'][]='La sesion ha caducado';
echo json_encode($result);
exit;
}
?>