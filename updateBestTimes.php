<?php
$winningTime = $_POST['winningTime'];
$moves = $_POST['moves'];

$filePath = 'bestTimes.txt';
$file = fopen($filePath, 'a');
fwrite($file, $winningTime . ', ' . $moves . "\n");
fclose($file);
?>
