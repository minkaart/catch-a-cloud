<?php
require('vendor/autoload.php');
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();

$dir = $bucket."/images/";

$image_list = scandir($dir);
//$filtered_image_list = array_filter($image_list, "validfile");
$img_number = count($image_list);

echo $img_number;

function validfile($var) {
	if ($var[0] != '.') {
		return true;
	}
}

?>