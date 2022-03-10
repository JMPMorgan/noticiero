<?php
function isSessionCorrect(){
	session_start();
	$session_id=session_id();
    if(isset($session_id)){
        if(isset($_SESSION['uuid_session'])){
        $uuid_session=$_SESSION['uuid_session'];
            if(strcmp($session_id,$uuid_session)==0){
				return true;
			}
			else{
				return false;
			}
		}
	}
}

function generateRandomToken($pre = '') {
	if (function_exists('random_bytes')) {
		return $pre.bin2hex(random_bytes(16));
	}
	/* DEPRECATED
	if (function_exists('mcrypt_create_iv')) {
		return $pre.bin2hex(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM));
	}*/
	if (function_exists('openssl_random_pseudo_bytes')) {
		return $pre.bin2hex(openssl_random_pseudo_bytes(16));
	}
	return null;
}



function encode($str) {
    $secret_key = 'WS-SERVICE-KEY';
    $secret_iv = 'WS-SERVICE-VALUE';    
    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
    
    return base64_encode(openssl_encrypt($str, 'AES-256-CBC',$key, 0,$iv));
}

function decode($str) {
    $secret_key = 'WS-SERVICE-KEY';
    $secret_iv = 'WS-SERVICE-VALUE';    
    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
   
    return openssl_decrypt(base64_decode($str), 'AES-256-CBC',$key, 0, $iv);
}

function removeEspecialChar($str){
	return str_replace(array(";","`","'",'"',')','('),'',$str);
}

function removeCharForSpaces($str){
	return str_replace(array(";","`","'",'"',')','(',' '),'',$str);
}

function getImageType($str){
	if($str=='image/jpeg'){
		return '.jpeg';
	}
	else if($str=='image/jpg'){
		return '.jpg';
	}
	else if($str=='image/png'){
		return'.png';
	}
	else if($str=='image/gif'){
		return'.gif';
	}
	else{
		return 'error_type';
	}
}

function isEmail($str){
    $regex = "/^([a-zA-Z0-9\.]+@+[a-zA-Z]+(\.)+[a-zA-Z]{2,3})$/";
    return preg_match($regex, $str) ? true :false;
}

?>