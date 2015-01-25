<?php

$dir = "images/";
$image_log = "imagelogfile.txt";


//$image_list = array_diff(scandir($dir), array('.','..'));
$image_list = scandir($dir);
$img_number = count($image_list);

$log_handle = fopen($image_log, "w");
//fwrite($log_handle, $image_list);
fclose($log_handle);


//$image_json = json_encode($image_list);
//fwrite($image_log, $image_json);
echo $img_number;

?>