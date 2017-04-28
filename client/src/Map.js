var $ = require("jquery");
module.exports = class Map {

	constructor()	{
		var leaflet = require("leaflet");
		var map = leaflet.map("map").setView([49.76425, 6.64039], 13);

		leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap",
			maxZoom: 17
		}).addTo(map);

		$.getJSON("http://localhost:8080/tracks/2", function (data) {
			var trackLayer = leaflet.geoJSON(data);
			trackLayer.addTo(map);

			map.fitBounds(trackLayer.getBounds(), { padding: [25, 25] });
		});
	}

};

