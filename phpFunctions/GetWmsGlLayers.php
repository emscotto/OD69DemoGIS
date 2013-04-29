<?php
$uri = $_GET["wmsUrl"];

$xml = simplexml_load_file($uri);
$strg = $xml->asXML();
echo $strg;

?>