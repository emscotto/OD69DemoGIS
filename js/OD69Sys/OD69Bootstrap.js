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
	document.getElementById('menuDiv').style.display = 'block';
	
	var layerSwitcher = map.getControlsByClass("OpenLayers.Control.LayerSwitcher")[0];
  	layerSwitcher.baseLbl.firstChild.data = "Fond cartographique";
  	layerSwitcher.dataLbl.firstChild.data = "Données Géographiques";
  	
  	// Layer Management
  	var mapLayers = map.layers;
	var osmSlider = Ext.create('GeoExt.slider.LayerOpacity', {
            layer: mapLayers[0],
            aggressive: true, 
            width: 200,
            isFormField: false,
            inverse: false,
            renderTo: "layerSlider",
            plugins: Ext.create("GeoExt.slider.Tip", {
                getText: function(thumb) {
                    return Ext.String.format('Opacité: {0}%', thumb.value);
                }
            })
    	});
});
