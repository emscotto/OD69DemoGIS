var wmsLayOpWin;
var geoLocMsg = "";
var geoLocCoords = "";
var userMarker;

// Extend String to Format
String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
    }
    return content;
};

function truncateAdd3Dots(string, limit)
{
  var dots = "...";
  if(string.length > limit)
  {
    string = string.substring(0,limit) + dots;
  }
    return string;
}

function getObjElementFromArr(obj, key) {
   var ret = "";
   for (var member in obj) {
       if (key == member)
       {
           ret = obj[member];
       }
   }
   return ret;
}

function deleteAllGeoDataLayers(){
	var mapLayers = map.layers;
	var layerArr = new Array();
	for (i = 0; i < mapLayers.length; i++)
	{
	   if(mapLayers[i].name != 'Open Street Map' && mapLayers[i].name != 'VLU'){
	   		layerArr.push(mapLayers[i]);
	   }
	}
	for (i = 0; i < layerArr.length; i++)
	{
		map.removeLayer(layerArr[i]);
	}
	for (i = 0; i < vlu.features.length; i++)
	{
		vlu.removeAllFeatures();
	}
	getLayerManageContent();
}

function deleteSelectedLayer(lId){
	map.removeLayer(map.getLayer(lId));
	getLayerManageContent();	
}

function showLayerManagePopup(){
	if (!wmsLayOpWin) {
		wmsLayOpWin = Ext.widget('window', {
            title: 'Gestion des données géographiques | <a href="#" onclick="deleteAllGeoDataLayers();">Supprimer tous les éléments</a>',
            closeAction: 'hide',
            width: 460,
            height: 300,
            layout: 'fit',
            resizable: true,
            modal: false,
            autoScroll: true,
            contentEl: 'layerOpa',
            listeners:{
            	beforerender: function(){
            		document.getElementById('layerOpa').style.display = 'block';
            	},
            	show: function(){
            		//getLayerManageContent();
            	}
            }
        });
	}
	wmsLayOpWin.show();
}

function getLayerManageContent(){
	var mapLayers = map.layers;
	var list = "";
	var htmlChunk = "<li class='ui-state-default' id='{0}'><div id='fndCarto'><div class='layerTitle' id='layerTitle-{0}'>{1}</div><div><div id='layerSlider-{2}' style='float:left;'></div><div id='layerFlush'><img src='img/move.png' id='moveImg' height='16px' width='16px'/><a href='#' onclick='deleteSelectedLayer(\"{3}\");'><img src='img/trash.png' id='trashImg'/></a></div></div></div></li>";

	for (i = 1; i < mapLayers.length; i++)
	{
		if(mapLayers[i].name != "VLU")
		{
		   var layerName = truncateAdd3Dots(mapLayers[i].name,75);
		   var layerId = mapLayers[i].id;
		   var layerObj = mapLayers[i];
		   list += htmlChunk.format(layerId,layerName,layerId,layerId);
		}
	}
	document.getElementById('mLayersSortable').innerHTML = list;
	
	for (i = 1; i < mapLayers.length; i++)
	{
		if(mapLayers[i].name != "VLU")
		{
			var layerName = mapLayers[i].name;
		   	var layerId = mapLayers[i].id;
		   	var layerObj = mapLayers[i];
			
			var layerSlider = Ext.create('GeoExt.slider.LayerOpacity', {
	            layer: mapLayers[i],
	            aggressive: true, 
	            width: 200,
	            isFormField: false,
	            inverse: false,
	            renderTo: "layerSlider-"+layerId,
	            plugins: Ext.create("GeoExt.slider.Tip", {
	                getText: function(thumb) {
	                    return Ext.String.format('Opacité: {0}%', thumb.value);
	                }
	            })
	    	});
	    }
	}
	map.setLayerIndex(vlu, mapLayers.length);
}

function reorderMapLayers(){
	var sender = document.getElementById('mLayersSortable');
	var i = sender.childNodes.length;
	while(i--) {
		var layer = map.getLayer(sender.childNodes[i].id);
		map.setLayerIndex(layer, i+1);
	}
}

function getCenterMapLoc(){
	var c = GeoExt.panel.Map.guess().map.getCenter().transform(projmercator,proj4326);
    Ext.Msg.alert("Coordonnées du centre de la carte", c.toString());
}

function getUserLocation(){
	if(typeof userMarker !== "undefined"){
		userMarker.destroy();
	}
	geolocate.activate();
	var lUser = new OpenLayers.Geometry.Point(geoLocCoords.split("|")[0], geoLocCoords.split("|")[1]).transform(projmercator,proj4326);
	map.setCenter(new OpenLayers.LonLat(lUser.x, lUser.y).transform(proj4326,projmercator), 18);
	userMarker = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lUser.x, lUser.y).transform(proj4326,projmercator),
						{},
						{
					        pointRadius: 10,
					        externalGraphic: 'img/marker.png'
						}
	);
    vlu.addFeatures(userMarker);
    getLayerManageContent
}

function calculateDistBet2Pts(origin,dest){
	var dist = parseInt(origin.distanceTo(dest)*earth_radius*100)/10000;
    return Math.round(dist*100)/100;
}
