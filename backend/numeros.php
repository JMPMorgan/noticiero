<?php
require_once('../backend/Auxiliar/auxiliarMethods.php');
$tres=3;
echo encode($tres);
$cuatro=4;
echo '<br>';
echo encode($cuatro);
for ($i=0; $i < 4; $i++) { 
    # code...
    echo $i;
}
?>