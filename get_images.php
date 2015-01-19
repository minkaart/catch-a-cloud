<?php

$dir = "images/";
$image_log = "imagelogfile.txt";
//$image_list = array_diff(scandir($dir), array('.','..'));
$image_list = scandir($dir);
$image_json = json_encode($image_list);
//fwrite($image_log, $image_json);
echo json_encode($image_list);

?>