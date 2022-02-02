<?php
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
	return str_replace(array(";","`","'",'"'),'',$str);
}

function removeCharForSpaces($str){
	return str_replace(array(";","`","'",'"',' '),'',$str);
}

?>