var projmercator = new OpenLayers.Projection("EPSG:900913");
var proj4326 = new OpenLayers.Projection("EPSG:4326");
var map;
var osm;
var vlu;
var earth_radius = 6371.11;           // in km


Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "js/geoext2/src/GeoExt",
        //Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
    }
});

Ext.require([
	'Ext.tab.*',
	'Ext.menu.*',
    'Ext.container.Viewport',
    'Ext.state.Manager',
    'Ext.state.CookieProvider',
    'Ext.window.MessageBox',
    'GeoExt.panel.Map',
    'Ext.layout.container.Border',
    'Ext.data.*',
    'Ext.form.*',
    'Ext.button.*',
    'Ext.grid.*',
    'GeoExt.slider.Tip',
    'GeoExt.slider.LayerOpacity'
]);
var geoToolMenu;


Ext.application({
    name: 'HelloGeoExt2',
    launch: function() {
		
		geoToolMenu = Ext.create('Ext.menu.Menu', {
            id: 'geoToolMenu',
	        items: [
	            {
                    text: 'Coordonnées du centre de la carte',
                    handler: function(){
                        getCenterMapLoc();
                    }
            	},
            	{
                    text: 'Chercher ma position',
                    handler: function(){
                        getUserLocation();
                    }
            	}
	        ]
        });
		
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
            expires: new Date(new Date().getTime()+(1000*60*60*24*7)) //7 days from now
        }));

        map = new OpenLayers.Map({
        	   allOverlays: false,
		       projection: projmercator,
		       displayProjection: proj4326,
		       numZoomLevels: 19,
		       maxResolution: 156543.0339,
		       
		       maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508,20037508.34)
        });
        
        //map.addControl(new OpenLayers.Control.LayerSwitcher({roundedCorner:true}));
        map.addControl( new OpenLayers.Control.PanZoomBar());
        map.addControl( new OpenLayers.Control.OverviewMap());
        map.addControl( new OpenLayers.Control.KeyboardDefaults());
  		
        osm = new OpenLayers.Layer.OSM("Open Street Map");
        vlu = new OpenLayers.Layer.Vector("VLU");
        vlu.id = "VLU";

        mappanel = Ext.create('GeoExt.panel.Map', {
            title: '<a href="index.html">Accueil</a> > OD69 - Géomatique',
            map: map,
            center: [4.8289,45.7593],
            zoom: 3,
            stateful: true,
            stateId: 'mappanel',
            region:'center',
            layers:[osm,vlu],
            dockedItems: [
    			{
	                xtype: 'toolbar',
	                dock: 'top',
	                items: [
	                	{
		                    text: 'Outils',
		                    menu: geoToolMenu
	                	},'-',
	                	{
	                		text: 'Gestion des données géographiques',
		                    handler: function(){
		                        showLayerManagePopup();
		                    }
	                	}
	                ]
	            }
            ]
        });


		Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                mappanel,
                {
                	contentEl:'menuDiv',
                	region:'west',
                	width:'400',
                	collapsible:true,
                	collapseMode:'mini',
                	split:true,
                	title:'Collection de données'
                }
            ]
        });
		
		
    }
});