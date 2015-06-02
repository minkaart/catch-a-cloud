<?php 
require('vendor/autoload.php');
$s3 = Aws\S3\S3Client::factory(
	//'aws_access_key_id' = ANOTHER_AWS_ACCESS_KEY_ID
	//'aws_secret_access_key' = ANOTHER_AWS_SECRET_ACCESS_KEY
	);
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();


/**$s3Client = S3Client::factory(array(
    'credentials' => array(
        'key'    => 'YOUR_AWS_ACCESS_KEY_ID',
        'secret' => 'YOUR_AWS_SECRET_ACCESS_KEY',
    )
));
**/

try {
	$json_str = file_get_contents('s3://'.$bucket.'/image_JSON.json');
} catch(Exception $e){
	
}


echo $json_str;
//print $json_str; 

?>