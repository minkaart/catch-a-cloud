<?php 
require('vendor/autoload.php');
$connector = PhpConsole\Connector::getInstance();
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();

$data = array('total' => 0, 'first_30' => "", 'more' => false, 'error' => "error: ");

try {
	$image_json = file_get_contents('s3://'.$bucket.'/image_JSON.json');
} catch(Exception $e){
	print("errror getting file contents S3");
	$data['error'] = $data['error']."S3 get content error"; 
}

$images = json_decode($image_json);
if count($images) > 30 {
	$data['total'] = count($images);
	print_r("data total: "+$data['total'];
	$length = $_POST['start_val'] * 30; 
	print_r("length: ".$length)
	$images = array_slice($images, 0, $length);
	$data['first_30'] = json_encode($images);
	if($start+30<=count($images)){
		$data['more'] = true;
	}
	else {
		$data['more'] = false;
	}
} 
else {
	$data['total'] = count($images);
	$data['first_30'] = $image_json;
	$data['more'] = false;
}

print_r("echoing $data as: ".$data);
echo json_encode($data);

?>