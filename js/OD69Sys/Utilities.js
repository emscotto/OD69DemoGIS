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
	for (i = 0; i < mapLayers.length; i++)
	{
	   if(mapLayers[i].name != 'Open Street Map'){
	   		console.log('>>> ' + mapLayers[i].name);
	   		//mapLayers[i].destroy();
	   }
	} 
}
