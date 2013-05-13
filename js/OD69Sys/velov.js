var velovStore;
var catalogVelovButton;
var velovListView;
var jsonVelovWin;
var velovInfoPopup;
var velovStyleMap = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
        fillOpacity: 1,
        cursor: "pointer",
        pointRadius: 8,
        externalGraphic: 'img/velo.png'
    }),
    "select": new OpenLayers.Style({
        fillOpacity: 1,
        cursor: "pointer",
        pointRadius: 8,
        externalGraphic: 'img/velo.png'
    })
});
var VelovVectorLayer = new OpenLayers.Layer.Vector("Stations Velo\'v",
       {
           styleMap: velovStyleMap
       });
var VelovSelectControl = new OpenLayers.Control.SelectFeature(VelovVectorLayer, {
        onSelect: displayVStationInfo,
    });
var velovTabInfoChk = '<div id="vInfoCont">'
	velovTabInfoChk += '<div id="vInfoNumName">{0}</div>';
	velovTabInfoChk += '<div id="vInfoStatus"><img src="img/{1}" title="{2}" alt="{2}"/><br/>{2}</div>';
	velovTabInfoChk += '<div id="vInfoAddress">{3}</div>';
	velovTabInfoChk += '<div id="vInfoMaj"> le {4}</div>';
	velovTabInfoChk += '<div id="vInfoPosition"> Position : <a href="#" onclick="goToVelov(\'{5}\',\'{6}\');"><img src="img/location.png"/></a> Latitude: {5} | Longitude: {6}</div>';
	velovTabInfoChk += '<div id="vInfoCash">{12} <img src="img/{7}" title="{8}" alt="{8}"/></div>';
	velovTabInfoChk += '<div id="vInfoCapa"><img src="img/capa.png" title="Capacité totale" alt="Capacité totale"/> : {9}</div>';
	velovTabInfoChk += '<div id="vInfoVDisp"><img src="img/vdisp.png" title="Vélo disponibles" alt="Vélo disponibles"/> : {10}</div>';
	velovTabInfoChk += '<div id="vInfoRake"><img src="img/rake.png" title="Points d\'attache disponibles" alt="Points d\'attache disponibles"/> : {11}</div>';
	velovTabInfoChk += '<div id="vInfoDistance">{13}</div>';
	velovTabInfoChk += '</div>';   


