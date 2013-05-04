var wmsLayOpWin;

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
    // you can also use substr instead of substring
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
	   if(mapLayers[i].name != 'Open Street Map'){
	   		layerArr.push(mapLayers[i]);
	   }
	}
	for (i = 0; i < layerArr.length; i++)
	{
		map.removeLayer(layerArr[i]);
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
            title: 'Gestion des données géographiques',
            closeAction: 'hide',
            width: 415,
            height: 300,
            layout: 'fit',
            resizable: false,
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
	var htmlChunk = "<div id='fndCarto'><div class='layerTitle' id='layerTitle-{0}'>{1}</div><div><div id='layerSlider-{2}' style='float:left;'></div><div id='layerFlush' style='float:right;'><a href='#' onclick='deleteSelectedLayer(\"{3}\");'><img src='img/trash.png' style='margin-bottom:10px;'/></a></div></div></div>";
	for (i = 1; i < mapLayers.length; i++)
	{
	   var layerName = truncateAdd3Dots(mapLayers[i].name,75);
	   var layerId = mapLayers[i].id;
	   var layerObj = mapLayers[i];
	   list += htmlChunk.format(layerId,layerName,layerId,layerId);
	   
	   
	}
	document.getElementById('datCarto').innerHTML = list;
	
	for (i = 1; i < mapLayers.length; i++)
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
