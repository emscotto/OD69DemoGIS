var jsFiles = new Array();
jsFiles = [
   "Utilities.js",
   "WMSGL.js",
   "velov.js"
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
var geolocate;

Ext.onReady(function(){
	document.getElementById('menuDiv').style.display = 'block';
	
	//var layerSwitcher = map.getControlsByClass("OpenLayers.Control.LayerSwitcher")[0];
  	//layerSwitcher.baseLbl.firstChild.data = "Fond cartographique";
  	//layerSwitcher.dataLbl.firstChild.data = "Données Géographiques";
  	
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
    $(function() {
		$( "#mLayersSortable" ).sortable({
	        axis:           'y',
	        cursor:         'move',
	        update: function(event, ui){
	            reorderMapLayers();
	        }
	    });
	});
    
    // Geolocalisation
    geolocate = new OpenLayers.Control.Geolocate({
	    bind: false,
	    geolocationOptions: {
	        enableHighAccuracy: true,
	        maximumAge: 0,
	        timeout: 7000
	    }
	});
    map.addControl(geolocate);
    geolocate.events.register("locationupdated",geolocate,function(e) {
    	geoLocCoords = e.point.x+"|"+e.point.y
	});
	geolocate.events.register("locationfailed",this,function() {
	    geoLocMsg = "Impossible de vous localiser";
	});
	geolocate.events.register("locationuncapable",this,function() {
	    geoLocMsg = "Votre navigateur ne supporte pas la géolocalisation";
	});
	
	//geolocate.watch = true;
	geolocate.activate();
	
});
