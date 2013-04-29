var jsFiles = new Array();
jsFiles = [
   "WMSGL.js",
   "Utilities.js"
];

var scriptTags = new Array(jsFiles.length);
var scripts = document.getElementsByTagName('script');
var path = scripts[scripts.length - 1].src.split('?')[0];
var host = path.split('/').slice(0, -1).join('/') + '/';
for (var i = 0, len = jsFiles.length; i < len; i++) {
   scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>";
}


if (scriptTags.length > 0) {
       document.write(scriptTags.join(""));
}

Ext.onReady(function(){
	//To do: switch off loader
	
	
	var layerSwitcher = map.getControlsByClass("OpenLayers.Control.LayerSwitcher")[0];
  	layerSwitcher.baseLbl.firstChild.data = "Fond cartographique"
  	layerSwitcher.dataLbl.firstChild.data = "Données Géographiques"
});
