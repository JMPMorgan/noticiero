<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
session_start();
$session_id=session_id();
$result=array('info'=>array());
if(isset($session_id)){
    if(isset($_SESSION['uuid_session'])){
        $uuid_session=$_SESSION['uuid_session'];
        if(strcmp($session_id,$uuid_session)==0){
            $uuids=explode('-',$uuid_session);
            $uuid_user=$uuids[1];
            $sql="SELECT * FROM `users` WHERE `user_uuid`='{$uuid_user}';";
            $rows=selectQuery($sql);
            if(!empty($rows)){
                $result['info'][]=$rows[0]['user_name'];
                $result['info'][]=$rows[0]['user_lastname'];
                $result['info'][]=$rows[0]['user_email'];
                $path_image='../assets/img/profile_pics/'.$rows[0]['user_profilepic'];
                $result['info'][]=$path_image;
                $result['info'][]=$rows[0]['user_nick'];
                $i=encode($rows[0]['user_uuid']);
                $result['info'][]=$i;
                $result['success']=true;
            }
            else{
                $result['success']=false;
            }
            echo json_encode($result);
            exit;
        }
    }
}
$result['success']=false;
echo json_encode($result);
exit;
?>
