var wsmGLUri = "http://ogc.data.grandlyon.com/gdlyon/?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities";
var format = new OpenLayers.Format.WMSCapabilities({});
var cCodesArr;
var capalist;
var wmsStore;
var wmsCombo;
var wmsGLButton;
var wmsGLWin;
var wmsGlListView 

Ext.onReady(function(){
	wmsStore = new Ext.data.ArrayStore({
	   autoDestroy: true,
	   storeId: 'wmsDataStore',
	   fields: ['wms_name_layer', 'wms_label', 'wms_llbbox', 'wms_abstract', 'wms_srs', 'wms_url']
	});
	
	wmsGLButton = new Ext.Button({
      	text: 'Chargement...',
        split: false,
        width:300,
        height:36,
        iconCls:'wmsGLIconButton',
        iconAlign: 'left',
        renderTo:'wmsGL',
        scale:'large',
        disabled:true,
      handler : function() {
        showGLPopup();
      } 
    });
    
    wmsGlListView = Ext.create('Ext.grid.Panel', {
        width:500,
        height:250,
        collapsible:false,
        title:'Données géographiques : ',
        store: wmsStore,
        multiSelect: false,
        columns: [
        	{
	            text: 'Dénomination',
	            dataIndex: 'wms_label',
	            flex: 50
	        },
	        {
	            text: 'Nom technique',
	            flex: 50,
	            dataIndex: 'wms_name_layer'
	        },{
	            text: 'Résumé',
	            flex: 50,
	            dataIndex: 'wms_abstract'
	        }
        ],
        listeners:{
        	select: function(dv, record, index, eOpts){
				showWMSGLLayer(record);
        	}
        }
    });
    
	// Loading WMS GL Capabilities
	getWMSGLCapabilities();
});

function getWMSGLCapabilities(){		
	$.ajax({
       url: "phpFunctions/GetWmsGlLayers.php",
       type : 'GET',
       data: { wmsUrl: wsmGLUri },
       cache: false,
       success: function (data) {
       	
           var capabilities = format.read(data);
           var capability = capabilities.capability;
           cCodesArr = new Array();
           for (var i = 0, len = capability.layers.length; i < len; i++) {
               if ("name" in capability.layers[i]) {
                   var pCode = new Array();
                   var url = getObjElementFromArr(capabilities.service, 'href');
                   if (url[url.length - 1] == "?")
                   {
                       url = url.substring(0, url.length - 1);
                   }
                   pCode.push(capability.layers[i].name);
                   pCode.push(capability.layers[i].title);
                   pCode.push(capability.layers[i].llbbox);
                   pCode.push(capability.layers[i].abstract);
                   pCode.push(capability.layers[i].srs);
                   pCode.push(url);
                   cCodesArr.push(pCode);
               }
           }
		   wmsStore.loadData(cCodesArr,false);
		   
		   wmsGLButton.setText('Catalogue Grand Lyon');
		   wmsGLButton.setDisabled(false);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           
       }
   });

}

function showGLPopup(){
	if (!wmsGLWin) {
		wmsGLWin = Ext.widget('window', {
            title: 'Catalogue Grand Lyon',
            closeAction: 'hide',
            width: 500,
            height: 400,
            layout: 'fit',
            resizable: true,
            modal: false,
            items: wmsGlListView
        });
	}
	var wmsGLWinTitle = 'Données géographiques disponibles : ' + wmsStore.getCount();
	wmsGlListView.setTitle(wmsGLWinTitle);
	wmsGLWin.show();
}

function showWMSGLLayer(record){
	var wmsName = record.get('wms_label');
	var wmsUrl = record.get('wms_url');
	var wmsLayer = record.get('wms_name_layer')
	var newWMS = new OpenLayers.Layer.WMS(
       wmsName,
       wmsUrl,
       { 	layers: wmsLayer, 
       		format: 'image/png', 
       		srs: 'EPSG:900913',
       		transparent: true 
       },
       {
           isBaseLayer: false,
           techname: wmsLayer
       }
   	);
   	
   	map.addLayer(newWMS);
   	var wmsBoundsArr = record.get('wms_llbbox').toString().split(",");
	map.zoomToExtent(new OpenLayers.Bounds(wmsBoundsArr[0],wmsBoundsArr[1], wmsBoundsArr[2], wmsBoundsArr[3]).transform(proj4326,projmercator));
	wmsGLWin.close();
	getLayerManageContent();
}
