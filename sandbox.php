<?php 
/** script that saves image data sent from jQuery AJAX to UPLOAD_DIR 
AJAX POST DATA = 
	$.ajax({
			type : "POST", 
			contentType: "application/x-www-form-urlencoded",
			url: "sandbox.php", <-- references php script
			data: {img : imageData}, <-- JSON object

NOTE: Possibly hold more data about the image such as associated text. 
$.ajax({
			type : "POST",
			contentType: "application/x-www-form-urlencoded",
			url: "sandbox.php",
			data: {img : imageData,
					text : something,
					location: something etc....},
**/
	
	define('UPLOAD_DIR', 'images/'); //sets UPLOAD_DIR to images/ folder
	
	$my_log = "logfile.txt"; //php logfile 
	$my_var = print_r($_POST); //creates readable version of html POST
	fwrite($my_log, $my_var); //writes POST data to logfile
	$img = $_POST['img']; //holds image data from POST variable

	//fixes base64 encoding for image data
	$img = str_replace('data:image/png;base64,','',$img);
	$img = str_replace(' ', '+', $img);
	
	//decodes base64 data for saving to server as .png
	$data = base64_decode($img);

	//creates file to hold image data at appropriate location
	$file = UPLOAD_DIR . uniqid() . '.png';

	//puts image data into created file
	$success = file_put_contents($file, $data);

	//success check
	print $success ? $file : 'Unable to save the file.';

?>