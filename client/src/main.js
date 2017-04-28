/**
 * Created by Philipp on 28.04.17.
 */

let $ = require("jquery");
require("./client");
let leaflet = require("leaflet");

let map = leaflet.map("map").setView([49.76425, 6.64039], 13);

leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
	attribution: "© OpenStreetMap",
	maxZoom: 17
}).addTo(map);


/*
$.getJSON("http://localhost:8080/tracks/1", function (data)
{
    leaflet.geoJSON(data.features[0]).addTo(map);
});*/