Ext.onReady(function(){

	velovStore = new Ext.data.ArrayStore({
	   autoDestroy: true,
	   storeId: 'velovDataStore',
	   fields: ['distance','number', 'name', 'address', 'position', 'banking', 'bonus', 'status', 'bike_stands', 'available_bike_stands', 'available_bikes', 'last_update'],
	   listeners: {
        	datachanged: function(dv, eOpts){
        		var velovWinTitle = 'Nombre de stations : ' + dv.getCount();
				velovListView.setTitle(velovWinTitle);
				showVelovLayer(dv);
        	}
        }
	});

	catalogVelovButton = new Ext.Button({
      	text: 'Etat du service Vélo\'v',
        split: false,
        width:300,
        height:36,
        iconCls:'velovIconButton',
        iconAlign: 'left',
        renderTo:'cataVelov',
        scale:'large',
        disabled:false,
      handler : function() {
        showVelovPopup();
      } 
    });

    velovListView = Ext.create('Ext.grid.Panel', {
        width:500,
        height:250,
        collapsible:false,
        title:'Nombre de stations : chargement...',
        store: velovStore,
        multiSelect: false,
        columns: [
    		{
	            text: 'Distance en km',
	            width:90,
	            dataIndex: 'distance',
	            sortable : true
	       	},
        	{
	            text: '# Station',
	            dataIndex: 'number',
	            width:60
	        },
	        {
	            text: 'Adresse',
	            dataIndex: 'address'
	        },{
	            text: 'Terminal',
	            dataIndex: 'banking',
	            width:60,
	            renderer : function(val) {
		                        if (val) {
		                            return '<center><img src="img/visa.png" title="Terminal de paiement" alt="Terminal de paiement"/></center>';
		                        } else if (!val) {
		                            return '<center><img src="img/novisa.png" title="Terminal hors service" alt="Terminal hors service"/></center>';
		                        }
		                        return val;
		                    }
	        },
	        {
	            text: 'Bonus',
	            dataIndex: 'bonus',
	            width:40,
	            renderer : function(val) {
		                        if (val) {
		                            return '<center><img src="img/bonus.png" title="Station bonus!" alt="Station bonus!"/></center>';
		                        } else if (!val) {
		                            return '<center><img src="img/trsp.png" title="" alt=""/></center>';
		                        }
		                        return val;
		                    }
	        },
	        {
	            text: 'Statut',
	            dataIndex: 'status',
	            width:50,
	            renderer : function(val) {
		                        if (val == "OPEN") {
		                            return '<center><img src="img/accept.png" /></center>';
		                        } else if (val == "CLOSED") {
		                            return '<center><img src="img/exclamation.png" /></center>';
		                        }
		                        return val;
		                    }
	        },{
	            text: 'Stat. dispo.',
	            dataIndex: 'available_bike_stands',
	            width:65,
	            renderer : function(val) {
		                        if (val > 0) {
		                            return '<span style="color:green;font-weight:bold;">' + val + '</span>';
		                        } else if (val == 0) {
		                            return '<span style="color:red;font-weight:bold;">' + val + '</span>';
		                        }
		                        return val;
		                    }
	        },{
	            text: 'Vélo\'v dispo.',
	            dataIndex: 'available_bikes',
	            width:70,
	            renderer : function(val) {
		                        if (val > 0) {
		                            return '<span style="color:green;font-weight:bold;">' + val + '</span>';
		                        } else if (val == 0) {
		                            return '<span style="color:red;font-weight:bold;">' + val + '</span>';
		                        }
		                        return val;
		                    }
	        },{
	            text: 'Mis à jour',
	            dataIndex: 'last_update',
	            width:110,
	            renderer : function(val) {
		                        var dMaJ = new Date(val);
		                        var dd = dMaJ.getDate();
		                        if(dd<10)dd='0'+dd;
		                        var mm=dMaJ.getMonth()+1;
								if(mm<10)mm='0'+mm;
								var hh=dMaJ.getHours();
								if(hh<10)hh='0'+hh;
								var m=dMaJ.getMinutes();
								if(m<10)m='0'+m;
		                        var maj = dd+"/"+mm+"/"+dMaJ.getFullYear()+" à "+hh+":"+m;
		                        return maj;
		                    }
	        }
        ],
        listeners:{
        	select: function(dv, record, index, eOpts){
				displayVStationInfo(record,"grid");
        	}
        }
    });

});

function getVelovStationList(){
	velovListView.setTitle('Nombre de stations : chargement...');	
	$.ajax({
       url: "phpFunctions/GetVelovStationList.php",
       type : 'GET',
       cache: false,
       success: function (data) {
       	   var objVelovSrv = eval('(' + data + ')');
       	   for(var item in objVelovSrv){
       	   		if(geoLocMsg == "" && geoLocCoords != ""){
			    	var vStation = new OpenLayers.Geometry.Point(objVelovSrv[item].position.lng, objVelovSrv[item].position.lat);
			        var gUser = new OpenLayers.Geometry.Point(geoLocCoords.split("|")[0], geoLocCoords.split("|")[1]).transform(projmercator,proj4326);  
			        var dst = calculateDistBet2Pts(vStation,gUser);
			        objVelovSrv[item]["distance"] = dst;
			    }else{
			    	objVelovSrv[item]["distance"] = '-';
			    } 
       	   }
		   velovStore.loadData(objVelovSrv,false);
		   velovStore.sort('distance', 'ASC');
		   catalogVelovButton.setText('Etat du service Vélo\'v');
		   catalogVelovButton.setDisabled(false);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           
       }
   });
}

function showVelovPopup(){
	if (!jsonVelovWin) {
		jsonVelovWin = Ext.widget('window', {
            title: 'Etat du service Velo\'v',
            closeAction: 'hide',
            width: 680,
            height: 400,
            layout: 'fit',
            resizable: false,
            modal: false,
            items: velovListView,
	        listeners:{
	        	show: function(dv, eOpts){
					getVelovStationList();
	        	}
	        }
        });
	}
	if(typeof velovInfoPopup !== "undefined"){
		velovInfoPopup.hide();
	}
	
	jsonVelovWin.show();
}

