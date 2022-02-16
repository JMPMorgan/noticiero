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
                    $pp='../assets/img/profile_pics/'.$rows[0]['user_profilepic'];
                    $result['info'][]=$pp;
                    $result['info'][]=$rows[0]['user_lastname'];
                    $result['info'][]=$rows[0]['user_nick'];
                    $result['success']=true;
                   /* if($rows[0]['user_type']==2){
                        $result['info'][]=$rows[0]['user_name'];
                        $pp='assets/img/profile_pics/'.$rows[0]['user_profilepic'];
                        $result['info'][]=$pp;
                        $result['info'][]=$rows[0]['user_lastname'];
                        $result['info'][]=$rows[0]['user_nick'];
                        $result['success']=true;
                    }*/
                    /*
                    ESTE IF SE HACE PARA MANDAR CODIGO HTML PARA MOSTRAR INFORMACION ADICIONAL
                    EN EL DROPDOWN MENU
                    */
                    if($rows[0]['user_type']==1){//Este tipo de usuario es para los editores
                        $html="<a class='dropdown-list rounded border btn btn-outline-primary' id='btn-yournews' onclick='showMyNews()'>
                                Your News</a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-notification' onclick='showNotificationsReporters()'>
                                Notifications</a>";
                        $js="<script>
                                const showMyNews=()=>{
                                    window.location='news-reporter.html';
                                }
                                const showNotificationsReporters=()=>{
                                    window.location='notifications-reporters.html';
                                }
                            </script>";
                            $html.=$js;
                        $result['info'][]=$html;
                    }
                    else if($rows[0]['user_type']==0){//Este tipo de usuario es para el administrador
                        $html="<a class='dropdown-list rounded border btn btn-outline-primary' id='btn-reports' onclick='showReports()'>
                                Reports</a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-notification' onclick='showNotifications()'>
                                Notifications <span class='badge badge-primary badge-pill' style='color: #007bff;'>.</span></a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-reporters' onclick='myReporters()'>
                                Your Reporters</a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-sections' onclick='showSections()'>
                                Sectiones</a>";
                        $js="<script>
                                    const showReports=()=>{
                                        window.location='reports.html';
                                    }
                                    const myReporters=()=>{
                                        window.location='reporters.html';
                                    }
                                    const showSections=()=>{
                                        window.location='sections.html';
                                    }
                                    const showNotifications=()=>{
                                        window.location='notifications.html';
                                    }
                             </script>";
                             $html.=$js;
                        $result['info'][]=$html;

                    }
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