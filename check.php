<?php
require('vendor/autoload.php');
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();

$dir = $bucket."/images";

try {
	$image_list = scandir($dir);	
} catch (Exception $e) {
	echo "not a directory".$e;
}

if($image_list){
	$img_number = count($image_list);
}
else {
	$img_number = -1; 
}

echo $img_number;

?>