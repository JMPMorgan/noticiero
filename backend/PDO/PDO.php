<?php 
/*ESTO FUE PROGRAMADO PARA HACER LA CONEXION DE LA BASE DE DATOS MAS SENCILLA
Solo lo ingresas a tu programa con require_once(*RUTA DONDE ESTE EL ARCHIVO *) 
y listo mandas llamadar las funciones que gusten y ya
-SelectQuery como su nombre lo indica es para hacer un select y retorna informacion requerida o false si hubo un error
-execQuery es para ejecutar cualquier comando de MySql como un UPDATE o un DELETE retorna el numero de filas afectas en int.*/ 


class DBConnect{
    public $DB=null;
    public function __construct()
    {
        /*
        aqui es donde pondremos la informacion de la conexion a base de datos se va hacer
        en $server va la direccion donde esta alojada la base de datos,
        en $db ira el nombre de la base de datos,
        en $user el usuario con el que se planea acceder,
        en $pass si ese usuario requiere de alguna contraseña
        */ 
        try{
            $server='localhost';
            $db='bd_noticiero';
            $user='root';
            $pass='';
            $this->DB = new PDO("mysql:host=$server; dbname=$db",$user,$pass);
        }
        catch(Exception $e){
            echo $e->getMessage();
            exit;
        }
    }
}

$this_DB = new DBConnect();


function selectQuery($sql){
    global $this_DB;
    $data=$this_DB->DB->query($sql);
    return $data->fetchAll(PDO::FETCH_ASSOC);
    //PDO::FETCH_ASSOC nos sirve para retornar la informacion en formato de array en lugar de un Objeto tipo PDO
}

function execQuery($sql){
    global $this_DB;
    return $this_DB->DB->exec($sql);
}


?>