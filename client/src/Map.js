let $ = require("jquery");
module.exports = class Map {

	constructor() {
		this.leaflet = require("leaflet");
		this.map = this.leaflet.map("map").setView([49.76425, 6.64039], 13);

		this.leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap",
			maxZoom: 17
		}).addTo(this.map);
	}
	showTrackOnMap(trackURL) {
		$.getJSON(trackURL, function (data) {
			console.log(this.leaflet);
			let trackLayer = this.leaflet.geoJSON(data);
			trackLayer.addTo(this.map);
			this.map.fitBounds(trackLayer.getBounds(), { padding: [25, 25] });
		});
	}

};

