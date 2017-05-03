let $ = require("jquery");
module.exports = class Map {

	constructor()	{
		let leaflet = require("leaflet");
		let map = leaflet.map("map").setView([49.76425, 6.64039], 13);

		leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap",
			maxZoom: 17
		}).addTo(map);

		function showTrackOnMap(trackURL) {
			$.getJSON(trackURL, function (data) {
				let trackLayer = leaflet.geoJSON(data);
				trackLayer.addTo(map);
				map.fitBounds(trackLayer.getBounds(), { padding: [25, 25] });
			});
		}
	}

};

