<?php 
require('vendor/autoload.php');
//$connector = PhpConsole\Connector::getInstance();
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();

$data = array('total' => 0, 'first_30' => "", 'more' => false, 'error' => "error: ");

try {
	$image_json = file_get_contents('s3://'.$bucket.'/image_JSON.json');
} catch(Exception $e){
	$data[error] = $data[error].$e;
	}

$images = json_decode($image_json, true);
$data[total] = count($images); 


if ($data[total] > 30) {
	if($_GET['start']){
		$length = $_GET['start'] * 30; 
		$data[error] = $data[error]."assessed length is ".$length;
	} else {
		$data[error] = $data[error]."error getting start_val does not exist";
	}
	
	$images = array_slice($images, 0, $length);
	$data[first_30] = json_encode($images);
	if($length < $data[total]){
		$data[error] = $data[error]." | length less than total, setting more to true";
		$data[more] = true;
	}
	else {
		$data[error] = $data[error]." | length more than total, setting more to false";
		$data[more] = false;
	}
} 
else {
	$data[first_30] = $image_json;
	$data[more] = false;
}

$data = json_encode($data);
echo $data;

?>