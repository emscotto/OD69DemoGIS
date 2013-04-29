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
	   if(mapLayers[i].name != 'Open Street Map'){
	   		layerArr.push(mapLayers[i]);
	   }
	}
	for (i = 0; i < layerArr.length; i++)
	{
		map.removeLayer(layerArr[i]);
	}
}