function showVelovLayer(arrStore){
	map.addControl(VelovSelectControl);
    VelovSelectControl.activate();
    map.addLayer(VelovVectorLayer);
    
    for (var i = 0; i < arrStore.data.items.length; i++) {
        var dataStore = arrStore.getAt(i).data;
        var cX = dataStore.position.lng;
        var cY = dataStore.position.lat;
        var infoArray = {};
        for(var item in dataStore){
        	infoArray[item] = dataStore[item];
        }
        var stationMarker = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(cX, cY).transform(proj4326,projmercator),
                    infoArray
                );
       	VelovVectorLayer.addFeatures(stationMarker);
    }
    map.zoomToExtent(VelovVectorLayer.getDataExtent());
    getLayerManageContent();
}

function displayVStationInfo(feature,s){
	var infObj;
	if(s != "grid"){
		infObj = feature.attributes;
	}
	else if(s == "grid"){
		infObj = feature.data;
	}
	
	if (!velovInfoPopup) {
		velovInfoPopup = Ext.widget('window', {
            title: 'Etat du service Velo\'v',
            closeAction: 'hide',
            contentEl: 'layerVelovInfo',
            width: 600,
            height: 400,
            layout: 'fit',
            resizable: false,
            modal: false,
            items: new Ext.TabPanel({
		        	renderTo: 'velovInfo-tabs',
			        width: 450,
			        activeTab: 0,
			        defaults :{
			            bodyPadding: 10
			        },
			        items: [{
			            contentEl:'infoVelov', 
			            title: 'Etat du service'
			        },{
			            contentEl:'predicVelov', 
			            title: 'Statistiques d\'utilisation'
			        }]
		    }),
		    listeners: {
		        beforerender: function(){
            		document.getElementById('layerVelovInfo').style.display = 'block';
            	},
            	beforehide: function(){
            		VelovSelectControl.unselectAll();
            	}
		    }
		});
	}
	jsonVelovWin.hide();
	velovInfoPopup.setTitle("Station #"+infObj.number+" | "+infObj.name);
	velovInfoPopup.show();
	
	var statusPng = "accept.png";
	var statusAlt = "En service";
	if(infObj.status == "CLOSED"){
		statusPng = "exclamation.png";
		statusAlt = "Hors service";
	}
	var addr = infObj.address;
	if(addr == ""){
		addr = "Adresse non définie";
	}
	
	var dMaJ = new Date(infObj.last_update);
    var dd = dMaJ.getDate();
    if(dd<10)dd='0'+dd;
    var mm=dMaJ.getMonth()+1;
	if(mm<10)mm='0'+mm;
	var hh=dMaJ.getHours();
	if(hh<10)hh='0'+hh;
	var m=dMaJ.getMinutes();
	if(m<10)m='0'+m;
	var dfMaJ = dd+"/"+mm+"/"+dMaJ.getFullYear()+" à "+hh+":"+m;
	
	var paiePng = "visa.png";
	var paieAlt = "Terminal de paiement";
	if(!infObj.banking){
		paiePng = "novisa.png";
		paieAlt = "Terminal hors service";
	}
	
	var bOpt = "";
	if(infObj.bonus){
		bOpt = '<img src="img/bonus.png" title="Station bonus!" alt="Station bonus!"/>';
	}
	
    geolocate.activate();
    var distBetStatAndYou = "";
    if(geoLocMsg == "" && geoLocCoords != ""){
    	var vStation = new OpenLayers.Geometry.Point(infObj.position.lng, infObj.position.lat);
        var gUser = new OpenLayers.Geometry.Point(geoLocCoords.split("|")[0], geoLocCoords.split("|")[1]).transform(projmercator,proj4326);  
        var calDist = calculateDistBet2Pts(vStation,gUser);
        distBetStatAndYou = "La distance entre la station #"+infObj.number+" et vous est de "+ calDist + " km";
    }else{
    	distBetStatAndYou = geoLocMsg;
    }

	var formatedVelovInfoChk = Ext.String.format(velovTabInfoChk, "Station #"+infObj.number+" | "+infObj.name,statusPng,statusAlt,addr,dfMaJ,infObj.position.lat,infObj.position.lng,paiePng,paieAlt,infObj.bike_stands,infObj.available_bikes,infObj.available_bike_stands,bOpt,distBetStatAndYou);
	document.getElementById('infoVelov').innerHTML = formatedVelovInfoChk;
}

function goToVelov(lat,lng){
	map.setCenter(new OpenLayers.LonLat(lng, lat).transform(proj4326,projmercator), 18);
}
