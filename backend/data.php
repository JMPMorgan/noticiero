<?php
    /*
    ESTO SIRVE PARA CARGAR LA INFORMACION AL MOMENTO DE INICIAR SESION CON ALGUNO DE LOS USUARIOS INRGESADOS
    */
    require_once('../backend/PDO/PDO.php');
    $fields=(empty($_GET)?$_POST:$_GET);
    session_start();
    $session_id=session_id();
    if(isset($session_id)){
        if(isset($_SESSION['uuid_session'])){
        $uuid_session=$_SESSION['uuid_session'];
            if(strcmp($session_id,$uuid_session)==0){
                $uuids=explode('-',$uuid_session);
                $uuid_user=$uuids[1];
                $sql="SELECT * FROM `users_info` WHERE `user_uuid`='{$uuid_user}';";
                $rows=selectQuery($sql);
                $result=array('info'=>array());
                if(!empty($rows)){
                    $result['info'][]=$rows[0]['user_name'];
                    $result['info'][]=$rows[0]['user_profilepic'];
                    $result['info'][]=$rows[0]['user_lastname'];
                    $result['info'][]=$rows[0]['user_nick'];
                    $result['success']=true;
                }
                else{
                    $result['success']=false;
                }
                echo json_encode($result);
                exit;
            }
            else{
                $result=array('success'=>array());
                $result['success']=false;
                echo json_encode($result);
                exit;
            }
        }
        else{
            $result=array('success'=>array());
            $result['success']=false;
            echo json_encode($result);
            exit;
        }
    }
?>