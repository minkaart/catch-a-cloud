<?php 
	/**if (is_writable($filename)) {
		echo "the file is writeable";
	} else {
		echo "the file is not write-able";
	}**/
	define('UPLOAD_DIR', 'images/');
	$my_log = UPLOAD_DIR . "logfile.txt";
	$my_var = print_r($_POST);
	fwrite($my_log, $my_var);
	$img = $_POST['img'];
	$img = str_replace('data:image/png;base64,','',$img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = UPLOAD_DIR . uniqid() . '.png';
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';

	/**if(isset($GLOBALS["HTTP_RAW_POST_DATA"])){
		echo "vars received!";
		$imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
		$filteredData = substr($imageData, strpos($imageData, ",")+1);
		echo "variable formatted";
		$unencodedData=base64_decode($filteredData);
		$fp=fopen('test.txt','w') or die ("Can't open images/test.png");
		echo $fp "opened!";
		fwrite($fp, $unencodedData);
		fclose($fp);
	}**/
?>