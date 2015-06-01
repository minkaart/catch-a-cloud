<?php

$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');

$dir = $bucket+"/images/";
$image_log = "imagelogfile.txt";
//$image_list = array_diff(scandir($dir), array('.','..'));
$image_list = scandir($dir);
$image_json = json_encode($image_list);
//fwrite($image_log, $image_json);
echo json_encode($image_list);

?>