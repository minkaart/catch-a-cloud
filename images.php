<?php

function saveimage() {
	define('UPLOAD_DIR', 'images/'); //sets UPLOAD_DIR to images/ folder
	
	
	$my_var = print_r($_POST); //creates readable version of html POST
	$my_JSON = 'image_JSON.json';

	$img = $_POST['img']; //holds image data from POST variable

	//fixes base64 encoding for image data
	$img = str_replace('data:image/png;base64,','',$img);
	$img = str_replace(' ', '+', $img);
	
	//decodes base64 data for saving to server as .png
	$data = base64_decode($img);

	//creates file to hold image data at appropriate location
	$img_name = uniqid().'.png';
	$file = UPLOAD_DIR . $img_name;

	//puts image data into created file
	$success = file_put_contents($file, $data);

	//writes image name and text to file as JSON
	$text = $_POST['text'];
	$text = str_replace('"',"&quot;", $text);
	$img_arr = [$img_name => $text];
	$img_JSON = ',"'.$img_name.'":"'.$text.'"}';

	
	$json_str = file_get_contents('image_JSON.json');
	
	$json_str = substr($json_str, 0, -1);
	
	$all_img = $json_str.$img_JSON; 


	$json_handle = fopen($my_JSON, 'wb');
	fwrite($json_handle, $all_img);
	fclose($json_handle);
	

	

	//success check
	print $success ? $file : 'Unable to save the file.';
}

function check() {
	$dir = "images/";
	$image_log = "imagelogfile.txt";

	$image_list = scandir($dir);
	$filtered_image_list = array_filter($image_list, "validfile");
	$img_number = count($filtered_image_list);

	echo $img_number;

	function validfile($var) {
		if ($var[0] != '.') {
			return true;
		}
	}
}

function get_images() {
	$dir = "images/";
	$image_log = "imagelogfile.txt";
	//$image_list = array_diff(scandir($dir), array('.','..'));
	$image_list = scandir($dir);
	$image_json = json_encode($image_list);
	//fwrite($image_log, $image_json);
	echo json_encode($image_list);
}

?>