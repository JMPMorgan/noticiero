<?php
    $fields=(empty($_GET)?$_POST:$_GET);
    $result=array('success'=>array());
    session_start();
    $session_id=session_id();
    unset($_SESSION['uuid_session']);
    unset($session_id);
    session_destroy();
    session_unset();
    $session_status= session_status();
    if($session_status==1){
        $result['success']=true;
        
    }
    else{
        $result['success']=false;
    }
    echo json_encode($result);
    exit;
?>