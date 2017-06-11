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
		this.leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap",
			maxZoom: 17
		}).addTo(this.map);
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

