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
	if($_POST['start_val']){
		$length = $_POST['start_val'] * 30; 
		$data[error] = $data[error]."assessed length is ".$length;
	} else {
		$data[error] = $data[error]."error getting start val".$_POST('start_val');
	}
	
	$images = array_slice($images, 0, $length);
	$data[first_30] = json_encode($images);
	if($length < count($images)){
		$data[more] = true;
	}
	else {
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