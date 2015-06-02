<?php 
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();


$json_str = file_get_contents('s3://'.$bucket.'/image_JSON.json');

echo $json_str;

?>