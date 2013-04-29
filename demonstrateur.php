<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>OD69 GIS - Démonstrateur</title>
        <meta name="description" content="">
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.3.min.js"><\/script>')</script>
        <link rel="stylesheet" href="css/main.css">
        <!-- GeoExt/ExtJS/Openlawyers -->
        <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-4.1.0-gpl/resources/css/ext-all.css" />
	    <link rel="stylesheet" type="text/css" href="http://cdn.sencha.io/ext-4.1.0-gpl/examples/shared/example.css" />
	    <script type="text/javascript" charset="utf-8" src="http://cdn.sencha.io/ext-4.1.0-gpl/ext-dev.js"></script>
	    <script src="http://openlayers.org/api/2.12-rc3/OpenLayers.js"></script>
	    <script type="text/javascript" src="js/vendor/geoExtLoader.js"></script>
	    <script type="text/javascript" src="js/OD69Sys/OD69Bootstrap.js"></script>
    </head>
    <body>
    	<!-- Loader -->
    	<div id="loaderDiv" style="width:400px; height:200px; margin:0 auto;color:#000000;font-weight:bold;font-size:14px;background:#ffffff;text-align:center;border-width: 1px; border-style: solid; border-color: #109CED; margin-top:100px;">
	       <br />OpenData69 Demonstrateur<br/>Chargement...<br /><img src="img/loading.gif">
	    </div>
		<!-- Menu chunk -->
		<div id='menuDiv' style="width:300px;visibility:visible;">
			<div id='wmsGL'></div>
			<div id='wmsGL2'></div>
		</div>		
    </body>
</html>
