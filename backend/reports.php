<?php
require_once('../backend/PDO/PDO.php');
require_once('../backend/Auxiliar/auxiliarMethods.php');
$fields=(empty($_GET)?$_POST:$_GET);
$result=array('info'=>array());
try{
    if(isset($fields['id'])){
        switch ($fields['id']) {
            case 1:{
                #Se selecciona reportes con secciones
                if(!empty($fields['secciones'])){
                    $array_secciones=count($fields['secciones']);
                    for($i=0;$i<$array_secciones;$i++){
                        $sql="CALL reportsAdmi(2,NULL,NULL,'{$fields['secciones'][$i]}',NULL);";
                        $isInsert=execQuery($sql);
                        if($isInsert<=0){
                            $result['success']=false;
                            $result['error'][]='No se pudo obtener una seccion';
                            exit;
                        }
                    }
                    $sql="CALL reportsAdmi(0,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                    $rows=selectQuery($sql);
                    $sql="CALL reportsAdmi(4,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                    $rows2=selectQuery($sql);
                    $sql="CALL reportsAdmi(6,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                    $rows3=selectQuery($sql);
                        $result['success']=true;
                        $result['info']['reporte_detalles']=$rows;
                        $result['info']['reporte_comun']=$rows2;
                        $result['info']['reporte_secciones']=$rows3;
                        echo json_encode($result);
                        exit;
                    
                }else{
                    $result['success']=false;
                    $result['error'][]='Las secciones estan vacios';
                    echo json_encode($result);
                    exit;
                }
            }break;
            case 2:{

                #Se selecciona reportes sin secciones
                $sql="CALL reportsAdmi(1,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                $rows=selectQuery($sql);
                $sql="CALL reportsAdmi(3,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                $rows2=selectQuery($sql);
                $sql="CALL reportsAdmi(5,'{$fields['start_date']}','{$fields['end_date']}',NULL,NULL);";
                $rows3=selectQuery($sql);
                    $result['success']=true;
                    $result['info']['reporte_detalles']=$rows;
                    $result['info']['reporte_comun']=$rows2;
                    $result['info']['reporte_secciones']=$rows3;
                    echo json_encode($result);
                    exit;
            }break;
            default:{
                $result['success']=false;
                $result['error'][]='No se encontro ninguna seleccion para esto';
                echo json_encode($result);
                exit;
            }
                break;
        }
    }
}catch(Exception $e){
    $result['success']=false;
    $result['error'][]=$e->getMessage();
    echo json_encode($result);
    exit;   
}


?>