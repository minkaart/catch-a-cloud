<?php 
require('vendor/autoload.php');
//get environment variables for AWS 
$s3 = Aws\S3\S3Client::factory();
$bucket = getenv('S3_BUCKET')?: die('No "S3 Bucket" config var found in env!');
$s3->registerStreamWrapper();
	

	$img = $_POST['img']; //holds image data from POST variable

	//fixes base64 encoding for image data
	$img = str_replace('data:image/png;base64,','',$img);
	$img = str_replace(' ', '+', $img);
	
	//decodes base64 data for saving to server as .png
	$data = base64_decode($img);

	//creates file to hold image data at appropriate location
	$img_name = 'images/'.uniqid().'.png';
	
	//puts image data into created file
	try {$success = $s3->upload($bucket, $img_name, $data, "public-read"); }
		catch(Exception $e) {
			echo "error uploading image file";
		}

	//creates JSON formatting for image file name
	$text = $_POST['text'];
	$text = str_replace('"',"&quot;", $text);
	$img_JSON = '{"'.$img_name.'":"'.$text.'",';

	//gets json string from server and adds json formatted text the string
	$json_str = file_get_contents('s3://'.$bucket.'/image_JSON.json');
	$json_str = substr($json_str, 1);
	$all_img = $img_JSON.$json_str; 

	//writes image name and text to file as JSON
	$json_handle = fopen('s3://'.$bucket.'/image_JSON.json', 'wb');
	fwrite($json_handle, $all_img);
	fclose($json_handle);
	
	//success check
	print $success ? $file : 'Unable to save the file.';

	unset($_POST);

?>