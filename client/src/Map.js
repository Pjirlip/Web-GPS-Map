/**
 * webGPSmap
 * Webentwicklung Hausarbeit Gruppenarbeit Gruppe 1
 *
 * Webclient
 *
 * Created by Dominik Wirtz & Philipp Dippel
 */
let $ = require("jquery");
module.exports = class Map {

	constructor()	{
		/**
		 *Create Map, bind to "map" Div and add TitleLayer
		 */
		this.leaflet = require("leaflet");
		this.map = this.leaflet.map("map").setView([49.76425, 6.64039], 13);
		this.trackLayerGroup = new this.leaflet.LayerGroup();
		let osmMap = this.leaflet.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(this.map);
		let OpenStreetMapDE = this.leaflet.tileLayer("http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png", {
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});
		let OpenTopoMap = this.leaflet.tileLayer("http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
			maxZoom: 17,
			attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		});
		let MtbMap = this.leaflet.tileLayer("http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &amp; USGS'
		});
		let EsriWorldImagery = this.leaflet.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
			attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
		});

		var baseLayers = {
			"OSM Mapnik": osmMap,
			"OSM DE": OpenStreetMapDE,
			"Open Topo Map": OpenTopoMap,
			"MTB Map": MtbMap,
			"Esri World Imagery": EsriWorldImagery
		};

		this.leaflet.control.layers(baseLayers).addTo(this.map);
	}

    /**
	 * Add track to map for selected list entry.
     */
	showTrackOnMap(trackURL) {
		$.getJSON(trackURL, (data) => {
			this.trackLayerGroup.clearLayers();
			let trackLayer = this.leaflet.geoJSON(data, { attribution: "Track" });
			this.trackLayerGroup.addLayer(trackLayer);
			this.map.flyToBounds(trackLayer.getBounds(), { padding: [25, 25], duration: 0.7 });
			this.trackLayerGroup.addTo(this.map);
			$("#trackName").text(data.features[0].properties.name);
		});
	}
};

