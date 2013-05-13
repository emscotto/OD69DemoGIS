<?php
$velovAPIconStrg = "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=88846a056dc2d0ad23b83f811a64847f5e06fd38";
$jsonStrg = file_get_contents($velovAPIconStrg,0,null,null);


echo $jsonStrg;

?>