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
	}

$data[first_30] = $image_json; //works! 

$image_json = stripslashes($image_json);
$images = json_decode($image_json);
//$data[error] = "error: ".$images;
$data[total] = count($images); 





/*if count($images) > 30 {
	$data[total] = count($images);
	//$length = $_POST['start_val'] * 30; 
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
	$data[total] = count($images);
	$data[first_30] = $image_json;
	$data[more] = false;
}*/

$data = json_encode($data);
echo $data;

?>