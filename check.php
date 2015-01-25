<?php

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

?>