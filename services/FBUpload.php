<?php

require 'fbsdk/facebook.php';

$facebook = new Facebook(array(
                           'appId'  => '145439352170764',
                           'secret' => '27cfc1e11bdb9e63f9479edd91cf5599',
                          'fileUpload' => true, 
                           'cookie' => true,));

$facebook->setFileUploadSupport(true);  

$b64	=	$_POST['data'];
$clean	=	substr($b64, 22);
$clean = str_replace(' ','+',$clean);
file_put_contents('tmp.png', base64_decode($clean));

echo ($clean);

$FILE_PATH='tmp.png';
$args = array('message' => $_POST['message']);
$args['image'] = '@' . realpath($FILE_PATH);

$data = $facebook->api('/me/photos', 'post', $args);

?>